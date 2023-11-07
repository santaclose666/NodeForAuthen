import {createSlice} from '@reduxjs/toolkit';

const totalWorkSlice = createSlice({
  name: 'myWorkSchedule',
  initialState: {
    totalWorkSchedule: {
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getTotalWorkStart: state => {
      state.totalWorkSchedule.isFetching = true;
    },
    getTotalWorkSuccess: (state, action) => {
      state.totalWorkSchedule.isFetching = false;

      state.totalWorkSchedule.data = action.payload;
    },
    getTotalWorkFailed: state => {
      state.totalWorkSchedule.isFetching = false;
      state.totalWorkSchedule.err = true;
    },
  },
});

export const {getTotalWorkStart, getTotalWorkSuccess, getTotalWorkFailed} =
  totalWorkSlice.actions;

export default totalWorkSlice.reducer;
