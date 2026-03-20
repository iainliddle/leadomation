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
