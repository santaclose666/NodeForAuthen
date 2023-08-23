import {createSlice} from '@reduxjs/toolkit';

const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    staffs: {
      IFEEStaff: null,
      XMGStaff: null,
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
      state.staffs.IFEEStaff = action.payload.ifee.sort((a, b) => {
        return a.id - b.id;
      });
      state.staffs.XMGStaff = action.payload.xmg.sort((a, b) => {
        return a.id - b.id;
      });
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
