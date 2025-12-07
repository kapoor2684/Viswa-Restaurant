import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './ApiEndPoints';

const foodItemAPI = {

    addFoodItem: async (foodItemData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.ADD_FOOD_ITEM}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(foodItemData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error adding food item:', error);
            throw error;
        }
    },


    getAllFoodItems: async () => {
        try {
            console.log(`${API_BASE_URL}${API_ENDPOINTS.GET_FOOD_ITEMS}`);
            const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.GET_FOOD_ITEMS}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching food items:', error);
            throw error;
        }
    },

    getFoodItemsByCategory: async (categoryId) => {
        try {
            console.log(`${API_BASE_URL}${API_ENDPOINTS.GET_FOOD_ITEMS_BY_CATEGORY(categoryId)}`);
            const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.GET_FOOD_ITEMS_BY_CATEGORY(categoryId)}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching food items by category:', error);
            throw error;
        }
    },

};
export default foodItemAPI;