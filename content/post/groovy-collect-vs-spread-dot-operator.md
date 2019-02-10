---
title: "Groovy collect vs spread-dot operator"
date: "2014-11-15 23:17:00"
description: 
categories: [groovy, grails, codenarc]
---

Yesterday I was doing some Groovy code cleanup with the wonderful [CodeNarc](http://codenarc.sourceforge.net/) static analysis tool. One of the violations it found was [UnnecessaryCollectCall](http://codenarc.sourceforge.net/codenarc-rules-unnecessary.html#UnnecessaryCollectCall). 
The summary of the rule is "Some method calls to Object.collect(Closure) can be replaced with the spread operator." 
e.g. Replace things.collect { it.name } with things*.name, or even things.name if what you're after is a property. 

But when I performed that refactoring and ran all the tests, some failed! Here's why: 

I made the mistake of assuming that the spread operator behavior is always identical to the collect method. For a **non-null** collection, it is. e.g. The following code will produce the same result regardless of the technique you use:
```
def things = [ [a: 1], [a: 2] ]

things.collect { it.a } // returns [1, 2]
things*.a               // returns [1, 2]
things.a                // returns [1, 2]
```
But if the collection you're operating on is **null**, the three techniques will result in different outcomes:
```
def things = null

things.collect { it.a }   // returns []
things*.a                 // returns null
things.a                  // throws a NullPointerException
```
What this means is that if you're working with Collections that can potentially be null, you need to think about the consequences of the dot operations before using them. i.e. Don't ever use the implicit spread operator (things.a) if the collection can be null. And only use *. if it's ok for the result to be null. 

*tl;dr;* Explicit and implicit spread operations are great, but be aware that they are less forgiving than the collect method.
