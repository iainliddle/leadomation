import React from 'react';
import { AbsoluteFill } from 'remotion';

export const SocialBackground: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 30%, #4F46E5 60%, #0E7490 100%)' }} />
    <div style={{ position: 'absolute', top: -200, left: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: -150, right: -150, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
    <AbsoluteFill style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.4, pointerEvents: 'none' }} />
  </>
);
