---
title: "I Use Spring And Now I Have Two Problems"
date: "2022-01-26 20:00:00"
categories: [spring, java]
draft: true
---


titles:
illusion of control frameworks
the MacGuffin of java development 
Under the hood, I'm not sure
the ceremony of spring
java developers and their addiction to unnecessary complexity
the strange cult of general purpose annotation-based frameworks
the spring religion

(using Spring these days is like eating Kosher - what was once based on reason is now just an accepted practice)

using frameworks like spring doesn't mean there are less things you need to understand. 
it means there are more things you need to understand.
you have to know how things work when they break and when you need to make changes. Being tied to a framework 
without control also means you don't have the power to fix some things, like critical security flaws from one of the 
many dependencies you may not even know exist.
(show what dependencies tree looks like)

state that i want you to make a conscious note every time a framework gets in the way of the core problem you're solving. 
i want you to feel unease when you come across unnecessary complexity.

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


fundamentals

hiring
    would someone want to join if they've been slinging go/python and see some ugly code?
