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

import {
  getVehicleStart,
  getVehicleSuccess,
  getVehicleFailed,
} from './vehicleSlice';
import {getWorkFailed, getWorkStart, getWorkSuccess} from './workSlice';
import {
  getTicketPlaneFailed,
  getTicketPlaneStart,
  getTicketPlaneSuccess,
} from './ticketSlice';
import {
  getWorkScheduleFailed,
  getWorkScheduleStart,
  getWorkScheduleSuccess,
} from './workScheduleSlice';
import {
  getTotalWorkFailed,
  getTotalWorkStart,
  getTotalWorkSuccess,
} from './totalWorkScheduleSlice';
import {saveSuccess} from './credentialSlice';
import {getNewFailed, getNewStart, getNewSuccess} from './newSlice';
import {getToken} from '../utils/firebaseNotifi';
import {
  getDocumentFailed,
  getDocumentStart,
  getDocumentSuccess,
} from './documentSlice';
import {
  getSpecieFailed,
  getSpecieStart,
  getSpecieSuccess,
} from './SpeciesSlice';

const resetAction = CommonActions.reset({
  index: 0,
  routes: [{name: 'Home'}],
});

/////////////////////  USER DATA  ////////////////////
export const loginUser = async (user, dispatch, navigation, save) => {
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
      postToken(res.data.id_ht);

      save ? dispatch(saveSuccess(user)) : dispatch(saveSuccess(null));
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

    dispatch(getStaffSuccess(data));
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
  const accuWeatherKey = 'c4xZhkePolmNN6pumUusg0mAQVy8fODv';
  dispatch(getWeatherStart());
  try {
    const coords = await getCoords();

    console.log(coords);

    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}`,
    );

    const accuWeather = await axios.get(
      `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${accuWeatherKey}&q=${coords.latitude}%2C%20${coords.longitude}&language=vi-VN`,
    );

    console.log(accuWeather.data);

    const data = res.data;
    const iconCode = data.weather[0].icon;
    const temp = (data.main.temp - 273.15).toFixed(0);
    const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
    const name = accuWeather.data.LocalizedName;
    const weatherData = {temp, iconUrl, name};

    dispatch(getWeatherSuccess(weatherData));
  } catch (error) {
    dispatch(getWeatherFailed());
  }
};

/////////////////////  ON LEAVE DATA  ////////////////////
export const registerOnLeave = async data => {
  try {
    const res = await axios.post(
      `https://management.ifee.edu.vn/api/nghiphep/reg/${data.id_user}`,
      {
        tungay: data.tungay,
        tong: data.tong,
        lydo: data.lydo,
      },
    );

    return res.data;
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
    const res = await axios.post(
      `https://management.ifee.edu.vn/api/nghiphep/duyet/${data.id_nghiphep}`,
      {id_user: data.id_user, nhanxet: data.nhanxet},
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const rejectLeaveRequest = async data => {
  try {
    const res = await axios.post(
      `https://management.ifee.edu.vn/api/nghiphep/tuchoi/${data.id_nghiphep}`,
      {id_user: data.id_user, lydo: data.lydo},
    );

    return res.data;
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
    const res = await axios.post(
      `https://management.ifee.edu.vn/api/lichcongtac/reg`,
      {
        ...data,
      },
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllWorkSchedule = async (dispatch, id) => {
  dispatch(getWorkScheduleStart());
  try {
    const res = await axios.get(
      `https://management.ifee.edu.vn/api/lichcongtac/danhsach?id_user=${id}`,
    );

    const pendingArr = res.data.pheduyet;
    const approvedArr = res.data.dapheduyet;
    const cancelArr = res.data.tuchoi;

    const data = approvedArr.concat(pendingArr.concat(cancelArr));

    dispatch(
      getWorkScheduleSuccess(
        data.sort((a, b) => {
          return b.id - a.id;
        }),
      ),
    );
  } catch (error) {
    dispatch(getWorkScheduleFailed());
  }
};

export const approveWorkSchedule = async data => {
  try {
    await axios.post(
      `https://management.ifee.edu.vn/api/lichcongtac/dongy/${data.id_lichcongtac}`,
      {nhanxet: data.nhanxet},
    );
  } catch (error) {
    console.log(error);
  }
};

export const cancelWorkSchedule = async data => {
  try {
    await axios.post(
      `https://management.ifee.edu.vn/api/lichcongtac/tuchoi/${data.id_lichcongtac}`,
      {lydo: data.lydo},
    );
  } catch (error) {
    console.log(error);
  }
};

export const totalWorkSchedule = async dispatch => {
  dispatch(getTotalWorkStart());
  try {
    const res = await axios.get(
      `https://management.ifee.edu.vn/api/lichcongtac/tonghop`,
    );

    const data = res.data;
    dispatch(getTotalWorkSuccess(data));

    return data;
  } catch (error) {
    dispatch(getTotalWorkFailed());
  }
};

export const warningWorkSchedule = async data => {
  try {
    const res = await axios.post(
      `https://management.ifee.edu.vn/api/lichcongtac/canhbao/${data.id_lichchitiet}?lydo=${data.lydo}`,
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const requestFinishWorkSchedule = async data => {
  try {
    await axios.post(
      `https://management.ifee.edu.vn/api/lichcongtac/yc_ketthuc/${data.id_lichcongtac}?giove=${data.giove}&ngayve=${data.ngayve}`,
    );
  } catch (error) {
    console.log(error);
  }
};

export const approveFinishRequest = async data => {
  try {
    console.log(data);
    await axios.post(
      `https://management.ifee.edu.vn/api/lichcongtac/pd_ketthuc/${data.id_lichcongtac}`,
      {
        nhanxet: data.nhanxet,
      },
    );
  } catch (error) {
    console.log(error);
  }
};

export const cancelFinishRequest = async data => {
  try {
    console.log(data);
    await axios.post(
      `https://management.ifee.edu.vn/api/lichcongtac/tc_ketthuc/${data.id_lichcongtac}`,
      {
        lydo: data.lydo,
      },
    );
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
    dispatch(getVehicleFailed());
  }
};

export const registerVehicle = async data => {
  try {
    const res = await axios.post(
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

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const approveVehicle = async data => {
  try {
    await axios.get(
      `https://management.ifee.edu.vn/api/xe/pheduyet/${data.id_dulieu}?id_user=${data.id_user}`,
    );
  } catch (error) {
    console.log(error);
  }
};

export const cancelVehicle = async data => {
  try {
    await axios.get(
      `https://management.ifee.edu.vn/api/xe/tuchoi/${data.id_dulieu}?id_user=${data.id_user}`,
    );
  } catch (error) {
    console.log(error);
  }
};

export const returnVehicle = async data => {
  try {
    console.log(data);
    const formData = new FormData();

    formData.append('file', data.file);
    formData.append('ngayve', data.ngayve);
    formData.append('km_nhan', data.km_nhan);
    formData.append('phixangxe', data.phixangxe);
    formData.append('nguoimuaxang', data.nguoimuaxang);
    formData.append('phibaoduong', data.phibaoduong);
    formData.append('nguoibaoduong', data.nguoibaoduong);

    const res = await axios.post(
      `https://management.ifee.edu.vn/api/xe/traXe/${data.id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/////////////////////  REGISTER PLANE DATA  ////////////////////

export const registerPlaneTicket = async data => {
  try {
    const res = await axios.post(
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

    return res.data;
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

/////////////////////  NEWS DATA  ////////////////////

export const getallNews = async dispatch => {
  dispatch(getNewStart());
  try {
    const res = await axios.get(`https://ifee.edu.vn/api/tintuc/danhsach`);

    dispatch(getNewSuccess(res.data));
    const data = [
      res.data.data[0],
      res.data.data[1],
      res.data.data[2],
      res.data.data[3],
      res.data.data[4],
    ];
    return data;
  } catch (error) {
    dispatch(getNewFailed(error));
  }
};

///////////////////// SEND NOTIFCATION ////////////////////
export const postToken = async id_ht => {
  try {
    const token = await getToken();
    if (token) {
      await axios.post(
        `https://forestry.ifee.edu.vn/api/device_token/${id_ht}?device_token=${token}`,
      );
    }

    console.log('OK Token', token);
  } catch (error) {
    console.log('Loi tocken', error);
  }
};

export const postNotifcation = async data => {
  try {
    const res = await axios.post(
      `https://forestry.ifee.edu.vn/api/notification/send`,
      data,
    );

    return res.data;
  } catch (error) {}
};

/////////////////////  SEND FEEDBACK  ////////////////////

export const sendFeedback = async data => {
  try {
    console.log(data);
    await axios.post(`https://forestry.ifee.edu.vn/api/contact`, data);
  } catch (error) {
    console.log(error);
  }
};

/////////////////////  DOCUMENT DATA  ////////////////////
export const getAllDocument = async dispatch => {
  dispatch(getDocumentStart());
  try {
    const res = await axios.get(`https://forestry.ifee.edu.vn/api/vanban`);

    dispatch(getDocumentSuccess(res.data));
  } catch (error) {
    dispatch(getDocumentFailed());
  }
};

/////////////////////  SPECIES LIST  ////////////////////
export const getListSpecies = async (data, dispatch) => {
  dispatch(getSpecieStart());
  try {
    const res = await axios.get(
      `http://vuonquocgiavietnam.ifee.edu.vn/api/dsLoai/${data.ma}`,
    );

    dispatch(getSpecieSuccess(res.data));
  } catch (error) {
    dispatch(getSpecieFailed());
  }
};

/////////////////////  BIRTHDAY LIST  ////////////////////
export const getBirthdayList = async () => {
  try {
    const res = await axios.get(`https://forestry.ifee.edu.vn/api/birthday`);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
