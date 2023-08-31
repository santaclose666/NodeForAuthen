import {createSlice} from '@reduxjs/toolkit';

const documentSlice = createSlice({
  name: 'document',
  initialState: {
    documentSlice: {
      category: null,
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getDocumentStart: state => {
      state.documentSlice.isFetching = true;
    },
    getDocumentSuccess: (state, action) => {
      const arr = ['Tất cả'];
      action.payload.forEach(item => {
        if (!arr.includes(item.loaivanban)) {
          arr.push(item.loaivanban);
        }
      });
      state.documentSlice.isFetching = false;
      state.documentSlice.data = action.payload;
      state.documentSlice.category = arr;
    },
    getDocumentFailed: state => {
      state.documentSlice.isFetching = false;
      state.documentSlice.err = true;
    },
  },
});

export const {getDocumentStart, getDocumentSuccess, getDocumentFailed} =
  documentSlice.actions;

export default documentSlice.reducer;
