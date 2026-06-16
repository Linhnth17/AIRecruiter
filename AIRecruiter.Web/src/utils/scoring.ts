import { colors } from '../styles/tokens';

export function getScoreColor(score: number) {
  if (score >= 70) return colors.score.high;
  if (score >= 50) return colors.score.medium;
  return colors.score.low;
}

export function getScoreLabel(score: number): string {
  if (score === 0)  return 'Analyzing...';
  if (score >= 80)  return 'Excellent';
  if (score >= 70)  return 'Good';
  if (score >= 50)  return 'Average';
  return 'Below Average';
}

export function calcAverageScore(scores: number[]): number {
  const valid = scores.filter(s => s > 0);
  if (valid.length === 0) return 0;
  return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
}