module.exports = class InputStream {
    constructor(input) {
        this.input = input;        
        this.pos = 0;
        this.row = 1;
        this.col = 0;
    }

    next() {
        var char = this.input.charAt(this.pos++);
        if (char == "\n") {
            this.row++;
            this.col = 0;
        }
        else {
            this.col++
        };

        return char;
    }

    peek() {
        return this.input.charAt(this.pos);
    }

    isEndOfFile() {
        return this.peek() == "";
    }

    raiseError(errorMessage) {
        throw new Error(errorMessage + " (" + this.row + ":" + this.col + ")");
    }
}
