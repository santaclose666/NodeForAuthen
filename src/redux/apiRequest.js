import axios from 'axios';
import {
  loginStart,
  loginSuccess,
  loginFailed,
  logoutSuccess,
} from './authSlice';
import {getStaffStart, getStaffSuccess, getStaffFailed} from './staffSlice';
import {getNotifiSuccess} from './notifiSlice';
import {CommonActions} from '@react-navigation/native';
import {getCoords} from '../utils/serviceFunction';
import {
  getWeatherFailed,
  getWeatherStart,
  getWeatherSuccess,
} from './weatherSlice';
import {ToastWarning} from '../components/Toast';
import {
  getOnLeaveFailed,
  getOnLeaveStart,
  getOnLeaveSuccess,
} from './onLeaveSlice';
import {getWorkFailed, getWorkStart, getWorkSuccess} from './workSlice';

const resetAction = CommonActions.reset({
  index: 0,
  routes: [{name: 'Home'}],
});

/////////////////////  USER DATA  ////////////////////
export const loginUser = async (user, dispatch, navigation) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(
      'https://forestry.ifee.edu.vn/api/login',
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

export const logoutUser = (dispatch, navigation) => {
  dispatch(logoutSuccess());
  navigation.dispatch(resetAction);
  navigation.navigate('BottomTab');
};

/////////////////////  STAFFS DATA  ////////////////////
export const getAllStaffs = async dispatch => {
  dispatch(getStaffStart());
  try {
    const res = await axios.get('https://forestry.ifee.edu.vn/api/staff/all');

    const data = res.data;

    dispatch(
      getStaffSuccess(
        data.sort((a, b) => {
          return a.id - b.id;
        }),
      ),
    );
  } catch (err) {
    dispatch(getStaffFailed());
  }
};

/////////////////////  NOTIFICATION DATA  ////////////////////
export const getAllNotifi = (data, dispatch) => {
  dispatch(getNotifiSuccess(data));
};

/////////////////////  WEATHERS DATA  ////////////////////
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

/////////////////////  ON LEAVE DATA  ////////////////////
export const registerOnLeave = async data => {
  try {
    await axios.post(
      ` https://management.ifee.edu.vn/api/nghiphep/reg/${data.id_user}`,
      {tungay: data.tungay, tong: data.tong, lydo: data.lydo},
    );
  } catch (error) {
    console.log(error);
  }
};

export const getAllOnLeaveData = async (id, dispatch) => {
  dispatch(getOnLeaveStart());
  try {
    const res = await axios.get(
      `https://management.ifee.edu.vn/api/nghiphep/danhsach/${id}`,
    );

    const data = res.data.sort((a, b) => {
      return b.id - a.id;
    });

    dispatch(getOnLeaveSuccess(data));
  } catch (error) {
    dispatch(getOnLeaveFailed());
  }
};

export const resolveLeaveRequest = async data => {
  try {
    console.log('resolve', data);
    await axios.post(
      `https://management.ifee.edu.vn/api/nghiphep/duyet/${data.id_nghiphep}`,
      {id_user: data.id_user, nhanxet: data.nhanxet},
    );
  } catch (error) {
    console.log(error);
  }
};

export const rejectLeaveRequest = async data => {
  try {
    console.log('reject', data);
    await axios.post(
      `https://management.ifee.edu.vn/api/nghiphep/tuchoi/${data.id_nghiphep}`,
      {id_user: data.id_user, lydo: data.lydo},
    );
  } catch (error) {
    console.log(error);
  }
};

export const adjustOnLeave = async data => {
  try {
    await axios.post(
      `https://management.ifee.edu.vn/api/nghiphep/ycdieuchinh/${data.id_nghiphep}`,
      {ngay_dc: data.ngay_dc},
    );
  } catch (error) {
    console.log(error);
  }
};

export const approveAdjustOnLeave = async id_nghiphep => {
  try {
    await axios.get(`https://management.ifee.edu.vn/api/nghiphep/duyetdc/${id_nghiphep}
    `);
  } catch (error) {
    console.log(error);
  }
};

export const cancelAdjustOnLeave = async data => {
  try {
    await axios.post(
      `https://management.ifee.edu.vn/api/nghiphep/tuchoidc/${data.id_nghiphep}`,
      {
        lydo: data.lydo,
      },
    );
  } catch (error) {
    console.log(error);
  }
};

/////////////////////  WORK SCHEDULE DATA  ////////////////////
export const getAllWorkName = async dispatch => {
  dispatch(getWorkStart());
  try {
    const res = await axios.get(
      `https://management.ifee.edu.vn/api/lichcongtac/reg`,
    );

    const data = res.data.sort((a, b) => {
      return b.id - a.id;
    });

    dispatch(getWorkSuccess(data));
  } catch (error) {
    dispatch(getWorkFailed());
  }
};
