const Evaluator = require('../../lang/interpreter/Evaluator'),
    Environment = require('../../lang/interpreter/Environment'),
    InputStream = require('../../lang/parser/InputStream'),
    TokenStream = require('../../lang/parser/TokenStream'),
    Parser = require('../../lang/parser/Parser');

describe('Evaluator ', () => {
    let evaluator = new Evaluator();
    let env = new Environment(null);

    it('should assign function as variable', () => {
        let code = 'sum = lambda(x, y) x + y;'
        let env = new Environment(null);

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get('sum')).toBeDefined();
    });

    it('should assign function as variable and retrieve the result of invoking it ', () => {
        let code = 'sum = lambda(x, y) x + y; result = sum(2,3);'
        let env = new Environment(null);

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get('result')).toEqual(5);
    });

    it('should assign integer to variable ', () => {
        let code = 'result = 5;'
        let env = new Environment(null);

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get('result')).toEqual(5);
    });

    it('should assign float to variable ', () => {
        let code = 'result = 3.14;'
        let env = new Environment(null);

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get('result')).toEqual(3.14);
    });

    it('should assign bool to variable ', () => {
        let code = 'result = true;'
        let env = new Environment(null);

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get('result')).toBeTruthy();
    });

    it('should assign string to variable ', () => {
        let code = 'result = "I am custom string!";'
        let env = new Environment(null);

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get('result')).toEqual("I am custom string!");
    });

    it('should assign proper value on Fibonacci call ', () => {
        let code = 'fib = lambda(x) if(x < 2) then x else fib(x - 1) + fib(x - 2); result = fib(15)'
        let env = new Environment(null);

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get('result')).toEqual(610);
    });

    it('should assign proper value on Arithmetic progression call ', () => {
        let code = 'prog = lambda(x) if(x == 0) then 0 else x + prog(x - 1); result = prog(15)'
        let env = new Environment(null);

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get('result')).toEqual(120);
    });
})

function getExpression(code) {
    let parser = new Parser();
    return parser.parse(new TokenStream(new InputStream(code)));
}