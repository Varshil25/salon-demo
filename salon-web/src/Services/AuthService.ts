import { APIClient } from "./api_helper";

import * as url from "./url_helper";

const api = new APIClient();

// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

// //is user is logged in
export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Register Method
export const postRegister = (data : any) => api.create(url.POST_FAKE_REGISTER, data);

// Login Method
export const postLogin = (data : any) => api.create(url.POST_FAKE_LOGIN, data);

// send email for forgot password
export const postForgetPwd = (data : any) => api.create(url.POST_FAKE_PASSWORD_FORGET, data);
// reset - password
export const postSetPassword = (data : any) => api.create(url.POST_RESET_PASSWORD, data);


// Edit profile
export const postJwtProfile = (data : any) => api.create(url.POST_EDIT_JWT_PROFILE, data);

// View Profile
export const postProfile = (id:any,data : FormData) => api.put(url.POST_EDIT_PROFILE + '/' + id, data);

// get Profile
export const getProfile = () => api.get(url.POST_USER_PROFILE);
// get Profile
export const putCanselAppointment = (data : any) => api.put(url.POST_CANCEL_APPOINTMENT + '/' + data,null);

export const Cancelappointmentbyyid = (id: any) => api.put(url.POST_CANCEL_APPOINTMENT + '/' + id,null);

// Register Method
export const postJwtRegister = (url : string, data  :any) => {
  return api.create(url, data)
    .catch(err => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message = "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
export const postJwtLogin = (data : any) => api.create(url.POST_FAKE_JWT_LOGIN, data);

// postForgetPwd
export const postJwtForgetPwd = (data : any) => api.create(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

// postSocialLogin
export const postSocialLogin = (data : any) => api.create(url.SOCIAL_LOGIN, data);
