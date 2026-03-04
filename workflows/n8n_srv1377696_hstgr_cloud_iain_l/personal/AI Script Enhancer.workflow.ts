import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : AI Script Enhancer
// Nodes   : 5  |  Connections: 4
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook
// HttpRequest                        httpRequest
// RespondToWebhook                   respondToWebhook
// CodeInJavascript                   code
// CodeInJavascript1                  code
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook
//    → CodeInJavascript
//      → HttpRequest
//        → CodeInJavascript1
//          → RespondToWebhook
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'KA0nZTCUbrALkXRK',
    name: 'AI Script Enhancer',
    active: true,
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: false },
})
export class AiScriptEnhancerWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-464, -64],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'ai-enhance-script',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        name: 'HTTP Request',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [-48, -64],
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
                {
                    name: 'Content-Type',
                    value: 'application/json',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={{ $json.requestBody }}',
        options: {},
    };

    @node({
        name: 'Respond to Webhook',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [368, -64],
    })
    RespondToWebhook = {
        respondWith: 'allIncomingItems',
        options: {},
    };

    @node({
        name: 'Code in JavaScript',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-256, -64],
    })
    CodeInJavascript = {
        jsCode: 'const prompt = $input.all()[0].json.body.prompt || $input.all()[0].json.prompt || \'\';\n\nreturn [{\n  json: {\n    requestBody: {\n      model: "claude-sonnet-4-5-20250929",\n      max_tokens: 2000,\n      messages: [{\n        role: "user",\n        content: "You are an expert sales call script writer. Rewrite this AI voice agent system prompt to sound more natural and persuasive. Keep all key info but make it more human and conversational. Add natural transitions, improve objection handling, add subtle sales techniques. Keep responses short. NEVER read URLs aloud. Return ONLY the enhanced prompt.\\n\\nCurrent prompt:\\n\\n" + prompt\n      }]\n    }\n  }\n}];',
    };

    @node({
        name: 'Code in JavaScript1',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [160, -64],
    })
    CodeInJavascript1 = {
        jsCode: "const text = $input.all()[0].json.content[0].text || '';\nreturn [{ json: { enhanced: text } }];",
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Webhook.out(0).to(this.CodeInJavascript.in(0));
        this.HttpRequest.out(0).to(this.CodeInJavascript1.in(0));
        this.CodeInJavascript.out(0).to(this.HttpRequest.in(0));
        this.CodeInJavascript1.out(0).to(this.RespondToWebhook.in(0));
    }
}
