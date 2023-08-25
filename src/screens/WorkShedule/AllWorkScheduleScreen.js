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

const timeToString = time => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const AllWorkScheduleScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const totalWorkData = [
    useSelector(state => state.totalWork.totalWorkSchedule?.t2),
    useSelector(state => state.totalWork.totalWorkSchedule?.t3),
    useSelector(state => state.totalWork.totalWorkSchedule?.t4),
    useSelector(state => state.totalWork.totalWorkSchedule?.t5),
    useSelector(state => state.totalWork.totalWorkSchedule?.t6),
    useSelector(state => state.totalWork.totalWorkSchedule?.t7),
    useSelector(state => state.totalWork.totalWorkSchedule?.cn),
  ];
  const avt = user?.tendonvi === 'XMG' ? defaultXMG : defaultIFEE;
  const dayOfWeek = getFirstDateOfWeek();
  const currentDate = formatDateToPost(new Date());
  const [items, setItems] = useState(null);

  const loadTask = useCallback(() => {
    const timestampCurr = moment(dayOfWeek.firstDay).valueOf();
    const tasks = {};
    totalWorkData?.forEach((item, index) => {
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
    setItems(tasks);
  }, []);

  useEffect(() => {
    loadTask();
  }, []);

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
          <Text style={styles.content}>{item.time?.splice(6, 2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header title={'Tổng hợp lịch công tác'} navigation={navigation} />
      <Agenda
        items={items}
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
