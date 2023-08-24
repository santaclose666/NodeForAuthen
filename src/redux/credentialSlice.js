import {createSlice} from '@reduxjs/toolkit';

const credentialSlice = createSlice({
  name: 'credential',
  initialState: {
    credential: {
      emailPwd: null,
      isFetching: false,
      err: false,
    },
  },
  reducers: {
    saveSuccess: (state, action) => {
      state.credential.isFetching = false;
      state.credential.emailPwd = action.payload;
    },
  },
});

export const {saveSuccess} = credentialSlice.actions;

export default credentialSlice.reducer;
