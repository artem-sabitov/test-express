var postgres = require('pg-promise')();
var Customer = require('./models/customer');
var connection = 'postgres://test_express:test_express@localhost:5432/test_express_db0';
var database = postgres(connection);
var Crypto = require('./utils/crypto');
var crypto = new Crypto();

function mapper() {
    this.persistCustomer = async function (customer) {
        try {
            const exist = await database.oneOrNone(
                'SELECT 1 FROM customers WHERE phone = $1 OR email_hash = crypt($2, email_hash)',
                [customer.getPhone(), customer.getEmail()]
            );
            if (exist !== null) {
                return false;
            }

            return null === await database.none(
                'INSERT INTO customers(id, encrypted_email, email_hash, phone) VALUES (uuid_generate_v4(), $1, crypt($2, gen_salt(\'bf\', 8)), $3)',
                [
                    customer.getEncryptedEmail(),
                    customer.getEmail(),
                    customer.getPhone(),
                ]
            );
        } catch (e) {
            console.log(e);

            return false;
        }
    };
    this.findByEmail = async function (email) {
        try {
            const row = await database.oneOrNone(
                'SELECT encrypted_email, phone FROM customers WHERE email_hash = crypt($1, email_hash)', email
            );
            console.log(row);
            if (row === null) {
                return null;
            }

            var decryptedEmail = crypto.decrypt(email, row.encrypted_email);

            return new Customer(decryptedEmail, row.phone, row.encrypted_email);
        } catch (e) {
            console.log(e);

            return null;
        }
    }
};

module.exports = mapper;
