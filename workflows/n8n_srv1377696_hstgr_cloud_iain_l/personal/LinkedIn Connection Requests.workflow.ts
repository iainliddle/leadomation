import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : LinkedIn Connection Requests
// Nodes   : 7  |  Connections: 6
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ScheduleTrigger                    scheduleTrigger
// GetManyRows                        supabase                   [creds]
// GetLinkedinProfile                 httpRequest                [onError→regular]
// EditFields                         set
// SendConnectionRequest              httpRequest                [onError→regular]
// UpdateARow                         supabase                   [creds]
// If_                                if
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ScheduleTrigger
//    → GetManyRows
//      → EditFields
//        → If_
//          → GetLinkedinProfile
//            → SendConnectionRequest
//              → UpdateARow
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'jykK3Dkyd0QNyrM3',
    name: 'LinkedIn Connection Requests',
    active: true,
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: false },
})
export class LinkedinConnectionRequestsWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        name: 'Schedule Trigger',
        type: 'n8n-nodes-base.scheduleTrigger',
        version: 1.3,
        position: [-720, 0],
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
        position: [-512, 0],
        credentials: { supabaseApi: { id: 'JsHaEd4OXk7Kdft4', name: 'Supabase account' } },
    })
    GetManyRows = {
        operation: 'getAll',
        tableId: 'leads',
        limit: 10,
        filters: {
            conditions: [
                {
                    keyName: 'status',
                    condition: 'eq',
                    keyValue: 'new',
                },
            ],
        },
    };

    @node({
        name: 'Get LinkedIn Profile',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [112, -128],
        onError: 'continueRegularOutput',
    })
    GetLinkedinProfile = {
        url: 'https://api30.unipile.com:16031/api/v1/users/{{ $json.linkedin_username }}?account_id=UC9xKUwvRIqadozVYOPlmw',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'X-API-KEY',
                    value: 'ArzHCdZV.IO+VGg+oHEdX5DhXm8cH5uu6oODUeu9VGInbHrWTIjU=',
                },
                {
                    name: 'accept',
                    value: 'application/json',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody:
            '={\n  "provider_id": "{{ $json.provider_id }}",\n  "account_id": "UC9xKUwvRIqadozVYOPlmw",\n  "message": "Hi, I came across your profile and was impressed by what you\'re doing. Would love to connect!"\n}',
        options: {},
    };

    @node({
        name: 'Edit Fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-304, 0],
    })
    EditFields = {
        assignments: {
            assignments: [
                {
                    id: '87fe2346-13f5-4f65-b9e0-6a46a544caef',
                    name: 'linkedin_username',
                    value: "={{ $json.linkedin_url.split('/in/')[1] }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        name: 'Send Connection Request',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [304, -128],
        onError: 'continueRegularOutput',
    })
    SendConnectionRequest = {
        method: 'POST',
        url: 'https://api30.unipile.com:16031/api/v1/users/invite',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'X-API-KEY',
                    value: 'ArzHCdZV.IO+VGg+oHEdX5DhXm8cH5uu6oODUeu9VGInbHrWTIjU=',
                },
                {
                    name: 'accept',
                    value: 'application/json',
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
            '={\n  "provider_id": "ACoAAAklFZwBUOkRdceM88--zbrXQkkSati6cRU",\n  "account_id": "UC9xKUwvRIqadozVYOPlmw",\n  "message": "Hi Mark, I came across Hyatt and was impressed by what you\'re doing. Would love to connect!"\n}',
        options: {},
    };

    @node({
        name: 'Update a row',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [528, -128],
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
                    fieldId: 'status',
                    fieldValue: 'contacted',
                },
                {
                    fieldId: 'linkedin_status',
                    fieldValue: 'connection_sent',
                },
            ],
        },
    };

    @node({
        name: 'If',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [-96, 0],
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
                    id: '7566872a-473d-433c-9013-ec4f715c8d57',
                    leftValue: 'String',
                    rightValue: '={{ $json.linkedin_username }}',
                    operator: {
                        type: 'string',
                        operation: 'notEquals',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.ScheduleTrigger.out(0).to(this.GetManyRows.in(0));
        this.GetManyRows.out(0).to(this.EditFields.in(0));
        this.EditFields.out(0).to(this.If_.in(0));
        this.GetLinkedinProfile.out(0).to(this.SendConnectionRequest.in(0));
        this.SendConnectionRequest.out(0).to(this.UpdateARow.in(0));
        this.If_.out(0).to(this.GetLinkedinProfile.in(0));
    }
}
