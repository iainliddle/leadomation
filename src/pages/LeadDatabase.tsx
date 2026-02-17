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
    Globe,
    Trash2,
    Plus,
    Wand2,
    Linkedin,
    Save
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
    job_title?: string;
    linkedin_url?: string;
    source?: string;
    created_at: string;
    user_id: string;
}

interface LeadDatabaseProps {
    onPageChange?: (page: string) => void;
}

const LeadDatabase: React.FC<LeadDatabaseProps> = ({ onPageChange }) => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [isExporting, setIsExporting] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [enrichingLeads, setEnrichingLeads] = useState<string[]>([]);

    // Add Lead Form State
    const [newLead, setNewLead] = useState({
        company: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        location: '',
        industry: '',
        website: '',
        job_title: '',
        linkedin_url: '',
        status: 'New'
    });

    const fetchLeads = async () => {
        setIsLoading(true);
        try {
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
        } catch (error) {
            console.error('Error in fetchLeads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const matchesSearch = lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.location?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'All'
                ? true
                : statusFilter === 'Lost'
                    ? (lead.status === 'Lost' || lead.status === 'Not Interested')
                    : lead.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [leads, searchQuery, statusFilter]);

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

    const handleDeleteLead = async (leadId: string) => {
        if (!window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('leads')
                .delete()
                .eq('id', leadId);

            if (error) throw error;

            setLeads(prev => prev.filter(l => l.id !== leadId));
            setSelectedLead(null);
        } catch (error) {
            console.error('Error deleting lead:', error);
            alert('Failed to delete lead');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEnrichLead = async (leadId: string) => {
        console.log('Enrich lead:', leadId);
        setEnrichingLeads(prev => [...prev, leadId]);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setEnrichingLeads(prev => prev.filter(id => id !== leadId));
        alert('Enrichment simulation complete. Job title and social data would be updated here via API.');
    };

    const handleSaveLead = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('leads')
                .insert({
                    ...newLead,
                    user_id: user.id
                });

            if (error) throw error;

            await fetchLeads();
            setIsAddModalOpen(false);
            setNewLead({
                company: '',
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                location: '',
                industry: '',
                website: '',
                job_title: '',
                linkedin_url: '',
                status: 'New'
            });
        } catch (error) {
            console.error('Error saving lead:', error);
            alert('Failed to save lead. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading && leads.length === 0) {
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
                        <div className="flex items-center bg-white border border-[#E5E7EB] rounded-full px-4 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all group h-[42px]">
                            <Tag className="text-[#9CA3AF] group-focus-within:text-primary transition-colors shrink-0" size={16} />
                            <select
                                className="pl-3 pr-8 py-2 bg-transparent border-none focus:outline-none text-sm font-bold text-[#374151] appearance-none cursor-pointer"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Statuses</option>
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Replied">Replied</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Lost">Lost / Not Interested</option>
                            </select>
                            <ChevronDown className="text-[#9CA3AF] -ml-6 pointer-events-none group-focus-within:text-primary transition-colors" size={14} />
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
                        {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        {isExporting ? 'Exporting...' : 'Export CSV'}
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-sm active:transform active:scale-95"
                    >
                        <Plus size={16} />
                        Add Lead
                    </button>
                    <button
                        disabled={selectedLeads.length === 0}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${selectedLeads.length > 0
                            ? 'bg-white border border-primary text-primary hover:bg-blue-50'
                            : 'bg-gray-100 text-[#9CA3AF] cursor-not-allowed'
                            }`}
                        onClick={() => selectedLeads.length > 0 && alert(`Emailing ${selectedLeads.length} leads...`)}
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
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-[#111827]">{lead.company || 'N/A'}</span>
                                                    {lead.job_title && (
                                                        <span className="px-1.5 py-0.5 bg-blue-50 text-[9px] font-black text-primary border border-blue-100 rounded uppercase tracking-tighter">
                                                            Enriched
                                                        </span>
                                                    )}
                                                </div>
                                                {lead.job_title && (
                                                    <span className="text-[11px] text-primary font-bold leading-none">{lead.job_title}</span>
                                                )}
                                                <span className="text-[11px] text-[#9CA3AF] font-medium leading-none">
                                                    {(lead.first_name || lead.last_name) ? `${lead.first_name} ${lead.last_name}` : 'Unknown Contact'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-[#4B5563]">
                                            <div className="flex items-center gap-2">
                                                {lead.email || 'N/A'}
                                                {lead.linkedin_url && (
                                                    <a
                                                        href={lead.linkedin_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:text-blue-700 transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Linkedin size={14} />
                                                    </a>
                                                )}
                                            </div>
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
                                                let classes = 'bg-gray-100 text-[#6B7280] border-gray-200';

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
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEnrichLead(lead.id)}
                                                    disabled={enrichingLeads.includes(lead.id)}
                                                    className={`p-2 rounded-lg transition-all ${enrichingLeads.includes(lead.id) ? 'bg-blue-50 text-primary' : 'hover:bg-gray-100 text-[#9CA3AF] hover:text-primary'}`}
                                                    title="Enrich Lead"
                                                >
                                                    {enrichingLeads.includes(lead.id) ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                                                </button>
                                                <button className="p-1 hover:bg-gray-100 rounded text-[#9CA3AF] transition-colors">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>
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
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-xl font-black text-[#111827]">{selectedLead.company}</h2>
                                        {selectedLead.job_title && (
                                            <span className="px-2 py-0.5 bg-blue-50 text-[10px] font-black text-primary border border-blue-100 rounded-lg uppercase tracking-wider">
                                                Enriched
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-primary font-bold">{selectedLead.job_title || 'No Job Title'}</p>
                                        <span className="text-gray-300">•</span>
                                        <p className="text-sm text-[#6B7280] font-medium">{selectedLead.first_name} {selectedLead.last_name}</p>
                                    </div>
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
                                        <Linkedin size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">LinkedIn</span>
                                    </div>
                                    {selectedLead.linkedin_url ? (
                                        <a href={selectedLead.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary hover:underline flex items-center gap-1.5">
                                            View Profile <ExternalLink size={12} />
                                        </a>
                                    ) : (
                                        <p className="text-sm font-bold text-[#111827]">N/A</p>
                                    )}
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
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-8 border-t border-[#F3F4F6] bg-gray-50/50 flex flex-col gap-4">
                            <button
                                className={`w-full py-4 rounded-2xl font-black text-sm shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${enrichingLeads.includes(selectedLead.id) ? 'bg-blue-50 text-primary shadow-blue-500/5' : 'bg-white border border-[#E5E7EB] text-primary hover:bg-blue-50 shadow-blue-500/10'}`}
                                onClick={() => handleEnrichLead(selectedLead.id)}
                                disabled={enrichingLeads.includes(selectedLead.id)}
                            >
                                {enrichingLeads.includes(selectedLead.id) ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                                {enrichingLeads.includes(selectedLead.id) ? 'ENRICHING LEAD...' : 'ENRICH LEAD DATA'}
                            </button>

                            <button
                                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                onClick={() => {
                                    alert(`Starting email sequence for ${selectedLead.company}`);
                                }}
                            >
                                <Mail size={18} />
                                START OUTREACH
                            </button>

                            <button
                                className="w-full py-4 border border-rose-100 bg-white text-rose-600 rounded-2xl font-black text-sm hover:bg-rose-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                                onClick={() => handleDeleteLead(selectedLead.id)}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Trash2 size={18} />
                                )}
                                DELETE LEAD
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Lead Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-[#111827]">Add New Lead</h3>
                                <p className="text-sm font-medium text-gray-400">Enter lead details manually into your database</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveLead} className="flex-1 overflow-y-auto p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Company Name *</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Acme Corp"
                                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        value={newLead.company}
                                        onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Lead Status</label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                                        value={newLead.status}
                                        onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                                    >
                                        <option value="New">New</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Replied">Replied</option>
                                        <option value="Qualified">Qualified</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Job Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. CEO"
                                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        value={newLead.job_title}
                                        onChange={(e) => setNewLead({ ...newLead, job_title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">LinkedIn URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://linkedin.com/in/..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        value={newLead.linkedin_url}
                                        onChange={(e) => setNewLead({ ...newLead, linkedin_url: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. John"
                                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        value={newLead.first_name}
                                        onChange={(e) => setNewLead({ ...newLead, first_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Doe"
                                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        value={newLead.last_name}
                                        onChange={(e) => setNewLead({ ...newLead, last_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        value={newLead.email}
                                        onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+1 234 567 890"
                                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        value={newLead.phone}
                                        onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="e.g. London, UK"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                            value={newLead.location}
                                            onChange={(e) => setNewLead({ ...newLead, location: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Industry</label>
                                    <div className="relative">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="e.g. Software"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                            value={newLead.industry}
                                            onChange={(e) => setNewLead({ ...newLead, industry: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Website URL</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="url"
                                            placeholder="https://example.com"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                            value={newLead.website}
                                            onChange={(e) => setNewLead({ ...newLead, website: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
                                <Search size={20} className="text-primary mt-1" />
                                <div className="flex-1">
                                    <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">PRO TIP</p>
                                    <p className="text-xs text-[#1e40af] font-medium leading-relaxed">
                                        You can also import leads in bulk via CSV or use our Search filters and click "Save to CRM" from the Global Demand Intel view to automatically sync decision makers.
                                    </p>
                                </div>
                            </div>
                        </form>
                        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex gap-4">
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="flex-1 py-4 border border-[#E5E7EB] bg-white text-[#111827] rounded-2xl font-black text-sm hover:bg-gray-50 transition-all active:scale-95"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={handleSaveLead}
                                disabled={isSaving || !newLead.company}
                                className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                SAVE LEAD
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadDatabase;
