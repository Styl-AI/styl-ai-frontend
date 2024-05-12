import { createAsyncThunk } from "@reduxjs/toolkit";
import * as UserApi from '../../apis/user.api'


export const getCurrentUser = createAsyncThunk('/user/currentUser', async (data, { rejectWithValue }) => {
  try {
    const response = await UserApi.getCurrentUser(data)
    return response
  } catch (error) {
    if (error?.response?.data?.message) return rejectWithValue(error?.response?.data?.message);
    return rejectWithValue(error.message);
  }
})

