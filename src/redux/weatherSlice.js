import {createSlice} from '@reduxjs/toolkit';

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    weathers: {
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getWeatherStart: state => {
      state.weathers.isFetching = true;
    },
    getWeatherSuccess: (state, action) => {
      state.weathers.isFetching = false;
      state.weathers.data = action.payload;
    },
    getWeatherFailed: state => {
      state.weathers.isFetching = false;
      state.weathers.err = true;
    },
  },
});

export const {getWeatherStart, getWeatherSuccess, getWeatherFailed} =
  weatherSlice.actions;

export default weatherSlice.reducer;
