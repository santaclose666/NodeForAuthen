import React from 'react';
import axios from 'axios';
import {Toast, Box, Text} from 'native-base';
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
      Toast.show({
        render: () => {
          return (
            <Box bg="danger.500" px="2" py="1" rounded="sm" mb={6}>
              <Text fontSize={17} color="white">
                Thông tin đăng nhập chưa chính xác!
              </Text>
            </Box>
          );
        },
      });
    } else {
      getAllStaffs(dispatch);
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
