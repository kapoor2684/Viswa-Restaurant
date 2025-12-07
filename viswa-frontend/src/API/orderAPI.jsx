import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "./ApiEndPoints";

const orderAPI = {
    // ➤ CREATE ORDER
    createOrder: async (orderData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}${API_ENDPOINTS.ORDERS}`,
                orderData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    },

    // ➤ GET ALL ORDERS
    getAllOrders: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}${API_ENDPOINTS.ORDERS}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    },

    // ➤ GET ORDER BY ID
    getOrderById: async (orderId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}${API_ENDPOINTS.ORDERS}/${orderId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching order:", error);
            throw error;
        }
    },

    // ➤ UPDATE ORDER
    updateOrder: async (orderId, orderData) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}${API_ENDPOINTS.ORDERS}/${orderId}`,
                orderData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating order:", error);
            throw error;
        }
    },

    // ➤ DELETE ORDER
    deleteOrder: async (orderId) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}${API_ENDPOINTS.ORDERS}/${orderId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error deleting order:", error);
            throw error;
        }
    },
};

export default orderAPI;
