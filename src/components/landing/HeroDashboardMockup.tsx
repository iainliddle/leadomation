import { useEffect, useRef, useState, type ReactElement, type CSSProperties } from 'react'
import {
  LayoutGrid, Globe, Plus, Activity, Users, TrendingUp, Calendar as CalendarIcon,
  Mail, Search, Phone, MessageSquare, FileText, BarChart2, User, Link as LinkIcon,
  Settings, Shield, CreditCard, LogOut, Bell, Play, Download, ChevronDown, Info, Linkedin,
} from 'lucide-react'

/* ─────────────── TYPES ─────────────── */

type SidebarItem = {
  label: string
  Icon: typeof LayoutGrid
  badge?: string
  activeOn?: number[]
}
type SidebarSection = { heading: string; items: SidebarItem[] }

/* ─────────────── CONSTANTS ─────────────── */

const SIDEBAR: SidebarSection[] = [
  { heading: 'MAIN', items: [
    { label: 'Dashboard', Icon: LayoutGrid, activeOn: [0] },
    { label: 'Global Demand', Icon: Globe },
  ]},
  { heading: 'CAMPAIGNS', items: [
    { label: 'New Campaign', Icon: Plus },
    { label: 'Active Campaigns', Icon: Activity },
  ]},
  { heading: 'LEADS', items: [
    { label: 'Lead Database', Icon: Users, badge: '271', activeOn: [1] },
  ]},
  { heading: 'CRM', items: [
    { label: 'Deal Pipeline', Icon: TrendingUp, badge: '10' },
    { label: 'Calendar', Icon: CalendarIcon },
  ]},
  { heading: 'OUTREACH', items: [
    { label: 'Sequence Builder', Icon: Mail, activeOn: [2, 3] },
    { label: 'Keyword Monitor', Icon: Search },
    { label: 'Call Agent', Icon: Phone },
    { label: 'Inbox', Icon: MessageSquare, badge: '12' },
    { label: 'Email Templates', Icon: FileText },
  ]},
  { heading: 'ANALYTICS', items: [
    { label: 'Performance', Icon: BarChart2 },
  ]},
  { heading: 'SETTINGS', items: [
    { label: 'My Profile', Icon: User },
    { label: 'Integrations', Icon: LinkIcon },
    { label: 'Email Config', Icon: Settings },
    { label: 'Compliance', Icon: Shield },
    { label: 'Pricing & Plans', Icon: CreditCard },
  ]},
]

const URLS = [
  'app.leadomation.co.uk/dashboard',
  'app.leadomation.co.uk/lead-database',
  'app.leadomation.co.uk/sequence-builder',
  'app.leadomation.co.uk/sequence-builder',
]

// Cursor coordinates are from the top-left of the whole mockup (including chrome bar).
const CURSOR_POSITIONS: Record<number, { top: number; left: number }> = {
  0: { top: 58, left: 20 },   // Dashboard nav item
  1: { top: 152, left: 20 },  // Lead Database nav item
  2: { top: 200, left: 20 },  // Sequence Builder nav item
  3: { top: 200, left: 20 },  // Sequence Builder nav item (LinkedIn tab)
}

const SWITZER: CSSProperties = { fontFamily: 'Switzer, sans-serif' }

/* ─────────────── TOP BAR ─────────────── */

function TopBar(): ReactElement {
  const pill: CSSProperties = {
    border: '1px solid #e2e8f0', borderRadius: 5, padding: '2px 7px',
    fontSize: 6.5, color: '#475569', display: 'flex', alignItems: 'center', gap: 3,
    background: 'white',
  }
  const iconCircle: CSSProperties = {
    width: 20, height: 20, borderRadius: '50%', background: '#f8fafc',
    border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
  }
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6,
      marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid #f1f5f9',
    }}>
      <div style={pill}>
        <CalendarIcon size={8} strokeWidth={2} />
        4 Mar 2026 - 3 Apr 2026
      </div>
      <div style={pill}>
        <Download size={8} strokeWidth={2} />
        Export
      </div>
      <div style={iconCircle}><Search size={9} color="#64748b" strokeWidth={2} /></div>
      <div style={iconCircle}><Bell size={9} color="#64748b" strokeWidth={2} /></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <div style={{ fontSize: 6.5, fontWeight: 600, color: '#475569' }}>Iain L.</div>
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: '#4F46E5', color: 'white',
          fontSize: 7, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>IL</div>
        <ChevronDown size={8} color="#94a3b8" strokeWidth={2} />
      </div>
      <div style={{
        background: '#4F46E5', color: 'white', fontSize: 7, fontWeight: 600,
        borderRadius: 5, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 3,
      }}>
        <Plus size={8} strokeWidth={2.5} />
        New Campaign
      </div>
    </div>
  )
}

/* ─────────────── DASHBOARD COMPONENTS ─────────────── */

function MiniBars({ color }: { color: string }): ReactElement {
  const heights = [4, 6, 3, 8]
  return (
    <svg width={26} height={10}>
      {heights.map((h, i) => (
        <rect key={i} x={i * 7} y={10 - h} width={4} height={h} rx={0.5} fill={color} />
      ))}
    </svg>
  )
}

function Sparkline({ color, data }: { color: string; data: number[] }): ReactElement {
  const max = Math.max(...data)
  const w = 40
  const h = 10
  const step = w / (data.length - 1)
  const points = data.map((v, i) => `${i * step},${h - (v / max) * h}`).join(' ')
  return (
    <svg width={w} height={h}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatCard({ label, value, delta, sparkColor, type, data, IconCmp, iconColor }: {
  label: string; value: string; delta: string; sparkColor: string
  type: 'bars' | 'line'; data?: number[]
  IconCmp: typeof Users; iconColor: string
}): ReactElement {
  return (
    <div style={{
      background: 'white', borderRadius: 5, border: '1px solid #e5e7eb',
      padding: '7px 8px', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 6, color: '#94a3b8', fontWeight: 500 }}>{label}</div>
        <IconCmp size={9} color={iconColor} strokeWidth={2.2} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
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
      border: '1px solid #c7d2fe', borderRadius: 5, padding: '7px 8px',
      flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1, position: 'relative',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 5.5, color: '#4F46E5', fontWeight: 700, letterSpacing: '0.06em' }}>CURRENT PLAN</div>
        <div style={{ position: 'relative', width: 24, height: 24 }}>
          <svg width={24} height={24} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" stroke="#c7d2fe" strokeWidth="2.5" fill="none" />
            <circle cx="12" cy="12" r="9" stroke="#4F46E5" strokeWidth="2.5" fill="none"
              strokeDasharray={`${2 * Math.PI * 9 * 0.14} ${2 * Math.PI * 9}`}
              transform="rotate(-90 12 12)" strokeLinecap="round" />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 5, fontWeight: 700, color: '#4F46E5',
          }}>14%</div>
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>Pro</div>
      <div style={{ fontSize: 5.5, color: '#6b7280' }}>Pro plan active</div>
      <div style={{
        background: '#4F46E5', color: 'white', fontSize: 5.5, borderRadius: 3,
        padding: '2px 0', width: '100%', textAlign: 'center', marginTop: 3, fontWeight: 600,
      }}>Manage plan</div>
    </div>
  )
}

function CampaignPerformanceChart(): ReactElement {
  // Exact paths from the spec — bell curve on green, gentle hump on cyan, near-flat indigo
  const greenFill = 'M0,60 C20,58 40,50 60,35 C80,18 100,22 120,40 C140,55 160,62 180,68 C200,70 240,72 280,72 L280,80 L0,80 Z'
  const greenStroke = 'M0,60 C20,58 40,50 60,35 C80,18 100,22 120,40 C140,55 160,62 180,68 C200,70 240,72 280,72'
  const cyanFill = 'M0,72 C20,70 40,65 60,60 C80,55 100,52 120,54 C140,56 160,60 180,64 C200,67 240,70 280,70 L280,80 L0,80 Z'
  const cyanStroke = 'M0,72 C20,70 40,65 60,60 C80,55 100,52 120,54 C140,56 160,60 180,64 C200,67 240,70 280,70'
  const indigoFill = 'M0,75 C40,74 80,74 120,73 C160,73 200,74 240,74 L280,74 L280,80 L0,80 Z'
  const indigoStroke = 'M0,75 C40,74 80,74 120,73 C160,73 200,74 240,74 L280,74'

  return (
    <div style={{
      background: 'white', borderRadius: 5, border: '1px solid #e5e7eb', padding: 8,
      flex: 3, display: 'flex', flexDirection: 'column', minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: '#0f172a' }}>Campaign Performance</div>
        <div style={{ fontSize: 5.5, color: '#94a3b8', marginLeft: 'auto' }}>Last 14 days</div>
      </div>

      <svg viewBox="0 0 280 80" preserveAspectRatio="none" style={{ width: '100%', flex: 1, minHeight: 80, display: 'block' }}>
        <defs>
          <linearGradient id="gradIndigo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* gridlines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={i} x1="10" y1={10 + i * 14} x2="280" y2={10 + i * 14} stroke="#f1f5f9" strokeWidth="0.5" />
        ))}
        {/* y-axis labels */}
        {['8', '6', '4', '2', '0'].map((y, i) => (
          <text key={i} x="2" y={12 + i * 14} fontSize="5" fill="#94a3b8">{y}</text>
        ))}

        <path d={indigoFill} fill="url(#gradIndigo)" />
        <path d={cyanFill} fill="url(#gradCyan)" />
        <path d={greenFill} fill="url(#gradGreen)" />

        <path d={indigoStroke} fill="none" stroke="#4F46E5" strokeWidth="1.5" strokeLinejoin="round" />
        <path d={cyanStroke} fill="none" stroke="#22D3EE" strokeWidth="1.5" strokeLinejoin="round" />
        <path d={greenStroke} fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 5, color: '#94a3b8', marginTop: 2, paddingLeft: 10 }}>
        {['21 Mar', '23 Mar', '25 Mar', '27 Mar', '29 Mar', '1 Apr', '3 Apr'].map((d, i) => <span key={i}>{d}</span>)}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        {[
          { label: 'AI Calls', color: '#4F46E5' },
          { label: 'Emails', color: '#22D3EE' },
          { label: 'New Leads', color: '#10b981' },
        ].map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: l.color }} />
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
            <div style={{ fontSize: 10, fontWeight: 800, color: '#0f172a' }}>{s.v}</div>
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
      background: 'white', borderRadius: 5, border: '1px solid #e5e7eb', padding: 8,
      flex: 2, display: 'flex', flexDirection: 'column', minWidth: 0,
    }}>
      <div style={{ fontSize: 8, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Top Performing Campaigns</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            paddingBottom: 5,
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
            <div style={{ height: 3, background: '#f1f5f9', borderRadius: 2, marginTop: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${r.bar}%`, background: r.barColor, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 6, color: '#4F46E5', textAlign: 'right', marginTop: 'auto', paddingTop: 4, fontWeight: 600 }}>VIEW ALL CAMPAIGNS</div>
    </div>
  )
}

function RecentActivity(): ReactElement {
  const rows = [
    { initials: 'U', text: 'AI call to Smile Clinic Northwest', time: '5d ago', status: 'COMPLETED', statusColor: '#059669' },
    { initials: 'U', text: 'AI call to Forsyth Family Law', time: '6d ago', status: 'COMPLETED', statusColor: '#059669' },
    { initials: 'U', text: 'AI call to Fletcher Law Group', time: '27/03/2026', status: 'COMPLETED', statusColor: '#059669' },
    { initials: 'DD', text: 'New lead: Dunmore Dental Care', time: '26/03/2026', status: 'NEW', statusColor: '#4F46E5' },
    { initials: 'OD', text: 'New lead: Owen Dental Group', time: '25/03/2026', status: 'NEW', statusColor: '#4F46E5' },
    { initials: 'BS', text: 'New lead: Bright Smile Kent', time: '25/03/2026', status: 'NEW', statusColor: '#4F46E5' },
  ]
  return (
    <div style={{
      background: 'white', borderRadius: 5, border: '1px solid #e5e7eb', padding: 7,
      flex: 3, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 5 }}>
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
            width: 13, height: 13, borderRadius: '50%', background: '#EEF2FF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 6, fontWeight: 700, color: '#4F46E5', flexShrink: 0,
          }}>{r.initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 6.5, color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.text}</div>
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
    { name: 'Follow-up Call - Claire Donovan', meta: 'Fri 3 Apr · 09:00-10:00', accent: '#10b981' },
    { name: 'Quarterly Review - Internal', meta: 'Fri 3 Apr · 12:00-13:30', accent: '#4F46E5' },
    { name: 'Intro Call - Andrew Fletcher', meta: 'Fri 3 Apr · 15:00-17:00', accent: '#22D3EE' },
  ]
  const leads = [
    { i: 'D', name: 'Dunmore Dental Care', date: '26/03/2026' },
    { i: 'O', name: 'Owen Dental Group', date: '25/03/2026' },
    { i: 'B', name: 'Bright Smile Kent', date: '25/03/2026' },
    { i: 'S', name: 'Surrey Dental Specialists', date: '25/03/2026' },
  ]
  return (
    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
      <div style={{ background: 'white', borderRadius: 5, border: '1px solid #e5e7eb', padding: 6, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
          <CalendarIcon size={8} color="#4F46E5" strokeWidth={2.2} />
          <div style={{ fontSize: 7.5, fontWeight: 700, color: '#0f172a' }}>Upcoming events</div>
          <div style={{ marginLeft: 'auto', fontSize: 5.5, color: '#4F46E5', fontWeight: 600 }}>VIEW CALENDAR</div>
        </div>
        {events.map((e, i) => (
          <div key={i} style={{ borderLeft: `3px solid ${e.accent}`, paddingLeft: 4, marginBottom: 3 }}>
            <div style={{ fontSize: 6.5, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</div>
            <div style={{ fontSize: 5.5, color: '#94a3b8' }}>{e.meta}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 5, border: '1px solid #e5e7eb', padding: 6, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
          <Users size={8} color="#4F46E5" strokeWidth={2.2} />
          <div style={{ fontSize: 7.5, fontWeight: 700, color: '#0f172a' }}>Recent leads</div>
          <div style={{ marginLeft: 'auto', fontSize: 5.5, color: '#4F46E5', fontWeight: 600 }}>VIEW ALL</div>
        </div>
        {leads.map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, paddingBottom: 2 }}>
            <div style={{
              width: 13, height: 13, borderRadius: '50%', background: '#f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 6, fontWeight: 700, color: '#4F46E5', flexShrink: 0,
            }}>{l.i}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 6.5, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</div>
              <div style={{ fontSize: 5.5, color: '#94a3b8' }}>Healthcare</div>
            </div>
            <div style={{ fontSize: 5.5, color: '#94a3b8', flexShrink: 0 }}>{l.date}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DashboardScreen(): ReactElement {
  return (
    <div style={{
      ...SWITZER, background: '#f8fafc', padding: 10, height: '100%',
      display: 'flex', flexDirection: 'column', gap: 5, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a' }}>Dashboard</div>
          <div style={{ fontSize: 6.5, color: '#94a3b8' }}>Overview of your outreach performance</div>
        </div>
      </div>
      <TopBar />

      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a' }}>Good evening, Iain 👋</div>
        <div style={{ fontSize: 6.5, color: '#6b7280' }}>Friday, 3 April 2026 · Let's make today count.</div>
      </div>

      <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
        <StatCard label="Total Leads" value="271" delta="+0% in last 30 days"
          sparkColor="#22D3EE" type="bars" IconCmp={Users} iconColor="#22D3EE" />
        <StatCard label="Leads with Emails" value="31" delta="+0% verified emails"
          sparkColor="#10b981" type="line" data={[2, 4, 3, 6, 5, 8, 7]} IconCmp={Mail} iconColor="#10b981" />
        <StatCard label="Leads Contacted" value="0" delta="+0% outreach initiated"
          sparkColor="#8b5cf6" type="line" data={[1, 2, 1, 3, 2, 3, 2]} IconCmp={Activity} iconColor="#8b5cf6" />
        <StatCard label="Total Deals" value="10" delta="+0% in pipeline"
          sparkColor="#f43f5e" type="bars" IconCmp={TrendingUp} iconColor="#f43f5e" />
        <PlanCard />
      </div>

      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 120 }}>
        <CampaignPerformanceChart />
        <TopCampaigns />
      </div>

      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 100 }}>
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

  const pill: CSSProperties = {
    border: '1px solid #e2e8f0', borderRadius: 9999, padding: '1px 4px',
    fontSize: 5.5, color: '#64748b', background: 'white', whiteSpace: 'nowrap',
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
      </div>
      <TopBar />

      <div style={{
        width: '100%', border: '1px solid #e2e8f0', borderRadius: 5,
        padding: '4px 8px', fontSize: 7, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <Search size={9} color="#94a3b8" strokeWidth={2} />
        Search leads by name, email, company...
      </div>

      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 3, alignItems: 'center' }}>
        <div style={{ fontSize: 5.5, fontWeight: 700, color: '#94a3b8' }}>SMART</div>
        <div style={pill}>⚡ New Business (271)</div>
        <div style={pill}>⭐ Low Rating (126)</div>
        <div style={pill}>📷 No Photos (271)</div>
        <div style={pill}>💬 No Reviews (271)</div>
        <div style={pill}>📍 Incomplete (240)</div>
        <div style={{ fontSize: 5.5, fontWeight: 700, color: '#94a3b8', marginLeft: 3 }}>INTENT</div>
        <div style={pill}>🔥 Hot (11)</div>
        <div style={pill}>🌡 Warm (9)</div>
        <div style={pill}>❄ Cool (0)</div>
        <div style={pill}>? Unscored (251)</div>
      </div>

      <div style={{
        flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
        border: '1px solid #e5e7eb', borderRadius: 5, overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', padding: '5px 8px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc',
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
            borderBottom: i < rows.length - 1 ? '1px solid #f8fafc' : 'none', flex: 1,
          }}>
            <div style={{ flex: 2, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ fontSize: 7, fontWeight: 600, color: '#4F46E5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.company}</div>
                <div style={{ fontSize: 5, background: '#f0fdf4', color: '#16a34a', borderRadius: 3, padding: '0 3px', fontWeight: 600, flexShrink: 0 }}>ENRICHED</div>
              </div>
              <div style={{ fontSize: 5.5, color: '#94a3b8' }}>{r.role}</div>
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

/* ─────────────── SEQUENCE BUILDER TABS (shared) ─────────────── */

function SequenceTabs({ activeTab }: { activeTab: 'email' | 'linkedin' }): ReactElement {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: 2 }}>
      <div style={{
        padding: '5px 10px', fontSize: 7.5, fontWeight: 500,
        color: activeTab === 'email' ? '#4F46E5' : '#64748b',
        borderBottom: activeTab === 'email' ? '2px solid #4F46E5' : '2px solid transparent',
        display: 'flex', alignItems: 'center', gap: 4, marginBottom: -1,
      }}>
        <Mail size={8} strokeWidth={2.2} />
        Email Sequences
      </div>
      <div style={{
        padding: '5px 10px', fontSize: 7.5, fontWeight: 500,
        color: activeTab === 'linkedin' ? '#4F46E5' : '#64748b',
        borderBottom: activeTab === 'linkedin' ? '2px solid #4F46E5' : '2px solid transparent',
        display: 'flex', alignItems: 'center', gap: 4, marginBottom: -1,
      }}>
        <Linkedin size={8} strokeWidth={2.2} />
        LinkedIn Sequences
        <span style={{
          background: '#4F46E5', color: 'white', borderRadius: 9999,
          fontSize: 6, padding: '0 4px', fontWeight: 700,
        }}>4</span>
      </div>
      <div style={{
        padding: '5px 10px', fontSize: 7.5, fontWeight: 500, color: '#64748b',
        display: 'flex', alignItems: 'center', gap: 4, marginBottom: -1,
      }}>
        <Settings size={8} strokeWidth={2.2} />
        Keyword Monitor
      </div>
    </div>
  )
}

/* ─────────────── SEQUENCE BUILDER — EMAIL TAB ─────────────── */

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
      </div>
      <TopBar />

      <SequenceTabs activeTab="email" />

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

/* ─────────────── LINKEDIN SEQUENCES SCREEN ─────────────── */

function PhaseTracker(): ReactElement {
  const phases = [
    { num: '1', name: 'Silent Awareness', days: 'Day 1-10', active: true },
    { num: '2', name: 'Connection', days: 'Day 12-14' },
    { num: '3', name: 'Warm Thanks', days: 'Day 15-16' },
    { num: '4', name: 'Advice Ask', days: 'Day 20-22' },
    { num: '5', name: 'Follow Up', days: 'Day 25-27' },
    { num: '6', name: 'Soft Offer', days: 'Day 30-35' },
  ]
  return (
    <div style={{
      background: 'white', borderRadius: 5, border: '1px solid #e5e7eb', padding: 8,
      marginBottom: 2,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, position: 'relative' }}>
        {phases.map((p, i) => (
          <div key={i} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            position: 'relative',
          }}>
            {i < phases.length - 1 && (
              <div style={{
                position: 'absolute', top: 9, left: '50%', right: '-50%', height: 1,
                background: '#e2e8f0', zIndex: 0,
              }} />
            )}
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              background: p.active ? '#4F46E5' : 'white',
              border: p.active ? 'none' : '1.5px solid #e2e8f0',
              color: p.active ? 'white' : '#94a3b8',
              fontSize: 7, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', zIndex: 1,
            }}>{p.num}</div>
            <div style={{ fontSize: 6, fontWeight: 600, color: '#0f172a', marginTop: 3, textAlign: 'center' }}>{p.name}</div>
            <div style={{ fontSize: 5.5, color: '#94a3b8', textAlign: 'center' }}>{p.days}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LinkedInSequencesScreen(): ReactElement {
  const prospects = [
    { company: 'Owen Dental Group', name: 'Dr Lewis Owens', phase: 'Phase 1: Silent Awareness', status: 'ACTIVE', day: 4, progress: 11, last: '03/04/2026', paused: false },
    { company: 'London Smile Studio', name: 'Dr Paul Nkemdirim', phase: 'Phase 3: Warm Thanks', status: 'PAUSED', day: 14, progress: 40, last: '29/03/2026', paused: true },
    { company: 'Smile Clinic Northwest', name: 'Dr Amir Patel', phase: 'Phase 3: Warm Thanks', status: 'PAUSED', day: 12, progress: 34, last: '28/03/2026', paused: true },
    { company: 'Blackwell Partners LLP', name: 'Tom Blackwell', phase: 'Phase 2: Connection', status: 'ACTIVE', day: 8, progress: 23, last: '03/04/2026', paused: false },
  ]

  const actionBtn: CSSProperties = {
    border: '1px solid #e2e8f0', borderRadius: 4, padding: '2px 5px',
    fontSize: 6, color: '#64748b', background: 'white', whiteSpace: 'nowrap',
  }

  return (
    <div style={{
      ...SWITZER, background: '#f8fafc', padding: 10, height: '100%',
      display: 'flex', flexDirection: 'column', gap: 5, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a' }}>Sequence Builder</div>
          <div style={{ fontSize: 6.5, color: '#94a3b8' }}>Build automated outreach sequences</div>
        </div>
      </div>
      <TopBar />

      <SequenceTabs activeTab="linkedin" />

      {/* Info banner */}
      <div style={{
        background: '#EEF2FF', border: '1px solid #c7d2fe', borderRadius: 5,
        padding: '5px 8px', display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: 2,
      }}>
        <Info size={9} color="#4F46E5" strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 6, color: '#4F46E5', lineHeight: 1.4 }}>
          Leadomation recommends following the full 35-day sequence. Research shows prospects who receive gradual, value-led outreach are significantly more likely to convert.
        </div>
      </div>

      {/* Phase tracker */}
      <PhaseTracker />

      {/* Prospect cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1, minHeight: 0 }}>
        {prospects.map((p, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: 6, border: '1px solid #e5e7eb',
            padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            {/* Row 1: identity + badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%', background: '#0077B5',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Linkedin size={8} color="white" strokeWidth={2.5} />
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.company}</div>
                <div style={{ fontSize: 6, color: '#4F46E5', fontWeight: 600 }}>View Profile</div>
                <div style={{ fontSize: 6, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <span style={{
                  borderRadius: 9999, padding: '2px 6px', fontSize: 6, fontWeight: 600,
                  background: '#EEF2FF', color: '#4F46E5', border: '1px solid #c7d2fe',
                }}>{p.phase}</span>
                <span style={{
                  borderRadius: 9999, padding: '2px 6px', fontSize: 6, fontWeight: 700,
                  background: p.paused ? '#fef3c7' : '#f0fdf4',
                  color: p.paused ? '#d97706' : '#16a34a',
                  border: `1px solid ${p.paused ? '#fde68a' : '#d1fae5'}`,
                }}>{p.status}</span>
                <div style={actionBtn}>Run now</div>
                <div style={actionBtn}>Next phase</div>
                <div style={actionBtn}>Jump to phase ›</div>
                <div style={actionBtn}>{p.paused ? 'Resume' : 'Pause'}</div>
              </div>
            </div>

            {/* Row 2: progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 6, color: '#94a3b8', flexShrink: 0 }}>Day {p.day} of 35</div>
              <div style={{ flex: 1, height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${p.progress}%`,
                  background: p.paused ? '#0077B5' : '#4F46E5', borderRadius: 2,
                }} />
              </div>
              <div style={{ fontSize: 5.5, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                <CalendarIcon size={7} strokeWidth={2} />
                Last: {p.last}
              </div>
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
    <svg width={13} height={13} viewBox="0 0 24 24" style={style}>
      <path d="M5.5 3.5 L5.5 20 L10 15.5 L13 22 L15.5 20.8 L12.5 14.5 L19 14.5 Z"
        fill="white" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

/* ─────────────── MAIN COMPONENT ─────────────── */

export default function HeroDashboardMockup(): ReactElement {
  const [activeScreen, setActiveScreen] = useState(0)
  const [cursorTop, setCursorTop] = useState(CURSOR_POSITIONS[0].top)
  const [cursorLeft, setCursorLeft] = useState(CURSOR_POSITIONS[0].left)
  const [ripple, setRipple] = useState(false)
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([])

  useEffect(() => {
    let cancelled = false

    const addTimer = (delay: number, fn: () => void) => {
      const id = setTimeout(() => { if (!cancelled) fn() }, delay)
      timersRef.current.push(id)
    }

    const moveCursor = (idx: number) => {
      const pos = CURSOR_POSITIONS[idx]
      setCursorTop(pos.top)
      setCursorLeft(pos.left)
    }

    const fireClick = (screen: number) => {
      setRipple(true)
      setActiveScreen(screen)
      addTimer(350, () => setRipple(false))
    }

    const runCycle = () => {
      if (cancelled) return
      setActiveScreen(0)
      moveCursor(0)

      // Screen 0 → Screen 1
      addTimer(3500, () => moveCursor(1))
      addTimer(4000, () => fireClick(1))

      // Screen 1 → Screen 2 (Email tab)
      addTimer(7500, () => moveCursor(2))
      addTimer(8000, () => fireClick(2))

      // Screen 2 → Screen 3 (LinkedIn tab, same sidebar item)
      addTimer(11500, () => moveCursor(3))
      addTimer(12000, () => fireClick(3))

      // Screen 3 → Screen 0 (loop)
      addTimer(15500, () => moveCursor(0))
      addTimer(16000, () => { fireClick(0); addTimer(400, runCycle) })
    }

    runCycle()

    return () => {
      cancelled = true
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [])

  const screens = [DashboardScreen, LeadDatabaseScreen, SequenceBuilderScreen, LinkedInSequencesScreen]

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
                const isActive = item.activeOn?.includes(activeScreen) ?? false
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
            borderTop: '1px solid #f1f5f9', marginTop: 'auto',
            display: 'flex', alignItems: 'center', gap: 5, padding: '6px 8px 0 8px',
            fontSize: 8, color: '#64748b',
          }}>
            <LogOut size={9} strokeWidth={2.2} />
            Sign Out
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minWidth: 0 }}>
          {screens.map((Screen, i) => (
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

      {/* Cursor overlay */}
      <div style={{
        position: 'absolute',
        top: cursorTop, left: cursorLeft,
        zIndex: 50, pointerEvents: 'none',
        transition: 'top 0.4s cubic-bezier(0.4,0,0.2,1), left 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <CursorArrow style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
        {ripple && (
          <div style={{
            position: 'absolute', top: -3, left: -3,
            width: 18, height: 18, borderRadius: '50%',
            border: '2px solid #4F46E5',
            animation: 'heroMockupRipple 0.35s ease-out forwards',
          }} />
        )}
      </div>

      <style>{`
        @keyframes heroMockupRipple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
