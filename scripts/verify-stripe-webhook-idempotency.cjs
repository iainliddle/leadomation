// LEA-2 verification: replay a signed Stripe webhook payload twice and
// confirm the second delivery is rejected as a duplicate without re-running
// any side effects.
//
// Usage (PowerShell):
//   $env:STRIPE_WEBHOOK_SECRET = "whsec_..."           # local webhook signing secret
//   $env:WEBHOOK_URL = "http://localhost:3000/api/stripe-webhook"
//   node scripts/verify-stripe-webhook-idempotency.cjs
//
// What this exercises:
//   1. POST a fake invoice.payment_failed event with a deterministic id.
//   2. POST the same payload + signature again.
//   3. Assert: first response is 200 with duplicate=false (or no duplicate
//      field), second response is 200 with duplicate=true.
//
// Notes:
//   - Uses Stripe's own signature algorithm so the handler accepts it.
//   - Run against a local dev server. Do not point this at production.
//   - Requires the processed_stripe_events table to already exist in the
//     target Supabase project (run supabase/migrations/processed_stripe_events.sql first).

const crypto = require('crypto');

const url = process.env.WEBHOOK_URL || 'http://localhost:3000/api/stripe-webhook';
const secret = process.env.STRIPE_WEBHOOK_SECRET;

if (!secret) {
    console.error('Set STRIPE_WEBHOOK_SECRET to your local whsec_... value first.');
    process.exit(1);
}

const eventId = `evt_test_${crypto.randomBytes(8).toString('hex')}`;
const payload = JSON.stringify({
    id: eventId,
    object: 'event',
    api_version: '2026-01-28.clover',
    created: Math.floor(Date.now() / 1000),
    type: 'invoice.payment_failed',
    livemode: false,
    data: {
        object: {
            id: 'in_test_dedupe',
            object: 'invoice',
            customer: 'cus_test_dedupe',
            status: 'open',
        },
    },
    request: { id: null, idempotency_key: null },
});

function sign(body) {
    const timestamp = Math.floor(Date.now() / 1000);
    const signed = `${timestamp}.${body}`;
    const v1 = crypto.createHmac('sha256', secret).update(signed).digest('hex');
    return `t=${timestamp},v1=${v1}`;
}

async function deliver(label) {
    const signature = sign(payload);
    const started = Date.now();
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Stripe-Signature': signature,
        },
        body: payload,
    });
    const elapsed = Date.now() - started;
    const text = await res.text();
    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = text; }
    console.log(`[${label}] status=${res.status} ms=${elapsed} body=`, parsed);
    return { status: res.status, body: parsed, elapsed };
}

(async () => {
    console.log(`Replaying event ${eventId} twice against ${url}`);
    const first = await deliver('first ');
    const second = await deliver('second');

    let ok = true;
    if (first.status !== 200) {
        console.error('FAIL: first delivery did not return 200');
        ok = false;
    }
    if (second.status !== 200) {
        console.error('FAIL: second delivery did not return 200');
        ok = false;
    }
    if (second.body && second.body.duplicate !== true) {
        console.error('FAIL: second delivery did not report duplicate=true');
        ok = false;
    }
    if (second.elapsed >= first.elapsed) {
        console.warn(`WARN: second delivery (${second.elapsed}ms) was not faster than first (${first.elapsed}ms). Side effects may still be running. Check server logs.`);
    }

    if (ok) {
        console.log('PASS: duplicate event was rejected.');
    } else {
        process.exit(1);
    }
})();
