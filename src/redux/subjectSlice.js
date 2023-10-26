import {createSlice} from '@reduxjs/toolkit';

const subjectSlice = createSlice({
  name: 'subject',
  initialState: {
    subject: {
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getSubjectSuccess: (state, action) => {
      state.subject.isFetching = false;
      state.subject.data = action.payload;
    },
  },
});

export const {getSubjectSuccess} = subjectSlice.actions;

export default subjectSlice.reducer;
