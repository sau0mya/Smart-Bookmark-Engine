import axios from 'axios';

const getBaseURL = () => {
    const url = import.meta.env.VITE_API_URL || '';
    if (!url || url === '/api') return '/api';
    return url.endsWith('/api') ? url : `${url}/api`;
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
