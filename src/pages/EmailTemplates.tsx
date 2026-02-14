import React from 'react';
import {
    Plus,
    BarChart2,
    TrendingUp,
    Edit3,
    Copy,
    ExternalLink
} from 'lucide-react';

interface Template {
    id: string;
    name: string;
    track: 'Direct' | 'Specifier' | 'Warm' | 'Custom';
    description: string;
    usedCount: number;
    replyRate: string;
}

const templates: Template[] = [
    {
        id: '1',
        name: "Gym & Wellness Intro",
        track: 'Direct',
        description: "Casual, benefit-focused pitch for fitness and wellness venues. References their Google rating and location.",
        usedCount: 47,
        replyRate: "14.2%"
    },
    {
        id: '2',
        name: "Luxury Hotel & Spa",
        track: 'Direct',
        description: "Premium-positioned pitch emphasising bespoke craftsmanship and Dubai heritage for high-end hospitality.",
        usedCount: 31,
        replyRate: "11.8%"
    },
    {
        id: '3',
        name: "GCC Premium",
        track: 'Direct',
        description: "Tailored for Middle Eastern luxury market, referencing regional wellness trends and premium positioning.",
        usedCount: 18,
        replyRate: "16.1%"
    },
    {
        id: '4',
        name: "Design Partnership",
        track: 'Specifier',
        description: "Professional pitch targeting interior designers, emphasising trade pricing and specification support.",
        usedCount: 22,
        replyRate: "9.4%"
    },
    {
        id: '5',
        name: "Upgrade Pitch",
        track: 'Warm',
        description: "Acknowledges existing cold therapy offering, positions bespoke upgrade as client experience enhancement.",
        usedCount: 15,
        replyRate: "13.7%"
    },
    {
        id: '6',
        name: "Custom Template",
        track: 'Custom',
        description: "Your blank canvas. Build a sequence from scratch for any niche or audience.",
        usedCount: 8,
        replyRate: "10.2%"
    }
];

const trackStyles = {
    Direct: 'bg-blue-50 text-blue-600 border-blue-100',
    Specifier: 'bg-purple-50 text-purple-600 border-purple-100',
    Warm: 'bg-amber-50 text-amber-600 border-amber-100',
    Custom: 'bg-gray-50 text-gray-600 border-gray-100'
};

const TemplateCard: React.FC<{ template: Template }> = ({ template }) => (
    <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col h-full group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${trackStyles[template.track]}`}>
                {template.track}
            </span>
        </div>

        <h3 className="text-base font-bold text-[#111827] mb-2 group-hover:text-primary transition-colors">
            {template.name}
        </h3>

        <p className="text-sm text-[#6B7280] leading-relaxed mb-6 line-clamp-2 flex-grow">
            {template.description}
        </p>

        <div className="flex items-center gap-4 mb-6 pt-4 border-t border-[#F3F4F6]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#9CA3AF]">
                <BarChart2 size={14} />
                <span>Used {template.usedCount} times</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#10B981]">
                <TrendingUp size={14} />
                <span>{template.replyRate} reply rate</span>
            </div>
        </div>

        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#4B5563] hover:bg-gray-50 transition-all">
                    <Edit3 size={14} /> Edit
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#4B5563] hover:bg-gray-50 transition-all">
                    <Copy size={14} /> Duplicate
                </button>
            </div>
            <button className="flex items-center justify-center gap-1.5 py-1 text-primary text-[11px] font-black hover:underline transition-all group/link">
                USE IN CAMPAIGN
                <ExternalLink size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </button>
        </div>
    </div>
);

const EmailTemplates: React.FC = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-[#111827] tracking-tight">Email Templates</h1>
                    <p className="text-sm text-[#6B7280] font-medium mt-1">Manage and deploy high-performing outreach sequences.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 group">
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    CREATE TEMPLATE
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                {templates.map(template => (
                    <TemplateCard key={template.id} template={template} />
                ))}
            </div>
        </div>
    );
};

export default EmailTemplates;
