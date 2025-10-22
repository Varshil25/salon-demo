// api.js
import { APIClient } from "./api_helper";
import * as url from "./url_helper";

const api = new APIClient();

// Salon
export const GetSalon = (query:any) => api.get(url.SALON+`?${query} `);

export const GetSalonId = (salon_id: any) => api.get(`${url.SALON}/${salon_id}`);

export const GetServices = (query:any) => api.get(url.GET_SERVICES+`?${query} `);

export const GetBarbers = (salonId: any, category: any, date: string) => 
    api.get(`${url.GET_BARBER}?SalonId=${salonId}&category=${category}&date=${date}`);


export const GetAllBarbers = (salonId: any, category: any) => 
    api.get(`${url.GET_All_BARBER}?salonId=${salonId}&category=${category}`);


// Define API method to create barber session
export const CreateBarberSession = (BarberId: any, data: any) => 
    api.create(`${url.CREATE_BARBER_SESSION}/${BarberId}`, data);


// calander and slot method
export const GetAvailableSlots = (BarberId: any, slot_date: any) => 
    api.get(`${url.GET_SLOT}?BarberId=${BarberId}&slot_date=${slot_date}`)

// Get appointments filtered by id and category and date
export const Getappointmentscategory = (category: any) => 
    api.get(`${url.CATEGOYWISE_USER}?category=${category}`)








  