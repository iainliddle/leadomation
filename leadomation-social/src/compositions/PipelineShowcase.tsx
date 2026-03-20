import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';

const PIPELINE_STAGES = [
  { name: 'NEW REPLY', color: '#6B7280', count: 3, deals: [{ name: 'Thames Plumbing', value: '£4,800', tag: 'Plumbers' }, { name: 'Premier Dental', value: '£8,200', tag: 'Dental' }, { name: 'Bristol Physio', value: '£3,600', tag: 'Health' }] },
  { name: 'QUALIFIED', color: '#3B82F6', count: 4, deals: [{ name: 'Edinburgh Law Group', value: '£12,000', tag: 'Legal' }, { name: 'Cardiff Builders', value: '£6,400', tag: 'Construction' }] },
  { name: 'PROPOSAL SENT', color: '#8B5CF6', count: 2, deals: [{ name: 'Leeds Roofing Pro', value: '£9,500', tag: 'Roofing' }, { name: 'Glasgow Accounts', value: '£7,200', tag: 'Finance' }] },
  { name: 'NEGOTIATING', color: '#F59E0B', count: 2, deals: [{ name: 'Luxury Spa Dubai', value: '£6,500', tag: 'Wellness' }] },
  { name: 'WON', color: '#10B981', count: 5, deals: [{ name: 'FitLife Gym London', value: '£3,800', tag: 'Fitness' }, { name: 'Grand Hotel DXB', value: '£9,000', tag: 'Hospitality' }] },
];

export const PipelineShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glowPulse = 0.35 + Math.sin(frame / 50) * 0.12;

  const DealCard: React.FC<{ name: string; value: string; tag: string; delay: number; stageColor: string }> = ({ name, value, tag, delay, stageColor }) => {
    const localFrame = Math.max(0, frame - delay);
    const slideIn = spring({ frame: localFrame, fps, config: { damping: 15, stiffness: 160 }, durationInFrames: 35 });
    return (
      <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 10, padding: '12px 14px', marginBottom: 8, transform: `translateY(${interpolate(slideIn, [0, 1], [20, 0])}px)`, opacity: interpolate(Math.min(localFrame, 20), [0, 20], [0, 1]), boxShadow: '0 4px 16px rgba(0,0,0,0.2)', borderLeft: `3px solid ${stageColor}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{name}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 600, padding: '2px 7px', background: stageColor + '20', color: stageColor, borderRadius: 4 }}>{tag}</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>{value}</div>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #080B1A 0%, #0E1535 50%, #080B1A 100%)', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(rgba(79,70,229,0.12) 1px, transparent 1px)`, backgroundSize: '40px 40px', backgroundPosition: `${frame * 0.2}px ${frame * 0.1}px` }} />
      <div style={{ position: 'absolute', top: -200, left: '30%', width: 800, height: 800, borderRadius: '50%', background: `radial-gradient(circle, rgba(79,70,229,${glowPulse * 0.35}) 0%, transparent 65%)`, filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: -200, right: '20%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, rgba(16,185,129,${glowPulse * 0.25}) 0%, transparent 65%)`, filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', top: 50, left: 0, right: 0, textAlign: 'center' as const, zIndex: 10 }}>
        <div style={{ fontSize: 52, fontWeight: 900, color: 'white', opacity: interpolate(Math.min(frame, 25), [0, 25], [0, 1]), transform: `translateY(${interpolate(spring({ frame, fps, config: { damping: 14, stiffness: 140 }, durationInFrames: 30 }), [0, 1], [25, 0])}px)` }}>
          Watch deals{' '}
          <span style={{ background: 'linear-gradient(135deg, #10B981, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>close themselves.</span>
        </div>
        <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', marginTop: 10, opacity: interpolate(Math.min(Math.max(0, frame - 15), 25), [0, 25], [0, 1]) }}>AI-powered outreach fills your pipeline while you focus on closing.</div>
      </div>
      <Sequence from={40}>
        <div style={{ position: 'absolute', top: 170, right: 80, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 12, padding: '10px 20px', zIndex: 20, opacity: interpolate(Math.min(Math.max(0, frame - 40), 20), [0, 20], [0, 1]), transform: `scale(${spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 12, stiffness: 200 }, durationInFrames: 30 })})` }}>
          <div style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>TOTAL PIPELINE VALUE</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'white' }}>£61,000</div>
        </div>
      </Sequence>
      <div style={{ position: 'absolute', top: 210, left: 40, right: 40, bottom: 60, display: 'flex', gap: 16, zIndex: 5 }}>
        {PIPELINE_STAGES.map((stage, si) => {
          const colDelay = si * 15 + 30;
          const colProgress = spring({ frame: Math.max(0, frame - colDelay), fps, config: { damping: 16, stiffness: 120 }, durationInFrames: 40 });
          return (
            <div key={si} style={{ flex: 1, transform: `translateY(${interpolate(colProgress, [0, 1], [40, 0])}px)`, opacity: interpolate(Math.min(Math.max(0, frame - colDelay), 20), [0, 20], [0, 1]) }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: stage.color }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5 }}>{stage.name}</span>
                </div>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: stage.color + '30', color: stage.color, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{stage.count}</div>
              </div>
              <div style={{ height: 3, borderRadius: 2, background: stage.color, marginBottom: 10, boxShadow: `0 0 8px ${stage.color}80` }} />
              {stage.deals.map((deal, di) => (
                <DealCard key={di} name={deal.name} value={deal.value} tag={deal.tag} delay={colDelay + 20 + di * 15} stageColor={stage.color} />
              ))}
              {frame > colDelay + 40 && (
                <div style={{ border: '1.5px dashed rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', textAlign: 'center' as const, opacity: 0.4 }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>+ Add deal</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Sequence from={220}>
        <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, textAlign: 'center' as const, zIndex: 20, opacity: interpolate(Math.min(Math.max(0, frame - 220), 20), [0, 20], [0, 1]), fontSize: 15, color: 'rgba(255,255,255,0.3)', fontWeight: 500, letterSpacing: 1.5 }}>leadomation.co.uk</div>
      </Sequence>
    </AbsoluteFill>
  );
};
