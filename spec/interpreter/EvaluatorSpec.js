const Evaluator = require('../../lang/interpreter/Evaluator'),
    Environment = require('../../lang/interpreter/Environment'),
    InputStream = require('../../lang/parser/InputStream'),
    TokenStream = require('../../lang/parser/TokenStream'),
    Parser = require('../../lang/parser/Parser');

describe('Evaluator ', () => {
    let evaluator;
    let env;

    beforeEach(() => {
        evaluator = new Evaluator();
        env = new Environment(null);
    })

    it('should assign function as variable', () => {
        let code = 'sum = lambda(x, y) x + y;'

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get('sum')).toBeDefined();
    });

    it('should assign function as variable and retrieve the result of invoking it ', () => {
        let code = 'sum = lambda(x, y) x + y; result = sum(2,3);'

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get('result')).toEqual(5);
    });

    it('should assign integer to variable ', () => {
        let code = 'result = 5;'

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get('result')).toEqual(5);
    });

    it('should assign float to variable ', () => {
        let code = 'result = 3.14;'

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get('result')).toEqual(3.14);
    });

    it('should assign bool to variable ', () => {
        let code = 'result = true;'

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get('result')).toBeTruthy();
    });

    it('should assign string to variable ', () => {
        let code = 'result = "I am custom string!";'

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get('result')).toEqual("I am custom string!");
    });

    it('should assign proper value on Fibonacci call ', () => {
        let code = 'fib = lambda(x) if(x < 2) then x else fib(x - 1) + fib(x - 2); result = fib(15)'

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get('result')).toEqual(610);
    });

    it('should assign proper value on Arithmetic progression call ', () => {
        let code = 'prog = lambda(x) if(x == 0) then 0 else x + prog(x - 1); result = prog(15)'

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get('result')).toEqual(120);
    });

    it('should assign proper value on Arithmetic progression call with named function', () => {
        let code = 'sum = let loop (n = 15) if n > 0 then n + loop(n - 1) else 0'

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get('sum')).toEqual(120);
    });

    it('should assign proper value on Arithmetic progression call with named function', () => {
        let code = 'let (x = 2, y = x + 1, z = x + y) println(x + y + z);'
        let result = null;
        env.define('println', (printable) => {
            result = printable;
        });

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(result).toEqual(10);
    });

    it('should throw exception when devision by 0 is performed', () => {
        let code = 'a = 5 /0';

        expect(() => {
            evaluator.evaluate(getExpression(code), env);
        }).toThrow(new Error("Divide by zero"));
    });

    it('should throw exception when not supported operation is performed', () => {
        let code = 'a = 3 + "5"';

        expect(() => {
            evaluator.evaluate(getExpression(code), env);
        }).toThrow(new Error("Expected number but got " + "5"));
    });

    it('should properly evaluate number addition', () => {
        let code = 'a = 3 + 8';

        evaluator.evaluate(getExpression(code), env);
        expect(env.get('a')).toEqual(11);
    });

    it('should properly evaluate string concatenation', () => {
        let code = 'a = "3" + "8"';

        evaluator.evaluate(getExpression(code), env);
        expect(env.get('a')).toEqual("38");
    });

    it('should throw exception when operator is not finished', () => {
        let code = 'a = true & false';

        expect(() => {
            evaluator.evaluate(getExpression(code), env);
        }).toThrow(new Error('Expecting punctuation: ";" (1:10)'));
    });
})

function getExpression(code) {
    let parser = new Parser();
    return parser.parse(new TokenStream(new InputStream(code)));
}