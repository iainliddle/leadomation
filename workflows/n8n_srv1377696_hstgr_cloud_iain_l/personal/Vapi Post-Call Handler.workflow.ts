import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Vapi Post-Call Handler
// Nodes   : 9  |  Connections: 8
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook
// CodeInJavascript                   code
// CreateARow                         supabase                   [creds]
// UpdateARow                         supabase                   [creds]
// CodeInJavascript1                  code
// If_                                if
// UpdateARow1                        supabase                   [creds]
// SendAnSmsmmswhatsappMessage        twilio                     [creds]
// CreateARow1                        supabase                   [creds]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook
//    → CodeInJavascript
//      → CreateARow
//        → UpdateARow
//          → CodeInJavascript1
//            → If_
//              → UpdateARow1
//                → CreateARow1
//                  → SendAnSmsmmswhatsappMessage
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'eL9rIBIgMbVgQisG',
    name: 'Vapi Post-Call Handler',
    active: true,
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: false },
})
export class VapiPostCallHandlerWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-1024, -48],
    })
    Webhook = {
        httpMethod: 'POST',
        path: '2d5b4f99-77c8-48e7-a8b9-78b28c789ea2',
        options: {},
    };

    @node({
        name: 'Code in JavaScript',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-816, -48],
    })
    CodeInJavascript = {
        jsCode: "const body = $input.all()[0].json.body || $input.all()[0].json;\n\nconst messageType = body.message?.type || body.type || 'unknown';\n\nif (messageType !== 'end-of-call-report') {\n  return [];\n}\n\nconst call = body.message || body;\nconst metadata = call.call?.metadata || call.metadata || {};\n\nreturn [{\n  json: {\n    vapi_call_id: call.call?.id || '',\n    phone_number: call.call?.customer?.number || '',\n    duration_seconds: call.call?.duration || 0,\n    transcript: call.artifact?.transcript || call.transcript || '',\n    summary: call.artifact?.summary || call.summary || '',\n    recording_url: call.artifact?.recordingUrl || call.recordingUrl || '',\n    ended_reason: call.endedReason || call.call?.endedReason || '',\n    status: call.analysis?.successEvaluation === 'true' ? 'completed' : 'no_answer',\n    cost: call.cost || 0\n  }\n}];",
    };

    @node({
        name: 'Create a row',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [-592, -48],
        credentials: { supabaseApi: { id: 'JsHaEd4OXk7Kdft4', name: 'Supabase account' } },
    })
    CreateARow = {
        tableId: 'call_logs',
        fieldsUi: {
            fieldValues: [
                {
                    fieldId: 'vapi_call_id',
                    fieldValue: '={{ $json.vapi_call_id }}',
                },
                {
                    fieldId: 'phone_number',
                    fieldValue: '={{ $json.phone_number }}',
                },
                {
                    fieldId: 'duration_seconds',
                    fieldValue: '={{ $json.duration_seconds }}',
                },
                {
                    fieldId: 'transcript',
                    fieldValue: '={{ $json.transcript }}',
                },
                {
                    fieldId: 'recording_url',
                    fieldValue: '={{ $json.recording_url }}',
                },
                {
                    fieldId: 'status',
                    fieldValue: '={{ $json.status }}',
                },
            ],
        },
    };

    @node({
        name: 'Update a row',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [-368, -48],
        credentials: { supabaseApi: { id: 'JsHaEd4OXk7Kdft4', name: 'Supabase account' } },
    })
    UpdateARow = {
        operation: 'update',
        tableId: 'leads',
        filters: {
            conditions: [
                {
                    keyName: 'phone',
                    condition: 'eq',
                    keyValue: '={{ $json.phone_number }}',
                },
            ],
        },
        fieldsUi: {
            fieldValues: [
                {
                    fieldId: 'status',
                    fieldValue: 'Contacted',
                },
            ],
        },
    };

    @node({
        name: 'Code in JavaScript1',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-160, -48],
    })
    CodeInJavascript1 = {
        jsCode: "const transcript = $('Code in JavaScript').first().json.transcript || '';\nconst calledPhone = $('Code in JavaScript').first().json.phone_number || '';\nconst bookingLink = 'https://calendly.com/iainliddle-gridtrack/artic-edge-discovery-call';\n\nconst meetingKeywords = [\n  'send you a text',\n  'send that over',\n  'book a time',\n  'calendar invite',\n  'send the link',\n  'booking link',\n  'send you the link',\n  'email to send',\n  'get that booked',\n  'send that straight over',\n  'ping the confirmation',\n  'lovely, i will get that sent',\n  'best email address',\n  'best mobile number'\n];\n\nconst meetingBooked = meetingKeywords.some(keyword => \n  transcript.toLowerCase().includes(keyword)\n);\n\n// Detect country code from the number we called\nlet countryCode = '+1';\nconst countryCodeMatch = calledPhone.match(/^(\\+\\d{1,3})/);\nif (countryCodeMatch) {\n  countryCode = countryCodeMatch[1];\n}\n\n// Extract phone numbers spoken by the user\nconst lines = transcript.split('\\n').filter(l => l.startsWith('User:') || l.startsWith('Customer:'));\nlet mobileNumber = '';\nfor (const line of lines) {\n  const nums = line.match(/\\d[\\d\\s\\-]{8,15}/g);\n  if (nums) {\n    for (const num of nums) {\n      const clean = num.replace(/[\\s\\-]/g, '');\n      if (clean.length >= 10 && clean.length <= 15) {\n        if (clean.startsWith('0')) {\n          mobileNumber = countryCode + clean.substring(1);\n        } else if (clean.startsWith('+')) {\n          mobileNumber = clean;\n        } else {\n          mobileNumber = countryCode + clean;\n        }\n      }\n    }\n  }\n}\n\nif (!mobileNumber) {\n  mobileNumber = calledPhone;\n}\n\n// Extract email from transcript\nconst emailRegex = /[\\w.\\-]+@[\\w.\\-]+\\.\\w+/gi;\nconst emailMatches = transcript.match(emailRegex);\nconst capturedEmail = emailMatches ? emailMatches[emailMatches.length - 1] : '';\n\nreturn [{\n  json: {\n    meetingBooked,\n    mobileNumber,\n    capturedEmail,\n    calledPhone,\n    countryCode,\n    bookingLink,\n    transcript\n  }\n}];",
    };

    @node({
        name: 'If',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [48, -48],
    })
    If_ = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'loose',
                version: 3,
            },
            conditions: [
                {
                    id: '5414472b-df55-4d0d-b93b-c43bd7db1d69',
                    leftValue: '={{ $json.meetingBooked }}',
                    rightValue: 'true',
                    operator: {
                        type: 'string',
                        operation: 'equals',
                        name: 'filter.operator.equals',
                    },
                },
            ],
            combinator: 'and',
        },
        looseTypeValidation: true,
        options: {},
    };

    @node({
        name: 'Update a row1',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [256, -144],
        credentials: { supabaseApi: { id: 'JsHaEd4OXk7Kdft4', name: 'Supabase account' } },
    })
    UpdateARow1 = {
        operation: 'update',
        tableId: 'leads',
        filters: {
            conditions: [
                {
                    keyName: 'phone',
                    condition: 'eq',
                    keyValue: "={{ $('Code in JavaScript1').first().json.calledPhone }}",
                },
            ],
        },
        fieldsUi: {
            fieldValues: [
                {
                    fieldId: 'mobile_phone',
                    fieldValue: "={{ $('Code in JavaScript1').first().json.mobileNumber }}",
                },
                {
                    fieldId: 'status',
                    fieldValue: 'Qualified',
                },
            ],
        },
    };

    @node({
        name: 'Send an SMS/MMS/WhatsApp message',
        type: 'n8n-nodes-base.twilio',
        version: 1,
        position: [672, -144],
        credentials: { twilioApi: { id: 'vUTXap3nvWyhIP4X', name: 'Twilio account' } },
    })
    SendAnSmsmmswhatsappMessage = {
        from: 'Leadomation',
        to: "={{ $('Code in JavaScript1').first().json.mobileNumber }}",
        message:
            "=Hi, thanks for chatting with Sarah! Here's the link to book your discovery call: {{ $('Code in JavaScript1').first().json.bookingLink }} - Looking forward to connecting!",
        options: {},
    };

    @node({
        name: 'Create a row1',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [464, -144],
        credentials: { supabaseApi: { id: 'JsHaEd4OXk7Kdft4', name: 'Supabase account' } },
    })
    CreateARow1 = {
        tableId: 'deals',
        fieldsUi: {
            fieldValues: [
                {
                    fieldId: 'title',
                    fieldValue: "={{ $('Update a row1').first().json.company }} - Discovery Call",
                },
                {
                    fieldId: 'stage',
                    fieldValue: 'discovery',
                },
                {
                    fieldId: 'value',
                    fieldValue: '0',
                },
                {
                    fieldId: 'notes',
                    fieldValue: 'Auto-created from AI call agent',
                },
            ],
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Webhook.out(0).to(this.CodeInJavascript.in(0));
        this.CodeInJavascript.out(0).to(this.CreateARow.in(0));
        this.CreateARow.out(0).to(this.UpdateARow.in(0));
        this.UpdateARow.out(0).to(this.CodeInJavascript1.in(0));
        this.CodeInJavascript1.out(0).to(this.If_.in(0));
        this.If_.out(0).to(this.UpdateARow1.in(0));
        this.UpdateARow1.out(0).to(this.CreateARow1.in(0));
        this.CreateARow1.out(0).to(this.SendAnSmsmmswhatsappMessage.in(0));
    }
}
