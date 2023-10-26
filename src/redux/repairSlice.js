import {createSlice} from '@reduxjs/toolkit';

const repairSlice = createSlice({
  name: 'repair',
  initialState: {
    repair: {
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getListRepairStart: state => {
      state.repair.isFetching = true;
    },
    getListRepairSuccess: (state, action) => {
      state.repair.isFetching = false;
      state.repair.data = action.payload;
    },
    getListRepairFailed: state => {
      state.repair.isFetching = false;
      state.repair.err = true;
    },
  },
});

export const {getListRepairStart, getListRepairSuccess, getListRepairFailed} =
  repairSlice.actions;

export default repairSlice.reducer;
