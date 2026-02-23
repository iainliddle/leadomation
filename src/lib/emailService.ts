import { BASE_LAYOUT, WELCOME_EMAIL_BODY, CANCELLATION_EMAIL_BODY } from './emailTemplates';

const sendEmail = async (to: string, subject: string, html: string) => {
    const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, html }),
    });
    return response.json();
};

export const sendWelcomeEmail = (email: string, firstName: string) => {
    const subject = "Welcome to Leadomation — let's find your first leads 🚀";
    const body = WELCOME_EMAIL_BODY.replace(/{{first_name}}/g, firstName);
    const html = BASE_LAYOUT(subject, body);
    return sendEmail(email, subject, html);
};

export const sendCancellationEmail = (email: string, firstName: string) => {
    const subject = "Sorry to see you go — can I ask why?";
    const body = CANCELLATION_EMAIL_BODY.replace(/{{first_name}}/g, firstName);
    const html = BASE_LAYOUT(subject, body);
    return sendEmail(email, subject, html);
};
