const express = require('express');
const Mapper = require('../db');
const mapper = new Mapper();
const Crypto = require('../utils/crypto');
const crypto = new Crypto();
const Customer = require('../models/customer');
const router = express.Router();
const Mailer = require('../mailer');
const mailer = new Mailer();

const contentType = 'application/json';

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

    var result = await mapper.persistCustomer(customer);
    var message = result ? {"message": "ok"} : {"message": "already_exist"};

    response.contentType(contentType);
    response.send(message);

    return;
});

router.post('/restore', async function (request, response) {
    var email = request.body.email || null;
    if (email === null) {
        response.statusCode = 400;
        response.contentType(contentType);
        response.send({"message": "missing_field"});

        return;
    }

    var result = await mapper.findByEmail(email);
    if (!(result instanceof Customer)) {
        response.statusCode = 400;
        response.contentType(contentType);
        response.send({"message": "invalid"});

        return;
    }

    try {
        await mailer.send(result.email, result.phone);
        response.send({"message": "sent"});
    } catch (e) {
        response.send({"message": "smtp_error"});
    }

    return;
})
;

module.exports = router;
