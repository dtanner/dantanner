---
title: "java.time for the extremely impatient"
description:
date: "2016-04-13 02:26:00"
categories: [joda-time, java.time, java]
---

This is a super quick history and primer for those familiar with java, but unfamiliar with [Joda-Time](http://www.joda.org/joda-time/).
Java’s original date and time handling had some issues that could make it cumbersome and error-prone to work with. Then came the Joda-Time library, which is a fantastic replacement for pretty much everything date and time related. It’s intuitive, clean, fully-featured, and performant.

Starting with Java 8, the library was folded into the core JDK, with very few modifications to the Joda API.

In short, if you’re not on Java 8 yet, you should probably be using the joda-time library. If you are on Java 8, you should use the java.time classes.

There’s much more to the package than what I’ll show, and you’ll eventually want to dive deeper, but this article shows you some of the most frequently used techniques I’ve experienced on the last few projects. I’m using groovy for the code snippets, but they’re just java without the semicolons.

#### 91.83% of the time, you’ll work with LocalDate or ZonedDateTime.
```
import java.time.LocalDate
import java.time.ZonedDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.temporal.TemporalAdjusters

// If you have a date without time information, use a LocalDate. e.g. someone's birthday
LocalDate localDate = new LocalDate(2016, 4, 12)
println localDate.toString()  // 2016-04-12

// If you need to include time in the date, use ZonedDateTime
ZonedDateTime zdt = ZonedDateTime.now() 

// when formatting a ZonedDateTime for API communication, you'll typically use the DateTimeFormatter.ISO_INSTANT format
println zdt.format(DateTimeFormatter.ISO_INSTANT)
// 2016-04-12T19:20:45.539Z

// some more examples of formatters
println zdt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
// 2016-04-12T14:20:45.539

println zdt.format(DateTimeFormatter.RFC_1123_DATE_TIME)
// Tue, 12 Apr 2016 14:20:45 -0500

println zdt.format(DateTimeFormatter.ISO_ZONED_DATE_TIME)
// 2016-04-12T14:20:45.539-05:00[America/Chicago]

// you can also create a custom formatter
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd yyyy GG")
println zdt.format(formatter)
// Apr 12 2016 AD
```

#### Date manipulation is fluent and intuitive.
```
import java.time.LocalDate
import java.time.temporal.TemporalAdjusters

LocalDate localDate = LocalDate.now()
println localDate 
// 2016-04-12

println localDate.plusMonths(1).withDayOfMonth(1)
// 2016-05-01

println localDate.minusMonths(1).with(TemporalAdjusters.lastDayOfMonth())
// 2016-03-31
```

#### Prefer to work in UTC if you can - logs, database timestamps…consistency helps avoid mistakes.
In a startup class: `TimeZone.setDefault(TimeZone.getTimeZone("UTC"))`  
or as a JVM flag: `-Duser.timezone=UTC` 

#### When working with a point in time, always be aware of timezone!!!!
Even when working with objects like LocalDate, you must be timezone aware if you’re using a point-in-time operation. And by point-in-time, 99.273% of the time I’m referring to the now() method. 
For example, given the following scenario:

* The default JVM timezone is `UTC`.
* At `2016-04-12 3:10 PM` in `America/Chicago` (which is GMT-6), a call to println `LocalDate.now()` will result in `2016-04-12`.

But at `2016-04-12 6:10 PM` in `America/Chicago`, the same call will result in `2016-04-13`.

If you’re in Chicago, that looks like tomorrow, and might be a bug for what you’re trying to do! The code is doing precisely what it’s told though; the date in London is April 13th at the time the LocalDate is created for the UTC timezone.

So to repeat, when working with specific points in time, be aware of the timezone you’re working with. For example, if you want to set a date 30 days out from now according to your business location, you could say `LocalDate.now(ZoneId.of('America/Chicago')).plusDays(30)`.

#### Further Reading
The [java.time javadocs](https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html) are actually really good, so read them for more detailed information. Wrapping up the whirlwind tour, here’s a quick table to help get you started with a few objects and their example uses:

Object | Example Usage and Notes
---------- | -----------------------
LocalDate | Birthday, Contract date where no time or timezone is needed
ZonedDateTime |	Most points in time, like some startDateTime, endDateTime
YearMonth	| When you only want to work with a year/month combination. Less commonly used, but handy for date comparisons if you don’t want granularity to the day. e.g. Credit Card Expiration Month
LocalTime	| e.g. Chris’s hardware store opens at 8 am. This date is irrespective of timezone (i.e. you wouldn’t change the opening time when daylight savings rolls around.)
