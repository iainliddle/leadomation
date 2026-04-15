import { useEffect, useState, type ReactElement, type CSSProperties } from 'react'
import {
  LayoutGrid, Globe, Plus, Activity, Users, TrendingUp, Calendar as CalendarIcon,
  Mail, Search, Phone, MessageSquare, FileText, BarChart2, User, Link as LinkIcon,
  Settings, Shield, CreditCard, LogOut, Bell, Play,
} from 'lucide-react'

type SidebarItem = {
  label: string
  Icon: typeof LayoutGrid
  badge?: string
  screenIdx?: number
}

type SidebarSection = { heading: string; items: SidebarItem[] }

const SIDEBAR: SidebarSection[] = [
  {
    heading: 'MAIN',
    items: [
      { label: 'Dashboard', Icon: LayoutGrid, screenIdx: 0 },
      { label: 'Global Demand', Icon: Globe },
    ],
  },
  {
    heading: 'CAMPAIGNS',
    items: [
      { label: 'New Campaign', Icon: Plus },
      { label: 'Active Campaigns', Icon: Activity },
    ],
  },
  {
    heading: 'LEADS',
    items: [
      { label: 'Lead Database', Icon: Users, badge: '271', screenIdx: 1 },
    ],
  },
  {
    heading: 'CRM',
    items: [
      { label: 'Deal Pipeline', Icon: TrendingUp, badge: '10' },
      { label: 'Calendar', Icon: CalendarIcon },
    ],
  },
  {
    heading: 'OUTREACH',
    items: [
      { label: 'Sequence Builder', Icon: Mail, screenIdx: 2 },
      { label: 'Keyword Monitor', Icon: Search },
      { label: 'Call Agent', Icon: Phone },
      { label: 'Inbox', Icon: MessageSquare, badge: '12' },
      { label: 'Email Templates', Icon: FileText },
    ],
  },
  {
    heading: 'ANALYTICS',
    items: [
      { label: 'Performance', Icon: BarChart2 },
    ],
  },
  {
    heading: 'SETTINGS',
    items: [
      { label: 'My Profile', Icon: User },
      { label: 'Integrations', Icon: LinkIcon },
      { label: 'Email Config', Icon: Settings },
      { label: 'Compliance', Icon: Shield },
      { label: 'Pricing & Plans', Icon: CreditCard },
    ],
  },
]

const URLS = [
  'app.leadomation.co.uk/dashboard',
  'app.leadomation.co.uk/lead-database',
  'app.leadomation.co.uk/sequence-builder',
]

const CURSOR_POSITIONS = [
  { top: 46, left: 14 },   // Dashboard
  { top: 138, left: 14 },  // Lead Database
  { top: 188, left: 14 },  // Sequence Builder
]

const SWITZER: CSSProperties = { fontFamily: 'Switzer, sans-serif' }

/* ─────────────── DASHBOARD SCREEN ─────────────── */

function MiniBars({ color }: { color: string }): ReactElement {
  const heights = [4, 6, 3, 8]
  return (
    <svg width={24} height={10}>
      {heights.map((h, i) => (
        <rect key={i} x={i * 6} y={10 - h} width={3} height={h} rx={0.5} fill={color} />
      ))}
    </svg>
  )
}

function Sparkline({ color, data }: { color: string; data: number[] }): ReactElement {
  const max = Math.max(...data)
  const w = 32
  const h = 10
  const step = w / (data.length - 1)
  const points = data.map((v, i) => `${i * step},${h - (v / max) * h}`).join(' ')
  return (
    <svg width={w} height={h}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatCard({ label, value, delta, sparkColor, type, data }: {
  label: string; value: string; delta: string; sparkColor: string
  type: 'bars' | 'line'; data?: number[]
}): ReactElement {
  return (
    <div style={{
      background: 'white', borderRadius: 5, border: '1px solid #e5e7eb',
      padding: '6px 7px', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 6, color: '#94a3b8', fontWeight: 500 }}>{label}</div>
        <Users size={9} color="#22D3EE" strokeWidth={2.2} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 5.5, color: '#22c55e' }}>{delta}</div>
      <div style={{ marginTop: 'auto' }}>
        {type === 'bars' ? <MiniBars color={sparkColor} /> : <Sparkline color={sparkColor} data={data!} />}
      </div>
    </div>
  )
}

function PlanCard(): ReactElement {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
      border: '1px solid #c7d2fe', borderRadius: 5, padding: '6px 7px',
      flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1, position: 'relative',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 5.5, color: '#4F46E5', fontWeight: 700, letterSpacing: '0.06em' }}>CURRENT PLAN</div>
        <div style={{ position: 'relative', width: 22, height: 22 }}>
          <svg width={22} height={22} viewBox="0 0 22 22">
            <circle cx="11" cy="11" r="8" stroke="#c7d2fe" strokeWidth="2.5" fill="none" />
            <circle cx="11" cy="11" r="8" stroke="#4F46E5" strokeWidth="2.5" fill="none"
              strokeDasharray={`${2 * Math.PI * 8 * 0.14} ${2 * Math.PI * 8}`}
              transform="rotate(-90 11 11)" strokeLinecap="round" />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 5, fontWeight: 700, color: '#4F46E5',
          }}>14%</div>
        </div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>Pro</div>
      <div style={{ fontSize: 5.5, color: '#6b7280' }}>Pro plan active</div>
      <div style={{
        background: '#4F46E5', color: 'white', fontSize: 5.5, borderRadius: 3,
        padding: '2px 0', width: '100%', textAlign: 'center', marginTop: 3, fontWeight: 600,
      }}>Manage plan</div>
    </div>
  )
}

function CampaignPerformanceChart(): ReactElement {
  return (
    <div style={{
      background: 'white', borderRadius: 5, border: '1px solid #e5e7eb', padding: 7,
      flex: 3, display: 'flex', flexDirection: 'column', minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
        <BarChart2 size={8} color="#4F46E5" strokeWidth={2.2} />
        <div style={{ fontSize: 8, fontWeight: 700, color: '#0f172a' }}>Campaign Performance</div>
        <div style={{ fontSize: 5.5, color: '#94a3b8', marginLeft: 'auto' }}>Last 14 days</div>
      </div>

      <svg viewBox="0 0 200 65" preserveAspectRatio="none" style={{ width: '100%', height: 65, display: 'block' }}>
        <defs>
          <linearGradient id="hdmIndigo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hdmCyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hdmGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1="0" y1={8 + i * 15} x2="200" y2={8 + i * 15} stroke="#f1f5f9" strokeWidth="0.5" />
        ))}

        {/* Emerald (lowest) */}
        <path d="M0,55 C20,54 40,52 60,50 C80,48 100,46 120,46 C140,46 160,44 180,42 L200,40 L200,65 L0,65 Z" fill="url(#hdmGreen)" />
        <path d="M0,55 C20,54 40,52 60,50 C80,48 100,46 120,46 C140,46 160,44 180,42 L200,40" fill="none" stroke="#10b981" strokeWidth="1.2" strokeLinejoin="round" />

        {/* Cyan (middle, early peaks) */}
        <path d="M0,45 C15,40 30,28 50,22 C65,18 80,32 95,30 C115,28 135,38 155,36 C175,34 190,40 200,42 L200,65 L0,65 Z" fill="url(#hdmCyan)" />
        <path d="M0,45 C15,40 30,28 50,22 C65,18 80,32 95,30 C115,28 135,38 155,36 C175,34 190,40 200,42" fill="none" stroke="#22D3EE" strokeWidth="1.3" strokeLinejoin="round" />

        {/* Indigo (peaks around x=80 then descends) */}
        <path d="M0,52 C15,48 30,44 45,36 C60,28 75,14 90,10 C105,16 120,28 135,34 C150,40 170,44 200,46 L200,65 L0,65 Z" fill="url(#hdmIndigo)" />
        <path d="M0,52 C15,48 30,44 45,36 C60,28 75,14 90,10 C105,16 120,28 135,34 C150,40 170,44 200,46" fill="none" stroke="#4F46E5" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 5, color: '#94a3b8', marginTop: 2 }}>
        {['21 Mar', '25 Mar', '29 Mar', '1 Apr', '3 Apr'].map((d, i) => <span key={i}>{d}</span>)}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
        {[
          { label: 'AI Calls', color: '#4F46E5' },
          { label: 'Emails', color: '#22D3EE' },
          { label: 'New Leads', color: '#10b981' },
        ].map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: l.color }} />
            <div style={{ fontSize: 5.5, color: '#64748b' }}>{l.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', borderTop: '1px solid #f1f5f9', marginTop: 4, paddingTop: 4 }}>
        {[
          { v: '271', l: 'TOTAL LEADS' },
          { v: '0', l: 'CONTACTED' },
          { v: '0', l: 'QUALIFIED' },
          { v: '10', l: 'DEALS' },
        ].map((s, i, arr) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center',
            borderRight: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none',
          }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#0f172a' }}>{s.v}</div>
            <div style={{ fontSize: 5, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopCampaigns(): ReactElement {
  const rows = [
    { name: 'Dental Clinics - LinkedIn', tag: 'SPECIFIER', tagBg: '#f3e8ff', tagColor: '#9333ea', rate: '6.74%', bar: 20, barColor: '#9333ea' },
    { name: 'Law Firms - Full Pipeline', tag: 'DIRECT', tagBg: '#EEF2FF', tagColor: '#4F46E5', rate: '11.22%', bar: 75, barColor: '#4F46E5' },
    { name: 'Plumbers in Edinburgh', tag: 'DIRECT', tagBg: '#EEF2FF', tagColor: '#4F46E5', rate: '0%', bar: 8, barColor: '#4F46E5' },
    { name: 'Solicitors in Edinburgh', tag: 'DIRECT', tagBg: '#EEF2FF', tagColor: '#4F46E5', rate: '0%', bar: 8, barColor: '#4F46E5' },
  ]
  return (
    <div style={{
      background: 'white', borderRadius: 5, border: '1px solid #e5e7eb', padding: 7,
      flex: 2, display: 'flex', flexDirection: 'column', minWidth: 0,
    }}>
      <div style={{ fontSize: 8, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Top Performing Campaigns</div>
      {rows.map((r, i) => (
        <div key={i} style={{
          paddingBottom: 5, marginBottom: 5,
          borderBottom: i < rows.length - 1 ? '1px solid #f8fafc' : 'none',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 7.5, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{r.name}</div>
            <div style={{ fontSize: 7.5, fontWeight: 700, color: '#0f172a', marginLeft: 4 }}>{r.rate}</div>
          </div>
          <div style={{
            display: 'inline-block', fontSize: 5.5, background: r.tagBg, color: r.tagColor,
            borderRadius: 3, padding: '0 4px', fontWeight: 600, marginTop: 1,
          }}>{r.tag}</div>
          <div style={{ height: 2.5, background: '#f1f5f9', borderRadius: 2, marginTop: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${r.bar}%`, background: r.barColor, borderRadius: 2 }} />
          </div>
        </div>
      ))}
      <div style={{ fontSize: 6, color: '#4F46E5', textAlign: 'right', marginTop: 'auto', fontWeight: 600 }}>VIEW ALL CAMPAIGNS</div>
    </div>
  )
}

function RecentActivity(): ReactElement {
  const rows = [
    { initials: 'U', text: 'AI call to Smile Clinic Northwest', time: '5d ago', status: 'COMPLETED', statusColor: '#059669' },
    { initials: 'U', text: 'AI call to Forsyth Family Law', time: '6d ago', status: 'COMPLETED', statusColor: '#059669' },
    { initials: 'U', text: 'AI call to Fletcher Law Group', time: '27/03/2026', status: 'COMPLETED', statusColor: '#059669' },
    { initials: 'U', text: 'AI call to The Rivington London', time: '26/03/2026', status: 'COMPLETED', statusColor: '#059669' },
    { initials: 'DD', text: 'New lead: Dunmore Dental Care', time: '26/03/2026', status: 'NEW', statusColor: '#4F46E5' },
    { initials: 'OD', text: 'New lead: Owen Dental Group', time: '25/03/2026', status: 'NEW', statusColor: '#4F46E5' },
    { initials: 'BS', text: 'New lead: Bright Smile Kent', time: '25/03/2026', status: 'NEW', statusColor: '#4F46E5' },
    { initials: 'SD', text: 'New lead: Surrey Dental Specialists', time: '25/03/2026', status: 'NEW', statusColor: '#4F46E5' },
  ]
  return (
    <div style={{
      background: 'white', borderRadius: 5, border: '1px solid #e5e7eb', padding: 7,
      flex: 3, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
        <Activity size={8} color="#4F46E5" strokeWidth={2.2} />
        <div style={{ fontSize: 8, fontWeight: 700, color: '#0f172a' }}>Recent Activity</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
          <div style={{ fontSize: 6, color: '#22c55e', fontWeight: 600 }}>Live Feed</div>
        </div>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, paddingBottom: 3 }}>
          <div style={{
            width: 14, height: 14, borderRadius: '50%', background: '#EEF2FF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 5.5, fontWeight: 700, color: '#4F46E5', flexShrink: 0,
          }}>{r.initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 7, color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.text}</div>
            <div style={{ fontSize: 5.5, color: '#94a3b8' }}>{r.time}</div>
          </div>
          <div style={{ fontSize: 5.5, color: r.statusColor, fontWeight: 700, flexShrink: 0 }}>{r.status}</div>
        </div>
      ))}
    </div>
  )
}

function UpcomingAndLeads(): ReactElement {
  const events = [
    { name: 'Follow-up Call - Claire Donovan / Donovan Sol.', date: 'Fri 3 Apr', time: '09:00 - 10:00', accent: '#10b981' },
    { name: 'Quarterly Review - Internal', date: 'Fri 3 Apr', time: '12:00 - 13:30', accent: '#4F46E5' },
    { name: 'Intro Call - Andrew Fletcher / Fletcher Law', date: 'Fri 3 Apr', time: '15:00 - 17:00', accent: '#22D3EE' },
    { name: 'pick up kids', date: 'Tue 10 Nov', time: '09:00 - 15:00', accent: '#f59e0b' },
  ]
  const leads = [
    { i: 'D', name: 'Dunmore Dental Care', date: '26/03/2026' },
    { i: 'O', name: 'Owen Dental Group', date: '25/03/2026' },
    { i: 'B', name: 'Bright Smile Kent', date: '25/03/2026' },
    { i: 'S', name: 'Surrey Dental Specialists', date: '25/03/2026' },
    { i: 'L', name: 'London Smile Studio', date: '25/03/2026' },
  ]
  return (
    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
      {/* Upcoming events */}
      <div style={{ background: 'white', borderRadius: 5, border: '1px solid #e5e7eb', padding: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 5 }}>
          <CalendarIcon size={8} color="#4F46E5" strokeWidth={2.2} />
          <div style={{ fontSize: 8, fontWeight: 700, color: '#0f172a' }}>Upcoming events</div>
          <div style={{ marginLeft: 'auto', fontSize: 6, color: '#4F46E5', fontWeight: 600 }}>VIEW CALENDAR</div>
        </div>
        {events.map((e, i) => (
          <div key={i} style={{
            borderLeft: `3px solid ${e.accent}`, paddingLeft: 5, marginBottom: 4,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4,
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 7, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</div>
              <div style={{ fontSize: 5.5, color: '#94a3b8' }}>{e.date}</div>
            </div>
            <div style={{ fontSize: 5.5, color: '#94a3b8', flexShrink: 0 }}>{e.time}</div>
          </div>
        ))}
      </div>

      {/* Recent leads */}
      <div style={{ background: 'white', borderRadius: 5, border: '1px solid #e5e7eb', padding: 7, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 5 }}>
          <Users size={8} color="#4F46E5" strokeWidth={2.2} />
          <div style={{ fontSize: 8, fontWeight: 700, color: '#0f172a' }}>Recent leads</div>
          <div style={{ marginLeft: 'auto', fontSize: 6, color: '#4F46E5', fontWeight: 600 }}>VIEW ALL</div>
        </div>
        {leads.map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, paddingBottom: 3 }}>
            <div style={{
              width: 14, height: 14, borderRadius: '50%', background: '#f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 6, fontWeight: 700, color: '#4F46E5', flexShrink: 0,
            }}>{l.i}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 7, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</div>
              <div style={{ fontSize: 5.5, color: '#94a3b8' }}>Healthcare</div>
            </div>
            <div style={{ fontSize: 5.5, color: '#94a3b8', flexShrink: 0 }}>{l.date}</div>
          </div>
        ))}
        <div style={{
          border: '1px solid #e2e8f0', borderRadius: 5, padding: 3, textAlign: 'center',
          fontSize: 6.5, color: '#64748b', width: '100%', marginTop: 4,
        }}>Refresh dashboard</div>
      </div>
    </div>
  )
}

function DashboardScreen(): ReactElement {
  return (
    <div style={{
      ...SWITZER, background: '#f8fafc', padding: 10, height: '100%',
      display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden',
    }}>
      {/* Row 1 — page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a' }}>Dashboard</div>
          <div style={{ fontSize: 6.5, color: '#94a3b8' }}>Overview of your outreach performance</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 5, padding: '2px 6px', fontSize: 6.5, color: '#475569' }}>
            4 Mar 2026 - 3 Apr 2026
          </div>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 5, padding: '2px 6px', fontSize: 6.5, color: '#475569' }}>
            Export
          </div>
          <Search size={10} color="#64748b" strokeWidth={2} />
          <Bell size={10} color="#64748b" strokeWidth={2} />
        </div>
      </div>

      {/* Row 2 — greeting */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a' }}>Good evening, Iain 👋</div>
        <div style={{ fontSize: 6.5, color: '#6b7280' }}>Friday, 3 April 2026 · Let's make today count.</div>
      </div>

      {/* Row 3 — stat cards */}
      <div style={{ display: 'flex', gap: 5 }}>
        <StatCard label="Total Leads" value="271" delta="+0% in last 30 days" sparkColor="#22D3EE" type="bars" />
        <StatCard label="Leads with Emails" value="31" delta="+12% in last 30 days" sparkColor="#10b981" type="line" data={[2, 4, 3, 6, 5, 8, 7]} />
        <StatCard label="Leads Contacted" value="0" delta="0% in last 30 days" sparkColor="#8b5cf6" type="line" data={[1, 2, 1, 3, 2, 3, 2]} />
        <StatCard label="Total Deals" value="10" delta="+3% in last 30 days" sparkColor="#f43f5e" type="line" data={[2, 3, 4, 4, 5, 6, 7]} />
        <PlanCard />
      </div>

      {/* Row 4 — charts */}
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <CampaignPerformanceChart />
        <TopCampaigns />
      </div>

      {/* Row 5 — activity + upcoming */}
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <RecentActivity />
        <UpcomingAndLeads />
      </div>
    </div>
  )
}

/* ─────────────── LEAD DATABASE SCREEN ─────────────── */

function LeadDatabaseScreen(): ReactElement {
  const cols = [
    { label: 'COMPANY', flex: 2 },
    { label: 'EMAIL', flex: 2 },
    { label: 'PHONE', flex: 1.5 },
    { label: 'LOCATION', flex: 1 },
    { label: 'LOCAL TIME', flex: 1 },
    { label: 'INDUSTRY', flex: 1 },
    { label: 'STATUS', flex: 1 },
    { label: 'INTENT', flex: 1 },
  ]
  const rows = [
    { company: 'Dunmore Dental Care', role: 'Practice Owner', email: 'kate@dunmoredentalca...', phone: '+44 1732 441 188', location: 'Kent', time: '17:59', timeColor: '#f59e0b', industry: 'Healthcare', status: 'CONTACTED', intent: 'Warm · 63', intentColor: '#f59e0b' },
    { company: 'Smile Clinic Northwest', role: 'Clinical Director', email: 'amir@smileclinicnorthw...', phone: '+44 207 734 5566', location: 'London', time: '18:59', timeColor: '#ef4444', industry: 'Healthcare', status: 'REPLIED', intent: 'Hot · 95', intentColor: '#ef4444' },
    { company: 'Bright Smile Kent', role: 'Practice Owner', email: 's.gallagher@brightsmile...', phone: '+44 1622 678 900', location: 'Kent', time: '17:59', timeColor: '#f59e0b', industry: 'Healthcare', status: 'CONTACTED', intent: 'Hot · 76', intentColor: '#ef4444' },
    { company: 'London Smile Studio', role: 'Clinical Director', email: 'paul@londonsmilestudi...', phone: '+44 207 836 4422', location: 'London', time: '18:59', timeColor: '#ef4444', industry: 'Healthcare', status: 'REPLIED', intent: 'Hot · 92', intentColor: '#ef4444' },
    { company: 'Owen Dental Group', role: 'Practice Director', email: 'lewis@owendentalg...', phone: '+44 208 445 6677', location: 'London', time: '18:59', timeColor: '#ef4444', industry: 'Healthcare', status: 'CONTACTED', intent: 'Hot · 80', intentColor: '#ef4444' },
    { company: 'Surrey Dental Specialists', role: 'Practice Manager', email: 'nina@surreydental.co.uk', phone: '+44 1483 445 211', location: 'Surrey', time: '17:59', timeColor: '#f59e0b', industry: 'Healthcare', status: 'CONTACTED', intent: 'Warm · 71', intentColor: '#f59e0b' },
    { company: 'Walsh Business Law', role: 'Managing Partner', email: 'gemma@walshbu...', phone: '+44 117 911 3322', location: 'Bristol', time: '18:59', timeColor: '#ef4444', industry: 'Legal Services', status: 'CONTACTED', intent: 'Warm · 72', intentColor: '#f59e0b' },
  ]

  const pillStyle: CSSProperties = {
    border: '1px solid #e2e8f0', borderRadius: 9999, padding: '1px 5px',
    fontSize: 6, color: '#64748b', background: 'white', whiteSpace: 'nowrap',
  }

  return (
    <div style={{
      ...SWITZER, background: 'white', padding: 10, height: '100%',
      display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a' }}>Lead Database</div>
          <div style={{ fontSize: 6.5, color: '#94a3b8' }}>Manage and track all your leads</div>
        </div>
        <div style={{
          background: '#4F46E5', color: 'white', fontSize: 7, fontWeight: 600,
          borderRadius: 5, padding: '3px 8px',
        }}>+ Add Lead</div>
      </div>

      <div style={{
        width: '100%', border: '1px solid #e2e8f0', borderRadius: 5,
        padding: '4px 8px', fontSize: 7, color: '#94a3b8',
      }}>Search leads by name, email, company...</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
        <div style={{ fontSize: 6, fontWeight: 700, color: '#94a3b8' }}>SMART</div>
        <div style={pillStyle}>⚡ New Business (271)</div>
        <div style={pillStyle}>⭐ Low Rating (126)</div>
        <div style={pillStyle}>📷 No Photos (271)</div>
        <div style={pillStyle}>💬 No Reviews (271)</div>
        <div style={pillStyle}>📍 Incomplete (240)</div>
        <div style={{ fontSize: 6, fontWeight: 700, color: '#94a3b8', marginLeft: 4 }}>INTENT</div>
        <div style={pillStyle}>🔥 Hot (11)</div>
        <div style={pillStyle}>🌡 Warm (9)</div>
        <div style={pillStyle}>❄ Cool (0)</div>
        <div style={pillStyle}>? Unscored (251)</div>
      </div>

      <div style={{
        flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
        border: '1px solid #e5e7eb', borderRadius: 5, overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', padding: '4px 8px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc',
        }}>
          {cols.map((c, i) => (
            <div key={i} style={{
              flex: c.flex, fontSize: 6, fontWeight: 700, color: '#94a3b8',
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>{c.label}</div>
          ))}
        </div>

        {rows.map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', padding: '4px 8px',
            borderBottom: i < rows.length - 1 ? '1px solid #f8fafc' : 'none',
          }}>
            <div style={{ flex: 2, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ fontSize: 7.5, fontWeight: 600, color: '#4F46E5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.company}</div>
                <div style={{ fontSize: 5, background: '#f0fdf4', color: '#16a34a', borderRadius: 3, padding: '0 3px', fontWeight: 600, flexShrink: 0 }}>ENRICHED</div>
              </div>
              <div style={{ fontSize: 6, color: '#94a3b8' }}>{r.role}</div>
            </div>
            <div style={{ flex: 2, fontSize: 6, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.email}</div>
            <div style={{ flex: 1.5, fontSize: 6, color: '#64748b' }}>{r.phone}</div>
            <div style={{ flex: 1, fontSize: 6, color: '#64748b' }}>{r.location}</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: r.timeColor }} />
              <div style={{ fontSize: 6, color: '#64748b' }}>{r.time}</div>
            </div>
            <div style={{ flex: 1, fontSize: 6, color: '#64748b' }}>{r.industry}</div>
            <div style={{ flex: 1 }}>
              <span style={{
                border: '1px solid #d1fae5', color: '#059669', borderRadius: 4,
                padding: '1px 4px', fontSize: 6, fontWeight: 600, background: '#f0fdf4',
              }}>{r.status}</span>
            </div>
            <div style={{ flex: 1, fontSize: 6, color: r.intentColor, fontWeight: 700 }}>{r.intent}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────── SEQUENCE BUILDER SCREEN ─────────────── */

function SequenceBuilderScreen(): ReactElement {
  const sequences = [
    { name: 'Dental Practice LinkedIn Sequence', meta: '3 Steps · 2 enrolled leads · Created 25/03/2026', reply: '50%' },
    { name: 'Law Firm Full Pipeline - LinkedIn + Email', meta: '5 Steps · 2 enrolled leads · Created 21/03/2026', reply: '50%' },
    { name: 'Hotel Outreach - 4 Step Cold Email', meta: '4 Steps · 4 enrolled leads · Created 12/03/2026', reply: '50%' },
    { name: 'Cold Outreach Sequence', meta: '3 Steps · 1 enrolled lead · Created 23/02/2026', reply: '0%' },
  ]
  return (
    <div style={{
      ...SWITZER, background: '#f8fafc', padding: 10, height: '100%',
      display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a' }}>Sequence Builder</div>
          <div style={{ fontSize: 6.5, color: '#94a3b8' }}>Build automated outreach sequences</div>
        </div>
        <div style={{
          background: '#4F46E5', color: 'white', fontSize: 7, fontWeight: 600,
          borderRadius: 5, padding: '3px 8px',
        }}>+ New Sequence</div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: 2 }}>
        <div style={{
          padding: '5px 10px', fontSize: 7.5, fontWeight: 500, color: '#4F46E5',
          borderBottom: '2px solid #4F46E5', display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Mail size={8} strokeWidth={2.2} />
          Email Sequences
        </div>
        <div style={{
          padding: '5px 10px', fontSize: 7.5, fontWeight: 500, color: '#64748b',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <BarChart2 size={8} strokeWidth={2.2} />
          LinkedIn Sequences
          <span style={{
            background: '#4F46E5', color: 'white', borderRadius: 9999,
            fontSize: 6, padding: '0 4px', fontWeight: 700,
          }}>4</span>
        </div>
        <div style={{
          padding: '5px 10px', fontSize: 7.5, fontWeight: 500, color: '#64748b',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Settings size={8} strokeWidth={2.2} />
          Keyword Monitor
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1, minHeight: 0 }}>
        {sequences.map((s, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: 7, border: '1px solid #e5e7eb',
            padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: '#f0fdf4',
              border: '1px solid #d1fae5', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0,
            }}>
              <Play size={8} color="#22c55e" fill="#22c55e" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 8.5, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
              <div style={{ fontSize: 6.5, color: '#94a3b8', marginTop: 1 }}>{s.meta}</div>
              <div style={{ fontSize: 6.5, color: '#64748b', marginTop: 2 }}>
                Open rate: -&nbsp;&nbsp;&nbsp;Reply rate: {s.reply}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <span style={{
                background: '#f0fdf4', color: '#16a34a', border: '1px solid #d1fae5',
                borderRadius: 4, padding: '2px 5px', fontSize: 6, fontWeight: 700,
              }}>ACTIVE</span>
              <span style={{
                border: '1px solid #e2e8f0', borderRadius: 5, padding: '2px 7px',
                fontSize: 6.5, color: '#64748b',
              }}>Pause</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────── CURSOR ─────────────── */

function CursorArrow({ style }: { style?: CSSProperties }): ReactElement {
  return (
    <svg width={11} height={11} viewBox="0 0 24 24" style={style}>
      <path d="M5.5 3.5 L5.5 20 L10 15.5 L13 22 L15.5 20.8 L12.5 14.5 L19 14.5 Z"
        fill="white" stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

/* ─────────────── MAIN COMPONENT ─────────────── */

export default function HeroDashboardMockup(): ReactElement {
  const [activeScreen, setActiveScreen] = useState(0)
  const [cursorIdx, setCursorIdx] = useState(0)
  const [ripple, setRipple] = useState(false)

  useEffect(() => {
    const timers: Array<ReturnType<typeof setTimeout>> = []

    const schedule = () => {
      timers.push(setTimeout(() => setCursorIdx(1), 3500))
      timers.push(setTimeout(() => {
        setRipple(true); setActiveScreen(1)
        setTimeout(() => setRipple(false), 400)
      }, 4000))
      timers.push(setTimeout(() => setCursorIdx(2), 7500))
      timers.push(setTimeout(() => {
        setRipple(true); setActiveScreen(2)
        setTimeout(() => setRipple(false), 400)
      }, 8000))
      timers.push(setTimeout(() => setCursorIdx(0), 11500))
      timers.push(setTimeout(() => {
        setRipple(true); setActiveScreen(0)
        setTimeout(() => setRipple(false), 400)
      }, 12000))
    }

    schedule()
    const interval = setInterval(schedule, 12000)

    return () => {
      clearInterval(interval)
      timers.forEach(clearTimeout)
    }
  }, [])

  const cursor = CURSOR_POSITIONS[cursorIdx]

  return (
    <div style={{
      ...SWITZER, width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: 'white', overflow: 'hidden', position: 'relative',
    }}>
      {/* Browser chrome */}
      <div style={{
        height: 26, background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', padding: '0 10px', gap: 6, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF5F57' }} />
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#FEBC2E' }} />
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#28C840' }} />
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', background: '#f1f5f9', borderRadius: 4,
            padding: '1px 10px', fontSize: 8, color: '#94a3b8',
          }}>{URLS[activeScreen]}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
          <div style={{ fontSize: 7, fontWeight: 700, color: '#22c55e' }}>LIVE</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{
          width: 155, flexShrink: 0, background: 'white',
          borderRight: '1px solid #f1f5f9', padding: '10px 8px',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <img src="/logo-full.png" alt="Leadomation" style={{ height: 16, marginBottom: 2, width: 'auto', alignSelf: 'flex-start' }} />
          <div style={{ fontSize: 7, color: '#94a3b8', marginBottom: 10 }}>B2B Outreach Platform</div>

          {SIDEBAR.map((section, si) => (
            <div key={si}>
              <div style={{
                fontSize: 6, fontWeight: 700, color: '#94a3b8',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '6px 8px 3px 8px',
              }}>{section.heading}</div>
              {section.items.map((item, ii) => {
                const isActive = item.screenIdx === activeScreen
                return (
                  <div key={ii} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '4px 8px', borderRadius: 5, fontSize: 8, fontWeight: 500,
                    marginBottom: 1,
                    background: isActive ? '#EEF2FF' : 'transparent',
                    color: isActive ? '#4F46E5' : '#64748b',
                    transition: 'background 0.15s',
                  }}>
                    <item.Icon size={9} strokeWidth={2.2} />
                    <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</div>
                    {item.badge && (
                      <span style={{
                        marginLeft: 'auto', background: '#4F46E5', color: 'white',
                        fontSize: 6, fontWeight: 700, borderRadius: 9999,
                        padding: '1px 4px', minWidth: 14, textAlign: 'center',
                      }}>{item.badge}</span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}

          <div style={{
            borderTop: '1px solid #f1f5f9', paddingTop: 6, marginTop: 'auto',
            display: 'flex', alignItems: 'center', gap: 5, padding: '6px 8px 0 8px',
            fontSize: 8, color: '#64748b',
          }}>
            <LogOut size={9} strokeWidth={2.2} />
            Sign Out
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minWidth: 0 }}>
          {[DashboardScreen, LeadDatabaseScreen, SequenceBuilderScreen].map((Screen, i) => (
            <div key={i} style={{
              position: 'absolute', inset: 0,
              opacity: activeScreen === i ? 1 : 0,
              transform: activeScreen === i ? 'translateY(0)' : 'translateY(6px)',
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
              pointerEvents: activeScreen === i ? 'auto' : 'none',
            }}>
              <Screen />
            </div>
          ))}
        </div>
      </div>

      {/* Cursor overlay — positioned relative to whole mockup so it can sit over the sidebar */}
      <div style={{
        position: 'absolute',
        top: cursor.top, left: cursor.left,
        zIndex: 50, pointerEvents: 'none',
        transition: 'top 0.5s cubic-bezier(0.4,0,0.2,1), left 0.5s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <CursorArrow style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.35))' }} />
        {ripple && (
          <div style={{
            position: 'absolute', top: -3, left: -3,
            width: 16, height: 16, borderRadius: '50%',
            border: '2px solid #4F46E5',
            animation: 'heroMockupRipple 0.3s ease-out forwards',
          }} />
        )}
      </div>

      <style>{`
        @keyframes heroMockupRipple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
