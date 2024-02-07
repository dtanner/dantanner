---
title: "Please Don't Teach C to Beginning Programmers"
description: 
date: "2019-05-05 20:09:00"
categories: [Teaching, C, Kotlin, Python]
---

# The Student
I have a niece in her first year at a local university.  She's never done any programming before, and thinking of becoming an actuary. 
That means she should learn at least a little bit of programming in a tool like `R` or `Python`, right? 
Those seem like good high-level languages in 2019 that are also applicable in that field.   

# The Phone Call
A few weeks ago I got a call from her Dad asking for some help with homework on an introductory (100-level) programming course titled "Problem Solving in the Natural Sciences (using C and Matlab)". 
They were on the `C` portion of the class.  My reaction was, _some schools still teach C as an introduction to programming?_
My niece was currently stuck on the portion of the program where you read a number from the command line. 
It had also been 20 years since I wrote any C myself.   
<br>
Her: _When I read a number and print it, the code prints out a different number._  
Me: _What function are you calling to get the number?_  
Her: _get char_  
Me: _Oh, you're reading in an ascii character._  
Her: _What's an ascii character?_  
Me: _Uhhh, don't worry about that for now. (Starts looking up how to read a decimal from the command line.)_    


# We Want More Programmers

There are many fields currently filled with technology-averse people, when those roles would be much better performed by people with at least conversational coding abilities.  
Think about jobs where people do a lot of data analysis using Excel.  Many of them could really benefit from some coding skills, even if it's just some scripting. 
The book [Data Smart](https://www.amazon.com/Data-Smart-Science-Transform-Information-ebook/dp/B00F0WRXI0) was pretty eye-opening for me in terms of power and simplicity. 
It shows some really neat ways to discover information about data, and optimize business problems in ways I didn't know were possible.
And these tools are usable with dozens of hours of training, not thousands.
<br>

# Why is C such a bad starter language?

Before I begin bashing C in this context, let me clarify: **C is a great language for its correct purpose.**
When you need to build a program that is fast and very efficient with resources, C is still a good language candidate. 
All computer science students should learn C (or maybe Rust now?) when learning closer to the metal. 

**But new students should learn the basics using a friendlier language.**  
C is too low-level and has too many sharp edges. 
Many university students might just have one or two programming courses total. 
Teaching that group of students C will leave many of them thinking all programming sucks, and they won't ever want to be near a compiler again.

  
# Let's Show Some Examples
After helping my niece work through her homework lab, I implemented the assignment myself in three languages: `C`, `Python`, and `Kotlin`.
Python because I'm guessing it's the most common initial language taught in schools, and I think it's a really good teaching language. 
Kotlin because I wanted a typed language in the comparison, and I know Java's a popular language taught in schools. 
I didn't choose Java because no one ever wants to touch Java after they've used Kotlin.  

# The Assignment
The assignment is to make a little program that reads input from the user representing cards in a deck. 
The user enters a number to represent each card/suit, then when the user enters -1, the program displays the hand and calculates a score
based on arbitrary scoring rules meant to exercise basic logic and programming.
Implementations here:
[C](https://gist.github.com/dtanner/b3cf09c59b0fd7e1389f635d817facd6) | 
[Python](https://gist.github.com/dtanner/a7a154a12600519cb1fda47723c3e1f1) | 
[Kotlin](https://gist.github.com/dtanner/54a8dc0e111d9b62d44fff6501266d1c)

# Observations
### C Observations
* **Pointers and Addresses are an unnecessary concept for new programmers**. It's not a trivial concept for most beginners, and doesn't need to exist when learning the basics.  
I think this [stackoverflow post](https://stackoverflow.com/questions/4025768/what-do-people-find-difficult-about-c-pointers) illustrates the difficulties well.
* **Line of code count**. The C implementation is about 60% more lines (143) than either the Python (92) or Kotlin (85) implementations. 
Some of it is unnecessary cruft to learners, like function headers.  Some of it is due to a smaller language feature set like no collection functions.
A smaller feature set is easier to learn, but I love collection functions because they help make the code more readable and concise.
* **Testing is an afterthought**.  Writing simple automated tests in Python and Kotlin is trivial. e.g. This is a passing test using tooling built into my IDE:
{{< highlight Kotlin "style=arduino">}}
@Test
fun calculateHandValue() {
    assertEquals(22, calculateHandValue(listOf(22, 8, 16, 45, 2)))
    assertEquals(1232, calculateHandValue(listOf(47,9,40,48)))
    assertEquals(15, calculateHandValue(listOf(24)))
}
{{< /highlight >}}
C's test support looks like [a mess](https://stackoverflow.com/questions/65820/unit-testing-c-code). 
Compilation hassles (the first example has you running a java program to generate the header file), no built-in support with 
a confusing number of choices, and platform incompatibilities will ward off beginners. 
* **Language constraints dilute quality of code**. 
For example, passing around the array of cards along with its size as a separate parameter in the C implementation makes it less readable and maintainable. 
It's practically required though.
{{< highlight C "style=arduino" >}}
void displayCards(int arr[], int size) {
{{< /highlight >}}
Compare this to the same functions in Python and Kotlin:
{{< highlight Python "style=arduino" >}}
def display_cards(cards):
{{< /highlight >}}
{{< highlight Kotlin "style=arduino" >}}
fun displayCards(cards: List<Int>) {
{{< /highlight >}}
* **No strings**.  It had been so long I had forgotten C doesn't have strings.  
`strncpy(suit, "Clubs", 10);` ugh. i'm probably not even doing that right, much less worrying about buffer overflow risks.

### Python observations
It's pretty dang intuitive IMO, even for first-time programmers. 
You won't accidentally use `getchar()` and be left scratching your head.
One thing I missed was static typing.  I'm not fluent in Python, and it took me twice as long to write the exercise in Python as it did in Kotlin. 
A lot of the time was spent correcting code in the try-it-now stage rather than being highlighted by the editor during the typing stage.


### Kotlin Observations
Before writing the Kotlin implementation, I expected it to be more verbose and less readable than Python, because Java.
But IMO it's actually cleaner in some ways.

* **Lambdas in Kotlin are a little cleaner than Python**. And even though they're a higher-level concept that doesn't exist in C, they both make for more readable code than the C equivalent. 
e.g. compare these two one-liners in Python and Kotin:
{{< highlight Python "style=arduino" >}}
return sum((get_card_value(card) - get_suit_number(card)) for card in cards)
{{< /highlight >}}
{{< highlight Kotlin "style=arduino" >}}
return cards.sumBy { getCardValue(it) - getSuitNumber(it) }
{{< /highlight >}}
Kotlin is the newest language of the bunch, so had more time to incorporate design features from the latest languages. 
That said, I wasn't taught lambdas when I was first learning, so don't know if this would be a handy feature or just one more thing to learn for most beginners.   
* **Kotlin expands Java's already good Collection support for concise code**. e.g. `cards.sumBy` and `cards.count` are one-liners that intuitively implement the function.
In C's syntactic brevity, you write more code and have to manage more state. I speculate this code is harder to read for a beginner compared to the Kotlin equivalent.
{{< highlight C "style=arduino" >}}
int hasThreeOrMoreNonNumberCards(int arr[], int numCards) {
    int count = 0;
    for (int i = 0; i < numCards; i++) {
        if (getCardValue(arr[i]) >= 11 || getCardValue(arr[i]) == 1) {
            count++;
        }
    }
    return count >= 3;
}
{{< /highlight >}}
{{< highlight Kotlin "style=arduino" >}}
fun hasThreeOrMoreNonNumberCards(cards: List<Int>): Boolean {
    return cards.count { getCardValue(it) >= 11 || getCardValue(it) == 1 } >= 3
}
{{< /highlight >}}
* **Kotlin forces the programmer to think about production scenarios**.  This adds a little bit of extra work up front for the programmer, 
but saves time in the end with less debugging and errors.
Explicit null awareness and immutability by default are enormous improvements. My C implementation is littered with vulnerabilities and bugs.  
One might argue Python is a better introductory language because you can ignore a lot more when focusing on learning and not making a production app. I think this is true.
That said, Kotlin does make it easy to ignore yet still be obvious when you're working with a nullable variables.
The `!!` in `readLine()!!.toInt()` indicates we know the input could be null, but we're gonna assume it's not.  
* **Kotlin (a JVM language) requires ceremony**: Without an IDE and Gradle/Maven, things like dependency management and classpaths are burdensome to a beginner.
They're excellent for production use, and IDEs make this a smaller issue, but Python has the least baggage of the bunch. 


# Obstacles and Comparison
I don't know how many schools still teach C to beginners, or what their reasons are.
I asked the chair of the department for my niece's class, and the two main points from the response were:

* The course is largely a service course for engineering students, as those programs require their students to use C throughout their curriculum.  
* The course is subject to Engineering program accreditation standards.

I obviously disagree with the first point enough to have spent the time to write this article. 
I think it's a big deal to start students with the language that will give them the most promise in their future.   
To the second reason of accreditation standards, I don't know exactly what this means, but I'd be surprised language choice is a factor in accreditation.
For comparison, here's what some of the top universities in the U.S. teach new students:

| School | Language |
| --- | --- |
| MIT | [Python](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-00-introduction-to-computer-science-and-programming-fall-2008/) |
| Carnegie Mellon | [Python](https://www.cs.cmu.edu/~15110/syllabus.html) |
| Stanford | [Java](https://web.stanford.edu/class/cs106a/) |
| Cornell | [Python](http://www.cs.cornell.edu/courses/cs1110/2019sp/) |
| University of Washington | [Java](https://courses.cs.washington.edu/courses/cse142/)

These are some of our best schools, and they all teach either Python or Java to their new students. 

# Many Paths

This chart shows some typical career paths in today's schools. 
In only one of them do I think knowledge of a low-level language like C is important (embedded systems). 
 
![](/intro-programming/language-track.svg)

I used to have a much narrower view of what constitutes a programmer. 
It was a few flavors of people that programmed things like robots, games, and other complete software applications. 
Regardless of the field, they all spent most of their time thinking about the programming problem or writing code.  
Today the role of programmer includes a broader set of fields. 
For example, the deep learning specialist that knows how to build and optimize a model, but doesn't know how to productionize it.
Or the business analyst that knows how to make data-driven predictions with a domain-specific language.
It's OK if they know nothing about pointers. 
We *do* want them to build a solid foundation of good principles that are applicable to most languages.
We _don't_ want them to be sitting at their desk two or ten years into their career and be asked to write code without proper initiation.
So please teach more people programming, 
start them off in a language that will put them on the right path, 
and encourage them to keep forging those paths. 
