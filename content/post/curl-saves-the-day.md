---
title: "curl saves the day"
description:
date: "2017-07-15 13:09:00"
categories: [curl, networking]
---

Every developer should be comfortable with [curl](https://curl.haxx.se).    

For the same reason that you should at least be conversational in tools like sed, awk, and vi, you should be able to quickly type in something like
like `curl -v localhost:8080` to see what's going on.  It's available on just about every unix-based box for a good reason.  

Like its man page states, the number of features will make your head spin.  That's probably the most discussed reason people are turned off by it.
You don't have to understand all its features though; learn five of them and you'll be able to quickly solve problems you couldn't before.  
 
Memorize the basics, and keep notes of the more advanced problems you solve with it for the future. 

# The Basics

**GET something**  
`curl https://jsonplaceholder.typicode.com/posts/1`

**Verbose output [-v]** (e.g. show response status, headers, etc..):  
`curl -v https://jsonplaceholder.typicode.com/posts/1`

**Allow insecure SSL connections [-k]** (useful for self-signed certs):  
`curl -k https://untrusted-root.badssl.com/` (try it without `-k`)

**Add a header [-H name: value]**:  
`curl -H "Content-Type: application/json" https://jsonplaceholder.typicode.com/posts/1`

**POST a file [-X POST and -d @file-path]**:  
`curl -X POST -d @/tmp/foo.json https://jsonplaceholder.typicode.com/posts/1`

# More Advanced Usage

If you leave with nothing but the knowledge of what's above, you'll be in great shape.
You'll be able to quickly solve situations with minimal effort and tooling.  But keep reading to get a glimpse of advanced features.   
  
Below are examples of commands I keep in my /notes/curl.md file.

### Get a service 100 times, and get a count of the response codes returned
This is really handy when you have a service that is misbehaving, and you want to get a quick idea of how it's responding beyond a single request.
For example, you might find that 25% of requests fail, then discover that 1/4 of your servers are misconfigured.
```
curl -sL -w "%{http_code}\\n" -o /dev/null "https://foo.com/?[1-100]" | sort | uniq -c
     23 200
     77 503
```
Explanation of the arguments:  
`-s`: silent/quiet mode.  don't show progress meter or error messages.  
`-L`: follow redirects   
`-w "%{http_code}\\n"`: make curl write out the http code of the response, followed by a new line   
`-o /dev/null`: write the response to a file (in this /dev/null, meaning we don't care)  
`?[1-100]`: [] is a range specifier.  In this case, execute a request for every value in the range.  e.g. foo.com?1, foo.com?2, etc...  
    
Then we pipe the response code output to `sort` and `uniq -c`, which gives us a count of each response code.
From the above sample output, there were 23 responses with a 200 response code, and 77 responses with a 503 response code.  Not good!  

Also note that the URL in this example is quoted.  This enables us to use special characters like the `?` query parameter without having to escape them.
 
Similar to the range specifier is the sequence operator, e.g. `{a, b}`.  
e.g. Type one curl command, but have it use a few different argument values, or have it hit each of your servers individually. 

### Get response time
Similar to the above example, but just returns the total response time in seconds.  
```
curl -sL -w "%{time_total}\\n" -o /dev/null "https://jsonplaceholder.typicode.com/posts/1"

1.412
```

 
### Measure network performance for the request segments
The following example is really useful when want to quickly see where your request is taking its time.  
```bash
curl -sL -w '   namelookup: %{time_namelookup}\n      connect: %{time_connect}\n   appconnect: %{time_appconnect}\n  pretransfer: %{time_pretransfer}\n     redirect: %{time_redirect}\nstarttransfer: %{time_starttransfer}\n        total: %{time_total}\n\n' -o /dev/null "https://jsonplaceholder.typicode.com/posts/1"

   namelookup: 0.071
      connect: 0.109
   appconnect: 0.349
  pretransfer: 0.349
     redirect: 0.000
starttransfer: 0.379
        total: 0.379
```

# A case of curl saving my bacon
Recently our team deployed a new mobile app, to a new company warehouse, using a new network provider, in a new server infrastructure.  
The users reported occasional slow response times in the application. ugh - so many variables.  
Our server API stats were all consistently fast.  Load testing our services showed adequate performance, both from the warehouse and from headquarters.
What also made this difficult was that during the alpha testing, initial actual usage was so low that our initial performance metrics didn't show any patterns. 

Given that we couldn't reproduce the issue internally, but could see it was only happening in the warehouse on the warehouse mobile device network, implied a network issue.
But the network support staff couldn't find any issues, so we were stumped for a little while.   

I went to the warehouse to help support the rollout and used the above examples to eventually find the problem.  
This was the first command that pointed me toward the real issue:
```bash
while true; do curl -sL -w "%{time_total}\\n" -o /dev/null 'https://oursite.com/health'; sleep 5; done
0.293
0.298
0.426
0.292
0.833
5.823
0.283
0.296
0.296
0.293
0.295
0.553
0.294
0.817
0.289
0.295
0.300
5.828
0.364
0.300
...
```

Notice any pattern?  Every minute we got a slow response!  That smells like a lookup or a caching issue.
So I issued this command to measure network segment performance: 
```bash
curl -sL -w '   namelookup: %{time_namelookup}\n      connect: %{time_connect}\n   appconnect: %{time_appconnect}\n  pretransfer: %{time_pretransfer}\n     redirect: %{time_redirect}\nstarttransfer: %{time_starttransfer}\n        total: %{time_total}\n\n' -o /dev/null "https://oursite.com/health"
   namelookup: 5.543
      connect: 5.588
   appconnect: 5.770
  pretransfer: 5.770
     redirect: 0.000
starttransfer: 5.823
        total: 5.823
```

`namelookup` indicates the amount of time it took to do a DNS name lookup.  i.e. The primary DNS server configured for the device was failing to find the server.
The backup server *was* working though.  The device cached the IP address of the server for a minute, and when the cache expired, the process repeated itself. 
Boom!  Using a different DNS server while we fixed the underlying DNS issue solved the problem.  

# Summary
- curl's basic and most common features are easy to use and memorize
- it has a huge feature list
- it will almost always be available on the *nix server you're shelled in to
- it integrates beautifully with other shell commands to build up your desired solution  
  
curl has dozens of arguments for its features, and it's easy to get lost in its man pages, but it's good stuff. 
And since curl is available on just about every system I use, it's been worth the small investment of time for me.
Here's the official page for its [command line options](https://ec.haxx.se/cmdline-options.html). 


