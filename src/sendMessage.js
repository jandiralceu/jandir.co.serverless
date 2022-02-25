"use strict";

const nodemailer = require('nodemailer')

const sendMessage = async (event) => {
    const data = JSON.parse(event.body)

    let transporter = nodemailer.createTransport({
        host: process.env.AWS_SMTP_ENDPOINT,
        port: 587,
        secure: false,
        auth: {
            user: process.env.AWS_SMTP_USER,
            pass: process.env.AWS_SMTP_PASSWORD
        }
    })

    try {
        await transporter.sendMail({
            from: data.from,
            to: typeof  data.to === 'string' ? data.to : data.to.join(','),
            subject: data.subject,
            text: data.text || '',
            html: data.html || '',
        })

        return {
            statusCode: 200,
            body: JSON.stringify({
                sendMessage: 'success'
            }, null, 2)
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err, null, 2)
        }
    }
};

module.exports = {
    handler: sendMessage
}
