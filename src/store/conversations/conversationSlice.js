import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    conversationId:'',
    userId : localStorage.getItem('userId')
}

export const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    updateConversationDetails: (state, { payload }) => {
      state.conversationId = payload?.conversationId,
      state.userId = localStorage.getItem("userId")
    }
  },
})

export const { updateConversationDetails } = conversationSlice.actions;

export default conversationSlice.reducer;
