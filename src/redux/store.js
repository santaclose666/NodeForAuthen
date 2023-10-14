import {configureStore, combineReducers} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import staffReducer from './staffSlice';
import notifiReducer from './notifiSlice';
import weatherReducer from './weatherSlice';
import onLeaveReducer from './onLeaveSlice';
import workReducer from './workSlice';
import vehicleReducer from './vehicleSlice';
import ticketReducer from './ticketSlice';
import workScheduleReducer from './workScheduleSlice';
import totalWorkScheduleReducer from './totalWorkScheduleSlice';
import credentialReducer from './credentialSlice';
import newReducer from './newSlice';
import documentReducer from './documentSlice';
import SpeciesReducer from './SpeciesSlice';
import newsMvReducer from './newsMvSlice';
import documentMvReducer from './documentMvSlice';
import officeItemReducer from './officeItemSlice';
import deviceReducer from './deviceSlice';
import nationalParkReducer from './nationalPark';
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
  work: workReducer,
  vehicle: vehicleReducer,
  ticketPlane: ticketReducer,
  workSchedule: workScheduleReducer,
  totalWork: totalWorkScheduleReducer,
  credential: credentialReducer,
  news: newReducer,
  newsMv: newsMvReducer,
  document: documentReducer,
  documentMv: documentMvReducer,
  species: SpeciesReducer,
  officeItem: officeItemReducer,
  device: deviceReducer,
  nationalPark: nationalParkReducer,
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
