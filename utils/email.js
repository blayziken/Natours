const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // In order to send emails with Nodemailer, follow these 3 steps:

    // 1) Create a Transporter

    const transporter = nodemailer.createTransport({
        // service: 'Gmail',

        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        // Activate in gmail "less secure app" option
    });

    // 2) Define Email Options
    const mailOptions = {
        from: 'Toluwalope Jesufemi <hello@natour.io>',
        to: options.email,
        subject: options.subject,
        text: options.message,

    }

    // 3) Send the email with transporter
    await transporter.sendMail(mailOptions)
};

module.exports = sendEmail;