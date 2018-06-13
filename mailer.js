const nodemailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport");

// set 'true' for local test
const smpt_fake_mode = false;
// provide your smtp options
const host = null;
const port = null;
const user = null;
const pass = null;
const secure = false;

function Mailer() {
    if (!smpt_fake_mode && (!host || !port || !user || !pass)) {
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
        if (smpt_fake_mode) {
            console.log(email, phone);

            return;
        }

        await this.transport.sendMail({
            to: email,
            subject: 'Your phone',
            text: phone,
            from: user
        });

        return;
    }
}

module.exports = Mailer;