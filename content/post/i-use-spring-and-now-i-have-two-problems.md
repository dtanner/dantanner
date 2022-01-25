---
title: "I Use Spring And Now I Have Two Problems"
date: "2022-01-26 20:00:00"
categories: [spring, java]
draft: true
---


titles:
the ceremony of spring
java developers and their addiction to unnecessary complexity
the strange cult of spring
the spring religion

using frameworks like spring doesn't mean there are less things you need to understand. 
it means there are more things you need to understand.
you have to know how things work when they break and when you need to make changes. Being tied to a framework 
without control also means you don't have the power to fix some things, like critical security flaws from one of the 
many dependencies you may not even know exist.

state that i want you to make a conscious note every time a framework gets in the way of the core problem you're solving. i want you to feel unease when you come across unnecessary complexity.

remind of its history and why it was useful back then (scan original book for its reasons)
remark that it's now 2022 and we have languages like Kotlin, Scala, and Clojure on the JVM
masks the essential complexity
makes it both easier and more complex
every team using a magical framework needs to have at least ine orrson tgat understands the framework in depth
there are classes of problems to be solved. eg business workflow, performance, scalability, configuration, others. 
some are essential, some are waste


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


