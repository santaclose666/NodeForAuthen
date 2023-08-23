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
        const indexA = IFEEorder.indexOf(a.chucdanh);
        const indexB = IFEEorder.indexOf(b.chucdanh);
        return indexA - indexB;
      });
      state.staffs.XMGStaff = action.payload.xmg.sort((a, b) => {
        const indexA = XMGorder.indexOf(a.info_phong[0].chucdanh);
        const indexB = XMGorder.indexOf(b.info_phong[0].chucdanh);
        return indexA - indexB;
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
