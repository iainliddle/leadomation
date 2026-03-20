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
