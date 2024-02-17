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

# alternate titles
annotation infestation
spring rites
enterprise industrial complex

## Context

My current job is to help developers write better software at a large retail company. There's a few thousand of them
in the company, so lots of opinions and techniques used. Most of the business application software is written on the
JVM, and I spend a lot of my time on documentation and reference material for best practices on how to build high
quality software. "High quality" in this context meaning performant, maintainable, secure, efficient, concise, etc...

I currently recommend building new projects on the JVM using a "vanilla" Kotlin approach. By vanilla, I mean don't use
annotation-based application frameworks like Spring or Micronaut. This concept of not using an application framework for a Java project
is foreign and unpopular to some people. _Foreign_ to people unfamiliar with development in other languages, and
_unpopular_ with people that have only ever used an application framework so far in their career.

What makes my job more difficult is that I'm going against the grain of popularity. Applications built using Spring is
by far the most popular stack at my company (over half). So in conversations with people about this choice, I'm usually
in the situation of defending my viewpoint for this "new" technique of not using a framework, and trying to convince
people to move from a technique they're used and know works, to a new technique they usually have limited experience with.

In this article, I'm not going to defend my viewpoint - it's how people normally make software. I'm going to attack the viewpoint that using an annotation-based framework like Spring or Micronaut makes sense in 2024. Sure, it "works", and that's the most common defense I see
in forums. Carburetors also still work, but you don't see them in modern engines. And you can still use a Blu-ray player today, which was released around the same time the Spring Framework was first released.

I loved my Blu-ray player 20 years ago, and I loved the Spring Framework 20 years ago. Let's talk about that.

## The history of the Spring Framework



## outline
- the idea i'm selling
- human nature and change
  - on qualified opinions.
  - it's going to get harder and harder to recruit new developers to Java when they compare some of our popular choices with what they've been using in school
- history
  - original problems solved
- why it's not the best choice now
  - easy to start, hard to change
  - list the annotations for configuration - `@Configuration, @ConstructorBinding, @ConfigurationProperties(prefix = someprefix", @EnableConfigurationProperties(SomeConfig::class)`
- lets revisit those features of frameworks today
	- configuration
	- dependency injection
	- testing
	- security
    - difficulty of dependency updates in a large framework
    - sprawl of runtime dependencies and running code   - it's less secure
		  - the dependency count and runtime footprint of an annotation-based framework is going to much larger than a vanilla application though, and this increases the vulnerability risk of large framework apps like Spring. In A/B comparison testing between vanilla and Spring for of a small monorepo scenario, the Spring apps included an average of 160 library dependencies vs an average of 61 for their vanilla Kotlin equivalent. That's a 162% increase in runtime dependencies. We're talking about a couple million lines of potentially vulnerable code running in your application that you have limited control over. What makes this situation worse is that because you're using a large framework, you don't have full control of dependency updates. You're limited to the highest-supported version of each library as supported by the framework.
	- performance (If you actually need high performance, you're not using Spring)
  - best practices (e.g. kafka consumer, all-open, lombok)
- examples of vanilla problem solving using code snippets
  - note that we're still using many of the same libraries, just directly instead of through an additional abstraction
    - slf4j
    - jackson
    - okhttp
    - junit
    - opentelemetry
- criticisms of the vanilla approach
  - it's not as easy to get started - this is absolutely true if you're starting from scratch. two points:
    - most of my earlier points revolve around the basis that getting to version 3.0 a couple years later is the hard part, not the initial setup
    - there are tools that make it easier to get started with a vanilla approach. e.g. the [Ktor Project Generator](https://start.ktor.io) and [http4k's toolbox](https://toolbox.http4k.org/) which contains a project wizard and other tools to help you get started.
    - in my current company we're taking things a step further and introducing a project quickstart application that even lets you generate monorepos with multiple applications and selectable features based on innersource templates.
  - there's more code - in internal comparisons between similarly featured applications, the difference was negligible.


- micronaut
- the future of java
  - comparison to other stacks
    - go https://grafana.com/blog/2024/02/09/how-i-write-http-services-in-go-after-13-years/


image prompts: https://clipdrop.co/stable-diffusion
- an infestation of parasitic bugs surrounding a piece of paper with words on it

negative prompts:
ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, draft, grainy





# one idea - bad sell
- attack vector? more like paying homage to decades of early internet experience
- ORMs

using frameworks like spring doesn't mean there are less things you need to understand.
it means there are more things you need to understand.
spring + apache http client
spring + apache kafka
spring + netty
you have to know how things work when they break and when you need to make changes. Being tied to a framework
without control also means you don't have the power to fix some things, like critical security flaws from one of the
many dependencies you may not even know exist.
(show what dependencies tree looks like)

state that i want you to make a conscious note every time a framework gets in the way of the core problem you're solving. i want you to feel unease when you come across unnecessary complexity.

remind of its history and why it was useful back then (scan original book for its reasons)
remark that it's now 2022 and we have languages like Kotlin, Scala, and Clojure on the JVM
masks the essential complexity
makes it both easier and more complex
every team using a magical framework needs to have at least one person that understands the framework in depth
there are classes of problems to be solved. eg business workflow, performance, scalability, configuration, others.
some are essential, some are waste

https://news.ycombinator.com/item?id=30258095
>>> a lot of frameworks (I'm thinking of Spring here) devote most of their effort to creating "value add"
> wrappers around technologies that work more than well enough without, and that create even more problems
> for a dev who now has to understand both original and wrapper's attempt at enhancement. Enough wrapping! Create something real, just once.

why do people pick spring today when they aren't sure what to do? because there are numerous
examples out there on how to get started with it. this is very understandable, since you don't
want to spend your time on minutia like configuration and telemetry when starting a project.
but as a project grows and becomes more complex over time, it becomes exponentially more
difficult to break free from the constraints of a framework down the road.

it's everything to everybody, but also tries to be strongly opinionated about it

when things go wrong, you're dealing with manipulated bytecode classes and reflection.
```kotin
Caused by: java.lang.NullPointerException: Parameter specified as non-null is null: method com.foo.myapp.consumer.KafkaConsumerConfig.<init>, parameter config
	at com.target.springbootkotlin.consumer.KafkaConsumerConfig.<init>(Configuration.kt)
	at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
	at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:77)
	at java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
	at java.base/java.lang.reflect.Constructor.newInstanceWithCaller(Constructor.java:499)
	at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:480)
	at kotlin.reflect.jvm.internal.calls.CallerImpl$Constructor.call(CallerImpl.kt:41)
	at kotlin.reflect.jvm.internal.KCallableImpl.call(KCallableImpl.kt:108)
	at kotlin.reflect.jvm.internal.KCallableImpl.callDefaultMethod$kotlin_reflection(KCallableImpl.kt:159)
	at kotlin.reflect.jvm.internal.KCallableImpl.callBy(KCallableImpl.kt:112)
	at org.springframework.beans.BeanUtils$KotlinDelegate.instantiateClass(BeanUtils.java:892)
	at org.springframework.beans.BeanUtils.instantiateClass(BeanUtils.java:196)
```

spring was originally created to make testing better, and the shift to rely on annotations has made testing worse

the annotation compile time constant constraint is awful
    show example of api AppTest using wiremock that chooses a random port, and then you want to spin up the app with that port as its config

leaky and unnecessary abstraction over libraries
kafka consumer example
    plain versus spring kafka consumer.
    how to achieve good results process
use the example of the spring kafka consumer for showing how it performs poorly out of the box. what is it doing?
then show the documentation of spring showing the factories and the useless junk you have to make with the docs and what's actually happening

it's a security liability, not asset
    log4j
    show simple server dependency graph of spring vs http4k

configuration
    it's not hard

dependency injection and testing
    pure DI

| Benefits of Annotation Frameworks in 2003   |
|---------------------------------------------|
| helps me unit test my code more easily      |
| helps me configure my application           |
| reduces application server vendor lock-in   |
| helps me manage my large monolithic app     |
| provides a productive MVC pattern           |
| reduces dependency management issues        |
| helps me package my application more easily |

Remember that Spring was created as a lighter weight alternative to the bloated, vendor-driven standards at the time.
Back then, projects succeeded DESPITE the technology available.
This was before Ruby on Rails, Django, JSON, Redis, Elasticsearch, nginx, AWS, GCP, SSDs, and so many other of the tools and technologies that let us *easily* integrate and scale today.


# The fall of XML
verbose

# The rise of annotations
AOP was popular at the time

# email rant
what is the most touted feature of spring? the inversion of control.
what was the big selling point? it enabled you to separate concerns, and let you unit test your code.  what was the configuration language? xml
what happened to xml? it fell out of favor due to its verbosity, replaced by annotations.
but with annotations, you don't unit test your code any more....

but annotations make your code easier to reason about, like the combination of bean config annotations.

easier to debug? like trying to figure out why @transactional isn't working the way you expect.

"it works for me."
so does the cobol running in your mainframe.
this isn't an insult to cobol. it's an insult to the lethargic attitude of advanced beginners that ignore the fact that the problems spring was origin invented to solve don't exist any more.

don't like being considered a legacy programmer? too bad; your continued support for anotation based code  is repelling experienced and new programmers of other languages upon seeing "enterprise java".
from a recent polll in my company's go and puthon channels, here's how programmers of those languagesanswered the question "what do you strongly dislike about java?"
...

https://news.ycombinator.com/item?id=39334672
"Spring Boot uses a lot of libraries and integrates them for you to make sure they all work together."

languages with popular annotations frameworks, languages in the most loved list

fundamentals

hiring
    would someone want to join if they've been slinging go/python and see some ugly code?
people that have used ktor, http4k, and spring. people that prefer annotation frameworks.

oh but micronaut fixed all that!
replace your web server's startup time from 10 seconds to a half second. congratulations. you still have all the same problems as spring.

twice a week i hear:
tried to upgrade and it looks like vomit
get an error configuring some bean

to go along with "why can't i make my ORM do what i want it to do?" but that's a different problem

### it represents a larger threat to the long term popularity of java than many people realize

### qualified opinions
i had this idea last night trying to correlate language and tool preference along with a person's level of qualification:
create a survey, asking people to to give a recommendation score to each tool/technique along with indicating how much experience they have with each option. e.g. something like:
Technique   				Recommendation  					Production Experience Amount
----------          -----------------         --------------------
Spring              do not use                over 10 years
Micronaut       		do not use                < 1 month
Vanilla Kotlin  		Recommended         			5-10 years

what are the age ranges of people that work on spring code vs other mainstream languages?

### IDE complexities
Also note that annotation processing is supported during the compilation process. However, there are some edge cases that are quite difficult to handle when the code is compiled by IntelliJ IDEA, for example, when the annotation processor is defined in one of the Gradle subprojects.

So, this is the point we are at right now. We’re still experimenting with Spring and Micronaut run configurations in delegated mode and are working constantly on improving the Gradle delegation process in the IDE.

# on learning and change
- boring tech
- fundamental knowledge
- fads
- no silver bullets
- but there are genuine, improvements
- humans are resistant to change
- our industry is immature and in massive flux






## Other notes I've taken for ideas
In the early 2000's, Rod Johnson created the Spring Framework because he wanted to build applications with simpler code that was easier to test. He did that, and it was a great improvement over the bloated, confusing commercial application server software we had available at the time.

It's been almost twenty years, and now Spring is that.

You wanna know what Spring is better than? Enterprise Java Beans.
It sure is better than using Entity Beans, and Session Beans.
Don't know what those are? Don't worry, they were a terrible idea that cost a lot of money back when companies sold application servers.
Don't know what an application server is? Here's an example using two lines of the http4k library.
```kotlin
fun main() {
val app = { request: Request -> Response(OK).body("Hello, ${request.query("name")}!") }
val server = app.asServer(Undertow(9000)).start()
}
```

Except back then it took hundreds or thousands of lines of code to do that, and we wrote Java software that was pretty silly by today's standards.

Rod Johnson created the Spring Framework because he wanted to write simpler code that was more easily tested.
POJOs - Plain Old Java Objects instead of these massive, confusing classes with lots of magical behavior that was difficult to test.
XML - the data glue that was an order of magnitude simpler to write, read, and understand over

configuration
pure DI

it was created to solve a problem that doesn't exist today

the skill with frameworks like spring is ingesting the knowledge of how their magical wiring works, and knowing where to place the magical configuration settings to make it do what you want

you're still required to master the complexity of your domain problem, but now it comes with the added cost of abstractions over every tool you want to use.
e.g. https://docs.spring.io/spring-kafka/docs/current/reference/html/#receiving-messages
e.g. by default the spring kafka consumer gives you awful performance out of the box. it's 5 times worse than the performance of the plain kafka consumer. why?
Is it more productive than using the plain kafka consumer? No.
Is it faster than the plain consumer? Obviously no.
Is it easier to understand than using the plain kafka consumer? No.
You need to wade through eight different interfaces that are really just permutations of batch mode vs commit mode. How is this productive or simple? Using the kafka consumer, you poll for a list of records, and you commit after processing each message appropriately for your use case.
At best case using Spring, you end up with a complex leaky abstraction over a somewhat complex tool. But what most people do is end up with Spring Boot's "easy" abstraction that by default configures a slow performing tool that ends up causing production issues because shocker - you need to know how to use the tool properly anyway. Like using autocommit? Hope you don't mind losing data.

Again, what do we end up with? Responsible programmers that are proficient with the framework, creating good solutions that would've been good anyway, but are slightly more complex and less performant because of this baggage that continues to be lugged around since the days of commercial application servers.
Aaaaand the rest of the programmers whose only experience so far is to reference the Spring documentation on how to create an API or make a database call.

