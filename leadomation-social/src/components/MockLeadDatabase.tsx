import React from 'react';

const LEADS = [
  { company: 'Thames Valley Plumbing', contact: 'James Morrison', email: 'j.morrison@thamesvalley.co.uk', phone: '+44 20 7946 0823', location: 'London, GB', time: '14:32', status: 'CONTACTED', intent: 'Hot', intentColor: '#EF4444' },
  { company: 'Premier Dental Care', contact: 'Sarah Chen', email: 'sarah@premierdentalcare.co.uk', phone: '+44 161 496 0241', location: 'Manchester, GB', time: '14:32', status: 'QUALIFIED', intent: 'Hot', intentColor: '#EF4444' },
  { company: 'Edinburgh Law Group', contact: 'Robert MacLeod', email: 'r.macleod@ediglawgroup.com', phone: '+44 131 285 3019', location: 'Edinburgh, GB', time: '16:16', status: 'NEW', intent: 'Warm', intentColor: '#F59E0B' },
  { company: 'Bristol Physio & Sports', contact: 'Emma Williams', email: 'ewilliams@bristolphysio.co.uk', phone: '+44 117 946 0534', location: 'Bristol, GB', time: '15:45', status: 'CONTACTED', intent: 'Warm', intentColor: '#F59E0B' },
  { company: 'Leeds Roofing Specialists', contact: 'Mike Thornton', email: 'mike@leedsroofing.co.uk', phone: '+44 113 496 0187', location: 'Leeds, GB', time: '15:45', status: 'NEW', intent: 'Cool', intentColor: '#3B82F6' },
  { company: 'Glasgow Accountants Ltd', contact: 'Fiona Campbell', email: 'f.campbell@glasgowaccts.co.uk', phone: '+44 141 946 0392', location: 'Glasgow, GB', time: '16:16', status: 'NEW', intent: 'Cool', intentColor: '#3B82F6' },
  { company: 'Cardiff Building Services', contact: 'David Evans', email: 'devans@cardiffbuilding.co.uk', phone: '+44 29 2046 0748', location: 'Cardiff, GB', time: '15:45', status: 'CONTACTED', intent: 'Warm', intentColor: '#F59E0B' },
  { company: 'Nottingham HVAC Pro', contact: 'Lisa Parker', email: 'l.parker@nottmhvac.co.uk', phone: '+44 115 946 0265', location: 'Nottingham, GB', time: '15:45', status: 'NEW', intent: 'Unscored', intentColor: '#9CA3AF' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  NEW: { bg: '#F3F4F6', text: '#374151' },
  CONTACTED: { bg: '#EEF2FF', text: '#4F46E5' },
  QUALIFIED: { bg: '#ECFDF5', text: '#10B981' },
};

export const MockLeadDatabase: React.FC<{ highlightRow?: number | null; showIntentFilter?: boolean }> = ({
  highlightRow = null, showIntentFilter = false,
}) => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif', background: '#F8F9FA', borderRadius: 16, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
      <div style={{ width: 170, background: '#FFFFFF', borderRight: '1px solid #E5E7EB', padding: '14px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 14px 14px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: 5, background: 'linear-gradient(135deg, #4F46E5, #22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'white', fontWeight: 900 }}>L</div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>Leadomation</span>
          </div>
        </div>
        {[
          { label: 'Dashboard', icon: '⊞', active: false },
          { label: 'Global Demand', icon: '🌍', active: false },
          { label: 'Active Campaigns', icon: '▶', active: false },
          { label: 'Lead Database', icon: '👥', active: true, badge: '847' },
          { label: 'Deal Pipeline', icon: '📊', active: false, badge: '23' },
          { label: 'Sequence Builder', icon: '⚡', active: false },
          { label: 'Call Agent', icon: '📞', active: false },
          { label: 'Inbox', icon: '📥', active: false, badge: '12' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px', background: item.active ? '#EEF2FF' : 'transparent', borderLeft: item.active ? '3px solid #4F46E5' : '3px solid transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, opacity: 0.6 }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: item.active ? 700 : 400, color: item.active ? '#4F46E5' : '#374151' }}>{item.label}</span>
            </div>
            {(item as any).badge && <div style={{ background: '#4F46E5', color: 'white', borderRadius: 10, padding: '1px 5px', fontSize: 8, fontWeight: 700 }}>{(item as any).badge}</div>}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 50, background: '#F8F9FA', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Lead Database</div>
            <div style={{ fontSize: 10, color: '#6B7280' }}>Manage and track all your leads</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ border: '1px solid #E5E7EB', borderRadius: 7, padding: '4px 10px', fontSize: 10, color: '#374151', background: 'white' }}>↓ Export CSV</div>
            <div style={{ background: '#4F46E5', color: 'white', borderRadius: 7, padding: '4px 10px', fontSize: 10, fontWeight: 600 }}>+ Add Lead</div>
          </div>
        </div>
        <div style={{ padding: '10px 18px 0', background: '#F8F9FA' }}>
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 7, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: '#9CA3AF' }}>🔍</span>
            <span style={{ fontSize: 10, color: '#9CA3AF' }}>Search leads by name, email, company...</span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' as const }}>
            {[
              { label: 'New Business', count: '251', color: '#F59E0B', active: false },
              { label: 'Low Rating', count: '126', color: '#9CA3AF', active: false },
              { label: '🔥 Hot', count: '34', color: '#EF4444', active: showIntentFilter },
              { label: '🌡 Warm', count: '89', color: '#F59E0B', active: false },
              { label: '❄ Cool', count: '127', color: '#3B82F6', active: false },
            ].map((f, i) => (
              <div key={i} style={{ padding: '2px 8px', borderRadius: 100, background: f.active ? f.color + '20' : '#F3F4F6', border: `1px solid ${f.active ? f.color : '#E5E7EB'}`, fontSize: 9, fontWeight: f.active ? 700 : 500, color: f.active ? f.color : '#6B7280' }}>{f.label} ({f.count})</div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', padding: '0 18px 18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '24px 2fr 1.5fr 1fr 0.8fr 0.6fr 0.7fr 0.7fr', padding: '7px 10px', background: 'white', borderRadius: '7px 7px 0 0', borderBottom: '1px solid #F3F4F6' }}>
            {['', 'COMPANY', 'EMAIL', 'PHONE', 'LOCATION', 'TIME', 'STATUS', 'INTENT'].map((h, i) => (
              <div key={i} style={{ fontSize: 8, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.5 }}>{h}</div>
            ))}
          </div>
          {LEADS.map((lead, i) => {
            const statusStyle = STATUS_COLORS[lead.status] || STATUS_COLORS.NEW;
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 2fr 1.5fr 1fr 0.8fr 0.6fr 0.7fr 0.7fr', padding: '8px 10px', background: highlightRow === i ? '#EEF2FF' : (i % 2 === 0 ? 'white' : '#FAFAFA'), borderBottom: '1px solid #F3F4F6', alignItems: 'center' }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, border: '1.5px solid #D1D5DB' }} />
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#111827' }}>{lead.company}</div>
                  <div style={{ fontSize: 9, color: '#9CA3AF' }}>{lead.contact}</div>
                </div>
                <div style={{ fontSize: 9, color: '#6B7280' }}>{lead.email}</div>
                <div style={{ fontSize: 9, color: '#374151' }}>{lead.phone}</div>
                <div style={{ fontSize: 9, color: '#374151' }}>{lead.location}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ fontSize: 9, color: '#374151' }}>{lead.time}</span>
                </div>
                <div style={{ display: 'inline-block', padding: '2px 6px', borderRadius: 4, background: statusStyle.bg, color: statusStyle.text, fontSize: 8, fontWeight: 700 }}>{lead.status}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, padding: '2px 6px', borderRadius: 4, background: lead.intentColor + '20', color: lead.intentColor, fontSize: 8, fontWeight: 700 }}>
                  {lead.intent === 'Hot' ? '🔥' : lead.intent === 'Warm' ? '🌡' : ''} {lead.intent}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
