import { APIClient } from "./api_helper"; 

import * as url from "./url_helper";

const api = new APIClient();

// APPOINTMENT-POST
export const CeateAppointment = (data:any) => api.create(url.POST_APPOINTMENT,data);

// APPOINTMENT-GET
export const GetAppointmentById = (id:any) => api.get(url.POST_APPOINTMENT + '/' + id);
// APPOINTMENT-USER
export const UserAppointment = (data: any) => api.get(url.APPOINTMENT_USER + data );


// APPOINTMENT_WAITLIST-GET
export const AppointmentWaitlist = (data:any) => api.get(url.APPOINTMENT_WAITLIST+data);


//Past Appointment 
export const  Getpastappointmnet = (id:any) => api.get(url.GET_PAST_APPOINTMENTS + '/' + id);

//Post Appointment 
// export const CreateSlotAppointment = (data:any) => api.create(url.Create_Slot_Appointment, data);



