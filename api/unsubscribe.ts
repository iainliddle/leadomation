import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { email, userId } = req.query;

  if (!email || !userId) {
    return res.status(400).send('Missing required parameters');
  }

  try {
    // Add to suppression list
    await supabaseAdmin
      .from('suppression_list')
      .upsert({
        email: String(email),
        user_id: String(userId),
        reason: 'unsubscribed'
      }, { onConflict: 'email,user_id' });

    // Update lead status
    await supabaseAdmin
      .from('leads')
      .update({ status: 'unsubscribed' })
      .eq('email', String(email))
      .eq('user_id', String(userId));

  } catch (err) {
    console.error('Unsubscribe error:', err);
  }

  // Always return the confirmation page regardless of errors
  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(`<!DOCTYPE html>
<html>
<head><title>Unsubscribed | Leadomation</title></head>
<body style="margin:0;padding:0;background:#F8F9FF;font-family:Inter,system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="max-width:440px;width:100%;padding:2.5rem 2rem;background:white;border-radius:1rem;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);text-align:center;">
    <img src="https://www.leadomation.co.uk/assets/logo-full-CtvVA_AY.png" alt="Leadomation" style="height:36px;margin-bottom:1.5rem;">
    <h1 style="font-size:1.25rem;font-weight:800;color:#111827;margin-bottom:0.75rem;">You have been unsubscribed</h1>
    <p style="font-size:0.875rem;color:#6B7280;line-height:1.6;">You will no longer receive outreach emails from this sender. This may take up to 24 hours to take effect.</p>
  </div>
</body>
</html>`);
}
