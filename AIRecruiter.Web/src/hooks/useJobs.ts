import { useState, useEffect } from 'react';
import type { JobDescription } from '../api/client';
import { jobDescriptionApi } from '../api/client';

export function useJobs() {
  const [jobs, setJobs]       = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobDescriptionApi.getAll();
      setJobs(res.data);
    } catch {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  return { jobs, loading, error, refetch: fetchJobs };
}