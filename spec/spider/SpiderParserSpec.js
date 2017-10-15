let SpiderParser = require('../../lang/spider/SpiderParser'),
    getTokenStream = require('../Utils').getTokenStream;

describe('SpiderParser ', function () {
    let parser;
    beforeEach(() => {
        parser = new SpiderParser();
    });

    it('should parse food expression', () => {
        let code = 'paiuk feed "apple"'
        let result = parser.parse(getTokenStream(code));

        expect(result.prog[0].type).toEqual('food');
        expect(result.prog[0].value).toEqual('apple');
    });

    it('should parse food expression', () => {
        let code = 'paiuk feed "apple"'
        let result = parser.parse(getTokenStream(code));

        expect(result.prog[0].type).toEqual('food');
        expect(result.prog[0].value).toEqual('apple');
    });

    it('should parse any string as food', () => {
        let code = 'paiuk feed "apple !elephant@ mirror"';
        let result = parser.parse(getTokenStream(code));

        expect(result.prog[0].type).toEqual('food');
        expect(result.prog[0].value).toEqual('apple !elephant@ mirror');
    });

    it('should throw exception if not string is being applied as food', () => {
        let code = 'paiuk feed 13 apple';
        expect(() => {
            parser.parse(getTokenStream(code));
        }).toThrow(new Error("Food type (as string) is expected!"));
    });

    it('should throw exception if a keyword is being applied as food', () => {
        let code = 'paiuk feed apple';
        expect(() => {
            parser.parse(getTokenStream(code));
        }).toThrow(new Error("Food type (as string) is expected!"));
    });

    it('should call super method if not paiuk construct not used', () => {
        let code = 'a = 3 + 5';
        spyOn(Object.getPrototypeOf(parser), 'parseAtomic').and.callThrough();
        let result = parser.parse(getTokenStream(code));
        expect(Object.getPrototypeOf(parser).parseAtomic).toHaveBeenCalled();
    });
})