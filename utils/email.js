
// const nodemailer = require('nodemailer');
// const pug = require('pug');
// const htmlToText = require('html-to-text');

// module.exports = class Email {
//     constructor(user, url) {
//         this.to = user.email;
//         this.firstName = user.name.split(' ')[0];
//         this.url = url;
//         this.from = `Toluwalope Jesufemi <${process.env.EMAIL_FROM}>`;
//     }

//     newTransport() {
//         if (process.env.NODE_ENV === 'production') {
//             // Sendgrid
//             return nodemailer.createTransport({
//                 service: 'SendGrid',
//                 auth: {
//                     user: process.env.SENDGRID_USERNAME,
//                     pass: process.env.SENDGRID_PASSWORD
//                 }
//             });
//         }

//         return nodemailer.createTransport({
//             host: process.env.EMAIL_HOST,
//             port: process.env.EMAIL_PORT,
//             auth: {
//                 user: process.env.EMAIL_USERNAME,
//                 pass: process.env.EMAIL_PASSWORD
//             }
//         });
//     }

//     // Send the actual email
//     async send(template, subject) {
//         // 1) Render HTML based on a pug template
//         const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
//             firstName: this.firstName,
//             url: this.url,
//             subject
//         });

//         // 2) Define email options
//         const mailOptions = {
//             from: this.from,
//             to: this.to,
//             subject: subject,
//             html: html,
//             text: htmlToText.fromString(html)
//         };

//         // 3) Create a transport and send email
//         await this.newTransport().sendMail(mailOptions);
//     }

//     async sendWelcome() {
//         await this.send('welcome', 'Welcome to the Natours Family!');
//     }

//     async sendPasswordReset() {
//         await this.send(
//             'passwordReset',
//             'Your password reset token (valid for only 10 minutes)'
//         );
//     }
// };

// // const sendEmail = async options => {
// //     // In order to send emails with Nodemailer, follow these 3 steps:

// //     // 1) Create a Transporter

// //     const transporter = nodemailer.createTransport({
// //         // service: 'Gmail',

// //         host: process.env.EMAIL_HOST,
// //         port: process.env.EMAIL_PORT,
// //         auth: {
// //             user: process.env.EMAIL_USERNAME,
// //             pass: process.env.EMAIL_PASSWORD
// //         }
// //         // Activate in gmail "less secure app" option
// //     });

// //     // 2) Define Email Options
// //     const mailOptions = {
// //         from: `Toluwalope Jesufemi <${process.env.EMAIL_FROM}>`,
// //         to: options.email,
// //         subject: options.subject,
// //         text: options.message,

// //     }

// //     // 3) Send the email with transporter
// //     await transporter.sendMail(mailOptions)
// // };

// // module.exports = sendEmail;

const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Jonas Schmedtmann <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // Sendgrid
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    // Send the actual email
    async send(template, subject) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        };

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for only 10 minutes)'
        );
    }
};
