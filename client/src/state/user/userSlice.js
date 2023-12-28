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
    updateStart: (state) => {
      state.loading = true;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    updateFail: (state) => {
      state.loading = false;
    },
    signOut: (state) => {
      state.currentUser = undefined;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFail,
  updateStart,
  updateSuccess,
  updateFail,
  signOut,
} = userSlice.actions;
export default userSlice.reducer;
