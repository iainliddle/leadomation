import React from 'react';
import { interpolate } from 'remotion';

interface TooltipCardProps {
  label: string;
  dotColor: string;
  springValue: number;    // 0→1
  top: number;
  left: number;
  width: number;
  relative?: boolean;     // when true, renders as position:relative (for flex layouts)
}

export const TooltipCard: React.FC<TooltipCardProps> = ({
  label,
  dotColor,
  springValue,
  top,
  left,
  width,
  relative = false,
}) => {
  const opacity = interpolate(springValue, [0, 1], [0, 1]);
  const x = interpolate(springValue, [0, 1], [40, 0]);

  return (
    <div
      style={{
        position: relative ? 'relative' : 'absolute',
        ...(relative ? {} : { top, left }),
        width,
        opacity,
        transform: `translateX(${x}px)`,
        zIndex: 40,
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 12,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          border: '1px solid rgba(0,0,0,0.05)',
          width: '100%',
          boxSizing: 'border-box' as const,
        }}
      >
        {/* Dot indicator */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: dotColor,
            flexShrink: 0,
            boxShadow: `0 0 8px ${dotColor}80`,
          }}
        />
        {/* Label */}
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#111827',
            lineHeight: 1.3,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};
