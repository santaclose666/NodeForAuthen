import Geolocation from 'react-native-geolocation-service';
import getWeatherData from '../apiService/weatherCurrent';

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
        try {
          const data = await getWeatherData(latitude, longitude);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      },
      err => {
        reject(err);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  });
};
