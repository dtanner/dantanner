---
title: "Dynamic Grails Tomcat datasource configuration with Etcd"
date: 2015-04-30
description: "How to dynamically update a Grails datasource while the app is running."
tags:
  - grails
  - datasource
  - configuration
---

Ever wonder if you could modify a Grails datasource while the app is running?
Probably not, and that's totally fine...most people don't need to. We had a couple reasons though:

1. During a disaster recovery situation where a non-clustered database goes down, you want to point all the apps at a failover database.  By default this means you have to update the config and restart all the apps.  On a typical AWS instance, this means at least a minute of downtime for a bigger Grails app.  Not the end of the world, but not great.
1. One of our databases is a catalog of product information that can be drastically changed.  We wanted to be able to clone the catalog, apply massive data changes to it (this can take a minute or so), and then point all the apps in the cluster to this new database without downtime.  And we also want to be able to revert to the old database if something goes wrong.

#### First question - how can you change a Tomcat datasource while the app is running?

```groovy
package com.foo.util

import groovy.util.logging.Log4j
import org.apache.tomcat.jdbc.pool.ConnectionPool
import org.codehaus.groovy.grails.commons.GrailsApplication

@Log4j
class TomcatDatasourceUtil {

    static void ensureCurrentDatasources(GrailsApplication application, List datasourceNames) {
        log.debug "Ensuring datasources are current"
        datasourceNames.each { String datasourceName ->
            ConnectionPool connectionPool = application.mainContext.getBean(datasourceName).targetDataSource.targetDataSource.pool

            def dataSourceFileConfig = application.config."$datasourceName"

            // discover the properties we want to potentially change. if changed, update and purge the pool
            List propertyNames = ['url', 'username', 'password']
            if (propertyNames.any { String propertyName ->
                connectionPool.poolProperties."${propertyName}" != dataSourceFileConfig."${propertyName}"
            }) {
                connectionPool.poolProperties.url = dataSourceFileConfig.url
                connectionPool.poolProperties.username = dataSourceFileConfig.username
                connectionPool.poolProperties.password = dataSourceFileConfig.password
                connectionPool.purge()
                log.info("${datasourceName} was modified and refreshed")
            } else {
                log.info("${datasourceName} didn't change")
            }
        }
    }

}
```

Grails version 2.3 and onwards uses the [Tomcat Connection Pool](https://tomcat.apache.org/tomcat-8.0-doc/jdbc-pool.html) as its datasource provider by default.  If you're not using Grails 2.3+ yet, you're probably using the Apache Commons DBCP, and can switch by using [this plugin](http://grails.org/plugin/jdbc-pool).

Basically, you pass the `ensureCurrentDatasources` method your grailsApplication and a list of datasource names you want to inspect for changes and potentially refresh.  The datasource name(s) are typically defined in your DataSource.groovy.  e.g. If you only have one datasource, it'll be named "dataSource".  If you're using multiple datasources, they might be named "dataSource_auditing" or whatever you've specified.

The method is implemented to compare the current Tomcat connection pool values for the username, password, and url against the current Grails configuration values.  If any settings have changed, it'll update those connection pool settings and call the purge() method in the connection pool.  purge() will basically perform a graceful reset of all the connections so that they establish their next connection with the updated configuration.  I chose username, password, and url because those are the things that we might change.  There are more properties in the pool that you could possibly change, but you probably don't want to change much else, since there is some critical state being managed by some of the properties.

OK, so you know a way to dynamically update a datasource while the app is running.

#### Next question: How should I wire in this dynamic update capability?

The short answer is, whatever works best for you.  Here's the path we went down...

**The initial approach:**
Our application has the following attributes:

- It uses an inline plugin where we keep our domain classes and services.
- We use [Salt](https://saltstack.com/) to manage our external config files
- It uses the [External Config Reload](https://github.com/bluesliverx/grails-external-config-reload) plugin to allow us to dynamically update the app config when we change the config files.

With those attributes, we initially implemented a hook into the TomcatDatasourceUtil by defining the onConfigChange event in our plugin's Config.groovy, like this:
```groovy
def onConfigChange = { event ->
    TomcatDatasourceUtil.ensureCurrentDatasources(
            application,
            ['dataSource', 'dataSource_auditing'])
}
```

This worked fine, but seemed like a clunky solution.  For the catalog database update scenario, the application essentially needs to remotely communicate with salt, so that salt could remotely update all of the application's configuration files.  We keep all our salt configurations in source control, which didn't really fit the model of what we wanted to do.

#### The better approach...or at least this has been working well for us so far:
Rather than use a tool to constantly push out config file changes on the fly to our cluster of apps, we thought it would be better if we inverted the technique...i.e. have all the applications get their configuration from a central location.  This is where [etcd](https://github.com/coreos/etcd) comes in.  The summary of etcd is that it's "a distributed, consistent key value store for shared configuration and service discovery with a focus on being simple, secure, fast, and reliable."

You can run just about any groovy code in your Config.groovy and Datasource.groovy.  So rather than have the application get its datasource config info from a file, we have it load the datasource URL from etcd.  e.g. Here's a snippet from our external config file:
```groovy
import groovy.json.JsonSlurper

dataSource {
    // most properties are directly set
    pooled = true
    // ...

    // the url is retrieved from etcd...make sure the etcd resource is properly protected
    def jsonSlurper = new JsonSlurper()
    def catalogUrlConfig = jsonSlurper.parseText(new URL("http://etcdlocation:2379/v2/keys/dataSource/url").text)
    url = catalogUrlConfig.node.value
}
```

This will take care of your app getting its initial url value from etcd.  You can put whatever else in etcd that you want...for our case we only need to dynamically change the url.

#### So now how do you update the datasource for a cluster of applications?
In your application's Bootstrap.groovy init, make a call to a class like this:
```groovy
package com.foo.config

import com.foog.util.TomcatDatasourceUtil
import grails.plugins.rest.client.RestBuilder
import groovy.json.JsonSlurper

/**
 * Application service to get and set values from a centralized remote configuration service.
 */
class RemoteConfigService {
    def grailsApplication

    public static final String CATALOG_DB_URL_KEY = "dataSource/url"
    protected static final int INITIAL_RETRY_TIMEOUT_SECS = 5

    /**
     * Runs a process to watch for configuration changes to the plancatalog datasource URL.
     * If the URL value changes, call the datasource utility to update the connections to point at the new database.
     */
    void watchForChanges() {
        if (!grailsApplication.config.remoteConfig.enabled) {
            log.info "remoteConfigBaseUrl not configured - will not watch for config changes"
            return
        }
        log.debug("watching for changes")

        Thread.startDaemon {
            int secondsToWait = INITIAL_RETRY_TIMEOUT_SECS
            while (true) {
                try {
                    String url = get("${CATALOG_DB_URL_KEY}?wait=true")
                    if (url) {
                        grailsApplication.config.dataSource_plancatalog.url = url
                        TomcatDatasourceUtil.ensureCurrentDatasources(grailsApplication, ['dataSource_plancatalog'])
                    }
                    secondsToWait = INITIAL_RETRY_TIMEOUT_SECS
                } catch (Exception e) {
                    log.warn("Exception occurred while watching for config changes. Will wait ${secondsToWait} seconds and continue watching", e)
                    Thread.sleep(1000 * secondsToWait)
                    // double the length of the time to wait before retrying, up to a maximum of 30 minutes
                    secondsToWait = [60 * 30, 2 * secondsToWait].min()
                }
            }
        }
    }

    /**
     * Get the configured value for the given key
     * @param key
     * @return the current value
     */
    String get(String key) {
        def jsonSlurper = new JsonSlurper()
        def json = jsonSlurper.parseText(new URL("${grailsApplication.config.remoteConfig.baseUrl}/${key}").text)
        return json?.node?.value
    }

    /**
     * Set the given key to the given value in the centralized configuration service
     * @param key
     * @param valueArg
     */
    void set(String key, String valueArg) {
        RestBuilder rest = new RestBuilder()
        def resp = rest.put("${grailsApplication.config.remoteConfig.baseUrl}/${key}") {
            value = valueArg
        }
        if (resp.status != 200) {
            throw new Exception("Error setting configuration value for key=${key}. Response=${resp.body}")
        }
    }
}
```

This is a very basic implementation of an etcd client that can watch for changes, update the grails configuration upon change, and also allow the app to update an etcd value.  There are more robust etcd clients available, but we didn't need (at least not yet) the added dependencies and complexity.

It's pretty fun to watch once you get it all working.  Essentially this is the flow:
1. A cluster of grails applications start up, configure their datasource URL using the etcd config, and watch for changes.
2. Some time later, one of the applications clones the database, makes changes to it, and then sets the new URL value in etcd.
3. All the applications are then notified of the updated etcd value and dynamically update their datasource to point at the new URL.
4. "dataSource was modified and refreshed"!

Does this actually work?
Yup - extremely well.  I actually expected the initial implementation to be a little brittle (e.g. maybe needing a more robust etcd client), but it didn't need any changes in the 6 months I watched it in production.

