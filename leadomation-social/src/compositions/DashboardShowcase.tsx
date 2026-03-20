import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';
import { MockDashboard } from '../components/MockDashboard';

const CalloutCard: React.FC<{ icon: string; title: string; subtitle: string; delay: number; x: number; y: number; accentColor?: string }> = ({ icon, title, subtitle, delay, x, y, accentColor = '#4F46E5' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - delay);
  const scale = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 180 }, durationInFrames: 40 });
  const opacity = interpolate(Math.min(localFrame, 20), [0, 20], [0, 1]);
  const float = Math.sin((frame + delay) / 40) * 6;
  return (
    <div style={{ position: 'absolute', left: x, top: y + float, transform: `scale(${scale})`, opacity, background: 'rgba(255,255,255,0.97)', borderRadius: 14, padding: '14px 18px', boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 12, minWidth: 220, backdropFilter: 'blur(20px)' }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}44)`, border: `1.5px solid ${accentColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{subtitle}</div>
      </div>
    </div>
  );
};

export const DashboardShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const particles = Array.from({ length: 30 }, (_, i) => ({ x: (i * 137.5) % 100, y: (i * 73.1) % 100, size: 1 + (i % 3), opacity: 0.15 + (i % 5) * 0.05, speed: 0.3 + (i % 4) * 0.2 }));
  const uiEntrance = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 18, stiffness: 80 }, durationInFrames: 60 });
  const uiY = interpolate(uiEntrance, [0, 1], [80, 0]);
  const uiOpacity = interpolate(Math.min(Math.max(0, frame - 20), 30), [0, 30], [0, 1]);
  const uiScale = interpolate(uiEntrance, [0, 1], [0.92, 1]);
  const headline1Progress = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 35 });
  const headline2Progress = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 35 });
  const subProgress = spring({ frame: Math.max(0, frame - 35), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 35 });
  const glowPulse = 0.4 + Math.sin(frame / 45) * 0.15;
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #080B1A 0%, #0D1230 40%, #0A1628 100%)', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(rgba(79,70,229,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.06) 1px, transparent 1px)`, backgroundSize: '60px 60px', backgroundPosition: `${frame * 0.3}px ${frame * 0.15}px` }} />
      <div style={{ position: 'absolute', top: -200, left: -100, width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, rgba(79,70,229,${glowPulse * 0.4}) 0%, transparent 70%)`, filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: -200, right: -100, width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, rgba(34,211,238,${glowPulse * 0.25}) 0%, transparent 70%)`, filter: 'blur(80px)' }} />
      {particles.map((p, i) => (
        <div key={i} style={{ position: 'absolute', left: `${p.x}%`, top: `${(p.y + frame * p.speed * 0.05) % 110 - 5}%`, width: p.size, height: p.size, borderRadius: '50%', background: i % 3 === 0 ? '#22D3EE' : '#4F46E5', opacity: p.opacity }} />
      ))}
      <div style={{ position: 'absolute', left: 80, top: 0, bottom: 0, width: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48, opacity: interpolate(Math.min(frame, 20), [0, 20], [0, 1]) }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #4F46E5, #22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: 'white', boxShadow: '0 0 20px rgba(79,70,229,0.5)' }}>L</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'white', letterSpacing: 0.5 }}>Leadomation</span>
        </div>
        <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, color: 'white', marginBottom: 8, transform: `translateY(${interpolate(headline1Progress, [0, 1], [30, 0])}px)`, opacity: interpolate(headline1Progress, [0, 1], [0, 1]) }}>B2B leads.</div>
        <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, background: 'linear-gradient(135deg, #4F46E5, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 24, transform: `translateY(${interpolate(headline2Progress, [0, 1], [30, 0])}px)`, opacity: interpolate(headline2Progress, [0, 1], [0, 1]) }}>On autopilot.</div>
        <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontWeight: 400, maxWidth: 380, transform: `translateY(${interpolate(subProgress, [0, 1], [20, 0])}px)`, opacity: interpolate(subProgress, [0, 1], [0, 1]) }}>Scrape, enrich, and reach your ideal customers automatically. From cold list to booked call.</div>
        <Sequence from={70}>
          <div style={{ marginTop: 40, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #4F46E5, #6366F1)', borderRadius: 100, padding: '14px 28px', opacity: interpolate(Math.max(0, frame - 70), [0, 20], [0, 1]), transform: `scale(${spring({ frame: Math.max(0, frame - 70), fps, config: { damping: 12, stiffness: 200 }, durationInFrames: 30 })})`, boxShadow: '0 0 40px rgba(79,70,229,0.4)', width: 'fit-content' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>Start free trial</span>
            <span style={{ fontSize: 18, color: 'white' }}>→</span>
          </div>
        </Sequence>
        <Sequence from={90}>
          <div style={{ marginTop: 14, opacity: interpolate(Math.max(0, frame - 90), [0, 20], [0, 1]), fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>From £59/month · No contracts</div>
        </Sequence>
      </div>
      <div style={{ position: 'absolute', right: -40, top: '50%', width: 1000, height: 660, transform: `translateY(calc(-50% + ${uiY}px)) scale(${uiScale})`, opacity: uiOpacity, zIndex: 5 }}>
        <MockDashboard />
      </div>
      <CalloutCard icon="🔥" title="847 hot leads found" subtitle="London & Manchester · This week" delay={80} x={880} y={60} accentColor="#EF4444" />
      <CalloutCard icon="📧" title="234 emails sent" subtitle="42% open rate · Campaign active" delay={100} x={1380} y={140} accentColor="#4F46E5" />
      <CalloutCard icon="📞" title="AI called 18 leads" subtitle="6 discovery calls booked today" delay={120} x={860} y={780} accentColor="#22D3EE" />
      <CalloutCard icon="💰" title="£47,200 in pipeline" subtitle="↑ 34% vs last month" delay={140} x={1360} y={700} accentColor="#10B981" />
      <Sequence from={180}>
        <div style={{ position: 'absolute', bottom: 32, right: 80, opacity: interpolate(Math.max(0, frame - 180), [0, 20], [0, 1]), fontSize: 14, color: 'rgba(255,255,255,0.35)', fontWeight: 500, letterSpacing: 1 }}>leadomation.co.uk</div>
      </Sequence>
    </AbsoluteFill>
  );
};
