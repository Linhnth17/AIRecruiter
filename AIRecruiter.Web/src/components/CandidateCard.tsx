import { useState } from 'react';
import type { Candidate } from '../api/client';
import { candidateApi } from '../api/client';

interface Props {
  candidate: Candidate;
  onStatusChange: () => void;
}

const statusColors: Record<string, string> = {
  Applied:   '#3498db',
  Screening: '#f39c12',
  Interview: '#9b59b6',
  Offer:     '#27ae60',
  Hired:     '#1abc9c',
  Rejected:  '#e74c3c',
};

export default function CandidateCard({ candidate: c, onStatusChange }: Props) {
  const [expanded, setExpanded] = useState(false);

  const handleStatus = async (status: string) => {
    await candidateApi.updateStatus(c.id, status);
    onStatusChange();
  };

  const scoreColor = c.matchScore >= 70 ? '#27ae60' : c.matchScore >= 50 ? '#f39c12' : '#e74c3c';

  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 4px' }}>{c.fullName}</h3>
          <p style={{ color: '#888', margin: 0, fontSize: 14 }}>{c.email}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: scoreColor }}>
            {c.matchScore > 0 ? `${c.matchScore}%` : '...'}
          </div>
          <span style={{
            background: statusColors[c.status] || '#888',
            color: '#fff', padding: '2px 10px', borderRadius: 12, fontSize: 12
          }}>{c.status}</span>
        </div>
      </div>

      {c.matchSummary && (
        <p style={{ color: '#555', marginTop: 12, fontSize: 14 }}>{c.matchSummary}</p>
      )}

      {c.matchScore > 0 && (
        <button onClick={() => setExpanded(!expanded)}
          style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', padding: 0, marginTop: 8 }}>
          {expanded ? '▲ Hide details' : '▼ Show details'}
        </button>
      )}

      {expanded && (
        <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
          {c.strengths && (
            <div>
              <strong style={{ color: '#27ae60' }}>✅ Strengths</strong>
              <ul style={{ margin: '4px 0 0 20px', fontSize: 14 }}>
                {c.strengths.split('|').map((s, i) => <li key={i}>{s.trim()}</li>)}
              </ul>
            </div>
          )}
          {c.weaknesses && (
            <div>
              <strong style={{ color: '#e67e22' }}>⚠️ Weaknesses</strong>
              <ul style={{ margin: '4px 0 0 20px', fontSize: 14 }}>
                {c.weaknesses.split('|').map((s, i) => <li key={i}>{s.trim()}</li>)}
              </ul>
            </div>
          )}
          {c.redFlags && (
            <div>
              <strong style={{ color: '#e74c3c' }}>🚩 Red Flags</strong>
              <ul style={{ margin: '4px 0 0 20px', fontSize: 14 }}>
                {c.redFlags.split('|').map((s, i) => <li key={i}>{s.trim()}</li>)}
              </ul>
            </div>
          )}
          {c.suggestedQuestions && (
            <div>
              <strong style={{ color: '#8e44ad' }}>💬 Interview Questions</strong>
              <ol style={{ margin: '4px 0 0 20px', fontSize: 14 }}>
                {c.suggestedQuestions.split('|').map((s, i) => <li key={i}>{s.trim()}</li>)}
              </ol>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['Screening', 'Interview', 'Offer', 'Hired', 'Rejected'].map(status => (
          <button key={status} onClick={() => handleStatus(status)}
            disabled={c.status === status}
            style={{
              background: c.status === status ? statusColors[status] : '#f0f0f0',
              color: c.status === status ? '#fff' : '#333',
              border: 'none', padding: '4px 12px', borderRadius: 6,
              cursor: c.status === status ? 'default' : 'pointer', fontSize: 13
            }}>
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}