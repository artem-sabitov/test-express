var aes256 = require('aes256');
var bcrypt = require('bcrypt');

function Crypto() {
    const saltRounds = 10;

    this.encrypt = function (key, plainText) {
        return aes256.encrypt(
            key, Buffer.from(plainText).toString('base64')
        );
    };
    this.decrypt = function (key, encrypted) {
        return Buffer.from(aes256.decrypt(key, encrypted), 'base64').toString('utf8');
    };
    this.hash = function (string) {
        return bcrypt.hashSync(string, saltRounds);
    }
    this.isValidHash = function (string, hash) {
        return bcrypt.compareSync(string, hash);
    }
}

module.exports = Crypto;