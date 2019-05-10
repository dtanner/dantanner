---
title: "Please Don't Teach C to Beginning Programmers"
description: 
date: "2019-05-05 20:09:00"
categories: [Teaching, C, Kotlin, Python]
---

# The Kid
I have a niece that's a freshman at a local university.  She's thinking of becoming an actuary.  
That means she should learn at least a little bit of programming in a tool like `R` or `Python`, right?  
Those seem like good high-level languages in 2019 that are also applicable in that field.   

# The Phone Call
A few weeks ago I got a call from her Dad asking for some help with homework on an introductory (100-level) programming course titled "Problem Solving in the Natural Sciences (using C and Matlab)".  
They were on the `C` portion of the class.  
<br>
**It's 2019, and some schools still teach introductory programming concepts using C.**  
<br>
Ouch.
<br><br>
My niece was currently stuck on the portion of the program where you read a number from command line user input. 
It had also been 20 years since I wrote any C myself.   
<br>
Her: When I input a number, the code prints out a different number.  
Me: What function are you calling to get the number?  
Her: get char  
Me: Oh, you're reading in an ascii character.  
Her: What's an ascii character?  
Me: Uhhh, don't worry about that for now.  _Starts looking up how to read a decimal from the command line._    


# We Want More Programmers

Not everyone should code; that's just dumb.  
But there are many fields currently filled with technology-averse people, when those roles would be much better performed by people with at least conversational coding abilities.  
Think about jobs where people do a lot of data analysis using Excel.  Most of them could really benefit from some coding skills. 
[Data Smart](https://www.amazon.com/Data-Smart-Science-Transform-Information-ebook/dp/B00F0WRXI0) is pretty eye-opening on that front.  
The book shows you some really neat ways to discover information about your data, and optimize your business in ways you didn't know were possible.
These tools are usable with dozens of hours of training, not thousands.
<br><br>

# Why is C such a bad starter language?

Before I begin bashing C in this context, let me clarify: **C is a great language for its correct purpose.**
When you need to build a program that is fast and very efficient with resources, C is still a good language candidate.  
All computer science students should learn C (or maybe Rust) when they get closer to the metal. 

**But new students should learn the basics using a friendlier language.**  
C is too low-level and has too many sharp edges. 
Many university students might just have one or two programming courses.  
Teaching that group of students C will leave many of them thinking all programming sucks, and they won't ever want to be near a compiler again.

  
# Let's Show Some Examples
After helping my niece work through her homework lab, I implemented the lab assignment myself in three languages: `C`, `Python`, and `Kotlin`.

I chose Python because I'm guessing it's the most common beginner language taught in schools.  
Its syntax fits well with my personal thinking style, is fairly popular in the industry, 
and is especially relevant for those fields on the fringe of programming where data science is involved due to its popularity.  
<br>
I chose Kotlin because I wanted a typed language in the comparison. It's currently the best Java-based language, and is where I spend most of my time lately.  

# The Assignment
The assignment is to make a little program that reads input from the user representing cards in a deck.  
The user enters a number to represent each card/suit, then when the user enters -1, the program shows the hand and calculates a score
based on arbitray scoring rules meant to exercise basic logic and programming.
Full implementations open in new tabs here:
<a href="https://gist.github.com/dtanner/b3cf09c59b0fd7e1389f635d817facd6" target="_new">C</a> | 
<a href="https://gist.github.com/dtanner/a7a154a12600519cb1fda47723c3e1f1" target="_new">Python</a> |
<a href="https://gist.github.com/dtanner/54a8dc0e111d9b62d44fff6501266d1c" target="_new">Kotlin</a>
<br>
<br>

# Observations
### Things that hurt in C

* **Line of code count**. The C implementation is about 60% more lines (143) than either the Python (92) or Kotlin (85) implementations. 
It's a lot of now unnecessary boilerplate like function definitions, and also bloated from a lack of collection operators. 
To be fair, some of the cruft is test code, but this actually relates to the next criticism.
* **Testing is an afterthought**.  Writing simple automated tests in Python and Kotlin is trivial. e.g. This is a passing test using tooling built into my IDE:
{{< highlight Kotlin "linenos=inline, style=arduino" >}}
    @Test
    fun calculateHandValue() {
        assertEquals(22, calculateHandValue(listOf(22, 8, 16, 45, 2)))
        assertEquals(1232, calculateHandValue(listOf(47,9,40,48)))
        assertEquals(15, calculateHandValue(listOf(24)))
    }
{{< /highlight >}}
I looked up unit testing in C, and it looks like [a mess](https://stackoverflow.com/questions/65820/unit-testing-c-code). 
Compilation hassles (the first example has you running a java program to generate the header file), 
a confusing number of choices, and platform incompatibilities will ward off beginners. 
* **Pointers and Addresses are an unnecessary concept for new programmers**. It's not a trivial concept for most beginners, and doesn't need to exist when learning the basics.  
{{< highlight C "linenos=inline, style=arduino" >}}
int getCards(int *); // asterisk means a pointer
totalValue = totalValue * totalValue + 7; // asterisk here means multiplication 
numCards = getCards(&cards[0]); // ampersand here references an address
f (input <= 51 && input >= 0) { // double ampersand here is a logical operator
{{< /highlight >}}
* **Language implementation details dilute quality of code**. For example, passing around the array of cards along with its size as a separate parameter in the C implementation is less readable and maintainable, but necessary. 
{{< highlight C "linenos=inline, style=arduino" >}}
void displayCards(int arr[], int size) {
{{< /highlight >}}
Compare this to the same functions in Python and Kotlin:
{{< highlight Python "linenos=inline, style=arduino" >}}
def display_cards(cards):
{{< /highlight >}}
{{< highlight Kotlin "linenos=inline, style=arduino" >}}
fun displayCards(cards: List<Int>) {
{{< /highlight >}}
* **No strings**.  It had been so long I had forgotten C doesn't have strings.  
`strncpy(suit, "Clubs", 10);` ugh. i'm probably not even doing that right, much less worrying about buffer overflow risks.

<br>
### Python observations
It's pretty dang intuitive IMO, even for first-time programmers.  
New coders will need to search on how to import stuff, and scan input from a user, but it's pretty trivial. You won't accidentally use `getchar()` and be left scratching your head.
One thing I really missed was static typing.  I'm not super fluent in Python, and it took me twice as long to write the exercise in Python as it did in Kotlin.
A lot of the time was spent correcting code in the try-it-now stage rather than being highlighted by the editor during the typing stage.


### Kotlin Observations
Before writing the Kotlin implementation, I expected it to be more verbose and less readable than Python, because Java.
But IMO it's actually cleaner.

* **Lambdas in Kotlin are cleaner than Python**. And even though they're a higher-level concept that doesn't exist in C, they make for more readable code than the C equivalent. 
e.g. Compare these two one-liners in Kotin and Python
{{< highlight Python "linenos=inline, style=arduino" >}}
return sum((get_card_value(card) - get_suit_number(card)) for card in cards)
{{< /highlight >}}
{{< highlight Kotlin "linenos=inline, style=arduino" >}}
return cards.sumBy { getCardValue(it) - getSuitNumber(it) }
{{< /highlight >}}
Kotlin is the newest language of the bunch, so had more time to incorporate the best design features from the latest languages. 
That said, I wasn't taught lambdas when I was first learning, so don't know if this would be a handy feature or just one more thing to learn for most beginners.   

* **Kotlin expands Java's already good Collection support for beautiful concise code**. e.g. `cards.sumBy` and `cards.count` are one-liners that intuitively implement the function.
In C's brevity, you have to write more code, and this makes it less readable in most cases:
{{< highlight C "linenos=inline, style=arduino" >}}
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
{{< highlight Kotlin "linenos=inline, style=arduino" >}}
fun hasThreeOrMoreNonNumberCards(cards: List<Int>): Boolean {
    return cards.count { getCardValue(it) >= 11 || getCardValue(it) == 1 } >= 3
}
{{< /highlight >}}

* **Kotlin forces the programmer to think about production scenarios**.  This adds a little bit of extra work up front for the programmer, but this saves a lot of time in the end and greatly improves the quality of code.
Explicit null awareness is a critical improvement in the language. The C implementation is littered with vulnerabilities and bugs.  
One might argue Python is a better introductory language because you can ignore a lot more when focusing on learning and not making a production app. I think this is true.
That said, Kotlin does make it easy to ignore yet still be obvious when you're working with a nullable variables.
The `!!` in `readLine()!!.toInt()` indicates we know the input could be null, but we're gonna assume it's not.  
<br>
# Comparison
I don't know how many schools still teach C to beginners.
Their stated reasons might be similar to the response I received when I emailed the chair of the department asking why they're still teaching `C` to beginning programmers.
The two main points from the response:  

* The course is largely a service course for engineering students, as those programs require their students to use C throughout their curriculum.  
* The course is subject to Engineering program accreditation standards.

<br><br>
I obviously disagree with the first point enough to have spent the time to write this article. 
I think it's a big deal to start students with the language that will give them the most promise in their future.   
To the second reason of accreditation standards, I don't know where this comes from. 
Maybe good intentions, maybe good overall guidance; I'm skeptical about its merits in this decision for a couple reasons.
The most convincing reason is to glance at what some of the top universities in the U.S. teach new students:

| School | Language |
| --- | --- |
| MIT | [Python](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-00-introduction-to-computer-science-and-programming-fall-2008/) |
| Carnegie Mellon | [Python](https://www.cs.cmu.edu/~15110/syllabus.html) |
| Stanford | [Java](https://web.stanford.edu/class/cs106a/) |
| Cornell | [Python](http://www.cs.cornell.edu/courses/cs1110/2019sp/) |
| University of Washington | [Java](https://courses.cs.washington.edu/courses/cse142/)

These are some of our best schools, and they all teach either Python or Java to their new students.  Java's no Kotlin, but I get that Kotlin is a relatively new language,
and it takes time to make a major switch even when the language is in the same family. 

# Summary and Suggestion

These are some of the typical paths in today's landscape. 
In only one of them do I think knowledge of a low-level language like C is important (embedded systems).
The rest would be better off using other specialized or higher-level general languages.
![](/intro-programming/language-track.svg)

