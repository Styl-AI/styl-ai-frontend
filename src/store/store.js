import { configureStore } from '@reduxjs/toolkit';
import conversationReducer from "./conversations/conversationSlice"
import userReducer from "./user/userSlice"

export const store = configureStore({
  reducer: {
    conversation: conversationReducer,
    user : userReducer
  }
})