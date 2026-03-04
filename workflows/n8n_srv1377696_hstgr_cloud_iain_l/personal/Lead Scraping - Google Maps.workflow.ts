import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Lead Scraping - Google Maps
// Nodes   : 6  |  Connections: 5
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// HttpRequest                        httpRequest
// Webhook                            webhook
// CodeInJavascript                   code
// EditFields                         set
// CreateARow                         supabase                   [creds]
// UpdateARow                         supabase                   [creds]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook
//    → HttpRequest
//      → CodeInJavascript
//        → EditFields
//          → CreateARow
//            → UpdateARow
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'AaTe5f6334bWI8r5',
    name: 'Lead Scraping - Google Maps',
    active: true,
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: false },
})
export class LeadScrapingGoogleMapsWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        name: 'HTTP Request',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [-352, -32],
    })
    HttpRequest = {
        method: 'POST',
        url: 'https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=apify_api_FK4cveaUg2tz11dE5EkF3J0tkfUWw51rLWt8',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'searchStringsArray',
                    value: '=={{ [$json.body.industry] }}',
                },
                {
                    name: 'locationQuery',
                    value: '=={{ $json.body.location }}',
                },
                {
                    name: 'maxCrawledPlacesPerSearch',
                    value: '20',
                },
                {
                    name: 'language',
                    value: 'en',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody:
            '={\n  "searchStringsArray": ["{{ $json.body.industry }}"],\n  "locationQuery": "{{ $json.body.location }}",\n  "maxCrawledPlacesPerSearch": {{ $json.body.max_leads }},\n  "language": "en"\n}',
        options: {},
    };

    @node({
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-592, -32],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'd6c828df-d7a2-49f5-97a0-eb7b321ff86c',
        options: {},
    };

    @node({
        name: 'Code in JavaScript',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-144, -32],
    })
    CodeInJavascript = {
        jsCode: "const datasetId = $input.first().json.data.defaultDatasetId;\nconst runId = $input.first().json.data.id;\nconst token = 'apify_api_FK4cveaUg2tz11dE5EkF3J0tkfUWw51rLWt8';\nconst campaignId = $('Webhook').first().json.body.campaign_id;\nconst userId = $('Webhook').first().json.body.user_id;\n\nfor (let i = 0; i < 8; i++) {\n    await new Promise(resolve => setTimeout(resolve, 30000));\n    const status = await this.helpers.httpRequest({\n        method: 'GET',\n        url: `https://api.apify.com/v2/actor-runs/${runId}?token=${token}`,\n    });\n    if (status.data.status === 'SUCCEEDED') {\n        const results = await this.helpers.httpRequest({\n            method: 'GET',\n            url: `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}`,\n        });\n        return results.map(item => ({ json: { ...item, campaign_id: campaignId, user_id: userId } }));\n    }\n}",
    };

    @node({
        name: 'Edit Fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [64, -32],
    })
    EditFields = {
        assignments: {
            assignments: [
                {
                    id: '9d7dac7a-0ae7-442c-8870-2f7d2cb0aaf3',
                    name: 'user_id',
                    value: "={{ $('Webhook').item.json.body.user_id }}",
                    type: 'string',
                },
                {
                    id: '0d86a73a-67e0-4f13-98b7-ae59d528a3c9',
                    name: 'campaign_id',
                    value: "={{ $('Webhook').item.json.body.campaign_id }}",
                    type: 'string',
                },
                {
                    id: '4d94bab8-ca09-42c1-a7ce-bd1fd2c46024',
                    name: 'company',
                    value: '={{ $json.title }}',
                    type: 'string',
                },
                {
                    id: '7f4c43a9-2f01-4e64-b75d-db7ae7c68fe9',
                    name: 'phone',
                    value: '={{ $json.phone }}',
                    type: 'string',
                },
                {
                    id: '6a11688e-b11c-4633-9e77-743eea64e26c',
                    name: 'website',
                    value: '={{ $json.website }}',
                    type: 'string',
                },
                {
                    id: '2261229c-4100-4d3f-9c83-7a275846553b',
                    name: 'location',
                    value: '={{ $json.address }}',
                    type: 'string',
                },
                {
                    id: '867a17f2-93b8-45b7-aa87-7a82ae7d598e',
                    name: 'industry',
                    value: '={{ $json.categoryName }}',
                    type: 'string',
                },
                {
                    id: '36122935-5bb3-4992-9491-0c2c8233ffbc',
                    name: 'source',
                    value: 'google_maps',
                    type: 'string',
                },
                {
                    id: '9836198d-4336-4670-b83b-bfb7d8e18f2c',
                    name: 'status',
                    value: 'new',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        name: 'Create a row',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [272, -32],
        credentials: { supabaseApi: { id: 'JsHaEd4OXk7Kdft4', name: 'Supabase account' } },
    })
    CreateARow = {
        tableId: 'leads',
        dataToSend: 'autoMapInputData',
    };

    @node({
        name: 'Update a row',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [480, -32],
        credentials: { supabaseApi: { id: 'JsHaEd4OXk7Kdft4', name: 'Supabase account' } },
    })
    UpdateARow = {
        operation: 'update',
        tableId: 'campaigns',
        filters: {
            conditions: [
                {
                    keyName: 'id',
                    condition: 'eq',
                    keyValue: "={{ $('Webhook').first().json.body.campaign_id }}",
                },
            ],
        },
        fieldsUi: {
            fieldValues: [
                {
                    fieldId: 'scraping_status',
                    fieldValue: 'complete',
                },
                {
                    fieldId: 'leads_found',
                    fieldValue: "={{ $('Create a row').all().length }}",
                },
            ],
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.HttpRequest.out(0).to(this.CodeInJavascript.in(0));
        this.Webhook.out(0).to(this.HttpRequest.in(0));
        this.CodeInJavascript.out(0).to(this.EditFields.in(0));
        this.EditFields.out(0).to(this.CreateARow.in(0));
        this.CreateARow.out(0).to(this.UpdateARow.in(0));
    }
}
