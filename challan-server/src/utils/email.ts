import { Resend } from 'resend';
import { AppError } from './AppError';

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = async (to: string, subject: string, text: string, html?: string) : Promise<void> => {
    try {
        const { data, error } = await resend.emails.send({
            from: `Anchal Raj <${process.env.FROM_EMAIL}>`,
            to: [to],
            subject: subject,   
            text: text,
            html: html || `<p>${text}</p>`,
        });

        if (error) {
            console.error('Resend API Error:', error);
            throw new AppError('Email service failed', 500);
        }

        console.log(`Email sent successfully to ${to}. ID: ${data?.id}`);
        
        
    } catch (error) {
        console.error("Unexpected Error sending email:", error);
        throw new AppError("Failed to send email", 500);
    }
};
