//Include Both Helper File with needed methods
import {
  postLogin,
  postJwtLogin,
  postSocialLogin,
} from "../../../Services/AuthService";

import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from './reducer';

export const loginUser = (user : any, history : any) => async (dispatch : any) => {
  
  try {
    
    let response;
     if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      response = postJwtLogin({
        email: user.email,
        password: user.password
      });

    } else if (process.env.REACT_APP_DEFAULTAUTH) {
      response = postLogin({
        email: user.email,
        password: user.password,
      });
    }

    var data = await response;
    
    if (data) {
      localStorage.setItem("authUser", JSON.stringify(data));
      var finallogin : any = JSON.stringify(data);
      finallogin = JSON.parse(finallogin)
      data = finallogin.data.user;
      if (finallogin.success) {
        
        dispatch(loginSuccess(finallogin));
        history(finallogin);
      } 
      else {
        dispatch(apiError(finallogin));
      }
    }
  } catch (error) {
    history({success:false});
    dispatch(apiError(error));
  }
};

// export const logoutUser = () => async (dispatch : any) => {
//   try {
//     localStorage.removeItem("token");
//     localStorage.removeItem("authUser");
//     localStorage.removeItem("user");
//      dispatch(logoutUserSuccess(true));
//   } catch (error) {
//     dispatch(apiError(error));
//   }
// };


export const logoutUser = () => async (dispatch: any) => {
  try {
    // Clear user-related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    localStorage.removeItem("user");
    localStorage.removeItem("appointmentId"); // Clear if no appointmen
    // Trigger a custom event to notify other tabs about the logout
    // localStorage.setItem('logout', Date.now().toString());

    // Dispatch logout success action to update Redux state
    dispatch(logoutUserSuccess(true));

    // Redirect the user to the home page
    window.location.href = '/'; // Redirect to the home page

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin = (token : any, history : any) => async (dispatch : any) => {
  try { 
   
    let response;
        response = postSocialLogin({
        token: token,
      });
      
      var data = await response;
    
      if (data) {
        localStorage.setItem("authUser", JSON.stringify(data));
        var finallogin : any = JSON.stringify(data);
        finallogin = JSON.parse(finallogin)
        data = finallogin.data.user;
        if (finallogin.success) {
          
          dispatch(loginSuccess(finallogin));
          history(finallogin);
        } 
        else {
          dispatch(apiError(finallogin));
        }
      }

  } catch (error) {
   
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch : any) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};