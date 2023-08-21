import {createSlice} from '@reduxjs/toolkit';

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState: {
    vehicle: {
      statusData: null,
      availableCarData: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getVehicleStart: state => {
      state.vehicle.isFetching = true;
    },
    getVehicleSuccess: (state, action) => {
      const dataVehicle = action.payload;
      const availableData = dataVehicle.khadung;
      const pendingData = dataVehicle.data_pheduyet;
      const approvedData = dataVehicle.data_dapheduyet;
      const statusData = pendingData.concat(approvedData);

      state.vehicle.isFetching = false;
      state.vehicle.statusData = statusData;
      state.vehicle.availableCarData = availableData;
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
