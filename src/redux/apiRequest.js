import axios from 'axios';
import {
  loginStart,
  loginSuccess,
  loginFailed,
  logoutSuccess,
} from './authSlice';
import {getStaffStart, getStaffSuccess, getStaffFailed} from './staffSlice';
import {getNotifiSuccess} from './notifiSlice';
import {sortByTitle} from '../utils/calculateFunction';
import {CommonActions} from '@react-navigation/native';
import {getCoords} from '../utils/serviceFunction';
import {
  getWeatherFailed,
  getWeatherStart,
  getWeatherSuccess,
} from './weatherSlice';
import {ToastWarning} from '../components/Toast';

const resetAction = CommonActions.reset({
  index: 0,
  routes: [{name: 'Home'}],
});

export const loginUser = async (user, dispatch, navigation) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(
      'https://management.ifee.edu.vn/api/login',
      user,
    );
    dispatch(loginSuccess((await res).data));

    if (res.data === 0) {
      const mess = 'Thông tin đăng nhập chưa chính xác!';
      ToastWarning(mess);
    } else {
      navigation.dispatch(resetAction);
      navigation.navigate('BottomTab');
    }
  } catch (err) {
    console.log(err);
    dispatch(loginFailed());
  }
};

export const getAllStaffs = async dispatch => {
  dispatch(getStaffStart());
  try {
    const res = await axios.get('https://management.ifee.edu.vn/api/staff/all');

    const data = res.data.filter(item => item.chucdanh !== null);
    const titleOrder = [
      'Viện trưởng',
      'Phó Viện trưởng',
      'Giám đốc',
      'Phó giám đốc',
      'Trưởng phòng',
      'Phó trưởng phòng',
      'Phụ trách kế toán',
      'Văn thư',
      'Ngiên cứu viên',
    ];

    dispatch(getStaffSuccess(sortByTitle(data, titleOrder)));
  } catch (err) {
    dispatch(getStaffFailed());
  }
};

export const logoutUser = (dispatch, navigation) => {
  dispatch(logoutSuccess());
  navigation.dispatch(resetAction);
  navigation.navigate('BottomTab');
};

export const getAllNotifi = (data, dispatch) => {
  dispatch(getNotifiSuccess(data));
};

export const getWeatherData = async dispatch => {
  const apiKey = '1e52cb7b5a93a86d54181d1fa5724454';
  dispatch(getWeatherStart());
  try {
    const coords = await getCoords();

    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}`,
    );

    const data = res.data;
    const iconCode = data.weather[0].icon;
    const temp = (data.main.temp - 273.15).toFixed(0);
    const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
    const name = data.name;
    const weatherData = {temp, iconUrl, name};

    dispatch(getWeatherSuccess(weatherData));
  } catch (error) {
    dispatch(getWeatherFailed());
  }
};
