import api from '../api/axios';

export const authService = {
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        return response.data;
    },

    async register(userData) {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    async getMe() {
        const response = await api.get('/auth/me');
        return response.data;
    },

    logout() {
        localStorage.clear();
    },

    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    },
};
