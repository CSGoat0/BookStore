import nodemailer from "nodemailer"
import { emailTemplate } from "../utilities/emailTemplate.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "csgabdelrahman@gmail.com",
        pass: "hadm vzqe bubm raov",
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const sendMail = async (email) => {
    const info = await transporter.sendMail({
        from: '"NTIBookStore" <csgabdelrahman@gmail.com>',
        to: email,
        subject: "Verify your Email",
        text: "This is a verification email from NTIBookStore.",
        html: emailTemplate(email),
    });
    console.log("Message sent:", info.messageId);
}
