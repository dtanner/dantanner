---

title: "Spring Rites"
description: "A caution against annotation-based frameworks"
date: 2024-02-19
tags:
  - annotations
  - spring framework
  - java
  - kotlin

unlisted: true

---

<!-- TOC -->

* [Context](#context)
* [Original problems solved by the Spring Framework](#original-problems-solved-by-the-spring-framework)
  * ["Helps me configure my application"](#helps-me-configure-my-application)
  * ["Reduces application server vendor lock-in"](#reduces-application-server-vendor-lock-in)
  * ["Helps me manage my large monolithic app"](#helps-me-manage-my-large-monolithic-app)
  * ["Reduces dependency management issues"](#reduces-dependency-management-issues)
  * ["Provides a productive MVC pattern"](#provides-a-productive-mvc-pattern)
  * ["Helps me package my application more easily"](#helps-me-package-my-application-more-easily)
  * ["Helps me unit test my code more easily"](#helps-me-unit-test-my-code-more-easily)
* [Starting from scratch](#starting-from-scratch)
* [Why are people still using Spring?](#why-are-people-still-using-spring)
  * [On starting projects quickly](#on-starting-projects-quickly)
  * [On people and the sunk cost fallacy](#on-people-and-the-sunk-cost-fallacy)
* [On Micronaut](#on-micronaut)
* [On the future of the JVM](#on-the-future-of-the-jvm)

<!-- TOC -->

## Context

My current job is to help developers write better software at a large retail company. There's a few thousand of them,
so there are a lot of opinions and techniques used. Most of the business application software is written on the
JVM, and I spend a lot of my time on documentation and reference material for best practices on how to build high
quality software within our ecosystem. "High quality" meaning performant, maintainable, secure, efficient, concise,
etc...

I currently recommend building new projects on the JVM using a "vanilla" Kotlin approach. By vanilla, I mean don't use
annotation-based application frameworks like Spring or Micronaut. This concept of not using an application framework for
a Java project is foreign and unpopular to some people. Usually _foreign_ to people unfamiliar with development in other
languages, and _unpopular_ typically with people that have only ever used an application framework.

What makes my job more difficult is that I'm going against the grain of popularity. Applications built using Spring are
the most popular stack at my company (over half). So in conversations with people about this choice, I'm usually
in the situation of defending my viewpoint for this "new" technique of not using a framework, and trying to convince
people to move from a technique they're used and know works, to a new technique they usually have limited experience
with.

In this article, I'm not going to defend my viewpoint. I'm going to attack the viewpoint that using an annotation-based
framework like Spring Boot or Micronaut makes sense in 2024.
Sure, it "works", and that's the most common defense I see in forums. Carburetors also still work, but you don't see
them in modern engines.

The theme of my criticisms throughout this article are generally this:

1. **Using annotations for complex features are inherently more difficult to test, maintain, and extend compared to its
   vanilla Kotlin counterpart.**
2. **Large application frameworks like Spring are now the cumbersome things they originally displaced.**

## Original problems solved by the Spring Framework

Remember that Spring was created as a **lighter weight alternative** to the bloated, immature application servers at the
time. Think Entity Beans, vendor-driven application servers, and other garbage that got in the way. This was before
technology like Ruby on Rails, Django, JSON, Redis, Elasticsearch, NGINX, AWS, GCP, SSDs, and so many other things that
have evolved our options.

Here's the original category of features the Spring Framework advertised and delivered on in 2003:

- Helps me configure my application
- Reduces application server vendor lock-in
- Helps me manage my large monolithic app
- Reduces dependency management issues
- Provides a productive MVC pattern
- Helps me package my application more easily
- Helps me unit test my code more easily

These were new, _real problems_ **back then**.

Not today though. These features are either irrelevant today, or are actually made worse by using Spring Boot.

### "Helps me configure my application"

tl;dr; Use [hoplite](https://github.com/sksamuel/hoplite) to load your configuration into type-safe data classes.
For example, this code will load configuration from various sources in order, populating an arbitrary data class that
you define:

```kotlin
class App {
  private val config = ConfigLoaderBuilder.default()
    .addFileSource("/etc/myapp/dev.conf", optional = true)
    .addResourceSource("/default.conf")
    .build()
    .loadConfigOrThrow<Config>()

  private val db = Db(config.db)
  // etc...
}
```

Where your `Config` class might look like this:

```kotlin
data class Config(
  val http: HttpConfig,
  val metrics: MetricsPublisher.Config,
  val db: DbConfig,
)

data class HttpConfig(
  val server: HttpServerConfig,
  val client: ClientConfig,
)

// etc
```

There are a bunch more features you can use, but here's a real example of my startup logs using hoplite:

```shell
Property sources (highest to lowest priority):
  - Env Var Overrides
  - System Properties
  - /Users/dan/.userconfig.<ext>
  - $XDG_CONFIG_HOME/hoplite.<ext>
  - classpath:/local.conf
  - classpath:/default.conf
Used keys: 4
+-----------------------------------+-------------------------+---------------------------+
| Key                               | Source                  | Value                     |
+-----------------------------------+-------------------------+---------------------------+
| db.databaseName                   | classpath:/default.conf | hash(d6ffe1cc9d1f2eae...) |
| db.password                       | classpath:/default.conf | hash(8610dd6dca2c67d5...) |
| http.client.item.cache.cacheSize  | classpath:/default.conf | 100000                    |
+-----------------------------------+-------------------------+---------------------------+
Unused keys: 1
+--------------------------+-------------------------+---------------------------+
| Key                      | Source                  | Value                     |
+--------------------------+-------------------------+---------------------------+
| metrics.tags.team        | classpath:/default.conf | hash(52367a6622b19f08...) |
+--------------------------+-------------------------+---------------------------+
--End Hoplite Config Report--
```

This is out of the box functionality, and it was about 30 lines of code to configure.

Isn't it nice to see what keys have been set, what haven't been set, and in what order the configuration was loaded in
case you want to make some changes?

Also, check out that hashed `db.password` value. Imagine the scenario where your production server has started up but
can't connect to the database. Enabling the reporting feature of hoplite with SHA-256 hashing of String values shows you
a secure hash at startup of the actual value. This is safe to log because it's a one-way hash. But you, who presumably
know the actual password, can perform the same hash locally and compare the hashed value to debug your configuration.

Instead, what do you get with Spring?

**Quick**, tell me what each of these annotations mean and how they should be used when you need to configure a custom
bean
for your application:

```kotlin
@Configuration
@ConfigurationProperties(prefix = "someprefix")
@ConstructorBinding
@EnableConfigurationProperties(SomeConfig::class)
```

Did you know the correct answer, which is that you need to combine those annotations in pairs like so?:

```kotlin
@Configuration
@ConfigurationProperties(prefix = "someprefix")
data class MetricsConfig(
  val config: MetricsPublisher.Config,
)

@ConstructorBinding
@EnableConfigurationProperties(SomeConfig::class)
class Configuration(
  val metricsConfig: MetricsConfig,
)
```

Just kidding! The correct answer is a different order of the annotations.

How would you know though? And how long would it take for someone new to find the correct answer?

### "Reduces application server vendor lock-in"

If you're referring to the ability to choose the underlying server engine, this is a common feature for all major
HTTP server libraries today.
e.g. [Ktor](https://ktor.io/docs/engines.html), [http4k](https://www.http4k.org/guide/reference/servers/). (_http4k even
lets you use a Ktor engine, even though they're competitors!_)

The real lock-in is the application server or library interface. For example, you can't switch from Spring to
Micronaut without a rewrite of your HTTP handling code. To this point, Spring is just another vendor.

### "Helps me manage my large monolithic app"

I went from using Inversion of Control frameworks, to [Guice](https://github.com/google/guice) as a lighter alternative,
to what I do which is just new up each singleton in the application class. It's not problematic, and it's much easier
to reason about. Maybe someday we'll all be using [context receivers](https://www.youtube.com/watch?v=GISPalIVdQY), but
for now direct dependency injection from the main class is the simplest solution that works for me.

It's pretty similar
to [this recent post on how one person writes HTTP services in Go](https://grafana.com/blog/2024/02/09/how-i-write-http-services-in-go-after-13-years/),
which uses test-friendly techniques like functions as arguments to services.

That said, who's building large monolithic apps these days? The current standard for most web apps is smaller, more
granular apps, which means less dependencies. Most applications I write these days have a 100 line long `App` class
that loads the configuration, creates the services and routes, and starts the services from a main method. It's simply
not a real problem any longer for most situations.

### "Reduces dependency management issues"

Raise your hand if you or someone you know has a Spring application stuck using old versions because they don't have the
time to migrate it to the latest version.

Keep your hand raised if you've been flagged by security for running with a high severity vulnerability in your app, but
can't easily fix the issue because the vulnerable version is a required dependency of your application framework.

Want to know who almost never have that problem? People that don't use an application framework, and just use libraries.

The best way to do it today is [Gradle catalogs](https://docs.gradle.org/current/userguide/platforms.html) + some
automated
dependency update tool like [renovate](https://www.mend.io/renovate/)
or [dependabot](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/about-dependabot-version-updates).
For example, I use renovate at work, and my configuration looks like this:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:best-practices",
    "group:monorepos",
    "group:recommended",
    "group:allNonMajor",
    ":enablePreCommit"
  ],
  "schedule": [
    "every weekday",
    "every weekend"
  ],
  "timezone": "America/Chicago",
  "semanticCommits": "enabled",
  "dependencyDashboard": true,
  "dependencyDashboardAutoclose": false,
  "dependencyDashboardApproval": false
}
```

Each week I get an automated PR for each app that bumps all the minor versions in one PR, and creates a separate PR
for any major (potentially breaking) dependency updates.

Know what I'm not doing? I'm
not [reading the Spring Boot migration guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide).

And more on dependency management and security...do you know how many lines of third-party code is running in production
for your little Spring Boot app?

In an A/B comparison between a Spring Boot reference application and its identically-featured vanilla Kotlin equivalent,
the Spring Boot application had an average of 162 runtime dependencies (JARs) vs 61 for vanilla Kotlin. That's a 162%
increase in runtime dependencies, and represented about 2 million lines of running code for Spring Boot vs about 800k
for the Kotlin equivalent. That's a lot of potentially vulnerable code that you don't have control over.

### "Provides a productive MVC pattern"

Using [http4k](https://www.http4k.org/guide/howto/use_a_server_backend/) as an example of how hard it is today with
just about any modern library:

```kotlin
fun main() {
  val app = { request: Request -> Response(OK).body("Hello, ${request.query("name")}!") }
  val server = app.asServer(Undertow(9000)).start()
}
```

Whew! That was hard. Wait til you find out how hard it is to unit test your handlers without needing to start the
server.

### "Helps me package my application more easily"

Another thing that is trivial these days using
the [gradle application plugin](https://docs.gradle.org/current/userguide/application_plugin.html).

Here's an example of my gradle file that configures the application plugin, which will create an executable directory
structure for my application:

```kotlin
plugins {
  application
}

application {
  applicationName = "app"
  mainClass.set("com.example.api.AppKt")
}
```

Then run `./gradlew distTar` as part of the CI build process. This process is identical for any application built
these days regardless of whether you're using an application framework or not.

### "Helps me unit test my code more easily"

Spring originally made testing easier, but the shift to annotations has essentially eliminated the ability to unit test
code.

The reason is that you can't unit test a class with annotations like `@GET` or `@Transactional` in it.

Everything's an integration test when you need to spin up the framework context, which is slower and more complex than
unit testing.

Mocking and stubbing interactions is also more painful with inversion of control containers with annotations
like `@EnableAutoConfiguration`.

Developers' tasks are made more difficult when they need to master the required intricacies of their framework.

## Starting from scratch

Picture this scenario: You're a good, experienced programmer in other languages, but you're new to the JVM,
and you've been tasked to determine the stack for a new JVM application.

This application will serve up API requests using Undertow, make HTTP client calls using OkHttp, and consume messages
using Apache Kafka. It will use these libraries regardless of whether you use Spring or not.

Would you rather learn [how to use Kafka](https://kafka.apache.org/documentation/#consumerconfigs) directly,
or would you rather learn how to use Kafka
through [Spring's abstraction](https://docs.spring.io/spring-kafka/reference/kafka/receiving-messages/message-listeners.html)?

If you're not already familiar with the contents of those two links, please just click into those and briefly scan
over those pages. The tl;dr; is that Kafka is a very powerful and useful messaging tool, but there are a lot of dials
you need to turn correctly when using it.

Using the default Kafka `@KafkaListener` annotation and wondering why your consumer performance is over an order of
magnitude slower than a plain consumer?
Oh - it was committing offsets on every message? Aw shucks, guess you picked the wrong message listener interface out of
the eight possible methods.

And lost some messages because your consumer was set to autocommit? Unfortunately you now have to not only read the
Kafka
docs, but also read how that relates to Spring's abstraction over it.

This pattern is true for every library used in the application. You don't have less to understand - you have *more* to
understand!

- Spring + OkHttp
- Spring + Undertow
- Spring + Kafka
- Spring + Jackson
- Spring + OpenTelemetry
  and so on...

This also assumes Spring gives you the necessary control over the tool you need, which isn't always the case.

Does that sound appealing?

## Why are people still using Spring?

Because **Spring makes it easy to start a project**, and **most people advocating Spring don't realize that what they
consider a sunk cost is really a significant fixed cost**.

#### On starting projects quickly

Tools like the [Spring Initializr](https://start.spring.io/) and [Micronaut Launch](https://micronaut.io/launch/) make
it easier to start a project. This is a real benefit.
But just about everyone else makes starting a project easier now too. e.g.
the [Ktor Project Generator](https://start.ktor.io) and [http4k's toolbox](https://toolbox.http4k.org/).

#### On people and the sunk cost fallacy

People use annotation-based frameworks because they work. Many projects have been built using them, and people are
hesitant to change from what they know works.

As an example of what not to do, consider the frontend development landscape over the last decade. The amount of
churn and short-lived fads is embarrassing, even for our immature industry. And that debate is far from settled yet.

Some JVM developers in the backend community have settled though. I'm one of the first people to say things
like "let's make a choice to use boring technology X for Y years", but the time to continue using annotation-based
frameworks like Spring Boot has passed.

For those that have given the vanilla Kotlin approach a try, the response has been overwhelmingly positive and joyful
in my observations. They typically become strong advocates of it once they're past the fear stage.

![](/annotation/annotation-venn.svg)

The reason people using a vanilla Kotlin approach are often joyful is because they've stopped paying the framework tax.
People that have only used heavy frameworks don't know that these constant burdens can be lifted:

- Being able to reason about the application more clearly when there are no magic annotations
- Being able to more easily see and control how the application is configured
- Being able to unit test routes, services, and message processing without starting a container or application context
- Being able to reliably upgrade dependencies in a matter of seconds, not hours or days

## On Micronaut

A relatively small percentage of people are tired of Spring and have embraced Micronaut.

Unfortunately, Micronaut in my opinion is just a slightly less-bad version of Spring Boot and solves the wrong problems.

| Advertised Feature      | My viewpoint                                                                                                                                                                                                                                                                                                       |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Polyglot Framework      | This should be listed as a limitation, not an advertised feature. If you don't use an annotation-based inversion of control framework, you can use whatever language you want without limitation.                                                                                                                  |
| Natively cloud-native   | _Distributed tracing?_ Use OpenTelemetry. _Cloud runtimes?_ Use docker or any of the available hosting services. _Discovery services?_ Use your infrastructure's routing features natively.                                                                                                                        |
| Fast data-access config | Use [hoplite](https://github.com/sksamuel/hoplite), the repository pattern, and your data access library directly.                                                                                                                                                                                                 |
| Smooth learning curve   | The guide alone is a smooth 25,000+ lines for your smooth reading pleasure. Do you consider learning about Bean qualifiers and Scopes on meta annotations to be essential complexity?                                                                                                                              |
| Fast, easy unit testing | Just like [Spring Boot](#helps-me-unit-test-my-code-more-easily).                                                                                                                                                                                                                                                  |
| Aspect-oriented API     | You're gonna have to debug your application when things go wrong, yes? Are you comfortable with stack traces coming from [this](https://docs.micronaut.io/latest/guide/index.html#aop)? There are words like "simply" and "trivial" in there that are simply not.                                                  |
| Seamless API Visibility | Generated swagger specs is a nice feature and not enough people do that IMO. It's available in [lightweight tools though](https://www.http4k.org/guide/howto/create_a_swagger_ui/).                                                                                                                                |
| AOT Compilation         | Micronaut's startup time and memory footprint is much smaller than Spring's, but so is not using a framework at all. But most people don't care about a 10 second server startup time though unless you're writing functions as a service. And if memory consumption is a barrier, you probably aren't using Java. |

Micronaut suffers from most of the same problems Spring Boot has, but is less popular, and isn't a very compelling
reason for those using Spring to switch to it in my opinion.

## On the future of the JVM

Java is still widely used, but it's on the decline. Competition comes from languages like Python, Go, C#, and
JavaScript. _Especially_ Python being more approachable than any other mainstream language.

These languages don't use annotation-based inversion of control frameworks, and programmers of those languages aren't
asking for it. They view annotations as an annoying obstacle that gets in the way of onboarding and productivity.
I've polled them in their communities; this is the #1 reason they're repelled by Java.

And this bums me out. I've spent over half of my 27-year career writing for the JVM, and **I** don't want to code
in Java either. But [Kotlin is great](https://dantanner.com/post/kotlin-v-java/).
It's my favorite language on the JVM above Java, Groovy, Scala, and Clojure.
Kotlin is better in many ways than any other language for typical use cases of server application. It still carries some
of the baggage of Java's history, but it's a _really_ good language.

You can teach a Python programmer Kotlin, and they'll grow to like it more and more.
That doesn't happen with annotation-based frameworks. I think the continued use of annotation-based frameworks will
correlate with a slow decline of Java.

Also consider how tools like ChatGPT and Copilot will affect the situation.

Especially for newer programmers, these tools generate code the person may not fully understand. Languages like Python
and Go have been built an eye toward approachability, so will be readable in more situations compared to languages with
a richer syntax like Java. But have CoPilot emit a barrage of annotations? Good luck with that. These developers will
suffer, and so will your project.

It doesn't have to be like that though. Use Kotlin, ditch the annotation framework, and use a simpler method.

