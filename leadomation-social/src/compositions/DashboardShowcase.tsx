import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring, Img, staticFile,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { SocialBackground } from '../components/SocialBackground';
import {
  LayoutDashboard, Globe, Plus, Zap, Users, TrendingUp, CalendarDays,
  Mail, Target, Phone, Inbox, FileText, LogOut, MessageCircle, BarChart2,
  Trophy, ChevronRight, User, Link, Settings, Shield, CreditCard,
  Activity, Calendar,
} from 'lucide-react';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

/* ── Chart data (0-8 scale) ── */
const NL = [0, 0, 2, 5, 3.5, 1, 6, 3, 0.5, 4.5, 2, 1.5, 3, 0.5];
const AI = [0, 0.5, 1, 0.8, 2, 3.5, 1.5, 4, 5.5, 3, 2, 3.5, 1.5, 0.5];
const EM = [0.5, 1, 2.5, 2, 3.5, 2, 3, 3.5, 2, 4, 2.5, 3, 4.5, 2.5];

function buildChartPath(data: number[]): { line: string; area: string } {
  const W = 240;
  const pts = data.map((v, i) => ({
    x: i * (W / 13),
    y: 53 - (v / 8) * 46,
  }));
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 2] ?? pts[i - 1];
    const p1 = pts[i - 1];
    const p2 = pts[i];
    const p3 = pts[i + 1] ?? pts[i];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return { line: d, area: `${d} L${pts[pts.length - 1].x},53 L${pts[0].x},53 Z` };
}

const nlPath = buildChartPath(NL);
const aiPath = buildChartPath(AI);
const emPath = buildChartPath(EM);

/* ── Tiny inline components ── */
const NavItem: React.FC<{
  icon: React.ReactNode; label: string; active?: boolean; badge?: string;
}> = ({ icon, label, active, badge }) => (
  <div style={{
    position: 'relative', display: 'flex', alignItems: 'center', gap: 5,
    padding: '4px 8px', margin: '0 4px', borderRadius: 5,
    fontSize: 9, fontWeight: active ? 500 : 400,
    background: active ? '#EEF2FF' : 'transparent',
    color: active ? '#4F46E5' : '#6B7280',
  }}>
    {active && (
      <div style={{
        position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)',
        width: 2, height: 13, background: '#4F46E5', borderRadius: 1,
      }} />
    )}
    {icon}
    <span>{label}</span>
    {badge && (
      <span style={{
        marginLeft: 'auto', background: '#4F46E5', color: 'white',
        borderRadius: 8, fontSize: 7, padding: '0 4px', fontWeight: 600,
      }}>{badge}</span>
    )}
  </div>
);

const SectionLabel: React.FC<{ text: string }> = ({ text }) => (
  <div style={{
    color: '#9CA3AF', fontSize: 6, textTransform: 'uppercase',
    letterSpacing: 1, padding: '4px 12px 2px', fontWeight: 600,
  }}>{text}</div>
);

/* ── Bar sparkline (card 1) ── */
const BarSparkline: React.FC<{ bars: number[]; color: string }> = ({ bars, color }) => (
  <div style={{
    position: 'absolute', bottom: 6, right: 6,
    width: 20, height: 10, display: 'flex', alignItems: 'flex-end', gap: 1,
  }}>
    {bars.map((h, i) => (
      <div key={i} style={{ width: 2, height: h, background: color, borderRadius: 0.5 }} />
    ))}
  </div>
);

/* ── Area sparkline (cards 2-4) ── */
const AreaSparkline: React.FC<{ color: string; d: string }> = ({ color, d }) => (
  <svg viewBox="0 0 20 10" style={{ position: 'absolute', bottom: 6, right: 6, width: 20, height: 10 }} preserveAspectRatio="none">
    <path d={d} fill={color} fillOpacity={0.15} />
    <path d={d.split(' L')[0]} fill="none" stroke={color} strokeWidth={1} />
  </svg>
);

/* ── Donut ring (card 5) ── */
const DonutRing: React.FC = () => {
  const r = 9;
  const circ = 2 * Math.PI * r;
  const filled = circ * 0.14;
  return (
    <svg width={24} height={24} viewBox="0 0 24 24">
      <circle cx={12} cy={12} r={r} fill="none" stroke="#E5E7EB" strokeWidth={3} />
      <circle cx={12} cy={12} r={r} fill="none" stroke="#4F46E5" strokeWidth={3}
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeDashoffset={circ * 0.25} strokeLinecap="round" />
    </svg>
  );
};

export const DashboardShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Animation helpers ── */
  const fadeUp = (delay: number) => {
    const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });
    return { opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)` };
  };
  const scaleIn = (delay: number) => {
    const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });
    return { opacity: interpolate(s, [0, 1], [0, 1]), transform: `scale(${interpolate(s, [0, 1], [0.92, 1])})` };
  };
  const fadeIn = (start: number, dur: number) => ({
    opacity: interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  });
  const slideY = (delay: number) => {
    const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });
    return { opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateY(${interpolate(s, [0, 1], [10, 0])}px)` };
  };

  /* Zone 2 card spring */
  const cardS = spring({ frame: Math.max(0, frame - 35), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 45 });
  const cardStyle = {
    opacity: interpolate(cardS, [0, 1], [0, 1]),
    transform: `scale(${interpolate(cardS, [0, 1], [0.93, 1])})`,
    transformOrigin: 'top center' as const,
  };

  /* Zone 3 spring */
  const z3S = spring({ frame: Math.max(0, frame - 248), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });

  /* Zone 4 fade */
  const z4Op = interpolate(frame, [262, 277], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ fontFamily, overflow: 'hidden' }}>
      <SocialBackground />

      {/* ══════════ ZONE 1 - Logo + Headline ══════════ */}
      <div style={{ position: 'absolute', top: 44, left: 0, right: 0, textAlign: 'center', paddingBottom: 8 }}>
        <div style={fadeUp(0)}>
          <Img src={staticFile('logo.png')} style={{ height: 42, width: 'auto', display: 'block', margin: '0 auto' }} />
        </div>
        <div style={{ ...fadeUp(0), marginTop: 16 }}>
          <div style={{ fontSize: 52, fontWeight: 800, color: 'white', lineHeight: 1.05, letterSpacing: -2 }}>
            Every campaign. Every result.
          </div>
        </div>
        <div style={{ ...fadeUp(12), marginTop: -2 }}>
          <div style={{ fontSize: 52, fontWeight: 800, color: '#22D3EE', lineHeight: 1.05, letterSpacing: -2 }}>
            One dashboard.
          </div>
        </div>
        <div style={{ ...fadeUp(24), marginTop: 6 }}>
          <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
            Live right now inside Leadomation.
          </div>
        </div>
      </div>

      {/* ══════════ ZONE 2 - Browser Mockup Card ══════════ */}
      <div style={{
        position: 'absolute', top: 270, left: 24, right: 24, height: 560,
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 28px 80px rgba(0,0,0,0.45)',
        ...cardStyle, zIndex: 20,
      }}>

        {/* ── Browser chrome bar ── */}
        <div style={{
          height: 34, background: '#F3F4F6', borderBottom: '1px solid #E5E7EB',
          display: 'flex', alignItems: 'center', padding: '0 12px', gap: 6, flexShrink: 0,
        }}>
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: 5 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#FF5F57' }} />
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#FEBC2E' }} />
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#28C840' }} />
          </div>
          {/* Address bar */}
          <div style={{
            flex: 1, margin: '0 12px', background: 'white', borderRadius: 4,
            height: 18, display: 'flex', alignItems: 'center', padding: '0 8px', gap: 4,
          }}>
            <svg width={7} height={7} viewBox="0 0 16 16" fill="none">
              <rect x={3} y={7} width={10} height={7} rx={1.5} fill="#9CA3AF" />
              <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="#9CA3AF" strokeWidth={1.5} fill="none" />
            </svg>
            <span style={{ fontSize: 8, color: '#374151', fontWeight: 500 }}>leadomation.co.uk/dashboard</span>
          </div>
        </div>

        {/* ── Dashboard content below chrome ── */}
        <div style={{ display: 'flex', flexDirection: 'row', height: 'calc(100% - 34px)', background: 'white', overflow: 'hidden' }}>

          {/* ── Left sidebar (static) ── */}
          <div style={{
            width: 150, minWidth: 150, background: 'white', borderRight: '1px solid #E5E7EB',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0,
          }}>
            {/* Sidebar header */}
            <div style={{ padding: '10px 10px 8px' }}>
              <Img src={staticFile('logo-full.png')} style={{ height: 18, width: 'auto' }} />
              <div style={{ color: '#9CA3AF', fontSize: 7, marginTop: 3, fontWeight: 500 }}>B2B Outreach Platform</div>
              <div style={{ borderBottom: '1px solid #F3F4F6', marginBottom: 4, marginTop: 8 }} />
            </div>

            {/* Nav sections */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <SectionLabel text="MAIN" />
              <NavItem icon={<LayoutDashboard size={9} color="#4F46E5" />} label="Dashboard" active />
              <NavItem icon={<Globe size={9} color="#9CA3AF" />} label="Global Demand" />

              <SectionLabel text="CAMPAIGNS" />
              <NavItem icon={<Plus size={9} color="#9CA3AF" />} label="New Campaign" />
              <NavItem icon={<Zap size={9} color="#9CA3AF" />} label="Active Campaigns" />

              <SectionLabel text="LEADS" />
              <NavItem icon={<Users size={9} color="#9CA3AF" />} label="Lead Database" badge="271" />

              <SectionLabel text="CRM" />
              <NavItem icon={<TrendingUp size={9} color="#9CA3AF" />} label="Deal Pipeline" badge="10" />
              <NavItem icon={<CalendarDays size={9} color="#9CA3AF" />} label="Calendar" />

              <SectionLabel text="OUTREACH" />
              <NavItem icon={<Mail size={9} color="#9CA3AF" />} label="Sequence Builder" />
              <NavItem icon={<Target size={9} color="#9CA3AF" />} label="Keyword Monitor" />
              <NavItem icon={<Phone size={9} color="#9CA3AF" />} label="Call Agent" />
              <NavItem icon={<Inbox size={9} color="#9CA3AF" />} label="Inbox" badge="12" />
              <NavItem icon={<FileText size={9} color="#9CA3AF" />} label="Email Templates" />

              <SectionLabel text="ANALYTICS" />
              <NavItem icon={<TrendingUp size={9} color="#9CA3AF" />} label="Performance" />

              <SectionLabel text="SETTINGS" />
              <NavItem icon={<User size={9} color="#9CA3AF" />} label="My Profile" />
              <NavItem icon={<Link size={9} color="#9CA3AF" />} label="Integrations" />
              <NavItem icon={<Settings size={9} color="#9CA3AF" />} label="Email Config" />
              <NavItem icon={<Shield size={9} color="#9CA3AF" />} label="Compliance" />
              <NavItem icon={<CreditCard size={9} color="#9CA3AF" />} label="Pricing and Plans" />
            </div>

            {/* Sign out */}
            <div style={{ borderTop: '1px solid #E5E7EB', marginTop: 'auto', padding: '6px 0' }}>
              <div style={{
                color: '#9CA3AF', fontSize: 9, display: 'flex', alignItems: 'center',
                gap: 6, padding: '0 10px', fontWeight: 500,
              }}>
                <LogOut size={9} /> Sign Out
              </div>
            </div>
          </div>

          {/* ── Main scrolling content area ── */}
          <div style={{
            flex: 1, overflow: 'hidden', position: 'relative', background: '#F8F9FA',
          }}>

            {/* Static content div */}
            <div style={{
              padding: '10px 12px',
              width: '100%',
            }}>

              {/* Section 1 - Greeting */}
              <div>
                <div style={{ color: '#111827', fontSize: 11, fontWeight: 700 }}>Good morning, Iain 👋</div>
                <div style={{ color: '#6B7280', fontSize: 7, marginTop: 2 }}>Tuesday, 31 March 2026 - Let's make today count.</div>
              </div>

              {/* Section 2 - 5 stat cards */}
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>

                {/* Card 1 - Total Leads */}
                <div style={{ background: 'white', borderRadius: 7, border: '1px solid #E5E7EB', padding: '7px 8px', flex: 1, position: 'relative', ...scaleIn(50) }}>
                  <div style={{ background: '#ECFEFF', borderRadius: 4, width: 13, height: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={9} color="#0891B2" />
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: 5.5, marginTop: 3, fontWeight: 600 }}>Total Leads</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <div style={{ color: '#111827', fontSize: 12, fontWeight: 700 }}>271</div>
                    <div style={{ color: '#059669', fontSize: 5.5, fontWeight: 600 }}>+0%</div>
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: 5 }}>in last 30 days</div>
                  <BarSparkline bars={[3, 5, 2, 6, 4]} color="#22D3EE" />
                </div>

                {/* Card 2 - Leads with Emails */}
                <div style={{ background: 'white', borderRadius: 7, border: '1px solid #E5E7EB', padding: '7px 8px', flex: 1, position: 'relative', ...scaleIn(60) }}>
                  <div style={{ background: '#ECFDF5', borderRadius: 4, width: 13, height: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={9} color="#059669" />
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: 5.5, marginTop: 3, fontWeight: 600 }}>Leads with Emails</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <div style={{ color: '#111827', fontSize: 12, fontWeight: 700 }}>31</div>
                  </div>
                  <AreaSparkline color="#10B981" d="M0,8 L4,5 L8,6 L12,3 L16,5 L20,2 L20,10 L0,10 Z" />
                </div>

                {/* Card 3 - Leads Contacted */}
                <div style={{ background: 'white', borderRadius: 7, border: '1px solid #E5E7EB', padding: '7px 8px', flex: 1, position: 'relative', ...scaleIn(70) }}>
                  <div style={{ background: '#F5F3FF', borderRadius: 4, width: 13, height: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageCircle size={9} color="#7C3AED" />
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: 5.5, marginTop: 3, fontWeight: 600 }}>Leads Contacted</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <div style={{ color: '#111827', fontSize: 12, fontWeight: 700 }}>0</div>
                  </div>
                  <AreaSparkline color="#8B5CF6" d="M0,7 L4,6 L8,8 L12,5 L16,7 L20,4 L20,10 L0,10 Z" />
                </div>

                {/* Card 4 - Total Deals */}
                <div style={{ background: 'white', borderRadius: 7, border: '1px solid #E5E7EB', padding: '7px 8px', flex: 1, position: 'relative', ...scaleIn(80) }}>
                  <div style={{ background: '#FFF1F2', borderRadius: 4, width: 13, height: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={9} color="#F43F5E" />
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: 5.5, marginTop: 3, fontWeight: 600 }}>Total Deals</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <div style={{ color: '#111827', fontSize: 12, fontWeight: 700 }}>10</div>
                  </div>
                  <AreaSparkline color="#F43F5E" d="M0,6 L4,4 L8,7 L12,3 L16,5 L20,2 L20,10 L0,10 Z" />
                </div>

                {/* Card 5 - Current Plan */}
                <div style={{
                  background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', borderRadius: 7,
                  border: '1px solid #C7D2FE', padding: '7px 8px', flex: 1,
                  display: 'flex', flexDirection: 'column', ...scaleIn(90),
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Img src={staticFile('logo-icon.png')} style={{ width: 10, height: 10 }} />
                    <span style={{ color: '#4F46E5', fontSize: 5.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Current plan</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <DonutRing />
                    <div>
                      <div style={{ color: '#111827', fontSize: 10, fontWeight: 700 }}>Pro</div>
                      <div style={{ color: '#6B7280', fontSize: 5 }}>Pro plan active</div>
                    </div>
                  </div>
                  <div style={{
                    background: '#4F46E5', color: 'white', borderRadius: 3,
                    fontSize: 5, padding: '2px 0', width: '100%', textAlign: 'center',
                    fontWeight: 600, marginTop: 3,
                  }}>Manage plan</div>
                </div>
              </div>

              {/* Section 3 - Charts row */}
              <div style={{ display: 'flex', gap: 6, marginTop: 6, ...fadeIn(110, 20) }}>

                {/* Left - Campaign Performance (59%) */}
                <div style={{
                  width: '59%', background: 'white', borderRadius: 7,
                  border: '1px solid #E5E7EB', padding: '8px 10px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <BarChart2 size={8} color="#4F46E5" />
                    <span style={{ color: '#111827', fontSize: 9, fontWeight: 700 }}>Campaign Performance</span>
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: 6, marginLeft: 12 }}>Last 14 days</div>

                  {/* SVG area chart */}
                  <svg viewBox="0 0 240 56" style={{ width: '100%', height: 56, marginTop: 4 }} preserveAspectRatio="none">
                    {/* Gridlines */}
                    {[11, 23, 35, 47].map((y) => (
                      <line key={y} x1={0} y1={y} x2={240} y2={y} stroke="#F3F4F6" strokeWidth={0.5} />
                    ))}
                    <line x1={0} y1={53} x2={240} y2={53} stroke="#E5E7EB" strokeWidth={0.5} />
                    {/* New Leads */}
                    <path d={nlPath.area} fill="rgba(16,185,129,0.12)" />
                    <path d={nlPath.line} fill="none" stroke="#10B981" strokeWidth={1.5} />
                    {/* AI Calls */}
                    <path d={aiPath.area} fill="rgba(99,102,241,0.10)" />
                    <path d={aiPath.line} fill="none" stroke="#6366F1" strokeWidth={1.5} />
                    {/* Emails */}
                    <path d={emPath.area} fill="rgba(6,182,212,0.10)" />
                    <path d={emPath.line} fill="none" stroke="#06B6D4" strokeWidth={1.5} />
                  </svg>

                  {/* X axis labels */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    {['18 Mar', '20 Mar', '22 Mar', '24 Mar', '26 Mar', '28 Mar', '31 Mar'].map((d) => (
                      <span key={d} style={{ fontSize: 5, color: '#9CA3AF' }}>{d}</span>
                    ))}
                  </div>

                  {/* Legend */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 3, justifyContent: 'center' }}>
                    {[
                      { color: '#6366F1', label: 'AI Calls' },
                      { color: '#06B6D4', label: 'Emails' },
                      { color: '#10B981', label: 'New Leads' },
                    ].map((l) => (
                      <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: l.color }} />
                        <span style={{ fontSize: 6, color: '#6B7280' }}>{l.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Funnel row */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 2, marginTop: 5,
                    paddingTop: 5, borderTop: '1px solid #F3F4F6',
                  }}>
                    {[
                      { n: '271', l: 'TOTAL LEADS' },
                      { n: '0', l: 'CONTACTED' },
                      { n: '0', l: 'QUALIFIED' },
                      { n: '10', l: 'DEALS' },
                    ].map((item, i, arr) => (
                      <React.Fragment key={i}>
                        <div style={{
                          background: '#F9FAFB', borderRadius: 3, padding: '2px 4px',
                          flex: 1, textAlign: 'center',
                        }}>
                          <div style={{ color: '#111827', fontSize: 8, fontWeight: 700 }}>{item.n}</div>
                          <div style={{ color: '#9CA3AF', fontSize: 5, textTransform: 'uppercase' }}>{item.l}</div>
                        </div>
                        {i < arr.length - 1 && <ChevronRight size={5} color="#D1D5DB" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Right - Top Performing Campaigns (41%) */}
                <div style={{
                  width: '41%', background: 'white', borderRadius: 7,
                  border: '1px solid #E5E7EB', padding: '8px 10px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 7 }}>
                    <Trophy size={8} color="#4F46E5" />
                    <span style={{ color: '#111827', fontSize: 8, fontWeight: 700 }}>Top Performing Campaigns</span>
                  </div>

                  {[
                    { name: 'Dental Clinics - LinkedIn', type: 'SPECIFIER', typeBg: '#F5F3FF', typeColor: '#7C3AED', pct: '6.74%', w: '89%', barColor: '#7C3AED', delay: 118 },
                    { name: 'Law Firms - Full Pipeline', type: 'DIRECT', typeBg: '#EFF6FF', typeColor: '#2563EB', pct: '11.22%', w: '96%', barColor: '#2563EB', delay: 126 },
                    { name: 'UK Hotels - Q2 Outreach', type: 'DIRECT', typeBg: '#EFF6FF', typeColor: '#2563EB', pct: '8.36%', w: '72%', barColor: '#2563EB', delay: 134 },
                  ].map((c, i) => (
                    <div key={i} style={{ marginBottom: 8, ...slideY(c.delay) }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
                          <span style={{ color: '#111827', fontSize: 7.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                          <span style={{
                            background: c.typeBg, color: c.typeColor, fontSize: 5.5,
                            padding: '1.5px 5px', borderRadius: 8, fontWeight: 700,
                            textTransform: 'uppercase', whiteSpace: 'nowrap',
                          }}>{c.type}</span>
                        </div>
                        <span style={{ color: '#111827', fontSize: 7.5, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 4 }}>{c.pct}</span>
                      </div>
                      <div style={{ width: '100%', height: 2.5, background: '#F3F4F6', borderRadius: 1.5, marginTop: 3 }}>
                        <div style={{ width: c.w, height: '100%', background: c.barColor, borderRadius: 1.5 }} />
                      </div>
                    </div>
                  ))}

                  <div style={{
                    color: '#4F46E5', fontSize: 6, fontWeight: 700, textAlign: 'center',
                    marginTop: 6, paddingTop: 6, borderTop: '1px solid #F3F4F6',
                  }}>VIEW ALL CAMPAIGNS</div>
                </div>
              </div>

              {/* Section 4 - Recent Activity + Upcoming Events */}
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>

                {/* Left - Recent Activity (59%) */}
                <div style={{
                  width: '59%', background: 'white', borderRadius: 7,
                  border: '1px solid #E5E7EB', padding: '6px 8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Activity size={8} color="#4F46E5" />
                      <span style={{ color: '#111827', fontSize: 8, fontWeight: 700 }}>Recent Activity</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#ECFDF5', borderRadius: 8, padding: '1px 4px' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981' }} />
                      <span style={{ color: '#059669', fontSize: 6, fontWeight: 600 }}>Live Feed</span>
                    </div>
                  </div>

                  {[
                    { initials: 'SC', text: 'AI call to Smile Clinic Northwest', time: '2d ago', badge: 'COMPLETED', badgeBg: '#ECFDF5', badgeColor: '#059669' },
                    { initials: 'DD', text: 'New lead: Dunmore Dental Care', time: '5d ago', badge: 'NEW', badgeBg: '#ECFDF5', badgeColor: '#059669' },
                    { initials: 'FL', text: 'Lead qualified: Fletcher Law Group', time: '6d ago', badge: 'QUALIFIED', badgeBg: '#F5F3FF', badgeColor: '#7C3AED' },
                    { initials: 'TG', text: 'AI call to The Grand Manchester', time: '8d ago', badge: 'COMPLETED', badgeBg: '#ECFDF5', badgeColor: '#059669' },
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 5, padding: '3px 0',
                      borderBottom: i < 3 ? '1px solid #F9FAFB' : 'none',
                    }}>
                      <div style={{
                        width: 15, height: 15, borderRadius: '50%', background: '#EEF2FF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <span style={{ color: '#4F46E5', fontSize: 5.5, fontWeight: 700 }}>{row.initials}</span>
                      </div>
                      <span style={{ color: '#111827', fontSize: 7, flex: 1 }}>{row.text}</span>
                      <span style={{ color: '#9CA3AF', fontSize: 6, flexShrink: 0 }}>{row.time}</span>
                      <span style={{
                        background: row.badgeBg, color: row.badgeColor,
                        fontSize: 5.5, fontWeight: 600, padding: '1px 4px', borderRadius: 4, flexShrink: 0,
                      }}>{row.badge}</span>
                    </div>
                  ))}
                </div>

                {/* Right - Upcoming Events (41%) */}
                <div style={{
                  width: '41%', background: 'white', borderRadius: 7,
                  border: '1px solid #E5E7EB', padding: '6px 8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={8} color="#4F46E5" />
                      <span style={{ color: '#111827', fontSize: 8, fontWeight: 700 }}>Upcoming events</span>
                    </div>
                    <span style={{ color: '#4F46E5', fontSize: 6, fontWeight: 700 }}>VIEW CALENDAR</span>
                  </div>

                  {[
                    { color: '#6366F1', title: 'Discovery Call - James Hartley', date: 'Tue 31 Mar', time: '10:30' },
                    { color: '#F59E0B', title: 'Proposal Call - Dr Paul Nkemdirim', date: 'Wed 1 Apr', time: '12:45' },
                    { color: '#22D3EE', title: 'Onboarding - Dr Amir Patel', date: 'Thu 2 Apr', time: '11:00' },
                  ].map((evt, i) => (
                    <div key={i} style={{
                      background: '#F9FAFB', borderRadius: 3, padding: '3px 5px',
                      borderLeft: `2px solid ${evt.color}`, marginBottom: 3,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#111827', fontSize: 7, fontWeight: 700 }}>{evt.title}</div>
                        <div style={{ color: '#6B7280', fontSize: 6 }}>{evt.date}</div>
                      </div>
                      <span style={{ color: '#6B7280', fontSize: 6, flexShrink: 0, marginLeft: 4 }}>{evt.time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>{/* end static content div */}

            {/* Bottom fade gradient (always present) */}
            <div style={{
              position: 'absolute', bottom: 0, left: 150, right: 0, height: 40,
              background: 'linear-gradient(to bottom, transparent, rgba(248,249,250,0.95))',
              pointerEvents: 'none', zIndex: 10,
            }} />
          </div>
        </div>
      </div>

      {/* ══════════ ZONE 3 - Three stat pills ══════════ */}
      <div style={{
        position: 'absolute', top: 850, left: 24, right: 24,
        display: 'flex', gap: 12, zIndex: 30,
        opacity: interpolate(z3S, [0, 1], [0, 1]),
        transform: `scale(${interpolate(z3S, [0, 1], [0.85, 1])})`,
      }}>
        {[
          { value: '34%', label: 'Open rate', subtitle: 'Above industry avg', circleBg: 'rgba(34,211,238,0.2)', border: '#22D3EE', valueColor: 'white' },
          { value: '\u00A39k', label: 'Active pipeline', subtitle: '10 open deals', circleBg: 'rgba(99,102,241,0.25)', border: '#818CF8', valueColor: 'white' },
          { value: '11', label: 'Meetings booked', subtitle: 'This month', circleBg: 'rgba(16,185,129,0.2)', border: '#10B981', valueColor: '#10B981' },
        ].map((p, i) => (
          <div key={i} style={{
            flex: 1, background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12,
            padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: p.circleBg, border: `2px solid ${p.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ color: p.valueColor, fontSize: 15, fontWeight: 700 }}>{p.value}</span>
            </div>
            <div>
              <div style={{ color: 'white', fontSize: 12, fontWeight: 500 }}>{p.label}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9 }}>{p.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════ ZONE 4 - Tagline + URL ══════════ */}
      <div style={{
        position: 'absolute', top: 974, left: 0, right: 0,
        textAlign: 'center', opacity: z4Op, zIndex: 10,
      }}>
        <div style={{ fontSize: 22, fontWeight: 600 }}>
          <span style={{ color: 'white' }}>Every campaign. Every result.</span>
          <span style={{ color: '#22D3EE' }}> One dashboard.</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, marginTop: 6, fontWeight: 500 }}>leadomation.co.uk</div>
      </div>
    </AbsoluteFill>
  );
};
