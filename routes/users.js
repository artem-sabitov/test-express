var express = require('express');
var Mapper = require('../db');
var mapper = new Mapper();
var Crypto = require('../utils/crypto');
var crypto = new Crypto();
var Customer = require('../models/customer');
var router = express.Router();

const contentType = 'application/json';

router.get('/', async function (request, response) {
    console.log(crypto.encrypt('test@test.me', 'test@test.me'));
    console.log(crypto.decrypt('test@test.me', '1LbGlFsNKKD5PhsYUHjQYzLzFsfcM634tH520MUUttU='));
    return;

    var result = await mapper.persistCustomer(customer);
    console.log(result);
    response.send(result);
});

router.post('/register', async function (request, response) {
    var email = request.body.email || null;
    var phone = request.body.phone || null;

    if (email === null || phone === null) {
        response.statusCode = 400;
        response.contentType(contentType);
        response.send({"message": "missing_field"});

        return;
    }

    var customer = new Customer(
        email,
        phone,
        crypto.encrypt(email, email)
    );

    mapper.persistCustomer(customer).then(
        function (result) {
            response.contentType(contentType);
            var message = result ? {"message": "ok"} : {"message": "already_exist"};
            response.send(message);
        }
    );

    return;
});

router.post('/restore', async function (request, response) {
    var email = request.body.email;
    if (email === null) {
        response.statusCode = 400;
        response.contentType(contentType);
        response.send({"message": "missing_field"});

        return;
    }

    return mapper.findByEmail(email).then(
        function (result) {
            response.send(result);
        }
    );
});

module.exports = router;
