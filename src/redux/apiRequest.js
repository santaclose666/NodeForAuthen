import axios, {formToJSON} from 'axios';
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

import {
  getVehicleStart,
  getVehicleSuccess,
  getVehicleFailed,
} from './vehicleSlice';
import {getWorkFailed, getWorkStart, getWorkSuccess} from './workSlice';
import {ToastAlert, ToastSuccess} from '../components/Toast';
import {
  getTicketPlaneFailed,
  getTicketPlaneStart,
  getTicketPlaneSuccess,
} from './ticketSlice';

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

export const registerWorkSchedule = async data => {
  try {
    const op1 = data.op1_tenchuongtrinh;
    const op2 = data.op2_tenchuongtrinh;
    const checkOpp =
      data.op_tenchuongtrinh === 1
        ? {op1_tenchuongtrinh: op1}
        : {op2_tenchuongtrinh: op2};

    await axios.post(`https://management.ifee.edu.vn/api/lichcongtac/reg`, {
      id_user: data.id_user,
      tungay: data.tungay,
      denngay: data.denngay,
      diadiem: data.diadiem,
      noidung: data.noidung,
      daumoi: data.daumoi,
      thanhphan: data.thanhphan,
      ghichu: data.ghichu,
      op_tenchuongtrinh: data.op_tenchuongtrinh,
      ...checkOpp,
    });
  } catch (error) {
    console.log(error);
  }
};

/////////////////////  VEHIOCLE SCHEDULE DATA  ////////////////////

export const getVehicleData = async (dispatch, id) => {
  dispatch(getVehicleStart());
  try {
    const res = await axios.get(
      `https://management.ifee.edu.vn/api/xe/danhsach/${id}`,
    );
    dispatch(getVehicleSuccess(res.data));
  } catch (error) {
    console.log('errr'.error);
    dispatch(getVehicleFailed());
  }
};

export const registerVehicle = async data => {
  try {
    await axios.post(
      `https://management.ifee.edu.vn/api/xe/reg/${data.id_user}`,
      {
        loaixe: data.loaixe,
        ngaydi: data.ngaydi,
        noiden: data.noiden,
        noidung: data.noidung,
        gionhan: data.gionhan,
        ngaynhan: data.ngaynhan,
      },
    );
    ToastSuccess('Thành công');
  } catch (error) {
    ToastAlert('Gửi đề nghị thất bại!');
  }
};

export const resolveVehicleRequest = async data => {
  try {
    console.log('resolve', data);
    const res = await axios.get(
      `https://management.ifee.edu.vn/api/xe/pheduyet/${data.idVehicle}`,
      {id_user: data.id_user},
    );
    ToastSuccess('Phê duyệt thành công');
  } catch (error) {
    console.log(error);
    ToastAlert('Phê duyệt không thành công');
  }
};

export const rejectVehicleRequest = async data => {
  try {
    console.log('reject', data);
    const res = await axios.get(
      `https://management.ifee.edu.vn/api/xe/tuchoi/${data.idVehicle}`,
      {id_user: data.id_user},
    );
    ToastSuccess('Đã từ chối đề nghị');
  } catch (error) {
    console.log(error);
    oastAlert('Từ chối thất bại');
  }
};

/////////////////////  REGISTER PLANE DATA  ////////////////////

export const registerPlaneTicket = async data => {
  try {
    console.log(data);
    await axios.post(
      `https://management.ifee.edu.vn/api/vemaybay/reg/${data.id_user}`,
      {
        ds_ns: data.ds_ns,
        ngoaivien: data.ngoaivien,
        chuongtrinh: data.chuongtrinh,
        hangbay: data.hangbay,
        sanbaydi: data.sanbaydi,
        sanbayden: data.sanbayden,
        ngaydi: data.ngaydi,
        hangve: data.hangve,
        kygui: data.kygui,
      },
    );
  } catch (error) {
    console.log(error);
  }
};

export const getAllPlaneData = async dispatch => {
  dispatch(getTicketPlaneStart());
  try {
    const res = await axios.get(
      `https://management.ifee.edu.vn/api/vemaybay/danhsach`,
    );

    const data = res.data.data;
    dispatch(getTicketPlaneSuccess(data));
  } catch (error) {
    dispatch(getTicketPlaneFailed());
  }
};

export const approvePlaneTicket = async data => {
  try {
    await axios.post(
      `https://management.ifee.edu.vn/api/vemaybay/pheduyet/${data.id_dulieu}`,
      {
        noidung: data.noidung,
      },
    );
  } catch (error) {
    console.log(error);
  }
};

export const cancelPlaneTicket = async data => {
  try {
    await axios.post(
      `https://management.ifee.edu.vn/api/vemaybay/tuchoi/${data.id_dulieu}`,
      {
        noidung: data.noidung,
      },
    );
  } catch (error) {
    console.log(error);
  }
};
