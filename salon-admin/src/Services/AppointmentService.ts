import axios from 'axios';

const APPOINTMENT_ENDPOINT = 'appointments';

// Fetch the list of all appointments
export const fetchAppointments = async (page: any, limit: any, startDate: any, endDate: any, status: any, search: any): Promise<any> => {
    try {
        const statusInfo = status === 'All' ? '' : status;
        const response = await axios.get(`${APPOINTMENT_ENDPOINT}?page=` + page + `&limit=` + limit + `&startDate=` + startDate + `&endDate=` + endDate + `&status=` + statusInfo + `&search=` + search ?? '');
        console.log("Fetched appointments:", response);
        return response;
    } catch (error) {
        console.error("Error fetching appointments:", error);
        throw error;
    }
};

// Fetch the list of all appointments
export const fetchBoardAppointments = async (page: any, limit: any) => {
    try {
        const response = await axios.get(`${APPOINTMENT_ENDPOINT}/board/findAll?page=` + page + `&limit=` + limit);
        console.log("Fetched appointments:", response);
        return response;
    } catch (error) {
        console.error("Error fetching appointments:", error);
        throw error;
    }
};

// Update an existing role's data
export const updateAppointmentStatus = async (id: number, statusData: any): Promise<void> => {
    try {
        await axios.put(`${APPOINTMENT_ENDPOINT}/status/${id}`, statusData);
    } catch (error) {
        console.error("Error updating status:", error);
        throw error;
    }
};

// Update an existing role's data
export const updateAppointmentWaitTime = async (id: number, additionalTime: any): Promise<void> => {
    try {
        await axios.put(`${APPOINTMENT_ENDPOINT}/extend-wait-time/${id}`, additionalTime);
    } catch (error) {
        console.error("Error updating wating time:", error);
        throw error;
    }
};

export const createAppointment = async (appointmentData: any): Promise<any> => {

    try {
        const response = await axios.post(`${APPOINTMENT_ENDPOINT}/barber/create`, appointmentData);
        console.log("Created appointment:", response);
        return response;
    } catch (error) {
        console.error("Error creating appointment:", error);
        throw error;
    }
};
export const deleteAppointment = async (appointmentData: any): Promise<any> => {

    try {
        const response = await axios.put(APPOINTMENT_ENDPOINT, appointmentData);
        console.log("Deleted appointment:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting appointment:", error);
        throw error;
    }
};

