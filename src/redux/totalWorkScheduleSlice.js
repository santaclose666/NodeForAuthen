import {createSlice} from '@reduxjs/toolkit';
import moment from 'moment';
import {getFirstDateOfWeek} from '../utils/serviceFunction';

const dayOfWeek = getFirstDateOfWeek();

const timeToString = time => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const formatData = data => {
  const timestampCurr = moment(dayOfWeek.firstDay).valueOf();
  const tasks = {};
  data?.forEach((item, index) => {
    const time = timestampCurr + 25200000 + index * 24 * 60 * 60 * 1000;
    const strTime = timeToString(time);

    tasks[strTime] = [];

    item.forEach(subItem => {
      tasks[strTime].push({
        id: subItem.id,
        id_user: subItem.id_user,
        name: subItem.ten,
        position: subItem.chucdanh,
        time: subItem.thoigian,
        location: subItem.diadiem,
        content: subItem.noidung,
        clue: subItem.daumoi,
        component: subItem.thanhphan,
        warning: subItem.canhbao,
        ct: subItem.ct,
      });
    });
  });
  return tasks;
};

const totalWorkSlice = createSlice({
  name: 'myWorkSchedule',
  initialState: {
    totalWorkSchedule: {
      data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getTotalWorkStart: state => {
      state.totalWorkSchedule.isFetching = true;
    },
    getTotalWorkSuccess: (state, action) => {
      state.totalWorkSchedule.isFetching = false;
      const data = [
        action.payload.t2,
        action.payload.t3,
        action.payload.t4,
        action.payload.t5,
        action.payload.t6,
        action.payload.t7,
        action.payload.cn,
      ];

      console.log(formatData());

      state.totalWorkSchedule.data = formatData(data);
    },
    getTotalWorkFailed: state => {
      state.totalWorkSchedule.isFetching = false;
      state.totalWorkSchedule.err = true;
    },
  },
});

export const {getTotalWorkStart, getTotalWorkSuccess, getTotalWorkFailed} =
  totalWorkSlice.actions;

export default totalWorkSlice.reducer;
