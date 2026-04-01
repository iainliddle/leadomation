import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { SocialBackground } from '../components/SocialBackground';

const { fontFamily } = loadFont('normal', { weights: ['400', '500', '600', '700', '800', '900'], subsets: ['latin'] });

const brand = { fontSans: fontFamily };

const PHASES = [
  { icon: '\uD83D\uDC41\uFE0F', days: 'DAYS 1-10',  label: 'Silent Awareness', desc: 'View and like posts',   borderColor: '#4F46E5' },
  { icon: '\uD83E\uDD1D', days: 'DAY 12-14',  label: 'Connect',          desc: 'Personalised invite',    borderColor: '#7C3AED' },
  { icon: '\uD83D\uDC4B', days: 'DAY 15-16',  label: 'Warm Thanks',      desc: 'No-pitch message',       borderColor: '#2563EB' },
  { icon: '\uD83D\uDCA1', days: 'DAY 20-22',  label: 'Advice Ask',       desc: 'Build rapport',          borderColor: '#0891B2' },
  { icon: '\uD83D\uDCE9', days: 'DAY 25-27',  label: 'Soft Follow Up',   desc: 'Light mention',          borderColor: '#22D3EE' },
  { icon: '\uD83C\uDFAF', days: 'DAY 30-35',  label: 'Soft Offer',       desc: 'Show the value',         borderColor: '#10B981' },
];

export const SequencerTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Headline
  const hlSpring  = spring({ frame: Math.max(0, frame - 5),  fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });
  const hlY       = interpolate(hlSpring, [0, 1], [30, 0]);
  const hlOpacity = interpolate(hlSpring, [0, 1], [0, 1]);

  // Subheading
  const shSpring  = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 25 });
  const shOpacity = interpolate(shSpring, [0, 1], [0, 1]);
  const shY       = interpolate(shSpring, [0, 1], [16, 0]);

  // Timeline bar synced to card animations
  const timelineProgress = interpolate(
    frame,
    [50, 65, 80, 100, 115, 130, 160],
    [0, 0.26, 0.43, 0.57, 0.71, 1.0, 1.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Dot pulse when landing on new position
  const dotScale = interpolate(
    frame % 15,
    [0, 3, 6],
    [1, 1.4, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Stat pills (spring in at frame 190)
  const statPillSpring  = spring({ frame: Math.max(0, frame - 190), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });
  const statPillScale   = interpolate(statPillSpring, [0, 1], [0.7, 1]);
  const statPillOpacity = interpolate(statPillSpring, [0, 1], [0, 1]);

  // Pro badge (frame 200)
  const pillSpring  = spring({ frame: Math.max(0, frame - 200), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });
  const pillOpacity = interpolate(pillSpring, [0, 1], [0, 1]);
  const pillY       = interpolate(pillSpring, [0, 1], [20, 0]);

  // Tagline (frame 210)
  const copyOpacity = interpolate(frame, [210, 222], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const copyY       = interpolate(frame, [210, 222], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // URL (frame 218)
  const urlOpacity = interpolate(frame, [218, 228], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Card spring delays: Row 1 at 50, 65, 80. Row 2 at 100, 115, 130.
  const cardDelays = [50, 65, 80, 100, 115, 130];

  const renderCard = (phase: typeof PHASES[0], index: number) => {
    const s = spring({ frame: Math.max(0, frame - cardDelays[index]), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });
    const cardOpacity = interpolate(s, [0, 1], [0, 1]);
    const cardScale   = interpolate(s, [0, 1], [0.85, 1]);
    return (
      <div key={index} style={{ opacity: cardOpacity, transform: `scale(${cardScale})` }}>
        <div style={{
          background: 'white', borderRadius: 16, padding: '34px 20px', textAlign: 'center' as const,
          borderTop: `3px solid ${phase.borderColor}`, height: '100%', boxSizing: 'border-box' as const,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 4 }}>{phase.icon}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: phase.borderColor, letterSpacing: 1, marginTop: 8 }}>{phase.days}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginTop: 4 }}>{phase.label}</div>
          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>{phase.desc}</div>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ fontFamily, overflow: 'hidden' }}>
      <SocialBackground />

      {/* Single flex column containing all content */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '44px 40px 60px',
        gap: 0,
      }}>

        {/* Logo */}
        <div style={{ opacity: logoOpacity, marginBottom: 20 }}>
          <Img src={staticFile('logo.png')} style={{ height: 44, width: 'auto' }} />
        </div>

        {/* Headline */}
        <div style={{ textAlign: 'center' as const, marginBottom: 24 }}>
          <div style={{ opacity: hlOpacity, transform: `translateY(${hlY}px)` }}>
            <div style={{ fontSize: 76, fontWeight: 800, color: 'white', lineHeight: 1.05, fontFamily: brand.fontSans, letterSpacing: -2.5 }}>
              35 days from cold to
            </div>
            <div style={{ fontSize: 76, fontWeight: 800, color: '#22D3EE', lineHeight: 1.05, fontFamily: brand.fontSans, letterSpacing: -2.5 }}>
              conversation.
            </div>
          </div>
          <div style={{ opacity: shOpacity, transform: `translateY(${shY}px)`, fontSize: 22, color: 'rgba(255,255,255,0.7)', marginTop: 10, fontFamily: brand.fontSans }}>
            LinkedIn relationship sequencer, fully automated.
          </div>
        </div>

        {/* Card grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 24,
          width: '100%',
          marginBottom: 40,
        }}>
          {PHASES.map((phase, i) => renderCard(phase, i))}
        </div>

        {/* Timeline bar */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
          padding: '0 20px',
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', fontFamily: brand.fontSans, minWidth: 40 }}>Day 1</span>
          <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, position: 'relative', overflow: 'visible' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${timelineProgress * 100}%`, background: 'linear-gradient(to right, #4F46E5, #22D3EE)', borderRadius: 2 }} />
            <div style={{
              position: 'absolute', right: `${(1 - timelineProgress) * 100}%`, top: '50%',
              transform: `translate(50%, -50%) scale(${dotScale})`, width: 12, height: 12, borderRadius: '50%',
              background: '#22D3EE', boxShadow: '0 0 10px rgba(34,211,238,0.9), 0 0 20px rgba(34,211,238,0.5)',
            }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', fontFamily: brand.fontSans, minWidth: 40, textAlign: 'right' as const }}>Day 35</span>
        </div>

        {/* Stat pills */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, opacity: statPillOpacity, transform: `scale(${statPillScale})` }}>
          <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 24, padding: '8px 20px' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#10B981', fontFamily: brand.fontSans }}>{'\u2705'} 34% average reply rate</span>
          </div>
          <div style={{ background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.4)', borderRadius: 24, padding: '8px 20px' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#22D3EE', fontFamily: brand.fontSans }}>{'\u26A1'} Zero manual effort</span>
          </div>
        </div>

        {/* Pro badge */}
        <div style={{ marginBottom: 24, opacity: pillOpacity, transform: `translateY(${pillY}px)` }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', borderRadius: 24, padding: '8px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4F46E5' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#4F46E5' }}>Pro feature</span>
          </div>
        </div>

        {/* Tagline */}
        <div style={{ textAlign: 'center' as const, marginBottom: 10, opacity: copyOpacity, transform: `translateY(${copyY}px)` }}>
          <span style={{ fontSize: 26, fontWeight: 600, color: 'white', fontFamily: brand.fontSans }}>Cold stranger to warm conversation. </span>
          <span style={{ fontSize: 26, fontWeight: 600, color: '#22D3EE', fontFamily: brand.fontSans }}>Automatically.</span>
        </div>

        {/* URL */}
        <div style={{ marginTop: 6, opacity: urlOpacity }}>
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', fontFamily: brand.fontSans }}>leadomation.co.uk</span>
        </div>

      </div>
    </AbsoluteFill>
  );
};
