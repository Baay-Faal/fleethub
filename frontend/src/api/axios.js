import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    // Demander un nouveau access token
                    const res = await axios.post('http://127.0.0.1:8000/api/v1/auth/refresh/', {
                        refresh: refreshToken
                    });
                    
                    // Mettre à jour le token
                    const newAccessToken = res.data.access;
                    localStorage.setItem('access_token', newAccessToken);
                    
                    // Refaire la requête originale avec le nouveau token
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Si le refresh token a aussi expiré
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        
        // Si ce n'est pas un problème de token (ou pas de refresh token dispo)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default api;
