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

const timeToString = time => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const MyWorkScheduleScreen = () => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const myWorkData = useSelector(state => state.myWork.myWorkSchedule?.data);
  const dispatch = useDispatch();
  const dayOfWeek = getFirstDateOfWeek();
  const currentDate = formatDateToPost(new Date());
  const [items, setItems] = useState({});

  const fetchMyWorkSchedule = () => {
    getMyWorkSchedule(user?.id, dispatch);
  };

  useLayoutEffect(() => {
    fetchMyWorkSchedule();
  }, []);

  const loadItems = day => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!items[strTime]) {
          items[strTime] = [];
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150)),
            });
          }
        }
      }
      const newItems = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
  };

  const renderItem = item => {
    return (
      <TouchableOpacity style={{marginRight: 10, marginTop: 17}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Agenda
        items={items}
        // selected={currentDate}
        // minDate={dayOfWeek.firstDay}
        // maxDate={dayOfWeek.lastDay}
        theme={{}}
        loadItemsForMonth={loadItems}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default MyWorkScheduleScreen;
