import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';

const LEADS = [
  { company: 'The Grand Manchester', role: 'General Manager', intent: 'Hot' as const },
  { company: 'Fletcher Law Group', role: 'Managing Partner', intent: 'Hot' as const },
  { company: 'Smile Clinic Northwest', role: 'Clinical Director', intent: 'Hot' as const },
  { company: 'Harbour Hotels Group', role: 'Director of Sales', intent: 'Warm' as const },
  { company: 'Donovan Solicitors', role: 'Partner', intent: 'Warm' as const },
];

const BADGE_STYLES = {
  Hot: {
    background: '#FEF2F2',
    color: '#DC2626',
    border: '1px solid #FECACA',
    label: '🔥 Hot',
  },
  Warm: {
    background: '#FFFBEB',
    color: '#D97706',
    border: '1px solid #FDE68A',
    label: '🌡 Warm',
  },
};

// Row delay: cards start at frame 40 (in parent), each row 12 frames apart
// The card is offset by <Sequence from={0}> so local frame starts at 0
// But the card itself is shown from frame 40 of the parent.
// We derive row animations from the card's local frame via the `frame` prop passed from parent.
const ROW_START_OFFSET = 80; // relative to global frame when rows start appearing
const ROW_DELAY = 12;

interface LeadScoreCardProps {
  frame: number;
}

export const LeadScoreCard: React.FC<LeadScoreCardProps> = ({ frame }) => {
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'white',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Card header */}
      <div
        style={{
          padding: '18px 28px 14px',
          borderBottom: '1px solid #F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', letterSpacing: -0.3 }}>
            Lead Database
          </div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
            47 leads scored by AI overnight
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#FEF2F2',
            borderRadius: 8,
            padding: '6px 12px',
            border: '1px solid #FECACA',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#DC2626',
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#DC2626' }}>
            🔥 Hot filter active
          </span>
        </div>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.4fr 0.8fr',
          padding: '10px 28px',
          background: '#F9FAFB',
          borderBottom: '1px solid #F3F4F6',
          flexShrink: 0,
        }}
      >
        {['COMPANY', 'ROLE', 'INTENT'].map((h) => (
          <div
            key={h}
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#9CA3AF',
              letterSpacing: 0.8,
            }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div style={{ flex: 1, padding: '0 0 0 0' }}>
        {LEADS.map((lead, i) => {
          const rowStartFrame = ROW_START_OFFSET + i * ROW_DELAY;
          const rowSpring = spring({
            frame: Math.max(0, frame - rowStartFrame),
            fps,
            config: { damping: 14, stiffness: 160 },
            durationInFrames: 25,
          });
          const rowOpacity = interpolate(rowSpring, [0, 1], [0, 1]);
          const rowY = interpolate(rowSpring, [0, 1], [16, 0]);

          const badgeStyle = BADGE_STYLES[lead.intent];

          return (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.4fr 0.8fr',
                padding: '14px 28px',
                borderBottom: i < LEADS.length - 1 ? '1px solid #F3F4F6' : 'none',
                alignItems: 'center',
                opacity: rowOpacity,
                transform: `translateY(${rowY}px)`,
                background: 'white',
              }}
            >
              {/* Company */}
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#111827',
                    lineHeight: 1.2,
                  }}
                >
                  {lead.company}
                </div>
              </div>

              {/* Role */}
              <div
                style={{
                  fontSize: 13,
                  color: '#6B7280',
                  fontWeight: 400,
                }}
              >
                {lead.role}
              </div>

              {/* Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 10px',
                  borderRadius: 20,
                  background: badgeStyle.background,
                  color: badgeStyle.color,
                  border: badgeStyle.border,
                  fontSize: 12,
                  fontWeight: 700,
                  width: 'fit-content',
                }}
              >
                {badgeStyle.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '11px 28px',
          borderTop: '1px solid #F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          background: '#F9FAFB',
        }}
      >
        <div style={{ fontSize: 11, color: '#9CA3AF' }}>Showing 5 of 47 hot leads</div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#4F46E5',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          View all leads →
        </div>
      </div>
    </div>
  );
};
