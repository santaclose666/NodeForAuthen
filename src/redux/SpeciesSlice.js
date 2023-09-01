import {createSlice} from '@reduxjs/toolkit';

const speciesSlice = createSlice({
  name: 'species',
  initialState: {
    specieSlice: {
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getSpecieStart: state => {
      state.specieSlice.isFetching = true;
    },
    getSpecieSuccess: (state, action) => {
      state.specieSlice.isFetching = false;
      state.specieSlice.data = action.payload;
    },
    getSpecieFailed: state => {
      state.specieSlice.isFetching = false;
      state.specieSlice.err = true;
    },
  },
});

export const {getSpecieStart, getSpecieSuccess, getSpecieFailed} =
  speciesSlice.actions;

export default speciesSlice.reducer;
