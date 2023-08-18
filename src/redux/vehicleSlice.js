import {createSlice} from '@reduxjs/toolkit';

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState: {
    vehicle: {
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getVehicleStart: state => {
      state.vehicle.isFetching = true;
    },
    getVehicleSuccess: (state, action) => {
      state.vehicle.isFetching = false;
      state.vehicle.data = action.payload;
    },
    getVehicleFailed: state => {
      state.vehicle.isFetching = false;
      state.vehicle.err = true;
    },
  },
});

export const {getVehicleStart, getVehicleSuccess, getVehicleFailed} =
  vehicleSlice.actions;

export default vehicleSlice.reducer;
