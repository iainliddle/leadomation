import { useEffect, useRef, useState, type ReactElement, type CSSProperties, type RefObject } from 'react'
import {
  LayoutGrid, Globe, Plus, Activity, Users, TrendingUp, Calendar as CalendarIcon,
  Mail, Search, Phone, MessageSquare, FileText, BarChart2, User, Link as LinkIcon,
  Settings, Shield, CreditCard, LogOut, Play, Info, Linkedin,
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

const SWITZER: CSSProperties = { fontFamily: 'Switzer, sans-serif' }

/* ─────────────── DASHBOARD — merged header row ─────────────── */

function DashboardHeader(): ReactElement {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 8,
      flexShrink: 0,
    }}>
      {/* Left: page title */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
          Dashboard
        </div>
        <div style={{ fontSize: 6.5, color: '#94a3b8', marginTop: 1 }}>
          Overview of your outreach performance
        </div>
      </div>

      {/* Right: controls inline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 3,
          border: '1px solid #e2e8f0', borderRadius: 5,
          padding: '2px 6px', fontSize: 6, color: '#475569',
        }}>
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          4 Mar 2026 - 3 Apr 2026
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 3,
          border: '1px solid #e2e8f0', borderRadius: 5,
          padding: '2px 6px', fontSize: 6, color: '#475569',
        }}>
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
        </div>
        <div style={{
          width: 18, height: 18, borderRadius: '50%',
          background: '#f8fafc', border: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <div style={{
          width: 18, height: 18, borderRadius: '50%',
          background: '#f8fafc', border: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 6, fontWeight: 600, color: '#475569' }}>Iain L.</span>
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            background: '#4F46E5', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 6, fontWeight: 700, color: 'white',
          }}>IL</div>
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 3,
          background: '#4F46E5', color: 'white', borderRadius: 5,
          padding: '3px 7px', fontSize: 6.5, fontWeight: 600,
        }}>
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Campaign
        </div>
      </div>
    </div>
  )
}

/* ─────────────── DASHBOARD SUB-COMPONENTS ─────────────── */

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
      border: '1px solid #c7d2fe',
      borderRadius: 5,
      padding: '5px 6px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minWidth: 0,
      overflow: 'hidden',
    }}>
      {/* Top row: label + gauge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 5.5, fontWeight: 700, color: '#4F46E5', letterSpacing: '0.06em', lineHeight: 1.2 }}>
          CURRENT PLAN
        </div>
        <svg width="22" height="22" viewBox="0 0 22 22">
          <circle cx="11" cy="11" r="8" fill="none" stroke="#c7d2fe" strokeWidth="3" />
          <circle cx="11" cy="11" r="8" fill="none" stroke="#4F46E5" strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 8 * 0.14} ${2 * Math.PI * 8 * 0.86}`}
            strokeDashoffset={2 * Math.PI * 8 * 0.25}
            strokeLinecap="round" />
          <text x="11" y="14" textAnchor="middle" fontSize="5" fill="#4F46E5" fontWeight="700">14%</text>
        </svg>
      </div>

      {/* Plan name */}
      <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', lineHeight: 1, marginTop: 2 }}>
        Pro
      </div>

      {/* Subtitle */}
      <div style={{ fontSize: 5.5, color: '#6b7280', marginTop: 1, marginBottom: 3 }}>
        Pro plan active
      </div>

      {/* Manage plan button */}
      <div style={{
        background: '#4F46E5',
        color: 'white',
        fontSize: 5.5,
        fontWeight: 600,
        borderRadius: 3,
        padding: '3px 0',
        textAlign: 'center',
        width: '100%',
      }}>
        Manage plan
      </div>
    </div>
  )
}

function CampaignPerformanceChart(): ReactElement {
  return (
    <div style={{
      flex: 3,
      background: 'white',
      borderRadius: 5,
      border: '1px solid #e5e7eb',
      padding: '6px 8px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minWidth: 0,
      minHeight: 0,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, marginBottom: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span style={{ fontSize: 8, fontWeight: 700, color: '#0f172a' }}>Campaign Performance</span>
        </div>
        <span style={{ fontSize: 5.5, color: '#94a3b8' }}>Last 14 days</span>
      </div>

      {/* SVG chart — takes all available space */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 280 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gCyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gIndigo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[15, 30, 45].map(y => (
            <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="#f1f5f9" strokeWidth="0.5" />
          ))}
          {/* New Leads - green bell curve peak around x=80 */}
          <path d="M0,55 C20,52 40,42 60,28 C80,12 100,15 120,28 C140,42 160,50 180,53 C200,55 240,56 280,56 L280,60 L0,60 Z"
            fill="url(#gGreen)" />
          <path d="M0,55 C20,52 40,42 60,28 C80,12 100,15 120,28 C140,42 160,50 180,53 C200,55 240,56 280,56"
            fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Emails - cyan lower curve */}
          <path d="M0,57 C40,55 80,50 120,52 C160,54 200,55 280,56 L280,60 L0,60 Z"
            fill="url(#gCyan)" />
          <path d="M0,57 C40,55 80,50 120,52 C160,54 200,55 280,56"
            fill="none" stroke="#22D3EE" strokeWidth="1.5" strokeLinejoin="round" />
          {/* AI Calls - indigo flat */}
          <path d="M0,58 C80,57 160,57 280,57 L280,60 L0,60 Z"
            fill="url(#gIndigo)" />
          <path d="M0,58 C80,57 160,57 280,57"
            fill="none" stroke="#4F46E5" strokeWidth="1.5" strokeLinejoin="round" />
          {['21 Mar', '25 Mar', '29 Mar', '1 Apr', '3 Apr'].map((label, i) => (
            <text key={i} x={i * 65} y={59} fontSize="4" fill="#94a3b8">{label}</text>
          ))}
        </svg>
      </div>

      {/* Legend row */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginTop: 3 }}>
        {[
          { color: '#4F46E5', label: 'AI Calls' },
          { color: '#22D3EE', label: 'Emails' },
          { color: '#10b981', label: 'New Leads' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: item.color }} />
            <span style={{ fontSize: 5.5, color: '#64748b' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Stats bar */}
      <div style={{
        display: 'flex',
        borderTop: '1px solid #f1f5f9',
        marginTop: 3,
        paddingTop: 3,
        flexShrink: 0,
      }}>
        {[
          { value: '271', label: 'TOTAL LEADS' },
          { value: '0', label: 'CONTACTED' },
          { value: '0', label: 'QUALIFIED' },
          { value: '10', label: 'DEALS' },
        ].map((stat, i) => (
          <div key={i} style={{
            flex: 1,
            textAlign: 'center',
            borderRight: i < 3 ? '1px solid #f1f5f9' : 'none',
          }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#0f172a' }}>{stat.value}</div>
            <div style={{ fontSize: 4.5, color: '#94a3b8', letterSpacing: '0.05em' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopCampaigns(): ReactElement {
  const rows = [
    { name: 'Dental Clinics - LinkedIn', tag: 'SPECIFIER', tagBg: '#f3e8ff', tagColor: '#9333ea', rate: '6.74%', barWidth: '20%', barColor: '#9333ea' },
    { name: 'Law Firms - Full Pipeline', tag: 'DIRECT', tagBg: '#EEF2FF', tagColor: '#4F46E5', rate: '11.22%', barWidth: '75%', barColor: '#4F46E5' },
    { name: 'Plumbers in Edinburgh', tag: 'DIRECT', tagBg: '#EEF2FF', tagColor: '#4F46E5', rate: '0%', barWidth: '8%', barColor: '#4F46E5' },
    { name: 'Solicitors in Edinburgh', tag: 'DIRECT', tagBg: '#EEF2FF', tagColor: '#4F46E5', rate: '0%', barWidth: '8%', barColor: '#4F46E5' },
  ]
  return (
    <div style={{
      flex: 2,
      background: 'white',
      borderRadius: 5,
      border: '1px solid #e5e7eb',
      padding: '6px 8px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minWidth: 0,
      minHeight: 0,
    }}>
      <div style={{ fontSize: 7.5, fontWeight: 700, color: '#0f172a', marginBottom: 5, flexShrink: 0 }}>
        Top Performing Campaigns
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0 }}>
        {rows.map((campaign, i) => (
          <div key={i} style={{
            paddingBottom: 3,
            borderBottom: i < rows.length - 1 ? '1px solid #f8fafc' : 'none',
            marginBottom: 2,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 7, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{campaign.name}</span>
              <span style={{ fontSize: 7, fontWeight: 700, color: '#0f172a', marginLeft: 4 }}>{campaign.rate}</span>
            </div>
            <div style={{
              display: 'inline-block', fontSize: 5, borderRadius: 3,
              padding: '0 3px', background: campaign.tagBg, color: campaign.tagColor,
              fontWeight: 600, marginTop: 1, marginBottom: 2,
            }}>
              {campaign.tag}
            </div>
            <div style={{ height: 2.5, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: campaign.barWidth, background: campaign.barColor, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 5.5, color: '#4F46E5', textAlign: 'right', marginTop: 2, flexShrink: 0, fontWeight: 600 }}>
        VIEW ALL CAMPAIGNS
      </div>
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
  ]
  return (
    <div style={{
      background: 'white', borderRadius: 5, border: '1px solid #e5e7eb', padding: 6,
      flex: 3, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden', minHeight: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, flexShrink: 0 }}>
        <Activity size={8} color="#4F46E5" strokeWidth={2.2} />
        <div style={{ fontSize: 7.5, fontWeight: 700, color: '#0f172a' }}>Recent Activity</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
          <div style={{ fontSize: 5.5, color: '#22c55e', fontWeight: 600 }}>Live Feed</div>
        </div>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, paddingBottom: 2 }}>
          <div style={{
            width: 11, height: 11, borderRadius: '50%', background: '#EEF2FF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 5, fontWeight: 700, color: '#4F46E5', flexShrink: 0,
          }}>{r.initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 6, color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.text}</div>
            <div style={{ fontSize: 5, color: '#94a3b8' }}>{r.time}</div>
          </div>
          <div style={{
            fontSize: 5, color: r.statusColor, fontWeight: 700, flexShrink: 0,
            padding: '0 3px',
          }}>{r.status}</div>
        </div>
      ))}
    </div>
  )
}

function UpcomingAndLeads(): ReactElement {
  const events = [
    { name: 'Follow-up Call - Claire Donovan', meta: 'Fri 3 Apr · 09:00-10:00', accent: '#10b981' },
    { name: 'Quarterly Review - Internal', meta: 'Fri 3 Apr · 12:00-13:30', accent: '#4F46E5' },
  ]
  const leads = [
    { i: 'D', name: 'Dunmore Dental Care', date: '26/03/2026' },
    { i: 'O', name: 'Owen Dental Group', date: '25/03/2026' },
    { i: 'B', name: 'Bright Smile Kent', date: '25/03/2026' },
  ]
  return (
    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, minHeight: 0 }}>
      <div style={{ background: 'white', borderRadius: 5, border: '1px solid #e5e7eb', padding: 6, flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
          <CalendarIcon size={8} color="#4F46E5" strokeWidth={2.2} />
          <div style={{ fontSize: 7, fontWeight: 700, color: '#0f172a' }}>Upcoming events</div>
          <div style={{ marginLeft: 'auto', fontSize: 5, color: '#4F46E5', fontWeight: 600 }}>VIEW CALENDAR</div>
        </div>
        {events.map((e, i) => (
          <div key={i} style={{ borderLeft: `2.5px solid ${e.accent}`, paddingLeft: 3, marginBottom: 2 }}>
            <div style={{ fontSize: 6, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</div>
            <div style={{ fontSize: 5, color: '#94a3b8' }}>{e.meta}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 5, border: '1px solid #e5e7eb', padding: 6, flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
          <Users size={8} color="#4F46E5" strokeWidth={2.2} />
          <div style={{ fontSize: 7, fontWeight: 700, color: '#0f172a' }}>Recent leads</div>
          <div style={{ marginLeft: 'auto', fontSize: 5, color: '#4F46E5', fontWeight: 600 }}>VIEW ALL</div>
        </div>
        {leads.map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, paddingBottom: 2 }}>
            <div style={{
              width: 11, height: 11, borderRadius: '50%', background: '#f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 5, fontWeight: 700, color: '#4F46E5', flexShrink: 0,
            }}>{l.i}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 6, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</div>
              <div style={{ fontSize: 5, color: '#94a3b8' }}>Healthcare</div>
            </div>
            <div style={{ fontSize: 5, color: '#94a3b8', flexShrink: 0 }}>{l.date}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────── SCREEN 0: DASHBOARD ─────────────── */

function DashboardScreen(): ReactElement {
  return (
    <div style={{
      ...SWITZER,
      background: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      padding: '8px 10px',
      gap: 4,
      boxSizing: 'border-box',
    }}>
      <DashboardHeader />

      <div style={{ flexShrink: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a' }}>Good evening, Iain 👋</div>
        <div style={{ fontSize: 6.5, color: '#6b7280' }}>Friday, 3 April 2026 · Let's make today count.</div>
      </div>

      <div style={{ display: 'flex', gap: 5, flexShrink: 0, height: 72 }}>
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

      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0, maxHeight: 160 }}>
        <CampaignPerformanceChart />
        <TopCampaigns />
      </div>

      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0, maxHeight: 125, overflow: 'hidden' }}>
        <RecentActivity />
        <UpcomingAndLeads />
      </div>
    </div>
  )
}

/* ─────────────── SCREEN 1: LEAD DATABASE ─────────────── */

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Lead Database</div>
          <div style={{ fontSize: 6.5, color: '#94a3b8', marginTop: 1 }}>Manage and track all your leads</div>
        </div>
        <div style={{
          background: '#4F46E5', color: 'white', fontSize: 7, fontWeight: 600,
          borderRadius: 5, padding: '3px 8px',
        }}>+ Add Lead</div>
      </div>

      <div style={{
        width: '100%', border: '1px solid #e2e8f0', borderRadius: 5,
        padding: '4px 8px', fontSize: 7, color: '#94a3b8',
        display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
      }}>
        <Search size={9} color="#94a3b8" strokeWidth={2} />
        Search leads by name, email, company...
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 5, alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: 5.5, fontWeight: 700, color: '#94a3b8' }}>SMART</div>
        <div style={pill}>⚡ New Business (271)</div>
        <div style={pill}>⭐ Low Rating (126)</div>
        <div style={pill}>📷 No Photos (271)</div>
        <div style={pill}>💬 No Reviews (271)</div>
        <div style={pill}>📍 Incomplete (240)</div>
        <div style={{ fontSize: 5.5, fontWeight: 700, color: '#94a3b8', marginLeft: 3 }}>INTENT</div>
        <div style={pill}>🔥 Hot (11)</div>
        <div style={pill}>🌡 Warm (9)</div>
      </div>

      <div style={{
        flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
        border: '1px solid #e5e7eb', borderRadius: 5, overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', padding: '4px 8px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', flexShrink: 0,
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
            display: 'flex', alignItems: 'center', padding: '3px 8px',
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

/* ─────────────── SEQUENCE TABS (shared) ─────────────── */

function SequenceTabs({ activeTab }: { activeTab: 'email' | 'linkedin' }): ReactElement {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: 2, flexShrink: 0 }}>
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

/* ─────────────── SCREEN 2: SEQUENCE BUILDER (EMAIL) ─────────────── */

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Sequence Builder</div>
          <div style={{ fontSize: 6.5, color: '#94a3b8', marginTop: 1 }}>Build automated outreach sequences</div>
        </div>
        <div style={{
          background: '#4F46E5', color: 'white', fontSize: 7, fontWeight: 600,
          borderRadius: 5, padding: '3px 8px',
        }}>+ New Sequence</div>
      </div>

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

/* ─────────────── SCREEN 3: LINKEDIN SEQUENCES ─────────────── */

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
      marginBottom: 2, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, position: 'relative' }}>
        {phases.map((p, i) => (
          <div key={i} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative',
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Sequence Builder</div>
          <div style={{ fontSize: 6.5, color: '#94a3b8', marginTop: 1 }}>Build automated outreach sequences</div>
        </div>
        <div style={{
          background: '#4F46E5', color: 'white', fontSize: 7, fontWeight: 600,
          borderRadius: 5, padding: '3px 8px',
        }}>+ New Sequence</div>
      </div>

      <SequenceTabs activeTab="linkedin" />

      <div style={{
        background: '#EEF2FF', border: '1px solid #c7d2fe', borderRadius: 5,
        padding: '5px 8px', display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: 2, flexShrink: 0,
      }}>
        <Info size={9} color="#4F46E5" strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 6, color: '#4F46E5', lineHeight: 1.4 }}>
          Leadomation recommends following the full 35-day sequence. Research shows prospects who receive gradual, value-led outreach are significantly more likely to convert.
        </div>
      </div>

      <PhaseTracker />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1, minHeight: 0 }}>
        {prospects.map((p, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: 6, border: '1px solid #e5e7eb',
            padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4,
          }}>
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
  const [cursorTop, setCursorTop] = useState(50)
  const [cursorLeft, setCursorLeft] = useState(20)
  const [ripple, setRipple] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const dashboardItemRef = useRef<HTMLDivElement>(null)
  const leadDbItemRef = useRef<HTMLDivElement>(null)
  const sequenceItemRef = useRef<HTMLDivElement>(null)

  const getCursorPosition = (itemRef: RefObject<HTMLDivElement | null>) => {
    if (!containerRef.current || !itemRef.current) return { top: 50, left: 20 }
    const containerRect = containerRef.current.getBoundingClientRect()
    const itemRect = itemRef.current.getBoundingClientRect()
    return {
      top: itemRect.top - containerRect.top + itemRect.height / 2 - 4,
      left: itemRect.left - containerRect.left + 8,
    }
  }

  const moveToItem = (ref: RefObject<HTMLDivElement | null>) => {
    const pos = getCursorPosition(ref)
    setCursorTop(pos.top)
    setCursorLeft(pos.left)
  }

  useEffect(() => {
    let cancelled = false
    let timeouts: Array<ReturnType<typeof setTimeout>> = []

    const addTimer = (delay: number, fn: () => void) => {
      const id = setTimeout(() => { if (!cancelled) fn() }, delay)
      timeouts.push(id)
    }

    const fireClick = (screen: number) => {
      setRipple(true)
      addTimer(350, () => setRipple(false))
      setActiveScreen(screen)
    }

    const runCycle = () => {
      if (cancelled) return

      // Screen 0 → 1
      addTimer(3500, () => moveToItem(leadDbItemRef))
      addTimer(4000, () => fireClick(1))

      // Screen 1 → 2 (Sequence Builder, Email tab)
      addTimer(7500, () => moveToItem(sequenceItemRef))
      addTimer(8000, () => fireClick(2))

      // Screen 2 → 3 (Sequence Builder, LinkedIn tab — cursor refocuses same item)
      addTimer(11500, () => moveToItem(sequenceItemRef))
      addTimer(12000, () => fireClick(3))

      // Screen 3 → 0 (Dashboard)
      addTimer(15500, () => moveToItem(dashboardItemRef))
      addTimer(16000, () => { fireClick(0); addTimer(400, () => {
        timeouts.forEach(clearTimeout)
        timeouts = []
        runCycle()
      }) })
    }

    // Settle initial cursor once refs are mounted
    const initId = setTimeout(() => {
      if (!cancelled) moveToItem(dashboardItemRef)
    }, 100)

    runCycle()

    return () => {
      cancelled = true
      clearTimeout(initId)
      timeouts.forEach(clearTimeout)
      timeouts = []
    }
  }, [])

  const screens = [DashboardScreen, LeadDatabaseScreen, SequenceBuilderScreen, LinkedInSequencesScreen]

  return (
    <div ref={containerRef} style={{
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
                const itemRef =
                  item.label === 'Dashboard' ? dashboardItemRef
                  : item.label === 'Lead Database' ? leadDbItemRef
                  : item.label === 'Sequence Builder' ? sequenceItemRef
                  : undefined
                return (
                  <div key={ii} ref={itemRef} style={{
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

      {/* Cursor */}
      <div style={{
        position: 'absolute',
        top: cursorTop, left: cursorLeft,
        zIndex: 50, pointerEvents: 'none',
        transition: 'top 0.4s cubic-bezier(0.4,0,0.2,1), left 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <CursorArrow style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
      </div>

      {/* Ripple */}
      {ripple && (
        <div style={{
          position: 'absolute',
          top: cursorTop,
          left: cursorLeft,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: 'rgba(79,70,229,0.3)',
          transformOrigin: 'center',
          animation: 'rippleExpand 0.35s ease-out forwards',
          pointerEvents: 'none',
          zIndex: 49,
        }} />
      )}
    </div>
  )
}
