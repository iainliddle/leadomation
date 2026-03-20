---
name: leadomation-remotion-social
description: Create programmatic social media videos and animations for Leadomation using Remotion. Use when asked to create animated content, social media videos, feature demos, launch announcements, stat animations, or any motion graphics for Leadomation's LinkedIn, Instagram, or X accounts.
---

# Leadomation Social Media Video Creation with Remotion

Remotion lets you build videos with React. Every frame is a React component. You write JSX, it renders to MP4 or GIF. This skill covers creating on-brand social media content for Leadomation.

---

## Brand Tokens (ALWAYS USE THESE — NEVER DEVIATE)

```ts
export const brand = {
  // Colours
  indigo: '#4F46E5',        // Primary — use for headlines, key elements
  indigoDark: '#4338CA',    // Hover/depth
  indigoLight: '#EEF2FF',   // Backgrounds, subtle fills
  cyan: '#22D3EE',          // Accent — use for highlights, data points
  white: '#FFFFFF',
  pageBg: '#F8F9FA',        // Light grey background
  cardBg: '#FFFFFF',
  border: '#E5E7EB',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  // Typography
  fontSans: 'Inter, Outfit, sans-serif',

  // Gradients
  heroBg: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)',
  darkBg: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
};
```

---

## Project Setup

Run once per project. Do NOT run inside the Leadomation app repo — create a separate directory.

```bash
# Create new Remotion project
npm create video@latest leadomation-social
cd leadomation-social

# Choose: Hello World template (blank canvas)
# Package manager: npm

# Install fonts
npm install @remotion/google-fonts

# Install Remotion player for previewing
npm install @remotion/player
```

File structure after setup:
```
leadomation-social/
  src/
    Root.tsx          ← Register all compositions here
    compositions/     ← One file per video
    components/       ← Reusable brand components
    lib/
      brand.ts        ← Brand tokens (copy from above)
      utils.ts        ← Easing helpers
  public/
    logo.png          ← Copy from Leadomation src/assets/leadomation-logo.png
    logo-icon.png
```

---

## Registering Compositions (Root.tsx)

Every video must be registered here with its dimensions and duration.

```tsx
// src/Root.tsx
import { Composition } from 'remotion';
import { PipelineFlow } from './compositions/PipelineFlow';
import { LaunchAnnouncement } from './compositions/LaunchAnnouncement';
import { FeatureSpotlight } from './compositions/FeatureSpotlight';
import { StatCounter } from './compositions/StatCounter';

export const RemotionRoot = () => {
  return (
    <>
      {/* LinkedIn/Instagram square (1:1) */}
      <Composition
        id="PipelineFlow"
        component={PipelineFlow}
        durationInFrames={180}   // 6 seconds at 30fps
        fps={30}
        width={1080}
        height={1080}
      />

      {/* LinkedIn/X landscape (16:9) */}
      <Composition
        id="LaunchAnnouncement"
        component={LaunchAnnouncement}
        durationInFrames={150}   // 5 seconds
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Instagram/TikTok Story (9:16) */}
      <Composition
        id="FeatureSpotlight"
        component={FeatureSpotlight}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
```

**Standard dimensions:**
| Format | Width | Height | Use for |
|--------|-------|--------|---------|
| Square | 1080 | 1080 | LinkedIn feed, Instagram |
| Landscape | 1920 | 1080 | LinkedIn/X banner video |
| Story | 1080 | 1920 | Instagram/LinkedIn Stories |
| Banner | 1584 | 396 | LinkedIn company banner |

---

## Core Remotion Hooks

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring, Sequence, AbsoluteFill } from 'remotion';

// useCurrentFrame() — current frame number (0 to durationInFrames-1)
const frame = useCurrentFrame();

// useVideoConfig() — composition metadata
const { fps, durationInFrames, width, height } = useVideoConfig();

// interpolate() — map frame range to value range
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

// spring() — physics-based animation (bouncy, natural)
const scale = spring({
  frame,
  fps,
  config: { damping: 12, stiffness: 180 },
  durationInFrames: 40,
});

// Sequence — offset child animations by frame count
<Sequence from={30}>   {/* starts at frame 30 */}
  <MyComponent />
</Sequence>

// AbsoluteFill — full-size absolutely positioned container
<AbsoluteFill style={{ backgroundColor: brand.indigo }}>
  {children}
</AbsoluteFill>
```

---

## Reusable Brand Components

Save these in `src/components/`. Use across all compositions.

### BrandBackground
```tsx
// src/components/BrandBackground.tsx
import { AbsoluteFill } from 'remotion';
import { brand } from '../lib/brand';

type Variant = 'dark' | 'light' | 'indigo' | 'gradient';

export const BrandBackground: React.FC<{ variant?: Variant }> = ({
  variant = 'dark'
}) => {
  const styles: Record<Variant, React.CSSProperties> = {
    dark: { background: brand.darkBg },
    light: { background: brand.pageBg },
    indigo: { background: brand.indigo },
    gradient: { background: brand.heroBg },
  };

  return (
    <AbsoluteFill style={styles[variant]}>
      {/* Subtle grid overlay */}
      <AbsoluteFill style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        opacity: 0.6,
      }} />
    </AbsoluteFill>
  );
};
```

### Logo
```tsx
// src/components/Logo.tsx
import { Img, staticFile } from 'remotion';
import { brand } from '../lib/brand';

export const Logo: React.FC<{ size?: number; variant?: 'full' | 'icon' }> = ({
  size = 48,
  variant = 'full',
}) => {
  return (
    <Img
      src={staticFile(variant === 'full' ? 'logo.png' : 'logo-icon.png')}
      style={{ height: size, width: 'auto' }}
    />
  );
};
```

### AnimatedText
```tsx
// src/components/AnimatedText.tsx
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { brand } from '../lib/brand';

interface Props {
  text: string;
  delay?: number;       // frames to wait before animating
  style?: React.CSSProperties;
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft';
}

export const AnimatedText: React.FC<Props> = ({
  text, delay = 0, style = {}, animation = 'fadeUp'
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 160 },
    durationInFrames: 35,
  });

  const animations = {
    fadeUp: {
      opacity: interpolate(progress, [0, 1], [0, 1]),
      transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
    },
    fadeIn: {
      opacity: interpolate(progress, [0, 1], [0, 1]),
    },
    slideLeft: {
      opacity: interpolate(progress, [0, 1], [0, 1]),
      transform: `translateX(${interpolate(progress, [0, 1], [-40, 0])}px)`,
    },
  };

  return (
    <div style={{ fontFamily: brand.fontSans, ...animations[animation], ...style }}>
      {text}
    </div>
  );
};
```

### StatCard
```tsx
// src/components/StatCard.tsx
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { brand } from '../lib/brand';

interface Props {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
  dark?: boolean;
}

export const StatCard: React.FC<Props> = ({
  value, label, suffix = '', delay = 0, dark = true
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 50,
  });

  const displayValue = Math.round(interpolate(progress, [0, 1], [0, value]));

  const scale = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 200 },
    durationInFrames: 30,
  });

  return (
    <div style={{
      background: dark ? 'rgba(255,255,255,0.08)' : brand.white,
      border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : brand.border}`,
      borderRadius: 20,
      padding: '32px 40px',
      textAlign: 'center',
      transform: `scale(${scale})`,
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{
        fontSize: 72,
        fontWeight: 800,
        fontFamily: brand.fontSans,
        color: brand.cyan,
        lineHeight: 1,
      }}>
        {displayValue}{suffix}
      </div>
      <div style={{
        fontSize: 22,
        fontFamily: brand.fontSans,
        color: dark ? 'rgba(255,255,255,0.7)' : brand.textSecondary,
        marginTop: 12,
        fontWeight: 500,
      }}>
        {label}
      </div>
    </div>
  );
};
```

### PipelineStep
```tsx
// src/components/PipelineStep.tsx
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { brand } from '../lib/brand';

interface Props {
  icon: string;    // emoji or text
  label: string;
  delay?: number;
  active?: boolean;
}

export const PipelineStep: React.FC<Props> = ({ icon, label, delay = 0, active = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - delay);

  const scale = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 200 },
    durationInFrames: 30,
  });

  const opacity = interpolate(Math.min(localFrame, 30), [0, 30], [0, 1]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      transform: `scale(${scale})`,
      opacity,
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: active ? brand.indigo : 'rgba(255,255,255,0.1)',
        border: `2px solid ${active ? brand.cyan : 'rgba(255,255,255,0.2)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 32,
        boxShadow: active ? `0 0 24px ${brand.cyan}44` : 'none',
      }}>
        {icon}
      </div>
      <div style={{
        fontFamily: brand.fontSans,
        fontSize: 18,
        fontWeight: 600,
        color: active ? brand.white : 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        maxWidth: 100,
      }}>
        {label}
      </div>
    </div>
  );
};
```

---

## Composition Templates

### Template 1: Pipeline Flow Animation
Best for: LinkedIn feed, "how Leadomation works"

```tsx
// src/compositions/PipelineFlow.tsx
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { BrandBackground } from '../components/BrandBackground';
import { AnimatedText } from '../components/AnimatedText';
import { PipelineStep } from '../components/PipelineStep';
import { Logo } from '../components/Logo';
import { brand } from '../lib/brand';

const STEPS = [
  { icon: '🗺️', label: 'Scrape Google Maps', delay: 20 },
  { icon: '✉️', label: 'Find Emails', delay: 45 },
  { icon: '🧠', label: 'Score Intent', delay: 70 },
  { icon: '📧', label: 'Send Sequence', delay: 95 },
  { icon: '📅', label: 'Book Call', delay: 120 },
];

export const PipelineFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <BrandBackground variant="dark" />

      {/* Logo top-left */}
      <div style={{ position: 'absolute', top: 60, left: 60 }}>
        <Sequence from={0}>
          <Logo size={44} variant="full" />
        </Sequence>
      </div>

      {/* Headline */}
      <div style={{ position: 'absolute', top: 140, left: 0, right: 0, textAlign: 'center' }}>
        <AnimatedText
          text="From cold list to booked call."
          delay={0}
          animation="fadeUp"
          style={{ fontSize: 52, fontWeight: 800, color: brand.white, lineHeight: 1.2 }}
        />
        <AnimatedText
          text="Fully automated."
          delay={15}
          animation="fadeUp"
          style={{ fontSize: 52, fontWeight: 800, color: brand.cyan, lineHeight: 1.2, marginTop: 8 }}
        />
      </div>

      {/* Pipeline steps */}
      <div style={{
        position: 'absolute',
        bottom: 220,
        left: 0, right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 0,
      }}>
        {STEPS.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <PipelineStep
              icon={step.icon}
              label={step.label}
              delay={step.delay}
              active={frame > step.delay + 10}
            />
            {i < STEPS.length - 1 && (
              <div style={{
                width: 40,
                height: 2,
                background: `linear-gradient(90deg, ${brand.indigo}, ${brand.cyan})`,
                opacity: frame > step.delay + 20 ? 1 : 0,
                margin: '0 8px',
                marginBottom: 32,
              }} />
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <Sequence from={140}>
        <div style={{ position: 'absolute', bottom: 80, left: 0, right: 0, textAlign: 'center' }}>
          <AnimatedText
            text="leadomation.co.uk"
            animation="fadeIn"
            style={{ fontSize: 28, fontWeight: 600, color: brand.cyan, letterSpacing: 1 }}
          />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
```

---

### Template 2: Launch Announcement
Best for: LinkedIn/X landscape launch post

```tsx
// src/compositions/LaunchAnnouncement.tsx
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { BrandBackground } from '../components/BrandBackground';
import { AnimatedText } from '../components/AnimatedText';
import { Logo } from '../components/Logo';
import { brand } from '../lib/brand';

export const LaunchAnnouncement: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const glowOpacity = interpolate(
    frame % 60,
    [0, 30, 60],
    [0.3, 0.8, 0.3],
  );

  const badgeScale = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 10, stiffness: 200 },
    durationInFrames: 40,
  });

  return (
    <AbsoluteFill>
      <BrandBackground variant="dark" />

      {/* Glowing orb behind main text */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${brand.indigo}44, transparent 70%)`,
        opacity: glowOpacity,
      }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: 60, left: 80 }}>
        <Logo size={52} variant="full" />
      </div>

      {/* LIVE badge */}
      <Sequence from={20}>
        <div style={{
          position: 'absolute', top: 60, right: 80,
          background: `linear-gradient(135deg, ${brand.indigo}, ${brand.cyan})`,
          borderRadius: 100,
          padding: '12px 28px',
          transform: `scale(${badgeScale})`,
        }}>
          <span style={{
            fontFamily: brand.fontSans,
            fontSize: 22,
            fontWeight: 700,
            color: brand.white,
            letterSpacing: 2,
          }}>
            NOW LIVE
          </span>
        </div>
      </Sequence>

      {/* Main copy */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        width: '80%',
      }}>
        <AnimatedText
          text="B2B lead gen & outreach."
          delay={10}
          animation="fadeUp"
          style={{ fontSize: 80, fontWeight: 900, color: brand.white, lineHeight: 1.1 }}
        />
        <AnimatedText
          text="On autopilot."
          delay={25}
          animation="fadeUp"
          style={{ fontSize: 80, fontWeight: 900, color: brand.cyan, lineHeight: 1.1 }}
        />
        <AnimatedText
          text="From £59/month. No contracts."
          delay={50}
          animation="fadeIn"
          style={{ fontSize: 32, fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginTop: 32 }}
        />
      </div>

      {/* URL bottom */}
      <Sequence from={100}>
        <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, textAlign: 'center' }}>
          <AnimatedText
            text="leadomation.co.uk"
            animation="fadeIn"
            style={{ fontSize: 28, fontWeight: 600, color: brand.cyan, letterSpacing: 2 }}
          />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
```

---

### Template 3: Stat Counter
Best for: Social proof posts ("X leads found this week")

```tsx
// src/compositions/StatCounter.tsx
import { AbsoluteFill, Sequence } from 'remotion';
import { BrandBackground } from '../components/BrandBackground';
import { AnimatedText } from '../components/AnimatedText';
import { StatCard } from '../components/StatCard';
import { Logo } from '../components/Logo';
import { brand } from '../lib/brand';

// Customise these values for each post
const STATS = [
  { value: 2400, label: 'Leads found', suffix: '+' },
  { value: 847, label: 'Emails sent', suffix: '' },
  { value: 23, label: 'Calls booked', suffix: '' },
];

export const StatCounter: React.FC = () => {
  return (
    <AbsoluteFill>
      <BrandBackground variant="dark" />

      {/* Logo */}
      <div style={{ position: 'absolute', top: 60, left: 60 }}>
        <Logo size={44} />
      </div>

      {/* Headline */}
      <div style={{ position: 'absolute', top: 160, left: 0, right: 0, textAlign: 'center' }}>
        <AnimatedText
          text="This week in numbers."
          delay={0}
          style={{ fontSize: 56, fontWeight: 800, color: brand.white }}
        />
      </div>

      {/* Stat cards */}
      <div style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-40%)',
        left: 0, right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 40,
        padding: '0 80px',
      }}>
        {STATS.map((stat, i) => (
          <StatCard
            key={i}
            value={stat.value}
            label={stat.label}
            suffix={stat.suffix}
            delay={i * 20 + 30}
            dark
          />
        ))}
      </div>

      {/* CTA */}
      <Sequence from={130}>
        <div style={{ position: 'absolute', bottom: 80, left: 0, right: 0, textAlign: 'center' }}>
          <AnimatedText
            text="Start your free trial — leadomation.co.uk"
            animation="fadeIn"
            style={{ fontSize: 26, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}
          />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
```

---

### Template 4: LinkedIn Sequencer Phase Timeline
Best for: Showing the 35-day relationship funnel

```tsx
// src/compositions/SequencerTimeline.tsx
import { AbsoluteFill, Sequence, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';
import { BrandBackground } from '../components/BrandBackground';
import { AnimatedText } from '../components/AnimatedText';
import { brand } from '../lib/brand';

const PHASES = [
  { phase: 'P1', days: 'Days 1-10', label: 'Silent Awareness', icon: '👁️', desc: 'View + like posts', color: brand.indigo },
  { phase: 'P2', days: 'Day 12-14', label: 'Connect', icon: '🤝', desc: 'Personalised invite', color: '#7C3AED' },
  { phase: 'P3', days: 'Day 15-16', label: 'Warm Thanks', icon: '👋', desc: 'No-pitch message', color: '#2563EB' },
  { phase: 'P4', days: 'Day 20-22', label: 'Advice Ask', icon: '💡', desc: 'Build rapport', color: '#0891B2' },
  { phase: 'P5', days: 'Day 25-27', label: 'Follow Up', icon: '📩', desc: 'Soft mention', color: brand.cyan },
  { phase: 'P6', days: 'Day 30-35', label: 'Soft Offer', icon: '🎯', desc: 'Show the value', color: '#10B981' },
];

export const SequencerTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <BrandBackground variant="dark" />

      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center' }}>
        <AnimatedText
          text="35-Day LinkedIn Relationship Sequencer"
          delay={0}
          style={{ fontSize: 46, fontWeight: 800, color: brand.white }}
        />
        <AnimatedText
          text="Cold stranger to warm conversation. Automatically."
          delay={15}
          style={{ fontSize: 26, color: 'rgba(255,255,255,0.6)', marginTop: 12 }}
        />
      </div>

      {/* Phase cards */}
      <div style={{
        position: 'absolute',
        top: '40%',
        transform: 'translateY(-50%)',
        left: 60, right: 60,
        display: 'flex',
        gap: 24,
      }}>
        {PHASES.map((p, i) => {
          const localFrame = Math.max(0, frame - (i * 18 + 40));
          const scale = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 180 }, durationInFrames: 30 });
          const opacity = interpolate(Math.min(localFrame, 30), [0, 30], [0, 1]);

          return (
            <div key={i} style={{
              flex: 1,
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${p.color}44`,
              borderTop: `3px solid ${p.color}`,
              borderRadius: 16,
              padding: '24px 16px',
              transform: `scale(${scale})`,
              opacity,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{p.icon}</div>
              <div style={{ fontFamily: brand.fontSans, fontSize: 13, color: p.color, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>
                {p.days}
              </div>
              <div style={{ fontFamily: brand.fontSans, fontSize: 18, color: brand.white, fontWeight: 700, marginBottom: 6 }}>
                {p.label}
              </div>
              <div style={{ fontFamily: brand.fontSans, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                {p.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pro badge */}
      <Sequence from={160}>
        <div style={{ position: 'absolute', bottom: 70, left: 0, right: 0, textAlign: 'center' }}>
          <AnimatedText
            text="Pro feature — leadomation.co.uk"
            animation="fadeIn"
            style={{ fontSize: 24, color: brand.cyan, fontWeight: 600 }}
          />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
```

---

## Rendering to File

### Preview in browser (live reload):
```bash
npx remotion studio
# Opens http://localhost:3000 — pick any composition to preview
```

### Render single video to MP4:
```bash
npx remotion render PipelineFlow out/pipeline-flow.mp4
npx remotion render LaunchAnnouncement out/launch.mp4
npx remotion render StatCounter out/stats.mp4
npx remotion render SequencerTimeline out/sequencer.mp4
```

### Render as GIF (for LinkedIn/X):
```bash
npx remotion render PipelineFlow out/pipeline-flow.gif --codec=gif
```

### Render as PNG still (thumbnail / static graphic):
```bash
npx remotion still PipelineFlow out/thumbnail.png --frame=60
```

### Render with higher quality:
```bash
npx remotion render LaunchAnnouncement out/launch-hq.mp4 --crf=18
```

---

## Social Platform Specs

| Platform | Format | Recommended size | Max length | Notes |
|----------|--------|-----------------|------------|-------|
| LinkedIn feed | MP4 | 1080x1080 or 1920x1080 | 10 min | Square performs best |
| LinkedIn story | MP4 | 1080x1920 | 20 sec | Vertical only |
| X/Twitter | MP4 | 1280x720 | 2 min 20 sec | 16:9 preferred |
| Instagram feed | MP4 | 1080x1080 | 60 sec | Square or 4:5 |
| Instagram story | MP4 | 1080x1920 | 15 sec | Vertical only |

---

## Content Calendar — Recommended Videos to Build

In priority order for launch:

1. **LaunchAnnouncement** (1920x1080, 5s) — "Now Live" hero video for all platforms
2. **PipelineFlow** (1080x1080, 6s) — How it works, evergreen content
3. **SequencerTimeline** (1920x1080, 7s) — LinkedIn Pro feature showcase
4. **StatCounter** (1080x1080, 5s) — Weekly social proof, re-render with real numbers
5. **FeatureSpotlight** — One per key feature (Lead Gen, AI Voice, CRM Pipeline, Inbox)

---

## Copy Templates (Post Text to Accompany Videos)

### Launch post:
```
We just launched Leadomation.

B2B lead generation + outreach automation for small sales teams who want
to punch above their weight.

What it does:
→ Scrapes Google Maps for qualified local businesses
→ Finds verified email addresses automatically
→ Runs personalised email + LinkedIn + AI voice sequences
→ Books calls while you sleep

Starter from £59/month. No contracts. 7-day free trial.

leadomation.co.uk

#LeadGeneration #SalesAutomation #B2BSales #SaaS
```

### Pipeline flow post:
```
Cold list → booked call. Automatically.

Here's the exact pipeline running inside Leadomation:

1. Scrape Google Maps for ICP businesses in any city
2. Hunter.io finds verified email addresses
3. Intent Score engine prioritises warm leads
4. Email + LinkedIn + AI voice sequences run on autopilot
5. Calls land in your calendar

The whole thing runs while you focus on closing.

Try it free → leadomation.co.uk
```

### LinkedIn sequencer post:
```
Most LinkedIn outreach fails because it's too transactional.

Leadomation's LinkedIn Sequencer builds the relationship first:

Days 1-10: View profile, like posts (builds recognition)
Day 12: Personalised connection request
Day 15: Warm thank-you message
Day 20: Genuine advice ask
Day 25: Soft follow-up
Day 30: Light offer

35 days. Fully automated. Zero spammy pitches.

Pro feature — leadomation.co.uk
```

---

## Rules for This Skill

- NEVER change brand colours — always use tokens from the brand object
- NEVER use em-dashes in any copy or UI text
- All copy must be sentence case (never ALL CAPS for sustained text)
- Pricing is £59/mo Starter, £159/mo Pro — update these if they change
- LinkedIn Sequencer and AI Voice are Pro-only — label them clearly
- Scale tier is "Coming Soon" — never show it as available
- UAE jurisdiction for all business/legal references
- Logo files come from the Leadomation app at src/assets/
