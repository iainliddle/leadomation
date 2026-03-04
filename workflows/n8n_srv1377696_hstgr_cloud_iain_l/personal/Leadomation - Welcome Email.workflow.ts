import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Leadomation - Welcome Email
// Nodes   : 2  |  Connections: 1
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook
// HttpRequest                        httpRequest                [creds]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook
//    → HttpRequest
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'I13XKJMw2czBhMgE',
    name: 'Leadomation - Welcome Email',
    active: true,
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: false },
})
export class LeadomationWelcomeEmailWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-432, -48],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'welcome-email',
        options: {},
    };

    @node({
        name: 'HTTP Request',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [-160, -48],
        credentials: { httpHeaderAuth: { id: 'ZEIm8l0b4Rina87B', name: 'Header Auth account' } },
    })
    HttpRequest = {
        method: 'POST',
        url: 'https://api.resend.com/emails',
        authentication: 'genericCredentialType',
        genericAuthType: 'httpHeaderAuth',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Content-Type',
                    value: 'application/json',
                },
            ],
        },
        sendBody: true,
        bodyParameters: {
            parameters: [
                {
                    name: 'from',
                    value: 'Iain from Leadomation <iainliddle@leadomation.co.uk>',
                },
                {
                    name: 'to',
                    value: '={{ $json.body.to }}\n',
                },
                {
                    name: 'subject',
                    value: "Welcome to Leadomation — let's find your first leads 🚀",
                },
                {
                    name: 'html',
                    value: '=<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background-color:#F8F9FF;font-family:Inter,system-ui,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" bgcolor="#F8F9FF" style="background-color:#F8F9FF;padding:40px 20px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;"><tr><td bgcolor="#ffffff" style="background-color:#ffffff;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;border-top:6px solid #4F46E5;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;"><img src="https://www.leadomation.co.uk/assets/logo-full-CtvVA_AY.png" alt="Leadomation" width="180" style="display:block;margin:0 auto;height:auto;" /></td></tr><tr><td bgcolor="#ffffff" style="background-color:#ffffff;padding:40px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;"><table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;"><tr><td bgcolor="#EEF2FF" style="width:64px;height:64px;background:#EEF2FF;border-radius:50%;text-align:center;vertical-align:middle;"><span style="font-size:28px;line-height:64px;">🚀</span></td></tr></table><h1 style="margin:0 0 12px;font-size:26px;font-weight:800;color:#111827;letter-spacing:-0.5px;text-align:center;">Welcome aboard! 🎉</h1><p style="margin:0 0 24px;font-size:15px;color:#6B7280;text-align:center;line-height:1.6;">Your 7-day Pro trial has started</p><p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">Hi {{ $json.body.firstName }},</p><p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">I\'m Iain, founder of Leadomation. I\'m genuinely excited you\'ve decided to try the platform — it\'s been built from the ground up to help businesses like yours find, contact, and close more leads on autopilot.</p><p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;">Here\'s how to get the most out of your 7-day trial:</p><table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr><td style="padding:16px;background:#F8F9FF;border-radius:12px;border-left:4px solid #4F46E5;"><div style="font-size:13px;font-weight:700;color:#4F46E5;margin-bottom:4px;">STEP 1</div><div style="font-size:14px;font-weight:600;color:#111827;margin-bottom:4px;">Launch your first campaign</div><div style="font-size:13px;color:#6B7280;">Search for businesses in your target industry and location. We\'ll find leads and their contact details automatically.</div></td></tr><tr><td style="height:8px;"></td></tr><tr><td style="padding:16px;background:#F8F9FF;border-radius:12px;border-left:4px solid #06B6D4;"><div style="font-size:13px;font-weight:700;color:#06B6D4;margin-bottom:4px;">STEP 2</div><div style="font-size:14px;font-weight:600;color:#111827;margin-bottom:4px;">Set up your email sequence</div><div style="font-size:13px;color:#6B7280;">Build a multi-step outreach sequence that runs automatically. Set it once, let it work for you.</div></td></tr><tr><td style="height:8px;"></td></tr><tr><td style="padding:16px;background:#F8F9FF;border-radius:12px;border-left:4px solid #4F46E5;"><div style="font-size:13px;font-weight:700;color:#4F46E5;margin-bottom:4px;">STEP 3</div><div style="font-size:14px;font-weight:600;color:#111827;margin-bottom:4px;">Watch the leads come in</div><div style="font-size:13px;color:#6B7280;">Track replies in your Unified Inbox and move deals through your pipeline.</div></td></tr></table><table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;"><tr><td align="center"><table cellpadding="0" cellspacing="0"><tr><td bgcolor="#4F46E5" style="background-color:#4F46E5;border-radius:10px;"><a href="https://www.leadomation.co.uk/dashboard" style="display:inline-block;background-color:#4F46E5;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;padding:16px 48px;border-radius:10px;">Launch Your First Campaign →</a></td></tr></table></td></tr></table><p style="margin:0 0 8px;font-size:15px;color:#374151;line-height:1.7;">If you have any questions at all, just reply to this email — I read every message personally.</p><p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">Iain Liddle<br><span style="color:#6B7280;">Founder, Leadomation</span></p></td></tr><tr><td bgcolor="#F3F4F6" style="background:#F3F4F6;border-radius:0 0 16px 16px;padding:24px 40px;border:1px solid #E5E7EB;border-top:none;"><p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;line-height:1.6;">© 2026 Leadomation. All rights reserved.<br><a href="https://www.leadomation.co.uk" style="color:#6B7280;text-decoration:underline;">leadomation.co.uk</a></p></td></tr></table></td></tr></table></body></html>',
                },
            ],
        },
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Webhook.out(0).to(this.HttpRequest.in(0));
    }
}
