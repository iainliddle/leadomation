import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Authenticate user via Bearer token
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the user's session
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
        return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const {
        leadId,
        phoneNumber,
        leadFirstName,
        leadLastName,
        leadCompany,
        leadJobTitle,
        callScriptId,
        systemPrompt
    } = req.body;

    // Input validation
    if (!leadId || !phoneNumber) {
        return res.status(400).json({ error: 'leadId and phoneNumber are required' });
    }

    // Verify user owns this lead
    const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('id')
        .eq('id', leadId)
        .eq('user_id', user.id)
        .single();

    if (leadError || !lead) {
        return res.status(403).json({ error: 'Lead not found or access denied' });
    }

    // Get Vapi credentials from server-side env vars
    const apiKey = process.env.VAPI_API_KEY;
    const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;

    if (!apiKey || !phoneNumberId) {
        console.error('Vapi API key or phone number not configured');
        return res.status(500).json({ error: 'Voice calling not configured' });
    }

    // Normalize phone number
    let normalizedPhone = phoneNumber.replace(/\s/g, '');
    if (!normalizedPhone.startsWith('+')) {
        normalizedPhone = '+' + normalizedPhone;
    }

    try {
        const response = await fetch('https://api.vapi.ai/call/phone', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumberId: phoneNumberId,
                metadata: {
                    user_id: user.id,
                    lead_id: leadId,
                    call_script_id: callScriptId
                },
                customer: {
                    number: normalizedPhone,
                    name: `${leadFirstName || ''} ${leadLastName || ''}`.trim() || leadCompany
                },
                assistant: {
                    name: 'Sarah',
                    serverUrl: process.env.VAPI_SERVER_URL || 'https://n8n.srv1377696.hstgr.cloud/webhook/2d5b4f99-77c8-48e7-a8b9-78b28c789ea2',
                    firstMessage: `Hi there, is ${leadFirstName || 'the manager'} available at all?`,
                    firstMessageMode: 'assistant-waits-for-user',
                    model: {
                        provider: 'openai',
                        model: 'gpt-4o-mini',
                        temperature: 0.7,
                        messages: [
                            {
                                role: 'system',
                                content: systemPrompt + `\n\nCALL CONTEXT:\n- You are calling: ${leadFirstName || ''} ${leadLastName || ''}\n- Their company: ${leadCompany}\n- Their role: ${leadJobTitle || 'Unknown'}\n- Your name is Sarah. Always introduce yourself as Sarah calling on behalf of the company mentioned in your script\n- ALWAYS start by asking for ${leadFirstName || 'the right person'} by name. Wait for confirmation before pitching anything.\n- After confirming you are speaking to the right person, say "Hey ${leadFirstName || 'there'}, it is Sarah calling on behalf of" and then mention the company from your script. Then say "How are you doing today?" and WAIT for their response before continuing.\n\nCONVERSATION STYLE:\n- Sound like a real human being having a phone conversation, not a robot or AI\n- Use filler words occasionally like "um", "so", "right", "anyway" to sound natural\n- Keep responses SHORT. One sentence at a time. Real people do not give speeches on the phone\n- After saying something, STOP and wait for the other person to respond. Do not keep talking\n- React to what they say before moving on. Say things like "oh nice", "ah right okay", "yeah that makes sense"\n- Match the speed and tone of the person you are talking to\n- Laugh briefly if something is funny. Be personable\n- NEVER read out URLs, links, or email addresses. Say you will text or email them instead\n- NEVER say "as an AI" or "I am an artificial intelligence" unless directly asked\n- If asked if you are real, say "Ha, I get that a lot. I am actually an AI assistant calling on behalf of the team, but I can definitely help you out or get someone from the team to call you back"\n- Do not repeat yourself or circle back to things already discussed\n\nBOOKING A MEETING:\n- When the prospect agrees to a meeting, say: "Brilliant, let me get that booked in for you. What is the best email address to send the calendar invite to?"\n- Wait for them to give their email. Confirm it back by repeating it\n- Then say: "Perfect. And what is the best mobile number to ping the confirmation text to? Sometimes these get buried in email"\n- If they give the business number you called, say: "No problem. And is that a mobile? Just so the text comes through properly"\n- Once you have their mobile number, confirm it back to them\n- Then say: "Lovely, I will get that sent over to you now. You should have it in the next couple of minutes"\n- NEVER mention that you already have their email or any of their details. Let them provide everything naturally\n- NEVER read out a URL or booking link. Just say you will send the invite to their email and a text to their mobile\n- Store the email and mobile number they give you. These are critical for follow up\n- Keep the booking process feeling personal and human, like a real assistant would handle it`
                            }
                        ]
                    },
                    voice: {
                        provider: '11labs',
                        voiceId: 'cgSgspJ2msm6clMCkdW9',
                        model: 'eleven_turbo_v2_5'
                    },
                    silenceTimeoutSeconds: 30,
                    responseDelaySeconds: 0.5
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Vapi API error:', errorData);
            return res.status(response.status).json({ error: errorData.message || 'Failed to initiate call' });
        }

        const callData = await response.json();

        // Log the call
        await supabase.from('call_logs').insert({
            user_id: user.id,
            lead_id: leadId,
            call_script_id: callScriptId,
            vapi_call_id: callData.id,
            status: 'initiated',
            phone_number: normalizedPhone
        });

        return res.status(200).json({
            success: true,
            callId: callData.id
        });

    } catch (error: any) {
        console.error('Call initiation error:', error);
        return res.status(500).json({ error: 'Failed to initiate call' });
    }
}
