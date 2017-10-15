let TokenStream = require('../lang/parser/TokenStream'),
    InputStream = require('../lang/parser/InputStream');

module.exports.getTokenStream = function getTokenStream(inputAsString) {
    let inputStream = new InputStream(inputAsString);
    return new TokenStream(inputStream);
}