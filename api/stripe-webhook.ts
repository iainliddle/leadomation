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

                // Get the price ID from the subscription
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const priceId = subscription.items.data[0]?.price?.id;
                const plan = PRICE_TO_PLAN[priceId];

                if (!plan) {
                    console.error('Unrecognised price ID:', priceId);
                    break;
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
