import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './ApiEndPoints';

const CustomerApi = {
    getAllCustomers: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.GET_ALL_CUSTOMERS}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    },

    getCustomerById: async (customerId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/customers/${customerId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching customer with ID ${customerId}:`, error);
            throw error;
        }
    },

    updateCustomerInfo: async (customerId, customerData) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}${API_ENDPOINTS.UPDATE_CUSTOMER(customerId)}`,
                customerData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error(`Error updating customer with ID ${customerId}:`, error);
            throw error;
        }
    },

    customerAllAddresses: async (customerId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}${API_ENDPOINTS.GET_ALL_CUSTOMER_ADDRESSES(customerId)}`
            );
            return response.data;
        } catch (error) {
            console.error(`Error fetching addresses for customer with ID ${customerId}:`, error);
            throw error;
        }
    },
    getCartItems: async (customerId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}${API_ENDPOINTS.GET_CUSTOMER_CART_ITEMS(customerId)}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        }
        catch (error) {
            console.error('Error fetching cart items:', error);
            throw error;
        }
    },

}
export default CustomerApi;