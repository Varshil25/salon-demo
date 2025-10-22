// api.js
import axios from "axios";
import { APIClient } from "./api_helper";
import * as url from "./url_helper";

const api = new APIClient();

// Salon
export const Insalonappointment = (query:any) => api.get(url.Insalonappointment+`?${query} `);


// Fetch the list of all appointments
export const generatereport = async (startDate: any, endDate: any): Promise<any> => {
    try {
        const response = await axios.get(`${url.Generatereport}?startDate=` + startDate + `&endDate=` + endDate);
        console.log("Fetched report:", response);
        return response;
    } catch (error) {
        console.error("Error fetching report:", error);
        throw error;
    }
};

// Generate Report
// export const Generatereport =  (selectedStartDate:any , selectedEndDate:any ) => api.get(`${url.Generatereport}?startDate=${selectedStartDate.toISOString()}&endDate=${selectedEndDate.toISOString()}`);




