import {createSlice} from '@reduxjs/toolkit';
import {XMGorder, IFEEorder} from '../contants/Variable';

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
        return a.vitri_ifee - b.vitri_ifee;
      });
      state.staffs.XMGStaff = action.payload.xmg.sort((a, b) => {
        return a.info_phong[0].vitr_ifee - b.info_phong[0].vitr_ifee;
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
