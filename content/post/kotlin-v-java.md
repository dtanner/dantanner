---
title: "Kotlin vs Java in 2021"
date: "2021-10-26 20:00:00"
categories: [bikes, telemetry]
---

Since the arrival of Java 17, I've heard a few people wonder "Does Kotlin Still Make Sense, or Should I just use Java?"

Short answer: Kotlin is still a far better language in terms of features, and its critical advantages will probably
never come to Java.

What do I consider critical advantages?

# Null Safety and Immutability
Kotlin lets you write elegant null-safe code, and forces you to be explicit about null-safety.

For example, consider this data class:
```kotlin
data class Person(val name: String)
```
Because of the `val` keyword, you can't forget to set name when instantiating a Person, and you can't set it to null later.  
That's an entire class of nasty bugs wiped out with a single elegant language design.

Conversely, when something _can_ be null, the compiler foreces you to explicitly handle it in a concise manner, also
giving you an escape hatch if you choose to be unsafe about it.
```kotlin
var b: String? = "abc"
b.length // compile error: variable 'b' can be null

// you must use a null-safe operator
b?.length // which evaluates to null if 'b' is null, or the length of 'b' if it is not null
```

Java bolted on the `Optional` container to try to solve this problem, but it's clumsy and rarely used in the code I've
seen.  That's a recurring theme in many of the features; Kotlin makes it easy to write concise and stable code.
This one's just really really important in my opinion, and is worth the price of admission on its own.

Official docs [here](https://kotlinlang.org/docs/null-safety.html).

# Some of my favorite features
Now for the reasons I really enjoy writing Kotlin.
There are plenty of other features I'm not mentioning, but these are the favorites that come to mind.

### Collection functions
There's a _ton_ of them, and they're powerful and pragmatic.
Full docs [here](https://kotlinlang.org/docs/collections-overview.html); some commonly used examples:
```kotlin
val numbersGreaterThanOne = listOf(1, 2).filter { it > 1 } // [2]
// for more advanced versions, see filterIndexed or filterNotNull

val stringLengths = listOf("bear", "cat").map { it.length } // [4, 3]

val firstTwoElements = listOf(2, 4, 6).take(2) // [2, 4]

val sum = listOf(1, 5).sumOf { it } // 6

```

### IDE Support
I already had IDE support listed as one of the things I was going to highlight in this article, but something
awesome just happened that caused me to place it here.  I'm using markdown to author this content in IntelliJ, and
while I was typing the above code snippets, this happened:
![](/kotlin-2021/ide-support-markdown.png)

Syntax highlighting is pretty cool, but type-ahead support in markdown?  That's really cool.  There are lighter weight
editors out there, but none more powerful in my opinion. JetBrains authoring the language makes for tight IDE
support.

### Extension functions
From the [docs](https://kotlinlang.org/docs/extensions.html):
> Kotlin provides the ability to extend a class with new functionality without having to inherit from the class or
> use design patterns such as Decorator. This is done via special declarations called extensions.

For example, add a utility function to Date that converts it to a UTC ZonedDateTime:
```kotlin
fun Date.toUtcZonedDateTime(): ZonedDateTime = ZonedDateTime.ofInstant(this.toInstant(), ZoneOffset.UTC)

val date = Date()
val zonedDateTime = date.toUtcZonedDateTime()
```

Another example, encapsulating a standard choice for a hashing algorithm so that usage is concise and
easily refactorable:
```kotlin
import com.google.common.hash.Hashing
fun ByteArray.hash(): ByteArray = Hashing.murmur3_128().hashBytes(this).asBytes()

val hashedBytes = "abc".toByteArray().hash()
```

### Default and named arguments
```kotlin
fun makeHttpCall(url: String, timeoutSeconds: Int = 10) { ... }

// both of these work
makeHttpCall(url = "http://foo.com", timeoutSeconds = 30)
makeHttpCall(url = "http://foo.com")
```

Named arguments become especially handy for functions with lots of similarly typed parameters.

### String interpolation

```kotlin
val score = 1
println("the score is $score.  The score minus one is ${score - 1}")
```

### Data classes and .copy()
Java finally has records now. Something I use all the time though, especially when combined with
immutable data structures, is the `copy` function. For example a common test data setup
pattern looks something like this:
```kotlin
// in Person.kt
data class Person(val name: String, age: Int)

// in PersonTest.kt
fun randomPerson(): Person {
    return Person(name = someRandomString, age = someRandomAge)
}

@Test fun testPerson() {
    val bob = randomPerson().copy(name = "bob")
}
```



### Function types as class parameters
This is a really powerful and flexible capability.  It does come at a slight cost in clarity, and IDE support is
limited, but is preferred by myself and many others I've worked with.   
First off, what's a function type?  Docs [here](https://kotlinlang.org/docs/lambdas.html#function-types), but the
most common form I use looks like this:

`(Int) -> String`

which can be broken down like this:  
![](/kotlin-2021/function-type.png)

An example function type that takes two Int parameters and return a String would be:  
`(Int, Int) -> String`

A function with no parameters that returns a String would be:  
`() -> String`

A function that doesn't return a useful value must specify `Unit`. e.g.:  
`(Int) -> Unit`

OK great - you can define functions that have a signature but don't have a name. What can we do with that?
How about pure dependency injection without the need for mocks?

```kotlin
// a "real" DataRepository that saves data to a repository
class DataRepository {
    fun saveStatus(status: String): Boolean {
        // save the name to the database and return true if it was updated
    }
}

// a "real" Publisher
class Publisher {
    fun publishStatus(status: String)
}

// a service that performs complex logic that needs to be unit tested
class FooService(
    saveStatus: (String) -> Boolean,
    publishStatus: (String) -> Unit
) {
    fun handleStatus(status: String) {
        saveStatus(status)
        publishStatus(status)
    }
}

// the class wiring up the real stuff together
class Application {
    
    private val dataRepository = DataRepository()
    private val publisher = Publisher()
    
    private val fooService = FooService(
        saveStatus = dataRepository::saveStatus,
        publishStatus = publisher::publishStatus
    )
    
    // whatever else the application needs to do to get wired up and run
}

// the service unit tests
class FooServiceTest {
    
    @Test fun `everything works great`() {
        val fooService = FooService(
            // set the saveStatus parameter to a lambda that ignores the String parameter and returns true
            saveStatus = { _ -> true },
            // set the publishStatus parameter to a lambda that ignores everything and returns Unit implicitly 
            publishStatus = { }
        )
        
        fooService.handleStatus("yay")  // along with whatever assertions you want
    }

    @Test fun `saveStatus failure should do the right thing`() {
        val fooService = FooService(
            // set the saveStatus parameter to a lambda that blows up, simulating a problem in the repository
            saveStatus = { _ -> throw RuntimeException("the sky is falling") },
            // set the publishStatus parameter to a lambda that ignores everything and returns Unit implicitly 
            publishStatus = { }
        )

        // shouldThrow is an example feature of the fantastic kotest assertion library
        // i.e. we've injected behavior into the service indicating a failure should happen
        // and we should handle it properly
        shouldThrow<RuntimeException> {
            fooService.handleStatus("yay")  
        }
    }
}
```

No DI frameworks needed. No mocking needed. Just pure function signatures with full precise control of the contract
behaviors you're building and testing.  
This works great for situations like this where you need to wire up a single production implementation and want one
or more test implementations.  The compiler will keep the code honest.  But, one caveat is that the `Find Usages`
functionality of the IDE doesn't work because the functions are too ambiguous for the current versions of IntelliJ.
That does add a little more mental overhead to maintenance, along with the mental overhead of the function type as a
parameter itself.  But in practice this hasn't been an issue on my projects, and the benefits outweigh the drawbacks
in my opinion.

All that said, interfaces and regular old functions obviously still have their place and should be used where
appropriate.

### Lots more common idioms
The Kotlin docs maintain a list of frequenty used idioms [here](https://kotlinlang.org/docs/idioms.html).
Check it out for more examples of pragmatic and clean code.  


