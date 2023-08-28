import {createSlice} from '@reduxjs/toolkit';

const newSlice = createSlice({
  name: 'news',
  initialState: {
    newSlice: {
      category: null,
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getNewStart: state => {
      state.newSlice.isFetching = true;
    },
    getNewSuccess: (state, action) => {
      state.newSlice.isFetching = false;
      state.newSlice.category = action.payload.danhmuc;
      state.newSlice.data = action.payload.data;
    },
    getNewFailed: state => {
      state.newSlice.isFetching = false;
      state.newSlice.err = true;
    },
  },
});

export const {getNewStart, getNewSuccess, getNewFailed} = newSlice.actions;

export default newSlice.reducer;
