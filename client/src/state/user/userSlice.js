import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    signInFail: (state) => {
      state.loading = false;
    },
  },
});

export const { signInStart, signInSuccess, signInFail } = userSlice.actions;
export default userSlice.reducer;
