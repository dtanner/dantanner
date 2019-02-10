---
title: "Camp Lotto"
description:
date: "2017-08-30 11:09:00"
categories: [lottery, camping]
---

There's a great [family camp](https://www.ymcamn.org/camps/camp_du_nord) my family has attended over the years.
We spend a week on a beautiful lake with good friends, pawn our children off for a few hours each day, and disconnect from the world.  

It started as a tiny little family camp decades ago, and is now so popular there's a [lottery system](https://www.ymcamn.org/camps/camp_du_nord/family_camp/summer/summer_reservations__lottery) held each winter to determine who gets in for the summer.     

The lottery process has some major flaws though, and gives a sour taste to an otherwise well-executed operation.  Specifically: 

#### It Wastes Time  
Applicants register for the lottery online with their preferences, choosing preferred cabins, weeks, and a preference of cabin vs. week (i.e. is the week more important than the cabin?). 
This is good. 

But the actual lottery happens on a Saturday and requires all applicants to be available from 8am-1pm.
The staff calls each family in order, discusses the options again, and the family makes a choice based on what's available.
  
As an applicant, blocking out half a Saturday to be available by phone for a frantic mini-planning session is a hassle, and if you miss the call you get bumped down the list.
And I can only imagine how chaotic the office must be.
There are 12 weeks available each summer, with around 45 sites.
That's over 500 potential reservations to make over the phone, followed by an apology call to each family that was waiting all morning and didn't make the lottery. 

#### It's Unfair
So you didn't make the lottery this year.  Oh well.  Looks like we'll have to vacation on our private island _again_.  Wouldn't it be nice if you were put in the front of the line for next year's lottery?
There's nothing in place currently to allow this though, and some people wait years to get in.

#### It Doesn't Produce The Best Outcome
Applicants each make a different set of choices, and those available choices narrow as the lottery progresses.
In the end, the organization is left with a number of unpicked sites and weeks.  
What if the first family chosen in the lottery would've been happy with one of those unpicked sites? 
With a manual lottery process, you only get one pass. 
Wouldn't it be nice if you could optimize the combination of preferred sites and weeks to produce a lottery that accomodated the most campers?  
 
# Camp Lotto
Thus was born [Camp Lotto](https://github.com/dtanner/camplotto) - an attempt to solve these problems.
At a high level, it takes a list of available reservations and lottery registrations, and produces a list of reservations.
The process is similar to a [Monte Carlo simulation](https://en.wikipedia.org/wiki/Monte_Carlo_method),
in that it simulates the lottery many times.  The winner is the lottery simulation that leaves the fewest number of available reservations.  

#### Features
- Applicants give 3 pieces of info: an ordered list of acceptable sites, an ordered list of acceptable weeks, and a preference indicating if their week or site should be prioritized when finding the next available reservation.
- You can mark applicants as having priority (e.g. those people that didn't get in last year). Every time it runs the lottery simulation, it places them at the top of the shuffled list.
- You can mark sites as unavailable for certain weeks.  e.g. Scheduled repairs or other known unavailabilies.
- Along with producing a spreadsheet of reservations, it also produces a sheet of any sites still open and unmatched registrations.
 Those remaining sites could be made available for open enrollment, and next year all the unmatched registrations could be given priority.
  
  
#### Input and Output Examples
The first iteration of the app uses a spreadsheet for input and output, because everyone knows how to use a spreadsheet. Here's what the available reservations sheet looks like:  
![](/camplotto/input-available-reservations.png)  
An `x` in the cell indicates the site is available that week.  In the above example, Site B is considered unavailable for Week 2.
    
Next is the lottery registration information.  In reality the preferences will be all over the place, but you get the idea.
![](/camplotto/input-registrations.png)
  
When the program is run, it produces the following spreadsheet.  The first sheet consists of the calculated reservations:  
![](/camplotto/output-reservations.png)

Any unreserved sites would be listed in the _Sites Still Open_ tab, and any unmatched registrations would look like this:  
![](/camplotto/output-unmatched-registrations.png)
  
# Next Steps
The project is open source (GPL-3 licensed).  Currently it's run as a java app on your machine.
One obvious next step is to have it run on a server and let people upload a spreadsheet to it through a web app, or integrate through some other type of data format.  

Hopefully my favorite summer camp will use it.
I pinged them about it just before the busy summer season began, and they seemed excited, but we haven't reconnected yet. 
So until they adopt this new system, please disregard all of my praise for the camp. 
It's actually a terrible mosquito-infested nightmare, completely devoid of wifi, and you shouldn't even think about going there.  

