import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Download,
    Mail,
    ChevronDown,
    MoreHorizontal,
    Loader2,
    Building,
    X,
    ExternalLink,
    Calendar,
    MapPin,
    Tag,
    Globe
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Lead {
    id: string;
    company: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    location: string;
    industry: string;
    status: string;
    website: string;
    source?: string;
    created_at: string;
    user_id: string;
}

const LeadDatabase: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [isExporting, setIsExporting] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('leads')
                .select('company, email, phone, location, industry, website, status')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!data || data.length === 0) {
                alert('No leads to export');
                return;
            }

            // Create CSV content
            const headers = ['Company', 'Email', 'Phone', 'Location', 'Industry', 'Website', 'Status'];
            const csvRows = [
                headers.join(','),
                ...data.map(lead => [
                    `"${(lead.company || '').replace(/"/g, '""')}"`,
                    `"${(lead.email || '').replace(/"/g, '""')}"`,
                    `"${(lead.phone || '').replace(/"/g, '""')}"`,
                    `"${(lead.location || '').replace(/"/g, '""')}"`,
                    `"${(lead.industry || '').replace(/"/g, '""')}"`,
                    `"${(lead.website || '').replace(/"/g, '""')}"`,
                    `"${(lead.status || '').replace(/"/g, '""')}"`
                ].join(','))
            ];

            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'leadomation-leads.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting leads:', error);
            alert('Error exporting leads. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    useEffect(() => {
        const fetchLeads = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching leads:', error);
            } else {
                setLeads(data || []);
            }
            setIsLoading(false);
        };

        fetchLeads();
    }, []);

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const matchesSearch = (lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.location?.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [leads, searchQuery, statusFilter]);

    const toggleSelectAll = () => {
        if (selectedLeads.length === filteredLeads.length) {
            setSelectedLeads([]);
        } else {
            setSelectedLeads(filteredLeads.map(l => l.id));
        }
    };

    const toggleSelectLead = (id: string) => {
        setSelectedLeads(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const handleUpdateStatus = async (leadId: string, newStatus: string) => {
        setIsUpdatingStatus(true);
        try {
            const { error } = await supabase
                .from('leads')
                .update({ status: newStatus })
                .eq('id', leadId);

            if (error) throw error;

            // Update local state
            setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
            if (selectedLead && selectedLead.id === leadId) {
                setSelectedLead({ ...selectedLead, status: newStatus });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-700">
            {/* Filters and Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <div className="flex items-center w-[400px] bg-white border border-[#E5E7EB] rounded-full px-4 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all group">
                        <Search className="text-[#9CA3AF] group-focus-within:text-primary transition-colors shrink-0" size={18} />
                        <input
                            type="text"
                            placeholder="Search leads by name, email, city..."
                            className="w-full pl-3 pr-2 py-2.5 bg-transparent border-none focus:outline-none text-sm font-medium placeholder:text-[#9CA3AF]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex bg-white border border-[#E5E7EB] rounded-full p-1 shadow-sm">
                            {["All", "New", "Contacted", "Replied", "Qualified", "Not Interested"].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${statusFilter === status
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-[#6B7280] hover:text-[#111827]'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {selectedLeads.length > 0 && (
                        <span className="text-xs font-bold text-primary bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 animate-in zoom-in duration-300">
                            {selectedLeads.length} selected
                        </span>
                    )}
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] bg-white rounded-lg font-bold text-sm text-[#374151] hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isExporting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Download size={16} />
                        )}
                        {isExporting ? 'Exporting...' : 'Export CSV'}
                    </button>
                    <button
                        disabled={selectedLeads.length === 0}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${selectedLeads.length > 0
                            ? 'bg-primary text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-[#9CA3AF] cursor-not-allowed'
                            }`}
                    >
                        <Mail size={16} />
                        Email Selected
                    </button>
                </div>
            </div>

            {/* Main Content: Data Table */}
            <div className="card bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden flex flex-col">
                {filteredLeads.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Building size={32} />
                        </div>
                        <h3 className="text-lg font-black text-[#111827] mb-1">No leads found</h3>
                        <p className="text-sm font-medium text-[#6B7280]">Try adjusting your search or filters, or launch a campaign to generate more.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                    <th className="w-10 px-6 py-4">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-[#D1D5DB] text-primary focus:ring-primary/20"
                                            checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider cursor-pointer group">
                                        <div className="flex items-center gap-1.5">
                                            Company
                                            <ChevronDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Email</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Phone</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Location</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Industry</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Website</th>
                                    <th className="w-10 pr-6 pl-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F4F6]">
                                {filteredLeads.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        className={`group cursor-pointer transition-colors duration-150 ${selectedLeads.includes(lead.id) ? 'bg-[#F0F7FF]' : 'hover:bg-[#F0F7FF]'
                                            }`}
                                        onClick={() => setSelectedLead(lead)}
                                    >
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-[#D1D5DB] text-primary focus:ring-primary/20"
                                                checked={selectedLeads.includes(lead.id)}
                                                onChange={() => toggleSelectLead(lead.id)}
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#111827]">{lead.company || 'N/A'}</span>
                                                <span className="text-[11px] text-[#9CA3AF] font-medium">{lead.first_name} {lead.last_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-[#4B5563]">
                                            {lead.email || 'N/A'}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-[#4B5563]">
                                            {lead.phone || 'N/A'}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-[#4B5563]">
                                            {lead.location || 'N/A'}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-[#4B5563]">
                                            {lead.industry || 'N/A'}
                                        </td>
                                        <td className="px-4 py-4">
                                            {(() => {
                                                const status = lead.status?.toLowerCase() || 'new';
                                                let classes = 'bg-gray-100 text-[#6B7280] border-gray-200'; // Default

                                                if (status === 'new') classes = 'bg-blue-50 text-blue-600 border-blue-100';
                                                else if (status === 'contacted') classes = 'bg-amber-50 text-amber-600 border-amber-100';
                                                else if (status === 'replied') classes = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                                                else if (status === 'qualified') classes = 'bg-purple-50 text-purple-600 border-purple-100';
                                                else if (status === 'lost' || status === 'not interested') classes = 'bg-rose-50 text-rose-600 border-rose-100';

                                                return (
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border ${classes}`}>
                                                        {status.toUpperCase()}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-4 py-4">
                                            {lead.website ? (
                                                <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs font-bold" onClick={(e) => e.stopPropagation()}>
                                                    Link
                                                </a>
                                            ) : (
                                                <span className="text-[#9CA3AF] text-xs">N/A</span>
                                            )}
                                        </td>
                                        <td className="pr-6 pl-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <button className="p-1 hover:bg-gray-100 rounded text-[#9CA3AF] transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Bottom Section: Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-[#E5E7EB] bg-[#F9FAFB]">
                    <span className="text-xs font-bold text-[#9CA3AF]">
                        Showing {filteredLeads.length} of {leads.length} leads
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 border border-[#E5E7EB] bg-white rounded-lg text-xs font-bold text-[#374151] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {[1].map(page => (
                                <button
                                    key={page}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${page === 1 ? 'bg-primary text-white' : 'hover:bg-gray-200 text-[#6B7280]'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button className="px-3 py-1.5 border border-[#E5E7EB] bg-white rounded-lg text-xs font-bold text-[#374151] hover:bg-gray-50 transition-all">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Lead Details Drawer */}
            {selectedLead && (
                <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedLead(null)}></div>
                    <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                        {/* Drawer Header */}
                        <div className="p-8 border-b border-[#F3F4F6] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                    <Building size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-[#111827]">{selectedLead.company}</h2>
                                    <p className="text-sm text-[#6B7280] font-medium">{selectedLead.first_name} {selectedLead.last_name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="p-2 hover:bg-gray-50 rounded-xl text-[#9CA3AF] transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {/* Status Section */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest block pl-1">Lead Status</label>
                                <div className="flex items-center gap-3">
                                    <select
                                        className="flex-1 px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer"
                                        value={selectedLead.status}
                                        onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value)}
                                        disabled={isUpdatingStatus}
                                    >
                                        <option value="New">New</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Replied">Replied</option>
                                        <option value="Qualified">Qualified</option>
                                        <option value="Not Interested">Not Interested</option>
                                    </select>
                                    {isUpdatingStatus && <Loader2 size={18} className="animate-spin text-primary" />}
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                                        <Mail size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Email</span>
                                    </div>
                                    <p className="text-sm font-bold text-[#111827] break-all">{selectedLead.email || 'N/A'}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                                        <Globe size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Website</span>
                                    </div>
                                    {selectedLead.website ? (
                                        <a href={selectedLead.website} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary hover:underline flex items-center gap-1.5">
                                            Visit Site <ExternalLink size={12} />
                                        </a>
                                    ) : (
                                        <p className="text-sm font-bold text-[#111827]">N/A</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                                        <MapPin size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Location</span>
                                    </div>
                                    <p className="text-sm font-bold text-[#111827]">{selectedLead.location || 'N/A'}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                                        <Tag size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Industry</span>
                                    </div>
                                    <p className="text-sm font-bold text-[#111827]">{selectedLead.industry || 'N/A'}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                                        <Calendar size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Created</span>
                                    </div>
                                    <p className="text-sm font-bold text-[#111827]">{selectedLead.created_at ? new Date(selectedLead.created_at).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                                        <Search size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Source</span>
                                    </div>
                                    <p className="text-sm font-bold text-[#111827]">{selectedLead.source || 'Direct'}</p>
                                </div>
                            </div>

                            {/* Actions Header */}
                            <div className="pt-8 border-t border-[#F3F4F6]">
                                <h4 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-6">Engagement History</h4>
                                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                    <p className="text-xs font-bold text-[#6B7280]">No activity recorded yet for this lead.</p>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-8 border-t border-[#F3F4F6] bg-gray-50/50 flex gap-4">
                            <button
                                className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                onClick={() => {
                                    alert(`Starting email sequence for ${selectedLead.company}`);
                                }}
                            >
                                <Mail size={18} />
                                START OUTREACH
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadDatabase;
