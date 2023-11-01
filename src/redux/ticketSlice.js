import {createSlice} from '@reduxjs/toolkit';

const ticketSlice = createSlice({
  name: 'ticketPlane',
  initialState: {
    ticketPlane: {
      data: null,
      users: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getTicketPlaneStart: state => {
      state.ticketPlane.isFetching = true;
    },
    getTicketPlaneSuccess: (state, action) => {
      state.ticketPlane.isFetching = false;
      state.ticketPlane.data = action.payload.data;
      state.ticketPlane.users = action.payload.users;
    },
    getTicketPlaneFailed: state => {
      state.ticketPlane.isFetching = false;
      state.ticketPlane.err = true;
    },
  },
});

export const {
  getTicketPlaneStart,
  getTicketPlaneSuccess,
  getTicketPlaneFailed,
} = ticketSlice.actions;

export default ticketSlice.reducer;
