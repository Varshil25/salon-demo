//Include Both Helper File with needed methods
import { postProfile, postJwtProfile } from "../../../Services/AuthService";

// action
import { profileSuccess, profileError, resetProfileFlagChange } from "./reducer";


export const editProfile = (user : any) => async (dispatch : any) => {
    try {
        let response;

        if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {

            response = postJwtProfile(
                {
                    username: user.username,
                    id: user.id,
                }
            );

        } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
            // response = postProfile(user);
        }

        const data = await response;

        if (data) {
            dispatch(profileSuccess(data));
        }

    } catch (error) {
        dispatch(profileError(error));
    }
};

export const resetProfileFlag = () => {
    try {
        const response = resetProfileFlagChange();
        return response;
    } catch (error) {
        return error;
    }
};