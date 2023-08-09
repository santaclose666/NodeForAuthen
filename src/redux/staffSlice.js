import {createSlice} from '@reduxjs/toolkit';

const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    staffs: {
      allStaff: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getStaffStart: state => {
      state.staffs.isFetching = true;
    },
    getStaffSuccess: (state, action) => {
      state.staffs.isFetching = false;
      state.staffs.allStaff = action.payload;
    },
    getStaffFailed: state => {
      state.staffs.isFetching = false;
      state.staffs.err = true;
    },
  },
});

export const {getStaffStart, getStaffSuccess, getStaffFailed} =
  staffSlice.actions;

export default staffSlice.reducer;
