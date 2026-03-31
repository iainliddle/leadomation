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
import { brand } from '../lib/brand';
import { Clock, Mail, HelpCircle } from 'lucide-react';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

const SPRING_CONFIG = { damping: 14, stiffness: 160 };

const SCENE_NAMES = [
  'The pain',
  'Introduction',
  'Lead generation',
  'Multi-channel',
  'AI intelligence',
  'Results',
  'Get started',
];

function getScene(frame: number): number {
  if (frame < 120) return 1;
  if (frame < 240) return 2;
  if (frame < 360) return 3;
  if (frame < 510) return 4;
  if (frame < 630) return 5;
  if (frame < 780) return 6;
  return 7;
}

function sceneOpacity(frame: number, sceneStart: number, sceneEnd: number): number {
  const fadeIn = interpolate(frame, [sceneStart, sceneStart + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [sceneEnd - 15, sceneEnd], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return fadeIn * fadeOut;
}

function fadeUp(
  frame: number,
  startFrame: number,
  fps: number,
  durationInFrames = 30,
): { opacity: number; transform: string } {
  const s = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: SPRING_CONFIG,
    durationInFrames,
  });
  return {
    opacity: interpolate(s, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
  };
}

function springScale(
  frame: number,
  startFrame: number,
  fps: number,
  from = 0.85,
  to = 1.0,
  durationInFrames = 30,
): { opacity: number; transform: string } {
  const s = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: SPRING_CONFIG,
    durationInFrames,
  });
  return {
    opacity: interpolate(s, [0, 1], [0, 1]),
    transform: `scale(${interpolate(s, [0, 1], [from, to])})`,
  };
}

/* ─── Scene 1 Enhancement: Connection Nodes ─── */

const CONNECTION_NODES = [
  [120, 180], [280, 320], [450, 150], [600, 280], [780, 190], [900, 350],
  [150, 480], [340, 580], [520, 480], [700, 520], [860, 460], [980, 580],
] as const;

const CYAN_NODE_INDICES = [2, 3, 10]; // positions [450,150], [600,280], [860,460]

function getNodeConnections(): Array<[number, number]> {
  const connections: Array<[number, number]> = [];
  for (let i = 0; i < CONNECTION_NODES.length; i++) {
    for (let j = i + 1; j < CONNECTION_NODES.length; j++) {
      const dx = CONNECTION_NODES[i][0] - CONNECTION_NODES[j][0];
      const dy = CONNECTION_NODES[i][1] - CONNECTION_NODES[j][1];
      if (Math.sqrt(dx * dx + dy * dy) < 280) {
        connections.push([i, j]);
      }
    }
  }
  return connections;
}

const NODE_CONNECTIONS = getNodeConnections();

const ConnectionNodesBackground: React.FC<{ frame: number }> = ({ frame }) => {
  const networkOpacity = interpolate(frame, [105, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ zIndex: 0, opacity: networkOpacity, pointerEvents: 'none' }}>
      <svg width="1080" height="1080" viewBox="0 0 1080 1080">
        {NODE_CONNECTIONS.map(([i, j], idx) => (
          <line
            key={`line-${idx}`}
            x1={CONNECTION_NODES[i][0]}
            y1={CONNECTION_NODES[i][1]}
            x2={CONNECTION_NODES[j][0]}
            y2={CONNECTION_NODES[j][1]}
            stroke="rgba(99,102,241,0.12)"
            strokeWidth="1"
          />
        ))}
        {CONNECTION_NODES.map(([x, y], i) => {
          const isCyan = CYAN_NODE_INDICES.includes(i);
          const phase = i * 15;
          const minR = isCyan ? 3 : 2;
          const maxR = isCyan ? 7 : 5;
          const r = minR + (maxR - minR) * (0.5 + 0.5 * Math.sin((frame + phase) / 90 * Math.PI * 2));
          const fill = isCyan ? 'rgba(34,211,238,0.5)' : 'rgba(99,102,241,0.4)';
          return <circle key={`node-${i}`} cx={x} cy={y} r={r} fill={fill} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* ─── Scene 2 Enhancement: Rising Particles ─── */

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: 54 + (i * 51) % 972,
  size: 2 + (i % 3),
  duration: 120 + (i * 17) % 80,
  delay: (i * 23) % 100,
  color: i % 3 === 0 ? 'rgba(34,211,238,0.4)' : i % 3 === 1 ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.2)',
}));

const RisingParticles: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <AbsoluteFill style={{ zIndex: 0, pointerEvents: 'none' }}>
      <svg width="1080" height="1080" viewBox="0 0 1080 1080">
        {PARTICLES.map((p) => {
          const localFrame = Math.max(0, frame - 120 - p.delay);
          const progress = (localFrame % p.duration) / p.duration;
          const y = 1080 - progress * 1180;
          const opacity = progress < 0.1 ? progress * 10 : progress > 0.85 ? (1 - progress) * 6.67 : 1;
          return (
            <circle key={p.id} cx={p.x} cy={y} r={p.size} fill={p.color} opacity={opacity} />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* ─── Scene 3 Enhancement: Map Pin Drops ─── */

const MAP_PINS = [
  { x: 180, y: 200, color: 'rgba(79,70,229,0.35)', fillInner: 'rgba(79,70,229,0.5)' },
  { x: 820, y: 280, color: 'rgba(34,211,238,0.3)', fillInner: 'rgba(34,211,238,0.45)' },
  { x: 300, y: 650, color: 'rgba(79,70,229,0.35)', fillInner: 'rgba(79,70,229,0.5)' },
  { x: 750, y: 580, color: 'rgba(34,211,238,0.3)', fillInner: 'rgba(34,211,238,0.45)' },
  { x: 500, y: 750, color: 'rgba(79,70,229,0.35)', fillInner: 'rgba(79,70,229,0.5)' },
];

const MapPinDrops: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const globalFade = interpolate(frame, [345, 360], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ zIndex: 0, pointerEvents: 'none', opacity: globalFade }}>
      <svg width="1080" height="1080" viewBox="0 0 1080 1080">
        {MAP_PINS.map((pin, i) => {
          const pinStart = 250 + i * 15;
          const dropProgress = spring({
            frame: Math.max(0, frame - pinStart),
            fps,
            config: { damping: 10, stiffness: 200 },
            durationInFrames: 30,
          });
          const pinY = interpolate(dropProgress, [0, 1], [pin.y - 120, pin.y]);
          const pinOpacity = interpolate(dropProgress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

          // Ripple after pin lands
          const landedFrames = Math.max(0, frame - (pinStart + 20));
          const rippleR = Math.min(landedFrames, 30) / 30 * 20;
          const rippleOpacity = landedFrames > 0 && landedFrames <= 30
            ? interpolate(landedFrames, [0, 30], [0.5, 0], { extrapolateRight: 'clamp' })
            : 0;

          return (
            <g key={i} opacity={pinOpacity} transform={`translate(${pin.x}, ${pinY}) scale(1.4)`}>
              <path
                d="M 0,-16 C 6,-16 10,-10 10,-6 C 10,2 0,14 0,14 C 0,14 -10,2 -10,-6 C -10,-10 -6,-16 0,-16 Z"
                fill={pin.color}
              />
              <circle cx={0} cy={-6} r={4} fill={pin.fillInner} />
              {rippleOpacity > 0 && (
                <circle
                  cx={0}
                  cy={14}
                  r={rippleR}
                  fill="none"
                  stroke={pin.color}
                  strokeWidth="1.5"
                  opacity={rippleOpacity}
                />
              )}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* ─── Scene 4 Enhancement: Floating Badges + Rotating Ring ─── */

const FloatingBadge: React.FC<{
  text: string;
  icon: string;
  color: string;
  bgColor: string;
  x: number;
  y: number;
  delay: number;
  frame: number;
  fps: number;
}> = ({ text, icon, color, bgColor, x, y, delay, frame, fps }) => {
  const localFrame = Math.max(0, frame - delay);
  const scale = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 220 }, durationInFrames: 25 });
  const opacity = interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${scale})`,
        opacity,
        background: bgColor,
        border: `1px solid ${color}`,
        borderRadius: 20,
        padding: '5px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11,
        fontWeight: 600,
        color,
        fontFamily: brand.fontSans,
        boxShadow: `0 4px 12px ${color}33`,
        whiteSpace: 'nowrap',
        zIndex: 20,
        backdropFilter: 'blur(8px)',
      }}
    >
      {icon} {text}
    </div>
  );
};

/* ─── Scene 5 Enhancement: Neural Network ─── */

const NEURAL_NODES: Array<[number, number]> = [
  [200, 200], [380, 150], [560, 180], [740, 200], [880, 250],
  [150, 380], [320, 350], [500, 320], [680, 360], [850, 400],
  [180, 520], [360, 500], [540, 480], [720, 510], [880, 540],
  [400, 620], [640, 600],
];

function getNeuralConnections(): Array<[number, number]> {
  const connections: Array<[number, number]> = [];
  for (let i = 0; i < NEURAL_NODES.length; i++) {
    for (let j = i + 1; j < NEURAL_NODES.length; j++) {
      const dx = NEURAL_NODES[i][0] - NEURAL_NODES[j][0];
      const dy = NEURAL_NODES[i][1] - NEURAL_NODES[j][1];
      if (Math.sqrt(dx * dx + dy * dy) < 200) {
        connections.push([i, j]);
      }
    }
  }
  return connections;
}

const NEURAL_CONNECTIONS = getNeuralConnections();

const NeuralNetworkBackground: React.FC<{ frame: number }> = ({ frame }) => {
  // Signal pulse along a connection
  const pulsePhase = (frame - 510) % 45;
  const pulseProgress = Math.min(pulsePhase / 20, 1);
  const connectionIndex = Math.floor(((frame - 510) / 45)) % Math.max(NEURAL_CONNECTIONS.length, 1);
  const activeConn = NEURAL_CONNECTIONS[connectionIndex] || [0, 1];
  const nodeA = NEURAL_NODES[activeConn[0]];
  const nodeB = NEURAL_NODES[activeConn[1]];
  const pulseX = nodeA[0] + (nodeB[0] - nodeA[0]) * pulseProgress;
  const pulseY = nodeA[1] + (nodeB[1] - nodeA[1]) * pulseProgress;
  const pulseVisible = pulsePhase < 20;

  return (
    <AbsoluteFill style={{ zIndex: 0, opacity: 0.6, pointerEvents: 'none' }}>
      <svg width="1080" height="1080" viewBox="0 0 1080 1080">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {NEURAL_CONNECTIONS.map(([i, j], idx) => (
          <line
            key={`nline-${idx}`}
            x1={NEURAL_NODES[i][0]}
            y1={NEURAL_NODES[i][1]}
            x2={NEURAL_NODES[j][0]}
            y2={NEURAL_NODES[j][1]}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}
        {NEURAL_NODES.map(([x, y], i) => {
          const phase = i * 11;
          const r = 2 + 4 * (0.5 + 0.5 * Math.sin((frame + phase) / 90 * Math.PI * 2));
          const fill = i % 5 < 3 ? 'rgba(99,102,241,0.25)' : 'rgba(34,211,238,0.3)';
          return <circle key={`nnode-${i}`} cx={x} cy={y} r={r} fill={fill} />;
        })}
        {pulseVisible && (
          <circle
            cx={pulseX}
            cy={pulseY}
            r={4}
            fill="rgba(34,211,238,0.8)"
            filter="url(#glow)"
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};

/* ─── Scene 6 Enhancement: Trending Arrow ─── */

const TREND_PATH = 'M 0,900 C 100,850 150,820 200,780 C 280,720 300,760 380,680 C 460,600 480,640 560,520 C 640,400 660,450 740,320 C 820,200 860,240 940,140 C 980,90 1020,60 1080,20';
const TREND_PATH_LENGTH = 1800;

const TREND_DOTS = [
  { frame: 680, x: 380, y: 680 },
  { frame: 695, x: 560, y: 520 },
  { frame: 710, x: 740, y: 320 },
  { frame: 720, x: 940, y: 140 },
  { frame: 730, x: 1080, y: 20 },
];

const TrendingArrowBackground: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const dashOffset = interpolate(frame, [640, 720], [TREND_PATH_LENGTH, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Arrow head at top-right
  const arrowOpacity = interpolate(frame, [725, 735], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ zIndex: 0, pointerEvents: 'none' }}>
      <svg width="1080" height="1080" viewBox="0 0 1080 1080">
        <defs>
          <filter id="dotglow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Wide soft channel */}
        <path
          d={TREND_PATH}
          stroke="rgba(34,211,238,0.08)"
          strokeWidth="80"
          fill="none"
          strokeDasharray={TREND_PATH_LENGTH}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
        {/* Thin line on top */}
        <path
          d={TREND_PATH}
          stroke="rgba(34,211,238,0.15)"
          strokeWidth="3"
          fill="none"
          strokeDasharray={TREND_PATH_LENGTH}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
        {/* Glowing dots along the line */}
        {TREND_DOTS.map((dot, i) => {
          const dotScale = spring({
            frame: Math.max(0, frame - dot.frame),
            fps,
            config: { damping: 12, stiffness: 200 },
            durationInFrames: 20,
          });
          return (
            <circle
              key={`tdot-${i}`}
              cx={dot.x}
              cy={dot.y}
              r={6 * dotScale}
              fill="rgba(34,211,238,0.6)"
              filter="url(#dotglow)"
            />
          );
        })}
        {/* Arrow head */}
        <g
          transform="translate(960, 80) rotate(45)"
          opacity={arrowOpacity}
        >
          <polygon
            points="0,-10 8,6 -8,6"
            fill="rgba(34,211,238,0.6)"
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ─── Scene 7 Enhancement: Logo Glow + Social Proof + CTA Pill ─── */

const AVATAR_COLORS = ['#4F46E5', '#7C3AED', '#0891B2', '#059669', '#D97706'];
const AVATAR_INITIALS = ['JH', 'AM', 'SK', 'TR', 'PL'];

/* ─── Scene Components ─── */

const ScenePain: React.FC<{ frame: number; fps: number; opacity: number }> = ({ frame, fps, opacity }) => {
  const lines = [
    { icon: '\u{1F550}', text: 'You spend hours manually finding leads that go nowhere.', LucideIcon: Clock },
    { icon: '\u{1F4E7}', text: 'Your cold emails get ignored because they feel generic.', LucideIcon: Mail },
    { icon: '\u{1F4C9}', text: 'You have no idea which leads are actually worth your time.', LucideIcon: HelpCircle },
  ];
  const bigText = fadeUp(frame, 40, fps);
  const subText = fadeUp(frame, 55, fps);
  const fadeOutAll = interpolate(frame, [95, 120], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: opacity * fadeOutAll, fontFamily, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <AbsoluteFill style={{ background: 'rgba(0,0,0,0.15)' }} />
      <ConnectionNodesBackground frame={frame} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', textAlign: 'center' }}>
        <div style={{ marginBottom: 32 }}>
          {lines.map((line, i) => {
            const anim = fadeUp(frame, i * 18, fps);
            return (
              <div key={i} style={{ ...anim, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderLeft: '3px solid #EF4444', borderRadius: 12, padding: '12px 20px', width: 820, margin: '0 auto 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <line.LucideIcon size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 18 }}>{line.icon}</span>
                <span style={{ color: 'white', fontSize: 18, textAlign: 'left' }}>{line.text}</span>
              </div>
            );
          })}
        </div>
        <div style={bigText}>
          <div style={{ color: 'white', fontSize: 64, fontWeight: 800, textAlign: 'center' }}>Sound familiar?</div>
        </div>
        <div style={subText}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 22, textAlign: 'center', marginTop: 8 }}>You're not alone. Every B2B sales team faces this.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneIntro: React.FC<{ frame: number; fps: number; opacity: number }> = ({ frame, fps, opacity }) => {
  const logoAnim = springScale(frame, 135, fps, 0.6, 1.0);
  const headline = fadeUp(frame, 155, fps);
  const subtitle = fadeUp(frame, 162, fps);
  const pills = [
    { icon: '\u{1F3AF}', text: 'Find leads' },
    { icon: '\u{1F4EC}', text: 'Run outreach' },
    { icon: '\u{1F4C5}', text: 'Book meetings' },
  ];
  const fadeOutAll = interpolate(frame, [225, 240], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: opacity * fadeOutAll, fontFamily, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <RisingParticles frame={frame} />
      <div style={{ position: 'relative', zIndex: 1, ...logoAnim, textAlign: 'center' }}>
        <Img src={staticFile('logo.png')} style={{ height: 80 }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1, ...headline, textAlign: 'center', marginTop: 24 }}>
        <div style={{ color: 'white', fontSize: 72, fontWeight: 800 }}>Meet Leadomation.</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, ...subtitle, textAlign: 'center', marginTop: 12 }}>
        <div style={{ color: brand.cyan, fontSize: 28, fontWeight: 500 }}>B2B outreach, fully automated.</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 32 }}>
        {pills.map((pill, i) => {
          const anim = springScale(frame, 185 + i * 12, fps, 0.6, 1.0);
          const arrowWidth = interpolate(frame, [197 + i * 12, 212 + i * 12], [0, 30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <React.Fragment key={i}>
              <div style={{ ...anim, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 24, padding: '8px 18px', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'white' }}>
                <span>{pill.icon}</span>
                <span>{pill.text}</span>
              </div>
              {i < pills.length - 1 && (
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 20, width: arrowWidth, overflow: 'hidden', display: 'inline-block', textAlign: 'center' }}>{'\u2192'}</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SceneLeadGen: React.FC<{ frame: number; fps: number; opacity: number }> = ({ frame, fps, opacity }) => {
  const stepLabel = fadeUp(frame, 240, fps);
  const headline = fadeUp(frame, 248, fps);
  const cardAnim = springScale(frame, 260, fps, 0.85, 1.0, 40);
  const leads = [
    { initials: 'TG', name: 'The Grand Manchester', role: 'General Manager', email: 'sarah@thegrand.co.uk', hot: true },
    { initials: 'HH', name: 'Harbour Hotels Group', role: 'Director of Sales', email: 'james@harbourhotels.co.uk', hot: true },
    { initials: 'SC', name: 'Smile Clinic Northwest', role: 'Clinical Director', email: 'amir@smileclinic.co.uk', hot: false },
  ];
  const stats = ['312 leads found', '189 emails verified', 'Enriched with LinkedIn + Apollo'];
  const fadeOutAll = interpolate(frame, [345, 360], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: opacity * fadeOutAll, fontFamily, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <MapPinDrops frame={frame} fps={fps} />
      <div style={{ position: 'relative', zIndex: 1, ...stepLabel }}>
        <div style={{ color: brand.cyan, fontSize: 20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, textAlign: 'center' }}>Step 1.</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, ...headline, textAlign: 'center', marginTop: 6 }}>
        <div style={{ color: 'white', fontSize: 58, fontWeight: 800 }}>Find your perfect leads.</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, ...cardAnim, width: 700, margin: '20px auto 0', borderRadius: 20, padding: '20px 24px', background: 'white', boxShadow: '0 20px 56px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>{'\u{1F5FA}\uFE0F'}</span>
            <span style={{ color: '#111827', fontSize: 14, fontWeight: 700 }}>Lead Scraper</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669' }} />
            <span style={{ color: '#059669', fontSize: 11 }}>Scraping...</span>
          </div>
        </div>
        <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#6B7280', marginBottom: 12 }}>
          Hotels in London, UK {'\u{1F50D}'}
        </div>
        {leads.map((lead, i) => {
          const rowAnim = fadeUp(frame, 280 + i * 10, fps);
          return (
            <div key={i} style={{ ...rowAnim, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < leads.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF2FF', color: brand.indigo, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{lead.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#111827', fontSize: 13, fontWeight: 700 }}>{lead.name}</div>
                <div style={{ color: '#6B7280', fontSize: 11 }}>{lead.role}</div>
              </div>
              <div style={{ color: '#059669', fontSize: 11, flexShrink: 0 }}>{'\u2709\uFE0F'} {lead.email}</div>
              <div style={{ background: lead.hot ? '#FEF2F2' : '#FFF7ED', color: lead.hot ? '#DC2626' : '#EA580C', borderRadius: 6, padding: '2px 7px', fontSize: 10, fontWeight: 600, flexShrink: 0 }}>{lead.hot ? '\u{1F525} Hot' : '\u26A1 Warm'}</div>
            </div>
          );
        })}
        <div style={{ borderTop: '1px solid #F3F4F6', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#9CA3AF', fontSize: 10 }}>Showing 3 of 312 leads found</span>
          <span style={{ color: brand.indigo, fontSize: 10, fontWeight: 700 }}>View all leads {'\u2192'}</span>
        </div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
        {stats.map((stat, i) => {
          const pillAnim = fadeUp(frame, 310 + i * 8, fps);
          return (
            <div key={i} style={{ ...pillAnim, background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 24, padding: '6px 14px', color: i === 0 ? brand.cyan : 'white', fontSize: 13 }}>{stat}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SceneOutreach: React.FC<{ frame: number; fps: number; opacity: number }> = ({ frame, fps, opacity }) => {
  const stepLabel = fadeUp(frame, 360, fps);
  const headline = fadeUp(frame, 368, fps);
  const channels = [
    { icon: '\u2709\uFE0F', iconBg: 'rgba(16,185,129,0.2)', iconBorder: '#10B981', title: 'Cold Email', body: 'Personalised sequences with AI-written copy. Automatic follow-ups. Unsubscribe built in.', stat: '34% open rate', statColor: '#10B981', statBg: 'rgba(16,185,129,0.15)', statPrefix: '', delay: 380 },
    { icon: '\u{1F4BC}', iconBg: 'rgba(79,70,229,0.2)', iconBorder: brand.indigo, title: 'LinkedIn Sequencer', body: '35-day relationship funnel. Connect, warm up, then pitch. Never spammy.', stat: 'Pro feature', statColor: brand.indigo, statBg: 'rgba(79,70,229,0.15)', statPrefix: '\u{1F512} ', delay: 400 },
    { icon: '\u{1F4DE}', iconBg: 'rgba(34,211,238,0.2)', iconBorder: brand.cyan, title: 'AI Voice Calls', body: 'AI agent calls your leads, qualifies them and books meetings. Runs overnight.', stat: 'Books meetings while you sleep', statColor: brand.cyan, statBg: 'rgba(34,211,238,0.15)', statPrefix: '', delay: 420 },
  ];
  const flowSteps = [
    { text: 'Email sent \u2709\uFE0F', bg: 'rgba(16,185,129,0.15)', color: '#10B981' },
    { text: 'LinkedIn follow \u{1F4BC}', bg: 'rgba(79,70,229,0.15)', color: '#818CF8' },
    { text: 'Call booked \u{1F4DE}', bg: 'rgba(34,211,238,0.15)', color: brand.cyan },
  ];
  const fadeOutAll = interpolate(frame, [495, 510], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Rotating ring
  const ringRotation = ((frame - 360) / 300) * 360;

  return (
    <AbsoluteFill style={{ opacity: opacity * fadeOutAll, fontFamily, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Rotating ring behind cards */}
      <AbsoluteFill style={{ zIndex: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="1080" height="1080" viewBox="0 0 1080 1080" style={{ transform: `rotate(${ringRotation}deg)` }}>
          <circle cx={540} cy={480} r={320} stroke="rgba(255,255,255,0.04)" strokeWidth="60" fill="none" />
        </svg>
      </AbsoluteFill>

      <div style={{ position: 'relative', zIndex: 1, ...stepLabel }}>
        <div style={{ color: brand.cyan, fontSize: 20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, textAlign: 'center' }}>Step 2.</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, ...headline, textAlign: 'center', marginTop: 6 }}>
        <div style={{ color: 'white', fontSize: 58, fontWeight: 800 }}>Outreach on every channel.</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 20, justifyContent: 'center', marginTop: 24 }}>
        {channels.map((ch, i) => {
          const anim = springScale(frame, ch.delay, fps, 0.85, 1.0, 35);
          return (
            <div key={i} style={{ ...anim, zIndex: 1, width: 290, borderRadius: 20, padding: '22px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: ch.iconBg, border: `2px solid ${ch.iconBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 24 }}>{ch.icon}</div>
              <div style={{ color: 'white', fontSize: 18, fontWeight: 700, marginTop: 12 }}>{ch.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 8, lineHeight: 1.5 }}>{ch.body}</div>
              <div style={{ background: ch.statBg, borderRadius: 20, padding: '4px 12px', display: 'inline-block', marginTop: 12, color: ch.statColor, fontSize: 12, fontWeight: 700 }}>{ch.statPrefix}{ch.stat}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 }}>
        {flowSteps.map((step, i) => {
          const pillAnim = fadeUp(frame, 450 + i * 15, fps);
          const arrowWidth = interpolate(frame, [460 + i * 15, 475 + i * 15], [0, 30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <React.Fragment key={i}>
              <div style={{ ...pillAnim, background: step.bg, color: step.color, borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600 }}>{step.text}</div>
              {i < flowSteps.length - 1 && <div style={{ width: arrowWidth, height: 2, background: 'rgba(255,255,255,0.3)', borderRadius: 1 }} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Floating notification badges */}
      <FloatingBadge text="Opened" icon="\u2709\uFE0F" color="#10B981" bgColor="rgba(16,185,129,0.15)" x={80} y={595} delay={470} frame={frame} fps={fps} />
      <FloatingBadge text="Connected" icon="\u{1F91D}" color="#818CF8" bgColor="rgba(99,102,241,0.15)" x={355} y={578} delay={488} frame={frame} fps={fps} />
      <FloatingBadge text="Meeting booked" icon="\u{1F4C5}" color="#22D3EE" bgColor="rgba(34,211,238,0.15)" x={655} y={592} delay={506} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

const SceneAI: React.FC<{ frame: number; fps: number; opacity: number }> = ({ frame, fps, opacity }) => {
  const stepLabel = fadeUp(frame, 510, fps);
  const headline = fadeUp(frame, 518, fps);
  const cards: Array<{ icon: string; title: string; body: string; delay: number; badges?: Array<{ text: string; bg: string; color: string }>; footer?: string; footerColor?: string }> = [
    { icon: '\u{1F3AF}', title: 'Intent Scoring', body: 'Every lead scored 0-100. Hot leads rise to the top automatically.', delay: 530, badges: [{ text: 'Hot', bg: '#FEF2F2', color: '#DC2626' }, { text: 'Warm', bg: '#FFF7ED', color: '#EA580C' }, { text: 'Cold', bg: '#F0F9FF', color: '#0369A1' }] },
    { icon: '\u{1F916}', title: 'AI Reply Classification', body: 'Replies auto-labelled as Interested, Not Interested or OOO. Sequences pause instantly.', delay: 545 },
    { icon: '\u{1F50D}', title: 'Keyword Monitor', body: 'Scans LinkedIn every 2 hours for buyers signalling intent. Auto-enrols them.', delay: 560, footer: 'Running every 2h', footerColor: brand.cyan },
    { icon: '\u{1F4CA}', title: 'Performance Reports', body: 'AI analyses your campaigns every 6 hours and sends you an improvement report.', delay: 575 },
  ];
  const fadeOutAll = interpolate(frame, [615, 630], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: opacity * fadeOutAll, fontFamily, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <NeuralNetworkBackground frame={frame} />
      <div style={{ position: 'relative', zIndex: 1, ...stepLabel }}>
        <div style={{ color: brand.cyan, fontSize: 20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, textAlign: 'center' }}>Step 3.</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, ...headline, textAlign: 'center', marginTop: 6 }}>
        <div style={{ color: 'white', fontSize: 58, fontWeight: 800 }}>AI that works while you don't.</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: 700, margin: '24px auto 0' }}>
        {cards.map((card, i) => {
          const anim = springScale(frame, card.delay, fps, 0.85, 1.0);
          return (
            <div key={i} style={{ ...anim, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: '18px 20px' }}>
              <span style={{ fontSize: 28 }}>{card.icon}</span>
              <div style={{ color: 'white', fontSize: 15, fontWeight: 700, marginTop: 8 }}>{card.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>{card.body}</div>
              {card.badges && (
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  {card.badges.map((b, j) => (
                    <span key={j} style={{ background: b.bg, color: b.color, borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 600 }}>{b.text}</span>
                  ))}
                </div>
              )}
              {card.footer && <div style={{ color: card.footerColor, fontSize: 11, marginTop: 10, fontWeight: 600 }}>{card.footer}</div>}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SceneResults: React.FC<{ frame: number; fps: number; opacity: number }> = ({ frame, fps, opacity }) => {
  const headline = fadeUp(frame, 630, fps);
  const counters = [
    { target: 287, suffix: '', label: 'emails sent this month', color: 'white', underline: brand.cyan, delay: 660 },
    { target: 34, suffix: '%', label: 'average open rate', color: 'white', underline: brand.cyan, delay: 680 },
    { target: 11, suffix: '', label: 'meetings booked', color: '#10B981', underline: '#10B981', delay: 700 },
  ];
  const barAnim = fadeUp(frame, 740, fps);
  const fadeOutAll = interpolate(frame, [760, 780], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: opacity * fadeOutAll, fontFamily, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <TrendingArrowBackground frame={frame} fps={fps} />
      <div style={{ position: 'relative', zIndex: 1, ...headline }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'white', fontSize: 64, fontWeight: 800 }}>The results speak</div>
          <div style={{ color: brand.cyan, fontSize: 64, fontWeight: 800, marginTop: -8 }}>for themselves.</div>
        </div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 20, justifyContent: 'center', marginTop: 32 }}>
        {counters.map((c, i) => {
          const anim = springScale(frame, c.delay, fps, 0.85, 1.0);
          const countVal = Math.round(interpolate(frame, [c.delay, c.delay + 60], [0, c.target], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
          return (
            <div key={i} style={{ ...anim, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '28px 24px', flex: 1, textAlign: 'center', maxWidth: 260 }}>
              <div style={{ color: c.color, fontSize: 88, fontWeight: 900, lineHeight: 1 }}>{countVal}{c.suffix}</div>
              <div style={{ width: 50, height: 3, background: c.underline, borderRadius: 2, margin: '10px auto' }} />
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16 }}>{c.label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'relative', zIndex: 1, ...barAnim }}>
        <div style={{ background: 'white', borderRadius: 14, padding: '14px 28px', width: 680, margin: '20px auto 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#6B7280', fontSize: 14 }}>Industry average open rate:</span>
            <span style={{ color: '#6B7280', fontSize: 14, fontWeight: 700 }}>21%</span>
          </div>
          <div style={{ width: 1, height: 28, background: '#E5E7EB' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#111827', fontSize: 14 }}>Leadomation:</span>
            <span style={{ color: brand.cyan, fontSize: 18, fontWeight: 700 }}>34%</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneCTA: React.FC<{ frame: number; fps: number; opacity: number }> = ({ frame, fps, opacity }) => {
  const logoPulse = spring({ frame: Math.max(0, frame - 780), fps: 30, config: { damping: 10, stiffness: 120 }, durationInFrames: 40 });
  const logoScale = interpolate(logoPulse, [0, 0.5, 1], [1.0, 1.08, 1.0]);
  const ctaText = fadeUp(frame, 800, fps);
  const subText = fadeUp(frame, 810, fps);
  const badges = [
    { icon: '\u2705', text: 'No lock-in' },
    { icon: '\u{1F512}', text: 'Secure payments via Stripe' },
    { icon: '\u{1F1EC}\u{1F1E7}', text: 'UK-based, GDPR compliant' },
  ];
  const urlAnim = fadeUp(frame, 860, fps);
  const underlineWidth = interpolate(frame, [865, 885], [0, 260], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const finalFade = interpolate(frame, [885, 900], [1, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Logo glow pulse
  const glowOpacity = Math.sin((frame - 780) / 20) * 0.15 + 0.85;

  // Social proof spring-in
  const socialProofScale = spring({
    frame: Math.max(0, frame - 868),
    fps: 30,
    config: { damping: 12, stiffness: 180 },
    durationInFrames: 25,
  });
  const socialProofOpacity = interpolate(Math.max(0, frame - 868), [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  // CTA pill shimmer
  const shimmerX = interpolate(frame, [875, 900], [-100, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: opacity * finalFade, fontFamily, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Logo glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 340,
          transform: 'translateX(-50%)',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, rgba(79,70,229,0.15) 40%, transparent 70%)',
          filter: 'blur(20px)',
          zIndex: 0,
          opacity: glowOpacity,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, transform: `scale(${logoScale})`, textAlign: 'center' }}>
        <Img src={staticFile('logo.png')} style={{ height: 64 }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1, ...ctaText, textAlign: 'center', marginTop: 20 }}>
        <div style={{ color: 'white', fontSize: 72, fontWeight: 900, lineHeight: 1.1 }}>Start your free trial.</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, ...subText, textAlign: 'center', marginTop: 12 }}>
        <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 20 }}>7 days free. No card required. Cancel anytime.</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
        {badges.map((badge, i) => {
          const anim = springScale(frame, 830 + i * 10, fps, 0.6, 1.0);
          return (
            <div key={i} style={{ ...anim, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 24, padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: 6, color: 'white', fontSize: 13 }}>
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          );
        })}
      </div>

      {/* Social proof avatars */}
      <div
        style={{
          position: 'absolute',
          top: 760,
          left: '50%',
          transform: `translateX(-50%) scale(${socialProofScale})`,
          opacity: socialProofOpacity,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {AVATAR_COLORS.map((color, i) => (
            <div
              key={i}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: color,
                border: '2px solid rgba(79,70,229,0.8)',
                marginLeft: i === 0 ? 0 : -8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 9,
                fontWeight: 700,
                fontFamily: brand.fontSans,
              }}
            >
              {AVATAR_INITIALS[i]}
            </div>
          ))}
        </div>
        <div style={{ marginLeft: 12 }}>
          <div style={{ color: 'white', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>Join 200+ founders</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, whiteSpace: 'nowrap' }}>already automating their outreach</div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, ...urlAnim, textAlign: 'center', marginTop: 24 }}>
        <div style={{ color: 'white', fontSize: 32, fontWeight: 700 }}>leadomation.co.uk</div>
        <div style={{ width: underlineWidth, height: 2, background: brand.cyan, margin: '6px auto 0', borderRadius: 1 }} />
      </div>

      {/* CTA pill with shimmer */}
      <div
        style={{
          position: 'absolute',
          top: 890,
          left: '50%',
          transform: `translateX(-50%) scale(${socialProofScale})`,
          opacity: socialProofOpacity,
          background: 'rgba(34,211,238,0.15)',
          border: '1px solid rgba(34,211,238,0.4)',
          borderRadius: 24,
          padding: '10px 28px',
          display: 'inline-block',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        <span style={{ color: '#22D3EE', fontSize: 14, fontWeight: 600, fontFamily: brand.fontSans, position: 'relative', zIndex: 1 }}>
          Start free - no card needed
        </span>
        {/* Shimmer stripe */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: shimmerX,
            width: 40,
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            transform: 'skewX(-20deg)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const FullShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scene = getScene(frame);

  const s1Op = frame < 120 ? sceneOpacity(frame, 0, 120) : 0;
  const s2Op = frame >= 105 && frame < 240 ? sceneOpacity(frame, 120, 240) : 0;
  const s3Op = frame >= 225 && frame < 360 ? sceneOpacity(frame, 240, 360) : 0;
  const s4Op = frame >= 345 && frame < 510 ? sceneOpacity(frame, 360, 510) : 0;
  const s5Op = frame >= 495 && frame < 630 ? sceneOpacity(frame, 510, 630) : 0;
  const s6Op = frame >= 615 && frame < 780 ? sceneOpacity(frame, 630, 780) : 0;
  const s7Op = frame >= 765 ? sceneOpacity(frame, 780, 900) : 0;

  const activeIndex = scene - 1;

  return (
    <AbsoluteFill style={{ fontFamily, background: '#1E1B4B' }}>
      <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 30%, #4F46E5 60%, #0E7490 100%)' }} />
      <div style={{ position: 'absolute', top: -120, left: -120, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.4) 0%, transparent 70%)' }} />
      <div style={{ position: 'absolute', bottom: -120, right: -120, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)' }} />
      <AbsoluteFill style={{ opacity: 0.4, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {s1Op > 0 && <ScenePain frame={frame} fps={fps} opacity={s1Op} />}
      {s2Op > 0 && <SceneIntro frame={frame} fps={fps} opacity={s2Op} />}
      {s3Op > 0 && <SceneLeadGen frame={frame} fps={fps} opacity={s3Op} />}
      {s4Op > 0 && <SceneOutreach frame={frame} fps={fps} opacity={s4Op} />}
      {s5Op > 0 && <SceneAI frame={frame} fps={fps} opacity={s5Op} />}
      {s6Op > 0 && <SceneResults frame={frame} fps={fps} opacity={s6Op} />}
      {s7Op > 0 && <SceneCTA frame={frame} fps={fps} opacity={s7Op} />}

      <Img src={staticFile('logo.png')} style={{ position: 'absolute', top: 44, left: 44, height: 44, zIndex: 100 }} />

      <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 100 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} style={{ width: i === activeIndex ? 18 : 6, height: 6, borderRadius: i === activeIndex ? 3 : '50%', background: i === activeIndex ? brand.cyan : 'rgba(255,255,255,0.25)' }} />
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 24, right: 44, color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', zIndex: 100 }}>
        {SCENE_NAMES[activeIndex]}
      </div>
    </AbsoluteFill>
  );
};
