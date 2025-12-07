import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './ApiEndPoints';

const AuthenticateApi = {
    loginByEmail: async (email, password) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}${API_ENDPOINTS.LOGIN_BY_EMAIL}`,
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },

    registerByEmail: async (userData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}${API_ENDPOINTS.REGISTER_BY_EMAIL}`,
                userData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    }
};

export default AuthenticateApi;
