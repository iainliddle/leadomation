import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { SocialBackground } from '../components/SocialBackground';

const { fontFamily } = loadFont('normal', { weights: ['400', '500', '600', '700', '800', '900'], subsets: ['latin'] });

export const CampaignStats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hlSpring    = spring({ frame: Math.max(0, frame - 5),  fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });
  const hlY         = interpolate(hlSpring, [0, 1], [30, 0]);
  const hlOpacity   = interpolate(hlSpring, [0, 1], [0, 1]);
  const shSpring    = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 25 });
  const shOpacity   = interpolate(shSpring, [0, 1], [0, 1]);
  const shY         = interpolate(shSpring, [0, 1], [16, 0]);

  // Three stat card scale/fade, staggered 25 frames
  const c1Spring = spring({ frame: Math.max(0, frame - 50), fps, config: { damping: 16, stiffness: 140 }, durationInFrames: 45 });
  const c2Spring = spring({ frame: Math.max(0, frame - 75), fps, config: { damping: 16, stiffness: 140 }, durationInFrames: 45 });
  const c3Spring = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 16, stiffness: 140 }, durationInFrames: 45 });

  // Counting numbers
  const count1 = Math.round(interpolate(frame, [60, 120],  [0, 287], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const count2 = Math.round(interpolate(frame, [85, 145],  [0, 34],  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const count3 = Math.round(interpolate(frame, [110, 170], [0, 11],  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  // Comparison card
  const compSpring  = spring({ frame: Math.max(0, frame - 190), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 35 });
  const compOpacity = interpolate(compSpring, [0, 1], [0, 1]);
  const compY       = interpolate(compSpring, [0, 1], [40, 0]);

  const copyOpacity = interpolate(frame, [215, 230], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const copyY       = interpolate(frame, [215, 230], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const urlOpacity  = interpolate(frame, [228, 238], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const STAT_CARDS = [
    {
      spring: c1Spring, count: count1, suffix: '', label: 'Emails sent',
      bg: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.3)',
      numberColor: 'white', underlineColor: '#4F46E5',
    },
    {
      spring: c2Spring, count: count2, suffix: '%', label: 'Open rate',
      bg: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.3)',
      numberColor: '#22D3EE', underlineColor: '#22D3EE',
    },
    {
      spring: c3Spring, count: count3, suffix: '', label: 'Meetings booked',
      bg: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
      numberColor: '#10B981', underlineColor: '#10B981',
    },
  ];

  return (
    <AbsoluteFill style={{ fontFamily, overflow: 'hidden' }}>
      <SocialBackground />

      {/* Subtle animated bar chart background */}
      <AbsoluteFill style={{ zIndex: 0, pointerEvents: 'none' }}>
        <svg width="1080" height="1080" style={{ position: 'absolute', bottom: 0, left: 0, opacity: 0.06 }}>
          {[80, 140, 110, 180, 150, 220, 190, 260, 230, 300, 270, 320].map((height, i) => {
            const barProgress = interpolate(
              frame,
              [60 + i * 8, 90 + i * 8],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            const barHeight = height * barProgress;
            const x = 40 + i * 84;
            return (
              <rect
                key={i}
                x={x}
                y={1080 - barHeight - 20}
                width={48}
                height={barHeight}
                rx={6}
                fill={i % 2 === 0 ? '#4F46E5' : '#22D3EE'}
              />
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* ZONE 1 - Logo */}
      <div style={{ position: 'absolute', top: 48, left: 48, opacity: logoOpacity, zIndex: 10 }}>
        <Img src={staticFile('logo.png')} style={{ height: 52, width: 'auto' }} />
      </div>

      {/* ZONE 2 - Headline */}
      <div style={{ position: 'absolute', top: 110, left: 48, right: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
        <div style={{ opacity: hlOpacity, transform: `translateY(${hlY}px)`, fontSize: 82, fontWeight: 800, color: 'white', lineHeight: 1.1, textAlign: 'center', letterSpacing: -2.5 }}>
          Real outreach.<br /><span style={{ color: '#22D3EE' }}>Real numbers.</span>
        </div>
        <div style={{ opacity: shOpacity, transform: `translateY(${shY}px)`, fontSize: 26, fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginTop: 14, textAlign: 'center' }}>
          From the last 30 days across active campaigns.
        </div>
      </div>

      {/* ZONE 3 - Three differentiated stat cards */}
      <div style={{ position: 'absolute', top: 370, left: 48, right: 48, display: 'flex', justifyContent: 'center', gap: 24, zIndex: 20 }}>
        {STAT_CARDS.map((sc, i) => (
          <div key={i} style={{
            width: 290, padding: 40, borderRadius: 20,
            background: sc.bg, border: sc.border,
            textAlign: 'center',
            opacity: interpolate(sc.spring, [0, 1], [0, 1]),
            transform: `scale(${sc.spring})`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: 72, fontWeight: 900, color: sc.numberColor, lineHeight: 1, letterSpacing: -3 }}>
              {sc.count}{sc.suffix}
            </div>
            {/* Underline bar */}
            <div style={{ width: 40, height: 3, background: sc.underlineColor, borderRadius: 2, margin: '8px auto 0' }} />
            <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.65)', fontWeight: 500, marginTop: 14 }}>{sc.label}</div>
          </div>
        ))}
      </div>

      {/* Comparison card */}
      <div style={{ position: 'absolute', bottom: 260, left: 48, right: 48, display: 'flex', justifyContent: 'center', opacity: compOpacity, transform: `translateY(${compY}px)`, zIndex: 25 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '24px 40px', display: 'flex', alignItems: 'center', gap: 40, boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#6B7280' }}>Industry average open rate: <strong style={{ color: '#374151' }}>21%</strong></div>
          <div style={{ width: 1, height: 32, background: '#E5E7EB', flexShrink: 0 }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: '#22D3EE' }}>Leadomation: 34%</div>
        </div>
      </div>

      {/* CTA pills */}
      <Sequence from={190} durationInFrames={50}>
        <div style={{
          position: 'absolute',
          bottom: 175,
          left: '50%',
          transform: `translateX(-50%) scale(${spring({ frame: Math.max(0, frame - 190), fps, config: { damping: 12, stiffness: 180 }, durationInFrames: 30 })})`,
          opacity: interpolate(Math.max(0, frame - 190), [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
          display: 'flex',
          gap: 12,
          whiteSpace: 'nowrap',
          zIndex: 28,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 24,
            padding: '10px 20px',
            fontSize: 13,
            fontWeight: 600,
            color: 'white',
            fontFamily,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            {'📧 287 emails sent this month'}
          </div>
          <div style={{
            background: '#22D3EE',
            border: '1px solid #22D3EE',
            borderRadius: 24,
            padding: '10px 20px',
            fontSize: 13,
            fontWeight: 700,
            color: '#0F172A',
            fontFamily,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            {'🎯 Start your free trial'}
          </div>
        </div>
      </Sequence>

      {/* ZONE 4 - Bottom copy */}
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
