import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { SocialBackground } from '../components/SocialBackground';

const { fontFamily } = loadFont('normal', { weights: ['400', '500', '600', '700', '800', '900'], subsets: ['latin'] });

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

  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hlSpring    = spring({ frame: Math.max(0, frame - 5),  fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });
  const hlY         = interpolate(hlSpring, [0, 1], [30, 0]);
  const hlOpacity   = interpolate(hlSpring, [0, 1], [0, 1]);
  const shSpring    = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 25 });
  const shOpacity   = interpolate(shSpring, [0, 1], [0, 1]);
  const shY         = interpolate(shSpring, [0, 1], [16, 0]);

  // Pro badge
  const pillSpring  = spring({ frame: Math.max(0, frame - 175), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });
  const pillOpacity = interpolate(pillSpring, [0, 1], [0, 1]);
  const pillY       = interpolate(pillSpring, [0, 1], [20, 0]);

  // Tagline
  const copyOpacity = interpolate(frame, [195, 210], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const copyY       = interpolate(frame, [195, 210], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const urlOpacity  = interpolate(frame, [210, 220], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Vertical connector between rows
  const connectorHeight = interpolate(frame, [155, 165], [0, 20], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Card spring delays: Row 1 at 50, 65, 80. Row 2 at 100, 115, 130.
  const cardDelays = [50, 65, 80, 100, 115, 130];

  const row1 = PHASES.slice(0, 3);
  const row2 = PHASES.slice(3, 6);

  const renderCard = (phase: typeof PHASES[0], index: number) => {
    const s = spring({ frame: Math.max(0, frame - cardDelays[index]), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });
    const cardOpacity = interpolate(s, [0, 1], [0, 1]);
    const cardScale = interpolate(s, [0, 1], [0.85, 1]);
    return (
      <div key={index} style={{ flex: 1, opacity: cardOpacity, transform: `scale(${cardScale})` }}>
        <div style={{
          background: 'white', borderRadius: 16, padding: '22px 18px', textAlign: 'center',
          borderTop: `3px solid ${phase.borderColor}`, height: '100%', boxSizing: 'border-box' as const,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 4 }}>{phase.icon}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: phase.borderColor, letterSpacing: 1, marginTop: 8 }}>{phase.days}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginTop: 4 }}>{phase.label}</div>
          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>{phase.desc}</div>
        </div>
      </div>
    );
  };

  const renderConnector = () => (
    <div style={{ width: 20, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      <div style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.15)' }} />
    </div>
  );

  return (
    <AbsoluteFill style={{ fontFamily, overflow: 'hidden' }}>
      <SocialBackground />

      {/* ZONE 1 - Logo */}
      <div style={{ position: 'absolute', top: 48, left: 48, opacity: logoOpacity, zIndex: 10 }}>
        <Img src={staticFile('logo.png')} style={{ height: 52, width: 'auto' }} />
      </div>

      {/* ZONE 2 - Headline */}
      <div style={{ position: 'absolute', top: 110, left: 48, right: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
        <div style={{ opacity: hlOpacity, transform: `translateY(${hlY}px)`, fontSize: 78, fontWeight: 800, color: 'white', lineHeight: 1.1, textAlign: 'center', letterSpacing: -2.5 }}>
          35 days from cold to<br /><span style={{ color: '#22D3EE' }}>conversation.</span>
        </div>
        <div style={{ opacity: shOpacity, transform: `translateY(${shY}px)`, fontSize: 24, fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginTop: 14, textAlign: 'center' }}>
          LinkedIn relationship sequencer, fully automated.
        </div>
      </div>

      {/* ZONE 3 - 2x3 Grid */}
      <div style={{ position: 'absolute', top: 310, left: 60, right: 60, zIndex: 20 }}>
        {/* Row 1 */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 0 }}>
          {row1.map((phase, i) => (
            <React.Fragment key={i}>
              {renderCard(phase, i)}
              {i < 2 && renderConnector()}
            </React.Fragment>
          ))}
        </div>

        {/* Vertical connector between rows */}
        <div style={{ display: 'flex', justifyContent: 'center', height: 20 }}>
          <div style={{ width: 2, background: 'rgba(255,255,255,0.2)', height: connectorHeight }} />
        </div>

        {/* Row 2 */}
        <div style={{ display: 'flex', gap: 20 }}>
          {row2.map((phase, i) => (
            <React.Fragment key={i + 3}>
              {renderCard(phase, i + 3)}
              {i < 2 && renderConnector()}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Pro feature pill */}
      <div style={{ position: 'absolute', bottom: 130, left: 48, right: 48, display: 'flex', justifyContent: 'center', opacity: pillOpacity, transform: `translateY(${pillY}px)`, zIndex: 25 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', borderRadius: 24, padding: '8px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4F46E5' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#4F46E5' }}>Pro feature</span>
        </div>
      </div>

      {/* ZONE 4 - Bottom copy */}
      <div style={{ position: 'absolute', bottom: 50, left: 48, right: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: copyOpacity, transform: `translateY(${copyY}px)`, zIndex: 30 }}>
        <div style={{ fontSize: 26, fontWeight: 600, textAlign: 'center', lineHeight: 1.35, letterSpacing: -0.3 }}>
          <span style={{ color: 'white' }}>Cold stranger to warm conversation. </span>
          <span style={{ color: '#22D3EE' }}>Automatically.</span>
        </div>
        <div style={{ opacity: urlOpacity, fontSize: 18, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 }}>leadomation.co.uk</div>
      </div>
    </AbsoluteFill>
  );
};
