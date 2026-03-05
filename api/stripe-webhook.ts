import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const BASE_LAYOUT = (subject: string, bodyContent: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#F8F9FF;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F9FF;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background:linear-gradient(135deg,#4F46E5 0%,#06B6D4 100%);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:8px;display:inline-block;line-height:36px;text-align:center;font-weight:900;color:white;font-size:18px;">L</div>
                <span style="color:white;font-size:22px;font-weight:700;letter-spacing:-0.5px;">Leadomation</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#FFFFFF;padding:40px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
              ${bodyContent}
            </td>
          </tr>
          <tr>
            <td style="background:#F3F4F6;border-radius:0 0 16px 16px;padding:24px 40px;border:1px solid #E5E7EB;border-top:none;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;line-height:1.6;">
                You're receiving this email because you signed up for Leadomation.<br>
                <a href="#" style="color:#6B7280;text-decoration:underline;">Unsubscribe</a> · 
                <a href="https://leadomation.co.uk" style="color:#6B7280;text-decoration:underline;">Visit Leadomation</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const CANCELLATION_EMAIL_BODY = `
<h1 style="margin:0 0 24px;font-size:24px;font-weight:800;color:#111827;">We've cancelled your subscription</h1>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">Hi {{first_name}},</p>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
  Your Leadomation subscription has been cancelled. Your data will be kept safe for 30 days in case you change your mind.
</p>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
  I'd love to know why you cancelled — it only takes one click:
</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
  <tr><td style="padding:8px 0;"><a href="mailto:iainliddle@leadomation.co.uk?subject=Cancellation reason: Too expensive" style="display:block;padding:12px 20px;background:#F8F9FF;border:1px solid #E5E7EB;border-radius:8px;font-size:14px;color:#374151;text-decoration:none;">💰 It was too expensive</a></td></tr>
  <tr><td style="padding:8px 0;"><a href="mailto:iainliddle@leadomation.co.uk?subject=Cancellation reason: Missing features" style="display:block;padding:12px 20px;background:#F8F9FF;border:1px solid #E5E7EB;border-radius:8px;font-size:14px;color:#374151;text-decoration:none;">🔧 It was missing features I needed</a></td></tr>
  <tr><td style="padding:8px 0;"><a href="mailto:iainliddle@leadomation.co.uk?subject=Cancellation reason: Too complicated" style="display:block;padding:12px 20px;background:#F8F9FF;border:1px solid #E5E7EB;border-radius:8px;font-size:14px;color:#374151;text-decoration:none;">😕 It was too complicated to use</a></td></tr>
  <tr><td style="padding:8px 0;"><a href="mailto:iainliddle@leadomation.co.uk?subject=Cancellation reason: No longer needed" style="display:block;padding:12px 20px;background:#F8F9FF;border:1px solid #E5E7EB;border-radius:8px;font-size:14px;color:#374151;text-decoration:none;">📦 I no longer need it</a></td></tr>
</table>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
  If price was the issue, reply to this email — I may be able to help.
</p>
<p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
  Iain<br>
  <span style="color:#6B7280;">Founder, Leadomation</span>
</p>
`;

// Disable Vercel's default body parsing — Stripe needs the raw body for signature verification
export const config = {
    api: {
        bodyParser: false,
    },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
});

// Note: uses VITE_SUPABASE_URL (the actual env var name in this project)
// Uses SUPABASE_SERVICE_ROLE_KEY (not the anon key) to bypass RLS
const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Map Stripe Price IDs → plan names
const PRICE_TO_PLAN: Record<string, 'starter' | 'pro'> = {
    [process.env.STRIPE_PRICE_STARTER_MONTHLY!]: 'starter',
    [process.env.STRIPE_PRICE_STARTER_ANNUAL!]: 'starter',
    [process.env.STRIPE_PRICE_PRO_MONTHLY!]: 'pro',
    [process.env.STRIPE_PRICE_PRO_ANNUAL!]: 'pro',
};

// Read raw body from request stream (required for Stripe signature verification)
async function getRawBody(req: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const rawBody = await getRawBody(req);
    const signature = req.headers['stripe-signature'];

    let event: Stripe.Event;

    // Verify the webhook came from Stripe (not a spoofed request)
    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error('Stripe signature verification failed:', err.message);
        return res.status(400).json({ error: `Webhook error: ${err.message}` });
    }

    console.log('Stripe webhook received:', event.type);

    try {
        switch (event.type) {

            // ─────────────────────────────────────────────────────────────
            // New payment completed — activate the plan
            // ─────────────────────────────────────────────────────────────
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;

                // Only handle subscription checkouts (not one-time payments)
                if (session.mode !== 'subscription') break;

                const customerId = session.customer as string;
                const subscriptionId = session.subscription as string;

                const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
                    expand: ['line_items']
                });

                // Get price ID from either expanded session or original session, and trim it
                const rawPriceId = expandedSession.line_items?.data[0]?.price?.id || session.line_items?.data[0]?.price?.id || '';
                const priceId = typeof rawPriceId === 'string' ? rawPriceId.trim() : '';

                console.log('Price ID from session:', priceId);
                console.log('Pro monthly:', process.env.STRIPE_PRICE_PRO_MONTHLY);
                console.log('Pro annual:', process.env.STRIPE_PRICE_PRO_ANNUAL);
                console.log('Starter monthly:', process.env.STRIPE_PRICE_STARTER_MONTHLY);
                console.log('Starter annual:', process.env.STRIPE_PRICE_STARTER_ANNUAL);

                let plan: 'starter' | 'pro' | undefined;

                if (priceId) {
                    if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY?.trim() || priceId === process.env.STRIPE_PRICE_PRO_ANNUAL?.trim()) {
                        plan = 'pro';
                    } else if (priceId === process.env.STRIPE_PRICE_STARTER_MONTHLY?.trim() || priceId === process.env.STRIPE_PRICE_STARTER_ANNUAL?.trim()) {
                        plan = 'starter';
                    }
                }

                // Fallback plan detection
                if (!plan) {
                    console.log('Price ID exact match failed. Falling back to amount_total or metadata check. Session amount_total:', session.amount_total, 'Metadata:', session.metadata);
                    const amount = session.amount_total || expandedSession.amount_total;

                    if (session.metadata?.plan === 'pro') {
                        plan = 'pro';
                    } else if (session.metadata?.plan === 'starter') {
                        plan = 'starter';
                    } else if (amount && amount >= 14900) {
                        plan = 'pro';
                    } else if (amount && amount >= 4900) {
                        plan = 'starter';
                    } else {
                        console.error('Unrecognised price ID:', priceId, 'and all fallbacks failed.');
                        break;
                    }
                }

                // Try to find the user by Stripe customer ID first
                let { data: profile } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('stripe_customer_id', customerId)
                    .single();

                // Fallback: find by email (handles first-time purchases before customer ID is stored)
                if (!profile) {
                    const email = session.customer_details?.email;
                    if (email) {
                        const result = await supabase
                            .from('profiles')
                            .select('id')
                            .eq('email', email)
                            .single();
                        profile = result.data;
                    }
                }

                if (!profile) {
                    console.error('No profile found for Stripe customer:', customerId);
                    break;
                }

                // Update the user's plan and store their Stripe customer ID for future lookups
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        plan: plan,
                        stripe_customer_id: customerId,
                    })
                    .eq('id', profile.id);

                if (error) {
                    console.error('Failed to activate plan:', error);
                } else {
                    console.log(`✅ Plan activated: user ${profile.id} → ${plan}`);

                    // Trigger n8n welcome email webhook
                    try {
                        const customer = await stripe.customers.retrieve(customerId);
                        if (customer && !('deleted' in customer) && customer.email) {
                            const first_name = customer.name?.split(' ')[0] || 'there';

                            await fetch('https://n8n.srv1377696.hstgr.cloud/webhook/welcome-email', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    to: customer.email,
                                    first_name: first_name
                                })
                            });
                            console.log(`✅ Welcome email webhook triggered for ${customer.email}`);
                        }
                    } catch (webhookErr) {
                        console.error('Failed to trigger welcome email webhook:', webhookErr);
                    }
                }

                break;
            }

            // ─────────────────────────────────────────────────────────────
            // Subscription changed — handle upgrades and downgrades
            // ─────────────────────────────────────────────────────────────
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const priceId = subscription.items.data[0]?.price?.id;
                const plan = PRICE_TO_PLAN[priceId];

                if (!plan) {
                    console.error('Unrecognised price ID on update:', priceId);
                    break;
                }

                const { error } = await supabase
                    .from('profiles')
                    .update({ plan: plan })
                    .eq('stripe_customer_id', customerId);

                if (error) {
                    console.error('Failed to update plan:', error);
                } else {
                    console.log(`✅ Plan updated → ${plan} for customer ${customerId}`);
                }

                break;
            }

            // ─────────────────────────────────────────────────────────────
            // Subscription cancelled — lock the account
            // ─────────────────────────────────────────────────────────────
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                const { error } = await supabase
                    .from('profiles')
                    .update({ plan: 'cancelled' })
                    .eq('stripe_customer_id', customerId);

                if (error) {
                    console.error('Failed to cancel plan:', error);
                } else {
                    console.log(`✅ Plan cancelled for customer ${customerId}`);

                    // Send cancellation email
                    try {
                        const customer = await stripe.customers.retrieve(customerId);
                        if (customer && !('deleted' in customer) && customer.email) {
                            const firstName = (customer.name || 'there').split(' ')[0];
                            const subject = 'Sorry to see you go — can I ask why?';
                            const body = CANCELLATION_EMAIL_BODY.replace(/{{first_name}}/g, firstName);
                            const html = BASE_LAYOUT(subject, body);

                            await resend.emails.send({
                                from: 'Iain from Leadomation <iainliddle@leadomation.co.uk>',
                                to: customer.email,
                                replyTo: 'iainliddle@leadomation.co.uk',
                                subject: subject,
                                html: html,
                            });
                        }
                    } catch (emailErr) {
                        console.error('Failed to send cancellation email:', emailErr);
                    }
                }

                break;
            }

            case 'customer.subscription.trial_will_end': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                try {
                    const customer = await stripe.customers.retrieve(customerId);
                    if (customer && !('deleted' in customer) && customer.email) {
                        const firstName = (customer.name || 'there').split(' ')[0];
                        const trialEnd = new Date(subscription.trial_end! * 1000);
                        const chargeDate = trialEnd.toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        });
                        const priceId = subscription.items.data[0]?.price?.id;
                        const plan = PRICE_TO_PLAN[priceId || ''];
                        const amount = plan === 'pro' ? '£149' : '£49';
                        const planName = plan === 'pro' ? 'Pro' : 'Starter';

                        const subject = `Your free trial ends in 2 days — here's what happens next`;
                        const bodyContent = `
                            <h1 style="margin:0 0 24px;font-size:24px;font-weight:800;color:#111827;">Your trial ends on ${chargeDate}</h1>
                            <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">Hi ${firstName},</p>
                            <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
                                Your 7-day free trial of Leadomation ${planName} ends on <strong>${chargeDate}</strong>. 
                                Unless you cancel before then, your card will automatically be charged <strong>${amount}/month</strong> and your subscription will continue.
                            </p>
                            <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
                                <p style="margin:0;font-size:14px;color:#92400E;line-height:1.7;">
                                    <strong>⚠️ Important:</strong> If you are charged and do not cancel before the billing date, 
                                    please note that monthly subscription charges are non-refundable. 
                                    You can cancel at any time after being charged and will retain access until the end of that billing period.
                                </p>
                            </div>
                            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;">
                                If you want to cancel, you can do so from your account settings before <strong>${chargeDate}</strong>. 
                                No hard feelings — we'll send you a confirmation straight away.
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td align="center">
                                        <a href="https://leadomation.co.uk" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#06B6D4);color:white;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:10px;">
                                            Continue Using Leadomation →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
                                Iain<br>
                                <span style="color:#6B7280;">Founder, Leadomation</span>
                            </p>
                        `;

                        await resend.emails.send({
                            from: 'Iain from Leadomation <iainliddle@leadomation.co.uk>',
                            to: customer.email,
                            replyTo: 'iainliddle@leadomation.co.uk',
                            subject: subject,
                            html: BASE_LAYOUT(subject, bodyContent),
                        });
                        console.log(`✅ Trial reminder email sent to ${customer.email}`);
                    }
                } catch (emailErr) {
                    console.error('Failed to send trial reminder email:', emailErr);
                }
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                const customerId = invoice.customer as string;

                try {
                    const customer = await stripe.customers.retrieve(customerId);
                    if (customer && !('deleted' in customer) && customer.email) {
                        const firstName = (customer.name || 'there').split(' ')[0];
                        const subject = `Action required: Your Leadomation payment failed`;
                        const bodyContent = `
                            <h1 style="margin:0 0 24px;font-size:24px;font-weight:800;color:#111827;">Payment failed</h1>
                            <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">Hi ${firstName},</p>
                            <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
                                We were unable to process your payment for Leadomation. This can happen if your card has expired, 
                                has insufficient funds, or your bank declined the transaction.
                            </p>
                            <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
                                <p style="margin:0;font-size:14px;color:#991B1B;line-height:1.7;">
                                    <strong>⚠️ Your account access may be restricted</strong> until payment is resolved. 
                                    Please update your payment method as soon as possible to avoid interruption.
                                </p>
                            </div>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td align="center">
                                        <a href="https://leadomation.co.uk" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#06B6D4);color:white;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:10px;">
                                            Update Payment Method →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
                                If you need help, reply to this email and I'll sort it out personally.
                            </p>
                            <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
                                Iain<br>
                                <span style="color:#6B7280;">Founder, Leadomation</span>
                            </p>
                        `;

                        await resend.emails.send({
                            from: 'Iain from Leadomation <iainliddle@leadomation.co.uk>',
                            to: customer.email,
                            replyTo: 'iainliddle@leadomation.co.uk',
                            subject: subject,
                            html: BASE_LAYOUT(subject, bodyContent),
                        });

                        // Update plan to reflect payment issue
                        await supabase
                            .from('profiles')
                            .update({ plan: 'payment_failed' })
                            .eq('stripe_customer_id', customerId);

                        console.log(`✅ Payment failed email sent to ${customer.email}`);
                    }
                } catch (err) {
                    console.error('Failed to handle payment_failed event:', err);
                }
                break;
            }

            default:
                console.log('Unhandled Stripe event type:', event.type);
        }

        // Always return 200 to Stripe — prevents retry storms
        return res.status(200).json({ received: true });

    } catch (err: any) {
        console.error('Webhook handler error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
