import {createSlice} from '@reduxjs/toolkit';

const unitSlice = createSlice({
  name: 'unitOption',
  initialState: {
    unitOption: {
      data: null,
    },
  },

  reducers: {
    setUnitOption: (state, action) => {
      state.unitOption.data = action.payload;
    },
  },
});

export const {setUnitOption} = unitSlice.actions;

export default unitSlice.reducer;
