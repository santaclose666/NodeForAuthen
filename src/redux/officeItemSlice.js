import {createSlice} from '@reduxjs/toolkit';

const officeItemSlice = createSlice({
  name: 'officeItem',
  initialState: {
    officeItemSlice: {
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getRegisterOfficeStart: state => {
      state.officeItemSlice.isFetching = true;
    },
    getRegisterOfficeSuccess: (state, action) => {
      state.officeItemSlice.isFetching = false;
      state.officeItemSlice.data = action.payload;
    },
    getRegisterOfficeFailed: state => {
      state.officeItemSlice.isFetching = false;
      state.officeItemSlice.err = true;
    },
  },
});

export const {
  getRegisterOfficeStart,
  getRegisterOfficeSuccess,
  getRegisterOfficeFailed,
} = officeItemSlice.actions;

export default officeItemSlice.reducer;
