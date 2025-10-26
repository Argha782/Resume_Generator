import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})

// Attach token automatically to every request
api.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    // ✅ send token as raw string (not Bearer)
    req.headers.Authorization = token;
  }
  return req;
});


export default api