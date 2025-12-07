import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './ApiEndPoints';

const CartApi = {
    addCartItem: async (customerId, itemId) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}${API_ENDPOINTS.CART_ADD_ITEM}`,
                { customerId, itemId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding cart item:', error);
            throw error;
        }
    },

    getCartItemsByCustomer: async (customerId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}${API_ENDPOINTS.CART_CUSTOMER_ITEM(customerId)}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching cart items:', error);
            throw error;
        }
    },

    removeCartItem: async (customerId, itemId) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}${API_ENDPOINTS.CART_REMOVE_ITEM}`,
                { customerId, itemId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error removing cart item:', error);
            throw error;
        }
    },
};

export default CartApi;
