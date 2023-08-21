import {createSlice} from '@reduxjs/toolkit';

const workScheduleSlice = createSlice({
  name: 'workSchedule',
  initialState: {
    worksSchedule: {
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getWorkScheduleStart: state => {
      state.worksSchedule.isFetching = true;
    },
    getWorkScheduleSuccess: (state, action) => {
      state.worksSchedule.isFetching = false;
      state.worksSchedule.data = action.payload;
    },
    getWorkScheduleFailed: state => {
      state.worksSchedule.isFetching = false;
      state.worksSchedule.err = true;
    },
  },
});

export const {
  getWorkScheduleStart,
  getWorkScheduleSuccess,
  getWorkScheduleFailed,
} = workScheduleSlice.actions;

export default workScheduleSlice.reducer;
