module.export = class InputStream {
    constructor() {
        this.pos = 0;
        this.line = 1;
        this.col = 0;
    }

    next() {
        var char = input.charAt(this.pos++);
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
        return input.charAt(this.pos);
    }

    isEndOfFile() {
        return peek() == "";
    }

    croak(msg) {
        throw new Error(msg + " (" + this.row + ":" + this.col + ")");
    }
}
