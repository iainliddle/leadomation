import React, { useState, useEffect } from 'react';
import {
    Shield,
    MapPin,
    Database,
    Eye,
    Download,
    Trash2,
    Upload,
    AlertTriangle,
    Loader2,
    Save,
    Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Compliance: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [_includeUnsubscribe, setIncludeUnsubscribe] = useState(true);
    const [includeBusinessAddress, setIncludeBusinessAddress] = useState(true);
    const [b2bOnlyFilter, setB2bOnlyFilter] = useState(true);
    const [logConsent, setLogConsent] = useState(false);
    const [businessAddress, setBusinessAddress] = useState('');
    const [autoBounceSuppression, setAutoBounceSuppression] = useState(true);
    const [deleteEmail, setDeleteEmail] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [suppressionList, setSuppressionList] = useState<string[]>([]);
    const [showSuppressionModal, setShowSuppressionModal] = useState(false);
    const [activeSection, setActiveSection] = useState('gdpr');

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data } = await supabase
                    .from('profiles')
                    .select('include_unsubscribe, include_business_address, b2b_only_filter, log_consent, business_address, auto_bounce_suppression')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setIncludeUnsubscribe(data.include_unsubscribe ?? true);
                    setIncludeBusinessAddress(data.include_business_address ?? true);
                    setB2bOnlyFilter(data.b2b_only_filter ?? true);
                    setLogConsent(data.log_consent ?? false);
                    setBusinessAddress(data.business_address || '');
                    setAutoBounceSuppression(data.auto_bounce_suppression ?? true);
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

    const handleExportAllLeads = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data, error } = await supabase.from('leads').select('*').eq('user_id', user.id);
            if (error) throw error;
            if (!data || data.length === 0) { alert('No leads to export.'); return; }
            const headers = ['company', 'first_name', 'last_name', 'email', 'phone', 'website', 'location', 'industry', 'source', 'status'];
            const csv = [
                headers.join(','),
                ...data.map(row => headers.map(h => {
                    const val = String((row as any)[h] || '').replace(/"/g, '""');
                    return val.includes(',') || val.includes('"') || val.includes('\n') ? `"${val}"` : val;
                }).join(','))
            ].join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `leadomation-all-leads-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export error:', err);
            alert('Failed to export leads. Please try again.');
        }
    };

    const handleDeleteLeadByEmail = async () => {
        if (!deleteEmail.trim()) return;
        if (!window.confirm(`Permanently delete all data for ${deleteEmail}? This cannot be undone.`)) return;
        setDeleting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { error } = await supabase.from('leads').delete().eq('user_id', user.id).eq('email', deleteEmail.trim().toLowerCase());
            if (error) throw error;
            alert(`Lead data for ${deleteEmail} has been permanently deleted.`);
            setDeleteEmail('');
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete lead. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    const handleViewSuppressionList = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase.from('suppression_list').select('email').eq('user_id', user.id).order('created_at', { ascending: false });
        setSuppressionList(data?.map((r: any) => r.email) || []);
        setShowSuppressionModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            <div className="flex gap-6">

                {/* Left Nav Panel */}
                <div className="w-52 shrink-0">
                    <div className="sticky top-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        {[
                            { id: 'gdpr', label: 'GDPR & Privacy', icon: Shield },
                            { id: 'canspam', label: 'CAN-SPAM', icon: MapPin },
                            { id: 'suppression', label: 'Suppression List', icon: Shield },
                            { id: 'data', label: 'Data Management', icon: Database },
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveSection(id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all border-l-2 ${
                                    activeSection === id
                                        ? 'bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-medium'
                                        : 'text-[#6B7280] border-transparent hover:bg-gray-50 hover:text-[#111827] font-normal'
                                }`}
                            >
                                <Icon size={16} className="shrink-0" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Content Panel */}
                <div className="flex-1 space-y-4">

                    {/* GDPR & Privacy */}
                    {activeSection === 'gdpr' && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <Shield size={18} className="text-[#4F46E5]" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-[#111827]">GDPR & Privacy</h2>
                                    <p className="text-sm text-[#6B7280]">Manage data protection and consent settings</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 opacity-75">
                                    <div>
                                        <p className="text-sm font-medium text-[#111827] flex items-center gap-2">
                                            Include unsubscribe link in every email
                                            <span className="text-[10px] font-medium bg-gray-200 text-gray-500 px-2 py-0.5 rounded">Required</span>
                                        </p>
                                        <p className="text-xs text-[#6B7280] mt-0.5">Automatically appends to your template footer</p>
                                    </div>
                                    <div className="relative w-11 h-6 rounded-full bg-[#4F46E5] cursor-not-allowed">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>

                                {[
                                    { key: 'includeBusinessAddress', value: includeBusinessAddress, setter: setIncludeBusinessAddress, field: 'include_business_address', label: 'Include sender business address in email footer', desc: '' },
                                    { key: 'b2bOnly', value: b2bOnlyFilter, setter: setB2bOnlyFilter, field: 'b2b_only_filter', label: 'B2B only filter', desc: 'Exclude personal addresses like Gmail, Yahoo, etc.' },
                                    { key: 'logConsent', value: logConsent, setter: setLogConsent, field: 'log_consent', label: 'Log consent basis for each lead', desc: '' },
                                ].map(item => (
                                    <div key={item.key} className="flex items-center justify-between p-4 bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50/50 transition-all">
                                        <div>
                                            <p className="text-sm font-medium text-[#111827]">{item.label}</p>
                                            {item.desc && <p className="text-xs text-[#6B7280] mt-0.5">{item.desc}</p>}
                                        </div>
                                        <div
                                            className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${item.value ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}
                                            onClick={() => { const v = !item.value; item.setter(v); saveSettings({ [item.field]: v }); }}
                                        >
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${item.value ? 'translate-x-5' : ''}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => saveSettings({ include_business_address: includeBusinessAddress, b2b_only_filter: b2bOnlyFilter, log_consent: logConsent })}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-all disabled:opacity-50"
                                >
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* CAN-SPAM */}
                    {activeSection === 'canspam' && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                                    <MapPin size={18} className="text-rose-600" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-[#111827]">CAN-SPAM Compliance</h2>
                                    <p className="text-sm text-[#6B7280]">Required for US email compliance</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="text-xs font-medium text-[#6B7280] mb-2 block">Physical mailing address</label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] transition-all resize-none h-24"
                                        placeholder="Business Address 123, Floor 4..."
                                        value={businessAddress}
                                        onChange={e => setBusinessAddress(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-sm font-medium text-[#111827]">Automatic Bounce Suppression</p>
                                        <p className="text-xs text-[#6B7280] mt-0.5">Prevents re-sending to bounced addresses</p>
                                    </div>
                                    <div
                                        className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${autoBounceSuppression ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}
                                        onClick={() => { const v = !autoBounceSuppression; setAutoBounceSuppression(v); saveSettings({ auto_bounce_suppression: v }); }}
                                    >
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${autoBounceSuppression ? 'translate-x-5' : ''}`} />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => saveSettings({ business_address: businessAddress, auto_bounce_suppression: autoBounceSuppression })}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-all disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Suppression List */}
                    {activeSection === 'suppression' && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                    <Shield size={18} className="text-[#6B7280]" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-[#111827]">Suppression List</h2>
                                    <p className="text-sm text-[#6B7280]">Emails that will never be contacted again</p>
                                </div>
                            </div>

                            <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
                                Emails that have unsubscribed, bounced, or been manually suppressed. These addresses will never be contacted again across any campaign.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handleViewSuppressionList}
                                    className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-all"
                                >
                                    <Eye size={14} /> View Full List
                                </button>
                                <input id="suppression-import" type="file" accept=".csv,.txt" className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const text = await file.text();
                                        const emails = text.split(/[\r\n,]+/).map(em => em.trim().toLowerCase()).filter(em => em.includes('@'));
                                        const { data: { user } } = await supabase.auth.getUser();
                                        if (!user || emails.length === 0) return;
                                        const rows = emails.map(email => ({ user_id: user.id, email }));
                                        await supabase.from('suppression_list').upsert(rows, { onConflict: 'user_id,email' });
                                        alert(`${emails.length} emails imported to suppression list.`);
                                    }}
                                />
                                <button
                                    onClick={() => document.getElementById('suppression-import')?.click()}
                                    className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-all"
                                >
                                    <Upload size={14} /> Import Suppression List
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Data Management */}
                    {activeSection === 'data' && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                                    <Database size={18} className="text-rose-600" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-[#111827]">Data Management</h2>
                                    <p className="text-sm text-[#6B7280]">Export and delete lead data</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-sm font-medium text-[#111827]">Full Lead Export</p>
                                        <p className="text-xs text-[#6B7280] mt-0.5">Download all leads as a comprehensive CSV</p>
                                    </div>
                                    <button
                                        onClick={handleExportAllLeads}
                                        className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] bg-white rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-all"
                                    >
                                        <Download size={14} /> Export All Lead Data
                                    </button>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-[#6B7280] mb-2 block">Delete lead by email</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="email"
                                            placeholder="e.g., hans@wellness-spa.de"
                                            value={deleteEmail}
                                            onChange={(e) => setDeleteEmail(e.target.value)}
                                            className="flex-1 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all"
                                        />
                                        <button
                                            onClick={handleDeleteLeadByEmail}
                                            disabled={deleting || !deleteEmail.trim()}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-all disabled:opacity-50"
                                        >
                                            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                            Delete
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <AlertTriangle size={12} className="text-rose-500" />
                                        <p className="text-xs text-rose-600">Deleting a lead removes all associated data permanently. Supports GDPR right-to-erasure.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Banner */}
                    <div className="flex items-start gap-3 px-4 py-3 bg-[#EEF2FF] border border-indigo-100 rounded-xl">
                        <Info size={16} className="text-[#4F46E5] mt-0.5 shrink-0" />
                        <p className="text-xs font-medium text-[#374151] leading-relaxed">
                            Compliance settings help ensure your outreach follows GDPR, CAN-SPAM, and other regulations. The unsubscribe link is required by law and cannot be disabled.
                        </p>
                    </div>
                </div>
            </div>

            {/* Suppression Modal */}
            {showSuppressionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-[#111827]">Suppression List ({suppressionList.length})</h3>
                            <button onClick={() => setShowSuppressionModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
                        </div>
                        {suppressionList.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-8">No suppressed emails yet.</p>
                        ) : (
                            <div className="max-h-80 overflow-y-auto space-y-1">
                                {suppressionList.map(email => (
                                    <div key={email} className="text-sm text-[#4B5563] px-3 py-2 bg-gray-50 rounded-lg">{email}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Compliance;
