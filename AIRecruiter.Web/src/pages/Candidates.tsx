import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Candidate, JobDescription } from '../api/client';
import { candidateApi, jobDescriptionApi } from '../api/client';
import UploadCV from '../components/UploadCV';
import CandidateCard from '../components/CandidateCard';

export default function Candidates() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobDescription | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const load = async () => {
    if (!id) return;
    const [jobRes, candRes] = await Promise.all([
      jobDescriptionApi.getById(id),
      candidateApi.getByJob(id),
    ]);
    setJob(jobRes.data);
    setCandidates(candRes.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ background: '#fff', borderRadius: 8, padding: 20, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h2 style={{ margin: '0 0 8px' }}>{job?.title}</h2>
        <p style={{ color: '#666', margin: '0 0 12px' }}>{job?.content}</p>
        <button onClick={() => setShowUpload(!showUpload)}
          style={{
            background: '#27ae60', color: '#fff', border: 'none',
            padding: '8px 20px', borderRadius: 6, cursor: 'pointer'
          }}>
          {showUpload ? 'Cancel' : '+ Upload CV'}
        </button>
      </div>

      {showUpload && id && (
        <UploadCV jobDescriptionId={id} onSuccess={() => { setShowUpload(false); load(); }} />
      )}

      <h3 style={{ marginBottom: 16 }}>Candidates ({candidates.length})</h3>

      {candidates.length === 0 && (
        <p style={{ color: '#888' }}>No candidates yet. Upload a CV to get started.</p>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        {candidates.map(c => (
          <CandidateCard key={c.id} candidate={c} onStatusChange={load} />
        ))}
      </div>
    </div>
  );
}