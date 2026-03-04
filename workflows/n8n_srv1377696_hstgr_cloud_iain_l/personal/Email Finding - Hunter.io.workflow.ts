import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Email Finding - Hunter.io
// Nodes   : 5  |  Connections: 4
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ScheduleTrigger                    scheduleTrigger            
// GetManyRows                        supabase                   [creds]
// HttpRequest                        httpRequest                
// EditFields                         set                        
// UpdateARow                         supabase                   [creds]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ScheduleTrigger
//    → GetManyRows
//      → HttpRequest
//        → EditFields
//          → UpdateARow
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: "lQkgDtZ8Mwf2k3J2",
    name: "Email Finding - Hunter.io",
    active: false,
    settings: {executionOrder:"v1",binaryMode:"separate",availableInMCP:false}
})
export class EmailFindingHunter.ioWorkflow {

    // =====================================================================
// CONFIGURATION DES NOEUDS
// =====================================================================

    @node({
        name: "Schedule Trigger",
        type: "n8n-nodes-base.scheduleTrigger",
        version: 1.3,
        position: [-512, 0]
    })
    ScheduleTrigger = {
        "rule": {
            "interval": [
                {}
            ]
        }
    };

    @node({
        name: "Get many rows",
        type: "n8n-nodes-base.supabase",
        version: 1,
        position: [-304, 0],
        credentials: {supabaseApi:{id:"JsHaEd4OXk7Kdft4",name:"Supabase account"}}
    })
    GetManyRows = {
        "operation": "getAll",
        "tableId": "leads",
        "limit": 10,
        "filterType": "string",
        "filterString": "email=is.null&website=neq.null"
    };

    @node({
        name: "HTTP Request",
        type: "n8n-nodes-base.httpRequest",
        version: 4.4,
        position: [-96, 0]
    })
    HttpRequest = {
        "url": "=https://api.hunter.io/v2/domain-search?domain={{ $json.website }}&api_key=20c284c8eb7cc8e3efe9b6ad50c24fd0bb7f8f21\n",
        "options": {}
    };

    @node({
        name: "Edit Fields",
        type: "n8n-nodes-base.set",
        version: 3.4,
        position: [112, 0]
    })
    EditFields = {
        "assignments": {
            "assignments": [
                {
                    "id": "27045552-ad84-4aa7-befc-1c96e52e741b",
                    "name": "email",
                    "value": "={{ $json.data.emails[0].value }}",
                    "type": "string"
                },
                {
                    "id": "c2665327-bc5c-4b61-91b6-1d2358a86e1e",
                    "name": "id",
                    "value": "={{ $('Get many rows').item.json.id }}",
                    "type": "string"
                }
            ]
        },
        "options": {}
    };

    @node({
        name: "Update a row",
        type: "n8n-nodes-base.supabase",
        version: 1,
        position: [320, 0],
        credentials: {supabaseApi:{id:"JsHaEd4OXk7Kdft4",name:"Supabase account"}}
    })
    UpdateARow = {
        "operation": "update",
        "tableId": "leads",
        "filters": {
            "conditions": [
                {
                    "keyName": "id",
                    "condition": "eq",
                    "keyValue": "={{ $('Get many rows').item.json.id }}"
                }
            ]
        },
        "fieldsUi": {
            "fieldValues": [
                {
                    "fieldId": "email",
                    "fieldValue": "={{ $('HTTP Request').item.json.data.emails[0].value }}"
                }
            ]
        }
    };


    // =====================================================================
// ROUTAGE ET CONNEXIONS
// =====================================================================

    @links()
    defineRouting() {
        this.ScheduleTrigger.out(0).to(this.GetManyRows.in(0));
        this.GetManyRows.out(0).to(this.HttpRequest.in(0));
        this.HttpRequest.out(0).to(this.EditFields.in(0));
        this.EditFields.out(0).to(this.UpdateARow.in(0));
    }
}