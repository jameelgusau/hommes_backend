const sendEmail = require('../helpers/send-email');

module.exports = sendVerificationEmail;

async function sendVerificationEmail(account, origin) {
    // console.log(account,origin, "emails")
    let message;
    if (origin) {
        const verifyUrl = `${origin}/confirm-email/${account.verificationToken}`;
        message = `<p>Please click the below link to verify your email address:</p>
                   <p><a href="${verifyUrl}" style="
                    background-color: #0C2D40;
                    color: white;
                    border: 2px solid #0C2D40;
                    padding: 10px 20px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    border-radius: 5px;">Complete Sign Up</a></p>`;
    } else {
        message = `<p>Please use the below token to verify your email address with the <code>/verify-email</code> api route:</p>
                   <p><a href="#">${account.verificationToken}</a></p>`;
    }

    await sendEmail({
        to: account.email,
        subject: 'Sign-up Verification',
        html: `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`
    }).catch(console.error, "sendMail");
}