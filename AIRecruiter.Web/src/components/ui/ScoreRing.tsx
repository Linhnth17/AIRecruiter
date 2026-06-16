import { getScoreColor, getScoreLabel } from '../../utils/scoring';

interface ScoreRingProps {
  score: number;
  size?: number;
}

export default function ScoreRing({ score, size = 80 }: ScoreRingProps) {
  const { text: color } = getScoreColor(score);
  const label           = getScoreLabel(score);
  const deg             = score * 3.6;

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width:          size,
        height:         size,
        borderRadius:   '50%',
        background:     `conic-gradient(${color} ${deg}deg, #f0f0f0 0deg)`,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width:          size * 0.72,
          height:         size * 0.72,
          borderRadius:   '50%',
          background:     '#fff',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: size * 0.22, fontWeight: 700, color, lineHeight: 1 }}>
            {score > 0 ? `${score}%` : '⏳'}
          </span>
        </div>
      </div>
      <p style={{ fontSize: 11, color, fontWeight: 600, marginTop: 6 }}>{label}</p>
    </div>
  );
}