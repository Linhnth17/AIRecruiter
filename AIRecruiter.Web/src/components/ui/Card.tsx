import type { CSSProperties, ReactNode } from 'react';
import { colors, radius, shadow, spacing } from '../../styles/tokens';

interface CardProps {
  children:   ReactNode;
  padding?:   number;
  hoverable?: boolean;
  selected?:  boolean;
  onClick?:   () => void;
  style?:     CSSProperties;
}

export default function Card({
  children,
  padding   = spacing.lg,
  hoverable = false,
  selected  = false,
  onClick,
  style     = {},
}: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background:   colors.bg.card,
        borderRadius: radius.lg,
        padding,
        boxShadow:    shadow.sm,
        border:       `2px solid ${selected ? colors.primary : 'transparent'}`,
        cursor:       onClick ? 'pointer' : 'default',
        transition:   'all 0.2s',
        ...style,
      }}
      onMouseEnter={hoverable ? e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow    = shadow.md;
        el.style.transform    = 'translateY(-2px)';
        el.style.borderColor  = colors.primary;
      } : undefined}
      onMouseLeave={hoverable ? e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow   = shadow.sm;
        el.style.transform   = 'translateY(0)';
        el.style.borderColor = selected ? colors.primary : 'transparent';
      } : undefined}
    >
      {children}
    </div>
  );
}