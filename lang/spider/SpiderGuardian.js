let Evaluator = require('../interpreter/Evaluator');

module.exports = class SpiderGuardian extends Evaluator {
    constructor() {
        super();
        this.energy = 0;
        this.foodTable = {
            'apple': 1,
            'choco': 3,
            'potatoes': 5,
            'elephant': 100
        }

        this.energyCostTable = {
            "var": 1,
            "lambda": 3,
            "let": 5,
            "if": 5,
            "call:": 10
        }
    }

    feed(food) {
        let a = Object.keys(this.foodTable);
        if (Object.keys(this.foodTable).filter((key) => key === food).length == 0) {
            throw new Error('Paiuk does not like: ' + food + '!');
        }

        this.energy += this.foodTable[food];
        return this.energy;
    }

    evaluate(expression, environment) {
        if (Object.keys(this.energyCostTable).filter((key) => key === expression.type).length > 0) {
            this.energy -= this.energyCostTable[expression.type];

            if (this.energy < 0) {
                throw new Error('Paiuk hungry - need more food!');
            }
        }

        if (expression.type === "food") {
            return this.feed(expression.value);
        }

        return super.evaluate(expression, environment);
    }
}