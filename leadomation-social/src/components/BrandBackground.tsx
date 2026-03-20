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
