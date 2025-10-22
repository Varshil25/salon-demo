import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// Authentication
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import ProfileReducer from "./auth/profile/reducer";

// API Key
import APIKeyReducer from "./apiKey/reducer";
import { selectedSalonReducer, selectedServiceReducer } from "./dashboardProject/selectedSalonSlice";



const rootReducer = combineReducers({
    Layout: LayoutReducer,
    Login: LoginReducer,
    Account: AccountReducer,
    ForgetPassword: ForgetPasswordReducer,
    Profile: ProfileReducer,
    selectedSalon: selectedSalonReducer,
    selectedService: selectedServiceReducer,
});

export default rootReducer;