import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { SocialBackground } from '../components/SocialBackground';
import { TooltipCard } from '../components/TooltipCard';
import { SummaryWidget } from '../components/SummaryWidget';

const { fontFamily } = loadFont('normal', { weights: ['400', '500', '600', '700', '800', '900'], subsets: ['latin'] });

const HITS = [
  { initials: 'MO', avatarBg: '#FEF2F2', avatarColor: '#DC2626', author: 'Mark Okonkwo',    title: 'Revenue Manager at Hoxton Collection',          keyword: 'OTA commission',     kwBg: '#FEF2F2', kwColor: '#DC2626', time: '4 min ago',  enrolled: true  },
  { initials: 'VM', avatarBg: '#EEF2FF', avatarColor: '#4F46E5', author: 'Victoria Marsh',  title: 'Partner at Marsh Henderson Solicitors',         keyword: 'law firm marketing', kwBg: '#EEF2FF', kwColor: '#4F46E5', time: '38 min ago', enrolled: true  },
  { initials: 'SA', avatarBg: '#FFFBEB', avatarColor: '#D97706', author: 'Simon Adeyemi',   title: 'Managing Partner at Adeyemi Family Law',        keyword: 'Google Ads',         kwBg: '#FFFBEB', kwColor: '#D97706', time: '1 hr ago',  enrolled: false },
];

export const KeywordMonitor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hlSpring    = spring({ frame: Math.max(0, frame - 5),  fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });
  const hlY         = interpolate(hlSpring, [0, 1], [30, 0]);
  const hlOpacity   = interpolate(hlSpring, [0, 1], [0, 1]);
  const shSpring    = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 25 });
  const shOpacity   = interpolate(shSpring, [0, 1], [0, 1]);
  const shY         = interpolate(shSpring, [0, 1], [16, 0]);
  const cardScale   = spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 16, stiffness: 140 }, durationInFrames: 45 });
  const cardOpacity = interpolate(Math.max(0, frame - 40), [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const t1Spring    = spring({ frame: Math.max(0, frame - 130), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 35 });
  const t2Spring    = spring({ frame: Math.max(0, frame - 150), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 35 });
  const t3Spring    = spring({ frame: Math.max(0, frame - 170), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 35 });
  const sumSpring   = spring({ frame: Math.max(0, frame - 190), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 35 });
  const copyOpacity = interpolate(frame, [215, 230], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const copyY       = interpolate(frame, [215, 230], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const urlOpacity  = interpolate(frame, [228, 238], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ fontFamily, overflow: 'hidden' }}>
      <SocialBackground />

      {/* ZONE 1 — Logo */}
      <div style={{ position: 'absolute', top: 48, left: 48, opacity: logoOpacity, zIndex: 10 }}>
        <Img src={staticFile('logo.png')} style={{ height: 52, width: 'auto' }} />
      </div>

      {/* ZONE 2 — Headline */}
      <div style={{ position: 'absolute', top: 110, left: 48, right: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
        <div style={{ opacity: hlOpacity, transform: `translateY(${hlY}px)`, fontSize: 78, fontWeight: 800, color: 'white', lineHeight: 1.1, textAlign: 'center', letterSpacing: -2.5 }}>
          Buyers signal intent<br /><span style={{ color: '#22D3EE' }}>on LinkedIn.</span>
        </div>
        <div style={{ opacity: shOpacity, transform: `translateY(${shY}px)`, fontSize: 22, fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginTop: 14, textAlign: 'center', maxWidth: 700 }}>
          Keyword Monitor finds them before your competitors do.
        </div>
      </div>

      {/* ZONE 3 — Content */}
      <div style={{ position: 'absolute', top: 360, left: 48, right: 48, display: 'flex', gap: 24, alignItems: 'flex-start', zIndex: 20 }}>
        {/* Keyword Monitor card */}
        <div style={{ flex: 1, height: 430, opacity: cardOpacity, transform: `scale(${cardScale})`, transformOrigin: 'top center', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden', background: 'white', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Keyword Monitor</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>2 new hits in last hour</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.15)', borderRadius: 8, padding: '6px 12px', border: '1px solid #10B981' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#10B981' }}>Live monitoring</span>
            </div>
          </div>
          {/* Rows */}
          <div style={{ flex: 1 }}>
            {HITS.map((hit, i) => {
              const s = spring({ frame: Math.max(0, frame - (80 + i * 20)), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 25 });
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 24px', borderBottom: i < HITS.length - 1 ? '1px solid #F3F4F6' : 'none', opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateY(${interpolate(s, [0, 1], [14, 0])}px)` }}>
                  {/* Avatar */}
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: hit.avatarBg, color: hit.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{hit.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{hit.author}</div>
                      {hit.enrolled && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: '#ECFDF5', borderRadius: 10, padding: '2px 7px', border: '1px solid #A7F3D0' }}>
                          <span style={{ fontSize: 9, color: '#059669' }}>✓</span>
                          <span style={{ fontSize: 10, fontWeight: 600, color: '#059669' }}>Enrolled</span>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{hit.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ padding: '2px 8px', borderRadius: 10, background: hit.kwBg, color: hit.kwColor, fontSize: 11, fontWeight: 700, border: `1px solid ${hit.kwBg}` }}>{hit.keyword}</div>
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>{hit.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: '11px 24px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', flexShrink: 0, background: '#F9FAFB' }}>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>5 keywords active</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5' }}>Manage keywords →</div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 24 }}>
          <TooltipCard label="Hot lead detected"               dotColor="#EF4444" springValue={t1Spring} top={0} left={0} width={280} relative />
          <TooltipCard label="Auto-enrolled in sequence"       dotColor="#4F46E5" springValue={t2Spring} top={0} left={0} width={280} relative />
          <TooltipCard label="Connection request queued"       dotColor="#22D3EE" springValue={t3Spring} top={0} left={0} width={280} relative />
          <SummaryWidget
            title="Monitor activity"
            rows={[
              { dotColor: '#EF4444', label: 'Keywords tracked', value: '5'  },
              { dotColor: '#22D3EE', label: 'Hits this week',   value: '14' },
              { dotColor: '#4F46E5', label: 'Auto-enrolled',    value: '9'  },
            ]}
            footer="Running every 2 hours"
            springValue={sumSpring}
          />
        </div>
      </div>

      {/* ZONE 4 — Bottom copy */}
      <div style={{ position: 'absolute', bottom: 80, left: 48, right: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: copyOpacity, transform: `translateY(${copyY}px)`, zIndex: 30 }}>
        <div style={{ fontSize: 26, fontWeight: 600, textAlign: 'center', lineHeight: 1.35, letterSpacing: -0.3 }}>
          <span style={{ color: 'white' }}>Find buyers </span>
          <span style={{ color: '#22D3EE' }}>the moment they raise their hand.</span>
        </div>
        <div style={{ opacity: urlOpacity, fontSize: 18, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 }}>leadomation.co.uk</div>
      </div>
    </AbsoluteFill>
  );
};
