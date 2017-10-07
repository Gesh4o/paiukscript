const Environment = require('./lang/interpreter/Environment'),
    TokenStream = require('./lang/parser/TokenStream'),
    InputStream = require('./lang/parser/InputStream'),
    Parser = require('./lang/parser/Parser'),
    Evaluator = require('./lang/interpreter/Evaluator');

var globalEnv = new Environment(null);

globalEnv.define("time", function (func) {
    try {
        console.time("time");
        return func();
    } finally {
        console.timeEnd("time");
    }
});

if (typeof process != "undefined") (function () {
    var util = require("util");
    globalEnv.define("println", function (value) {
        util.puts(value);
    });

    globalEnv.define("print", function (value) {
        util.print(value);
    });

    var code = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("readable", function () {
        var chunk = process.stdin.read();
        if (chunk) code += chunk;
    });

    process.stdin.on("end", function () {
        const parser = new Parser();
        const evaluator = new Evaluator();

        var expression = parser.parse(new TokenStream(new InputStream(code)));
        evaluator.evaluate(expression, globalEnv);
    });
})();