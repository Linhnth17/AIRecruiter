import { useState } from 'react';
import { candidateApi } from '../api/client';

interface Props {
  jobDescriptionId: string;
  onSuccess: () => void;
}

export default function UploadCV({ jobDescriptionId, onSuccess }: Props) {
  const [form, setForm] = useState({ fullName: '', email: '' });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.fullName || !form.email || !file)
      return alert('Please fill in all fields and select a CV file');

    const formData = new FormData();
    formData.append('fullName', form.fullName);
    formData.append('email', form.email);
    formData.append('jobDescriptionId', jobDescriptionId);
    formData.append('cvFile', file);

    setLoading(true);
    try {
      await candidateApi.upload(formData);
      alert('CV uploaded! AI is analyzing...');
      onSuccess();
    } catch {
      alert('Error uploading CV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#eafaf1', borderRadius: 8, padding: 20, marginBottom: 24, border: '1px solid #a9dfbf' }}>
      <h3 style={{ margin: '0 0 16px' }}>Upload CV</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Full Name</label>
          <input value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
            style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Email</label>
          <input value={form.email} type="email"
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', boxSizing: 'border-box' }}
          />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>CV File (PDF, DOCX)</label>
        <input type="file" accept=".pdf,.docx,.txt"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />
      </div>
      <button onClick={handleSubmit} disabled={loading}
        style={{
          background: '#27ae60', color: '#fff', border: 'none',
          padding: '8px 20px', borderRadius: 6, cursor: 'pointer',
          opacity: loading ? 0.7 : 1
        }}>
        {loading ? 'Uploading...' : 'Upload & Analyze'}
      </button>
    </div>
  );
}