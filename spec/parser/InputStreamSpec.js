const InpustStream = require('../../lang/parser/InputStream');

describe('Basic InputStream', function () {
    it('should have proper initial steate', () => {
        let input = "a";
        let inputStream = new InpustStream(input);
        expect(inputStream.row).toEqual(1);
        expect(inputStream.col).toEqual(0);
        expect(inputStream.input).toEqual(input);
        expect(inputStream.pos).toEqual(0);
    })

    it('should return proper value when peek is called', () => {
        let inputStream = new InpustStream("a");
        expect(inputStream.peek()).toEqual('a');
    })

    it('should return proper value when peek is called multipleTimes', () => {
        let inputStream = new InpustStream("a");
        for (var i = 0; i < 10; i++) {
            expect(inputStream.peek()).toEqual('a');
        }
    })

    it('should return proper value next peek is called', () => {
        let inputStream = new InpustStream("a");
        expect(inputStream.next()).toEqual('a');
    })

    it('should return proper value when next is called multipleTimes', () => {
        let inputStream = new InpustStream("abcdefghij");
        for (var i = 0; i < 10; i++) {
            let char = String.fromCharCode('a'.charCodeAt(0) + i);
            expect(inputStream.next()).toEqual(char);
        }
    })

    it('should return false when isEndOfFile is called', () => {
        let input = "abcdefghij";
        let inputStream = new InpustStream(input);
        for (var i = 0; i < input.length / 2; i++) {
            inputStream.next();
        }

        expect(inputStream.isEndOfFile()).toEqual(false);
    })

    it('should throw proper error when raiseError is called', () => {
        let input = "abcdefghij";
        let inputStream = new InpustStream(input);
        for (var i = 0; i < input.length / 2; i++) {
            inputStream.next();
        }

        expect(() => {
            inputStream.raiseError('TestError');
        }).toThrow(new Error(`TestError (1:${input.length / 2})`));
    })

    it('should throw proper error when raiseError is called', () => {
        let input = "abcdefghij";
        let inputStream = new InpustStream(input);
        for (var i = 0; i < input.length / 2; i++) {
            inputStream.next();
        }

        expect(() => {
            inputStream.raiseError('TestError');
        }).toThrow(new Error(`TestError (1:${input.length / 2})`));
    })

    it('should throw proper error when raiseError is called on a different than first row', () => {
        let input = "abcd\nefghij\n1";
        let inputStream = new InpustStream(input);
        for (var i = 0; i < input.length; i++) {
            inputStream.next();
        }

        expect(() => {
            inputStream.raiseError('TestError');
        }).toThrow(new Error(`TestError (3:${input.length % 3})`));
    })
});

describe('When InputStream is empty it', function () {
    let inputStream = new InpustStream("");

    beforeEach(() => {
        inputStream = new InpustStream("");
    })

    it('should return "" when peek is called', () => {
        expect(inputStream.peek()).toEqual('');
    })

    it('should return true when isEndOfFile is called', () => {
        expect(inputStream.isEndOfFile()).toEqual(true);
    })

    it('should return "" when peek is called', () => {
        expect(inputStream.next()).toEqual('');
    })

    it('should throw proper error when raiseError is called', () => {
        expect(() => {
            inputStream.raiseError('TestError')
        }).toThrow(new Error('TestError (1:0)'));
    })
});  
