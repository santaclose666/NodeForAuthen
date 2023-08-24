import React, {
  useRef,
  useState,
  useCallback,
  memo,
  useLayoutEffect,
  useMemo,
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
  getMyWorkSchedule,
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

const MyWorkScheduleScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const myWorkData = useSelector(state => state.myWork.myWorkSchedule?.data);
  const avt = user?.tendonvi === 'XMG' ? defaultXMG : defaultIFEE;
  const dispatch = useDispatch();
  const dayOfWeek = getFirstDateOfWeek();
  const currentDate = formatDateToPost(new Date());
  const [items, setItems] = useState(null);

  const loadTask = useCallback(() => {
    const timestampCurr = moment(dayOfWeek.firstDay).valueOf();
    const tasks = {};
    let count = 0;
    myWorkData?.forEach(item => {
      const time = timestampCurr + 25200000 + count * 24 * 60 * 60 * 1000;
      count++;
      const strTime = timeToString(time);

      tasks[strTime] = [];
      tasks[strTime].push({
        id: item.id,
        time: item.thoigian,
        location: item.diadiem,
        content: item.noidung,
        clue: item.daumoi,
        component: item.thanhphan,
        startDay: item.tungay,
        endDay: item.denngay,
      });
    });
    setItems(tasks);
  }, []);

  const fetchMyWorkSchedule = () => {
    getMyWorkSchedule(user?.id, dispatch);
  };

  useLayoutEffect(() => {
    fetchMyWorkSchedule();

    loadTask();
  }, []);

  const RenderTaskOfDay = item => {
    return (
      <TouchableOpacity style={styles.containerEachItem}>
        <Text style={{fontFamily: Fonts.SF_MEDIUM, fontSize: 16}}>
          {item.content}
        </Text>
        <Image
          src={mainURL + avt}
          style={{height: 40, width: 40, borderRadius: 50}}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header title={'Lịch trong tuần'} navigation={navigation} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Dimension.setWidth(4),
    paddingVertical: Dimension.setHeight(2),
    backgroundColor: '#ffffff',
    marginBottom: Dimension.setHeight(1),
    marginTop: Dimension.setHeight(1.3),
    borderRadius: 12,
    elevation: 5,
    ...shadowIOS,
    width: Dimension.setWidth(80),
  },
});

export default MyWorkScheduleScreen;
