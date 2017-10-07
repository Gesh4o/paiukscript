module.exports = class TokenStream {
    constructor(input) {
        this.current = null;
        this.keywords = " if then else paiuk lambda λ true false ";
        this.input = input;
    }

    isKeyword(x) {
        return this.keywords.indexOf(" " + x + " ") >= 0;
    }

    isDigit(char) {
        return /[0-9]/i.test(char) && char.length === 1;
    }

    isIdStart(char) {
        return /[a-zλ_]/i.test(char) && char.length === 1;
    }

    isId(ch) {
        return this.isIdStart(ch) || "?!-<>=0123456789".indexOf(ch) >= 0;
    }

    isOperator(ch) {
        return "+-*/%=&|<>!".indexOf(ch) >= 0;
    }

    isPunctoation(ch) {
        return ",;(){}[]".indexOf(ch) >= 0;
    }

    isWhitespace(ch) {
        return " \t\n".indexOf(ch) >= 0;
    }

    readWhile(predicate) {
        let str = "";
        while (!this.input.isEndOfFile() && predicate(this.input.peek())) {
            str += this.input.next();
        }

        return str;
    }

    readNumber() {
        let hasDot = false;
        let that = this;
        let number = this.readWhile(function (char) {
            if (char == ".") {
                if (hasDot) {
                    return false;
                }

                hasDot = true;
                return true;
            }

            return that.isDigit(char);
        });

        return { type: "num", value: parseFloat(number) };
    }

    readIdent() {
        let id = this.readWhile(this.isId.bind(this));
        return {
            type: this.isKeyword(id) ? "kw" : "var",
            value: id
        };
    }

    readEscaped(end) {
        let escaped = false
        let str = "";

        this.input.next();
        while (!this.input.isEndOfFile()) {
            var ch = this.input.next();
            if (escaped) {
                str += ch;
                escaped = false;
            } else if (ch == "\\") {
                escaped = true;
            } else if (ch == end) {
                break;
            } else {
                str += ch;
            }
        }

        return str;
    }

    readString() {
        return { type: "str", value: this.readEscaped('"') };
    }

    skipComment() {
        this.readWhile(function (ch) {
            return ch != "\n"
        });

        this.input.next();
    }

    readNext() {
        this.readWhile(this.isWhitespace);
        if (this.input.isEndOfFile()) {
            return null;
        }

        var char = this.input.peek();
        if (char == "#") {
            this.skipComment();
            return this.readNext();
        }

        if (char == '"') {
            return this.readString();
        }

        if (this.isDigit(char)) {
            return this.readNumber();
        }

        if (this.isIdStart(char)) {
            return this.readIdent();
        }

        if (this.isPunctoation(char)) {
            return {
                type: "punc",
                value: this.input.next()
            }
        }

        if (this.isOperator(char)) {
            return {
                type: "op",
                value: this.readWhile(this.isOperator)
            };
        }

        this.input.raiseError("Can't handle character: " + char);
    }

    peek() {
        return this.current || (this.current = this.readNext());
    }

    next() {
        var token = this.current;
        this.current = null;
        return token || this.readNext();
    }

    isEndOfFile() {
        return this.peek() == null;
    }

    raiseError(errorMessage) {
        this.input.raiseError(errorMessage);
    }
}