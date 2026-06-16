import type { CSSProperties, ReactNode } from 'react';
import { colors, radius, shadow } from '../../styles/tokens';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children:   ReactNode;
  onClick?:   () => void;
  variant?:   Variant;
  size?:      Size;
  fullWidth?: boolean;
  disabled?:  boolean;
  type?:      'button' | 'submit';
}

const VARIANTS: Record<Variant, CSSProperties> = {
  primary: {
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
    color:      '#fff',
    border:     'none',
    boxShadow:  shadow.primary,
  },
  secondary: {
    background: '#f0f0ff',
    color:      colors.primary,
    border:     `1.5px solid ${colors.primary}`,
  },
  ghost: {
    background: 'transparent',
    color:      colors.primary,
    border:     'none',
  },
  danger: {
    background: '#fee2e2',
    color:      colors.danger,
    border:     `1.5px solid ${colors.danger}`,
  },
};

const SIZES: Record<Size, CSSProperties> = {
  sm: { padding: '6px 14px',  fontSize: 13 },
  md: { padding: '10px 22px', fontSize: 14 },
  lg: { padding: '14px 28px', fontSize: 15 },
};

export default function Button({
  children, onClick,
  variant   = 'primary',
  size      = 'md',
  fullWidth = false,
  disabled  = false,
  type      = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        ...VARIANTS[variant],
        ...SIZES[size],
        width:          fullWidth ? '100%' : 'auto',
        borderRadius:   radius.md,
        fontWeight:     600,
        cursor:         disabled ? 'not-allowed' : 'pointer',
        opacity:        disabled ? 0.6 : 1,
        fontFamily:     'Inter, sans-serif',
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            6,
        transition:     'opacity 0.2s',
      }}
    >
      {children}
    </button>
  );
}