import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userForgetPassword } from "./thunk";

interface ForgetPasswordResponse {
  message: string; // The success message returned from the API
}

interface ForgetPasswordError {
  error: string; // The error message returned from the API
}

const initialState = {
  forgetError: null as string | null,  // Allow string or null
  forgetSuccessMsg: null as string | null,  // Allow string or null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userForgetPassword.fulfilled, (state, action: PayloadAction<ForgetPasswordResponse>) => {
        state.forgetSuccessMsg = action.payload.message;  // Assigning string value
        state.forgetError = null;  // Clear the error
      })
      .addCase(userForgetPassword.rejected, (state, action) => {
        if (action.payload) {
          state.forgetError = action.payload.error;  // Assigning error if payload is defined
        } else {
          state.forgetError = "An unknown error occurred";  // Provide a default error message if payload is undefined
        }
        state.forgetSuccessMsg = null;  // Clear the success message
      });
  },
});

export default userSlice.reducer;
