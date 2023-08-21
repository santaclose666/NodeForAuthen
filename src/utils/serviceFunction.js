import Geolocation from 'react-native-geolocation-service';
import moment from 'moment';

export const getVietnameseDayOfWeek = () => {
  const vietnameseDays = [
    'Chủ Nhật', // Sunday
    'Thứ 2', // Monday
    'Thứ 3', // Tuesday
    'Thứ 4', // Wednesday
    'Thứ 5', // Thursday
    'Thứ 6', // Friday
    'Thứ 7', // Saturday
  ];
  const today = new Date();
  const dayOfWeek = today.getDay();
  return vietnameseDays[dayOfWeek];
};

export const getFormattedDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
};

export const getCurrentTime = () => {
  const today = new Date();
  const hour =
    today.getHours() < 10 ? `0${today.getHours()}` : today.getHours();
  const minute =
    today.getMinutes() < 10 ? `0${today.getMinutes()}` : today.getMinutes();

  const halfDay = today.getHours() <= 12 ? 'am' : 'pm';

  return `${hour}:${minute}${' ' + halfDay}`;
};

export const getCoords = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      async position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        resolve({latitude, longitude});
      },
      err => {
        reject(err);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  });
};

export const formatTime = date => {
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minute =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const halfDay = hour > 11 ? 'pm' : 'am';

  return `${hour}:${minute} ${halfDay}`;
};

export const formatDate = date => {
  const dateFormat = moment(date).format('DD/MM/YYYY');
  return dateFormat;
};

export const changeFormatDate = date => {
  const formatDate = moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
  return formatDate;
};

export const formatDateToPost = date => {
  const postFormat = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
  return postFormat;
};

export const compareDate = (date1, date2) => {
  const beforeDate = moment(date1, 'DD/MM/YYYY').startOf('day');
  const afterDate = moment(date2, 'DD/MM/YYYY').startOf('day');

  if (beforeDate <= afterDate) {
    return true;
  } else {
    return false;
  }
};
