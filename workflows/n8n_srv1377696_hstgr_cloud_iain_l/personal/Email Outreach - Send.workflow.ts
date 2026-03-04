import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Email Outreach - Send
// Nodes   : 4  |  Connections: 3
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ScheduleTrigger                    scheduleTrigger
// GetManyRows                        supabase                   [creds]
// SendAMessage                       microsoftOutlook           [creds]
// HttpRequest                        httpRequest
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ScheduleTrigger
//    → GetManyRows
//      → HttpRequest
//        → SendAMessage
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'xrDMkL7RSEqk0zqt',
    name: 'Email Outreach - Send',
    active: true,
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: false },
})
export class EmailOutreachSendWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        name: 'Schedule Trigger',
        type: 'n8n-nodes-base.scheduleTrigger',
        version: 1.3,
        position: [-592, -80],
    })
    ScheduleTrigger = {
        rule: {
            interval: [{}],
        },
    };

    @node({
        name: 'Get many rows',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [-368, -80],
        credentials: { supabaseApi: { id: 'JsHaEd4OXk7Kdft4', name: 'Supabase account' } },
    })
    GetManyRows = {
        operation: 'getAll',
        tableId: 'leads',
        limit: 5,
        filterType: 'string',
        filterString: 'email=not.is.null&status=eq.new',
    };

    @node({
        name: 'Send a message',
        type: 'n8n-nodes-base.microsoftOutlook',
        version: 2,
        position: [32, -80],
        credentials: { microsoftOutlookOAuth2Api: { id: 'A2U5g8PUnQim6gsu', name: 'Microsoft Outlook account' } },
    })
    SendAMessage = {
        toRecipients: 'iainliddle@leadomation.co.uk',
        subject: "=Quick question for {{ $('Get many rows').item.json.company }}",
        bodyContent: '={{ $json.content[0].text }}',
        additionalFields: {},
    };

    @node({
        name: 'HTTP Request',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [-160, -80],
    })
    HttpRequest = {
        method: 'POST',
        url: 'https://api.anthropic.com/v1/messages',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'x-api-key',
                    value: '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',
                },
                {
                    name: 'anthropic-version',
                    value: '2023-06-01',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody:
            '={\n  "model": "claude-sonnet-4-20250514",\n  "max_tokens": 1024,\n  "messages": [\n    {\n      "role": "user",\n      "content": "Write a short, personalised cold outreach email to {{ $json.company }}. They are a {{ $json.industry }} business located in {{ $json.location }}. The email should promote premium ice bath and cold therapy solutions for luxury hotels and spas. Keep it under 100 words, friendly and professional. Include a call to action for a 10-minute chat. Only output the email body, no subject line, no signature. Do not use brackets or placeholder text."\n    }\n  ]\n}',
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.ScheduleTrigger.out(0).to(this.GetManyRows.in(0));
        this.GetManyRows.out(0).to(this.HttpRequest.in(0));
        this.HttpRequest.out(0).to(this.SendAMessage.in(0));
    }
}
