+++
date = "2017-01-25T01:20:43-06:00"
categories = []
description = ""
title = "Groovy is still better than Java"
+++

The idea for this post started last week when a gifted teammate, whose experience lies outside JVM languages, asked me if it was still worth it to write Groovy over Java.  Good question...
 
For the last five years, when it comes to writing for the JVM, it's been mostly Groovy for me.  
Crap, it's been almost ten years.  _dan feels his bones creaking..._
  
When I first saw Venkat Subramaniam gliding through his beautiful java to groovy idioms at a conference, I was impressed. 

Little things were nice, like being able to use `println 'hello'` instead of `System.out.println("hello");`.  

Even better was reading a file line by line.  It went from this:
``` groovy
BufferedReader br = new BufferedReader(new FileReader("file.txt"));
try {
    StringBuilder sb = new StringBuilder();
    String line = br.readLine();

    while (line != null) {
        sb.append(line);
        sb.append(System.lineSeparator());
        line = br.readLine();
        System.out.println("line = " + line);
    }
} finally {
    if (br != null) {
        br.close();
    }
}
```

to this:
``` groovy
new File("file.txt").eachLine { println "line = $it" }
```

_Look Ma, a one-liner!_ That got me hooked.

The **biggest** thing though, which I've grown to appreciate even more over the years, is the [Collection](http://docs.groovy-lang.org/latest/html/groovy-jdk/java/util/Collection.html) interface. The intrinsic power it gives to collection-like objects is immense.  And hey, c'mon over here [Map](http://groovy-lang.org/groovy-dev-kit.html#_iterating_on_maps) - you're iterable too as far as we're concerned.  

There's basic stuff like `10.times { println it }`, and
`someCollection.each { println it }`, which shaves a few lines of code from the existing java iteration techniques.  

Then there's commonly useful but more powerful improvements like `collect()`, where you iterate through a collection of things, creating a new collection based on a function. e.g. going from this pre-Java 8 code:

``` groovy
List<Integer> input = Arrays.asList(1, 2, 3);
List results = new ArrayList();
for (Iterator<Integer> iterator = input.iterator(); iterator.hasNext(); ) {
    Integer integer = iterator.next();
    results.add(integer * 2);
}
```
to:
``` groovy
List results = [1, 2, 3].collect { it * 2 }
```

Filtering a collection is a similar improvement, where you start with a collection and filter it down based on a condition applied to each element.  e.g. going from (once again, pre-Java 8):
``` groovy
List<Integer> input = Arrays.asList(1, 2, 3, 4);
List evenNumbers = new ArrayList();
for (Iterator<Integer> iterator = input.iterator(); iterator.hasNext(); ) {
    Integer integer = iterator.next();
    if (integer % 2 == 0) {
       evenNumbers.add(integer);
    }
}
```
to:
``` groovy 
List evenNumbers = [1, 2, 3, 4].findAll { it % 2 == 0 }
```

It gets even more concise and powerful with methods like `collectMany` and `inject`.  They're slightly more complicated, but worth the couple minutes of time it takes to understand.  If I were to give one piece of advice to people new to Groovy, it would be to thoroughly explore that interface. 

Lispers may smugly remark, "oh, how cute; you're learning functional programming".  And they're right!
The pragmatic functional features of Groovy provide a gentle transition from object-oriented to more pure functional programming for many developers.  

Fast-forward a bunch of years, and things have changed. Even though Java hasn't been progressing as fast as many would like, they've made some significant changes to include features introduced by Groovy, and pioneered by other languages; most notably lambdas and streaming.  For example, the above Java examples can now be written like this:
``` groovy
// read each line in a file
try (Stream<String> stream = Files.lines(Paths.get("file.txt"))) {
    stream.forEach(System.out::println);
} catch (IOException e) {
    e.printStackTrace();
}

// collect
List<Integer> results = Stream.of(1, 2, 3).map(v -> v * 2).collect(Collectors.toList());  

// filter
List<Integer> evenNumbers = Stream.of(1, 2, 3, 4).filter(v -> v % 2 == 0).collect(Collectors.toList());
```

...**much** improved over the old Java syntax. Still not as concise or elegant as Groovy, but fairly close.

### Back to the original question...
Is it still worth it to write groovy? Fortunately, I had a chance to make a direct comparison that same week.

It started with a little bake-off we're doing to compare a couple different application design techniques.  I wrote a small service in plain groovy, and my teammate wrote one in java.  Our apps are running in a container that will have their environment-specific overrides specified as environment variables.  I strongly prefer typed configuration objects in the code, rather than things like generic Maps or JSON objects.  Ten minutes of googling, and I couldn't find a utility to let me override typed configuration object values with environment variables.  So I created this project in groovy: https://github.com/dtanner/env-config-loader-groovy
  
My teammate initially used the [typesafe/config](https://github.com/typesafehub/config) project to do his configuration overrides.  But its environment overrides are a little verbose IMO, we didn't need its additional complexity, and solving the same problem with different tools adds to the maintenance costs for the team.
So I created a pure java version of the env-config-loader tool as well: https://github.com/dtanner/env-override

I wasn't excited about writing the java version, but:

- A pure java implementation can be used by other JVM languages
- It seemed like a useful tool for the community
- I'd be able to have a current and relevant opinion on Groovy's usefulness compared to Java   
  
An example line in the Groovy code is this:
``` groovy
Map<String, String> envOverridesMap = getenv().findAll { it.key.startsWith(environmentPrefix) }
```
    
The above line populates a Map from all system environment variables that match a given environment prefix.  I wanted to avoid dependencies if possible to limit the transitive dependencies needed by consumers of the library; the only compile dependency is logback-classic.

On the java side, I also tried building the tool without any dependencies, but it got ugly pretty fast.  Replicating the above Groovy wasn't too bad; you've basically seen what it looks like in the earlier collect example:
``` groovy
Map<String, String> envOverridesMap = new HashMap<>();
for (String envKey : envVars.keySet()) {
    if (envKey.startsWith(environmentPrefix)) {
        envOverridesMap.put(envKey, envVars.get(envKey));
    }
}
```

Isn't there a more concise way?  IntelliJ suggested this alternative syntax:
``` groovy
Map<String, String> envOverridesMap = new HashMap<>();
envVars.keySet().stream().filter(envKey -> 
    envKey.startsWith(environmentPrefix)).forEach(envKey -> 
        envOverridesMap.put(envKey, envVars.get(envKey)));
```
...but that just made me sad.  I enjoy the new streaming capabilities, but it didn't add value in for me in this case.  It could've been much cleaner if Map were iterable in java, but it's not and probably won't ever be.

Things got ugly when I tried cloning an arbitrary object, and also dynamically setting properties on an object.  In Java `clone()` is a protected method, so you can't call it unless you extend from that object.  I tried to hack something together like this:
``` groovy
private static <T> T cloneObject(T obj) {
    try {
        T clone = (T) obj.getClass().newInstance();
        for (Field field : obj.getClass().getDeclaredFields()) {
            if (Modifier.isFinal(field.getModifiers())) {
                continue;
            }
            field.setAccessible(true);
            field.set(clone, field.get(obj));
        }
        return clone;
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}
```
but there were exceptional cases I hadn't handled yet, so eventually gave up and added the commons BeanUtils library so I could use the `cloneBean()` method.  Even uglier was going down the path of dynamic property value overrides.  I had started to toy with this monstrosity:
``` groovy
private static boolean setProperty(Object object, String fieldName, String fieldValueString) {
    Class<?> clazz = object.getClass();
    try {
        Field field = clazz.getDeclaredField(fieldName);
        field.setAccessible(true);
        Class fieldType = field.getType();
            if (fieldType.equals(Integer.class) || fieldType.equals(Integer.TYPE)) {
                field.setInt(object, Integer.parseInt(fieldValueString));
            } else if (fieldType.equals(Long.class) || fieldType.equals(Long.TYPE)) {
                field.setLong(object, Long.parseLong(fieldValueString));
            } else if (fieldType.equals(Boolean.class) || fieldType.equals(Boolean.TYPE)) {
                field.setBoolean(object, Boolean.parseBoolean(fieldValueString));
            } else if (fieldType.equals(Long.class) || fieldType.equals(Long.TYPE)) {
                field.set(object, Long.parseLong(fieldValueString));
            } else {
                Class.forName(field.getDeclaringClass().getName());
                field.getDeclaringClass().getConstructor(String.class).newInstance(fieldValueString);
                field.set(object, field.getType().getConstructor(String.class).newInstance(fieldValueString));
            }
        return true;
    } catch (NoSuchFieldException e) {
        log.warn("Environment override for property " + fieldName + " found, but no matching property exists.");
    } catch (Exception e) {
        throw new IllegalStateException(e);
    }
    return false;
}
```
...before punting.  Since I had already accepted the BeanUtils dependency, I was able to use the `copyProperty` method and delete a lot of potentially brittle code.

### Summary
You probably enjoyed reading the java code as much as I enjoyed writing it.  It's not the semicolons or the verbose exception handling.  It was that I could do in a single line of Groovy what took an entire method in the equivalent Java.  This is a big deal in terms of productivity, maintenance, and code quality.

There are other advantages to using Groovy, for example listed by Peter Ledbrook [here](http://blog.cacoethes.co.uk/groovyandgrails/groovy-in-light-of-java-8).
As to the question of when it's appropriate to write Java over Groovy, there's really only a couple reasons in my opinion:

The first is the reason I just insulted the java code I wrote, but still intend to promote and deprecate the groovy version; it's a library that can be run on any JVM language.  The Groovy library is limited to Groovy usage.  It's worth it for that situation.

The second is if you're using a framework or library that doesn't let you easily use Groovy.  If you're going down this path, I think you'll know it when you see it.  e.g. If you want to write a lot of RxJava, you might want to stick with Java, at least for now.
 
tl;dr; I still think Groovy is still generally a better Java. 
