const Parser = require('../../lang/parser/Parser'),
    InputStream = require('../../lang/parser/InputStream'),
    TokenStream = require('../../lang/parser/TokenStream'),
    getTokenStream = require('../Utils').getTokenStream;

describe('Parser ', function () {
    it('should parse lambda function as object function', () => {
        let code = 'sum = lambda(x, y) x + y;'
        let parser = new Parser();
        let result = parser.parse(getTokenStream(code));

        expect(result.type).toEqual('prog');
        expect(Array.isArray(result.prog)).toBeTruthy();
        expect(result.prog[0]).toBeDefined();
        expect(JSON.stringify(result.prog[0].left)).toEqual(JSON.stringify({ type: 'var', value: 'sum' }));
        expect(JSON.stringify(result.prog[0].right)).toEqual(JSON.stringify({
            type: 'lambda',
            name: null,
            vars: ['x', 'y'],
            body: {
                type: 'binary',
                operator: '+',
                left: { type: 'var', value: 'x' },
                right: { type: 'var', value: 'y' }
            }
        }));
    });

    it('should parse lambda function ivocation ', () => {
        let code = 'sum(3,4)'
        let parser = new Parser();
        let result = parser.parse(getTokenStream(code));

        let object = result.prog[0];
        expect(object).toBeDefined();
        expect(object.type).toEqual('call');
        expect(object.func.type).toEqual('var');
        expect(object.func.value).toEqual('sum');
        expect(JSON.stringify(object.args)).toEqual(JSON.stringify([{ type: 'num', value: 3 }, { type: 'num', value: 4 }]));
    });

    it('should parse "if" expression', () => {
        let code = 'a = if isTrue() then getThis() else getThat();'
        let parser = new Parser();
        let result = parser.parse(getTokenStream(code));

        let object = result.prog[0];
        expect(object).toBeDefined();
        expect(object.left.type).toEqual('var');
        expect(object.left.value).toEqual('a');

        expect(JSON.stringify(object.right)).toEqual(JSON.stringify({
            type: 'if',
            cond: {
                type: 'call',
                func: { type: 'var', value: 'isTrue' },
                args: []
            },
            then: {
                type: 'call',
                func: { type: 'var', value: 'getThis' },
                args: []
            },
            else: {
                type: 'call',
                func: { type: 'var', value: 'getThat' },
                args: []
            }
        }));
    });

    it('should ignore comments', () => {
        let code = '# I should be ignored'
        let parser = new Parser();
        let result = parser.parse(getTokenStream(code));

        expect(result.type).toEqual('prog');
        expect(result.prog.length).toEqual(0);
    });

    it('should throw exception on invalid "if" expression', () => {
        let code = 'if isTrue() thenWasSkipped() else thenThat()'
        let parser = new Parser();
        expect(() => {
            parser.parse(getTokenStream(code));
        }).toThrowError();
    });

    it('should parse named function', () => {
        let code = 'let loop (n = 10) if n > 0 then n + loop(n - 1) else 0'
        let parser = new Parser();
        let result = parser.parse(getTokenStream(code));
        let object = result.prog[0];
        expect(result).toBeDefined();
        expect(result.type).toEqual('prog');
        expect(object).toBeDefined();
        expect(object).toEqual({
            type: 'call',
            func: {
                type: 'lambda',
                name: 'loop',
                vars: ['n'],
                body: {
                    type: 'if',
                    cond:
                    {
                        type: 'binary',
                        operator: '>',
                        left: { type: 'var', value: 'n' },
                        right: { type: 'num', value: 0 }
                    },
                    then:
                    {
                        type: 'binary',
                        operator: '+',
                        left: { type: 'var', value: 'n' },
                        right: {
                            type: 'call',
                            func: { type: 'var', value: 'loop' },
                            args: [{ type: 'binary', operator: '-', left: { type: 'var', value: 'n' }, right: { type: 'num', value: 1 } }]
                        }
                    },
                    else: { type: 'num', value: 0 }
                }
            },
            args: [{ type: 'num', value: 10 }]
        })
    });
})
