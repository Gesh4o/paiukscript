let SpiderParser = require('../../lang/spider/SpiderParser'),
    SpiderGuardian = require('../../lang/spider/SpiderGuardian'),
    Environment = require('../../lang/interpreter/Environment'),
    InputStream = require('../../lang/parser/InputStream'),
    TokenStream = require('../../lang/parser/TokenStream');

describe('SpiderGuardian ', function () {
    let evaluator;
    let env;

    beforeEach(() => {
        evaluator = new SpiderGuardian();
        env = new Environment(null);
    })

    // hehe
    it('should be able to be fed', () => {
        let code = 'paiuk feed "apple"';

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(evaluator.energy).toEqual(1);
    });

    // hehe
    it('should return energy value', () => {
        let code = 'energy = paiuk feed "elephant"';

        let evaluation = evaluator.evaluate(getExpression(code), env);
        expect(env.get("energy")).toEqual(100);
    });

    it('should throw exception when invalid food was passed', () => {
        let code = 'energy = paiuk feed "chocolate"';

        expect(() => {
            evaluator.evaluate(getExpression(code), env);
        }).toThrow(new Error('Paiuk does not like: ' + "chocolate" + '!'));
    });

    it('should throw exception when trying to parse expression when hungry', () => {
        let code = 'sum = lambda(a, b) a + b';

        expect(() => {
            evaluator.evaluate(getExpression(code), env);
        }).toThrow(new Error('Paiuk hungry - need more food!'));
    });

    it('should parse expression when energy will equal 0 ', () => {
        let code = 'paiuk feed "choco"; sum = lambda(a, b) a + b';

        let evaluation = evaluator.evaluate(getExpression(code), env);
        let result = env.get("sum");

        expect(typeof result).toEqual("function");
        expect(result.name).toEqual("lambda");
        expect(evaluator.energy).toEqual(0);
    });

    it('should throw exception in the middle of function recursive call due to no energy', () => {
        let code = 'paiuk feed "potatoes"; paiuk feed "potatoes";' +
            'fibonacci = lambda(n) if(n < 1) then 1 else fibonacci(n - 1) + fibonacci(n - 2);' +
            'f = fibonacci(5);';
            
        expect(() => {
            evaluator.evaluate(getExpression(code), env);
        }).toThrow(new Error('Paiuk hungry - need more food!'));

    });
})

function getExpression(code) {
    let parser = new SpiderParser();
    return parser.parse(new TokenStream(new InputStream(code)));
}