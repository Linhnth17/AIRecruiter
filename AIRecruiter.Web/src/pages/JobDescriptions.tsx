import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { useJobs } from '../hooks/useJobs';
import { colors, spacing } from '../styles/tokens';
import { formatDate, truncate, parseSkills } from '../utils/format';

export default function JobDescriptions() {
  const navigate       = useNavigate();
  const { jobs, loading } = useJobs();

  if (loading) return (
    <EmptyState icon="⏳" title="Loading jobs..." />
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: colors.text.primary, marginBottom: 4 }}>
            Job Descriptions
          </h1>
          <p style={{ color: colors.text.muted, fontSize: 14 }}>{jobs.length} open positions</p>
        </div>
        <Button onClick={() => navigate('/create')}>+ New Job Description</Button>
      </div>

      {jobs.length === 0 && (
        <Card>
          <EmptyState
            icon="📋"
            title="No job descriptions yet"
            description="Create your first job description to start receiving applications"
            action={<Button onClick={() => navigate('/create')}>Create Job Description</Button>}
          />
        </Card>
      )}

      <div style={{ display: 'grid', gap: spacing.md, gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
        {jobs.map(job => (
          <Card key={job.id} hoverable onClick={() => navigate(`/jobs/${job.id}`)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: colors.text.primary }}>{job.title}</h3>
              <Badge label={`${job.yearsOfExperience}+ yrs`} variant="primary" />
            </div>

            <p style={{ color: colors.text.muted, fontSize: 13, marginBottom: spacing.md, lineHeight: 1.6 }}>
              {truncate(job.content, 110)}
            </p>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: spacing.md }}>
              {parseSkills(job.requiredSkills).slice(0, 4).map(s => (
                <Badge key={s} label={s} variant="skill" />
              ))}
              {parseSkills(job.requiredSkills).length > 4 && (
                <span style={{ color: colors.text.muted, fontSize: 12, padding: '3px 6px' }}>
                  +{parseSkills(job.requiredSkills).length - 4} more
                </span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: colors.text.muted, fontSize: 12 }}>{formatDate(job.createdAt)}</span>
              <span style={{ color: colors.primary, fontSize: 13, fontWeight: 500 }}>View candidates →</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}