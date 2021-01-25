---
title: "Kotlin Scripting Introduction (late 2020)"
date: "2020-10-12 20:00:00"
categories: [kotling, script, programming]
draft: true
---

# kotlin scripting notes and progress
### basics
- scripts must not go in a "source" directory. e.g. put them in a scripts directory that is not part of the project classpath



https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md#kotlin-main-kts
    @DependsOn allows specifying library dependencies for the script. Either a direct path to the file or jar, or maven coordinates are accepted as arguments.
    @Repository adds the maven repository for resolving dependencies. If none are specified explicitly, the maven central repository is used.
    @Import allows importing another script into a given one. All the actions specified in the imported script run before all the actions specified in the given script and all the properties, functions and classes defined in the imported scripts become visible for the given script.


from the command line docs:
https://kotlinlang.org/docs/tutorials/command-line.html

To run a script, we just pass the -script option to the compiler with the corresponding script file.
$ kotlinc -script list_folders.kts --

`env -- set environment and execute command, or print environment`
```
The env utility executes another utility after modifying the environment as specified on the command line.  Each name=value option
     specifies the setting of an environment variable, name, with a value of value.  All such environment variables are set before the
     utility is executed
```
```
-S string
             Split apart the given string into multiple strings, and process each of the resulting strings as separate arguments to the
             env utility.  The -S option recognizes some special character escape sequences and also supports environment-variable sub-
             stitution, as described below.
```

# Scripting docs
```
Scripting

Version 1.3.70 presents a set of improvements that provide a better experience of using Kotlin scripts with IntelliJ IDEA and Kotlin command-line tools.
Additionally, to help you become familiar with Kotlin scripting, we’ve prepared a project with examples. It contains examples of the standard scripts (*.main.kts) and examples of the scripting API usage and custom script definitions. Please try it and share your feedback in our issue tracker.
kotlin-main-kts support in compiler and IDE

In Kotlin 1.3, we introduced the kotlin-main-kts artifact which simplifies the creation and usage of the basic utility scripts. Now it is loaded by default by the Kotlin compiler and IntelliJ plugin, so that *.main.kts scripts are supported out of the box. In particular, now you can use such scripts without adding kotlin-main-kts.jar to the classpath.
In IntelliJ IDEA, this gives you highlighting and navigation, including resolve into dynamic dependencies, for *.main.kts files, even outside the source directories.
We’ve also improved the performance of the compiled *.main.kts scripts execution by enabling caching for them to make subsequent runs significantly faster.
```

Unpack the above to clarify how it relates.

### Basic Example
```kotlin
#!/usr/bin/env -S kotlinc -script --

println("Hello")

doSomething(args)

// note you can put the function anywhere in the file, like a java class. it doesn't have to be defined before its invocation (like a bash script needs)
fun doSomething(args: Array<String>) {
    args.forEach { arg ->
        println(arg)
    }
}

```

To run the script, you can either:
```shell
> kotlin hello.main.kts foo bar
Hello
foo
bar
```
or make the file executable and:
```shell
> ./hello.main.kts foo bar
Hello
foo
bar
```

### Another Example
```kotlin
#!/usr/bin/env -S kotlinc -script --

@file:DependsOn("com.github.ajalt.clikt:clikt-jvm:3.0.1")

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.default
import com.github.ajalt.clikt.parameters.options.option
import com.github.ajalt.clikt.parameters.options.prompt
import com.github.ajalt.clikt.parameters.types.int

class Hello : CliktCommand() {
    private val count: Int by option(help="Number of greetings").int().default(1)
    private val name: String by option(help="The person to greet").prompt("Your name")

    override fun run() {
        repeat(count) {
            echo("Hello $name!")
        }
    }
}

Hello().main(args)
``` 

Here we're showing how to add dependencies to the script.



TODO show an example with an alternate repository and @Import for external file

### Shared file import example
```kotlin
#!/usr/bin/env -S kotlinc -script --

@file:Import("shared.kts")

println("Hello")

somethingShared()
```

where `shared.kts` is a kotlin script file in the same directory that looks like this:
```kotlin
#!/usr/bin/env -S kotlinc -script --

fun somethingShared() {
    println("shared")
}
```

### growing pains
- no IDE support for file imports yet
- According to https://youtrack.jetbrains.com/issue/KT-37987, you should be able to use `!#/usr/bin/env kotlin` as your shebang line once you're using kotlin 1.4.20 or later. It's not out yet as of this writing, and there's a bug that doesn't properly pass arguments with hyphens to your kotlin script. So use `#!/usr/bin/env -S kotlinc -script --` for now.

### where to go
- stackoverflow, but better yet, the kotlin slack in their scripting channel
