import { useState, useEffect, useCallback } from 'react';
import type { Candidate } from '../api/client';
import { candidateApi } from '../api/client';

export function useCandidates(jobId: string) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading]       = useState(false);

  const fetchCandidates = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const res = await candidateApi.getByJob(jobId);
      setCandidates(res.data);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  // Auto-refresh khi có candidate đang AI processing
  useEffect(() => {
    const hasProcessing = candidates.some(c => c.matchScore === 0);
    if (!hasProcessing) return;
    const timer = setInterval(fetchCandidates, 10000);
    return () => clearInterval(timer);
  }, [candidates, fetchCandidates]);

  const updateStatus = async (id: string, status: string) => {
    await candidateApi.updateStatus(id, status);
    await fetchCandidates();
  };

  return { candidates, loading, refetch: fetchCandidates, updateStatus };
}