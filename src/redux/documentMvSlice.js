import {createSlice} from '@reduxjs/toolkit';

const documentMvSlice = createSlice({
  name: 'documentMv',
  initialState: {
    documentMvSlice: {
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getDocumentMvStart: state => {
      state.documentMvSlice.isFetching = true;
    },
    getDocumentMvSuccess: (state, action) => {
      state.documentMvSlice.isFetching = false;
      state.documentMvSlice.data = action.payload;
    },
    getDocumentMvFaild: state => {
      state.documentMvSlice.isFetching = false;
      state.documentMvSlice.err = true;
    },
  },
});

export const {getDocumentMvStart, getDocumentMvSuccess, getDocumentMvFaild} =
  documentMvSlice.actions;

export default documentMvSlice.reducer;
