import React from 'react';
import {
    Plus,
    Star,
    CheckCircle2,
} from 'lucide-react';

interface Deal {
    id: string;
    businessName: string;
    contactName: string;
    description: string;
    value: string;
    track: 'Direct' | 'Specifier' | 'Warm';
    flag: string;
    stage: string;
    timestamp: string;
    isStarred?: boolean;
    isWon?: boolean;
    isLost?: boolean;
    lostReason?: string;
}

const DealCard: React.FC<{ deal: Deal }> = ({ deal }) => (
    <div className={`bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group mb-3 ${deal.isLost ? 'opacity-60 grayscale-[0.3]' : ''} ${deal.isWon ? 'border-l-4 border-l-green-500' : ''}`}>
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm shrink-0">{deal.flag}</span>
                <h4 className="text-xs font-bold text-[#111827] truncate">{deal.businessName}</h4>
            </div>
            {deal.isStarred && <Star size={12} className="fill-amber-400 text-amber-400" />}
            {deal.isWon && <CheckCircle2 size={12} className="text-green-500" />}
        </div>

        <p className="text-[10px] text-[#6B7280] font-medium mb-1">{deal.contactName}</p>
        <p className="text-[10px] text-[#4B5563] leading-relaxed mb-3 line-clamp-2">{deal.description}</p>

        {deal.isLost && deal.lostReason && (
            <p className="text-[9px] font-bold text-red-500 mb-3 bg-red-50 p-1.5 rounded">
                Reason: {deal.lostReason}
            </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
            <span className="text-xs font-black text-[#111827]">{deal.value}</span>
            <div className="flex items-center gap-2">
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${deal.track === 'Direct' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    deal.track === 'Specifier' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                    {deal.track}
                </span>
                <span className="text-[9px] font-bold text-[#9CA3AF]">{deal.timestamp}</span>
            </div>
        </div>
    </div>
);

const PipelineColumn: React.FC<{
    title: string;
    deals: Deal[];
    accentColor: string;
    totalValue: string;
    count: number;
}> = ({ title, deals, accentColor, totalValue, count }) => (
    <div className="w-[300px] shrink-0 flex flex-col h-full bg-[#F3F4F6]/50 rounded-2xl border border-gray-100/50">
        <div className={`p-4 border-t-2 ${accentColor} bg-white rounded-t-2xl border-b border-gray-100`}>
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-black text-[#111827] uppercase tracking-widest">{title}</h3>
                <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{count}</span>
            </div>
            <p className="text-[10px] font-bold text-[#6B7280]">Total: <span className="text-[#111827]">{totalValue}</span></p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {deals.map(deal => <DealCard key={deal.id} deal={deal} />)}
            <button className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-[10px] font-bold text-gray-400 hover:border-primary hover:text-primary transition-all mt-1">
                + Add Deal
            </button>
        </div>
    </div>
);

const DealPipeline: React.FC = () => {
    const pipelineData: Record<string, Deal[]> = {
        'New Reply': [
            { id: '1', businessName: 'Jumeirah Spa Collection', contactName: 'Ahmad Al-Rashid', description: '4x bespoke plunge pools, marble finish', value: '£8,200', track: 'Direct', flag: '🇦🇪', stage: 'New Reply', timestamp: '8 min ago', isStarred: true },
            { id: '2', businessName: 'Nordic Wellness AB', contactName: 'Erik Lindqvist', description: 'Recovery zone for 3 locations', value: '£2,400', track: 'Direct', flag: '🇸🇪', stage: 'New Reply', timestamp: '2 hours ago' },
            { id: '3', businessName: 'Equinox Design Partners', contactName: 'Rachel Chen', description: 'Spa specification for luxury hotel project', value: '£1,200', track: 'Specifier', flag: '🇺🇸', stage: 'New Reply', timestamp: '3 hours ago' },
            { id: '4', businessName: 'Pure Wellness Studio', contactName: 'Sarah Mitchell', description: 'Cold plunge addition to wellness area', value: '£600', track: 'Direct', flag: '🇬🇧', stage: 'New Reply', timestamp: '34 min ago' }
        ],
        'Qualified': [
            { id: '5', businessName: 'Ritz-Carlton Spa Riyadh', contactName: 'Fatima Al-Saud', description: 'Premium cold therapy suite, 6 units', value: '£9,800', track: 'Direct', flag: '🇸🇦', stage: 'Qualified', timestamp: '1 day ago', isStarred: true },
            { id: '6', businessName: 'Studio Bär Interiors', contactName: 'Max Bär', description: 'Munich spa project specification', value: '£3,200', track: 'Specifier', flag: '🇩🇪', stage: 'Qualified', timestamp: '2 days ago' },
            { id: '7', businessName: 'Bondi Recovery Lab', contactName: 'Liam O\'Brien', description: 'Upgrade existing ice bath setup', value: '£1,800', track: 'Warm', flag: '🇦🇺', stage: 'Qualified', timestamp: '2 days ago' }
        ],
        'Proposal Sent': [
            { id: '8', businessName: 'Soho House London', contactName: 'James Fletcher', description: 'Members club cold plunge installation', value: '£7,400', track: 'Direct', flag: '🇬🇧', stage: 'Proposal Sent', timestamp: '3 days ago', isStarred: true },
            { id: '9', businessName: 'FIVE Palm Jumeirah', contactName: 'Nadia Hassan', description: 'Rooftop spa cold therapy feature', value: '£4,000', track: 'Direct', flag: '🇦🇪', stage: 'Proposal Sent', timestamp: '5 days ago' }
        ],
        'Negotiating': [
            { id: '10', businessName: 'Mondrian Doha', contactName: 'Khalid Al-Thani', description: 'Bespoke cold plunge for spa renovation', value: '£5,600', track: 'Direct', flag: '🇶🇦', stage: 'Negotiating', timestamp: '4 days ago', isStarred: true }
        ],
        'Won': [
            { id: '11', businessName: 'Caesars Palace Dubai', contactName: 'Omar Kassim', description: '3x custom ice baths, gold trim', value: '£12,400', track: 'Direct', flag: '🇦🇪', stage: 'Won', timestamp: '1 week ago', isWon: true },
            { id: '12', businessName: 'Third Space London', contactName: 'David Park', description: 'Recovery floor cold plunge pair', value: '£5,800', track: 'Direct', flag: '🇬🇧', stage: 'Won', timestamp: '2 weeks ago', isWon: true }
        ],
        'Lost': [
            { id: '13', businessName: 'Equinox NYC', contactName: 'Mike Torres', description: 'Budget constraints — revisit Q3', value: '£2,100', track: 'Direct', flag: '🇺🇸', stage: 'Lost', timestamp: '1 week ago', isLost: true, lostReason: 'Budget constraints' }
        ]
    };

    const stats = [
        { label: 'Total Deals', value: '13', sub: '+2 this week' },
        { label: 'Conversion Rate', value: '15.4%', sub: '+1.2% from last month' },
        { label: 'Avg Deal Value', value: '£3,631', sub: '+£240 trend' },
        { label: 'Won This Month', value: '£18,200', sub: 'Target: £25k' }
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-[#111827] mb-1">Deal Pipeline</h1>
                    <p className="text-sm font-bold text-[#6B7280]">Track and manage deals from first reply to closed won</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Total Pipeline Value</p>
                        <p className="text-xl font-black text-primary">£47,200</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:scale-95">
                        <Plus size={18} />
                        ADD DEAL
                    </button>
                </div>
            </div>

            {/* Summary Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {stats.map(stat => (
                    <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">{stat.label}</p>
                        <div className="flex items-end gap-2">
                            <h3 className="text-xl font-black text-[#111827] leading-none">{stat.value}</h3>
                            <span className="text-[9px] font-bold text-green-500 pb-0.5">{stat.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar-horizontal">
                <div className="flex gap-4 h-full min-w-max">
                    <PipelineColumn
                        title="New Reply"
                        deals={pipelineData['New Reply']}
                        accentColor="border-t-blue-400"
                        totalValue="£12,400"
                        count={4}
                    />
                    <PipelineColumn
                        title="Qualified"
                        deals={pipelineData['Qualified']}
                        accentColor="border-t-green-400"
                        totalValue="£14,800"
                        count={3}
                    />
                    <PipelineColumn
                        title="Proposal Sent"
                        deals={pipelineData['Proposal Sent']}
                        accentColor="border-t-purple-400"
                        totalValue="£11,400"
                        count={2}
                    />
                    <PipelineColumn
                        title="Negotiating"
                        deals={pipelineData['Negotiating']}
                        accentColor="border-t-amber-400"
                        totalValue="£5,600"
                        count={1}
                    />
                    <PipelineColumn
                        title="Won"
                        deals={pipelineData['Won']}
                        accentColor="border-t-green-600"
                        totalValue="£18,200"
                        count={2}
                    />
                    <PipelineColumn
                        title="Lost"
                        deals={pipelineData['Lost']}
                        accentColor="border-t-red-300"
                        totalValue="£2,100"
                        count={1}
                    />
                </div>
            </div>
        </div>
    );
};

export default DealPipeline;
