import React, { useState } from 'react';
import {
    Search,
    Star,
    Archive,
    ExternalLink,
    Bold,
    Italic,
    Link as LinkIcon,
    Sparkles,
    MapPin,
    Tag,
    MessageSquare,
    MoreHorizontal,
    Send,
    Check
} from 'lucide-react';

interface Message {
    id: string;
    sender: string;
    business: string;
    subject: string;
    preview: string;
    body: string;
    timestamp: string;
    isUnread: boolean;
    isStarred: boolean;
    badge: 'Direct' | 'Specifier' | 'Warm';
    flag: string;
    initials: string;
    avatarColor: string;
}

const UnifiedInbox: React.FC = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [selectedMessageId, setSelectedMessageId] = useState('1');
    const [searchQuery, setSearchQuery] = useState('');
    const [replyText, setReplyText] = useState('');
    const [addToPipeline, setAddToPipeline] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'Ahmad Al-Rashid',
            business: 'Jumeirah Spa Collection',
            subject: 'Re: Bespoke cold plunge pools',
            preview: 'This sounds exactly like what we\'ve been looking for. Can you send pricing for 4 units...',
            body: `Hi,

This sounds exactly like what we've been looking for. We're renovating our spa wing in Q2 and want to add premium cold plunge experiences for our guests.

Can you send pricing for 4 units — we'd need two round plunge pools and two rectangular ice baths, all in a marble/stone finish to match our interior.

Also, do you handle international shipping to Dubai and is installation support included?

Looking forward to hearing from you.

Best regards,
Ahmad Al-Rashid,
Facilities Director, Jumeirah Spa Collection`,
            timestamp: '8 min ago',
            isUnread: true,
            isStarred: true,
            badge: 'Direct',
            flag: '🇦🇪',
            initials: 'AA',
            avatarColor: 'bg-blue-100 text-blue-600'
        },
        {
            id: '2',
            sender: 'Sarah Mitchell',
            business: 'Pure Wellness Studio',
            subject: 'Re: Premium cold therapy for your facility',
            preview: 'Hi, thanks for reaching out. We\'ve actually been considering adding cold plunge to our...',
            body: 'Hi, thanks for reaching out...',
            timestamp: '34 min ago',
            isUnread: true,
            isStarred: false,
            badge: 'Direct',
            flag: '🇬🇧',
            initials: 'SM',
            avatarColor: 'bg-purple-100 text-purple-600'
        },
        {
            id: '3',
            sender: 'Erik Lindqvist',
            business: 'Nordic Wellness AB',
            subject: 'Re: Bespoke cold plunge pools',
            preview: 'Very interested. We have 3 locations in Stockholm and are expanding our recovery offering...',
            body: 'Very interested...',
            timestamp: '2 hours ago',
            isUnread: true,
            isStarred: true,
            badge: 'Direct',
            flag: '🇸🇪',
            initials: 'EL',
            avatarColor: 'bg-amber-100 text-amber-600'
        },
        {
            id: '4',
            sender: 'Rachel Chen',
            business: 'Equinox Design Partners',
            subject: 'Re: Design partnership opportunity',
            preview: 'Thanks for thinking of us. We\'re currently specifying wellness amenities for a luxury hotel...',
            body: 'Thanks for thinking of us...',
            timestamp: '3 hours ago',
            isUnread: true,
            isStarred: false,
            badge: 'Specifier',
            flag: '🇺🇸',
            initials: 'RC',
            avatarColor: 'bg-cyan-100 text-cyan-600'
        },
        {
            id: '5',
            sender: 'Liam O\'Brien',
            business: 'Bondi Recovery Lab',
            subject: 'Re: Upgrade your cold therapy setup',
            preview: 'We\'ve been using basic ice baths for about a year now. What makes yours different from...',
            body: 'We\'ve been using basic...',
            timestamp: 'Yesterday',
            isUnread: false,
            isStarred: false,
            badge: 'Warm',
            flag: '🇦🇺',
            initials: 'LO',
            avatarColor: 'bg-pink-100 text-pink-600'
        },
        {
            id: '6',
            sender: 'Fatima Al-Saud',
            business: 'Ritz-Carlton Spa Riyadh',
            subject: 'Re: Bespoke cold plunge pools',
            preview: 'I\'ve forwarded your email to our procurement team. They will be in touch regarding...',
            body: 'I\'ve forwarded your email...',
            timestamp: 'Yesterday',
            isUnread: false,
            isStarred: true,
            badge: 'Direct',
            flag: '🇸🇦',
            initials: 'FS',
            avatarColor: 'bg-indigo-100 text-indigo-600'
        },
        {
            id: '7',
            sender: 'Max Bär',
            business: 'Studio Bär Interiors',
            subject: 'Re: Design partnership opportunity',
            preview: 'Interesting concept. We\'re working on a spa project in Munich right now. Could you send...',
            body: 'Interesting concept...',
            timestamp: '2 days ago',
            isUnread: false,
            isStarred: false,
            badge: 'Specifier',
            flag: '🇩🇪',
            initials: 'MB',
            avatarColor: 'bg-green-100 text-green-600'
        },
        {
            id: '8',
            sender: 'Tom Richardson',
            business: 'Iron Athletics',
            subject: 'Re: Premium cold therapy for your facility',
            preview: 'What\'s the cost roughly? We\'re a small CrossFit box so budget is important...',
            body: 'What\'s the cost roughly?...',
            timestamp: '2 days ago',
            isUnread: false,
            isStarred: false,
            badge: 'Direct',
            flag: '🇬🇧',
            initials: 'TR',
            avatarColor: 'bg-gray-100 text-gray-600'
        }
    ]);

    const activeMessage = messages.find(m => m.id === selectedMessageId) || messages[0];

    const toggleStar = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isStarred: !m.isStarred } : m));
    };

    const getBadgeStyles = (badge: string) => {
        switch (badge) {
            case 'Direct': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Specifier': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Warm': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="flex bg-white h-[calc(100vh-100px)] rounded-2xl border border-[#E5E7EB] overflow-hidden animate-in fade-in duration-700">
            {/* Left Panel: Message List */}
            <aside className="w-[380px] shrink-0 border-r border-[#E5E7EB] flex flex-col bg-gray-50/10">
                {/* Search & Tabs */}
                <div className="p-4 border-b border-[#E5E7EB] bg-white">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search replies..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                        {[
                            { label: 'All', count: 24 },
                            { label: 'Unread', count: 12 },
                            { label: 'Starred', count: 3 },
                            { label: 'Needs Reply', count: 8 }
                        ].map((tab) => (
                            <button
                                key={tab.label}
                                onClick={() => setActiveTab(tab.label)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === tab.label
                                        ? 'bg-blue-50 text-primary shadow-sm border border-blue-100'
                                        : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]'
                                    }`}
                            >
                                {tab.label}
                                <span className={`text-[9px] ${activeTab === tab.label ? 'text-primary/70' : 'text-gray-400'}`}>
                                    ({tab.count})
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            onClick={() => setSelectedMessageId(message.id)}
                            className={`p-4 border-b border-[#F3F4F6] cursor-pointer transition-all relative group hover:bg-white ${selectedMessageId === message.id ? 'bg-[#F0F7FF] border-l-4 border-l-primary' : 'bg-transparent'
                                }`}
                        >
                            <div className="flex gap-3">
                                <div className="flex flex-col items-center shrink-0 pt-0.5">
                                    <div className={`w-2 h-2 rounded-full mb-2 ${message.isUnread ? 'bg-primary shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'bg-transparent'}`} />
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black shadow-sm ${message.avatarColor}`}>
                                        {message.initials}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h4 className={`text-xs truncate ${message.isUnread ? 'font-black text-[#111827]' : 'font-bold text-[#4B5563]'}`}>
                                            {message.sender}
                                        </h4>
                                        <span className="text-[9px] font-bold text-[#9CA3AF] whitespace-nowrap">{message.timestamp}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="text-[10px] text-[#6B7280] font-bold truncate leading-none">{message.business}</span>
                                        <span className="text-[10px]">{message.flag}</span>
                                    </div>
                                    <p className="text-[10px] font-black text-primary truncate mb-0.5">{message.subject}</p>
                                    <p className="text-[10px] text-[#6B7280] font-medium truncate leading-relaxed">
                                        {message.preview}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0 pt-1">
                                    <Star
                                        size={14}
                                        className={`transition-all ${message.isStarred ? 'fill-amber-400 text-amber-400' : 'text-gray-300 hover:text-gray-400'}`}
                                        onClick={(e) => toggleStar(message.id, e)}
                                    />
                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-wider ${getBadgeStyles(message.badge)}`}>
                                        {message.badge}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Right Panel: Message Detail View */}
            <main className="flex-1 flex flex-col bg-white">
                {/* Detail Header */}
                <div className="px-8 py-6 border-b border-[#F3F4F6] flex items-center justify-between sticky top-0 bg-white z-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-black text-[#111827]">{activeMessage.sender}</h2>
                            <button className="text-gray-400 hover:text-primary transition-colors">
                                <ExternalLink size={16} />
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-[#4B5563]">{activeMessage.business}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-widest ${getBadgeStyles(activeMessage.badge)}`}>
                                    {activeMessage.badge}
                                </span>
                            </div>
                            <div className="w-px h-3 bg-gray-200" />
                            <span className="text-[11px] font-bold text-[#9CA3AF]">
                                Campaign: <span className="text-[#6B7280]">GCC Luxury Hotels & Spas</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-black transition-all ${activeMessage.isStarred ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            onClick={(e) => toggleStar(activeMessage.id, e)}
                        >
                            <Star size={14} className={activeMessage.isStarred ? 'fill-amber-400' : ''} />
                            STAR
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black hover:bg-gray-50 transition-all shadow-sm">
                            <Archive size={14} />
                            ARCHIVE
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:scale-95">
                            📊 MOVE TO PIPELINE
                        </button>
                    </div>
                </div>

                {/* Lead Info Card */}
                <div className="px-8 py-4 bg-gray-50/30 border-b border-[#F3F4F6]">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between max-w-4xl">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-primary" />
                                <span className="text-xs font-black text-[#111827]">Dubai, UAE</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                <span className="text-xs font-black text-[#111827]">4.9 rating</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Tag size={14} className="text-purple-500" />
                                <span className="text-xs font-black text-[#111827]">Direct</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MessageSquare size={14} className="text-green-500" />
                                <span className="text-xs font-black text-[#111827]">Contacted → <span className="text-green-600">Replied</span></span>
                            </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                </div>

                {/* Email Thread */}
                <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar">
                    <div className="max-w-4xl space-y-8">
                        {/* Selected Message Detail (Reply) */}
                        <div className="relative pl-6 border-l-4 border-primary/20">
                            <div className="absolute left-[-22px] top-0 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-blue-50" />
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm ${activeMessage.avatarColor}`}>
                                        {activeMessage.initials}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-[#111827]">{activeMessage.sender}</h4>
                                        <span className="text-[11px] font-bold text-[#9CA3AF] tracking-wide uppercase">{activeMessage.timestamp}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-blue-50/30 border border-blue-50 p-6 rounded-2xl">
                                <p className="text-sm text-[#4B5563] leading-relaxed font-medium whitespace-pre-wrap">
                                    {activeMessage.body}
                                </p>
                            </div>
                        </div>

                        {/* Original Outreach */}
                        <div className="pl-6 border-l-4 border-gray-100 opacity-60">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-600 shadow-sm">
                                        ME
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-[#111827]">You</h4>
                                        <span className="text-[11px] font-bold text-[#9CA3AF] tracking-wide uppercase">3 days ago</span>
                                    </div>
                                </div>
                                <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-wider">
                                    Show full message
                                </button>
                            </div>
                            <div className="bg-gray-50/50 border border-gray-100 p-6 rounded-2xl">
                                <p className="text-sm text-[#4B5563] leading-relaxed font-medium line-clamp-2">
                                    Hi Ahmad, I came across Jumeirah Spa Collection in Dubai and was genuinely impressed by your 4.9-star reputation. We handcraft bespoke cold plunge pools and ice baths here in Dubai, built to order for wellness-focused businesses like yours...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Reply Section */}
                <div className="p-8 border-t border-[#F3F4F6] bg-white sticky bottom-0">
                    <div className="max-w-4xl">
                        <div className="bg-gray-50/50 border border-gray-200 rounded-2xl overflow-hidden focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/5 transition-all mb-4">
                            <textarea
                                placeholder="Write a reply..."
                                className="w-full p-6 bg-transparent text-sm focus:outline-none min-h-[120px] font-medium leading-relaxed"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            <div className="px-6 py-3 bg-white border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-all">
                                        <Bold size={18} />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-all">
                                        <Italic size={18} />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-all">
                                        <LinkIcon size={18} />
                                    </button>
                                    <div className="w-px h-6 bg-gray-100 mx-2" />
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-xl text-[11px] font-black hover:bg-purple-100 transition-all border border-purple-100 shadow-sm animate-pulse-subtle">
                                        <Sparkles size={14} />
                                        ✨ AI SUGGEST REPLY
                                    </button>
                                </div>
                                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] group active:scale-95">
                                    <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    SEND REPLY
                                </button>
                            </div>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer group w-fit">
                            <div
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${addToPipeline ? 'bg-primary border-primary shadow-sm' : 'bg-white border-gray-200 group-hover:border-primary'
                                    }`}
                                onClick={() => setAddToPipeline(!addToPipeline)}
                            >
                                {addToPipeline && <Check size={14} className="text-white" />}
                            </div>
                            <span className="text-xs font-bold text-[#4B5563] group-hover:text-[#111827] transition-colors">📊 Add to deal pipeline on send</span>
                        </label>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UnifiedInbox;
