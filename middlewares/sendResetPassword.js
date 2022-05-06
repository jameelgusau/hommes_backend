
const sendEmail = require('../helpers/send-email');

module.exports = sendPasswordResetEmail;

async function sendPasswordResetEmail(account, origin) {
    let message;
    if (origin) {
        const resetUrl = `${origin}/resetpassword/${account.resetToken}`;
        message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}" style="
                   background-color: #0C2D40;
                   color: white;
                   border: 2px solid #0C2D40;
                   padding: 10px 20px;
                   text-align: center;
                   text-decoration: none;
                   display: inline-block;
                   border-radius: 5px;">Reset Password</a></p>`;
    } else {
        message = `<p>Please use the below token to reset your password with the <code>/account/reset-password</code> api route:</p>
                   <p><code>${account.resetToken}</code></p>`;
    }

    await sendEmail({
        to: account.email,
        subject: 'Reset Password',
        html: `<h4>Reset Password Email</h4>
               ${message}`
    });
}