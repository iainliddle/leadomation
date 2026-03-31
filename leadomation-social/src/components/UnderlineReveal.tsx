import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface UnderlineRevealProps {
  startFrame: number;
  color?: string;
  height?: number;
  duration?: number;
}

export const UnderlineReveal: React.FC<UnderlineRevealProps> = ({
  startFrame,
  color = '#22D3EE',
  height = 4,
  duration = 25,
}) => {
  const frame = useCurrentFrame();

  // Draw from left to right
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <span
      style={{
        position: 'absolute',
        bottom: -6,
        left: 0,
        right: 0,
        height,
        borderRadius: height / 2,
        background: color,
        width: `${progress * 100}%`,
        boxShadow: `0 0 12px ${color}80`,
        pointerEvents: 'none',
      }}
    />
  );
};
