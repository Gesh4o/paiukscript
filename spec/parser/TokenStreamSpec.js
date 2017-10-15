const TokenStream = require('../../lang/parser/TokenStream'),
    InputStream = require('../../lang/parser/InputStream');

describe('Basic TokenStream', function () {
    it('should have proper initial state', () => {
        let input = "a";
        let inputStream = new InputStream(input);
        let tokenStream = new TokenStream(inputStream);
        expect(tokenStream.current).toEqual(null);
        expect(tokenStream.input).toEqual(inputStream);
        expect(tokenStream.keywords).toEqual(' if then else paiuk lambda true false let ');
    })
})

describe('TokenStream isKeyword function', function () {
    it('should return false on digit', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isKeyword('431')).toBeFalsy();
    });

    it('should return true on keyword', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isKeyword('paiuk')).toBeTruthy();
    });

    it('should return false on non trimmed keyword', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isKeyword('paiuk ')).toBeFalsy();
    });

    it('should return false on misspelled keyword ', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isKeyword('pauik')).toBeFalsy();
    });

    it('should return false on number ', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isKeyword('3213.13')).toBeFalsy();
    });
})

describe('TokenStream isDigit function', function () {
    it('should return true on digit', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isDigit('4')).toBeTruthy();
    });

    it('should return false on negative number', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isDigit('-4')).toBeFalsy();
    });

    it('should return false on integer number', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isDigit('4332132131')).toBeFalsy();
    });

    it('should return false on float number', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isKeyword('3213.13')).toBeFalsy();
    });

    it('should return false on float negative number', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isKeyword('-13.18')).toBeFalsy();
    });
})

describe('TokenStream isIdStart function', function () {
    it('should return true on string with underscore', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isIdStart("_")).toBeTruthy();
    });

    it('should return true on string with small letter', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isIdStart("d")).toBeTruthy();
    });

    it('should return false on string with digit', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isIdStart("6")).toBeFalsy();
    });

    it('should return false on string with negative number', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isIdStart("-6")).toBeFalsy();
    });

    it('should return false on string with puctional sign', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isIdStart("!")).toBeFalsy();
    });

    it('should return false on string with capital letter', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isIdStart("P")).toBeTruthy();
    });

    it('should return false on string with small multiple letters', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isIdStart("pam")).toBeFalsy();
    });
})

describe('TokenStream isId function', function () {
    it('should return true on valid identifier', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isId('?')).toBeTruthy();
    });

    it('should return false on comment start', () => {
        let tokenStream = getDefaultTokenStream();
        expect(tokenStream.isId('#')).toBeFalsy();
    });
})

describe('TokenStream isOperator function', function () {
    it('should return true for all operators', () => {
        let operators = "+-*/%=&|<>!";
        let tokenStream = getDefaultTokenStream();
        for (var index = 0; index < operators.length; index++) {
            var char = operators[index];
            expect(tokenStream.isOperator(char)).toBeTruthy();
        }
    });

    it('should return true for all non-operators', () => {
        let operators = "1Aa#   \n;\\@)(^(";
        let tokenStream = getDefaultTokenStream();
        for (var index = 0; index < operators.length; index++) {
            var char = operators[index];
            expect(tokenStream.isOperator(char)).toBeFalsy();
        }
    });
})

describe('TokenStream isPunctoation function', function () {
    it('should return true for all punctioation operators', () => {
        let operators = ",;(){}[]";
        let tokenStream = getDefaultTokenStream();
        for (var index = 0; index < operators.length; index++) {
            var char = operators[index];
            expect(tokenStream.isPunctoation(char)).toBeTruthy();
        }
    });

    it('should return false for all non-punctioation operators', () => {
        let operators = "+-*/%=&|<>!aA1\t\s\n@#$^&";
        let tokenStream = getDefaultTokenStream();
        for (var index = 0; index < operators.length; index++) {
            var char = operators[index];
            expect(tokenStream.isPunctoation(char)).toBeFalsy();
        }
    });
})

describe('TokenStream isWhitespace function', function () {
    it('should return true on all whitespace characters', () => {
        let operators = " \t\n";
        let tokenStream = getDefaultTokenStream();
        for (var index = 0; index < operators.length; index++) {
            var char = operators[index];
            expect(tokenStream.isWhitespace(char)).toBeTruthy();
        }
    });

    it('should return false on all non-whitespace characters', () => {
        let operators = "aA1-!@#$$%^&*(_123456789[{:\'\"\\|zxc,<>}])";
        let tokenStream = getDefaultTokenStream();
        for (var index = 0; index < operators.length; index++) {
            var char = operators[index];
            expect(tokenStream.isWhitespace(char)).toBeFalsy();
        }
    });
})

describe('TokenStream readWhile function', function () {
    it('should read untill the end of the input if the predicate creteria is not met', () => {
        let predicate = () => { return true; };
        let input = "abcdeghijklmopqrstuvxyz";
        let tokenStream = getTokenStream(input);
        let result = tokenStream.readWhile(predicate);
        expect(result).toEqual(input);
    });

    it('should read none of the input if the predicate creteria is always met', () => {
        let predicate = () => { return false; };
        let input = "abcdeghijklmopqrstuvxyz";
        let tokenStream = getTokenStream(input);
        let result = tokenStream.readWhile(predicate);
        expect(result).toEqual('');
    });

    it('should read untill  the predicate creteria is met', () => {
        let input = "abcdeghijkl1mopqrstuvxyz";
        let tokenStream = getTokenStream(input);

        let predicate = (char) => {
            return !tokenStream.isDigit(char);
        }

        let expectedResult = input.substring(0, input.indexOf('1'));
        let result = tokenStream.readWhile(predicate);
        expect(result).toEqual(expectedResult);
    });
})

describe('TokenStream readNumber function', function () {
    it('should return integer from input', () => {
        let input = '12343abcd';
        let tokenStream = getTokenStream(input);

        expect(tokenStream.readNumber()).toEqual({ type: 'num', value: parseFloat(input) })
    });

    it('should return Nan from negative integer from input', () => {
        let input = '-12343abcd';
        let tokenStream = getTokenStream(input);

        expect(tokenStream.readNumber()).toEqual({ type: 'num', value: NaN })
    });

    it('should return float number from float number in input', () => {
        let input = '3.14abcd';
        let tokenStream = getTokenStream(input);

        expect(tokenStream.readNumber()).toEqual({ type: 'num', value: 3.14 })
    });

    it('should return float number from float number in input with multiple dots', () => {
        let input = '3.14.abcd';
        let tokenStream = getTokenStream(input);

        expect(tokenStream.readNumber()).toEqual({ type: 'num', value: 3.14 })
    });

    it('should return NaN form emtpy input', () => {
        let tokenStream = getTokenStream('');

        expect(tokenStream.readNumber()).toEqual({ type: 'num', value: NaN })
    });
})

describe('TokenStream readIdent function', function () {
    it('should return varaible name from variable declaration', () => {
        let input = 'a = 3';
        let tokenStream = getTokenStream(input);
        let result = tokenStream.readIdent();

        expect(result).toEqual(Object({ type: 'var', value: 'a' }));
    });

    it('should return keyword from function declaration', () => {
        let input = 'lambda (x) 10';
        let tokenStream = getTokenStream(input);
        let result = tokenStream.readIdent();

        expect(result).toEqual(Object({ type: 'kw', value: 'lambda' }));
    });
})

describe('TokenStream skipComment function', function () {
    it('should read untill the end of the input', () => {
        let input = '# this is a comment only'
        let tokenStream = getTokenStream(input);

        tokenStream.skipComment();
        expect(tokenStream.isEndOfFile()).toBeTruthy();
    });

    it('should read untill the end of the input', () => {
        let input = '# this is a comment only\nlambda (x) 10'
        let tokenStream = getTokenStream(input);

        tokenStream.skipComment();
        expect(tokenStream.peek()).toEqual({ type: 'kw', value: 'lambda' });
        expect(tokenStream.next()).toEqual({ type: 'kw', value: 'lambda' });
    });
})

describe('TokenStream readString function', function () {
    it('should read string escaped', () => {
        let input = '"I am a string!"';
        let tokenStream = getTokenStream(input);
        let result = tokenStream.readString();
        let expected = { type: "str", value: input.replace(/"/g, '') }
        expect(result).toEqual(expected);
    });
})

function getTokenStream(inputAsString) {
    let inputStream = new InputStream(inputAsString);
    return new TokenStream(inputStream);
}

function getDefaultTokenStream() {
    return getTokenStream('');
}