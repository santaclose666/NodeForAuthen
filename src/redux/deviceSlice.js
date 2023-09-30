import {createSlice} from '@reduxjs/toolkit';

const deviceSlice = createSlice({
  name: 'device',
  initialState: {
    deviceSlice: {
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getDeviceStart: state => {
      state.deviceSlice.isFetching = true;
    },
    getDeviceSuccess: (state, action) => {
      state.deviceSlice.isFetching = false;
      state.deviceSlice.data = action.payload;
    },
    getDeviceFailed: state => {
      state.deviceSlice.isFetching = false;
      state.deviceSlice.err = true;
    },
  },
});

export const {getDeviceStart, getDeviceSuccess, getDeviceFailed} =
  deviceSlice.actions;

export default deviceSlice.reducer;
