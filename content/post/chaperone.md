---
title: "Chaperone"
date: "2020-04-12 20:00:00"
description: A thing to watch things
categories: [kotlin, bash, monitor, docker]
draft: true
---

I built a basic but extensible monitoring tool to help people watch their stuff.  It's called *Chaperone*, and it lives [here](https://github.com/dtanner/chaperone).

# Why?
A couple years ago, a bright colleague of mine whipped up a quick and elegant solution to watch and alert on a bunch of things running in our apps.  
We didn't want a big overblown solution, but it also needed to be customizable.  I helped out a little. 
When the next suite of projects rolled around, I needed something similar.  I could've reused the tool we had, but here's why I wanted to create something new:

- The original tool was written in Go, but I don't enjoy working with it and I'm not very fast with it. My favorite language right now is Kotlin.
- Almost every project needs something that can make basic monitoring easy, and custom monitoring possible. i.e. I was willing to make an investment of my own time to make something I loved for the long-term.
- Just about everyone these days is writing apps that are deployed as containers. Tools like nagios were not built for this style of deployment, and the various open source alternatives I saw didn't meet my goals.

# What does it do?
In a nutshell, you define a bunch of checks, and when the app starts up, it runs them and sends the results to various places you configure.  

More specifically, it runs every check you define as a bash command, and if the exit code of the command is zero, things are good. If it's non-zero, things are not good.  

# Isn't that what $SOME_OTHER_TOOL does?
Yeahhhh...some tools do precisely that, some have a ton more features, some provide a giant user interface, and some cost a bunch of money.  
But whenever I looked for a tool, they all suffered from one of these flaws:

- too opinionated in how they worked
- a giant PITA to configure or run
- couldn't be configured to live alongside my project's source code
- too hard or confusing to configure and run as a docker container

# What are the highlights of its features?
### Defining checks
See the docs for the full list of features with examples, but basically you configure a `check` as a TOML config file and put that in a directory.
The check has a `command` in it and a schedule. The most basic example would be figurately stated as "curl some url and see if it's a 200" which can easily be done as a bash one-liner. You don't need an HTTP-specific application for that.
Another example is a templated check, where you join two commands, like "get a list of our running apps in the cluster", then "hit each app's health check".
Or "from our list of kafka topics", "see if we can consume from each topic successfully".   

### Outputting the results
I made result output capabilities a pluggable model. There's basically a report writer interface, and so far two output destinations have been implemented:

- stdout - sends the results to stdout in a human-readable format
- InfluxDB - sends the results to InfluxDB.  I'm currently using influx + grafana for our dashboarding and alerting, and it's been a great way to use tools we're already relying heavily on.

Some other ideas that haven't been built yet but would be pretty easy are destinations like:

- CSV file
- Other common repositories like relational databases, other time series stores, etc...
- Custom destination - e.g. a script you've defined that accepts the results and does whatever with it, like put it in some crazy proprietary database you have.


# How is it run?
Chaperone itself is built and published as a docker image on [docker hub](https://hub.docker.com/r/edgescope/chaperone).
That's really just the shell though - the expectation is that you create your own docker container based on it, adding in your checks and then deploying that to your environment(s).
Our naming convention for each checks source repository is $projectname-chaperone.  Each chaperone definition project lives within each org it's watching, so it's version-controlled and happily living alongside the other org's applications.

Again, see the docs on how to try it out yourself and get started. I made it with the intention that it's really easy to get going and use. 
I also tried to make it easy to debug your checks as you build them, knowing that sometimes validation can get complicated.
Feedback and ideas are greatly appreciated.  As of this writing, there's a couple minor bugs and a few enhancement ideas in the backlog, but we've been using it in production for a while without major issue so far.
I plan to keep extending and investing in this project as long as it's useful to myself and others.

# Thanks
Thanks to Nathan Hartwell for his original ideas on the app. Even though I wrote it from scratch in a different language, I started with a lot of his ideas.
Thanks to Ted Naleid for a great idea on how to make templated checks slicker.  
I also discovered some really nice utility libraries in this project; thanks to everyone that has contributed to them:

- [CLIKT](https://ajalt.github.io/clikt/) - kotlin command line interface handling
- [Konf](https://github.com/uchuhimo/konf) - This made parsing YAML configs super easy. It's a big and powerful project, and normally for smaller apps I'll use my own [env-override](https://github.com/dtanner/env-override), but I might just keep using Konf from now on.
- [zt-exec](https://github.com/zeroturnaround/zt-exec) - Command execution library. I started with implementing my own usage of ProcessBuilder, but there's a ton of ways to cut yourself. This has been both simple and sturdy.

