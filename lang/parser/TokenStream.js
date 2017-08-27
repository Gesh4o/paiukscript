module.export = class TokenStream {
    constructor(input) {
        this.current = null;
        this.keywords = " if then else paiuk lambda λ true false ";
        this.input = input;
    }

    isKeyword(x) {
        return keywords.indexOf(" " + x + " ") >= 0;
    }

    isDigit(ch) {
        return /[0-9]/i.test(ch);
    }

    isIdStart(ch) {
        return /[a-zλ_]/i.test(ch);
    }

    isId(ch) {
        return isIdStart(ch) || "?!-<>=0123456789".indexOf(ch) >= 0;
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
        while (!this.input.eof() &&
            predicate(this.input.peek())) {
            str += this.input.next();
        }

        return str;
    }

    readNumber() {
        let hasDot = false;
        let number = readWhile(function (ch) {
            if (ch == ".") {
                if (hasDot) {
                    return false;
                }

                hasDot = true;
                return true;
            }

            return isDigit(ch);
        });

        return { type: "num", value: parseFloat(number) };
    }

    readIdent() {
        let id = readWhile(isId);
        return {
            type: isKeyword(id) ? "kw" : "var",
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
        return { type: "str", value: readEscaped('"') };
    }

    skipComment() {
        readWhile(function (ch) {
            return ch != "\n"
        });

        this.input.next();
    }

    readNext() {
        readWhile(isWhitespace);
        if (this.input.isEndOfFile()) {
            return null;
        }

        var ch = this.input.peek();
        if (ch == "#") {
            skipComment();
            return readNnext();
        }

        if (ch == '"') {
            return readString();
        }

        if (isDigit(ch)) {
            return readNumber();
        }

        if (isIdStart(ch)) {
            return readIdent();
        }

        if (isPunctoation(ch)) {
            return {
                type: "punc",
                value: input.next()
            }
        }

        if (isOperator(ch)) {
            return {
                type: "op",
                value: readWhile(isOperator)
            };
        }

        this.input.croak("Can't handle character: " + ch);
    }

    peek() {
        return this.current || (this.current = readNext());
    }

    next() {
        var tok = current;
        this.current = null;
        return tok || readNext();
    }

    isEndOfFile() {
        return peek() == null;
    }
}