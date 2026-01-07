import api from '../api/axios';

export const userService = {
    async getUsers(skip = 0, limit = 100) {
        const response = await api.get(`/users/?skip=${skip}&limit=${limit}`);
        return response.data;
    },

    async getUser(id) {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    async createUser(userData) {
        const response = await api.post('/users/', userData);
        return response.data;
    },

    async updateUser(id, userData) {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    async deleteUser(id) {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};
