import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Business Density Data
// Nodes   : 6  |  Connections: 6
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// WhenClickingexecuteWorkflow        manualTrigger
// GenerateCombinations               code
// LoopOverItems                      splitInBatches
// HttpRequest                        httpRequest                [creds]
// ExtractCount                       code
// CreateARow                         supabase                   [creds]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WhenClickingexecuteWorkflow
//    → GenerateCombinations
//      → LoopOverItems
//       .out(1) → HttpRequest
//          → ExtractCount
//            → CreateARow
//              → LoopOverItems (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'cHgCfpixlzAh9KTk',
    name: 'Business Density Data',
    active: false,
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: false },
})
export class BusinessDensityDataWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        name: 'When clicking ‘Execute workflow’',
        type: 'n8n-nodes-base.manualTrigger',
        version: 1,
        position: [-608, -16],
    })
    WhenClickingexecuteWorkflow = {};

    @node({
        name: 'Generate Combinations',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-400, -16],
    })
    GenerateCombinations = {
        jsCode: 'const industries = [\n  {name: "Cold Water Therapy", category: "spa", id: "cold-water-therapy"},\n  {name: "Spas & Wellness", category: "spa", id: "spas-wellness"},\n  {name: "Hotels & Hospitality", category: "hotel", id: "hotels-hospitality"},\n  {name: "Gyms & Fitness", category: "gym", id: "gyms-fitness"},\n  {name: "Restaurants & Cafes", category: "restaurant", id: "restaurants-cafes"},\n  {name: "Real Estate Agencies", category: "real_estate_agency", id: "real-estate"},\n  {name: "Dental Practices", category: "dentist", id: "dental"},\n  {name: "Law Firms", category: "law_firm", id: "law-firms"},\n  {name: "Accounting Firms", category: "accounting_firm", id: "accounting"},\n  {name: "Auto Dealerships", category: "car_dealer", id: "auto-dealers"},\n  {name: "Insurance Agencies", category: "insurance_agency", id: "insurance"},\n  {name: "Home Services", category: "home_improvement_store", id: "home-services"},\n  {name: "Marketing Agencies", category: "marketing_agency", id: "marketing"},\n  {name: "IT Services", category: "it_company", id: "it-services"},\n  {name: "Construction", category: "construction_company", id: "construction"},\n  {name: "Medical Practices", category: "medical_clinic", id: "medical"},\n  {name: "Veterinary Clinics", category: "veterinarian", id: "veterinary"},\n  {name: "Beauty Salons", category: "beauty_salon", id: "beauty-salons"},\n  {name: "Education & Tutoring", category: "tutoring_service", id: "education"},\n  {name: "Retail Stores", category: "retail", id: "retail"}\n];\n\nconst regions = [\n  {name: "United Kingdom", id: "uk", subregion: "Europe", lat: 51.5074, lng: -0.1278},\n  {name: "US East Coast", id: "us-east", subregion: "North America", lat: 40.7128, lng: -74.006},\n  {name: "US West Coast", id: "us-west", subregion: "North America", lat: 34.0522, lng: -118.2437},\n  {name: "US Central", id: "us-central", subregion: "North America", lat: 41.8781, lng: -87.6298},\n  {name: "Canada", id: "canada", subregion: "North America", lat: 43.6532, lng: -79.3832},\n  {name: "Germany", id: "germany", subregion: "Europe", lat: 52.52, lng: 13.405},\n  {name: "France", id: "france", subregion: "Europe", lat: 48.8566, lng: 2.3522},\n  {name: "Spain", id: "spain", subregion: "Europe", lat: 40.4168, lng: -3.7038},\n  {name: "Italy", id: "italy", subregion: "Europe", lat: 41.9028, lng: 12.4964},\n  {name: "Netherlands", id: "netherlands", subregion: "Europe", lat: 52.3676, lng: 4.9041},\n  {name: "Sweden", id: "sweden", subregion: "Europe", lat: 59.3293, lng: 18.0686},\n  {name: "Ireland", id: "ireland", subregion: "Europe", lat: 53.3498, lng: -6.2603},\n  {name: "Australia", id: "australia", subregion: "Oceania", lat: -33.8688, lng: 151.2093},\n  {name: "New Zealand", id: "new-zealand", subregion: "Oceania", lat: -36.8485, lng: 174.7633},\n  {name: "India", id: "india", subregion: "Asia", lat: 19.076, lng: 72.8777},\n  {name: "UAE", id: "uae", subregion: "Middle East", lat: 25.2048, lng: 55.2708},\n  {name: "Singapore", id: "singapore", subregion: "Asia", lat: 1.3521, lng: 103.8198},\n  {name: "Japan", id: "japan", subregion: "Asia", lat: 35.6762, lng: 139.6503},\n  {name: "Brazil", id: "brazil", subregion: "South America", lat: -23.5505, lng: -46.6333},\n  {name: "South Africa", id: "south-africa", subregion: "Africa", lat: -33.9249, lng: 18.4241}\n];\n\nconst combinations = [];\nfor (const industry of industries) {\n  for (const region of regions) {\n    combinations.push({\n      json: {\n        industry_name: industry.name,\n        industry_id: industry.id,\n        category: industry.category,\n        region_name: region.name,\n        region_id: region.id,\n        subregion: region.subregion,\n        lat: region.lat,\n        lng: region.lng\n      }\n    });\n  }\n}\n\nreturn combinations;',
    };

    @node({
        name: 'Loop Over Items',
        type: 'n8n-nodes-base.splitInBatches',
        version: 3,
        position: [-144, -48],
    })
    LoopOverItems = {
        options: {},
    };

    @node({
        name: 'HTTP Request',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [80, 16],
        credentials: { httpBasicAuth: { id: 'JYPupGzTlWdO3wx9', name: 'Unnamed credential' } },
    })
    HttpRequest = {
        method: 'POST',
        url: 'https://api.dataforseo.com/v3/business_data/business_listings/search/live',
        authentication: 'genericCredentialType',
        genericAuthType: 'httpBasicAuth',
        sendBody: true,
        specifyBody: 'json',
        jsonBody:
            '=[{"categories":["{{ $json.category }}"],"location_coordinate":"{{ $json.lat }}, {{ $json.lng }}, 50000","limit":1}]',
        options: {},
    };

    @node({
        name: 'Extract Count',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [256, 16],
    })
    ExtractCount = {
        jsCode: 'const response = $input.item.json;\nconst loopData = $(\'Loop Over Items\').item.json;\n\nlet totalCount = 0;\ntry {\n  totalCount = response.tasks[0].result[0].total_count || 0;\n} catch (e) {\n  totalCount = 0;\n}\n\nreturn [{\n  json: {\n    industry: loopData.industry_name,\n    region_id: loopData.region_id,\n    region_name: loopData.region_name,\n    subregion: loopData.subregion,\n    lat: loopData.lat,\n    lng: loopData.lng,\n    business_count: totalCount,\n    source: "dataforseo",\n    last_updated: new Date().toISOString()\n  }\n}];',
    };

    @node({
        name: 'Create a row',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [432, 16],
        credentials: { supabaseApi: { id: 'JsHaEd4OXk7Kdft4', name: 'Supabase account' } },
    })
    CreateARow = {
        tableId: 'demand_data',
        dataToSend: 'autoMapInputData',
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.WhenClickingexecuteWorkflow.out(0).to(this.GenerateCombinations.in(0));
        this.GenerateCombinations.out(0).to(this.LoopOverItems.in(0));
        this.LoopOverItems.out(1).to(this.HttpRequest.in(0));
        this.HttpRequest.out(0).to(this.ExtractCount.in(0));
        this.ExtractCount.out(0).to(this.CreateARow.in(0));
        this.CreateARow.out(0).to(this.LoopOverItems.in(0));
    }
}
