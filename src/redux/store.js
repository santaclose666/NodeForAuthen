import {configureStore, combineReducers} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import staffReducer from './staffSlice';
import notifiReducer from './notifiSlice';
import weatherReducer from './weatherSlice';
import onLeaveReducer from './onLeaveSlice';
import logger from 'redux-logger';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  staffs: staffReducer,
  notifi: notifiReducer,
  weather: weatherReducer,
  onLeave: onLeaveReducer,
});
const persistedReducer = persistReducer(
  persistConfig,
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(logger),
});

export let persistor = persistStore(store);