import axios from 'axios';
import {
  loginStart,
  loginSuccess,
  loginFailed,
  logoutSuccess,
} from './authSlice';
import {getStaffStart, getStaffSuccess, getStaffFailed} from './staffSlice';
import {getNotifiStart, getNotifiSuccess} from './notifiSlice';
import {CommonActions} from '@react-navigation/native';
import {changeFormatDate, getCoords} from '../utils/serviceFunction';
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
import {getNewMvFailed, getNewMvStart, getNewMvSuccess} from './newsMvSlice';
import {
  getDocumentMvFaild,
  getDocumentMvStart,
  getDocumentMvSuccess,
} from './documentMvSlice';
import {documentMvURL} from '../contants/Variable';
import {
  subcribeWorkUnitTopic,
  unSubcribeWorkUnitTopic,
} from '../utils/AllTopic';
import {
  getRegisterOfficeFailed,
  getRegisterOfficeStart,
  getRegisterOfficeSuccess,
} from './officeItemSlice';
import {getDeviceFailed, getDeviceStart, getDeviceSuccess} from './deviceSlice';
import {
  getNationalParkFailed,
  getNationalParkStart,
  getNationalParkSuccess,
} from './nationalPark';
import {getSubjectSuccess} from './subjectSlice';
import {
  getListRepairStart,
  getListRepairSuccess,
  getListRepairFailed,
} from './repairSlice';
import config from '../../config';

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

    const data = res.data;
    dispatch(loginSuccess(data));
    console.log(data);

    if (data === 0) {
      const mess = 'Thông tin đăng nhập chưa chính xác!';
      ToastWarning(mess);
    } else {
      navigation.dispatch(resetAction);
      navigation.navigate('BottomTab');

      subcribeWorkUnitTopic(data.tendonvi);

      postToken(data.id_ht);

      if (data.tendonvi == 'IFEE' || data.tendonvi == 'XMG') {
        getAllStaffs(dispatch);
        getSubject(dispatch);
      }

      if (save) {
        dispatch(saveSuccess(user));
      } else {
        dispatch(saveSuccess(null));
      }

      return true;
    }
  } catch (err) {
    console.log(err);
    dispatch(loginFailed());
  }
};

export const logoutUser = async (dispatch, navigation, user) => {
  try {
    const token = await getToken();
    await axios.post(`https://forestry.ifee.edu.vn/api/logout`, {
      token: token,
    });

    unSubcribeWorkUnitTopic(user.tendonvi);
    dispatch(logoutSuccess());

    navigation.dispatch(resetAction);
    navigation.navigate('BottomTab');
  } catch (error) {
    console.log(error);
  }
};

/////////////////////  SUBJECT DATA  ////////////////////
export const getSubject = async dispatch => {
  try {
    const res = await axios.get('https://management.ifee.edu.vn/api/bomon/all');

    dispatch(getSubjectSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
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

/////////////////////  WEATHERS DATA  ////////////////////
export const getWeatherData = async dispatch => {
  const apiKey = config.WEATHER_TOKEN;
  dispatch(getWeatherStart());
  try {
    const coords = await getCoords();

    console.log(coords);

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
    const apiIFEE = `https://management.ifee.edu.vn/api/nghiphep/reg/${data.id_user}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/nghiphep/reg/${data.id_user}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.post(api, {
      tungay: data.tungay,
      tong: data.tong,
      lydo: data.lydo,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllOnLeaveData = async (id, dispatch, tendonvi) => {
  dispatch(getOnLeaveStart());
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/nghiphep/danhsach/${id}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/nghiphep/danhsach/${id}`;
    const api = tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    console.log(api);

    const res = await axios.get(api);

    dispatch(getOnLeaveSuccess(res.data));
  } catch (error) {
    dispatch(getOnLeaveFailed());
  }
};

export const resolveLeaveRequest = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/nghiphep/duyet/${data.id_nghiphep}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/nghiphep/duyet/${data.id_nghiphep}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.post(api, {
      id_user: data.id_user,
      nhanxet: data.nhanxet,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const rejectLeaveRequest = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/nghiphep/tuchoi/${data.id_nghiphep}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/nghiphep/tuchoi/${data.id_nghiphep}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.post(api, {id_user: data.id_user, lydo: data.lydo});

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const adjustOnLeave = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/nghiphep/ycdieuchinh/${data.id_nghiphep}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/nghiphep/ycdieuchinh/${data.id_nghiphep}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.post(api, {ngay_dc: data.ngay_dc});
  } catch (error) {
    console.log(error);
  }
};

export const approveAdjustOnLeave = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/nghiphep/duyetdc/${data.id_nghiphep}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/nghiphep/duyetdc/${data.id_nghiphep}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.get(api);
  } catch (error) {
    console.log(error);
  }
};

export const cancelAdjustOnLeave = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/nghiphep/tuchoidc/${data.id_nghiphep}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/nghiphep/tuchoidc/${data.id_nghiphep}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.post(api, {
      lydo: data.lydo,
    });
  } catch (error) {
    console.log(error);
  }
};

/////////////////////  WORK SCHEDULE DATA  ////////////////////
export const getAllWorkName = async (dispatch, data) => {
  dispatch(getWorkStart());
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/lichcongtac/reg`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/lichcongtac/reg`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.get(api);

    const result = res.data.sort((a, b) => {
      return b.id - a.id;
    });

    dispatch(getWorkSuccess(result));
  } catch (error) {
    dispatch(getWorkFailed());
  }
};

export const registerWorkSchedule = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/lichcongtac/reg`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/lichcongtac/reg`;
    const {tendonvi, ...params} = data;
    const api = tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.post(api, {
      ...params,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllWorkSchedule = async (dispatch, user) => {
  dispatch(getWorkScheduleStart());
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/lichcongtac/danhsach`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/lichcongtac/danhsach`;
    const api = user.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.get(api, {
      params: {
        id_user: user.id,
      },
    });

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
    const apiIFEE = `https://management.ifee.edu.vn/api/lichcongtac/dongy/${data.id_lichcongtac}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/lichcongtac/dongy/${data.id_lichcongtac}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.post(api, {
      nhanxet: data.nhanxet,
    });
  } catch (error) {
    console.log(error);
  }
};

export const cancelWorkSchedule = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/lichcongtac/tuchoi/${data.id_lichcongtac}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/lichcongtac/tuchoi/${data.id_lichcongtac}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.post(api, {
      lydo: data.lydo,
    });
  } catch (error) {
    console.log(error);
  }
};

export const totalWorkSchedule = async (dispatch, data) => {
  dispatch(getTotalWorkStart());
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/lichcongtac/tonghop`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/lichcongtac/tonghop`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.get(api);

    dispatch(getTotalWorkSuccess(res.data));

    return data;
  } catch (error) {
    dispatch(getTotalWorkFailed());
  }
};

export const warningWorkSchedule = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/lichcongtac/canhbao/${data.id_lichchitiet}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/lichcongtac/canhbao/${data.id_lichchitiet}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.post(api, {
      lydo: data.lydo,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const requestFinishWorkSchedule = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/lichcongtac/yc_ketthuc/${data.id_lichcongtac}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/lichcongtac/yc_ketthuc/${data.id_lichcongtac}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.post(api, {
      ngayve: data.ngayve,
      giove: data.giove,
    });
  } catch (error) {
    console.log(error);
  }
};

export const approveFinishRequest = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/lichcongtac/pd_ketthuc/${data.id_lichcongtac}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/lichcongtac/pd_ketthuc/${data.id_lichcongtac}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.post(api, {
      nhanxet: data.nhanxet,
    });
  } catch (error) {
    console.log(error);
  }
};

export const cancelFinishRequest = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/lichcongtac/tc_ketthuc/${data.id_lichcongtac}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/lichcongtac/tc_ketthuc/${data.id_lichcongtac}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.post(api, {
      lydo: data.lydo,
    });
  } catch (error) {
    console.log(error);
  }
};

/////////////////////  VEHICLE SCHEDULE DATA  ////////////////////

export const getVehicleData = async (dispatch, data) => {
  dispatch(getVehicleStart());
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/xe/danhsach/${data.id}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/xe/danhsach/${data.id}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.get(api);

    dispatch(getVehicleSuccess(res.data));

    return true;
  } catch (error) {
    dispatch(getVehicleFailed());
  }
};

export const registerVehicle = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/xe/reg/${data.id_user}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/xe/reg/${data.id_user}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.post(api, {
      loaixe: data.loaixe,
      ngaydi: data.ngaydi,
      noiden: data.noiden,
      noidung: data.noidung,
      gionhan: data.gionhan,
      ngaynhan: data.ngaynhan,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const approveVehicle = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/xe/pheduyet/${data.id_dulieu}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/xe/pheduyet/${data.id_dulieu}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.get(api, {
      params: {
        id_user: data.id_user,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const cancelVehicle = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/xe/tuchoi/${data.id_dulieu}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/xe/tuchoi/${data.id_dulieu}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.get(api, {
      params: {
        id_user: data.id_user,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const returnVehicle = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/xe/traXe/${data.id}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/xe/traXe/${data.id}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const formData = new FormData();

    formData.append('file', data.file);
    formData.append('ngayve', data.ngayve);
    formData.append('km_nhan', data.km_nhan);
    formData.append('phixangxe', data.phixangxe);
    formData.append('nguoimuaxang', data.nguoimuaxang);
    formData.append('phibaoduong', data.phibaoduong);
    formData.append('nguoibaoduong', data.nguoibaoduong);

    const res = await axios.post(api, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/////////////////////  REGISTER PLANE DATA  ////////////////////

export const registerPlaneTicket = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/vemaybay/reg/${data.id_user}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/vemaybay/reg/${data.id_user}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.post(api, {
      ds_ns: data.ds_ns,
      ngoaivien: data.ngoaivien,
      chuongtrinh: data.chuongtrinh,
      hangbay: data.hangbay,
      sanbaydi: data.sanbaydi,
      sanbayden: data.sanbayden,
      ngaydi: data.ngaydi,
      hangve: data.hangve,
      kygui: data.kygui,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllPlaneData = async (dispatch, data) => {
  dispatch(getTicketPlaneStart());
  console.log(data);
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/vemaybay/danhsach`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/vemaybay/danhsach`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.get(api);

    dispatch(getTicketPlaneSuccess(res.data));
  } catch (error) {
    console.log(error);
    dispatch(getTicketPlaneFailed());
  }
};

export const approvePlaneTicket = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/vemaybay/pheduyet/${data.id_dulieu}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/vemaybay/pheduyet/${data.id_dulieu}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.post(api, {
      noidung: data.noidung,
    });
  } catch (error) {
    console.log(error);
  }
};

export const cancelPlaneTicket = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/vemaybay/tuchoi/${data.id_dulieu}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/vemaybay/tuchoi/${data.id_dulieu}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.post(api, {
      noidung: data.noidung,
    });
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

export const getAllNewsMV = async dispatch => {
  dispatch(getNewMvStart());
  try {
    const res = await axios.get(`https://muavutrongrung.ifee.edu.vn/api/cddh`);

    const data = res.data.map(item => {
      return {
        id: item.id,
        title: item.tieude,
        content: item.noidung,
        avatar: item.hinhanh,
        date_created: changeFormatDate(item.ngaydang),
        files: item.files[0],
      };
    });

    console.log(data);

    dispatch(getNewMvSuccess(data));
  } catch (error) {
    dispatch(getNewMvFailed());
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

export const postNotifiForAll = async data => {
  try {
    const res = await axios.post(
      `https://forestry.ifee.edu.vn/api/service/postEvent?title=${data.title}&content=${data.content}`,
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const postNotifiForAllUnit = async data => {
  try {
    console.log(data);
    const res = await axios.post(
      `https://forestry.ifee.edu.vn/api/service/postNoiBo?title=${data.title}&content=${data.content}&id_user=${data.id}`,
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllNotifi = async (id, dispatch) => {
  dispatch(getNotifiStart());
  try {
    const res = await axios.get(
      `https://forestry.ifee.edu.vn/api/thongbao/${id}`,
    );

    dispatch(getNotifiSuccess(res.data));
    console.log(res.data);
  } catch (error) {
    dispatch(getOnLeaveFailed());
  }
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

/////////////////////  BIO DATA  ////////////////////

export const getAllManageData = async dispatch => {
  dispatch(getNationalParkStart());
  try {
    const res = await axios.get(
      'https://forestry.ifee.edu.vn/api/service/getNationalPark',
    );

    dispatch(getNationalParkSuccess(res.data));
  } catch (error) {
    dispatch(getNationalParkFailed());
  }
};

export const getAllEcosystem = async api => {
  try {
    const res = await axios.get(api);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/////////////////////  DOCUMENT DATA  ////////////////////

export const getDocument = async (dispatch, name) => {
  dispatch(getDocumentStart());
  try {
    const res = await axios.get(
      `https://forestry.ifee.edu.vn/api/vanban/${name}`,
    );

    const filterCategory = data => {
      let categoryFilter = ['Tất cả'];
      data.forEach(item => {
        if (!categoryFilter.includes(item.loaivanban)) {
          categoryFilter.push(item.loaivanban);
        }
      });

      return categoryFilter.filter(item => item != 'Khác');
    };
    const filterYear = data => {
      let year = [];

      if (name === 'ifee') {
        data.forEach(item => {
          if (filterYear && !year.includes(item?.nam)) {
            year.push(item?.nam);
          }
        });
      } else {
        data.forEach(item => {
          let filterYear = parseInt(item?.nam?.split('-')[2]);
          if (filterYear && !year.includes(filterYear)) {
            year.push(filterYear);
          }
        });
      }

      return year.sort((a, b) => {
        return b - a;
      });
    };
    const filterHieuLuc = data => {
      let hieuluc = [];

      data.forEach(item => {
        if (!hieuluc.includes(item.hieuluc)) {
          if (item.hieuluc != null) {
            hieuluc.push(item.hieuluc);
          }
        }
      });

      return hieuluc;
    };
    const filterUnit = data => {
      let unit = [];

      data.forEach(item => {
        if (!unit.includes(item.donvi)) {
          if (item.donvi != null) {
            unit.push(item.donvi);
          }
        }
      });

      return unit;
    };

    const allData = {
      [name]: {
        category: filterCategory(res.data),
        year: filterYear(res.data),
        hieuluc: filterHieuLuc(res.data),
        unit: filterUnit(res.data),
        data: res.data,
      },
    };

    dispatch(getDocumentSuccess(allData));
  } catch (error) {
    console.log(error);
  }
};

export const getAllDocumentMv = async dispatch => {
  dispatch(getDocumentMvStart());
  try {
    const res = await axios.get(`https://muavutrongrung.ifee.edu.vn/api/tckt`);

    const data = res.data.map(item => {
      return {
        ...item,
        path: documentMvURL + item.path,
      };
    });

    dispatch(getDocumentMvSuccess(data));
  } catch (error) {
    dispatch(getDocumentMvFaild());
  }
};

export const sendRequestUseDocument = async data => {
  try {
    console.log(data);

    await axios.post(
      `https://forestry.ifee.edu.vn/api/document/reg?id_vanban=${data.id_vanban}&hoten=${data.hoten}&sdt=${data.sdt}&donvi=${data.donvi}&mucdich_sd=${data.mucdich_sd}&email=${data.email}`,
    );
  } catch (error) {
    console.log(error);
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

/////////////////////  DEVICES LIST  ////////////////////
export const getAllDevices = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/thietbi/danhsach`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/thietbi/danhsach`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.get(api);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const registerDevice = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/thietbi/regTB/${data.id_user}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/thietbi/regTB/${data.id_user}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.post(api, {
      thietbi: data.thietbi,
      ngaymuon: data.ngaymuon,
      ngaytra: data.ngaytra,
      noidung: data.noidung,
      active: data.active,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllListDevice = async (dispatch, data, isAdmin) => {
  dispatch(getDeviceStart());
  try {
    const adminIFEE = `https://management.ifee.edu.vn/api/thietbi/pheduyet/list`;
    const adminXMG = `https://management.xuanmaijsc.vn/api/thietbi/pheduyet/list`;
    const adminApi = data.tendonvi === 'IFEE' ? adminIFEE : adminXMG;

    const userIFEE = `https://management.ifee.edu.vn/api/thietbi/historyTB/${data.id_user}`;
    const userXMG = `https://management.xuanmaijsc.vn/api/thietbi/historyTB/${data.id_user}`;
    const userApi = data.tendonvi === 'IFEE' ? userIFEE : userXMG;

    const apiResult = isAdmin ? adminApi : userApi;

    const res = await axios.get(apiResult);

    const allData = {
      pending: isAdmin ? res.data.data : res.data.choduyet,
      approved: isAdmin ? res.data.data_dapheduyet : res.data.lichsu,
    };

    dispatch(getDeviceSuccess(allData));

    return true;
  } catch (error) {
    dispatch(getDeviceFailed());
  }
};

export const approveRegisterDevice = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/thietbi/pheduyet/duyet/${data.id_user}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/thietbi/pheduyet/duyet/${data.id_user}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.get(api);
  } catch (error) {
    console.log(error);
  }
};

export const cancelRegisterDevice = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/thietbi/pheduyet/xoa/${data.id_user}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/thietbi/pheduyet/xoa/${data.id_user}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.get(api);
  } catch (error) {
    console.log(error);
  }
};

export const returnDevice = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/thietbi/traTB/tra/${data.id_user}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/thietbi/traTB/tra/${data.id_user}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.post(api, {
      id_thietbi: data.id_thietbi,
      ngaytra_thucte: data.ngaytra_thucte,
      tinhtrangTB: data.tinhtrangTB,
      nguyennhan: data.nguyennhan,
    });

    return true;
  } catch (error) {
    console.log(error);
  }
};

/////////////////////  OFFICE ITEM LIST  ////////////////////
export const getAllOfficeItem = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/vpp/list`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/vpp/list`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.get(api);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const registerOfficeItem = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/vpp/reg`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/vpp/reg`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.post(api, {
      id_user: data.id_user,
      loaivpp: data.loaivpp,
      soluong: data.soluong,
      ngaynhan: data.ngaynhan,
      gionhan: data.gionhan,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllListOfficeItem = async (dispatch, data) => {
  dispatch(getRegisterOfficeStart());
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/vpp/pheduyet/danhsach`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/vpp/pheduyet/danhsach`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.get(api);

    dispatch(getRegisterOfficeSuccess(res.data));
  } catch (error) {
    dispatch(getRegisterOfficeFailed());
  }
};

export const approveRegisterOfficeItem = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/vpp/pheduyet/duyet/${data.id_user}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/vpp/pheduyet/duyet/${data.id_user}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.get(api);
  } catch (error) {
    console.log(error);
  }
};

export const cancelRegisterOfficeItem = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/vpp/pheduyet/xoa/${data.id_user}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/vpp/pheduyet/xoa/${data.id_user}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.get(api);
  } catch (error) {
    console.log(error);
  }
};

/////////////////////  REPAIR  ////////////////////
export const getRepairList = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/suachua/danhmuc`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/suachua/danhmuc`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    const res = await axios.get(api);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const registerRepair = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/suachua/regSC/${data.id_user}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/suachua/regSC/${data.id_user}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.post(api, {
      id_phong: data.id_phong,
      hoten: data.hoten,
      arr_thietbi: data.arr_thietbi,
      arr_tinhtrang: data.arr_tinhtrang,
    });

    return true;
  } catch (error) {
    console.log(error);
  }
};

export const getRepairApproveList = async (dispatch, data) => {
  dispatch(getListRepairStart());
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/suachua/pheduyet/danhsach`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/suachua/pheduyet/danhsach`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    console.log(api);

    const res = await axios.get(api);

    dispatch(getListRepairSuccess(res.data));
    return true;
  } catch (error) {
    dispatch(getListRepairFailed());
  }
};

export const approveRepair = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/suachua/pheduyet/duyet/${data.id_user}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/suachua/pheduyet/duyet/${data.id_user}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.get(api, {
      params: {
        id_manager: data.id_manager,
        tg_dukien: data.tg_dukien,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const cancelRepair = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/suachua/pheduyet/tuchoi/${data.id_user}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/suachua/pheduyet/tuchoi/${data.id_user}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.get(api);
  } catch (error) {
    console.log(error);
  }
};

export const getNotProcessedYetList = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/suachua/chuaxuly/danhsach`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/suachua/chuaxuly/danhsach`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;
    console.log(api);

    const res = await axios.get(api);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getProcessedList = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/suachua/daxuly/danhsach`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/suachua/daxuly/danhsach`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;
    console.log(api);

    const res = await axios.get(api);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateProcessed = async data => {
  try {
    const apiIFEE = `https://management.ifee.edu.vn/api/suachua/update_xuly/${data.id}`;
    const apiXMG = `https://management.xuanmaijsc.vn/api/suachua/update_xuly/${data.id}`;
    const api = data.tendonvi === 'IFEE' ? apiIFEE : apiXMG;

    await axios.get(api);

    return true;
  } catch (error) {
    console.log(error);
  }
};

/////////////////////  CUC LAM NGHIEP  ////////////////////
const headers = {
  apiKey: config.CUC_LAM_NGHIEP_TOKEN,
  'Content-Type': 'application/json',
};

export const getCategoryForestry = async () => {
  try {
    const res = await axios.get(
      `https://api.cuclamnghiep.gov.vn/news/1.0/news/categories/`,
      {
        headers: headers,
      },
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getNewsList = async id_category => {
  try {
    const res = await axios.get(
      `https://api.cuclamnghiep.gov.vn/news/1.0/news/categories/${id_category}`,
      {
        headers: headers,
      },
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getDetailNew = async id_tintuc => {
  try {
    const res = await axios.get(
      `https://api.cuclamnghiep.gov.vn/news/1.0/news/detail/${id_tintuc}`,
      {
        headers: headers,
      },
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
