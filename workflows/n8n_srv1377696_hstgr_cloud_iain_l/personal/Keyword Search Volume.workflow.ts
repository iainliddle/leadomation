import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Keyword Search Volume
// Nodes   : 3  |  Connections: 2
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook
// RespondToWebhook                   respondToWebhook
// DataforseoSearchVolume             httpRequest                [creds]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook
//    → DataforseoSearchVolume
//      → RespondToWebhook
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'Mlyd1OvYe0Vb1yJQ',
    name: 'Keyword Search Volume',
    active: true,
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: false },
})
export class KeywordSearchVolumeWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-272, 0],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'keyword-search',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        name: 'Respond to Webhook',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [176, 0],
    })
    RespondToWebhook = {
        respondWith: 'allIncomingItems',
        options: {},
    };

    @node({
        name: 'DataForSEO Search Volume',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [-48, 0],
        credentials: { httpBasicAuth: { id: 'JYPupGzTlWdO3wx9', name: 'Unnamed credential' } },
    })
    DataforseoSearchVolume = {
        method: 'POST',
        url: 'https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live',
        authentication: 'genericCredentialType',
        genericAuthType: 'httpBasicAuth',
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
        specifyBody: 'json',
        jsonBody:
            '=[{"keywords": {{ JSON.stringify($json.body.keywords) }}, "location_code": {{ $json.body.location_code || 2826 }}, "language_code": "{{ $json.body.language_code || \'en\' }}"}]',
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Webhook.out(0).to(this.DataforseoSearchVolume.in(0));
        this.DataforseoSearchVolume.out(0).to(this.RespondToWebhook.in(0));
    }
}
