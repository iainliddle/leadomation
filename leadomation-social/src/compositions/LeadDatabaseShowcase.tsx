import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';
import { MockLeadDatabase } from '../components/MockLeadDatabase';

export const LeadDatabaseShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uiScale = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 18, stiffness: 70 }, durationInFrames: 50 });
  const uiOpacity = interpolate(Math.min(Math.max(0, frame - 10), 25), [0, 25], [0, 1]);
  const highlightRow = frame > 100 ? (Math.floor((frame - 100) / 20) % 3) : null;
  const scanY = interpolate(frame, [60, 160], [100, 700], { extrapolateRight: 'clamp' as const });
  const glowPulse = 0.3 + Math.sin(frame / 35) * 0.1;
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(160deg, #06080F 0%, #0C1020 60%, #080B1A 100%)', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />
      <div style={{ position: 'absolute', top: -150, left: -150, width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, rgba(79,70,229,${glowPulse * 0.5}) 0%, transparent 70%)`, filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, rgba(34,211,238,${glowPulse * 0.35}) 0%, transparent 70%)`, filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 130, zIndex: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(180deg, rgba(6,8,15,0.98) 70%, transparent)' }}>
        <div style={{ fontSize: 42, fontWeight: 900, color: 'white', lineHeight: 1.1, textAlign: 'center' as const, opacity: interpolate(Math.min(frame, 25), [0, 25], [0, 1]), transform: `translateY(${interpolate(spring({ frame, fps, config: { damping: 14, stiffness: 140 }, durationInFrames: 30 }), [0, 1], [20, 0])}px)` }}>
          Find leads that are{' '}
          <span style={{ background: 'linear-gradient(135deg, #EF4444, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ready to buy.</span>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 110, left: 20, right: 20, bottom: 100, transform: `scale(${interpolate(uiScale, [0, 1], [0.94, 1])})`, opacity: uiOpacity, zIndex: 5 }}>
        <MockLeadDatabase highlightRow={highlightRow} showIntentFilter={frame > 80} />
        {frame > 60 && frame < 180 && (
          <div style={{ position: 'absolute', top: scanY - 110, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #22D3EE, #4F46E5, #22D3EE, transparent)', opacity: 0.6, boxShadow: '0 0 20px #22D3EE, 0 0 40px rgba(34,211,238,0.4)', zIndex: 20 }} />
        )}
      </div>
      {frame > 70 && frame < 180 && (
        <div style={{ position: 'absolute', top: 50 + scanY * 0.6, right: 30, zIndex: 30, background: 'rgba(6,8,15,0.95)', border: '1px solid rgba(34,211,238,0.4)', borderRadius: 10, padding: '8px 14px', opacity: interpolate(Math.min(Math.max(0, frame - 70), 15), [0, 15], [0, 1]), boxShadow: '0 0 20px rgba(34,211,238,0.2)' }}>
          <div style={{ fontSize: 11, color: '#22D3EE', fontWeight: 700 }}>🧠 AI Intent Scoring</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Analysing engagement signals...</div>
        </div>
      )}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 90, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(0deg, rgba(6,8,15,0.98) 70%, transparent)' }}>
        <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)', opacity: interpolate(Math.min(Math.max(0, frame - 150), 25), [0, 25], [0, 1]), fontWeight: 500, letterSpacing: 1 }}>leadomation.co.uk</div>
      </div>
    </AbsoluteFill>
  );
};
