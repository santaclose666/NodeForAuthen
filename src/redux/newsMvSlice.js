import {createSlice} from '@reduxjs/toolkit';

const newMvSlice = createSlice({
  name: 'newsmv',
  initialState: {
    newMvSlice: {
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getNewMvStart: state => {
      state.newMvSlice.isFetching = true;
    },
    getNewMvSuccess: (state, action) => {
      state.newMvSlice.isFetching = false;
      state.newMvSlice.data = action.payload;
    },
    getNewMvFailed: state => {
      state.newMvSlice.isFetching = false;
      state.newMvSlice.err = true;
    },
  },
});

export const {getNewMvStart, getNewMvSuccess, getNewMvFailed} =
  newMvSlice.actions;

export default newMvSlice.reducer;
