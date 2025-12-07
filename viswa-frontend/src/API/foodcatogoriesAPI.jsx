import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './ApiEndPoints';

const foodcategoriesAPI = {
    addFoodCategory: async (foodCategoryData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.ADD_FOOD_CATEGORY}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(foodCategoryData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding food category:', error);
            throw error;
        }
    },

    getAllFoodCategories: async () => {
        try {
            console.log(`${API_BASE_URL}${API_ENDPOINTS.GET_FOOD_CATEGORIES}`);
            const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.GET_FOOD_CATEGORIES}`);
            console.log("Response from getAllFoodCategories:", response);
            return response.data;
        } catch (error) {
            console.error('Error fetching food categories:', error);
            throw error;
        }
    },

};

export default foodcategoriesAPI;