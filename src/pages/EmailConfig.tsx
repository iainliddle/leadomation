import React, { useState } from 'react';
import {
    CheckCircle2,
    XCircle,
    Clock,
    Globe,
    ShieldCheck,
    Save,
    ChevronDown,
    Bold,
    Italic,
    Link,
    Image as ImageIcon
} from 'lucide-react';

const EmailConfig: React.FC = () => {
    const [dailyLimit, setDailyLimit] = useState(50);
    const [autoDetectTimezone, setAutoDetectTimezone] = useState(true);
    const [includeOutgoing, setIncludeOutgoing] = useState(true);
    const [includeInbox, setIncludeInbox] = useState(true);

    return (
        <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto pb-12">
            <div className="mb-10">
                <h1 className="text-2xl font-black text-[#111827] tracking-tight">Email Config</h1>
                <p className="text-sm text-[#6B7280] font-medium mt-1">Manage your sending infrastructure and delivery rules.</p>
            </div>

            <div className="space-y-8">
                {/* Section 1: Sending Domain */}
                <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-primary rounded-xl flex items-center justify-center shadow-sm">
                                <Globe size={20} />
                            </div>
                            <h3 className="text-base font-bold text-[#111827]">Sending Domain</h3>
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-8 group">
                        <span className="text-sm font-bold text-[#4B5563]">outreach.leadomation.co.uk</span>
                        <button className="text-[10px] font-black text-primary hover:underline transition-all">EDIT</button>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span className="text-sm font-bold text-[#4B5563]">SPF Record</span>
                            </div>
                            <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Configured</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span className="text-sm font-bold text-[#4B5563]">DKIM Record</span>
                            </div>
                            <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Configured</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-3">
                                <XCircle size={16} className="text-rose-500" />
                                <span className="text-sm font-bold text-[#4B5563]">DMARC Record</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-black text-rose-600 uppercase tracking-widest">Not Configured</span>
                                <button className="text-[11px] font-black text-primary hover:underline tracking-widest uppercase">Fix</button>
                            </div>
                        </div>
                    </div>

                    <button className="px-6 py-2.5 border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#4B5563] hover:bg-gray-50 transition-all shadow-sm">
                        Run Health Check
                    </button>
                </div>

                {/* Section 2: Sending Limits */}
                <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shadow-sm">
                            <Clock size={20} />
                        </div>
                        <h3 className="text-base font-bold text-[#111827]">Daily Sending Limits</h3>
                    </div>

                    <div className="mb-8">
                        <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-3 block">DAILY EMAIL LIMIT</label>
                        <div className="flex gap-2">
                            {[25, 50, 100].map(limit => (
                                <button
                                    key={limit}
                                    onClick={() => setDailyLimit(limit)}
                                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all border ${dailyLimit === limit
                                        ? 'bg-primary text-white border-primary shadow-md shadow-blue-500/20'
                                        : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-gray-300'
                                        }`}
                                >
                                    {limit}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                        <div>
                            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-3 block">START WINDOW</label>
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-[#111827] cursor-pointer hover:bg-gray-100 transition-all">
                                9:00 AM <ChevronDown size={16} className="text-[#9CA3AF]" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-3 block">END WINDOW</label>
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-[#111827] cursor-pointer hover:bg-gray-100 transition-all">
                                5:00 PM <ChevronDown size={16} className="text-[#9CA3AF]" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="flex items-center justify-between cursor-pointer group p-4 bg-gray-50/50 rounded-xl border border-gray-100 border-dashed">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#111827]">Auto-detect recipient timezone</span>
                                <span className="text-[11px] text-[#6B7280] font-medium mt-1">Emails will arrive during their local business hours</span>
                            </div>
                            <div
                                className={`relative w-11 h-6 rounded-full transition-all duration-300 ${autoDetectTimezone ? 'bg-primary' : 'bg-gray-200'}`}
                                onClick={() => setAutoDetectTimezone(!autoDetectTimezone)}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${autoDetectTimezone ? 'translate-x-5' : ''}`} />
                            </div>
                        </label>
                    </div>
                </div>

                {/* Section 3: Sender Identity */}
                <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                            <ShieldCheck size={20} />
                        </div>
                        <h3 className="text-base font-bold text-[#111827]">Sender Identity</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2 block">FROM NAME</label>
                            <input
                                type="text"
                                defaultValue="Iain Liddle"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2 block">FROM EMAIL</label>
                                <input
                                    type="email"
                                    defaultValue="iain@outreach.leadomation.co.uk"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2 block">REPLY-TO EMAIL</label>
                                <input
                                    type="email"
                                    defaultValue="iain@leadomation.co.uk"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-10">
                        <button className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 group">
                            <Save size={18} className="group-hover:translate-y-[-1px] transition-transform" />
                            SAVE CHANGES
                        </button>
                    </div>
                </div>

                {/* Section 4: Email Signature */}
                <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
                    <div className="flex flex-col gap-1 mb-8">
                        <h3 className="text-base font-bold text-[#111827]">Email Signature</h3>
                        <p className="text-sm text-[#6B7280] font-medium">Automatically appended to all outgoing emails and replies</p>
                    </div>

                    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden mb-8 group focus-within:border-primary transition-all">
                        {/* Editor Toolbar */}
                        <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-[#E5E7EB]">
                            <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-all"><Bold size={16} /></button>
                            <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-all"><Italic size={16} /></button>
                            <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-all"><Link size={16} /></button>
                            <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-all"><ImageIcon size={16} /></button>
                        </div>
                        {/* Editor Area */}
                        <textarea
                            className="w-full p-6 text-sm font-semibold text-[#4B5563] focus:outline-none min-h-[160px] bg-white leading-relaxed"
                            defaultValue={`Iain Liddle\nFounder & CEO\nLeadomation\n\n📞 +44 7XXX XXXXXX\n🌐 www.leadomation.co.uk\n📍 Newcastle upon Tyne, UK`}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                        <label className="flex items-center justify-between cursor-pointer group p-4 bg-gray-50/50 rounded-xl border border-gray-100 border-dashed hover:border-primary transition-all">
                            <span className="text-xs font-bold text-[#111827]">Include signature in all outgoing emails</span>
                            <div
                                className={`relative w-11 h-6 rounded-full transition-all duration-300 ${includeOutgoing ? 'bg-primary' : 'bg-gray-200'}`}
                                onClick={() => setIncludeOutgoing(!includeOutgoing)}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${includeOutgoing ? 'translate-x-5' : ''}`} />
                            </div>
                        </label>
                        <label className="flex items-center justify-between cursor-pointer group p-4 bg-gray-50/50 rounded-xl border border-gray-100 border-dashed hover:border-primary transition-all">
                            <span className="text-xs font-bold text-[#111827]">Include signature in inbox replies</span>
                            <div
                                className={`relative w-11 h-6 rounded-full transition-all duration-300 ${includeInbox ? 'bg-primary' : 'bg-gray-200'}`}
                                onClick={() => setIncludeInbox(!includeInbox)}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${includeInbox ? 'translate-x-5' : ''}`} />
                            </div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <button className="px-6 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs font-black text-[#4B5563] hover:bg-gray-50 transition-all shadow-sm active:scale-95 uppercase tracking-widest">
                            Preview
                        </button>
                        <button className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 group">
                            <Save size={18} className="group-hover:translate-y-[-1px] transition-transform" />
                            SAVE SIGNATURE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailConfig;
