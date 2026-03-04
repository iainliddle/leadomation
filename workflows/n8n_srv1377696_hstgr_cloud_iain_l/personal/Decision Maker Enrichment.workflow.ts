import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Decision Maker Enrichment
// Nodes   : 6  |  Connections: 5
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ScheduleTrigger                    scheduleTrigger
// GetManyRows                        supabase                   [creds]
// HttpRequest                        httpRequest
// If_                                if
// HttpRequest1                       httpRequest
// UpdateARow                         supabase                   [creds]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ScheduleTrigger
//    → GetManyRows
//      → HttpRequest
//        → If_
//          → HttpRequest1
//            → UpdateARow
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'rZYrevJWfKsvLTzB',
    name: 'Decision Maker Enrichment',
    active: true,
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: false },
})
export class DecisionMakerEnrichmentWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        name: 'Schedule Trigger',
        type: 'n8n-nodes-base.scheduleTrigger',
        version: 1.3,
        position: [-672, 0],
    })
    ScheduleTrigger = {
        rule: {
            interval: [
                {
                    triggerAtHour: 8,
                },
            ],
        },
    };

    @node({
        name: 'Get many rows',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [-432, 0],
        credentials: { supabaseApi: { id: 'JsHaEd4OXk7Kdft4', name: 'Supabase account' } },
    })
    GetManyRows = {
        operation: 'getAll',
        tableId: 'leads',
        limit: 10,
        filters: {
            conditions: [
                {
                    keyName: 'job_title',
                    condition: 'is',
                    keyValue: 'null',
                },
                {
                    keyName: 'email',
                    condition: 'neq',
                    keyValue: 'null',
                },
            ],
        },
    };

    @node({
        name: 'HTTP Request',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [-208, 0],
    })
    HttpRequest = {
        method: 'POST',
        url: 'https://api.apollo.io/api/v1/mixed_people/api_search',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'x-api-key',
                    value: 'cy7VfkfDIO_WD4gZDuUTBQ',
                },
                {
                    name: 'Content-Type',
                    value: 'application/json',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody:
            '={\n  "q_organization_domains": "{{ $json.website }}",\n  "person_seniorities": ["owner", "founder", "c_suite", "partner", "vp", "director", "manager"],\n  "per_page": 1\n}',
        options: {},
    };

    @node({
        name: 'If',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [-16, 0],
    })
    If_ = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    id: 'ce93eedc-78ab-4d6f-b83e-0d513021a1e0',
                    leftValue: '={{ $json.people[0].id }}',
                    rightValue: '',
                    operator: {
                        type: 'string',
                        operation: 'notEmpty',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        name: 'HTTP Request1',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [288, -192],
    })
    HttpRequest1 = {
        method: 'POST',
        url: 'https://api.apollo.io/api/v1/people/match',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'x-api-key',
                    value: 'cy7VfkfDIO_WD4gZDuUTBQ',
                },
                {
                    name: 'Content-Type',
                    value: 'application/json',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={\n  "id": "{{ $json.people[0].id }}"\n}',
        options: {},
    };

    @node({
        name: 'Update a row',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [544, -192],
        credentials: { supabaseApi: { id: 'JsHaEd4OXk7Kdft4', name: 'Supabase account' } },
    })
    UpdateARow = {
        operation: 'update',
        tableId: 'leads',
        filters: {
            conditions: [
                {
                    keyName: 'id',
                    condition: 'eq',
                    keyValue: "={{ $('Get many rows').item.json.id }}",
                },
            ],
        },
        fieldsUi: {
            fieldValues: [
                {
                    fieldId: 'first_name',
                    fieldValue: '={{ $json.person.first_name }}',
                },
                {
                    fieldId: 'last_name',
                    fieldValue: '={{ $json.person.last_name }}',
                },
                {
                    fieldId: 'job_title',
                    fieldValue: '={{ $json.person.title }}',
                },
                {
                    fieldId: 'linkedin_url',
                    fieldValue: '={{ $json.person.linkedin_url }}',
                },
                {
                    fieldId: 'enrichment_data',
                    fieldValue: '={{ JSON.stringify($json.person) }}',
                },
            ],
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.ScheduleTrigger.out(0).to(this.GetManyRows.in(0));
        this.GetManyRows.out(0).to(this.HttpRequest.in(0));
        this.HttpRequest.out(0).to(this.If_.in(0));
        this.If_.out(0).to(this.HttpRequest1.in(0));
        this.HttpRequest1.out(0).to(this.UpdateARow.in(0));
    }
}
