const nodemailer = require("nodemailer");

sendEmail = async (options) => {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        // secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mail = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.sendTo,
        subject: options.subject,
        text: options.message,
    };

    // send mail with defined transport object
    const info = await transporter.sendMail(mail);

    console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;