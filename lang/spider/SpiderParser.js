let Parser = require('../parser/Parser');

module.exports = class SpiderParser extends Parser {
    constructor() {
        super();
    }

    parseAtomic() {
        if (this.isKeyword("paiuk")) {
            let that = this;
            return super.maybeCall(function () {
                return that.parseFeeding();
            });
        }

        return super.parseAtomic();
    }

    isKeyword(keyword) {
        let token = this.input.peek();
        return keyword === token.value || super.isKeyword(keyword);
    }

    parseFood() {
        let str = this.input.next();
        if (str.type !== 'str') {
            throw new Error("Food type (as string) is expected!");
        }

        return str.value;
    }

    parseFeeding() {
        this.skipKeyword('paiuk');
        this.skipKeyword('feed');

        let expression = {
            type: 'food',
            value: this.parseFood()
        }

        return expression;
    }
}