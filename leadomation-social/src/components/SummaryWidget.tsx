import React from 'react';
import { interpolate } from 'remotion';

export interface SummaryRow {
  dotColor: string;
  label: string;
  value: string;
  valueColor?: string;
}

interface SummaryWidgetProps {
  title: string;
  rows: SummaryRow[];
  footer: string;
  springValue: number;
}

export const SummaryWidget: React.FC<SummaryWidgetProps> = ({ title, rows, footer, springValue }) => {
  const opacity = interpolate(springValue, [0, 1], [0, 1]);
  const x = interpolate(springValue, [0, 1], [40, 0]);
  return (
    <div style={{ opacity, transform: `translateX(${x}px)`, width: '100%' }}>
      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '18px 20px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', letterSpacing: 1.2, textTransform: 'uppercase' as const, marginBottom: 14 }}>{title}</div>
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: i < rows.length - 1 ? 10 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: row.dotColor, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{row.label}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: row.valueColor || '#4F46E5' }}>{row.value}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid #F3F4F6', marginTop: 12, paddingTop: 10 }}>
          <div style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' as const }}>{footer}</div>
        </div>
      </div>
    </div>
  );
};
