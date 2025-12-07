import axios from "axios";
import { API_BASE_URL } from "./ApiEndPoints";

const WalletApi = {
    // ✔ GET WALLET BALANCE
    getWalletBalance: async (customerId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/customer/${customerId}/wallet`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching wallet balance:", error);
            throw error;
        }
    },

    // ✔ ADD MONEY (POST)
    addMoney: async (customerId, amount) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/customer/${customerId}/wallet/add`,
                null, // no body
                {
                    params: { amount },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error adding money:", error);
            throw error;
        }
    },

    // ✔ DEDUCT MONEY (POST)
    deductMoney: async (customerId, amount) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/customer/${customerId}/wallet/deduct`,
                null,
                {
                    params: { amount },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error deducting money:", error);
            throw error;
        }
    },

    // ✔ UPDATE WALLET DIRECTLY (PUT)
    updateWallet: async (customerId, amount) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/customer/${customerId}/wallet/update/`,
                null,
                {
                    params: { amount },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating wallet:", error);
            throw error;
        }
    },
};

export default WalletApi;
