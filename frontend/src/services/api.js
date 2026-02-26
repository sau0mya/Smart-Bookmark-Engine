import axios from 'axios';

const getBaseURL = () => {
    // In our unified deployment, if we are on the same domain, we can use relative path /api
    const url = import.meta.env.VITE_API_URL || '';
    if (!url || url === '/api') return '/api';

    // If a full URL is provided (external backend), clean trailing slash
    return url.replace(/\/$/, '') + '/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to handle auth token and ensure pathing remains simple
api.interceptors.request.use(
    (config) => {
        // Interceptor strips leading slashes if they exist in component calls (e.g., api.get('/auth'))
        // to prevent baseURL resolution issues in some environments.
        if (config.url && config.url.startsWith('/')) {
            config.url = config.url.substring(1);
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
