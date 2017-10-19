const Environment = require('./lang/interpreter/Environment'),
    TokenStream = require('./lang/parser/TokenStream'),
    InputStream = require('./lang/parser/InputStream'),
    Parser = require('./lang/parser/Parser'),
    Evaluator = require('./lang/interpreter/Evaluator'),
    SpiderParser = require('./lang/spider/SpiderParser'),
    SpiderGuardian = require('./lang/spider/SpiderGuardian');
var globalEnv = new Environment(null);

globalEnv.define("println", function (value) {
    console.log(value);
});

let code =
    ` # Your code goes here:
println("Hello Paiuk");
# I am a comment.

# Variables 
number = 5.14;
text = "Hello";
bool = true;
sum = lambda (a,b){ a + b };
println(sum(1, 3));
println(sum("1", "3"));
let (x = 2, y = x + 1, z = x + y)  println(x + y + z); # would print "10"

# Conditionals
expression = if(true) then {
    "right"
} else {
    "wrong"
};  # will assign "right" to "expression" variable
println(expression);

if(true) {
    println("I ovle Asial");
}; # here "then" can be omitted since there is no "else"

# Loops
loop = lambda(start, end)
    if (start <= end) then {
        println(start);
        loop(start + 1, end);
    };


loop(1, 10); # would print numbers from 1 to 10

# Functions
println(let fib(n = 10) 
    if (n <= 1) then {
        1;
    } else {
        fib(n - 1) + fib(n - 2);
    } 
); # Would print "89"

println((lambda fib(n) 
    if (n <= 1) then {
        1;
    } else {
        fib(n - 1) + fib(n - 2);
    } 
)(10));# Would print "89"

fib = lambda (n) 
    if (n <= 1) then {
        1;
    } else {
        fib(n - 1) + fib(n - 2);
    };

println(fib(10));
`

const parser = new Parser();
const evaluator = new Evaluator();

var expression = parser.parse(new TokenStream(new InputStream(code)));
evaluator.evaluate(expression, globalEnv);

{
    let code = `
    paiuk feed "apple";
    paiuk feed "choco";
    paiuk feed "potatoes";
    paiuk feed "elephant";
    energy = paiuk feed "elephant";

    println("Start: ");
    println(energy);

    fib = lambda (n) 
    if (n <= 1) then {
        1;
    } else {
        fib(n - 1) + fib(n - 2);
    };

    println("After declaration: ");
    println(paiuk feed "apple" - 1);
    
    # Change to 7 and see what happens
    println(fib(6));

    println("End");       
    println(paiuk feed "apple" - 1);
    `
    const parser = new SpiderParser();
    const evaluator = new SpiderGuardian();
    
    var expression = parser.parse(new TokenStream(new InputStream(code)));
    evaluator.evaluate(expression, globalEnv);
}
