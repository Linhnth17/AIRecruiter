import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
});

// Tự động thêm token vào mọi request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Tự redirect về login khi token hết hạn
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface JobDescription {
  id:                string;
  title:             string;
  content:           string;
  requiredSkills:    string;
  yearsOfExperience: number;
  createdAt:         string;
}

export interface Candidate {
  id:                 string;
  fullName:           string;
  email:              string;
  matchScore:         number;
  matchSummary:       string;
  strengths:          string;
  weaknesses:         string;
  redFlags:           string;
  suggestedQuestions: string;
  status:             string;
  createdAt:          string;
  jobDescriptionId:   string;
}

export interface User {
  token:     string;
  fullName:  string;
  email:     string;
  role:      string;
  expiresAt: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<User>('/auth/login', { email, password }),
};

export const jobDescriptionApi = {
  getAll:   ()           => api.get<JobDescription[]>('/jobdescriptions'),
  getById:  (id: string) => api.get<JobDescription>(`/jobdescriptions/${id}`),
  create:   (data: Omit<JobDescription, 'id' | 'createdAt'>) =>
    api.post<JobDescription>('/jobdescriptions', data),
};

export const candidateApi = {
  getByJob:     (jobId: string) => api.get<Candidate[]>(`/candidates/job/${jobId}`),
  getById:      (id: string)    => api.get<Candidate>(`/candidates/${id}`),
  bulkUpload:   (formData: FormData) =>
    api.post('/candidates/bulk-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateStatus: (id: string, status: string) =>
    api.patch(`/candidates/${id}/status`, { status }),
};

export default api;