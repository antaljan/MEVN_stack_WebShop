/**
 * Call (or POST Data for) the Backend email service, using Node.js, Express, Nodemailer, and GMX SMTP service.
 */
import axios from 'axios';

export async function sendEmail({ email, subject, message }) {
    const to = email;
    const text = message;
    console.log(`Sending email to: ${to} with subject: ${subject} and message: ${text}`);
    try {
        await axios.post('https://yowayoli.com/api/email/send', {
            to,
            subject,
            text
        });
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}