import {createSlice} from '@reduxjs/toolkit';

const myDeviceSlice = createSlice({
  name: 'device',
  initialState: {
    myDeviceSlice: {
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getMyDeviceStart: state => {
      state.myDeviceSlice.isFetching = true;
    },
    getMyDeviceSuccess: (state, action) => {
      state.myDeviceSlice.isFetching = false;
      state.myDeviceSlice.data = action.payload;
    },
    getMyDeviceFailed: state => {
      state.myDeviceSlice.isFetching = false;
      state.myDeviceSlice.err = true;
    },
  },
});

export const {getMyDeviceStart, getMyDeviceSuccess, getMyDeviceFailed} =
  myDeviceSlice.actions;

export default myDeviceSlice.reducer;
