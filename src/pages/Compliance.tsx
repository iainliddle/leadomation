import React, { useState, useEffect } from 'react';
import {
    Shield,
    Lock,
    MapPin,
    Database,
    Eye,
    Download,
    Trash2,
    Upload,
    AlertTriangle,
    Loader2,
    Save
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Compliance: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [includeUnsubscribe, setIncludeUnsubscribe] = useState(true);
    const [includeBusinessAddress, setIncludeBusinessAddress] = useState(true);
    const [b2bOnlyFilter, setB2bOnlyFilter] = useState(true);
    const [logConsent, setLogConsent] = useState(false);
    const [businessAddress, setBusinessAddress] = useState('');

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data } = await supabase
                    .from('profiles')
                    .select('include_unsubscribe, include_business_address, b2b_only_filter, log_consent, business_address')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setIncludeUnsubscribe(data.include_unsubscribe ?? true);
                    setIncludeBusinessAddress(data.include_business_address ?? true);
                    setB2bOnlyFilter(data.b2b_only_filter ?? true);
                    setLogConsent(data.log_consent ?? false);
                    setBusinessAddress(data.business_address || '');
                }
            } catch (err) {
                console.error('Error loading compliance settings:', err);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const saveSettings = async (fields: Record<string, any>) => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('profiles')
                .update(fields)
                .eq('id', user.id);

            if (error) {
                console.error('Error saving:', error);
                alert('Failed to save. Please try again.');
            }
        } catch (err) {
            console.error('Save error:', err);
        } finally {
            setTimeout(() => setSaving(false), 1000);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-2xl font-black text-[#111827] tracking-tight">Compliance</h1>
                    <p className="text-sm text-[#6B7280] font-medium mt-1">Manage global regulatory compliance and data protection.</p>
                </div>
                <button
                    onClick={() => saveSettings({
                        include_unsubscribe: includeUnsubscribe,
                        include_business_address: includeBusinessAddress,
                        b2b_only_filter: b2bOnlyFilter,
                        log_consent: logConsent,
                        business_address: businessAddress
                    })}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Saving...' : '💾 SAVE SETTINGS'}
                </button>
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
                        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl opacity-80 cursor-not-allowed">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#111827] flex items-center gap-2">
                                    Include unsubscribe link in every email
                                    <span className="text-[9px] font-black bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded uppercase tracking-widest">Required</span>
                                </span>
                                <span className="text-[11px] text-[#6B7280] font-medium mt-1">Automatically appends to your template footer</span>
                            </div>
                            <div
                                className={`relative w-11 h-6 rounded-full bg-primary flex items-center px-1 cursor-not-allowed`}
                            >
                                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                    <Lock size={10} className="text-[#9CA3AF]" />
                                </div>
                                <div className="absolute left-[24px] w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>

                        <label className="flex items-center justify-between p-4 bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50/50 transition-all cursor-pointer">
                            <span className="text-sm font-bold text-[#4B5563]">Include sender business address in email footer</span>
                            <div className="flex items-center h-6">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={includeBusinessAddress}
                                    onChange={(e) => {
                                        setIncludeBusinessAddress(e.target.checked);
                                        saveSettings({ include_business_address: e.target.checked });
                                    }}
                                />
                                <div
                                    className={`relative w-11 h-6 rounded-full transition-all duration-300 ${includeBusinessAddress ? 'bg-primary' : 'bg-gray-200'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${includeBusinessAddress ? 'translate-x-5' : ''}`} />
                                </div>
                            </div>
                        </label>

                        <label className="flex items-center justify-between p-4 bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50/50 transition-all cursor-pointer">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#4B5563]">B2B only filter</span>
                                <span className="text-[11px] text-[#9CA3AF] font-medium mt-0.5">Exclude personal addresses like Gmail, Yahoo, etc.</span>
                            </div>
                            <div className="flex items-center h-6">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={b2bOnlyFilter}
                                    onChange={(e) => {
                                        setB2bOnlyFilter(e.target.checked);
                                        saveSettings({ b2b_only_filter: e.target.checked });
                                    }}
                                />
                                <div
                                    className={`relative w-11 h-6 rounded-full transition-all duration-300 ${b2bOnlyFilter ? 'bg-primary' : 'bg-gray-200'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${b2bOnlyFilter ? 'translate-x-5' : ''}`} />
                                </div>
                            </div>
                        </label>

                        <label className="flex items-center justify-between p-4 bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50/50 transition-all cursor-pointer">
                            <span className="text-sm font-bold text-[#4B5563]">Log consent basis for each lead</span>
                            <div className="flex items-center h-6">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={logConsent}
                                    onChange={(e) => {
                                        setLogConsent(e.target.checked);
                                        saveSettings({ log_consent: e.target.checked });
                                    }}
                                />
                                <div
                                    className={`relative w-11 h-6 rounded-full transition-all duration-300 ${logConsent ? 'bg-primary' : 'bg-gray-200'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${logConsent ? 'translate-x-5' : ''}`} />
                                </div>
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
                                value={businessAddress}
                                onChange={e => setBusinessAddress(e.target.value)}
                            />
                        </div>

                        <label className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 border-dashed cursor-pointer">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-[#111827]">Automatic Bounce Suppression</span>
                                <span className="text-[11px] text-[#9CA3AF] font-medium tracking-tight hidden sm:inline">(Prevents re-sending to bounced addresses)</span>
                            </div>
                            <div
                                className="relative w-11 h-6 rounded-full transition-all duration-300 bg-primary"
                            >
                                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 translate-x-5" />
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

            {/* Bottom Info Banner */}
            <div className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                    <Shield size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-900">Compliance & Protection</h4>
                    <p className="text-xs text-blue-700/80 font-medium mt-1.5 leading-relaxed">
                        Compliance settings help ensure your outreach follows GDPR, CAN-SPAM, and other regulations. The unsubscribe link is required by law in most jurisdictions and cannot be disabled. B2B filtering helps protect your sender reputation by excluding personal email addresses.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Compliance;
