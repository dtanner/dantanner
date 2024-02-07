---
title: "Annotation Infestation"
date: "2022-01-26 20:00:00"
categories: [spring, java]
draft: true
---

image prompts: https://clipdrop.co/stable-diffusion
- an infestation of parasitic bugs surrounding a piece of paper with words on it

negative prompts:
ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, draft, grainy

# titles
annotation infestation
spring rituals
annotation fixation
enterprise industrial complex
with annotation frameworks, you get more



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

frameworks are unnecessary in microservices

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
| provides a productive MVC patterns          |
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
Technique   Recommendation  Production Experience Amount
----------          -----------------          --------------------
Spring              do not use                over 10 years
Micronaut       do not use                < 1 month
Vanilla Kotlin  Recommended         5-10 years

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