import React, { useState, useMemo } from 'react';
import {
    Search,
    Download,
    Mail,
    Star,
    ChevronDown,
    MoreHorizontal
} from 'lucide-react';

interface Lead {
    id: string;
    name: string;
    flag: string;
    city: string;
    country: string;
    track: 'Direct' | 'Specifier' | 'Warm';
    contactName: string;
    email: string;
    rating: number;
    status: 'New' | 'Contacted' | 'Replied' | 'Qualified' | 'Not Interested';
    lastActivity: string;
}

const dummyLeads: Lead[] = [
    { id: '1', name: "Wellness Spa Berlin", flag: "🇩🇪", city: "Berlin", country: "Germany", track: 'Direct', contactName: "Hans Müller", email: "hans@wellness-spa.de", rating: 4.8, status: 'Contacted', lastActivity: "2 hours ago" },
    { id: '2', name: "Studio Luxe Interior Design", flag: "🇦🇪", city: "Dubai", country: "UAE", track: 'Specifier', contactName: "Amira Z.", email: "info@studioluxe.ae", rating: 4.5, status: 'New', lastActivity: "5 hours ago" },
    { id: '3', name: "CrossFit Hammersmith", flag: "🇬🇧", city: "London", country: "UK", track: 'Direct', contactName: "James Bond", email: "james@cf-hammersmith.com", rating: 4.2, status: 'Replied', lastActivity: "Yesterday" },
    { id: '4', name: "Arctic Recovery Lounge", flag: "🇸🇪", city: "Stockholm", country: "Sweden", track: 'Warm', contactName: "Sven G.", email: "sven@arctic-recovery.se", rating: 4.9, status: 'Qualified', lastActivity: "1 hour ago" },
    { id: '5', name: "The Ritz-Carlton Spa", flag: "🇶🇦", city: "Doha", country: "Qatar", track: 'Direct', contactName: "Fatima A.", email: "spamanager@ritz-doha.com", rating: 4.7, status: 'Contacted', lastActivity: "3 hours ago" },
    { id: '6', name: "Nordic Architects", flag: "🇩🇰", city: "Copenhagen", country: "Denmark", track: 'Specifier', contactName: "Lars J.", email: "lars@nordic-arch.dk", rating: 4.4, status: 'New', lastActivity: "2 days ago" },
    { id: '7', name: "ColdPlunge Sydney", flag: "🇦🇺", city: "Sydney", country: "Australia", track: 'Warm', contactName: "Mike R.", email: "mike@coldplunge.com.au", rating: 4.1, status: 'Not Interested', lastActivity: "Yesterday" },
    { id: '8', name: "Serenity Wellness", flag: "🇸🇬", city: "Singapore", country: "Singapore", track: 'Direct', contactName: "Lee W.", email: "lee@serenity.sg", rating: 4.6, status: 'New', lastActivity: "4 hours ago" },
    { id: '9', name: "Form Design Studio", flag: "🇺🇸", city: "New York", country: "USA", track: 'Specifier', contactName: "Sarah P.", email: "sarah@formdesign.com", rating: 4.3, status: 'Replied', lastActivity: "3 days ago" },
    { id: '10', name: "FitZone Recovery", flag: "🇬🇧", city: "Manchester", country: "UK", track: 'Direct', contactName: "Tom H.", email: "tom@fitzone.co.uk", rating: 4.0, status: 'Contacted', lastActivity: "6 hours ago" },
    { id: '11', name: "Aman Resort & Spa", flag: "🇮🇩", city: "Bali", country: "Indonesia", track: 'Direct', contactName: "Dewi S.", email: "manager@amanbali.com", rating: 5.0, status: 'Qualified', lastActivity: "Yesterday" },
    { id: '12', name: "IceLab Therapy", flag: "🇳🇴", city: "Oslo", country: "Norway", track: 'Warm', contactName: "Erik K.", email: "erik@icelab.no", rating: 4.5, status: 'Contacted', lastActivity: "Yesterday" },
];

const LeadDatabase: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [trackFilter, setTrackFilter] = useState('All Tracks');
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

    const filteredLeads = useMemo(() => {
        return dummyLeads.filter(lead => {
            const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.city.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
            const matchesTrack = trackFilter === 'All Tracks' || lead.track === trackFilter;
            return matchesSearch && matchesStatus && matchesTrack;
        });
    }, [searchQuery, statusFilter, trackFilter]);

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

                        <div className="w-px h-6 bg-[#E5E7EB] mx-1"></div>

                        <div className="flex bg-white border border-[#E5E7EB] rounded-full p-1 shadow-sm">
                            {["All Tracks", "Direct", "Specifier", "Warm"].map(track => (
                                <button
                                    key={track}
                                    onClick={() => setTrackFilter(track)}
                                    className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${trackFilter === track
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-[#6B7280] hover:text-[#111827]'
                                        }`}
                                >
                                    {track}
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
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] bg-white rounded-lg font-bold text-sm text-[#374151] hover:bg-gray-50 transition-all shadow-sm">
                        <Download size={16} />
                        Export CSV
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
                                        Business Name
                                        <ChevronDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </th>
                                <th className="px-4 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Location</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Track</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Contact</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Rating</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Last Activity</th>
                                <th className="w-10 pr-6 pl-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3F4F6]">
                            {filteredLeads.map((lead) => (
                                <tr
                                    key={lead.id}
                                    className={`group cursor-pointer transition-colors duration-150 ${selectedLeads.includes(lead.id) ? 'bg-[#F0F7FF]' : 'hover:bg-[#F0F7FF]'
                                        }`}
                                    onClick={() => toggleSelectLead(lead.id)}
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
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-[#111827]">{lead.name}</span>
                                            <span className="text-base" title={lead.country}>{lead.flag}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-[#4B5563]">
                                        {lead.city}, {lead.country}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight ${lead.track === 'Direct' ? 'bg-[#EFF6FF] text-[#2563EB]' :
                                            lead.track === 'Specifier' ? 'bg-[#F3E8FF] text-[#7C3AED]' :
                                                'bg-[#FFFBEB] text-[#D97706]'
                                            }`}>
                                            {lead.track}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-[#374151]">{lead.contactName}</span>
                                            <span className="text-[11px] text-[#9CA3AF] font-medium">{lead.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <Star size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
                                            <span className="text-sm font-bold text-[#374151]">{lead.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${lead.status === 'New' ? 'bg-gray-100 text-[#6B7280]' :
                                            lead.status === 'Contacted' ? 'bg-[#EFF6FF] text-[#2563EB]' :
                                                lead.status === 'Replied' ? 'bg-[#ECFDF5] text-[#059669]' :
                                                    lead.status === 'Qualified' ? 'bg-[#D1FAE5] text-[#059669]' :
                                                        'bg-[#FEF2F2] text-[#DC2626]'
                                            }`}>
                                            {lead.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-xs font-medium text-[#9CA3AF]">
                                        {lead.lastActivity}
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

                {/* Bottom Section: Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-[#E5E7EB] bg-[#F9FAFB]">
                    <span className="text-xs font-bold text-[#9CA3AF]">
                        Showing 1-{filteredLeads.length} of 2,847 leads
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 border border-[#E5E7EB] bg-white rounded-lg text-xs font-bold text-[#374151] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3].map(page => (
                                <button
                                    key={page}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${page === 1 ? 'bg-primary text-white' : 'hover:bg-gray-200 text-[#6B7280]'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <span className="text-[#9CA3AF] px-1 px-1">...</span>
                            <button className="w-8 h-8 rounded-lg text-xs font-bold hover:bg-gray-200 text-[#6B7280]">238</button>
                        </div>
                        <button className="px-3 py-1.5 border border-[#E5E7EB] bg-white rounded-lg text-xs font-bold text-[#374151] hover:bg-gray-50 transition-all">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDatabase;
