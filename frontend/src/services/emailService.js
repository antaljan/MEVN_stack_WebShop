import axios from 'axios';

export async function sendEmail({ email, subject, message }) {
  try {
    await axios.post('http://localhost:3000/send-email', {
      email,
      subject,
      message
    });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}