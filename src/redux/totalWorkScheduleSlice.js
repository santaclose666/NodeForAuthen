import {createSlice} from '@reduxjs/toolkit';

const totalWorkSlice = createSlice({
  name: 'myWorkSchedule',
  initialState: {
    totalWorkSchedule: {
      t2: null,
      t3: null,
      t4: null,
      t5: null,
      t6: null,
      t7: null,
      cn: null,
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
      state.totalWorkSchedule.t2 = action.payload.t2;
      state.totalWorkSchedule.t3 = action.payload.t3;
      state.totalWorkSchedule.t4 = action.payload.t4;
      state.totalWorkSchedule.t5 = action.payload.t5;
      state.totalWorkSchedule.t6 = action.payload.t6;
      state.totalWorkSchedule.t7 = action.payload.t7;
      state.totalWorkSchedule.cn = action.payload.cn;
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
