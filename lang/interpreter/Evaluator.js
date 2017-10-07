module.exports = class Evaluator {
    constructor() {
    }

    evaluate(expression, environment) {
        let that = this;        
        switch (expression.type) {
            case "num":
            case "str":
            case "bool":
                return expression.value;
            case "var":
                return environment.get(expression.value);
            case "assign":
                if (expression.left.type != "var") {
                    throw new Error("Cannot assign to " + JSON.stringify(expression.left));
                }

                return environment.set(expression.left.value, this.evaluate(expression.right, environment));
            case "binary":
                return this.applyOperation(expression.operator,
                    this.evaluate(expression.left, environment),
                    this.evaluate(expression.right, environment));
            case "lambda":
                return this.makeLambda(expression, environment);
            case "if":
                let cond = this.evaluate(expression.cond, environment);
                if (cond !== false) return this.evaluate(expression.then, environment);
                return expression.else ? this.evaluate(expression.else, environment) : false;
            case "prog":
                let val = false;
                expression.prog.forEach(function (exp) { val = that.evaluate(exp, environment) });
                return val;
            case "call":
                let func = this.evaluate(expression.func, environment);
                return func.apply(null, expression.args.map(function (arg) {
                    return that.evaluate(arg, environment);
                }));
            default:
                throw new Error("I don't know how to evaluate " + expression.type);
        }
    }

    applyOperation(operand, a, b) {
        function num(x) {
            if (typeof x != "number") {
                throw new Error("Expected number but got " + x);
            }

            return x;
        }

        function div(x) {
            if (num(x) == 0) {
                throw new Error("Divide by zero");
            }

            return x;
        }

        switch (operand) {
            case "+": return num(a) + num(b);
            case "-": return num(a) - num(b);
            case "*": return num(a) * num(b);
            case "/": return num(a) / div(b);
            case "%": return num(a) % div(b);
            case "&&": return a !== false && b;
            case "||": return a !== false ? a : b;
            case "<": return num(a) < num(b);
            case ">": return num(a) > num(b);
            case "<=": return num(a) <= num(b);
            case ">=": return num(a) >= num(b);
            case "==": return a === b;
            case "!=": return a !== b;
            default: throw new Error("Can't apply operator " + operand);
        }
    }

    makeLambda(expression, environment) {
        let that = this;
        function lambda() {
            let names = expression.vars;
            let scope = environment.extend();
            for (let i = 0; i < names.length; ++i) {
                scope.define(names[i], i < arguments.length ? arguments[i] : false);
            }

            return that.evaluate(expression.body, scope);
        }

        return lambda;
    }
}