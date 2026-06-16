import type { ReactNode } from 'react';
import { colors, radius, shadow } from '../../styles/tokens';

interface StatCardProps {
  label:  string;
  value:  string | number;
  icon:   ReactNode;  
  color?: string;
}

export default function StatCard({ label, value, icon, color = colors.primary }: StatCardProps) {
  return (
    <div style={{
      background:     colors.bg.card,
      borderRadius:   radius.lg,
      padding:        '18px 20px',
      boxShadow:      shadow.sm,
      display:        'flex',
      justifyContent: 'space-between',
      alignItems:     'center',
    }}>
      <div>
        <p style={{ color: colors.text.muted, fontSize: 12, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 26, fontWeight: 700, color }}>{value}</p>
      </div>
      <div style={{ color: colors.text.muted }}>{icon}</div>
    </div>
  );
}