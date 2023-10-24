import {createSlice} from '@reduxjs/toolkit';

const nationalParkSlice = createSlice({
  name: 'nationalPark',
  initialState: {
    nationalParkSlice: {
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getNationalParkStart: state => {
      state.nationalParkSlice.isFetching = true;
    },
    getNationalParkSuccess: (state, action) => {
      state.nationalParkSlice.isFetching = false;
      state.nationalParkSlice.data = action.payload;
    },
    getNationalParkFailed: state => {
      state.nationalParkSlice.isFetching = false;
      state.nationalParkSlice.err = true;
    },
  },
});

export const {
  getNationalParkStart,
  getNationalParkSuccess,
  getNationalParkFailed,
} = nationalParkSlice.actions;

export default nationalParkSlice.reducer;
