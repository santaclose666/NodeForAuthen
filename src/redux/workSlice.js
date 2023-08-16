import {createSlice} from '@reduxjs/toolkit';

const workSlice = createSlice({
  name: 'work',
  initialState: {
    works: {
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getWorkStart: state => {
      state.works.isFetching = true;
    },
    getWorkSuccess: (state, action) => {
      state.works.isFetching = false;
      state.works.data = action.payload;
    },
    getWorkFailed: state => {
      state.works.isFetching = false;
      state.works.err = true;
    },
  },
});

export const {getWorkStart, getWorkSuccess, getWorkFailed} = workSlice.actions;

export default workSlice.reducer;
