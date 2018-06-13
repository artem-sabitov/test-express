const nodemailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport");

// provide your smtp options
const host = null;
const port = null;
const user = null;
const pass = null;
const secure = false;

function Mailer() {
    if (!host || !port || !user || !pass) {
        throw new Error('Please change options for the outgoing mail (SMTP) server');
    }

    this.transport = nodemailer.createTransport(
        smtpTransport({
            host: host,
            port: port,
            secure: secure,
            auth: {
                user: user,
                pass: pass
            }
        })
    );

    this.send = async function (email, phone) {
        var mail = {
            to: email,
            subject: 'Your phone',
            text: phone,
            from: user
        }
        var result = await this.transport.sendMail(mail);
        return result
    }
}

module.exports = Mailer;