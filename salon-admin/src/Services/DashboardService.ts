import { APIClient } from './api_helper';

const apiClient = new APIClient();
const DASHBOARD_ENDPOINT = 'dashboard';

// Fetch the list of all salons
export const fetchDashboardData = async (): Promise<any> => {
  try {
    const response = await apiClient.get(DASHBOARD_ENDPOINT);
    return response; // Access the 'data' property
  } catch (error) {
    console.error("Error fetching dashboard dat:", error);
    throw error; // Rethrow to let the calling function handle it
  }
};

// Fetch the list of all salons
export const fetchAppointmentDashboardData = async (): Promise<any> => {
  try {
    const response = await apiClient.get(`${DASHBOARD_ENDPOINT}/appointment-dashboard`);
    return response; // Access the 'data' property
  } catch (error) {
    console.error("Error fetching dashboard dat:", error);
    throw error; // Rethrow to let the calling function handle it
  }
};

