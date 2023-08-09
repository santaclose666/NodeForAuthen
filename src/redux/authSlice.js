import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    login: {
      currentUser: null,
      isFetching: false,
      err: false,
    },
  },
  reducers: {
    loginStart: state => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.err = false;
    },
    loginFailed: state => {
      state.login.isFetching = false;
      state.login.currentUser = false;
      state.login.err = true;
    },

    logoutSuccess: state => {
      state.login.isFetching = false;
      state.login.currentUser = null;
      state.login.err = false;
    },
  },
});

export const {loginStart, loginSuccess, loginFailed, logoutSuccess} =
  authSlice.actions;

export default authSlice.reducer;
