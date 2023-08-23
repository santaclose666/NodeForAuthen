import {createSlice} from '@reduxjs/toolkit';

const myWorkSlice = createSlice({
  name: 'myWorkSchedule',
  initialState: {
    myWorkSchedule: {
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getMyWorkStart: state => {
      state.myWorkSchedule.isFetching = true;
    },
    getMyWorkSuccess: (state, action) => {
      state.myWorkSchedule.isFetching = false;
      state.myWorkSchedule.data = action.payload;
    },
    getMyWorkFailed: state => {
      state.myWorkSchedule.isFetching = false;
      state.myWorkSchedule.err = true;
    },
  },
});

export const {getMyWorkStart, getMyWorkSuccess, getMyWorkFailed} =
  myWorkSlice.actions;

export default myWorkSlice.reducer;
