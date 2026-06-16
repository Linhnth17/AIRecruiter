import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
});

export interface JobDescription {
  id: string;
  title: string;
  content: string;
  requiredSkills: string;
  yearsOfExperience: number;
  createdAt: string;
}

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  matchScore: number;
  matchSummary: string;
  strengths: string;
  weaknesses: string;
  redFlags: string;
  suggestedQuestions: string;
  status: string;
  createdAt: string;
}

export const jobDescriptionApi = {
  getAll: () => api.get<JobDescription[]>('/jobdescriptions'),
  getById: (id: string) => api.get<JobDescription>(`/jobdescriptions/${id}`),
  create: (data: Omit<JobDescription, 'id' | 'createdAt'>) =>
    api.post<JobDescription>('/jobdescriptions', data),
};

export const candidateApi = {
  getByJob: (jobId: string) =>
    api.get<Candidate[]>(`/candidates/job/${jobId}`),
  getById: (id: string) => api.get<Candidate>(`/candidates/${id}`),
  upload: (formData: FormData) =>
    api.post<{ candidate: Candidate }>('/candidates/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateStatus: (id: string, status: string) =>
    api.patch(`/candidates/${id}/status`, { status }),
};

export default api;