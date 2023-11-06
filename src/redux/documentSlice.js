import {createSlice} from '@reduxjs/toolkit';

const documentSlice = createSlice({
  name: 'document',
  initialState: {
    documentSlice: {
      data: {},
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getDocumentStart: state => {
      state.documentSlice.isFetching = true;
    },
    getDocumentSuccess: (state, action) => {
      state.documentSlice.isFetching = false;

      const tempData = {...state.documentSlice.data, ...action.payload};

      state.documentSlice.data = tempData;
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
