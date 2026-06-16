import { useState } from 'react';
import type { Candidate } from '../api/client';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import ScoreRing from '../components/ui/ScoreRing';
import EmptyState from '../components/ui/EmptyState';
import { useJobs } from '../hooks/useJobs';
import { useCandidates } from '../hooks/useCandidates';
import { colors, spacing } from '../styles/tokens';
import { calcAverageScore } from '../utils/scoring';
import { parseList } from '../utils/format';
import {
  Users, Target, Clock, Star,
  Inbox, MousePointerClick, Bot,
  CheckCircle, AlertTriangle, Flag, MessageSquare, RefreshCw
} from 'lucide-react';

const STATUSES = ['Screening', 'Interview', 'Offer', 'Hired', 'Rejected'] as const;

// ── Sub-components ─────────────────────────────────────────────

function CandidateListItem({ candidate, selected, onClick }: {
  candidate: Candidate;
  selected:  boolean;
  onClick:   () => void;
}) {
  return (
    <Card selected={selected} onClick={onClick} padding={14} hoverable>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, color: colors.text.primary }}>
            {candidate.fullName}
          </p>
          <p style={{
            fontSize: 12, color: colors.text.muted,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {candidate.email}
          </p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
          <Badge
            label={candidate.matchScore > 0 ? `${candidate.matchScore}%` : '...'}
            variant="score"
            score={candidate.matchScore}
          />
          <div style={{ marginTop: 4 }}>
            <Badge label={candidate.status} variant="status" status={candidate.status} />
          </div>
        </div>
      </div>
    </Card>
  );
}

function AISection({ icon, title, color, items }: {
  icon:  React.ReactNode;
  title: string;
  color: string;
  items: string[];
}) {
  return (
    <div style={{ background: `${color}18`, borderRadius: 12, padding: spacing.md }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        {icon}
        <p style={{ fontWeight: 600, color, fontSize: 14 }}>{title}</p>
      </div>
      <ul style={{ paddingLeft: 18, color: colors.text.secondary, fontSize: 13, lineHeight: 1.8 }}>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}

function CandidateDetail({ candidate, onStatusChange }: {
  candidate:      Candidate;
  onStatusChange: (id: string, status: string) => void;
}) {
  const isProcessing = candidate.matchScore === 0;

  return (
    <Card style={{ height: 'fit-content' }}>
      {/* Header */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'flex-start',
        marginBottom:   spacing.lg,
        paddingBottom:  spacing.lg,
        borderBottom:   `1px solid ${colors.border}`,
      }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.text.primary, marginBottom: 4 }}>
            {candidate.fullName}
          </h2>
          <p style={{ color: colors.text.muted, fontSize: 14 }}>{candidate.email}</p>
        </div>
        <ScoreRing score={candidate.matchScore} size={80} />
      </div>

      {isProcessing ? (
        <EmptyState
          icon={<Bot size={48} color={colors.text.muted} />}
          title="AI is analyzing this CV..."
          description="Usually takes 10-20 seconds. This page auto-refreshes."
        />
      ) : (
        <>
          {/* Summary */}
          <div style={{
            background: '#f8f9ff', borderRadius: 12,
            padding: spacing.md, marginBottom: spacing.md
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <MessageSquare size={16} color={colors.primary} />
              <p style={{ fontWeight: 600, color: colors.primary, fontSize: 14 }}>AI Summary</p>
            </div>
            <p style={{ color: colors.text.secondary, fontSize: 14, lineHeight: 1.7 }}>
              {candidate.matchSummary}
            </p>
          </div>

          {/* Strengths & Weaknesses */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: spacing.sm, marginBottom: spacing.sm
          }}>
            <AISection
              icon={<CheckCircle size={16} color={colors.success} />}
              title="Strengths"
              color={colors.success}
              items={parseList(candidate.strengths)}
            />
            <AISection
              icon={<AlertTriangle size={16} color={colors.warning} />}
              title="Weaknesses"
              color={colors.warning}
              items={parseList(candidate.weaknesses)}
            />
          </div>

          {/* Red Flags */}
          {candidate.redFlags && candidate.redFlags !== 'None' && (
            <div style={{ marginBottom: spacing.sm }}>
              <AISection
                icon={<Flag size={16} color={colors.danger} />}
                title="Red Flags"
                color={colors.danger}
                items={parseList(candidate.redFlags)}
              />
            </div>
          )}

          {/* Interview Questions */}
          <div style={{
            background: '#faf5ff', borderRadius: 12,
            padding: spacing.md, marginBottom: spacing.lg
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <MessageSquare size={16} color="#7c3aed" />
              <p style={{ fontWeight: 600, color: '#7c3aed', fontSize: 14 }}>Interview Questions</p>
            </div>
            <ol style={{ paddingLeft: 18, color: colors.text.secondary, fontSize: 13, lineHeight: 2 }}>
              {parseList(candidate.suggestedQuestions).map((q, i) => <li key={i}>{q}</li>)}
            </ol>
          </div>
        </>
      )}

      {/* Status */}
      <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: spacing.md }}>
        <p style={{ fontWeight: 600, fontSize: 14, color: colors.text.secondary, marginBottom: 10 }}>
          Update Status
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {STATUSES.map(status => (
            <Button
              key={status}
              variant={candidate.status === status ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onStatusChange(candidate.id, status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ── Main Page ──────────────────────────────────────────────────

export default function ReviewDashboard() {
  const { jobs }                          = useJobs();
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [selected, setSelected]           = useState<Candidate | null>(null);

  const jobId = selectedJobId || jobs[0]?.id || '';
  const { candidates, loading, updateStatus } = useCandidates(jobId);

  // Derived stats
  const avgScore  = calcAverageScore(candidates.map(c => c.matchScore));
  const processing = candidates.filter(c => c.matchScore === 0).length;
  const highMatch  = candidates.filter(c => c.matchScore >= 70).length;

  const stats = [
    {
      label: 'Total Candidates',
      value: candidates.length,
      icon:  <Users size={32} color={colors.primary} />,
      color: colors.primary,
    },
    {
      label: 'Avg Match Score',
      value: avgScore > 0 ? `${avgScore}%` : '-',
      icon:  <Target size={32} color={colors.success} />,
      color: colors.success,
    },
    {
      label: 'Analyzing',
      value: processing,
      icon:  <Clock size={32} color={colors.warning} />,
      color: colors.warning,
    },
    {
      label: 'High Match (70%+)',
      value: highMatch,
      icon:  <Star size={32} color="#8b5cf6" />,
      color: '#8b5cf6',
    },
  ];

  const handleStatusChange = async (id: string, status: string) => {
    await updateStatus(id, status);
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: spacing.lg }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: colors.text.primary, marginBottom: 4 }}>
          Recruiter Dashboard
        </h1>
        <p style={{ color: colors.text.muted, fontSize: 14 }}>Review AI-analyzed candidates</p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: spacing.md, marginBottom: spacing.lg
      }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Job Selector */}
      <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center', marginBottom: spacing.lg }}>
        <select
          value={selectedJobId || jobs[0]?.id || ''}
          onChange={e => { setSelectedJobId(e.target.value); setSelected(null); }}
          style={{
            padding:    '9px 14px',
            borderRadius: 10,
            border:     `1.5px solid ${colors.border}`,
            fontSize:   14,
            background: '#fff',
            fontWeight: 500,
            outline:    'none',
            cursor:     'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => { void updateStatus('', ''); }}
        >
          <RefreshCw size={14} />
          Refresh
        </Button>

        {loading && <span style={{ color: colors.text.muted, fontSize: 13 }}>Loading...</span>}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: spacing.lg }}>

        {/* Candidate List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {candidates.length === 0 && !loading && (
            <Card>
              <EmptyState
                icon={<Inbox size={48} color={colors.text.muted} />}
                title="No candidates yet"
                description="Upload CVs to start reviewing"
              />
            </Card>
          )}
          {candidates.map(c => (
            <CandidateListItem
              key={c.id}
              candidate={c}
              selected={selected?.id === c.id}
              onClick={() => setSelected(c)}
            />
          ))}
        </div>

        {/* Detail Panel */}
        {selected ? (
          <CandidateDetail candidate={selected} onStatusChange={handleStatusChange} />
        ) : (
          <Card>
            <EmptyState
              icon={<MousePointerClick size={48} color={colors.text.muted} />}
              title="Select a candidate"
              description="Click on a candidate to view their AI analysis"
            />
          </Card>
        )}
      </div>
    </div>
  );
}