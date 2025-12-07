import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './ApiEndPoints';

const AddressesApi = {

    addAddress: (addressData) => {  

        try{
            const response = axios.post(
                `${API_BASE_URL}${API_ENDPOINTS.Add_Address}`,
                addressData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        }
        catch (error) {
            console.error('Error adding address:', error);
            throw error;
        }
    },

    updateAddress: (addressId, addressData) => {  
        try{
            const response = axios.put(
                `${API_BASE_URL}/addresses/${addressId}`,
                addressData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }

            );
            return response.data;
        }   
        catch (error) {
            console.error('Error updating address:', error);
            throw error;
        }
    },

    deleteAddress: async (addressId) => {  
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/addresses/${addressId}`
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting address:', error);
            throw error;
        }
    },




}
export default AddressesApi;