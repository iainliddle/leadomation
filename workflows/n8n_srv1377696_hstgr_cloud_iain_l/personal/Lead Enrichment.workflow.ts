import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Lead Enrichment
// Nodes   : 4  |  Connections: 3
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook
// HttpRequest                        httpRequest
// RespondToWebhook                   respondToWebhook
// HttpRequest1                       httpRequest
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook
//    → HttpRequest
//      → HttpRequest1
//        → RespondToWebhook
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'LRCsI71DkWzH8NFN',
    name: 'Lead Enrichment',
    active: true,
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: false },
})
export class LeadEnrichmentWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-368, 0],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'lead-enrichment',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        name: 'HTTP Request',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [-160, 0],
    })
    HttpRequest = {
        url: 'https://api.hunter.io/v2/email-finder',
        sendQuery: true,
        queryParameters: {
            parameters: [
                {
                    name: 'domain',
                    value: '={{ $json.body.domain }}',
                },
                {
                    name: 'first_name',
                    value: '={{ $json.body.first_name }}',
                },
                {
                    name: 'last_name',
                    value: '={{ $json.body.last_name }}',
                },
                {
                    name: 'api_key',
                    value: '20c284c8eb7cc8e3efe9b6ad50c24fd0bb7f8f21',
                },
            ],
        },
        options: {},
    };

    @node({
        name: 'Respond to Webhook',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [256, 0],
    })
    RespondToWebhook = {
        respondWith: 'json',
        responseBody:
            '={\n  "email": "{{ $(\'HTTP Request\').item.json.data.email }}",\n  "score": "{{ $(\'HTTP Request\').item.json.data.score }}",\n  "first_name": "{{ $(\'Webhook\').item.json.body.first_name }}",\n  "last_name": "{{ $(\'Webhook\').item.json.body.last_name }}"\n}',
        options: {
            responseCode: '={{ 200 }}',
        },
    };

    @node({
        name: 'HTTP Request1',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [48, 0],
    })
    HttpRequest1 = {
        method: 'PATCH',
        url: 'https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/leads',
        sendQuery: true,
        queryParameters: {
            parameters: [
                {
                    name: 'id',
                    value: "=eq.{{ $('Webhook').item.json.body.lead_id }}",
                },
            ],
        },
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'apikey',
                    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY3lmcnFnbXBua3ZyZ3pleXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA4NTQ5MCwiZXhwIjoyMDg2NjYxNDkwfQ.rsLKNUvn9AykmAsYdara50qrAyErbHP_YMEVz9PewAw',
                },
                {
                    name: 'Authorization',
                    value: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY3lmcnFnbXBua3ZyZ3pleXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA4NTQ5MCwiZXhwIjoyMDg2NjYxNDkwfQ.rsLKNUvn9AykmAsYdara50qrAyErbHP_YMEVz9PewAw',
                },
                {
                    name: 'Content-Type',
                    value: 'application/json',
                },
                {
                    name: 'Prefer',
                    value: 'return=representation',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody:
            '={\n  "email": "{{ $(\'HTTP Request\').item.json.data.email }}",\n  "first_name": "{{ $(\'Webhook\').item.json.body.first_name }}",\n  "last_name": "{{ $(\'Webhook\').item.json.body.last_name }}"\n}',
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Webhook.out(0).to(this.HttpRequest.in(0));
        this.HttpRequest.out(0).to(this.HttpRequest1.in(0));
        this.HttpRequest1.out(0).to(this.RespondToWebhook.in(0));
    }
}
