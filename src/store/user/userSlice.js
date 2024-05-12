import { createSlice } from "@reduxjs/toolkit";
import { USER_TOKEN } from "../../constants/env.contant";
import { getCurrentUser } from "./userAction";

const initialState = {
  userInfo: {},
  userToken: localStorage.getItem(USER_TOKEN),
  userId : localStorage.getItem('userId'),
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem(USER_TOKEN);
      localStorage.removeItem('userId');
      state.userInfo = {};
    },
    updateUserDetails: (state, { payload }) => {
        state.userInfo = payload.user;
        state.userToken = payload?.token;
        state.userId =  payload?.user?.["_id"];
      }
  },
  extraReducers:(builder) => {
    builder.addCase(getCurrentUser.fulfilled, (state, { payload }) => {
      state.userInfo = payload.user;
      state.userToken = payload?.token;
      state.userId =  payload?.user?.["_id"];
    })
  }
})

export const { logout, updateUserDetails } = userSlice.actions;

export default userSlice.reducer;
