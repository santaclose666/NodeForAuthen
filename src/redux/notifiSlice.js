import {createSlice} from '@reduxjs/toolkit';

const notifiSlice = createSlice({
  name: 'notifi',
  initialState: {
    notifications: {
      allNotifi: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getNotifiStart: state => {
      state.notifications.isFetching = true;
    },
    getNotifiSuccess: (state, action) => {
      state.notifications.isFetching = false;
      state.notifications.allNotifi = action.payload;
    },
    getNotifiFailed: state => {
      state.notifications.isFetching = false;
      state.notifications.err = true;
    },
  },
});

export const {getNotifiStart, getNotifiSuccess, getNotifiFailed} =
  notifiSlice.actions;

export default notifiSlice.reducer;
