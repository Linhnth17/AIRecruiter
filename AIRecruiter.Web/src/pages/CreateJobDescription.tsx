import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobDescriptionApi } from '../api/client';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { colors, spacing, radius } from '../styles/tokens';
import { parseSkills } from '../utils/format';
import { ArrowLeft, Loader2, Rocket } from 'lucide-react';

const EXPERIENCE_OPTIONS = [0, 1, 2, 3, 5, 7, 10];

interface FormState {
  title:             string;
  content:           string;
  requiredSkills:    string;
  yearsOfExperience: number;
}

const INITIAL_FORM: FormState = {
  title: '', content: '', requiredSkills: '', yearsOfExperience: 1,
};

const inputBaseStyle = {
  width:        '100%',
  padding:      '11px 14px',
  borderRadius: radius.md,
  border:       `1.5px solid ${colors.border}`,
  fontSize:     15,
  outline:      'none',
  boxSizing:    'border-box' as const,
  fontFamily:   'Inter, sans-serif',
  transition:   'border-color 0.2s',
};

function InputField({ label, value, onChange, placeholder, type = 'text' }: {
  label:        string;
  value:        string;
  onChange:     (v: string) => void;
  placeholder?: string;
  type?:        string;
}) {
  return (
    <div style={{ marginBottom: spacing.lg }}>
      <label style={{
        display:    'block',
        marginBottom: 6,
        fontWeight: 600,
        fontSize:   14,
        color:      colors.text.secondary,
      }}>
        {label} *
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputBaseStyle}
        onFocus={e => e.target.style.borderColor = colors.primary}
        onBlur={e  => e.target.style.borderColor = colors.border}
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 5 }: {
  label:        string;
  value:        string;
  onChange:     (v: string) => void;
  placeholder?: string;
  rows?:        number;
}) {
  return (
    <div style={{ marginBottom: spacing.lg }}>
      <label style={{
        display:    'block',
        marginBottom: 6,
        fontWeight: 600,
        fontSize:   14,
        color:      colors.text.secondary,
      }}>
        {label} *
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...inputBaseStyle, resize: 'vertical' }}
        onFocus={e => e.target.style.borderColor = colors.primary}
        onBlur={e  => e.target.style.borderColor = colors.border}
      />
    </div>
  );
}

function ExperienceSelector({ value, onChange }: {
  value:    number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: spacing.xl }}>
      <label style={{
        display:    'block',
        marginBottom: 8,
        fontWeight: 600,
        fontSize:   14,
        color:      colors.text.secondary,
      }}>
        Years of Experience *
      </label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {EXPERIENCE_OPTIONS.map(y => {
          const isSelected = value === y;
          return (
            <button
              key={y}
              onClick={() => onChange(y)}
              style={{
                padding:      '8px 16px',
                borderRadius: radius.sm,
                border:       `2px solid ${isSelected ? colors.primary : colors.border}`,
                background:   isSelected ? '#f0f0ff' : '#fff',
                color:        isSelected ? colors.primary : colors.text.muted,
                cursor:       'pointer',
                fontWeight:   isSelected ? 600 : 400,
                fontSize:     14,
                fontFamily:   'Inter, sans-serif',
                transition:   'all 0.15s',
              }}
            >
              {y}+
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SkillsField({ value, onChange }: {
  value:    string;
  onChange: (v: string) => void;
}) {
  const skills = parseSkills(value);

  return (
    <div style={{ marginBottom: spacing.lg }}>
      <label style={{
        display:    'block',
        marginBottom: 6,
        fontWeight: 600,
        fontSize:   14,
        color:      colors.text.secondary,
      }}>
        Required Skills *{' '}
        <span style={{ fontWeight: 400, color: colors.text.muted }}>(comma separated)</span>
      </label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="e.g. C#, ASP.NET Core, PostgreSQL, Docker"
        style={inputBaseStyle}
        onFocus={e => e.target.style.borderColor = colors.primary}
        onBlur={e  => e.target.style.borderColor = colors.border}
      />
      {skills.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
          {skills.map(s => <Badge key={s} label={s} variant="primary" />)}
        </div>
      )}
    </div>
  );
}

export default function CreateJobDescription() {
  const navigate              = useNavigate();
  const [form, setForm]       = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const setField = (key: keyof FormState) => (value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.title || !form.content || !form.requiredSkills)
      return alert('Please fill in all required fields');

    setLoading(true);
    try {
      await jobDescriptionApi.create(form);
      navigate('/');
    } catch {
      alert('Error creating job description');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: spacing.lg }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft size={14} />
          Back to Jobs
        </Button>
        <h1 style={{
          fontSize:   26,
          fontWeight: 700,
          color:      colors.text.primary,
          marginTop:  12,
          marginBottom: 4,
        }}>
          Create Job Description
        </h1>
        <p style={{ color: colors.text.muted, fontSize: 14 }}>
          Fill in the details to start receiving AI-analyzed applications
        </p>
      </div>

      <Card padding={spacing.xl}>
        <InputField
          label="Job Title"
          value={form.title}
          onChange={setField('title')}
          placeholder="e.g. Senior .NET Developer"
        />

        <TextAreaField
          label="Job Description"
          value={form.content}
          onChange={setField('content')}
          placeholder="Describe the role, responsibilities, and what you're looking for..."
        />

        <SkillsField
          value={form.requiredSkills}
          onChange={setField('requiredSkills')}
        />

        <ExperienceSelector
          value={form.yearsOfExperience}
          onChange={setField('yearsOfExperience')}
        />

        <Button fullWidth disabled={loading} onClick={handleSubmit} size="lg">
          {loading
            ? <><Loader2 size={16} /> Creating...</>
            : <><Rocket size={16} /> Create Job Description</>
          }
        </Button>
      </Card>
    </div>
  );
}