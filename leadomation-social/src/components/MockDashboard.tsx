import React from 'react';

interface SidebarItem {
  icon: string;
  label: string;
  active?: boolean;
  badge?: string;
}

interface SidebarSection {
  section: string;
  items: SidebarItem[];
}

const SIDEBAR_ITEMS: SidebarSection[] = [
  { section: 'MAIN', items: [
    { icon: '⊞', label: 'Dashboard', active: true },
    { icon: '🌍', label: 'Global Demand' },
  ]},
  { section: 'CAMPAIGNS', items: [
    { icon: '+', label: 'New Campaign' },
    { icon: '▶', label: 'Active Campaigns' },
  ]},
  { section: 'LEADS', items: [
    { icon: '👥', label: 'Lead Database', badge: '847' },
  ]},
  { section: 'CRM', items: [
    { icon: '📊', label: 'Deal Pipeline', badge: '23' },
  ]},
  { section: 'OUTREACH', items: [
    { icon: '⚡', label: 'Sequence Builder' },
    { icon: '📞', label: 'Call Agent' },
    { icon: '📥', label: 'Inbox', badge: '12' },
    { icon: '📧', label: 'Email Templates' },
  ]},
];

const STAT_CARDS = [
  { label: 'Total Leads', value: '847', change: '+124 in last 30 days', color: '#22D3EE', icon: '👥' },
  { label: 'Leads with Emails', value: '612', change: '+89 verified emails', color: '#4F46E5', icon: '✉️' },
  { label: 'Leads Contacted', value: '234', change: '+67 outreach initiated', color: '#8B5CF6', icon: '💬' },
  { label: 'Total Deals', value: '£47,200', change: '+£12,400 in pipeline', color: '#10B981', icon: '📈' },
];

const TOP_CAMPAIGNS = [
  { name: 'Plumbers in London', rate: '34%', color: '#10B981' },
  { name: 'Solicitors in Manchester', rate: '28%', color: '#4F46E5' },
  { name: 'Dentists in Birmingham', rate: '22%', color: '#22D3EE' },
  { name: 'Physios in Edinburgh', rate: '19%', color: '#8B5CF6' },
];

interface Props {
  highlightFeature?: 'stats' | 'campaigns' | 'pipeline' | null;
}

export const MockDashboard: React.FC<Props> = ({ highlightFeature = null }) => {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      fontFamily: 'Inter, system-ui, sans-serif',
      background: '#F8F9FA', borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
    }}>
      <div style={{ width: 200, background: '#FFFFFF', borderRight: '1px solid #E5E7EB', padding: '20px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px 20px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, #4F46E5, #22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'white', fontWeight: 900 }}>L</div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Leadomation</span>
        </div>
        <div style={{ padding: '8px 0' }}>
          {SIDEBAR_ITEMS.map((section, si) => (
            <div key={si}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, padding: '12px 16px 4px', textTransform: 'uppercase' as const }}>{section.section}</div>
              {section.items.map((item, ii) => (
                <div key={ii} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 16px', background: item.active ? '#EEF2FF' : 'transparent', borderLeft: item.active ? '3px solid #4F46E5' : '3px solid transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, opacity: 0.7 }}>{item.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: item.active ? 600 : 400, color: item.active ? '#4F46E5' : '#374151' }}>{item.label}</span>
                  </div>
                  {(item as any).badge && (
                    <div style={{ background: '#4F46E5', color: 'white', borderRadius: 10, padding: '1px 6px', fontSize: 9, fontWeight: 700 }}>{(item as any).badge}</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ height: 56, background: '#F8F9FA', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Dashboard</div>
            <div style={{ fontSize: 11, color: '#6B7280' }}>Overview of your outreach performance</div>
          </div>
          <div style={{ background: '#4F46E5', color: 'white', borderRadius: 8, padding: '7px 16px', fontSize: 12, fontWeight: 600 }}>+ New Campaign</div>
        </div>
        <div style={{ flex: 1, padding: 20, overflow: 'hidden' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Good afternoon, Sarah 👋</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>Friday, 20 March 2026 · 3 campaigns running · 12 new replies today</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            {STAT_CARDS.map((card, i) => (
              <div key={i} style={{ background: '#FFFFFF', borderRadius: 12, padding: '14px 16px', border: highlightFeature === 'stats' ? `2px solid ${card.color}` : '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 500, color: '#6B7280' }}>{card.label}</div>
                  <div style={{ fontSize: 16 }}>{card.icon}</div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 4 }}>{card.value}</div>
                <div style={{ fontSize: 10, color: card.color, fontWeight: 500 }}>↑ {card.change}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 12 }}>
            <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Campaign Performance</div>
              <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 12 }}>Last 14 days</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
                {[40,65,45,80,55,90,70,85,60,95,75,88,72,92].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', height: h * 0.7, background: i >= 10 ? 'linear-gradient(180deg, #4F46E5, #22D3EE)' : '#EEF2FF', borderRadius: 3 }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
                {[{label:'TOTAL LEADS',value:'847'},{label:'CONTACTED',value:'234'},{label:'QUALIFIED',value:'67'},{label:'DEALS',value:'23'}].map((s,i) => (
                  <div key={i} style={{ textAlign: 'center' as const }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>{s.value}</div>
                    <div style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#FFFFFF', borderRadius: 12, border: highlightFeature === 'campaigns' ? '2px solid #4F46E5' : '1px solid #E5E7EB', padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Top Performing Campaigns</div>
              {TOP_CAMPAIGNS.map((c, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>{c.name}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: c.color }}>{c.rate}</div>
                  </div>
                  <div style={{ height: 4, background: '#F3F4F6', borderRadius: 2 }}>
                    <div style={{ height: '100%', borderRadius: 2, background: c.color, width: c.rate }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
