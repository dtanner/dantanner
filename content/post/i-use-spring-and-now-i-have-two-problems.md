---

title: "Annotation Infestation"
description: "A caution against annotation-based frameworks"
date: 2024-01-26
tags:
  - annotations
  - spring framework
  - java
  - kotlin
draft: true

---

Alternate titles: spring rites, enterprise industrial complex

<!-- TOC -->
  * [Context](#context)
  * [Original problems solved by the Spring Framework](#original-problems-solved-by-the-spring-framework)
    * [Helps me configure my application](#helps-me-configure-my-application)
    * [Reduces application server vendor lock-in](#reduces-application-server-vendor-lock-in)
    * [Helps me manage my large monolithic app](#helps-me-manage-my-large-monolithic-app)
    * [Reduces dependency management issues](#reduces-dependency-management-issues)
    * [Provides a productive MVC pattern](#provides-a-productive-mvc-pattern)
    * [Helps me package my application more easily](#helps-me-package-my-application-more-easily)
    * [Helps me unit test my code more easily](#helps-me-unit-test-my-code-more-easily)
  * [Starting from scratch](#starting-from-scratch)
  * [Why are people still using annotation-based frameworks?](#why-are-people-still-using-annotation-based-frameworks)
  * [On Micronaut](#on-micronaut)
  * [On the future for the JVM](#on-the-future-for-the-jvm)
  * [outline](#outline)
* [one idea - bad sell](#one-idea---bad-sell)
* [The fall of XML](#the-fall-of-xml)
* [The rise of annotations](#the-rise-of-annotations)
* [email rant](#email-rant)
    * [it represents a larger threat to the long term popularity of java than many people realize](#it-represents-a-larger-threat-to-the-long-term-popularity-of-java-than-many-people-realize)
    * [qualified opinions](#qualified-opinions)
    * [IDE complexities](#ide-complexities)
* [on learning and change](#on-learning-and-change)
  * [Other notes I've taken for ideas](#other-notes-ive-taken-for-ideas)
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

In this article, I'm not going to defend my viewpoint. I'm going to attack the viewpoint that using an annotation-based framework like Spring Boot or Micronaut makes sense in 2024.
Sure, it "works", and that's the most common defense I see in forums. Carburetors also still work, but you don't see
them in modern engines.

I don't like the Spring Framework now, but I don't mean to disparage those that do.\
And for the people who like the Spring Framework now, disparage means "put down".

The theme of my criticisms throughout this article are generally this:
1. **Using annotations for complex features are inherently more difficult to test, maintain, and extend compared to its vanilla Kotlin counterpart.**
2. **Large application frameworks like Spring are now the bloated, cumbersome things they originally replaced.**

## Original problems solved by the Spring Framework

Remember that Spring was created as a **lighter weight alternative** to the bloated, immature application servers at the
time. Think Entity Beans, vendor-driven application servers, and other garbage that got in the way. This was before
technology like Ruby on Rails, Django, JSON, Redis, Elasticsearch, NGINX, AWS, GCP, SSDs, and so many other things that
have given us massive productivity boosts for a small investment.

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

### Helps me configure my application
tl;dr; Use [hoplite](https://github.com/sksamuel/hoplite) to load your configuration into type-safe data classes.
For example, this code will load configuration from various sources in order, populating a `Config` class:
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
know the actual password, can perform the same hash locally and compare the hashed values to see if what you intended to
configure is what's actually set.

Instead, what do you get with Spring?

_Quick, tell me what each of these annotations mean and how they should be used when you need to configure a custom bean
for your application:_
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


### Reduces application server vendor lock-in
If you're referring to the ability to choose the underlying server engine, this is a common feature for all major
HTTP server libraries today. e.g. [Ktor](https://ktor.io/docs/engines.html), [http4k](https://www.http4k.org/guide/reference/servers/). (_http4k even lets you use a Ktor engine, even though they're competitors!_)

The real lock-in is the application server or library interface. For example, you can't switch from Spring to
Micronaut without a rewrite of your HTTP handling code. To this point, Spring is just another vendor.


### Helps me manage my large monolithic app
I went from using Inversion of Control frameworks, to [Guice](https://github.com/google/guice) as a lighter alternative,
to what I do which is just new up each singleton in the application class. It's not problematic, and it's much easier
to reason about. Maybe someday we'll all be using [context receivers](https://www.youtube.com/watch?v=GISPalIVdQY), but
for now direct dependency injection from the main class is the simplest solution that works for me.

It's pretty similar to [this recent post on how one person writes HTTP services in Go](https://grafana.com/blog/2024/02/09/how-i-write-http-services-in-go-after-13-years/). We'll get back to that some more later.

That said, who's building large monolithic apps these days? The current standard for most web apps is smaller, more
granular apps, which means less dependencies. Most applications I write these days have a 100 line long `App` class
that loads the configuration, creates the services and routes, and starts the services from a main method. It's simply
not a real problem any longer for most situations.

### Reduces dependency management issues

Raise your hand if you or someone you know has a Spring application stuck using old versions because they don't have the time to migrate it to the latest version.

Keep your hand raised if you've been flagged by security for running with a high severity vulnerability in your app, but can't easily fix the issue because the vulnerable version is a required dependency of your application framework.

Want to know who almost never have that problem? People that don't use an application framework, and just use libraries.

The best way to do it today is [Gradle catalogs](https://docs.gradle.org/current/userguide/platforms.html) + some automated
dependency update tool like [renovate](https://www.mend.io/renovate/) or [dependabot](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/about-dependabot-version-updates).
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

Know what I'm not doing? I'm not [reading the Spring Boot migration guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide).

And more on dependency management and security...do you know how many lines of third-party code is running in production
for your little Spring Boot app?

In an A/B comparison between a Spring Boot reference application and its identically-featured vanilla Kotlin equivalent,
the Spring Boot application had an average of 162 runtime dependencies (JARs) vs 61 for vanilla Kotlin. That's a 162%
increase in runtime dependencies, and represented about 2 million lines of running code for Spring Boot vs about 800k
for the Kotlin equivalent. That's a lot of potentially vulnerable code that you don't have control over.

### Provides a productive MVC pattern

Using [http4k](https://www.http4k.org/guide/howto/use_a_server_backend/) as an example of how hard it is today with
just about any modern library:

```kotlin
fun main() {
  val app = { request: Request -> Response(OK).body("Hello, ${request.query("name")}!") }
  val server = app.asServer(Undertow(9000)).start()
}
```

Whew! That was hard. Wait til you find out how hard it is to unit test your handlers without needing to start the server.

### Helps me package my application more easily

Another thing that is trivial these days using the [gradle application plugin](https://docs.gradle.org/current/userguide/application_plugin.html).

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

### Helps me unit test my code more easily

Spring was originally created to make testing better, and the shift to rely on annotations has made testing worse.

Spring
[JUnit](https://junit.org/junit5/) has been the standard for as long as most people can remember. There are arguably even better options available today, like [kotest](https://kotest.io/), but for now let's just

reference https://chat.openai.com/c/1d63b8bd-2bbc-4344-9800-2ad12b3744fa examples

## Starting from scratch

I've thrown shade on all the original reasons people chose Spring.
Now picture this scenario: You're a good, experienced programmer in other languages, but you're new to the JVM,
and you've been tasked with determining the stack that will be used for a new, greenfield JVM application.

This application will serve up API requests using Undertow, make HTTP client calls using OkHttp, and consume messages
using Apache Kafka. It will use these libraries regardless of whether you use Spring or not.

Would you rather learn [how to use Kafka](https://kafka.apache.org/documentation/#consumerconfigs) directly,
or would you rather learn how to use Kafka
through [Spring's abstraction](https://docs.spring.io/spring-kafka/reference/kafka/receiving-messages/message-listeners.html)?
Using the default Kafka `@KafkaListener` annotation and wondering why your consumer performance is over an order of
magnitude slower than a plain consumer?
Oh - it was committing offsets on every message? Aw shucks, guess you picked the wrong message listener interface out of the eight possible methods.

And lost some messages because your consumer was set to autocommit? Dang - too bad you have to not only read the Kafka docs, but also read how that relates to Spring's abstraction over it.

This pattern is true for every library used in the application. You don't have less to understand - you have *more* to understand!
- Spring + OkHttp
- Spring + Undertow
- Spring + Kafka
- Spring + Jackson
- Spring + OpenTelemetry
and so on...

This also assumes Spring gives you the necessary control over the tool you need, which isn't always the case.

Does that sound appealing?

## Why are people still using annotation-based frameworks?

_**Because they're easy in the beginning, but hard to change.**_

The previous statement applies to frameworks _and_ people.


	- it's not as easy to get started - this is absolutely true if you're starting from scratch. two points:
		- most of my earlier points revolve around the basis that getting to version 3.0 a couple years later is the hard
			part, not the initial setup
		- there are tools that make it easier to get started with a vanilla approach. e.g.
			the [Ktor Project Generator](https://start.ktor.io) and [http4k's toolbox](https://toolbox.http4k.org/) which
			contains a project wizard and other tools to help you get started.
		- in my current company we're taking things a step further and introducing a project quickstart application that
			even lets you generate monorepos with multiple applications and selectable features based on innersource
			templates.

Add the qualified opinions note.

## On Micronaut


## On the future for the JVM

it's going to get harder and harder to recruit new developers to Java when they compare some of our popular choices
with what they've been using in school

mention the go article

mention criticisms of the JVM from other developers using languages like Python and Go











## outline


why do people pick spring today when they aren't sure what to do? because there are numerous
examples out there on how to get started with it. this is very understandable, since you don't
want to spend your time on minutia like configuration and telemetry when starting a project.
but as a project grows and becomes more complex over time, it becomes exponentially more
difficult to break free from the constraints of a framework down the road.




the annotation compile time constant constraint is awful
show example of api AppTest using wiremock that chooses a random port, and then you want to spin up the app with that
port as its config

then show the documentation of spring showing the factories and the useless junk you have to make with the docs and
what's actually happening

it's a security liability, not asset
log4j
show simple server dependency graph of spring vs http4k

configuration
it's not hard

dependency injection and testing
pure DI

Remember that Spring was created as a lighter weight alternative to the bloated, vendor-driven standards at the time.
Back then, projects succeeded DESPITE the technology available.
This was before Ruby on Rails, Django, JSON, Redis, Elasticsearch, nginx, AWS, GCP, SSDs, and so many other of the tools
and technologies that let us *easily* integrate and scale today.

# The fall of XML

verbose

# The rise of annotations

AOP was popular at the time

# email rant

what is the most touted feature of spring? the inversion of control.
what was the big selling point? it enabled you to separate concerns, and let you unit test your code. what was the
configuration language? xml
what happened to xml? it fell out of favor due to its verbosity, replaced by annotations.
but with annotations, you don't unit test your code any more....

but annotations make your code easier to reason about, like the combination of bean config annotations.

easier to debug? like trying to figure out why @transactional isn't working the way you expect.

"it works for me."
so does the cobol running in your mainframe.
this isn't an insult to cobol. it's an insult to the lethargic attitude of advanced beginners that ignore the fact that
the problems spring was origin invented to solve don't exist any more.

don't like being considered a legacy programmer? too bad; your continued support for anotation based code is repelling
experienced and new programmers of other languages upon seeing "enterprise java".
from a recent polll in my company's go and puthon channels, here's how programmers of those languagesanswered the
question "what do you strongly dislike about java?"
...

https://news.ycombinator.com/item?id=39334672
"Spring Boot uses a lot of libraries and integrates them for you to make sure they all work together."

languages with popular annotations frameworks, languages in the most loved list

fundamentals

hiring
would someone want to join if they've been slinging go/python and see some ugly code?
people that have used ktor, http4k, and spring. people that prefer annotation frameworks.

oh but micronaut fixed all that!
replace your web server's startup time from 10 seconds to a half second. congratulations. you still have all the same
problems as spring.

twice a week i hear:
tried to upgrade and it looks like vomit
get an error configuring some bean

to go along with "why can't i make my ORM do what i want it to do?" but that's a different problem

### it represents a larger threat to the long term popularity of java than many people realize

### qualified opinions

i had this idea last night trying to correlate language and tool preference along with a person's level of
qualification:
create a survey, asking people to to give a recommendation score to each tool/technique along with indicating how much
experience they have with each option. e.g. something like:
Technique Recommendation Production Experience Amount
----------          -----------------         --------------------
Spring do not use over 10 years
Micronaut do not use                < 1 month
Vanilla Kotlin Recommended 5-10 years

what are the age ranges of people that work on spring code vs other mainstream languages?

### IDE complexities

Also note that annotation processing is supported during the compilation process. However, there are some edge cases
that are quite difficult to handle when the code is compiled by IntelliJ IDEA, for example, when the annotation
processor is defined in one of the Gradle subprojects.

So, this is the point we are at right now. We’re still experimenting with Spring and Micronaut run configurations in
delegated mode and are working constantly on improving the Gradle delegation process in the IDE.

# on learning and change

- boring tech
- fundamental knowledge
- fads
- no silver bullets
- but there are genuine, improvements
- humans are resistant to change
- our industry is immature and in massive flux

## Other notes I've taken for ideas

In the early 2000's, Rod Johnson created the Spring Framework because he wanted to build applications with simpler code
that was easier to test. He did that, and it was a great improvement over the bloated, confusing commercial application
server software we had available at the time.

It's been almost twenty years, and now Spring is that.

You wanna know what Spring is better than? Enterprise Java Beans.
It sure is better than using Entity Beans, and Session Beans.
Don't know what those are? Don't worry, they were a terrible idea that cost a lot of money back when companies sold
application servers.
Don't know what an application server is? Here's an example using two lines of the http4k library.

```kotlin
fun main() {
	val app = { request: Request -> Response(OK).body("Hello, ${request.query("name")}!") }
	val server = app.asServer(Undertow(9000)).start()
}
```

Except back then it took hundreds or thousands of lines of code to do that, and we wrote Java software that was pretty
silly by today's standards.

Rod Johnson created the Spring Framework because he wanted to write simpler code that was more easily tested.
POJOs - Plain Old Java Objects instead of these massive, confusing classes with lots of magical behavior that was
difficult to test.
XML - the data glue that was an order of magnitude simpler to write, read, and understand over

configuration
pure DI

it was created to solve a problem that doesn't exist today

the skill with frameworks like spring is ingesting the knowledge of how their magical wiring works, and knowing where to
place the magical configuration settings to make it do what you want

you're still required to master the complexity of your domain problem, but now it comes with the added cost of
abstractions over every tool you want to use.
e.g. https://docs.spring.io/spring-kafka/docs/current/reference/html/#receiving-messages
e.g. by default the spring kafka consumer gives you awful performance out of the box. it's 5 times worse than the
performance of the plain kafka consumer. why?
Is it more productive than using the plain kafka consumer? No.
Is it faster than the plain consumer? Obviously no.
Is it easier to understand than using the plain kafka consumer? No.
You need to wade through eight different interfaces that are really just permutations of batch mode vs commit mode. How
is this productive or simple? Using the kafka consumer, you poll for a list of records, and you commit after processing
each message appropriately for your use case.
At best case using Spring, you end up with a complex leaky abstraction over a somewhat complex tool. But what most
people do is end up with Spring Boot's "easy" abstraction that by default configures a slow performing tool that ends up
causing production issues because shocker - you need to know how to use the tool properly anyway. Like using autocommit?
Hope you don't mind losing data.

Again, what do we end up with? Responsible programmers that are proficient with the framework, creating good solutions
that would've been good anyway, but are slightly more complex and less performant because of this baggage that continues
to be lugged around since the days of commercial application servers.
Aaaaand the rest of the programmers whose only experience so far is to reference the Spring documentation on how to
create an API or make a database call.

