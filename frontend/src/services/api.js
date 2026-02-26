import axios from 'axios';

const getBaseURL = () => {
    let url = import.meta.env.VITE_API_URL || '';
    if (!url || url === '/api') return ''; // Use relative path in local dev

    // Clean trailing slash
    return url.replace(/\/$/, '');
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to handle path resolution and auth token
api.interceptors.request.use(
    (config) => {
        // Ensure all local paths are prefixed with /api
        if (config.url && !config.url.startsWith('http')) {
            let path = config.url;
            if (!path.startsWith('/api')) {
                path = path.startsWith('/') ? `/api${path}` : `/api/${path}`;
            }
            config.url = path;
        }

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
