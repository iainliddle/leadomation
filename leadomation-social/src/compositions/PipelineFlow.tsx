import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { SocialBackground } from '../components/SocialBackground';
import { TooltipCard } from '../components/TooltipCard';
import { SummaryWidget } from '../components/SummaryWidget';

const { fontFamily } = loadFont('normal', { weights: ['400', '500', '600', '700', '800', '900'], subsets: ['latin'] });

const DEALS = [
  { company: 'Harbour Hotels Group', value: '£2,400/mo', stage: 'Proposal Sent', stageBg: '#EEF2FF', stageColor: '#4F46E5' },
  { company: 'Fletcher Law Group',   value: '£3,200/mo', stage: 'Qualified',     stageBg: '#FFFBEB', stageColor: '#D97706' },
  { company: 'Smile Clinic NW',      value: '£1,200/mo', stage: 'Won',           stageBg: '#ECFDF5', stageColor: '#059669' },
  { company: 'The Rivington London', value: '£1,800/mo', stage: 'Negotiating',   stageBg: '#EFF6FF', stageColor: '#2563EB' },
];

export const PipelineFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity   = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hlSpring      = spring({ frame: Math.max(0, frame - 5),  fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });
  const hlY           = interpolate(hlSpring, [0, 1], [30, 0]);
  const hlOpacity     = interpolate(hlSpring, [0, 1], [0, 1]);
  const shSpring      = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 25 });
  const shOpacity     = interpolate(shSpring, [0, 1], [0, 1]);
  const shY           = interpolate(shSpring, [0, 1], [16, 0]);
  const cardScale     = spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 16, stiffness: 140 }, durationInFrames: 45 });
  const cardOpacity   = interpolate(Math.max(0, frame - 40), [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const t1Spring      = spring({ frame: Math.max(0, frame - 130), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 35 });
  const t2Spring      = spring({ frame: Math.max(0, frame - 150), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 35 });
  const t3Spring      = spring({ frame: Math.max(0, frame - 170), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 35 });
  const sumSpring     = spring({ frame: Math.max(0, frame - 190), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 35 });
  const copyOpacity   = interpolate(frame, [210, 226], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const copyY         = interpolate(frame, [210, 226], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const urlOpacity    = interpolate(frame, [226, 238], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
          3 replies turned into<br /><span style={{ color: '#22D3EE' }}>pipeline today.</span>
        </div>
        <div style={{ opacity: shOpacity, transform: `translateY(${shY}px)`, fontSize: 26, fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginTop: 14, textAlign: 'center' }}>
          AI outreach that converts to real deals.
        </div>
      </div>

      {/* ZONE 3 — Content */}
      <div style={{ position: 'absolute', top: 360, left: 48, right: 48, display: 'flex', gap: 24, alignItems: 'flex-start', zIndex: 20 }}>
        {/* Deal card */}
        <div style={{ flex: 1, height: 450, opacity: cardOpacity, transform: `scale(${cardScale})`, transformOrigin: 'top center', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden', background: 'white', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Deal Pipeline</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Updated 2 minutes ago</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#EEF2FF', borderRadius: 8, padding: '6px 12px', border: '1px solid #C7D2FE' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4F46E5' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5' }}>4 active deals</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.1fr', padding: '10px 24px', background: '#F9FAFB', borderBottom: '1px solid #F3F4F6', flexShrink: 0 }}>
            {['COMPANY', 'VALUE', 'STAGE'].map(h => <div key={h} style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.8 }}>{h}</div>)}
          </div>
          <div style={{ flex: 1 }}>
            {DEALS.map((d, i) => {
              const s = spring({ frame: Math.max(0, frame - (80 + i * 15)), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 25 });
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.1fr', padding: '14px 24px', borderBottom: i < 3 ? '1px solid #F3F4F6' : 'none', alignItems: 'center', opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateY(${interpolate(s, [0, 1], [14, 0])}px)` }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{d.company}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{d.value}</div>
                  <div style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 20, background: d.stageBg, color: d.stageColor, fontSize: 11, fontWeight: 700, width: 'fit-content' }}>{d.stage}</div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: '11px 24px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', flexShrink: 0, background: '#F9FAFB' }}>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>4 deals tracked</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5' }}>View pipeline →</div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 24 }}>
          <TooltipCard label="New reply detected"       dotColor="#EF4444" springValue={t1Spring} top={0} left={0} width={280} relative />
          <TooltipCard label="Auto-moved to Qualified"  dotColor="#4F46E5" springValue={t2Spring} top={0} left={0} width={280} relative />
          <TooltipCard label="Follow-up call queued"    dotColor="#22D3EE" springValue={t3Spring} top={0} left={0} width={280} relative />
          <SummaryWidget
            title="Pipeline value"
            rows={[
              { dotColor: '#059669', label: 'Won',              value: '£1,200' },
              { dotColor: '#4F46E5', label: 'In negotiation',   value: '£4,600' },
              { dotColor: '#D97706', label: 'Proposal stage',   value: '£3,200' },
            ]}
            footer="£9,000 active pipeline"
            springValue={sumSpring}
          />
        </div>
      </div>

      {/* ZONE 4 — Bottom copy */}
      <div style={{ position: 'absolute', bottom: 80, left: 48, right: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: copyOpacity, transform: `translateY(${copyY}px)`, zIndex: 30 }}>
        <div style={{ fontSize: 26, fontWeight: 600, textAlign: 'center', lineHeight: 1.35, letterSpacing: -0.3 }}>
          <span style={{ color: 'white' }}>The longer you use Leadomation, </span>
          <span style={{ color: '#22D3EE' }}>the better your results get.</span>
        </div>
        <div style={{ opacity: urlOpacity, fontSize: 18, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 }}>leadomation.co.uk</div>
      </div>
    </AbsoluteFill>
  );
};
