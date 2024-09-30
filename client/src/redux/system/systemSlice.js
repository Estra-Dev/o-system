import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  systemDetails: null,
  loading: false,
  error: null,
};

const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    createStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createSuccess: (state, action) => {
      state.systemDetails = action.payload;
      state.loading = false;
      state.error = null;
    },
    createError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getSystemSuccess: (state, action) => {
      state.systemDetails = action.payload;
      state.loading = false;
      state.error = null;
    },
    getSystemFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  createStart,
  createSuccess,
  createError,
  getSystemSuccess,
  getSystemFailure,
} = systemSlice.actions;
export default systemSlice.reducer;
