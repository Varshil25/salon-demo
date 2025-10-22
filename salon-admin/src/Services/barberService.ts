import axios from 'axios';
import { Barber } from './type';
import { APIClient } from './api_helper';
import { AxiosResponse } from 'axios';

const BARBER_ENDPOINT = 'barber';

const apiClient = new APIClient();
// Fetch the list of all barbers
export const fetchBarber = async (

    page: number,
    limit: any,
    search: any
  ): Promise<any> => {
    
    try {
      const response = await apiClient.get(`${BARBER_ENDPOINT}/admin`, {
        params: { page, limit, search },
      });
  
      // Return the entire Axios response object
      return response;
    } catch (error) {
      console.error("Error fetching barbers:", error);
      throw error;
    }
  };

// Add a new barber to the database (with FormData to handle file uploads)
export const addBarber = async (barberData: FormData): Promise<any> => {
    try {
        const response = await axios.post(BARBER_ENDPOINT, barberData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error("Error adding barber:", error);
        throw error;
    }
};
export const updateBarberStatus = async (userId: number, status: { status: string }): Promise<any> => {
  
    
    try {
      const response = await axios.patch(
        `${BARBER_ENDPOINT}/user/${userId}/availability-status`,
        status
      );
      return response; // Return the updated barber data
    } catch (error) {
      console.error("Error updating barber status:", error);
      throw error;
    }
  };

// Update an existing barber's data (with FormData to handle file uploads)
export const updateBarber = async (id: number, barberData: FormData): Promise<any> => {
    try {
        const response = await axios.put(`${BARBER_ENDPOINT}/${id}`, barberData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error("Error updating barber:", error);
        throw error;
    }
};

// Delete a barber by their ID
export const deleteBarber = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${BARBER_ENDPOINT}/${id}`);
    } catch (error) {
        console.error("Error deleting barber:", error);
        throw error;
    }
};
