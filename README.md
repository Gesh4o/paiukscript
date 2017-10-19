# paiukscript ![](https://travis-ci.org/l18m/paiukscript.svg?branch=master)

PaiukScript is simple Javascript based language.

## Language Example

* Variables and Data Types
    ```sh
    # I am a comment.
    number = 5.14;
    text = "Hello";
    bool = true;
    sum = lambda (a,b){ a + b };
    println(sum(1, 3));
    println(sum("1", "3"));
    let (x = 2, y = x + 1, z = x + y)  println(x + y + z); # would print "10"
    ```

* Conditional expressions
    ```sh
    expression = if(true) then {
        "right"
    }  else {
        "wrong"
    };  # will assign "right" to "expression" variable
    println(expression);

    if(true)) {
        println("I ovle Asial")
    }; # here "then" can be omitted since there is no "else"
    ```

* Loops
    ```sh
    loop = lambda(start, end)
        if (start <= end) then {
            println(start);
            loop(start + 1, end);
        };


    loop(1, 10) # would print numbers from 1 to 10
    ```

* Functions
    ```sh
    println(let fib(n = 10) 
        if (n <= 1) then {
            1;
        } else {
            fib(n - 1) + fib(n - 2);
        } 
    ); # Would print "89"
    ```

    Can also be:

    ```sh
    println((lambda fib(n) 
        if (n <= 1) then {
            1;
        } else {
            fib(n - 1) + fib(n - 2);
        } 
    )(10)); # Would print "89"
    ```

    With "**lambda**":

    ```sh
    fib = lambda (n) 
        if (n <= 1) then {
            1;
        } else {
            fib(n - 1) + fib(n - 2);
        };

    println(fib(10));
    ```

## The **Spider Guardian** (a.k.a. **paiuk**)
The name of the language comes after it's "**Spider Guardian**" (in some languages is copied as Garbage Collector). 
However our language has this concept right: in order to process our code well we have to feed the "**Spider Guardian**" ( the so called - "**paiuk**"). 

The idea of the **guardian** is to raise the attention from the programmer by making him/her feed our **paiuk**. If our **pauik** is hungry - the program will be interupted as the guardian **won't** allow any further code processing. 

The Guardian uses **energy points** system in which some expressions take energy: 

```sh
# The paiuk will automatically detect any of the below operations:
"var": 1 # Declaring variable costs "1" energy
"lambda": 3 # Declaring lambda function costs "3" energy
"let": 5 # Declaring let expression costs "5" energy
"if": 5 # Usage of if expression costs "5" energy
"call:": 10 # Calling a function costs "10" energy
```

However it can be "**fed**" many times:

```sh
# This is we should feed our paiuk:
paiuk feed "apple" # Would give "1" energy
paiuk feed "choco" # Would give "3" energy
paiuk feed "potatoes" # Would give "5" energy
paiuk feed "elephant" # Would give "100" energy
```

The "**paiuk**" starts with **0 energy** and everytime it goes below or equal to 0 (after any expression passed) it throws an exception.

**HINT**: This approach is very useful when you want to limit the resources when resolving an issue - when trying to find the most optimal solution.
    **Example**:
        How can you find the **n-th** Fibonacci number using only **10** energy?

## Examples
Take a look at **index.js** to find out how you can parse `and **process** your own **statements**. You can exclude/include the **Spider Guardian** there as well.

You can run the examples in the **index.js** by executing this in the terminal:
`node index.js`

The tests in the **./spec** folder can also be useful. :)
        
## Installation

After downloading/cloning the project there is **no additional setup** needed. However if you plan to **run** the **test suits** you should run:

`npm install`

## Tests

Unit test can be run with typing in terminal:
`jasmine`

Code coverage + unit tests can be executed with:
`npm test`
After that **coverage/index.html** will be present - containing the whole **coverage report**.

## Third-Party Tools

* Testing Framework: [Jasmine](https://jasmine.github.io/)

* Code Coverage Tool: [Istanbul](https://github.com/gotwarlost/istanbul)

* Continuous Integration Tool: [TravisCI](https://travis-ci.org/) 

## License

MIT

Made with :heartpulse: