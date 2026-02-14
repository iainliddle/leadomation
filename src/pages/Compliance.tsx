import React, { useState } from 'react';
import {
    Shield,
    Lock,
    MapPin,
    Database,
    Eye,
    Download,
    Trash2,
    Upload,
    History,
    AlertTriangle
} from 'lucide-react';

const Compliance: React.FC = () => {
    const [toggles, setToggles] = useState({
        footerAddress: true,
        b2bFilter: true,
        consentLogs: false,
        canSpamAuto: true
    });

    const handleToggle = (key: keyof typeof toggles) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto pb-12">
            <div className="mb-10">
                <h1 className="text-2xl font-black text-[#111827] tracking-tight">Compliance</h1>
                <p className="text-sm text-[#6B7280] font-medium mt-1">Manage global regulatory compliance and data protection.</p>
            </div>

            <div className="space-y-8">
                {/* Section 1: GDPR & Privacy */}
                <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-blue-50 text-primary rounded-xl flex items-center justify-center shadow-sm">
                            <Shield size={20} />
                        </div>
                        <h3 className="text-base font-bold text-[#111827]">GDPR & Privacy</h3>
                    </div>

                    <div className="space-y-4">
                        {/* Unsubscribe - Locked */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl opacity-80 cursor-not-allowed">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#111827] flex items-center gap-2">
                                    Include unsubscribe link in every email
                                    <span className="text-[9px] font-black bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded uppercase tracking-widest">Required</span>
                                </span>
                                <span className="text-[11px] text-[#6B7280] font-medium mt-1">Automatically appends to your template footer</span>
                            </div>
                            <div className="relative w-11 h-6 rounded-full bg-primary flex items-center px-1">
                                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                    <Lock size={10} className="text-[#9CA3AF]" />
                                </div>
                                <div className="absolute left-[24px] w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>

                        {/* Footer Address */}
                        <label className="flex items-center justify-between p-4 bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50/50 transition-all cursor-pointer">
                            <span className="text-sm font-bold text-[#4B5563]">Include sender business address in email footer</span>
                            <div
                                className={`relative w-11 h-6 rounded-full transition-all duration-300 ${toggles.footerAddress ? 'bg-primary' : 'bg-gray-200'}`}
                                onClick={() => handleToggle('footerAddress')}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${toggles.footerAddress ? 'translate-x-5' : ''}`} />
                            </div>
                        </label>

                        {/* B2B Only */}
                        <label className="flex items-center justify-between p-4 bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50/50 transition-all cursor-pointer">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#4B5563]">B2B only filter</span>
                                <span className="text-[11px] text-[#9CA3AF] font-medium mt-0.5">Exclude personal addresses like Gmail, Yahoo, etc.</span>
                            </div>
                            <div
                                className={`relative w-11 h-6 rounded-full transition-all duration-300 ${toggles.b2bFilter ? 'bg-primary' : 'bg-gray-200'}`}
                                onClick={() => handleToggle('b2bFilter')}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${toggles.b2bFilter ? 'translate-x-5' : ''}`} />
                            </div>
                        </label>

                        {/* Consent Logs */}
                        <label className="flex items-center justify-between p-4 bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50/50 transition-all cursor-pointer">
                            <span className="text-sm font-bold text-[#4B5563]">Log consent basis for each lead</span>
                            <div
                                className={`relative w-11 h-6 rounded-full transition-all duration-300 ${toggles.consentLogs ? 'bg-primary' : 'bg-gray-200'}`}
                                onClick={() => handleToggle('consentLogs')}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${toggles.consentLogs ? 'translate-x-5' : ''}`} />
                            </div>
                        </label>
                    </div>
                </div>

                {/* Section 2: CAN-SPAM */}
                <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shadow-sm">
                            <MapPin size={20} />
                        </div>
                        <h3 className="text-base font-bold text-[#111827]">CAN-SPAM Compliance</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-3 block">PHYSICAL MAILING ADDRESS</label>
                            <textarea
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none h-24"
                                placeholder="Business Address 123, Floor 4, Wellness District..."
                                defaultValue="Unit 42, Innovation Center, Silicon Oasis, Dubai, UAE"
                            />
                        </div>

                        <label className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 border-dashed cursor-pointer">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-[#111827]">Auto-include in US campaigns</span>
                                <span className="text-[11px] text-[#9CA3AF] font-medium tracking-tight whitespace-nowrap hidden sm:inline">(Required for targeting US leads)</span>
                            </div>
                            <div
                                className={`relative w-11 h-6 rounded-full transition-all duration-300 ${toggles.canSpamAuto ? 'bg-primary' : 'bg-gray-200'}`}
                                onClick={() => handleToggle('canSpamAuto')}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${toggles.canSpamAuto ? 'translate-x-5' : ''}`} />
                            </div>
                        </label>
                    </div>
                </div>

                {/* Section 3: Suppression List */}
                <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-50 text-[#4B5563] rounded-xl flex items-center justify-center shadow-sm">
                                <Shield size={20} />
                            </div>
                            <h3 className="text-base font-bold text-[#111827]">Suppression List</h3>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-base font-black text-[#111827]">127 suppressed emails</span>
                            <span className="text-[10px] font-bold text-[#9CA3AF] flex items-center gap-1 mt-0.5">
                                <History size={10} /> Last updated: 2 hours ago
                            </span>
                        </div>
                    </div>

                    <p className="text-sm text-[#6B7280] leading-relaxed mb-8 max-w-2xl">
                        Emails that have unsubscribed, bounced, or been manually suppressed. These addresses will never be contacted again across any campaign.
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#4B5563] hover:bg-gray-50 transition-all shadow-sm">
                            <Eye size={14} /> View Full List
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#4B5563] hover:bg-gray-50 transition-all shadow-sm">
                            <Upload size={14} /> Import Suppression List
                        </button>
                        <button className="text-[11px] font-black text-primary hover:underline uppercase tracking-widest ml-1">Export List</button>
                    </div>
                </div>

                {/* Section 4: Data Management */}
                <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-8 border-rose-100/50 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shadow-sm">
                            <Database size={20} />
                        </div>
                        <h3 className="text-base font-bold text-[#111827]">Data Management</h3>
                    </div>

                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#111827]">Full Lead Export</span>
                                <span className="text-[11px] text-[#6B7280] font-medium">Download all leads as a comprehensive CSV</span>
                            </div>
                            <button className="flex items-center gap-2 px-6 py-2.5 border border-[#E5E7EB] bg-white rounded-xl text-xs font-bold text-[#4B5563] hover:bg-gray-50 transition-all shadow-sm">
                                <Download size={16} /> Export All Lead Data
                            </button>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-3 block">DELETE LEAD BY EMAIL</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="email"
                                    placeholder="e.g., hans@wellness-spa.de"
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all"
                                />
                                <button className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl text-sm font-black hover:bg-rose-700 transition-all shadow-md active:scale-95 group">
                                    <Trash2 size={16} className="group-hover:rotate-12 transition-transform" />
                                    DELETE
                                </button>
                            </div>
                            <div className="flex items-center gap-1.5 mt-3 text-rose-600">
                                <AlertTriangle size={12} />
                                <p className="text-[10px] font-bold uppercase tracking-tight">
                                    Deleting a lead removes all associated data permanently. Supports GDPR right-to-erasure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Compliance;
