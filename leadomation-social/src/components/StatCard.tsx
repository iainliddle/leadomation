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
