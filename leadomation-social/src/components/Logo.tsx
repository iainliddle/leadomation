import { Img, staticFile } from 'remotion';

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
