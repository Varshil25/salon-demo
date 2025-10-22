import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from 'axios';
import axios from 'axios'; // Import Axios
import { sendResetPassword } from "Services/AuthService";


interface ErrorResponse {
  error: string; // Error message from the API response
}

export const userForgetPassword = createAsyncThunk<
  { message: string },   // On success, the data is a message object
  string,                // The input to the thunk (email address)
  { rejectValue: ErrorResponse }  // On failure, the payload is of type ErrorResponse
>(
  'users/send-reset-email',
  async (email, { rejectWithValue }) => {
    try {
      const response = await sendResetPassword(email);
      return response;  // Return the success message
    } catch (error) {
      // Return a structured error object for rejected cases
      return rejectWithValue({ error: 'An unknown error occurred' });
    }
  }
);