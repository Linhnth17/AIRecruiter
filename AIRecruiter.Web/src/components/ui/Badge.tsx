import type { StatusKey } from '../../styles/tokens';
import { colors } from '../../styles/tokens';

interface BadgeProps {
  label:    string;
  variant?: 'status' | 'skill' | 'score' | 'primary';
  score?:   number;
  status?:  string;
}

export default function Badge({ label, variant = 'skill', score, status }: BadgeProps) {
  const getStyle = (): { background: string; color: string } => {
    if (variant === 'status' && status) {
      const s = colors.status[status as StatusKey] ?? { bg: '#f0f0f0', text: '#666' };
      return { background: s.bg, color: s.text };
    }
    if (variant === 'score' && score !== undefined) {
      const s = score >= 70 ? colors.score.high : score >= 50 ? colors.score.medium : colors.score.low;
      return { background: s.bg, color: s.text };
    }
    if (variant === 'primary') {
      return { background: '#f0f0ff', color: colors.primary };
    }
    return { background: '#f0f2f5', color: colors.text.secondary };
  };

  return (
    <span style={{
      ...getStyle(),
      padding:      '3px 10px',
      borderRadius: 20,
      fontSize:     12,
      fontWeight:   500,
      display:      'inline-block',
      whiteSpace:   'nowrap',
    }}>
      {label}
    </span>
  );
}