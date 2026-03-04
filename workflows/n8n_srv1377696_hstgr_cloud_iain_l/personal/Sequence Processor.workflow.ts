import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Sequence Processor
// Nodes   : 8  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ScheduleTrigger                    scheduleTrigger
// GetDueEnrollments                  httpRequest
// GetSequence                        httpRequest
// GetLead                            httpRequest
// StepRouter                         switch
// GetLinkedinProfileseq              httpRequest                [onError→regular]
// SendConnectionseq                  httpRequest                [onError→regular]
// AdvanceEnrollment                  httpRequest
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ScheduleTrigger
//    → GetDueEnrollments
//      → GetSequence
//        → GetLead
//          → StepRouter
//            → GetLinkedinProfileseq
//              → SendConnectionseq
//                → AdvanceEnrollment
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: '6BBj8FHMo7AGHE4r',
    name: 'Sequence Processor',
    active: false,
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: false },
})
export class SequenceProcessorWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        name: 'Schedule Trigger',
        type: 'n8n-nodes-base.scheduleTrigger',
        version: 1.3,
        position: [-992, 0],
    })
    ScheduleTrigger = {
        rule: {
            interval: [
                {
                    field: 'hours',
                },
            ],
        },
    };

    @node({
        name: 'Get Due Enrollments',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [-752, 0],
    })
    GetDueEnrollments = {
        url: 'https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/sequence_enrollments?status=eq.active&next_action_at=lte.now()&select=*',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'apikey',
                    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY3lmcnFnbXBua3ZyZ3pleXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODU0OTAsImV4cCI6MjA4NjY2MTQ5MH0.fMgZSL--G2xrrDGjmVQIXhxpdyZtMuEDPrLcyMdS9BE',
                },
                {
                    name: 'Authorization',
                    value: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY3lmcnFnbXBua3ZyZ3pleXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA4NTQ5MCwiZXhwIjoyMDg2NjYxNDkwfQ.rsLKNUvn9AykmAsYdara50qrAyErbHP_YMEVz9PewAw',
                },
                {
                    name: 'Accept',
                    value: 'application/json',
                },
            ],
        },
        options: {},
    };

    @node({
        name: 'Get Sequence',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [-544, 0],
    })
    GetSequence = {
        url: '=https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/sequences?id=eq.{{ $json.sequence_id }}&select=*',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'apikey',
                    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY3lmcnFnbXBua3ZyZ3pleXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODU0OTAsImV4cCI6MjA4NjY2MTQ5MH0.fMgZSL--G2xrrDGjmVQIXhxpdyZtMuEDPrLcyMdS9BE',
                },
                {
                    name: 'Authorization',
                    value: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY3lmcnFnbXBua3ZyZ3pleXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA4NTQ5MCwiZXhwIjoyMDg2NjYxNDkwfQ.rsLKNUvn9AykmAsYdara50qrAyErbHP_YMEVz9PewAw',
                },
                {
                    name: 'Accept',
                    value: 'application/json',
                },
            ],
        },
        options: {},
    };

    @node({
        name: 'Get Lead',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [-336, 0],
    })
    GetLead = {
        url: "=https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/leads?id=eq.{{ $('Get Due Enrollments').item.json.lead_id }}&select=*",
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'apikey',
                    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY3lmcnFnbXBua3ZyZ3pleXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODU0OTAsImV4cCI6MjA4NjY2MTQ5MH0.fMgZSL--G2xrrDGjmVQIXhxpdyZtMuEDPrLcyMdS9BE',
                },
                {
                    name: 'Authorization',
                    value: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY3lmcnFnbXBua3ZyZ3pleXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA4NTQ5MCwiZXhwIjoyMDg2NjYxNDkwfQ.rsLKNUvn9AykmAsYdara50qrAyErbHP_YMEVz9PewAw',
                },
                {
                    name: 'Accept',
                    value: 'application/json',
                },
            ],
        },
        options: {},
    };

    @node({
        name: 'Step Router',
        type: 'n8n-nodes-base.switch',
        version: 3.4,
        position: [-128, 0],
    })
    StepRouter = {
        rules: {
            values: [
                {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: '',
                            typeValidation: 'strict',
                            version: 3,
                        },
                        conditions: [
                            {
                                id: 'a8595be9-e21d-40c2-ae4a-097ef8da7620',
                                leftValue:
                                    "={{ $('Get Sequence').item.json.steps[$('Get Due Enrollments').item.json.current_step - 1].type }}",
                                rightValue: 'linkedin_connect',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                    name: 'filter.operator.equals',
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                },
                {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: '',
                            typeValidation: 'strict',
                            version: 3,
                        },
                        conditions: [
                            {
                                id: 'c03bf42b-d9a9-4109-aab0-418db7e88221',
                                leftValue: 'email',
                                rightValue: 'Email ',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                    name: 'filter.operator.equals',
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                },
                {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: '',
                            typeValidation: 'strict',
                            version: 3,
                        },
                        conditions: [
                            {
                                id: '78e64449-24d2-4107-b909-8ae156ce3371',
                                leftValue: 'linkedin_message ',
                                rightValue: 'Linked Message ',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                    name: 'filter.operator.equals',
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                },
            ],
        },
        options: {},
    };

    @node({
        name: 'Get LinkedIn Profile (Seq)',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [96, -208],
        onError: 'continueRegularOutput',
    })
    GetLinkedinProfileseq = {
        url: "=https://api30.unipile.com:16031/api/v1/users/{{ $('Get Lead').item.json.linkedin_url.split('/in/')[1] }}?account_id=UC9xKUwvRIqadozVYOPlmw",
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
        options: {},
    };

    @node({
        name: 'Send Connection (Seq)',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [288, -208],
        onError: 'continueRegularOutput',
    })
    SendConnectionseq = {
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
            '={\n  "provider_id": "{{ $json.provider_id }}",\n  "account_id": "UC9xKUwvRIqadozVYOPlmw",\n  "message": "{{ $(\'Get Sequence\').item.json.steps[$(\'Get Due Enrollments\').item.json.current_step - 1].message }}"\n}',
        options: {},
    };

    @node({
        name: 'Advance Enrollment',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [496, -208],
    })
    AdvanceEnrollment = {
        method: 'PATCH',
        url: "=https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/sequence_enrollments?id=eq.{{ $('Get Due Enrollments').item.json.id }}",
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'apikey',
                    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY3lmcnFnbXBua3ZyZ3pleXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODU0OTAsImV4cCI6MjA4NjY2MTQ5MH0.fMgZSL--G2xrrDGjmVQIXhxpdyZtMuEDPrLcyMdS9BE',
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
                    value: 'return=minimal',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '{\n  "current_step": 2,\n  "next_action_at": "2026-02-19T16:00:00Z"\n}',
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.ScheduleTrigger.out(0).to(this.GetDueEnrollments.in(0));
        this.GetDueEnrollments.out(0).to(this.GetSequence.in(0));
        this.GetSequence.out(0).to(this.GetLead.in(0));
        this.GetLead.out(0).to(this.StepRouter.in(0));
        this.StepRouter.out(0).to(this.GetLinkedinProfileseq.in(0));
        this.GetLinkedinProfileseq.out(0).to(this.SendConnectionseq.in(0));
        this.SendConnectionseq.out(0).to(this.AdvanceEnrollment.in(0));
    }
}
