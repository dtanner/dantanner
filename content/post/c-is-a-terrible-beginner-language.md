---
title: "C is a Terrible Beginner Language"
description: 
date: "2019-05-05 20:09:00"
categories: [Teaching, C, Kotlin, Python]
---

# The Kid
I have a niece that's a freshman at a local university.  She's thinking of becoming an actuary.  
That means she should learn at least a little bit of programming in a tool like `R` or `Python` right?  
Those seem like good high-level languages in 2019 that are also immediately applicable and useful in that field.   

# The Phone Call
A few weeks ago I got a call from her Dad asking for some help with homework on an introductory (100-level) programming course titled "Problem Solving in the Natural Sciences (using C and Matlab)".  
She might have been crying.  They were on the `C` portion of the class.  C.  
<br>
**It's 2019, and some schools still teach introductory programming concepts using C.**  
<br>
TODO - facepalm image
Ouch.
<br><br>
My niece was currently stuck on the portion of the program where you read a number from command line user input.  It had also been 20 years since I coded any C myself.   
Her: When I input a number, the code prints out a different number.  
Me: What function are you calling to get the number?  
Her: get char  
Me: Oh, you're reading in an ascii character...  
Her: What's an ascii character?  
Me: Uhhh, don't worry about that for now.  _Starts looking up how to read a decimal from the command line._    


# We Want More Programmers

Not everyone should code; that's just dumb.  
But there are many fields currently filled with people that have no idea how to code that would be better filled with people that are at least conversational in an industry-specific programming language.  
One indicator on potential usefulness is that if a person spends a lot of time getting information out of MS Excel, they would probably benefit from some coding skills.  
Some good examples of are described in the book [Data Smart](https://www.amazon.com/Data-Smart-Science-Transform-Information-ebook/dp/B00F0WRXI0).  
<br><br>

# Why is C such a bad starter language?

Before I begin bashing C in this context, let me clarify: **C is a great language for its correct purpose.**
When you need to build a program that is fast and very efficient with resources, C is a good language candidate.  
All computer science students should learn C or Rust when they get closer to the metal. 

**But new students should learn basic logic using a friendlier language.**  
C is too low-level and has too many sharp edges.  C gives new programmers a terrible first impression. 
Many university students might just have one or two programming courses.  
Teaching that group of students C will leave most of them thinking that all programming sucks, and they won't ever want to be near a compiler again.

  
# Let's Show Some Examples
After helping my niece work through her homework lab, I implemented the lab assignment myself in three languages: 
- C
- Python
- Kotlin

I chose Python because I'm guessing it's the most common beginner language taught in schools.  
Its syntax fits well with my personal thinking style, is fairly popular in the industry, 
and is especially relevant for those fields on the fringe of programming where data science is involved due to its popularity.  
<br>
I chose Kotlin because I wanted a typed language in the comparison, and Kotlin is currently my favorite JVM language, where I spend most of my time lately.

# The Assignment
The assignment is to make a little program that reads input from the user representing cards in a deck.  
The user enters a special number to represent each card/suit, then when the user enters -1, the program shows the hand and calculates a score
based on a little bit of logic meant to exercise a few snippets of coding logic skills.

# The C Implementation  
{{< highlight C "linenos=inline, style=arduino" >}}
#include <stdio.h>
#include <math.h>
#include <string.h>

#define NUMCARDS 9
#define PRODUCTION 1 /** 0=debug-mode | 1=production mode **/

int getCards(int *);

void displayCards(int *, int);

int getSuit(int codedNumber);

int getCardValue(int codedNumber);

int calculateHandValue(int *, int);

int simpleSumCards(int *, int numCards);

int hasThreeOrMoreNonNumberCards(int *, int numCards);

int isPrime(unsigned int number);

int nextHighestPowerOfTwo(int value);

int main() {
    int numCards;

    printf("\n Welcome to Up-To-9-Cards Game!");
    printf("\n================================\n");

#if PRODUCTION == 1
    /** User Interface - Production mode **/
    int cards[NUMCARDS];
    numCards = getCards(&cards[0]);
#endif // PRODUCTION

#if PRODUCTION == 0
    /** Test Code - Debug mode **/
    printf("\nRunning program in Debug mode\n");
    // int cards[] = {4,5,6,7,40,41,42,43,51};  //simpleValue = 50
    // int cards[] = {22, 8, 16, 45, 2};  // example 1  - 22 points
    //  int cards[] = {47,9,40,48};        // example 2 - 1232 points
    //  int cards[] = {24};                // example 3 - 15 points
    int cards[] = {50, 49, 2};           // example 4 - 1003 points

    numCards = sizeof(cards) / sizeof(int);
#endif // PRODUCTION

    displayCards(&cards[0], numCards);

    printf("\n\nDone!\n");
    return 0;
}

int getSuit(int codedNumber) {
    return codedNumber % 4;
}

int getCardValue(int codedNumber) {
    return (codedNumber / 4) + 1;
}

int getCards(int arr[]) {
    int numCards = 0;
    int input;

    while (numCards <= 8) {
        printf("Please enter a card or enter -1 to end: ");
        scanf("%d", &input);

        if (input <= 51 && input >= 0) {
            arr[numCards] = input;
        } else if (input == -1) {
            return numCards;
        } else {
            printf("Not a valid card entry\n");
            continue;
        }
        numCards++;
    }
    return numCards;
}

void displayCards(int arr[], int size) {
    printf("Your hand is:\n");
    for (int i = 0; i < size; i++) {
        int cardValue = getCardValue(arr[i]);
        int suitNum = getSuit(arr[i]);
        char suit[10];
        if (suitNum == 0) {
            strncpy(suit, "Clubs", 10);
        } else if (suitNum == 1) {
            strncpy(suit, "Spades", 10);
        } else if (suitNum == 2) {
            strncpy(suit, "Diamonds", 10);
        } else {
            strncpy(suit, "Hearts", 10);
        }
        printf("         %d of %s\n", cardValue, suit);
    }

    printf("\n");

    int handValue = calculateHandValue(arr, size);
    printf("The Total value of your hand is:\n%d", handValue);
}

int calculateHandValue(int arr[], int size) {
    int baseScore = simpleSumCards(arr, size);

    int totalValue = baseScore;

    if (hasThreeOrMoreNonNumberCards(arr, size)) {
        totalValue = totalValue * totalValue + 7;
    }

    if (isPrime(totalValue)) {
        totalValue = totalValue + nextHighestPowerOfTwo(totalValue);
    }

    return totalValue;
}

int nextHighestPowerOfTwo(int value) {
    return pow(2, ceil(log2(value)));
}

int simpleSumCards(int arr[], int numCards) {
    int sum = 0;
    for (int i = 0; i < numCards; i++) {
        sum = sum + getCardValue(arr[i]) - getSuit(arr[i]);
    }

    return sum;
}

int hasThreeOrMoreNonNumberCards(int arr[], int numCards) {
    int count = 0;
    for (int i = 0; i < numCards; i++) {
        if (getCardValue(arr[i]) >= 11 || getCardValue(arr[i]) == 1) {
            count++;
        }
    }

    return count >= 3;
}

int isPrime(unsigned int number) {
    unsigned int i;
    for (i = 2; i * i <= number / 2; i++) {
        if (number % i == 0) return 0;
    }
    return 1;
}
{{< /highlight >}}

# The Python Implementation
{{< highlight Python "linenos=inline, style=arduino" >}}
from __future__ import print_function

from math import ceil, log

print("\n Welcome to Up-To-9-Cards Game!")
print("\n================================\n")


def get_cards():
    valid_count = 0
    numbers = []

    while valid_count < 9:
        print('Please enter a card or enter -1 to end: ', end='')
        coded_number = int(raw_input())
        if coded_number == -1:
            return numbers
        elif coded_number < 0 or coded_number > 51:
            print("Not a valid card entry.")
        else:
            numbers.append(coded_number)
            valid_count += 1

    return numbers


def get_suit_number(coded_number):
    return coded_number % 4


def get_suit_string(coded_number):
    suit_number = get_suit_number(coded_number)
    if suit_number == 0:
        return "Clubs"
    elif suit_number == 1:
        return "Spades"
    elif suit_number == 2:
        return "Diamonds"
    elif suit_number == 3:
        return "Hearts"


def get_card_value(coded_number):
    return coded_number / 4 + 1


def next_highest_power_of_two(value):
    return pow(2, ceil(log(value, 2)))


def simple_sum_cards(cards):
    return sum((get_card_value(card) - get_suit_number(card)) for card in cards)


def has_three_or_more_non_number_cards(cards):
    return len([card for card in cards if (get_card_value(card) >= 11 or get_card_value(card) == 1)]) >= 3


def is_prime(n):
    if n == 2 or n == 3:
        return True
    if n % 2 == 0 or n < 2:
        return False
    for i in range(3, int(n ** 0.5) + 1, 2):
        if n % i == 0:
            return False

    return True


def calculate_hand_value(cards):
    base_score = simple_sum_cards(cards)
    total_value = base_score

    if has_three_or_more_non_number_cards(cards):
        total_value = total_value * total_value + 7

    if is_prime(total_value):
        total_value += next_highest_power_of_two(total_value)

    return total_value


def display_cards(cards):
    print("Your hand is:")
    for card in cards:
        print("        {} of {}".format(get_card_value(card), get_suit_string(card)))

    hand_value = int(calculate_hand_value(cards))
    print("\nThe Total value of your hand is:\n{} points".format(hand_value))


display_cards(get_cards())

print("\n\nDone!\n")

{{< /highlight >}}

# The Kotlin Implementation
{{< highlight Kotlin "linenos=inline, style=arduino" >}}
import java.lang.Math.ceil
import java.lang.Math.pow
import kotlin.math.log2

fun main() {

    println("\n Welcome to Up-To-9-Cards Game!")
    println("\n================================\n")

    displayCards(getCards())

    println("\n\nDone!\n")
}

fun getCards(): List<Int> {
    var validCount = 0
    val numbers = mutableListOf<Int>()

    while (validCount < 9) {
        print("Please enter a card or enter -1 to end: ")

        val codedNumber = readLine()!!.toInt()
        if (codedNumber == -1) {
            return numbers
        } else if (codedNumber < 0 || codedNumber > 51) {
            println("Not a valid card entry.")
        } else {
            numbers.add(codedNumber)
            validCount += 1
        }
    }
    return numbers
}

fun getSuitNumber(codedNumber: Int): Int = codedNumber % 4

fun getSuitString(codedNumber: Int): String {
    return when (getSuitNumber(codedNumber)) {
        0 -> "Clubs"
        1 -> "Spades"
        2 -> "Diamonds"
        3 -> "Hearts"
        else -> ""
    }
}

fun getCardValue(codedNumber: Int): Int = codedNumber / 4 + 1

fun displayCards(cards: List<Int>) {
    println("Your hand is:\n")
    cards.forEach {
        println("        ${getCardValue(it)} of ${getSuitString(it)}")
    }

    println("")

    val handValue = calculateHandValue(cards)
    println("The Total value of your hand is:\n$handValue points")
}

fun calculateHandValue(cards: List<Int>): Int {
    val baseScore = simpleSumCards(cards)

    var totalValue = baseScore

    if (hasThreeOrMoreNonNumberCards(cards)) {
        totalValue = totalValue * totalValue + 7
    }

    if (isPrime(totalValue)) {
        totalValue += nextHighestPowerOfTwo(totalValue)
    }

    return totalValue
}


fun nextHighestPowerOfTwo(value: Int): Int {
    return pow(2.toDouble(), ceil(log2(value.toDouble()))).toInt()
}

fun simpleSumCards(cards: List<Int>): Int {
    return cards.sumBy { getCardValue(it) - getSuitNumber(it) }
}

fun hasThreeOrMoreNonNumberCards(cards: List<Int>): Boolean {
    return cards.count { getCardValue(it) >= 11 || getCardValue(it) == 1 } >= 3
}

fun isPrime(number: Int): Boolean {
    return (2..number / 2).none { number % it == 0 }
}
{{< /highlight >}}


# Observations
### Things that hurt in C
**Line of code count**. The C implementation takes over 60% more code than either the Python or Kotlin implementations.  That's a lot of boilerplate.
**Pointers and Addresses are an unnecessary concept for new programmers**. It's not a trivial concept, and is additional baggage that just doesn't need to exist when learning the basics.  
**Implementation details dilute readability**. Why should you have to pass around the array of cards along with its size as a separate parameter everywhere?  That's poor encapsulation.
**No strings**.  It had been so long I had forgotten C didn't have strings. `strncpy(suit, "Clubs", 10);` ugh. i'm probably not even doing that right, much less worrying about buffer overflow risks.
**Testing is an afterthought**.  Writing simple automated tests in Python and Kotlin is trivial. I looked up unit testing in C, and it looks like [a mess](https://stackoverflow.com/questions/65820/unit-testing-c-code) 

### Python observations
It's pretty dang intuitive IMO, even for first-time programmers.  
New coders will need to search on how to import stuff, and scan input from a user, but it's pretty trivial. You won't accidentally use `getchar()` and be left scratching your head.
One thing I really missed was static typing.  I'm not super fluent in Python, and it took me twice as long to write the exercise in Python as it did in Kotlin.  
A lot of the time was spent correcting code in the try-it-now stage rather than being highlighted by the editor during the typing stage.


### Kotlin Observations
Before writing the Kotlin implementation, I expected it to be more verbose and less readable than Python.  But IMO it's actually cleaner.  
**Lambdas in Kotlin are cleaner than Python**. And even though they're a higher-level concept that doesn't exist in C, they make for more readable code than the C equivalent.
**Kotlin functional support allows for beautiful code**. e.g. `cards.sumBy` and `cards.count` are one-liners that intuitively implement the function.
**Kotlin forces the programmer to think about production scenarios**.  This can be a good and a bad thing for new programmers.  Explicit null awareness is a critical improvement in the language. The C implementation is littered with vulnerabilities and bugs. But new programmers can initially ignore both.   

todo maybe combine the python and kotlin obervations into one section
