import React, {
  useRef,
  useState,
  useCallback,
  memo,
  useLayoutEffect,
  useMemo,
  useEffect,
} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Dimension from '../../contants/Dimension';
import Header from '../../components/Header';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Separation from '../../components/Separation';
import Colors from '../../contants/Colors';
import {shadowIOS} from '../../contants/propsIOS';
import {
  approveWorkSchedule,
  cancelWorkSchedule,
  getAllWorkSchedule,
} from '../../redux/apiRequest';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import FilterStatusUI from '../../components/FilterStatusUI';
import {
  changeFormatDate,
  formatDateToPost,
  getFirstDateOfWeek,
} from '../../utils/serviceFunction';
import StatusUI from '../../components/StatusUI';
import {defaultIFEE, defaultXMG, mainURL} from '../../contants/Variable';
import {ApproveCancelModal} from '../../components/Modal';
import {ToastWarning} from '../../components/Toast';
import StaggerUI from '../../components/StaggerUI';
import {Agenda} from 'react-native-calendars';
import moment from 'moment';

const AllWorkScheduleScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const totalWorkData = useSelector(
    state => state.totalWork.totalWorkSchedule?.data,
  );
  const avt = user?.tendonvi === 'XMG' ? defaultXMG : defaultIFEE;
  const dayOfWeek = getFirstDateOfWeek();
  const currentDate = formatDateToPost(new Date());

  const RenderTaskOfDay = item => {
    return (
      <TouchableOpacity style={styles.containerEachItem}>
        <View style={styles.containerEachLine}>
          <Text style={styles.title}>Họ tên: </Text>
          <Text style={styles.content}>{item.name}</Text>
        </View>
        <View style={[styles.containerEachLine, {flexDirection: 'column'}]}>
          <Text style={styles.title}>Nội dung: </Text>
          <Text style={styles.content}>{item.content}</Text>
        </View>
        <View style={styles.containerEachLine}>
          <Text style={styles.title}>Thời gian: </Text>
          <Text style={styles.content}>{item.time?.slice(0, 5)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header title={'Tổng hợp lịch công tác'} navigation={navigation} />
      <Agenda
        items={totalWorkData}
        selected={currentDate}
        minDate={dayOfWeek.firstDay}
        maxDate={dayOfWeek.lastDay}
        theme={{}}
        renderItem={RenderTaskOfDay}
      />
    </SafeAreaView>
  );
};

styles = StyleSheet.create({
  containerEachItem: {
    paddingHorizontal: Dimension.setWidth(4),
    paddingVertical: Dimension.setHeight(2),
    backgroundColor: '#f2f2f2',
    marginBottom: Dimension.setHeight(1),
    marginTop: Dimension.setHeight(1.3),
    borderRadius: 12,
    elevation: 5,
    ...shadowIOS,
    width: Dimension.setWidth(80),
  },

  containerEachLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  title: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: 16,
  },

  content: {
    fontFamily: Fonts.SF_REGULAR,
    fontSize: 16,
  },
});

export default AllWorkScheduleScreen;
