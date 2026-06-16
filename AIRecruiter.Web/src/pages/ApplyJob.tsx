import { useState } from 'react';
import type { JobDescription } from '../api/client';
import { candidateApi } from '../api/client';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useJobs } from '../hooks/useJobs';
import { colors, spacing, radius } from '../styles/tokens';
import { parseSkills } from '../utils/format';

interface FormState {
  fullName: string;
  email:    string;
}

function JobPreview({ job }: { job: JobDescription }) {
  return (
    <div style={{
      background:   '#f8f0ff',
      borderRadius: radius.md,
      padding:      spacing.md,
      marginBottom: spacing.lg,
      border:       `1px solid #e0d0ff`,
    }}>
      <p style={{ fontSize: 13, color: colors.text.secondary, marginBottom: 10, lineHeight: 1.6 }}>
        {job.content.slice(0, 150)}...
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
        {parseSkills(job.requiredSkills).map(s => (
          <Badge key={s} label={s} variant="primary" />
        ))}
      </div>
      <p style={{ fontSize: 12, color: colors.text.muted }}>
        {job.yearsOfExperience}+ years experience required
      </p>
    </div>
  );
}

function SuccessScreen({ name, onReset }: { name: string; onReset: () => void }) {
  return (
    <div style={{ maxWidth: 480, margin: '60px auto', textAlign: 'center' }}>
      <Card padding={spacing.xxl}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
        <h2 style={{ color: colors.success, marginBottom: 12, fontSize: 24 }}>Application Submitted!</h2>
        <p style={{ color: colors.text.secondary, lineHeight: 1.7, marginBottom: spacing.lg }}>
          Thank you <strong>{name}</strong>! Your CV is being analyzed by our AI.
          We'll review your application and get back to you soon.
        </p>
        <Button onClick={onReset}>Submit Another Application</Button>
      </Card>
    </div>
  );
}

export default function ApplyJob() {
  const { jobs }                          = useJobs();
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [form, setForm]                   = useState<FormState>({ fullName: '', email: '' });
  const [file, setFile]                   = useState<File | null>(null);
  const [loading, setLoading]             = useState(false);
  const [submitted, setSubmitted]         = useState(false);

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleReset = () => {
    setSubmitted(false);
    setForm({ fullName: '', email: '' });
    setFile(null);
    setSelectedJobId('');
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.email || !selectedJobId || !file)
      return alert('Please fill in all fields and select a CV file.');

    const formData = new FormData();
    formData.append('fullName',          form.fullName);
    formData.append('email',             form.email);
    formData.append('jobDescriptionId',  selectedJobId);
    formData.append('cvFile',            file);

    setLoading(true);
    try {
      await candidateApi.upload(formData);
      setSubmitted(true);
    } catch {
      alert('Error submitting application.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return <SuccessScreen name={form.fullName} onReset={handleReset} />;

  const inputStyle = {
    width:       '100%',
    padding:     '11px 14px',
    borderRadius: radius.md,
    border:      `1.5px solid ${colors.border}`,
    fontSize:    15,
    outline:     'none',
    boxSizing:   'border-box' as const,
    fontFamily:  'Inter, sans-serif',
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: colors.text.primary, marginBottom: 8 }}>
          Apply for a Position
        </h1>
        <p style={{ color: colors.text.muted, fontSize: 15 }}>
          Upload your CV and let our AI match you with the perfect role
        </p>
      </div>

      <Card padding={spacing.xl}>
        {/* Position */}
        <div style={{ marginBottom: spacing.lg }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14, color: colors.text.secondary }}>
            Position *
          </label>
          <select
            value={selectedJobId}
            onChange={e => setSelectedJobId(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
            onFocus={e => e.target.style.borderColor = colors.primary}
            onBlur={e  => e.target.style.borderColor = colors.border}
          >
            <option value="">-- Select a position --</option>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
        </div>

        {selectedJob && <JobPreview job={selectedJob} />}

        {/* Name + Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.lg }}>
          {([
            { label: 'Full Name', key: 'fullName', placeholder: 'Nguyen Van A',    type: 'text'  },
            { label: 'Email',     key: 'email',    placeholder: 'your@email.com',  type: 'email' },
          ] as const).map(({ label, key, placeholder, type }) => (
            <div key={key}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14, color: colors.text.secondary }}>
                {label} *
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={set(key)}
                placeholder={placeholder}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = colors.primary}
                onBlur={e  => e.target.style.borderColor = colors.border}
              />
            </div>
          ))}
        </div>

        {/* File Upload */}
        <div style={{ marginBottom: spacing.xl }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14, color: colors.text.secondary }}>
            CV / Resume * <span style={{ fontWeight: 400, color: colors.text.muted }}>(PDF, DOCX, TXT)</span>
          </label>
          <label htmlFor="cv-upload" style={{ cursor: 'pointer', display: 'block' }}>
            <div style={{
              border:       `2px dashed ${file ? colors.primary : colors.border}`,
              borderRadius: radius.lg,
              padding:      spacing.xl,
              textAlign:    'center',
              background:   file ? '#f0f0ff' : colors.bg.muted,
              transition:   'all 0.2s',
            }}>
              {file ? (
                <>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                  <p style={{ color: colors.primary, fontWeight: 600, marginBottom: 4 }}>{file.name}</p>
                  <p style={{ color: colors.text.muted, fontSize: 12 }}>Click to change file</p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📄</div>
                  <p style={{ color: colors.text.secondary, fontWeight: 500, marginBottom: 4 }}>
                    Click to upload your CV
                  </p>
                  <p style={{ color: colors.text.muted, fontSize: 12 }}>PDF, DOCX, TXT • Max 10MB</p>
                </>
              )}
            </div>
          </label>
          <input
            type="file"
            id="cv-upload"
            accept=".pdf,.docx,.txt"
            onChange={e => setFile(e.target.files?.[0] || null)}
            style={{ display: 'none' }}
          />
        </div>

        <Button fullWidth size="lg" disabled={loading || !selectedJobId} onClick={handleSubmit}>
          {loading ? '⏳ Submitting your application...' : '🚀 Submit Application'}
        </Button>
      </Card>
    </div>
  );
}