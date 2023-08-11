import {createSlice} from '@reduxjs/toolkit';

const onLeaveSlice = createSlice({
  name: 'onLeave',
  initialState: {
    onLeaves: {
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getOnLeaveStart: state => {
      state.onLeaves.isFetching = true;
    },
    getOnLeaveSuccess: (state, action) => {
      state.onLeaves.isFetching = false;
      state.onLeaves.data = action.payload;
    },
    getOnLeaveFailed: state => {
      state.onLeaves.isFetching = false;
      state.onLeaves.err = true;
    },
  },
});

export const {getOnLeaveStart, getOnLeaveSuccess, getOnLeaveFailed} =
  onLeaveSlice.actions;

export default onLeaveSlice.reducer;
