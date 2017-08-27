module.exports = class Parser {
    constructor() {
        this.input = '';
        this.PRECEDENCE = {
            "=": 1,
            "||": 2,
            "&&": 3,
            "<": 7, ">": 7, "<=": 7, ">=": 7, "==": 7, "!=": 7,
            "+": 10, "-": 10,
            "*": 20, "/": 20, "%": 20,
        };
    }

    parse(input) {
        this.input = input;
        return parseToplevel();
    }

    isPunctuation(ch) {
        var tok = input.peek();
        return tok && tok.type == "punc" && (!ch || tok.value == ch) && tok;
    }

    isKeyword(kw) {
        var tok = input.peek();
        return tok && tok.type == "kw" && (!kw || tok.value == kw) && tok;
    }

    isOperator(op) {
        var tok = input.peek();
        return tok && tok.type == "op" && (!op || tok.value == op) && tok;
    }

    skipPunctuation(ch) {
        if (isPunctuation(ch)) {
            input.next();
        } else {
            input.croak("Expecting punctuation: \"" + ch + "\"");
        }
    }

    skipKeyword(kw) {
        if (isKeyword(kw)) {
            input.next();
        } else {
            input.croak("Expecting keyword: \"" + kw + "\"");
        }
    }

    skipOperator(op) {
        if (isOperator(op)) {
            input.next();
        } else {
            input.croak("Expecting operator: \"" + op + "\"");
        }
    }

    unexpected() {
        input.croak("Unexpected token: " + JSON.stringify(input.peek()));
    }

    maybeBinary(left, my_prec) {
        var tok = isOperator();
        if (tok) {
            var his_prec = PRECEDENCE[tok.value];
            if (his_prec > my_prec) {
                input.next();
                return maybeBinary({
                    type: tok.value == "=" ? "assign" : "binary",
                    operator: tok.value,
                    left: left,
                    right: maybeBinary(parseAtomic(), his_prec)
                }, my_prec);
            }
        }

        return left;
    }

    delimited(start, stop, separator, parser) {
        var a = [], first = true;
        skipPunctuation(start);
        while (!input.isEndOfFile()) {
            if (isPunctuation(stop)) {
                break;
            }

            if (first) {
                first = false;
            } else {
                skipPunctuation(separator);
            }

            if (isPunctuation(stop)) {
                break;
            }

            a.push(parser());
        }

        skipPunctuation(stop);
        return a;
    }

    parseCall(func) {
        return {
            type: "call",
            func: func,
            args: delimited("(", ")", ",", parse_expression),
        };
    }

    parseVarname() {
        var name = input.next();
        if (name.type != "var") {
            input.croak("Expecting variable name");
        }

        return name.value;
    }

    parseIf() {
        skipKeyword("if"); {
            var cond = parseExpression();
        }

        if (!isPunctuation("{")) {
            skipKeyword("then");
        }

        var then = parseExpression();
        var ret = {
            type: "if",
            cond: cond,
            then: then,
        };

        if (isKeyword("else")) {
            input.next();
            ret.else = parse_expression();
        }

        return ret;
    }

    parseLambda() {
        return {
            type: "lambda",
            vars: delimited("(", ")", ",", parse_varname),
            body: parseExpression()
        };
    }

    parseBool() {
        return {
            type: "bool",
            value: input.next().value == "true"
        };
    }

    maybeCall(expr) {
        expr = expr();
        return isPunctuation("(") ? parseCall(expr) : expr;
    }

    parseAtomic() {
        return maybeCall(function () {
            if (isPunctuation("(")) {
                input.next();
                var exp = parseExpression();
                skipPunctuation(")");
                return exp;
            }

            if (isPunctuation("{")) {
                return parseProg();
            }

            if (isKeyword("if")) {
                return parseIf()
            };

            if (isKeyword("true") || isKeyword("false")) {
                return parseBoold();
            }

            if (isKeyword("lambda") || isKeyword("λ")) {
                input.next();
                return parseLambda();
            }

            var tok = input.next();
            if (tok.type == "var" || tok.type == "num" || tok.type == "str")
                return tok;
            unexpected();
        });
    }
    parseToplevel() {
        var prog = [];
        while (!input.isEndOfFile()) {
            prog.push(parseExpression());
            if (!input.isEndOfFile()) {
                skipPunctuation(";")
            };
        }

        return { type: "prog", prog: prog };
    }

    parseProg() {
        var prog = delimited("{", "}", ";", parse_expression);
        if (prog.length == 0) return FALSE;
        if (prog.length == 1) return prog[0];
        return { type: "prog", prog: prog };
    }

    parseExpression() {
        return maybeCall(function () {
            return maybeBinary(parse_atom(), 0);
        });
    }
}
