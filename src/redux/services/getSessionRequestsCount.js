import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getSessionRequestsCount = createAsyncThunk(
  "getSessionCount",
  async (_, thunkAPI) => {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_BASE_URL}/api/session-requests/count/`,
        withCredentials: true,
      });
      if (response) {
        return response.data;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.response.message });
    }
  }
);