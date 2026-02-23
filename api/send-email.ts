import { Resend } from 'resend';
import { BASE_LAYOUT, WELCOME_EMAIL_BODY } from '../src/lib/emailTemplates.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let { to, subject, html, type, firstName } = req.body;

    // Handle server-side triggers from Supabase (type: 'welcome')
    if (type === 'welcome') {
        const name = firstName || 'there';
        subject = subject || "Welcome to Leadomation — let's find your first leads 🚀";
        const bodyContent = WELCOME_EMAIL_BODY.replace(/{{first_name}}/g, name);
        html = BASE_LAYOUT(subject, bodyContent);
    }

    if (!to || !subject || !html) {
        return res.status(400).json({ error: 'Missing required fields (to, subject, html)' });
    }

    try {
        const data = await resend.emails.send({
            from: 'Iain from Leadomation <iainliddle@leadomation.co.uk>',
            to,
            replyTo: 'iainliddle@leadomation.co.uk',
            subject,
            html,
        });

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Email send error:', error);
        return res.status(500).json({ error: 'Failed to send email' });
    }
}
