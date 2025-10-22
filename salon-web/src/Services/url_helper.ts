//REGISTER
export const POST_FAKE_REGISTER = "/auth/register-user";

//LOGIN
export const POST_FAKE_LOGIN = "/auth/login-user";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
// Send Mail
export const POST_FAKE_PASSWORD_FORGET = "/users/send-reset-email";
// Reset password
export const POST_RESET_PASSWORD = "/users/reset-password";

export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/auth/google-login";
// export const GOOGLE_LOGIN = "/google-login";

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile";

// Edit Profile
export const POST_EDIT_PROFILE = "/users";

// User Info
export const POST_USER_PROFILE = "/auth/userinfo";
// User Info
// export const POST_UPDATE_PROFILE = "/users";

//Blogs
export const BLOG = "/blogs";

// Salon
export const SALON = "/salon";

//CONTACTUS
export const CONTACTUS = "/contact-us";

//POST_APPOINTMENT
export const POST_APPOINTMENT = "/appointments";  

//FavoriteSalons_POST
export const POST_FAVORITE_SALON = "/favorites";

// Cancel Appointment
export const POST_CANCEL_APPOINTMENT = "/appointments/cancel";
// Appointment User(actice or not)
export const APPOINTMENT_USER = "/appointments/user/";

//Appointment Waitlist 
export const APPOINTMENT_WAITLIST  = "/appointments/status/";

//Get Services
export const GET_SERVICES  = "/services";

//Get User By Id
export const GET_PAST_APPOINTMENTS  = "appointments/user";

// Get Barber basen on selected salon
export const GET_BARBER  = "/barber-sessions";


//Get All Barbers 
export const GET_All_BARBER  = "/barber";

// 
export const CREATE_BARBER_SESSION = "/barber-sessions/barber"

// calander and slot method
export const GET_SLOT = "/slots/available"

// create appointmnet for customers 
// export const Create_Slot_Appointment = "/appointments"

// Get appointments filtered by id and category and date 
export const CATEGOYWISE_USER = "/appointments/categorywise/user"






