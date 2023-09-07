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

      if (
        state.notifications.allNotifi &&
        Array.isArray(state.notifications.allNotifi)
      ) {
        state.notifications.allNotifi.unshift(action.payload);
      } else {
        state.notifications.allNotifi = [action.payload];
      }
    },
    deleteNotifiSuccess: state => {
      state.notifications.isFetching = false;
      state.notifications.allNotifi = null;
    },
    getNotifiFailed: state => {
      state.notifications.isFetching = false;
      state.notifications.err = true;
    },
  },
});

export const {getNotifiStart, getNotifiSuccess, getNotifiFailed, deleteNotifiSuccess} =
  notifiSlice.actions;

export default notifiSlice.reducer;
