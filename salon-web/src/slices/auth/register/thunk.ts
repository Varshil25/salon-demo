//Include Both Helper File with needed methods
import {
  postRegister,
  // postJwtRegister,
} from "../../../Services/AuthService";
import { loginSuccess } from "../login/reducer";

// action
import {
  registerUserSuccessful,
  registerUserFailed,
  resetRegisterFlagChange,
} from "./reducer";

// Is user register successfull then direct plot user in redux.
export const registerUser = (user: any, p0: (result: any) => void) => async (dispatch : any) => {
  try {
    let response;
      response = postRegister(user);
      const data : any = await response;
      if (data) {
        localStorage.setItem("token", data.data.token); // Save token in local storage
        localStorage.setItem("authUser", JSON.stringify(data));
          localStorage.setItem("user", JSON.stringify(data.data.user)); // Save user info in local storage
          dispatch(loginSuccess(data));
         dispatch(registerUserSuccessful(data));

        //history("/");
      } else {
        dispatch(registerUserFailed(data));
      }
  } catch (error : any) {
    dispatch(registerUserFailed(error));
  }
};

export const resetRegisterFlag = () => {
  try {
    const response = resetRegisterFlagChange();
    return response;
  } catch (error) {
    return error;
  }
};