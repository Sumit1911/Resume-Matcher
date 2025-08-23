import axios from 'axios';

const API_BASE_URL = 'https://resume-matcher-1-ppcd.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000, // 60s for uploads/AI processing
});

// Request logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} → ${config.url}`);
    return config;
  },
  Promise.reject
);

// Response & error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err);

    if (err.code === 'ECONNABORTED') throw new Error('Request timeout.');
    if (!err.response) throw new Error('Network error. Check internet.');

    const { status, data } = err.response;
    const message =
      data?.error ||
      data?.message ||
      ({
        400: 'Invalid request',
        413: 'File too large',
        429: 'Too many requests',
        500: 'Server error',
      }[status] || `Unexpected error (${status})`);

    throw new Error(message);
  }
);

// Resume analysis API
export const analyzeResume = async ({ resumeFile, resumeText, jobDescription }) => {
  const formData = new FormData();
  formData.append('jobDescription', jobDescription || '');
  if (resumeFile) formData.append('resume', resumeFile);
  if (resumeText?.trim()) formData.append('resumeText', resumeText.trim());

  const { data } = await api.post('/api/resume/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 180000,
  });

  if (!data.success) throw new Error(data.error || 'Analysis failed');
  return data;
};

// Health check
export const testConnection = async () => {
  const { data } = await api.get('/health');
  return data;
};

export default api;
