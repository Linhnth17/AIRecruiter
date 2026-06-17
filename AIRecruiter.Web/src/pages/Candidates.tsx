import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Candidate } from '../api/client';
import { candidateApi } from '../api/client';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ScoreRing from '../components/ui/ScoreRing';
import EmptyState from '../components/ui/EmptyState';
import { colors, spacing, shadow, radius } from '../styles/tokens';
import { parseList } from '../utils/format';
import { useJobs } from '../hooks/useJobs';
import {
  Users, CheckCircle, AlertTriangle, Flag,
  MessageSquare, ChevronDown, ChevronUp,
  RefreshCw, GitCompare, X
} from 'lucide-react';

// ── Compare Modal ─────────────────────────────────────────────

function CompareModal({ candidates, onClose }: {
  candidates: Candidate[];
  onClose:    () => void;
}) {
  const scoreColor = (score: number) =>
    score >= 70 ? colors.success : score >= 50 ? colors.warning : colors.danger;

  return (
    <div style={{
      position:        'fixed',
      inset:           0,
      background:      'rgba(0,0,0,0.5)',
      zIndex:          200,
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      padding:         spacing.lg,
    }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:   '#fff',
          borderRadius: radius.xl,
          width:        '95vw',
          maxWidth:     1100,
          maxHeight:    '90vh',
          overflowY:    'auto',
          boxShadow:    shadow.lg,
        }}
      >
        {/* Modal Header */}
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          padding:        `${spacing.lg}px ${spacing.xl}px`,
          borderBottom:   `1px solid ${colors.border}`,
          position:       'sticky',
          top:            0,
          background:     '#fff',
          zIndex:         1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <GitCompare size={20} color={colors.primary} />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.text.primary }}>
              Candidate Comparison
            </h2>
            <span style={{ color: colors.text.muted, fontSize: 14 }}>
              ({candidates.length} candidates)
            </span>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            cursor: 'pointer', color: colors.text.muted
          }}>
            <X size={22} />
          </button>
        </div>

        {/* Compare Table */}
        <div style={{ padding: spacing.xl }}>
          <div style={{
            display:             'grid',
            gridTemplateColumns: `180px repeat(${candidates.length}, 1fr)`,
            gap:                 1,
            background:          colors.border,
            borderRadius:        radius.md,
            overflow:            'hidden',
          }}>

            {/* Header Row */}
            <div style={{ background: '#f8f9fa', padding: spacing.md }} />
            {candidates.map(c => (
              <div key={c.id} style={{
                background: '#f8f9fa', padding: spacing.md, textAlign: 'center'
              }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: colors.text.primary, marginBottom: 4 }}>
                  {c.fullName}
                </p>
                <p style={{ fontSize: 12, color: colors.text.muted }}>{c.email}</p>
              </div>
            ))}

            {/* Match Score */}
            <Cell label="Match Score" isLabel />
            {candidates.map(c => (
              <Cell key={c.id}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <ScoreRing score={c.matchScore} size={64} />
                </div>
              </Cell>
            ))}

            {/* Status */}
            <Cell label="Status" isLabel />
            {candidates.map(c => (
              <Cell key={c.id}>
                <Badge label={c.status} variant="status" status={c.status} />
              </Cell>
            ))}

            {/* Summary */}
            <Cell label="AI Summary" isLabel />
            {candidates.map(c => (
              <Cell key={c.id}>
                <p style={{ fontSize: 13, color: colors.text.secondary, lineHeight: 1.6 }}>
                  {c.matchSummary || '—'}
                </p>
              </Cell>
            ))}

            {/* Strengths */}
            <Cell label="Strengths" isLabel />
            {candidates.map(c => (
              <Cell key={c.id}>
                <ul style={{ paddingLeft: 16, fontSize: 13, color: colors.success, lineHeight: 1.8 }}>
                  {parseList(c.strengths).map((s, i) => (
                    <li key={i} style={{ color: colors.text.secondary }}>{s}</li>
                  ))}
                </ul>
              </Cell>
            ))}

            {/* Weaknesses */}
            <Cell label="Weaknesses" isLabel />
            {candidates.map(c => (
              <Cell key={c.id}>
                <ul style={{ paddingLeft: 16, fontSize: 13, lineHeight: 1.8 }}>
                  {parseList(c.weaknesses).map((s, i) => (
                    <li key={i} style={{ color: colors.text.secondary }}>{s}</li>
                  ))}
                </ul>
              </Cell>
            ))}

            {/* Red Flags */}
            <Cell label="Red Flags" isLabel />
            {candidates.map(c => (
              <Cell key={c.id}>
                {c.redFlags && c.redFlags !== 'None' ? (
                  <ul style={{ paddingLeft: 16, fontSize: 13, lineHeight: 1.8 }}>
                    {parseList(c.redFlags).map((s, i) => (
                      <li key={i} style={{ color: colors.danger }}>{s}</li>
                    ))}
                  </ul>
                ) : (
                  <span style={{ fontSize: 13, color: colors.success }}>✅ None</span>
                )}
              </Cell>
            ))}

            {/* Interview Questions */}
            <Cell label="Interview Questions" isLabel />
            {candidates.map(c => (
              <Cell key={c.id}>
                <ol style={{ paddingLeft: 16, fontSize: 13, color: colors.text.secondary, lineHeight: 1.9 }}>
                  {parseList(c.suggestedQuestions).map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ol>
              </Cell>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Cell({ children, label, isLabel }: {
  children?: React.ReactNode;
  label?:    string;
  isLabel?:  boolean;
}) {
  return (
    <div style={{
      background: isLabel ? '#f0f2f5' : '#fff',
      padding:    spacing.md,
      display:    'flex',
      alignItems: isLabel ? 'center' : 'flex-start',
      justifyContent: isLabel ? 'flex-start' : 'center',
    }}>
      {isLabel ? (
        <span style={{ fontWeight: 600, fontSize: 13, color: colors.text.secondary }}>{label}</span>
      ) : children}
    </div>
  );
}

// ── Candidate Card ────────────────────────────────────────────

function CandidateCard({ candidate, selected, onSelect, onStatusChange }: {
  candidate:      Candidate;
  selected:       boolean;
  onSelect:       (id: string) => void;
  onStatusChange: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isProcessing = candidate.matchScore === 0;

  const handleStatus = async (status: string) => {
    await candidateApi.updateStatus(candidate.id, status);
    onStatusChange();
  };

  return (
    <Card style={{
      marginBottom: 12,
      border: selected ? `2px solid ${colors.primary}` : '2px solid transparent',
      transition: 'border-color 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(candidate.id)}
          style={{ width: 18, height: 18, cursor: 'pointer', accentColor: colors.primary }}
        />

        {/* Score Ring */}
        <ScoreRing score={candidate.matchScore} size={56} />

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, fontSize: 16, color: colors.text.primary, marginBottom: 2 }}>
            {candidate.fullName || 'Extracting...'}
          </p>
          <p style={{ fontSize: 13, color: colors.text.muted }}>{candidate.email}</p>
        </div>

        {/* Status + Expand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Badge label={candidate.status} variant="status" status={candidate.status} />
          {!isProcessing && (
            <button onClick={() => setExpanded(!expanded)} style={{
              background: 'none', border: 'none',
              cursor: 'pointer', color: colors.primary
            }}>
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}
        </div>
      </div>

      {isProcessing && (
        <p style={{ color: colors.text.muted, fontSize: 13, marginTop: 8, paddingLeft: 34 }}>
          ⏳ AI is analyzing this CV...
        </p>
      )}

      {expanded && !isProcessing && (
        <div style={{ marginTop: spacing.md, paddingTop: spacing.md, borderTop: `1px solid ${colors.border}`, paddingLeft: 34 }}>

          {/* Summary */}
          <div style={{ background: '#f8f9ff', borderRadius: 10, padding: spacing.md, marginBottom: spacing.sm }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <MessageSquare size={14} color={colors.primary} />
              <span style={{ fontWeight: 600, fontSize: 13, color: colors.primary }}>AI Summary</span>
            </div>
            <p style={{ fontSize: 13, color: colors.text.secondary, lineHeight: 1.7 }}>
              {candidate.matchSummary}
            </p>
          </div>

          {/* Strengths & Weaknesses */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm, marginBottom: spacing.sm }}>
            <div style={{ background: '#f0fdf4', borderRadius: 10, padding: spacing.md }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <CheckCircle size={14} color={colors.success} />
                <span style={{ fontWeight: 600, fontSize: 13, color: colors.success }}>Strengths</span>
              </div>
              <ul style={{ paddingLeft: 16, fontSize: 13, color: colors.text.secondary, lineHeight: 1.8 }}>
                {parseList(candidate.strengths).map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div style={{ background: '#fffbeb', borderRadius: 10, padding: spacing.md }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <AlertTriangle size={14} color={colors.warning} />
                <span style={{ fontWeight: 600, fontSize: 13, color: colors.warning }}>Weaknesses</span>
              </div>
              <ul style={{ paddingLeft: 16, fontSize: 13, color: colors.text.secondary, lineHeight: 1.8 }}>
                {parseList(candidate.weaknesses).map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>

          {/* Red Flags */}
          {candidate.redFlags && candidate.redFlags !== 'None' && (
            <div style={{ background: '#fff1f2', borderRadius: 10, padding: spacing.md, marginBottom: spacing.sm }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Flag size={14} color={colors.danger} />
                <span style={{ fontWeight: 600, fontSize: 13, color: colors.danger }}>Red Flags</span>
              </div>
              <ul style={{ paddingLeft: 16, fontSize: 13, color: colors.text.secondary, lineHeight: 1.8 }}>
                {parseList(candidate.redFlags).map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          {/* Interview Questions */}
          {candidate.suggestedQuestions && (
            <div style={{ background: '#faf5ff', borderRadius: 10, padding: spacing.md, marginBottom: spacing.md }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <MessageSquare size={14} color="#7c3aed" />
                <span style={{ fontWeight: 600, fontSize: 13, color: '#7c3aed' }}>Interview Questions</span>
              </div>
              <ol style={{ paddingLeft: 18, fontSize: 13, color: colors.text.secondary, lineHeight: 2 }}>
                {parseList(candidate.suggestedQuestions).map((q, i) => <li key={i}>{q}</li>)}
              </ol>
            </div>
          )}

          {/* Status Actions */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Screening', 'Interview', 'Offer', 'Hired', 'Rejected'].map(status => (
              <Button
                key={status}
                size="sm"
                variant={candidate.status === status ? 'secondary' : 'ghost'}
                onClick={() => handleStatus(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────

const MAX_COMPARE = 4;

export default function Candidates() {
  const [searchParams, setSearchParams]   = useSearchParams();
  const { jobs }                          = useJobs();
  const [selectedJobId, setSelectedJobId] = useState<string>(searchParams.get('jobId') ?? '');
  const [candidates, setCandidates]       = useState<Candidate[]>([]);
  const [loading, setLoading]             = useState(false);
  const [compareIds, setCompareIds]       = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare]     = useState(false);

  useEffect(() => {
    if (jobs.length > 0 && !selectedJobId)
      setSelectedJobId(jobs[0].id);
  }, [jobs]);

  useEffect(() => {
    if (!selectedJobId) return;
    loadCandidates();
    setCompareIds(new Set());
  }, [selectedJobId]);

  useEffect(() => {
    const hasProcessing = candidates.some(c => c.matchScore === 0);
    if (!hasProcessing) return;
    const timer = setInterval(loadCandidates, 10000);
    return () => clearInterval(timer);
  }, [candidates]);

  const loadCandidates = async () => {
    if (!selectedJobId) return;
    setLoading(true);
    try {
      const res = await candidateApi.getByJob(selectedJobId);
      setCandidates(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleJobChange = (jobId: string) => {
    setSelectedJobId(jobId);
    setSearchParams({ jobId });
  };

  const handleSelect = (id: string) => {
    setCompareIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= MAX_COMPARE) return prev; // max 4
        next.add(id);
      }
      return next;
    });
  };

  const compareCandidates = candidates.filter(c => compareIds.has(c.id));
  const selectedJob        = jobs.find(j => j.id === selectedJobId);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: spacing.lg }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: colors.text.primary, marginBottom: 4 }}>
          Candidates
        </h1>
        <p style={{ color: colors.text.muted, fontSize: 14 }}>
          AI-analyzed candidates filtered by job description
        </p>
      </div>

      {/* JD Selector */}
      <Card style={{ marginBottom: spacing.lg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} color={colors.primary} />
            <span style={{ fontWeight: 600, fontSize: 15, color: colors.text.primary }}>
              Job Description:
            </span>
          </div>
          <select
            value={selectedJobId}
            onChange={e => handleJobChange(e.target.value)}
            style={{
              padding: '8px 14px', borderRadius: 8,
              border: `1.5px solid ${colors.border}`,
              fontSize: 14, background: '#fff',
              fontFamily: 'Inter, sans-serif',
              outline: 'none', cursor: 'pointer', minWidth: 250,
            }}
          >
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>

          <Button variant="secondary" size="sm" onClick={loadCandidates}>
            <RefreshCw size={14} /> Refresh
          </Button>

          <span style={{ color: colors.text.muted, fontSize: 13, marginLeft: 'auto' }}>
            {candidates.length} candidates
            {candidates.some(c => c.matchScore === 0) && (
              <span style={{ color: colors.warning, marginLeft: 8 }}>
                · {candidates.filter(c => c.matchScore === 0).length} analyzing...
              </span>
            )}
          </span>
        </div>

        {selectedJob && (
          <div style={{ marginTop: spacing.md, paddingTop: spacing.md, borderTop: `1px solid ${colors.border}` }}>
            <p style={{ fontSize: 13, color: colors.text.muted, lineHeight: 1.6 }}>
              {selectedJob.content.slice(0, 150)}...
            </p>
          </div>
        )}
      </Card>

      {/* Compare Toolbar */}
      {compareIds.size > 0 && (
        <div style={{
          position:       'sticky',
          top:            68,
          zIndex:         50,
          background:     `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          borderRadius:   radius.lg,
          padding:        '12px 20px',
          marginBottom:   spacing.md,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          boxShadow:      shadow.primary,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <GitCompare size={18} color="#fff" />
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>
              {compareIds.size} candidate{compareIds.size > 1 ? 's' : ''} selected
              {compareIds.size < 2 && ' — select at least 2 to compare'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setCompareIds(new Set())} style={{
              background: 'rgba(255,255,255,0.2)', border: 'none',
              color: '#fff', padding: '6px 14px', borderRadius: 6,
              cursor: 'pointer', fontSize: 13,
            }}>
              Clear
            </button>
            {compareIds.size >= 2 && (
              <button onClick={() => setShowCompare(true)} style={{
                background: '#fff', border: 'none',
                color: colors.primary, padding: '6px 16px',
                borderRadius: 6, cursor: 'pointer',
                fontSize: 13, fontWeight: 600,
              }}>
                Compare Now →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Empty states */}
      {loading && candidates.length === 0 && (
        <EmptyState icon={<Users size={48} color={colors.text.muted} />} title="Loading candidates..." />
      )}
      {!loading && candidates.length === 0 && (
        <Card>
          <EmptyState
            icon={<Users size={48} color={colors.text.muted} />}
            title="No candidates yet"
            description="Upload CVs from the Upload page — AI will automatically classify them"
          />
        </Card>
      )}

      {/* Candidate List */}
      {candidates.map(c => (
        <CandidateCard
          key={c.id}
          candidate={c}
          selected={compareIds.has(c.id)}
          onSelect={handleSelect}
          onStatusChange={loadCandidates}
        />
      ))}

      {/* Compare Modal */}
      {showCompare && compareCandidates.length >= 2 && (
        <CompareModal
          candidates={compareCandidates}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
}