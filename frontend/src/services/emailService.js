/**
 * Call (or POST Data for) the Backend email service, using Node.js, Express, Nodemailer, and GMX SMTP service.
 */
import axios from 'axios';

export async function sendEmail({ email, subject, message }) {
    try {
        await axios.post('https://yowayoli.com/api/send-email', {
            email,
            subject,
            message
        });
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}