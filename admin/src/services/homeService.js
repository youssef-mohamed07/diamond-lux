import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const homeService = {
    async getHomeData() {
        try {
            const response = await axios.get(`${API_URL}/home`);            
            return response.data;
        } catch (error) {
            console.error('Error fetching home data:', error);
            throw error;
        }
    },

    async createHomeData(formData) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/home`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating home data:', error);
            throw error;
        }
    },

    async updateHomeData(id, formData) {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            
            const response = await axios.patch(`${API_URL}/home/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // Add the token to headers
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating home data:', error);
            throw error;
        }
    }
}; 