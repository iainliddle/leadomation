import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { LeadScoreCard } from '../components/LeadScoreCard';
import { TooltipCard } from '../components/TooltipCard';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const IntentScoreReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Zone 1: Logo fade (0-15) ──────────────────────────────────────────────
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Zone 2: Headline spring-up (5-35) ─────────────────────────────────────
  const headlineSpring = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 14, stiffness: 160 },
    durationInFrames: 30,
  });
  const headlineY = interpolate(headlineSpring, [0, 1], [30, 0]);
  const headlineOpacity = interpolate(headlineSpring, [0, 1], [0, 1]);

  const subheadSpring = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 14, stiffness: 160 },
    durationInFrames: 25,
  });
  const subheadOpacity = interpolate(subheadSpring, [0, 1], [0, 1]);
  const subheadY = interpolate(subheadSpring, [0, 1], [16, 0]);

  // ── Zone 3: Card scale-fade IN PLACE (40-85) — never slides through text ──
  const cardScale = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 16, stiffness: 140 },
    durationInFrames: 45,
  });
  const cardOpacity = interpolate(
    Math.max(0, frame - 40), [0, 25], [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // ── Zone 3: Tooltip cards slide in from right (130-170) ───────────────────
  const tooltip1Spring = spring({
    frame: Math.max(0, frame - 130),
    fps,
    config: { damping: 14, stiffness: 160 },
    durationInFrames: 35,
  });
  const tooltip2Spring = spring({
    frame: Math.max(0, frame - 150),
    fps,
    config: { damping: 14, stiffness: 160 },
    durationInFrames: 35,
  });
  const tooltip3Spring = spring({
    frame: Math.max(0, frame - 170),
    fps,
    config: { damping: 14, stiffness: 160 },
    durationInFrames: 35,
  });

  // Intent summary widget — 20 frames after last tooltip
  const summarySpring = spring({
    frame: Math.max(0, frame - 190),
    fps,
    config: { damping: 14, stiffness: 160 },
    durationInFrames: 35,
  });
  const summaryOpacity = interpolate(summarySpring, [0, 1], [0, 1]);
  const summaryX = interpolate(summarySpring, [0, 1], [40, 0]);

  // ── Zone 4: Bottom copy (190-230) ─────────────────────────────────────────
  const finalCopyOpacity = interpolate(frame, [190, 210], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const finalCopyY = interpolate(frame, [190, 215], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const urlOpacity = interpolate(frame, [210, 228], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ fontFamily, overflow: 'hidden' }}>

      {/* ── Rich gradient background ── */}
      <AbsoluteFill style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 30%, #4F46E5 60%, #0E7490 100%)',
      }} />

      {/* Top-left corner accent */}
      <div style={{
        position: 'absolute', top: -200, left: -200,
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Bottom-right cyan accent */}
      <div style={{
        position: 'absolute', bottom: -150, right: -150,
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Dot grid overlay */}
      <AbsoluteFill style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.4,
        pointerEvents: 'none',
      }} />

      {/* Cyan glow behind card zone */}
      <div style={{
        position: 'absolute',
        left: '30%', top: '60%',
        transform: 'translate(-50%, -50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ─────────────────────────────────────────────────────────────────────
          ZONE 1 — Logo: top: 48, left: 48
      ───────────────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: 48, left: 48,
        opacity: logoOpacity,
        zIndex: 10,
      }}>
        <Img
          src={staticFile('logo.png')}
          style={{ height: 52, width: 'auto' }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          ZONE 2 — Headline block: top: 110, left: 48, right: 48
          Total height ≈ 220px → bottom edge at ~330px (well above zone 3 at 360px)
      ───────────────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: 110, left: 48, right: 48,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10,
      }}>
        {/* Headline — 82px / 800 */}
        <div style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          fontSize: 82,
          fontWeight: 800,
          color: 'white',
          lineHeight: 1.1,
          textAlign: 'center',
          letterSpacing: -2.5,
        }}>
          47 leads scored
          <br />
          <span style={{ color: '#22D3EE' }}>overnight.</span>
        </div>

        {/* Subheading — 26px */}
        <div style={{
          opacity: subheadOpacity,
          transform: `translateY(${subheadY}px)`,
          fontSize: 26,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.75)',
          marginTop: 14,
          textAlign: 'center',
          letterSpacing: -0.2,
        }}>
          AI intent scoring, built into every campaign.
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          ZONE 3 — Main content row: top: 360, left: 48, right: 48
          Card (flex:1) + Tooltips (width:280) side by side with gap:24
          110px clear gap from zone 2 bottom (~330px) to zone 3 top (360px)
      ───────────────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: 360, left: 48, right: 48,
        display: 'flex',
        flexDirection: 'row',
        gap: 24,
        alignItems: 'flex-start',
        zIndex: 20,
      }}>
        {/* White Lead Database card — scales into place, never slides through text */}
        <div style={{
          flex: 1,
          height: 490,
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
          transformOrigin: 'top center',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}>
          <LeadScoreCard frame={frame} />
        </div>

        {/* Tooltip stack — 280px wide, slides in from right */}
        <div style={{
          width: 280,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          paddingTop: 40, // vertically offset so tooltips centre nicely against the card
        }}>
          <TooltipCard
            label="No website detected"
            dotColor="#EF4444"
            springValue={tooltip1Spring}
            top={0}
            left={0}
            width={280}
            relative
          />
          <TooltipCard
            label="3 reviews in last 30 days"
            dotColor="#22D3EE"
            springValue={tooltip2Spring}
            top={0}
            left={0}
            width={280}
            relative
          />
          <TooltipCard
            label="LinkedIn profile found"
            dotColor="#818CF8"
            springValue={tooltip3Spring}
            top={0}
            left={0}
            width={280}
            relative
          />

          {/* ── Intent Score Summary Widget ── */}
          <div style={{
            opacity: summaryOpacity,
            transform: `translateX(${summaryX}px)`,
            width: '100%',
          }}>
            <div style={{
              background: 'white',
              borderRadius: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              padding: '18px 20px',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}>
              {/* Label */}
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#6B7280',
                letterSpacing: 1.2,
                textTransform: 'uppercase' as const,
                marginBottom: 14,
              }}>
                Intent summary
              </div>

              {/* Row 1 — Hot */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Hot leads</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#4F46E5' }}>3</span>
              </div>

              {/* Row 2 — Warm */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D97706', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Warm leads</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#4F46E5' }}>2</span>
              </div>

              {/* Row 3 — Unscored */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#9CA3AF', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Unscored</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#6B7280' }}>42</span>
              </div>

              {/* Divider + total */}
              <div style={{ borderTop: '1px solid #F3F4F6', marginTop: 12, paddingTop: 10 }}>
                <div style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' as const }}>
                  47 leads processed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          ZONE 4 — Bottom copy: bottom: 80, centred
      ───────────────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 80, left: 48, right: 48,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        opacity: finalCopyOpacity,
        transform: `translateY(${finalCopyY}px)`,
        zIndex: 30,
      }}>
        <div style={{
          fontSize: 26,
          fontWeight: 600,
          textAlign: 'center',
          lineHeight: 1.35,
          letterSpacing: -0.3,
        }}>
          <span style={{ color: 'white' }}>The longer you use Leadomation, </span>
          <span style={{ color: '#22D3EE' }}>the smarter it gets.</span>
        </div>

        <div style={{
          opacity: urlOpacity,
          fontSize: 18,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: 0.5,
        }}>
          leadomation.co.uk
        </div>
      </div>

    </AbsoluteFill>
  );
};
