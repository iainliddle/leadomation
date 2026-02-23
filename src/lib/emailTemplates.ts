export const BASE_LAYOUT = (subject: string, bodyContent: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#F8F9FF;font-family:Inter,system-ui,sans-serif;">
  
  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F9FF;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4F46E5 0%,#06B6D4 100%);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:8px;display:inline-block;line-height:36px;text-align:center;font-weight:900;color:white;font-size:18px;">L</div>
                <span style="color:white;font-size:22px;font-weight:700;letter-spacing:-0.5px;">Leadomation</span>
              </div>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="background:#FFFFFF;padding:40px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
              ${bodyContent}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background:#F3F4F6;border-radius:0 0 16px 16px;padding:24px 40px;border:1px solid #E5E7EB;border-top:none;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;line-height:1.6;">
                You're receiving this email because you signed up for Leadomation.<br>
                <a href="{{UNSUBSCRIBE_URL}}" style="color:#6B7280;text-decoration:underline;">Unsubscribe</a> · 
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

export const WELCOME_EMAIL_BODY = `
<h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#111827;letter-spacing:-0.5px;">Welcome aboard! 🎉</h1>
<p style="margin:0 0 24px;font-size:15px;color:#6B7280;">Your 7-day Pro trial has started</p>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
  Hi {{first_name}},
</p>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
  I'm Iain, founder of Leadomation. I'm genuinely excited you've decided to try the platform — it's been built from the ground up to help businesses like yours find, contact, and close more leads on autopilot.
</p>

<p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;">
  Here's how to get the most out of your 7-day trial:
</p>

<!-- Steps -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
  <tr>
    <td style="padding:16px;background:#F8F9FF;border-radius:12px;border-left:4px solid #4F46E5;margin-bottom:12px;display:block;">
      <div style="font-size:13px;font-weight:700;color:#4F46E5;margin-bottom:4px;">STEP 1</div>
      <div style="font-size:14px;font-weight:600;color:#111827;margin-bottom:4px;">Launch your first campaign</div>
      <div style="font-size:13px;color:#6B7280;">Search for businesses in your target industry and location. We'll find leads and their contact details automatically.</div>
    </td>
  </tr>
  <tr><td style="height:8px;"></td></tr>
  <tr>
    <td style="padding:16px;background:#F8F9FF;border-radius:12px;border-left:4px solid #06B6D4;">
      <div style="font-size:13px;font-weight:700;color:#06B6D4;margin-bottom:4px;">STEP 2</div>
      <div style="font-size:14px;font-weight:600;color:#111827;margin-bottom:4px;">Set up your email sequence</div>
      <div style="font-size:13px;color:#6B7280;">Build a multi-step outreach sequence that runs automatically. Set it once, let it work for you.</div>
    </td>
  </tr>
  <tr><td style="height:8px;"></td></tr>
  <tr>
    <td style="padding:16px;background:#F8F9FF;border-radius:12px;border-left:4px solid #4F46E5;">
      <div style="font-size:13px;font-weight:700;color:#4F46E5;margin-bottom:4px;">STEP 3</div>
      <div style="font-size:14px;font-weight:600;color:#111827;margin-bottom:4px;">Watch the leads come in</div>
      <div style="font-size:13px;color:#6B7280;">Track replies in your Unified Inbox and move deals through your pipeline.</div>
    </td>
  </tr>
</table>

<!-- CTA Button -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
  <tr>
    <td align="center">
      <a href="https://app.leadomation.co.uk" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#06B6D4);color:white;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:10px;">
        Launch Your First Campaign →
      </a>
    </td>
  </tr>
</table>

<p style="margin:0 0 8px;font-size:15px;color:#374151;line-height:1.7;">
  If you have any questions at all, just reply to this email — I read every message personally.
</p>

<p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
  Iain Liddle<br>
  <span style="color:#6B7280;">Founder, Leadomation</span>
</p>
`;

export const NUDGE_EMAIL_BODY = `
<h1 style="margin:0 0 24px;font-size:24px;font-weight:800;color:#111827;">5 days left on your trial</h1>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">Hi {{first_name}},</p>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
  You signed up 2 days ago — have you had a chance to launch your first campaign yet?
</p>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
  It takes less than 2 minutes. Just tell us your target industry and location, and we'll find businesses with their contact details automatically.
</p>

<!-- Stat callout -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
  <tr>
    <td style="background:linear-gradient(135deg,#4F46E5,#06B6D4);border-radius:12px;padding:24px;text-align:center;">
      <div style="font-size:36px;font-weight:900;color:white;margin-bottom:4px;">500</div>
      <div style="font-size:14px;color:rgba(255,255,255,0.85);">leads available per month on your Starter plan</div>
    </td>
  </tr>
</table>

<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
  <tr>
    <td align="center">
      <a href="https://app.leadomation.co.uk" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#06B6D4);color:white;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:10px;">
        Launch My First Campaign →
      </a>
    </td>
  </tr>
</table>

<p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
  Iain<br>
  <span style="color:#6B7280;">Founder, Leadomation</span>
</p>
`;

export const URGENCY_EMAIL_BODY = `
<h1 style="margin:0 0 24px;font-size:24px;font-weight:800;color:#111827;">Your trial ends in 2 days</h1>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">Hi {{first_name}},</p>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
  Your 7-day Pro trial ends in 2 days. After that you'll lose access to:
</p>

<!-- Feature list -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
  <tr>
    <td style="padding:20px;background:#FEF2F2;border-radius:12px;border-left:4px solid #EF4444;">
      <div style="font-size:14px;color:#374151;line-height:2;">
        ❌ AI Voice Call Agent<br>
        ❌ Unlimited campaigns<br>
        ❌ 5,000+ leads per month<br>
        ❌ Global Demand Intelligence<br>
        ❌ Multi-channel sequences<br>
        ❌ Deal Pipeline CRM
      </div>
    </td>
  </tr>
</table>

<p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;">
  Upgrade now to keep everything and continue growing your pipeline on autopilot.
</p>

<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
  <tr>
    <td align="center">
      <a href="https://leadomation.co.uk/pricing" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#06B6D4);color:white;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:10px;">
        Upgrade My Plan →
      </a>
    </td>
  </tr>
</table>

<p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
  Iain<br>
  <span style="color:#6B7280;">Founder, Leadomation</span>
</p>
`;

export const TRIAL_ENDING_EMAIL_BODY = `
<h1 style="margin:0 0 24px;font-size:24px;font-weight:800;color:#111827;">Last chance to upgrade 🚨</h1>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">Hi {{first_name}},</p>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
  Your free trial ends today. To keep using Leadomation and continue finding leads on autopilot, upgrade now.
</p>

<!-- Pricing cards -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
  <tr>
    <td width="48%" style="padding:20px;background:#F8F9FF;border-radius:12px;border:1px solid #E5E7EB;vertical-align:top;">
      <div style="font-size:13px;font-weight:700;color:#6B7280;margin-bottom:8px;">STARTER</div>
      <div style="font-size:28px;font-weight:900;color:#111827;">£49<span style="font-size:14px;font-weight:400;color:#6B7280;">/mo</span></div>
      <div style="font-size:12px;color:#6B7280;margin-bottom:12px;">or £490/year</div>
      <div style="font-size:13px;color:#374151;line-height:1.8;">✓ 3 campaigns<br>✓ 500 leads/mo<br>✓ 50 emails/day</div>
    </td>
    <td width="4%"></td>
    <td width="48%" style="padding:20px;background:linear-gradient(135deg,#4F46E5,#06B6D4);border-radius:12px;vertical-align:top;">
      <div style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.7);margin-bottom:8px;">PRO</div>
      <div style="font-size:28px;font-weight:900;color:white;">£149<span style="font-size:14px;font-weight:400;color:rgba(255,255,255,0.7);">/mo</span></div>
      <div style="font-size:12px;color:rgba(255,255,255,0.7);margin-bottom:12px;">or £1,430/year</div>
      <div style="font-size:13px;color:white;line-height:1.8;">✓ Unlimited campaigns<br>✓ 5,000+ leads/mo<br>✓ AI Voice Agent</div>
    </td>
  </tr>
</table>

<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
  <tr>
    <td align="center">
      <a href="https://leadomation.co.uk/pricing" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#06B6D4);color:white;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:10px;">
        Choose My Plan →
      </a>
    </td>
  </tr>
</table>

<p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
  Iain<br>
  <span style="color:#6B7280;">Founder, Leadomation</span>
</p>
`;

export const CANCELLATION_EMAIL_BODY = `
<h1 style="margin:0 0 24px;font-size:24px;font-weight:800;color:#111827;">We've cancelled your subscription</h1>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">Hi {{first_name}},</p>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
  Your Leadomation subscription has been cancelled. Your data will be kept safe for 30 days in case you change your mind.
</p>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
  I'd love to know why you cancelled — it only takes one click:
</p>

<!-- Reason buttons -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
  <tr>
    <td style="padding:8px 0;">
      <a href="mailto:iainliddle@leadomation.co.uk?subject=Cancellation reason: Too expensive" style="display:block;padding:12px 20px;background:#F8F9FF;border:1px solid #E5E7EB;border-radius:8px;font-size:14px;color:#374151;text-decoration:none;">💰 It was too expensive</a>
    </td>
  </tr>
  <tr>
    <td style="padding:8px 0;">
      <a href="mailto:iainliddle@leadomation.co.uk?subject=Cancellation reason: Missing features" style="display:block;padding:12px 20px;background:#F8F9FF;border:1px solid #E5E7EB;border-radius:8px;font-size:14px;color:#374151;text-decoration:none;">🔧 It was missing features I needed</a>
    </td>
  </tr>
  <tr>
    <td style="padding:8px 0;">
      <a href="mailto:iainliddle@leadomation.co.uk?subject=Cancellation reason: Too complicated" style="display:block;padding:12px 20px;background:#F8F9FF;border:1px solid #E5E7EB;border-radius:8px;font-size:14px;color:#374151;text-decoration:none;">😕 It was too complicated to use</a>
    </td>
  </tr>
  <tr>
    <td style="padding:8px 0;">
      <a href="mailto:iainliddle@leadomation.co.uk?subject=Cancellation reason: No longer needed" style="display:block;padding:12px 20px;background:#F8F9FF;border:1px solid #E5E7EB;border-radius:8px;font-size:14px;color:#374151;text-decoration:none;">📦 I no longer need it</a>
    </td>
  </tr>
</table>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
  If price was the issue, reply to this email — I may be able to help.
</p>

<p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
  Iain<br>
  <span style="color:#6B7280;">Founder, Leadomation</span>
</p>
`;

export const WIN_BACK_EMAIL_BODY = `
<h1 style="margin:0 0 24px;font-size:24px;font-weight:800;color:#111827;">We've been busy building 🚀</h1>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">Hi {{first_name}},</p>

<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
  It's been a couple of weeks since you left. We've been listening to feedback and shipping improvements — I wanted to share what's new.
</p>

<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
  <tr>
    <td style="padding:20px;background:#F8F9FF;border-radius:12px;border-left:4px solid #06B6D4;">
      <div style="font-size:14px;color:#374151;line-height:2;">
        🤖 AI Voice Call Agent — now live<br>
        📊 Global Demand Intelligence — keyword search volume data<br>
        📥 Unified Inbox — all replies in one place<br>
        🔗 LinkedIn automation — connect on autopilot
      </div>
    </td>
  </tr>
</table>

<p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;">
  If you'd like to give Leadomation another shot, your data is still intact and ready to go.
</p>

<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
  <tr>
    <td align="center">
      <a href="https://leadomation.co.uk" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#06B6D4);color:white;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:10px;">
        Reactivate My Account →
      </a>
    </td>
  </tr>
</table>

<p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
  Iain<br>
  <span style="color:#6B7280;">Founder, Leadomation</span>
</p>
`;
