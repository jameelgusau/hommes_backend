const config = require('config.json');
const mailgun = require("mailgun-js");
const api_key =  process.env.API_KEY;
const DOMAIN = process.env.DOMAIN ;
const mg = mailgun({apiKey: api_key, domain: DOMAIN});


module.exports = sendEmail;

async function sendEmail({ to, subject, html, from = config.emailFrom }) {
    // const transporter = nodemailer.createTransport(config.smtpOptions);
    await mg.messages().send({ from, to, subject, html}, function (error, body) {
        console.log(body,error, 'body')});
}

