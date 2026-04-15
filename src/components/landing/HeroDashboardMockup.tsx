import { useEffect, useState, type ReactElement, type CSSProperties } from 'react'

type IconProps = { color?: string; size?: number }

const Icon = {
  LayoutDashboard: ({ color = 'currentColor', size = 11 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
  ),
  Globe: ({ color = 'currentColor', size = 11 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
  ),
  Plus: ({ color = 'currentColor', size = 11 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Activity: ({ color = 'currentColor', size = 11 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  ),
  Users: ({ color = 'currentColor', size = 11 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
  ),
  Kanban: ({ color = 'currentColor', size = 11 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7v7"/><path d="M12 7v4"/><path d="M16 7v10"/></svg>
  ),
  Calendar: ({ color = 'currentColor', size = 11 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  ),
  Mail: ({ color = 'currentColor', size = 11 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  ),
  Search: ({ color = 'currentColor', size = 11 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  Phone: ({ color = 'currentColor', size = 11 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.18 19.79 19.79 0 012.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.45-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
  ),
  MessageSquare: ({ color = 'currentColor', size = 11 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
  ),
}

type SidebarItem = {
  label: string
  icon: ReactElement
  badge?: string
  screenIdx?: number
}

type SidebarSection = {
  heading: string
  items: SidebarItem[]
}

const SIDEBAR: SidebarSection[] = [
  {
    heading: 'MAIN',
    items: [
      { label: 'Dashboard', icon: <Icon.LayoutDashboard />, screenIdx: 0 },
      { label: 'Global Demand', icon: <Icon.Globe /> },
    ],
  },
  {
    heading: 'CAMPAIGNS',
    items: [
      { label: 'New Campaign', icon: <Icon.Plus /> },
      { label: 'Active Campaigns', icon: <Icon.Activity /> },
    ],
  },
  {
    heading: 'LEADS',
    items: [
      { label: 'Lead Database', icon: <Icon.Users />, badge: '271', screenIdx: 1 },
    ],
  },
  {
    heading: 'CRM',
    items: [
      { label: 'Deal Pipeline', icon: <Icon.Kanban />, badge: '10' },
      { label: 'Calendar', icon: <Icon.Calendar /> },
    ],
  },
  {
    heading: 'OUTREACH',
    items: [
      { label: 'Sequence Builder', icon: <Icon.Mail />, screenIdx: 2 },
      { label: 'Keyword Monitor', icon: <Icon.Search /> },
      { label: 'Call Agent', icon: <Icon.Phone /> },
      { label: 'Inbox', icon: <Icon.MessageSquare />, badge: '12' },
    ],
  },
]

const URLS = [
  'app.leadomation.co.uk/dashboard',
  'app.leadomation.co.uk/leads',
  'app.leadomation.co.uk/sequences',
]

const CURSOR_POSITIONS = [
  { top: 52, left: 20 },
  { top: 148, left: 20 },
  { top: 196, left: 20 },
]

function Sparkline({ color, data }: { color: string; data: number[] }): ReactElement {
  const max = Math.max(...data)
  const w = 60
  const h = 16
  const step = w / (data.length - 1)
  const points = data.map((v, i) => `${i * step},${h - (v / max) * h}`).join(' ')
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MiniBars({ color }: { color: string }): ReactElement {
  const heights = [6, 10, 7, 12, 9, 14, 11]
  return (
    <svg width={60} height={16}>
      {heights.map((h, i) => (
        <rect key={i} x={i * 9} y={16 - h} width={6} height={h} rx={1} fill={color} />
      ))}
    </svg>
  )
}

function DashboardScreen(): ReactElement {
  const statCards = [
    { iconBg: '#CFFAFE', iconColor: '#06B6D4', label: 'Total Leads', value: '271', delta: '+8%', sparkColor: '#22D3EE', type: 'bars' as const },
    { iconBg: '#DCFCE7', iconColor: '#10B981', label: 'Leads with Emails', value: '31', delta: '+12%', sparkColor: '#10B981', type: 'line' as const, data: [4, 7, 6, 9, 8, 11, 10] },
    { iconBg: '#F3E8FF', iconColor: '#8B5CF6', label: 'Leads Contacted', value: '0', delta: '0%', sparkColor: '#8B5CF6', type: 'line' as const, data: [1, 1, 2, 2, 3, 2, 3] },
    { iconBg: '#FEE2E2', iconColor: '#F43F5E', label: 'Total Deals', value: '10', delta: '+3%', sparkColor: '#F43F5E', type: 'line' as const, data: [2, 3, 4, 5, 6, 7, 8] },
  ]

  return (
    <div style={{ padding: '10px 12px', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>Good evening, Iain 👋</div>
        <div style={{ fontSize: '7px', color: '#6b7280' }}>Friday, 4 Apr 2026 · Let's make today count.</div>
      </div>

      <div style={{ display: 'flex', gap: '6px' }}>
        {statCards.map((c, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 6, border: '1px solid #e5e7eb', padding: '6px 8px', flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 5, height: 5, borderRadius: 1, background: c.iconColor }} />
              </div>
              <div style={{ fontSize: 7, color: '#6b7280', fontWeight: 500 }}>{c.label}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 3 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{c.value}</div>
              <div style={{ fontSize: 6, fontWeight: 600, color: '#10B981' }}>{c.delta}</div>
            </div>
            {c.type === 'bars' ? <MiniBars color={c.sparkColor} /> : <Sparkline color={c.sparkColor} data={c.data!} />}
          </div>
        ))}
        <div style={{ background: 'linear-gradient(135deg,#EEF2FF 0%,#E0E7FF 100%)', borderRadius: 6, border: '1px solid #c7d2fe', padding: '6px 8px', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 6, fontWeight: 700, color: '#4F46E5', letterSpacing: '0.05em' }}>CURRENT PLAN</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>Pro</div>
          <div style={{ fontSize: 6, fontWeight: 600, color: 'white', background: '#4F46E5', borderRadius: 3, padding: '2px 5px', alignSelf: 'flex-start' }}>Manage plan</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: '0 0 60%', background: 'white', borderRadius: 6, border: '1px solid #e5e7eb', padding: '8px 10px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Campaign Performance</div>
          <div style={{ fontSize: 6, color: '#94a3b8', marginBottom: 4 }}>Last 14 days</div>
          <svg viewBox="0 0 220 70" preserveAspectRatio="none" style={{ width: '100%', flex: 1 }}>
            <defs>
              <linearGradient id="gIndigo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="gCyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="gEmerald" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* gridlines */}
            {[0, 1, 2, 3].map(i => (
              <line key={i} x1="0" y1={10 + i * 15} x2="220" y2={10 + i * 15} stroke="#f1f5f9" strokeWidth="0.5" />
            ))}
            {/* indigo */}
            <path d="M0,45 L17,38 L34,42 L51,30 L68,34 L85,22 L102,28 L119,18 L136,24 L153,14 L170,20 L187,12 L204,18 L220,10 L220,70 L0,70 Z" fill="url(#gIndigo)" />
            <path d="M0,45 L17,38 L34,42 L51,30 L68,34 L85,22 L102,28 L119,18 L136,24 L153,14 L170,20 L187,12 L204,18 L220,10" fill="none" stroke="#4F46E5" strokeWidth="1.5" strokeLinejoin="round" />
            {/* cyan */}
            <path d="M0,55 L17,50 L34,52 L51,44 L68,46 L85,38 L102,42 L119,32 L136,36 L153,28 L170,32 L187,24 L204,28 L220,22 L220,70 L0,70 Z" fill="url(#gCyan)" />
            <path d="M0,55 L17,50 L34,52 L51,44 L68,46 L85,38 L102,42 L119,32 L136,36 L153,28 L170,32 L187,24 L204,28 L220,22" fill="none" stroke="#22D3EE" strokeWidth="1.5" strokeLinejoin="round" />
            {/* emerald */}
            <path d="M0,60 L17,58 L34,56 L51,54 L68,52 L85,48 L102,46 L119,42 L136,40 L153,38 L170,34 L187,32 L204,30 L220,28 L220,70 L0,70 Z" fill="url(#gEmerald)" />
            <path d="M0,60 L17,58 L34,56 L51,54 L68,52 L85,48 L102,46 L119,42 L136,40 L153,38 L170,34 L187,32 L204,30 L220,28" fill="none" stroke="#10B981" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 5, color: '#94a3b8', marginTop: 2 }}>
            {['22 Mar', '25', '28', '31', '3 Apr', '6', '9', '12'].map((d, i) => <span key={i}>{d}</span>)}
          </div>
        </div>

        <div style={{ flex: '0 0 38%', background: 'white', borderRadius: 6, border: '1px solid #e5e7eb', padding: '8px 10px' }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Top Performing Campaigns</div>
          {[
            { name: 'Dental Clinics - LinkedIn', pct: '8.74%', bar: 87, color: '#4F46E5', status: 'ACTIVE' },
            { name: 'Law Firms - Full Pipeline', pct: '11.22%', bar: 92, color: '#10B981', status: 'ACTIVE' },
            { name: 'Plumbers in Edinburgh', pct: '6%', bar: 55, color: '#4F46E5', status: 'PAUSED' },
            { name: 'Solicitors in Edinburgh', pct: '8%', bar: 68, color: '#4F46E5', status: 'ACTIVE' },
          ].map((c, i) => (
            <div key={i} style={{ marginBottom: 5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <div style={{ fontSize: 6, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{c.name}</div>
                <div style={{ fontSize: 6, fontWeight: 700, color: c.color, marginLeft: 4 }}>{c.pct}</div>
              </div>
              <div style={{ height: 3, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${c.bar}%`, background: c.color, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LeadsScreen(): ReactElement {
  const rows = [
    { company: 'Dunmore Dental Care', role: 'Practice Owner', email: 'kate@dunmore...', phone: '+44 1732 441 188', location: 'Kent', status: 'CONTACTED', statusColor: '#10B981', statusBg: '#DCFCE7', intent: 'Warm 63', intentColor: '#F59E0B', intentBg: '#FEF3C7' },
    { company: 'Smile Clinic Northwest', role: 'Clinical Director', email: 'amir@smileclinic...', phone: '+44 207 734 5566', location: 'London', status: 'REPLIED', statusColor: '#10B981', statusBg: '#DCFCE7', intent: 'Hot 95', intentColor: '#EF4444', intentBg: '#FEE2E2' },
    { company: 'Bright Smile Kent', role: 'Practice Owner', email: 's.gallagher@bright...', phone: '+44 1622 678 900', location: 'Kent', status: 'CONTACTED', statusColor: '#10B981', statusBg: '#DCFCE7', intent: 'Hot 76', intentColor: '#EF4444', intentBg: '#FEE2E2' },
    { company: 'London Smile Studio', role: 'Clinical Director', email: 'paul@londonsmile...', phone: '+44 207 836 4422', location: 'London', status: 'REPLIED', statusColor: '#10B981', statusBg: '#DCFCE7', intent: 'Hot 92', intentColor: '#EF4444', intentBg: '#FEE2E2' },
    { company: 'Owen Dental Group', role: 'Practice Director', email: 'lewis@owendental...', phone: '+44 208 445 6677', location: 'London', status: 'CONTACTED', statusColor: '#10B981', statusBg: '#DCFCE7', intent: 'Hot 80', intentColor: '#EF4444', intentBg: '#FEE2E2' },
    { company: 'Surrey Dental Specialists', role: 'Practice Manager', email: 'nina@surrey...', phone: '+44 1483 445 211', location: 'Surrey', status: 'CONTACTED', statusColor: '#10B981', statusBg: '#DCFCE7', intent: 'Warm 71', intentColor: '#F59E0B', intentBg: '#FEF3C7' },
  ]

  return (
    <div style={{ padding: '10px 12px', height: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>Lead Database</div>
          <div style={{ fontSize: 7, color: '#6b7280' }}>Manage and track all your leads</div>
        </div>
        <div style={{ fontSize: 7, fontWeight: 600, color: 'white', background: '#4F46E5', borderRadius: 4, padding: '3px 8px' }}>+ Add Lead</div>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {[
          { label: 'New Business (271)', active: true },
          { label: 'Hot (11)' },
          { label: 'Warm (9)' },
          { label: 'Cool (0)' },
        ].map((t, i) => (
          <div key={i} style={{
            fontSize: 6,
            fontWeight: 600,
            padding: '3px 7px',
            borderRadius: 999,
            background: t.active ? '#EEF2FF' : 'white',
            color: t.active ? '#4F46E5' : '#64748b',
            border: `1px solid ${t.active ? '#c7d2fe' : '#e5e7eb'}`,
          }}>{t.label}</div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 6, border: '1px solid #e5e7eb', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr 1.2fr 0.8fr 0.9fr 0.9fr', gap: 6, padding: '5px 8px', borderBottom: '1px solid #f1f5f9', fontSize: 6, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em' }}>
          <div>COMPANY</div><div>EMAIL</div><div>PHONE</div><div>LOCATION</div><div>STATUS</div><div>INTENT</div>
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr 1.2fr 0.8fr 0.9fr 0.9fr', gap: 6, padding: '5px 8px', borderBottom: i < rows.length - 1 ? '1px solid #f8fafc' : 'none', fontSize: 7, alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 7 }}>{r.company}</div>
              <div style={{ color: '#94a3b8', fontSize: 5 }}>{r.role}</div>
            </div>
            <div style={{ color: '#64748b', fontSize: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.email}</div>
            <div style={{ color: '#64748b', fontSize: 6 }}>{r.phone}</div>
            <div style={{ color: '#64748b', fontSize: 6 }}>{r.location}</div>
            <div>
              <span style={{ fontSize: 5, fontWeight: 700, color: r.statusColor, background: r.statusBg, borderRadius: 3, padding: '1px 4px' }}>{r.status}</span>
            </div>
            <div>
              <span style={{ fontSize: 5, fontWeight: 700, color: r.intentColor, background: r.intentBg, borderRadius: 3, padding: '1px 4px' }}>{r.intent}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SequenceScreen(): ReactElement {
  const steps = [
    { day: 'Day 0', subject: 'Quick question about {{business_name}}', accent: '#4F46E5', status: 'Sent', statusColor: '#10B981', statusBg: '#DCFCE7' },
    { day: 'Day 3', subject: 'Following up on my last email', accent: '#3B82F6', status: 'Opened', statusColor: '#F59E0B', statusBg: '#FEF3C7' },
    { day: 'Day 7', subject: 'One last nudge from the team', accent: '#22D3EE', status: 'Scheduled', statusColor: '#64748b', statusBg: '#f1f5f9' },
    { day: 'Day 14', subject: 'Trying a different angle...', accent: '#06B6D4', status: 'Scheduled', statusColor: '#64748b', statusBg: '#f1f5f9' },
  ]

  return (
    <div style={{ padding: '10px 12px', height: '100%', display: 'flex', flexDirection: 'column', gap: 7 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>Sequence Builder</div>
        <div style={{ fontSize: 7, color: '#6b7280' }}>Build your outreach sequence</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 5, border: '1px solid #e5e7eb', borderLeft: `3px solid ${s.accent}`, padding: '6px 9px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 6, fontWeight: 700, color: s.accent, background: `${s.accent}15`, borderRadius: 3, padding: '2px 5px', flexShrink: 0 }}>{s.day}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 7, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.subject}</div>
              <div style={{ fontSize: 5, color: '#94a3b8' }}>Step {i + 1} of 4</div>
            </div>
            <div style={{ fontSize: 5, fontWeight: 700, color: s.statusColor, background: s.statusBg, borderRadius: 3, padding: '2px 5px', flexShrink: 0 }}>{s.status}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, background: 'white', borderRadius: 5, border: '1px solid #e5e7eb', padding: '6px 9px' }}>
        {[
          { label: 'Sent', value: '847', color: '#0f172a' },
          { label: 'Opens', value: '34.2%', color: '#10B981' },
          { label: 'Replies', value: '12.8%', color: '#4F46E5' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 5, color: '#94a3b8', marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const CursorArrow = ({ style }: { style?: CSSProperties }): ReactElement => (
  <svg width="14" height="14" viewBox="0 0 24 24" style={style}>
    <path d="M5.5 3.5 L5.5 20 L10 15.5 L13 22 L15.5 20.8 L12.5 14.5 L19 14.5 Z" fill="white" stroke="#0f172a" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
)

export default function HeroDashboardMockup(): ReactElement {
  const [activeScreen, setActiveScreen] = useState(0)
  const [cursorIdx, setCursorIdx] = useState(0)
  const [ripple, setRipple] = useState(false)

  useEffect(() => {
    const timers: Array<ReturnType<typeof setTimeout>> = []

    const schedule = () => {
      // screen 0 → cursor to leads at 3.5s, click at 4s
      timers.push(setTimeout(() => setCursorIdx(1), 3500))
      timers.push(setTimeout(() => { setRipple(true); setActiveScreen(1); setTimeout(() => setRipple(false), 400) }, 4000))
      // screen 1 → cursor to sequence at 7.5s, click at 8s
      timers.push(setTimeout(() => setCursorIdx(2), 7500))
      timers.push(setTimeout(() => { setRipple(true); setActiveScreen(2); setTimeout(() => setRipple(false), 400) }, 8000))
      // screen 2 → cursor back to dashboard at 11.5s, click at 12s
      timers.push(setTimeout(() => setCursorIdx(0), 11500))
      timers.push(setTimeout(() => { setRipple(true); setActiveScreen(0); setTimeout(() => setRipple(false), 400) }, 12000))
    }

    schedule()
    const interval = setInterval(schedule, 12000)

    return () => {
      clearInterval(interval)
      timers.forEach(clearTimeout)
    }
  }, [])

  const cursorPos = CURSOR_POSITIONS[cursorIdx]

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      borderRadius: 8,
      overflow: 'hidden',
      fontFamily: 'Switzer, sans-serif',
    }}>
      {/* Browser chrome */}
      <div style={{
        height: 22,
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        gap: 8,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF5F57' }} />
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#FEBC2E' }} />
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#28C840' }} />
        </div>
        <div style={{
          flex: 1,
          maxWidth: 260,
          margin: '0 auto',
          background: '#f1f5f9',
          borderRadius: 4,
          padding: '2px 10px',
          fontSize: 8,
          color: '#94a3b8',
          textAlign: 'center',
        }}>
          {URLS[activeScreen]}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
          <div style={{ fontSize: 7, fontWeight: 700, color: '#22c55e' }}>LIVE</div>
        </div>
      </div>

      {/* App body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Sidebar */}
        <div style={{
          width: 150,
          flexShrink: 0,
          background: 'white',
          borderRight: '1px solid #f1f5f9',
          padding: '10px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflow: 'hidden',
        }}>
          <img src="/logo-full.png" alt="Leadomation" style={{ height: 16, marginBottom: 8, width: 'auto', alignSelf: 'flex-start' }} />
          {SIDEBAR.map((section, si) => (
            <div key={si} style={{ marginTop: si === 0 ? 0 : 6 }}>
              <div style={{ fontSize: 5, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', padding: '0 6px', marginBottom: 3 }}>{section.heading}</div>
              {section.items.map((item, ii) => {
                const isActive = item.screenIdx === activeScreen
                return (
                  <div key={ii} style={{
                    fontSize: 8,
                    padding: '4px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    borderRadius: 4,
                    background: isActive ? '#EEF2FF' : 'transparent',
                    color: isActive ? '#4F46E5' : '#64748b',
                    fontWeight: isActive ? 600 : 500,
                    marginBottom: 1,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</div>
                    {item.badge && (
                      <span style={{
                        fontSize: 5,
                        fontWeight: 700,
                        color: isActive ? 'white' : '#4F46E5',
                        background: isActive ? '#4F46E5' : '#EEF2FF',
                        borderRadius: 3,
                        padding: '1px 4px',
                        flexShrink: 0,
                      }}>{item.badge}</span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, background: '#f8fafc', overflow: 'hidden', position: 'relative' }}>
          {[DashboardScreen, LeadsScreen, SequenceScreen].map((Screen, i) => (
            <div key={i} style={{
              position: 'absolute',
              inset: 0,
              opacity: activeScreen === i ? 1 : 0,
              transform: activeScreen === i ? 'translateY(0)' : 'translateY(6px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
              pointerEvents: activeScreen === i ? 'auto' : 'none',
            }}>
              <Screen />
            </div>
          ))}
        </div>

        {/* Cursor overlay — sits above sidebar + main content, coordinates relative to the whole app body */}
        <div style={{
          position: 'absolute',
          top: cursorPos.top,
          left: cursorPos.left,
          zIndex: 50,
          pointerEvents: 'none',
          transition: 'top 0.5s cubic-bezier(0.4,0,0.2,1), left 0.5s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <CursorArrow style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
          {ripple && (
            <div style={{
              position: 'absolute',
              top: -2,
              left: -2,
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: '2px solid #4F46E5',
              animation: 'heroMockupRipple 0.4s ease-out forwards',
            }} />
          )}
        </div>
      </div>

      <style>{`
        @keyframes heroMockupRipple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
