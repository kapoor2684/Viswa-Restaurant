import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './ApiEndPoints';

const ReservationApi = {
    reserveTable: async (reservationData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}${API_ENDPOINTS.RESERVE_TABLE}`,
                reservationData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error during table reservation:', error);
            throw error;
        }
    },

    allBookedTables: async (date) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/reservetable/booking?date=${date}`,
                {
                    headers: {  
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        }
        catch (error) {
            console.error('Error fetching booked tables:', error);
            throw error;
        }
    },

    reservePartyHall: async (reservationData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}${API_ENDPOINTS.RESERVE_PARTY_HALL}`,
                reservationData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error during party hall reservation:', error);
            throw error;
        }
    }
};

export default ReservationApi;