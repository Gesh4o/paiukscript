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
        return this.parseToplevel();
    }

    isPunctuation(char) {
        let token = this.input.peek();
        return token && token.type == "punc" && (!char || token.value == char) && token;
    }

    isKeyword(keyword) {
        let token = this.input.peek();
        return token && token.type == "kw" && (!keyword || token.value == keyword) && token;
    }

    isOperator(operand) {
        let token = this.input.peek();
        return token && token.type == "op" && (!operand || token.value == operand) && token;
    }

    skipPunctuation(char) {
        if (this.isPunctuation(char)) {
            this.input.next();
        } else {
            this.input.raiseError("Expecting punctuation: \"" + char + "\"");
        }
    }

    skipKeyword(keyword) {
        if (this.isKeyword(keyword)) {
            this.input.next();
        } else {
            this.input.raiseError("Expecting keyword: \"" + keyword + "\"");
        }
    }

    skipOperator(char) {
        if (this.isOperator(char)) {
            this.input.next();
        } else {
            this.input.raiseError("Expecting operator: \"" + char + "\"");
        }
    }

    unexpected() {
        this.input.raiseError("Unexpected token: " + JSON.stringify(this.input.peek()));
    }

    maybeBinary(left, givenPrecedence) {
        let token = this.isOperator();
        if (token) {
            let currentPrecedence = this.PRECEDENCE[token.value];
            if (currentPrecedence > givenPrecedence) {
                this.input.next();
                return this.maybeBinary({
                    type: token.value == "=" ? "assign" : "binary",
                    operator: token.value,
                    left: left,
                    right: this.maybeBinary(this.parseAtomic(), currentPrecedence)
                }, givenPrecedence);
            }
        }

        return left;
    }

    delimited(start, stop, separator, parser) {
        let a = [], first = true;
        this.skipPunctuation(start);
        while (!this.input.isEndOfFile()) {
            if (this.isPunctuation(stop)) {
                break;
            }

            if (first) {
                first = false;
            } else {
                this.skipPunctuation(separator);
            }

            if (this.isPunctuation(stop)) {
                break;
            }

            a.push(parser.bind(this)());
        }

        this.skipPunctuation(stop);
        return a;
    }

    parseCall(func) {
        return {
            type: "call",
            func: func,
            args: this.delimited("(", ")", ",", this.parseExpression.bind(this)),
        };
    }

    parseVarname() {
        let name = this.input.next();
        if (name.type != "var") {
            this.input.raiseError("Expecting variable name");
        }

        return name.value;
    }

    parseIf() {
        this.skipKeyword("if");
        let cond = this.parseExpression();


        if (!this.isPunctuation("{")) {
            this.skipKeyword("then");
        }

        let then = this.parseExpression();
        let ret = {
            type: "if",
            cond: cond,
            then: then,
        };

        if (this.isKeyword("else")) {
            this.input.next();
            ret.else = this.parseExpression();
        }

        return ret;
    }

    parseLambda() {
        return {
            type: "lambda",
            vars: this.delimited("(", ")", ",", this.parseVarname),
            body: this.parseExpression()
        };
    }

    parseBool() {
        return {
            type: "bool",
            value: this.input.next().value == "true"
        };
    }

    maybeCall(callable) {
        let result = callable();
        return this.isPunctuation("(") ? this.parseCall(result) : result;
    }

    parseAtomic() {
        let that = this;
        return this.maybeCall(function () {
            if (that.isPunctuation("(")) {
                that.input.next();
                let exp = that.parseExpression();
                that.skipPunctuation(")");
                return exp;
            }

            if (that.isPunctuation("{")) {
                return that.parseProg();
            }

            if (that.isKeyword("if")) {
                return that.parseIf();
            }

            if (that.isKeyword("true") || that.isKeyword("false")) {
                return that.parseBool();
            }

            if (that.isKeyword("lambda") || that.isKeyword("λ")) {
                that.input.next();
                return that.parseLambda();
            }

            let token = that.input.next();
            if (token.type == "var" || token.type == "num" || token.type == "str"){
                return token;                
            }

            that.unexpected();
        });
    }

    parseToplevel() {
        let prog = [];
        while (!this.input.isEndOfFile()) {
            prog.push(this.parseExpression());
            
            if (!this.input.isEndOfFile()) {
                this.skipPunctuation(";");
            }
        }

        return { type: "prog", prog: prog };
    }

    parseProg() {
        let prog = this.delimited("{", "}", ";", parseExpression);
        if (prog.length == 0) {
            return FALSE;
        }

        if (prog.length == 1) {
            return prog[0];
        }

        return {
            type: "prog",
            prog: prog
        };
    }

    parseExpression() {
        let that = this;
        return this.maybeCall(function () {
            return that.maybeBinary(that.parseAtomic(), 0);
        });
    }
}
