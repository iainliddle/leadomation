import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { SocialBackground } from '../components/SocialBackground';
import {
  LayoutDashboard, Globe, Plus, Zap, Users, TrendingUp, CalendarDays,
  Mail, Target, Phone, Inbox, FileText, User, Link, Settings as SettingsIcon,
  Shield, CreditCard, LogOut, ArrowUpRight, MessageCircle, BarChart2,
  Trophy, ChevronRight, Activity, Calendar
} from 'lucide-react';

const { fontFamily } = loadFont('normal', { weights: ['400', '500', '600', '700', '800', '900'], subsets: ['latin'] });

export const DashboardShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Zone 1: Logo & Headline
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const hlSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });
  const hlOpacity = interpolate(hlSpring, [0, 1], [0, 1]);
  const hlY = interpolate(hlSpring, [0, 1], [30, 0]);

  // Zone 2: Main Card
  const cardScale = spring({ frame: Math.max(0, frame - 35), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 45 });
  const cardOpacity = interpolate(Math.max(0, frame - 35), [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  // Stat Cards
  const getStatSpring = (delay: number) => spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });
  const stat1 = getStatSpring(50);
  const stat2 = getStatSpring(62);
  const stat3 = getStatSpring(74);
  const stat4 = getStatSpring(86);
  const stat5 = getStatSpring(98);

  // Charts Row
  const chartOpacity = interpolate(frame, [110, 130], [0, 1], { extrapolateRight: 'clamp' });
  const chartY = interpolate(frame, [110, 130], [20, 0], { extrapolateRight: 'clamp' });

  // Campaign Rows
  const camp1 = getStatSpring(125);
  const camp2 = getStatSpring(135);
  const camp3 = getStatSpring(145);

  // Activity + Events Row
  const actOpacity = interpolate(frame, [155, 175], [0, 1], { extrapolateRight: 'clamp' });
  const actY = interpolate(frame, [155, 175], [20, 0], { extrapolateRight: 'clamp' });

  // Activity Rows
  const ar1 = getStatSpring(165);
  const ar2 = getStatSpring(173);
  const ar3 = getStatSpring(181);
  const ar4 = getStatSpring(189);

  // Calendar Events
  const ce1 = getStatSpring(170);
  const ce2 = getStatSpring(178);
  const ce3 = getStatSpring(186);

  // Zone 3: Insight cards row (bottom)
  const insightSpring = spring({ frame: Math.max(0, frame - 230), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });
  const insightScale = interpolate(insightSpring, [0, 1], [0.85, 1]);
  const insightOpacity = interpolate(insightSpring, [0, 1], [0, 1]);

  // Zone 4: Tagline
  const tlOpacity = interpolate(frame, [252, 267], [0, 1], { extrapolateRight: 'clamp' });
  const tlY = interpolate(frame, [252, 267], [20, 0], { extrapolateRight: 'clamp' });

  const renderNavItem = (icon: React.ReactNode, label: string, active = false, badge = '') => (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 8, fontSize: 11, background: active ? '#EEF2FF' : 'transparent', color: active ? '#4F46E5' : '#4B5563', fontWeight: active ? 500 : 400 }}>
      {active && <div style={{ position: 'absolute', left: 0, width: 2, height: 14, background: '#4F46E5', borderRadius: 1 }} />}
      {icon}
      <span>{label}</span>
      {badge && <span style={{ marginLeft: 'auto', background: active ? '#4F46E5' : '#E5E7EB', color: active ? 'white' : '#4B5563', borderRadius: 10, fontSize: 8, padding: '1px 5px', fontWeight: 600 }}>{badge}</span>}
    </div>
  );

  const renderSectionLabel = (label: string) => (
    <div style={{ color: '#9CA3AF', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 16px 4px', fontWeight: 600 }}>{label}</div>
  );

  const ActivityBadge = ({ text, bg, color }: { text: string; bg: string; color: string }) => (
    <span style={{ background: bg, color, fontSize: 7, padding: '2px 6px', borderRadius: 10, fontWeight: 700, marginLeft: 'auto' }}>{text}</span>
  );

  const INSIGHT_CARDS = [
    { value: '34%', label: 'Open rate', subtitle: 'Above industry avg', circleBg: 'rgba(34,211,238,0.2)', circleColor: '#22D3EE' },
    { value: '\u00A39k', label: 'Active pipeline', subtitle: 'Across 10 deals', circleBg: 'rgba(99,102,241,0.3)', circleColor: '#6366F1' },
    { value: '11', label: 'Meetings booked', subtitle: 'This month', circleBg: 'rgba(16,185,129,0.2)', circleColor: '#10B981' },
  ];

  return (
    <AbsoluteFill style={{ fontFamily, overflow: 'hidden' }}>
      <SocialBackground />

      {/* ZONE 1 - Logo + Headline */}
      <div style={{ position: 'absolute', top: 48, left: 48, right: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
        <div style={{ opacity: logoOpacity, marginBottom: 16 }}>
          <Img src={staticFile('logo.png')} style={{ height: 52, width: 'auto' }} />
        </div>
        <div style={{ opacity: hlOpacity, transform: `translateY(${hlY}px)`, fontSize: 68, fontWeight: 800, color: 'white', lineHeight: 1.1, textAlign: 'center', letterSpacing: -2 }}>
          Every campaign. Every result.<br />
          <span style={{ color: '#22D3EE' }}>One dashboard.</span>
        </div>
        <div style={{ opacity: hlOpacity, transform: `translateY(${hlY}px)`, color: 'rgba(255,255,255,0.7)', fontSize: 24, marginTop: 10, fontWeight: 500 }}>
          Live right now inside Leadomation.
        </div>
      </div>

      {/* ZONE 2 - Full app mockup card (wider, full width) */}
      <div style={{
        position: 'absolute', top: 295, left: 36, right: 36,
        height: 400, borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'row',
        opacity: cardOpacity, transform: `scale(${cardScale})`, transformOrigin: 'top center', zIndex: 20
      }}>
        {/* Left column - Sidebar */}
        <div style={{ width: 180, background: 'white', borderRight: '1px solid #E5E7EB', padding: '12px 0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0 12px', marginBottom: 10, display: 'flex', flexDirection: 'column' }}>
            <Img src={staticFile('logo.png')} style={{ height: 18, width: 'auto', alignSelf: 'flex-start' }} />
            <div style={{ color: '#9CA3AF', fontSize: 8, marginTop: 4, fontWeight: 500 }}>B2B Outreach Platform</div>
          </div>
          <div style={{ borderBottom: '1px solid #F3F4F6', marginBottom: 4 }} />

          <div style={{ flex: 1, overflow: 'hidden' }}>
            {renderSectionLabel('MAIN')}
            <div style={{ padding: '0 8px' }}>
              {renderNavItem(<LayoutDashboard size={12} />, 'Dashboard', true)}
              {renderNavItem(<Globe size={12} color="#6B7280" />, 'Global Demand')}
            </div>

            {renderSectionLabel('CAMPAIGNS')}
            <div style={{ padding: '0 8px' }}>
              {renderNavItem(<Plus size={12} color="#6B7280" />, 'New Campaign')}
              {renderNavItem(<Zap size={12} color="#6B7280" />, 'Active Campaigns')}
            </div>

            {renderSectionLabel('LEADS')}
            <div style={{ padding: '0 8px' }}>
              {renderNavItem(<Users size={12} color="#6B7280" />, 'Lead Database', false, '251')}
            </div>

            {renderSectionLabel('CRM')}
            <div style={{ padding: '0 8px' }}>
              {renderNavItem(<TrendingUp size={12} color="#6B7280" />, 'Deal Pipeline', false, '10')}
              {renderNavItem(<CalendarDays size={12} color="#6B7280" />, 'Calendar')}
            </div>

            {renderSectionLabel('OUTREACH')}
            <div style={{ padding: '0 8px' }}>
              {renderNavItem(<Mail size={12} color="#6B7280" />, 'Sequence Builder')}
              {renderNavItem(<Target size={12} color="#6B7280" />, 'Keyword Monitor')}
              {renderNavItem(<Phone size={12} color="#6B7280" />, 'Call Agent')}
              {renderNavItem(<Inbox size={12} color="#6B7280" />, 'Inbox', false, '8')}
              {renderNavItem(<FileText size={12} color="#6B7280" />, 'Email Templates')}
            </div>

            {renderSectionLabel('ANALYTICS')}
            <div style={{ padding: '0 8px' }}>
              {renderNavItem(<TrendingUp size={12} color="#6B7280" />, 'Performance')}
            </div>

            {renderSectionLabel('SETTINGS')}
            <div style={{ padding: '0 8px' }}>
              {renderNavItem(<User size={12} color="#6B7280" />, 'My Profile')}
              {renderNavItem(<Link size={12} color="#6B7280" />, 'Integrations')}
              {renderNavItem(<SettingsIcon size={12} color="#6B7280" />, 'Email Config')}
              {renderNavItem(<Shield size={12} color="#6B7280" />, 'Compliance')}
              {renderNavItem(<CreditCard size={12} color="#6B7280" />, 'Pricing and Plans')}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 8, paddingLeft: 16 }}>
            <div style={{ color: '#6B7280', fontSize: 10, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
              <LogOut size={10} /> Sign Out
            </div>
          </div>
        </div>

        {/* Right column - Dashboard content */}
        <div style={{ flex: 1, background: '#F8F9FA', padding: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Greeting */}
          <div>
            <div style={{ color: '#111827', fontSize: 13, fontWeight: 700 }}>Good morning, Iain</div>
            <div style={{ color: '#6B7280', fontSize: 9, marginTop: 2 }}>Tuesday, 31 March 2026</div>
          </div>

          {/* Stat cards row */}
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {/* Card 1 */}
            <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E5E7EB', padding: '8px 10px', flex: 1, opacity: interpolate(stat1, [0, 1], [0, 1]), transform: `scale(${stat1})` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ background: '#ECFEFF', borderRadius: 6, padding: 4 }}><Users size={10} color="#0891B2" /></div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 16 }}>
                  {[10, 12, 8, 14, 16].map((h, i) => <div key={i} style={{ width: 3, height: h, background: '#22D3EE', borderRadius: 1 }} />)}
                </div>
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 7, marginTop: 8, fontWeight: 600 }}>Total Leads</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <div style={{ color: '#111827', fontSize: 14, fontWeight: 700 }}>251</div>
                <div style={{ color: '#059669', fontSize: 7, fontWeight: 600, display: 'flex', alignItems: 'center' }}><ArrowUpRight size={8} /> +12%</div>
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 7 }}>in last 30 days</div>
            </div>

            {/* Card 2 */}
            <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E5E7EB', padding: '8px 10px', flex: 1, opacity: interpolate(stat2, [0, 1], [0, 1]), transform: `scale(${stat2})` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ background: '#ECFDF5', borderRadius: 6, padding: 4 }}><Mail size={10} color="#059669" /></div>
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 7, marginTop: 8, fontWeight: 600 }}>Leads with Emails</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <div style={{ color: '#111827', fontSize: 14, fontWeight: 700 }}>189</div>
                <div style={{ color: '#059669', fontSize: 7, fontWeight: 600, display: 'flex', alignItems: 'center' }}><ArrowUpRight size={8} /> +8%</div>
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 7 }}>verified emails</div>
            </div>

            {/* Card 3 */}
            <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E5E7EB', padding: '8px 10px', flex: 1, opacity: interpolate(stat3, [0, 1], [0, 1]), transform: `scale(${stat3})` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ background: '#F5F3FF', borderRadius: 6, padding: 4 }}><MessageCircle size={10} color="#7C3AED" /></div>
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 7, marginTop: 8, fontWeight: 600 }}>Leads Contacted</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <div style={{ color: '#111827', fontSize: 14, fontWeight: 700 }}>47</div>
                <div style={{ color: '#059669', fontSize: 7, fontWeight: 600, display: 'flex', alignItems: 'center' }}><ArrowUpRight size={8} /> +24%</div>
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 7 }}>outreach initiated</div>
            </div>

            {/* Card 4 */}
            <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E5E7EB', padding: '8px 10px', flex: 1, opacity: interpolate(stat4, [0, 1], [0, 1]), transform: `scale(${stat4})` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ background: '#FFF1F2', borderRadius: 6, padding: 4 }}><TrendingUp size={10} color="#F43F5E" /></div>
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 7, marginTop: 8, fontWeight: 600 }}>Total Deals</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <div style={{ color: '#111827', fontSize: 14, fontWeight: 700 }}>10</div>
                <div style={{ color: '#059669', fontSize: 7, fontWeight: 600, display: 'flex', alignItems: 'center' }}><ArrowUpRight size={8} /> +2</div>
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 7 }}>in pipeline</div>
            </div>

            {/* Card 5 (Plan) */}
            <div style={{ background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', borderRadius: 10, border: '1px solid #C7D2FE', padding: '8px 10px', flex: 1, display: 'flex', flexDirection: 'column', opacity: interpolate(stat5, [0, 1], [0, 1]), transform: `scale(${stat5})` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Img src={staticFile('logo.png')} style={{ width: 12, height: 'auto' }} />
                <span style={{ color: '#4F46E5', fontSize: 7, fontWeight: 700, textTransform: 'uppercase' }}>Current Plan</span>
              </div>
              <div style={{ marginTop: 8, color: '#111827', fontSize: 13, fontWeight: 700 }}>Pro</div>
              <div style={{ color: '#6B7280', fontSize: 7, marginBottom: 'auto' }}>Pro plan active</div>
              <div style={{ background: '#4F46E5', color: 'white', borderRadius: 6, fontSize: 8, padding: '3px 0', width: '100%', textAlign: 'center', fontWeight: 600, marginTop: 4 }}>Manage plan</div>
            </div>
          </div>

          {/* Charts row */}
          <div style={{ display: 'flex', gap: 8, marginTop: 8, opacity: chartOpacity, transform: `translateY(${chartY}px)` }}>
            {/* Left Box */}
            <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E5E7EB', padding: 10, flex: 3 }}>
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <BarChart2 size={10} color="#4F46E5" />
                  <span style={{ color: '#111827', fontSize: 10, fontWeight: 700 }}>Campaign Performance</span>
                </div>
                <span style={{ color: '#9CA3AF', fontSize: 7, marginLeft: 14 }}>Last 14 days</span>
              </div>

              {/* Fake Area Chart */}
              <div style={{ height: 40, display: 'flex', alignItems: 'flex-end', gap: 2, marginBottom: 8 }}>
                {Array.from({ length: 14 }).map((_, i) => {
                  const h1 = 10 + Math.random() * 10;
                  const h2 = 5 + Math.random() * 8;
                  const h3 = 2 + Math.random() * 5;
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 1, width: 6, height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ width: '100%', height: h1, background: '#10B981', borderRadius: 1 }} />
                      <div style={{ width: '100%', height: h2, background: '#6366F1', borderRadius: 1 }} />
                      <div style={{ width: '100%', height: h3, background: '#06B6D4', borderRadius: 1 }} />
                    </div>
                  );
                })}
              </div>

              {/* Conversion Funnel */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ background: '#F9FAFB', borderRadius: 6, padding: '3px 6px', textAlign: 'center' }}>
                  <div style={{ color: '#111827', fontSize: 9, fontWeight: 700 }}>251</div>
                  <div style={{ color: '#9CA3AF', fontSize: 7, textTransform: 'uppercase', fontWeight: 600 }}>Total Leads</div>
                </div>
                <ChevronRight size={10} color="#D1D5DB" />
                <div style={{ background: '#F9FAFB', borderRadius: 6, padding: '3px 6px', textAlign: 'center' }}>
                  <div style={{ color: '#111827', fontSize: 9, fontWeight: 700 }}>47</div>
                  <div style={{ color: '#9CA3AF', fontSize: 7, textTransform: 'uppercase', fontWeight: 600 }}>Contacted</div>
                </div>
                <ChevronRight size={10} color="#D1D5DB" />
                <div style={{ background: '#F9FAFB', borderRadius: 6, padding: '3px 6px', textAlign: 'center' }}>
                  <div style={{ color: '#111827', fontSize: 9, fontWeight: 700 }}>11</div>
                  <div style={{ color: '#9CA3AF', fontSize: 7, textTransform: 'uppercase', fontWeight: 600 }}>Qualified</div>
                </div>
                <ChevronRight size={10} color="#D1D5DB" />
                <div style={{ background: '#F9FAFB', borderRadius: 6, padding: '3px 6px', textAlign: 'center' }}>
                  <div style={{ color: '#111827', fontSize: 9, fontWeight: 700 }}>10</div>
                  <div style={{ color: '#9CA3AF', fontSize: 7, textTransform: 'uppercase', fontWeight: 600 }}>Deals</div>
                </div>
              </div>
            </div>

            {/* Right Box */}
            <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E5E7EB', padding: 10, flex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                <Trophy size={10} color="#4F46E5" />
                <span style={{ color: '#111827', fontSize: 10, fontWeight: 700 }}>Top Performing Campaigns</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ opacity: interpolate(camp1, [0, 1], [0, 1]), transform: `translateY(${interpolate(camp1, [0, 1], [10, 0])}px)` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: '#111827', fontSize: 9, fontWeight: 700 }}>UK Hotels - Q2 Outreach</span>
                      <span style={{ background: '#EFF6FF', color: '#2563EB', fontSize: 7, padding: '1px 4px', borderRadius: 4, textTransform: 'uppercase', fontWeight: 700 }}>Direct</span>
                    </div>
                    <span style={{ color: '#111827', fontSize: 9, fontWeight: 700 }}>8.36%</span>
                  </div>
                  <div style={{ width: '100%', height: 4, background: '#F3F4F6', borderRadius: 2 }}>
                    <div style={{ width: '96%', height: '100%', background: '#2563EB', borderRadius: 2 }} />
                  </div>
                </div>

                <div style={{ opacity: interpolate(camp2, [0, 1], [0, 1]), transform: `translateY(${interpolate(camp2, [0, 1], [10, 0])}px)` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: '#111827', fontSize: 9, fontWeight: 700 }}>Law Firms - Full Pipeline</span>
                      <span style={{ background: '#EFF6FF', color: '#2563EB', fontSize: 7, padding: '1px 4px', borderRadius: 4, textTransform: 'uppercase', fontWeight: 700 }}>Direct</span>
                    </div>
                    <span style={{ color: '#111827', fontSize: 9, fontWeight: 700 }}>11.22%</span>
                  </div>
                  <div style={{ width: '100%', height: 4, background: '#F3F4F6', borderRadius: 2 }}>
                    <div style={{ width: '65%', height: '100%', background: '#2563EB', borderRadius: 2 }} />
                  </div>
                </div>

                <div style={{ opacity: interpolate(camp3, [0, 1], [0, 1]), transform: `translateY(${interpolate(camp3, [0, 1], [10, 0])}px)` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: '#111827', fontSize: 9, fontWeight: 700 }}>Dental Clinics - LinkedIn</span>
                      <span style={{ background: '#F5F3FF', color: '#7C3AED', fontSize: 7, padding: '1px 4px', borderRadius: 4, textTransform: 'uppercase', fontWeight: 700 }}>Specifier</span>
                    </div>
                    <span style={{ color: '#111827', fontSize: 9, fontWeight: 700 }}>6.74%</span>
                  </div>
                  <div style={{ width: '100%', height: 4, background: '#F3F4F6', borderRadius: 2 }}>
                    <div style={{ width: '89%', height: '100%', background: '#7C3AED', borderRadius: 2 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity + Events Row */}
          <div style={{ display: 'flex', gap: 8, marginTop: 8, opacity: actOpacity, transform: `translateY(${actY}px)`, flex: 1 }}>
            {/* Left Box - Activity */}
            <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E5E7EB', padding: 10, flex: 3, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Activity size={10} color="#4F46E5" />
                  <span style={{ color: '#111827', fontSize: 10, fontWeight: 700 }}>Recent Activity</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#ECFDF5', padding: '2px 6px', borderRadius: 10 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ color: '#059669', fontSize: 8, fontWeight: 700 }}>Live Feed</span>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ opacity: interpolate(ar1, [0, 1], [0, 1]), transform: `translateX(${interpolate(ar1, [0, 1], [-10, 0])}px)`, display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: '1px solid #F9FAFB' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 7, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>HH</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <span style={{ color: '#111827', fontSize: 8, fontWeight: 500 }}>AI call to Harbour Hotels Group</span>
                    <span style={{ color: '#9CA3AF', fontSize: 7 }}>2h ago</span>
                  </div>
                  <ActivityBadge text="COMPLETED" bg="#ECFDF5" color="#059669" />
                </div>
                <div style={{ opacity: interpolate(ar2, [0, 1], [0, 1]), transform: `translateX(${interpolate(ar2, [0, 1], [-10, 0])}px)`, display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: '1px solid #F9FAFB' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 7, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>SC</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <span style={{ color: '#111827', fontSize: 8, fontWeight: 500 }}>New lead: Smile Clinic Northwest</span>
                    <span style={{ color: '#9CA3AF', fontSize: 7 }}>4h ago</span>
                  </div>
                  <ActivityBadge text="NEW" bg="#ECFDF5" color="#059669" />
                </div>
                <div style={{ opacity: interpolate(ar3, [0, 1], [0, 1]), transform: `translateX(${interpolate(ar3, [0, 1], [-10, 0])}px)`, display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: '1px solid #F9FAFB' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 7, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>FL</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <span style={{ color: '#111827', fontSize: 8, fontWeight: 500 }}>Lead qualified: Fletcher Law Group</span>
                    <span style={{ color: '#9CA3AF', fontSize: 7 }}>6h ago</span>
                  </div>
                  <ActivityBadge text="QUALIFIED" bg="#F5F3FF" color="#7C3AED" />
                </div>
                <div style={{ opacity: interpolate(ar4, [0, 1], [0, 1]), transform: `translateX(${interpolate(ar4, [0, 1], [-10, 0])}px)`, display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 7, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>TG</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <span style={{ color: '#111827', fontSize: 8, fontWeight: 500 }}>AI call to The Grand Manchester</span>
                    <span style={{ color: '#9CA3AF', fontSize: 7 }}>8h ago</span>
                  </div>
                  <ActivityBadge text="COMPLETED" bg="#ECFDF5" color="#059669" />
                </div>
              </div>
            </div>

            {/* Right Box - Events */}
            <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E5E7EB', padding: 10, flex: 2, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                <Calendar size={10} color="#4F46E5" />
                <span style={{ color: '#111827', fontSize: 10, fontWeight: 700 }}>Upcoming events</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ opacity: interpolate(ce1, [0, 1], [0, 1]), transform: `translateY(${interpolate(ce1, [0, 1], [10, 0])}px)`, background: '#F9FAFB', borderRadius: 6, padding: '5px 8px', borderLeft: '3px solid #6366F1' }}>
                  <div style={{ color: '#111827', fontSize: 8, fontWeight: 700, marginBottom: 2 }}>Discovery Call - James Hartley</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6B7280', fontSize: 7 }}>Tue, 1 Apr</span>
                    <span style={{ color: '#6B7280', fontSize: 7 }}>10:00 - 10:30</span>
                  </div>
                </div>
                <div style={{ opacity: interpolate(ce2, [0, 1], [0, 1]), transform: `translateY(${interpolate(ce2, [0, 1], [10, 0])}px)`, background: '#F9FAFB', borderRadius: 6, padding: '5px 8px', borderLeft: '3px solid #F59E0B' }}>
                  <div style={{ color: '#111827', fontSize: 8, fontWeight: 700, marginBottom: 2 }}>Contract Review - Priya Sharma</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6B7280', fontSize: 7 }}>Tue, 1 Apr</span>
                    <span style={{ color: '#6B7280', fontSize: 7 }}>14:00 - 14:45</span>
                  </div>
                </div>
                <div style={{ opacity: interpolate(ce3, [0, 1], [0, 1]), transform: `translateY(${interpolate(ce3, [0, 1], [10, 0])}px)`, background: '#F9FAFB', borderRadius: 6, padding: '5px 8px', borderLeft: '3px solid #0891B2' }}>
                  <div style={{ color: '#111827', fontSize: 8, fontWeight: 700, marginBottom: 2 }}>Proposal Call - Dr Paul Nkemdirim</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6B7280', fontSize: 7 }}>Wed, 2 Apr</span>
                    <span style={{ color: '#6B7280', fontSize: 7 }}>16:00 - 16:30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ZONE 3 - Insight cards row (below dashboard) */}
      <div style={{
        position: 'absolute', bottom: 72, left: 36, right: 36,
        display: 'flex', gap: 16, zIndex: 30,
        opacity: insightOpacity, transform: `scale(${insightScale})`,
      }}>
        {INSIGHT_CARDS.map((card, i) => (
          <div key={i} style={{
            flex: 1,
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 14,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: card.circleBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>{card.value}</span>
            </div>
            <div>
              <div style={{ color: 'white', fontSize: 12, fontWeight: 500 }}>{card.label}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>{card.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ZONE 4 - Tagline */}
      <div style={{ position: 'absolute', bottom: 16, left: 36, right: 36, textAlign: 'center', opacity: tlOpacity, transform: `translateY(${tlY}px)`, zIndex: 10 }}>
        <div style={{ fontSize: 22, fontWeight: 600 }}>
          <span style={{ color: 'white' }}>Every campaign. Every result. </span>
          <span style={{ color: '#22D3EE' }}>One dashboard.</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginTop: 4, fontWeight: 500 }}>leadomation.co.uk</div>
      </div>
    </AbsoluteFill>
  );
};
