import React, {useState, useCallback, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Dimension from '../../contants/Dimension';
import Header from '../../components/Header';
import Colors from '../../contants/Colors';
import {shadowIOS} from '../../contants/propsIOS';
import {
  approveWorkSchedule,
  cancelWorkSchedule,
  getAllWorkSchedule,
  warningWorkSchedule,
} from '../../redux/apiRequest';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import FilterStatusUI from '../../components/FilterStatusUI';
import {
  changeFormatDate,
  formatDateToPost,
  getFirstDateOfWeek,
} from '../../utils/serviceFunction';
import {defaultIFEE, mainURL} from '../../contants/Variable';
import {WarningModal} from '../../components/Modal';
import {Agenda} from 'react-native-calendars';

const AllWorkScheduleScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const totalWorkData = useSelector(
    state => state.totalWork.totalWorkSchedule?.data,
  );
  const dayOfWeek = getFirstDateOfWeek();
  const currentDate = formatDateToPost(new Date());
  const IFEEstaffs = useSelector(state => state.staffs?.staffs?.IFEEStaff);
  const [toggleWarningModal, setToggleWarningModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reasonInput, setReasonInput] = useState('');

  const handlePickItem = useCallback(item => {
    setSelectedItem(item);
    setToggleWarningModal(true);
  }, []);

  const handleWarning = useCallback((id, reason) => {
    const data = {
      id_lichchitiet: id,
      lydo: reason,
    };

    warningWorkSchedule(data);
    setToggleWarningModal(false);
  }, []);

  const RenderTaskOfDay = useCallback((day, item) => {
    const borderColorStatus =
      item.ct == 1
        ? '#f0b263'
        : item.content === 'Nghỉ phép'
        ? '#f25157'
        : '#57b85d';

    const filterUser = IFEEstaffs.filter(staff => staff.id == item.id_user)[0];
    const bgColor = item.warning === 0 ? '#f2f2f2' : 'rgba(249, 223, 224, 1)';

    const checkRole = () => {
      return (
        item.warning == 0 &&
        (user?.vitri_ifee == 1 ||
          (user?.vitri_ifee == 3 &&
            filterUser?.vitri_ifee > 3 &&
            user?.tenphong == filterUser?.tenphong))
      );
    };

    return (
      <View
        key={item.id}
        style={[
          styles.containerEachItem,
          {
            borderTopColor: borderColorStatus,
            backgroundColor: bgColor,
          },
        ]}>
        <View style={styles.containerEachLine}>
          <Text style={styles.title}>Họ tên: </Text>
          <Text style={styles.content}>{item.name}</Text>
        </View>
        <View style={styles.containerEachLine}>
          <Text style={styles.title}>Địa điểm: </Text>
          <Text style={styles.content}>{item.location}</Text>
        </View>
        <View style={styles.containerEachLine}>
          <Text style={styles.title}>
            Nội dung:{' '}
            <Text numberOfLines={2} style={styles.content}>
              {item.content}
            </Text>
          </Text>
        </View>
        <View style={styles.containerEachLine}>
          <Text style={styles.title}>Thời gian: </Text>
          <Text style={styles.content}>
            {item.time ? item.time?.slice(0, 5) : 'Không xác định'}
          </Text>
        </View>
        {checkRole() && (
          <TouchableOpacity
            onPress={() => {
              const data = {
                ...item,
                path: filterUser?.path,
              };
              handlePickItem(data);
            }}
            style={{
              position: 'absolute',
              top: Dimension.setHeight(0.8),
              right: Dimension.setWidth(2.2),
            }}>
            <Image source={Images.warning} style={styles.iconic} />
          </TouchableOpacity>
        )}
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header title={'Tổng hợp lịch công tác'} navigation={navigation} />
      <Agenda
        items={totalWorkData}
        selected={currentDate}
        minDate={dayOfWeek.firstDay}
        maxDate={dayOfWeek.lastDay}
        theme={{}}
        refreshing={true}
        renderDay={RenderTaskOfDay}
        rowHasChanged={(r1, r2) => {
          return r1.id !== r2.id;
        }}
        showClosingKnob={true}
        pastScrollRange={1}
        futureScrollRange={1}
        showOnlySelectedDayItems={true}
      />

      <WarningModal
        toggleModal={toggleWarningModal}
        setToggleModal={setToggleWarningModal}
        item={selectedItem}
        reasonInput={reasonInput}
        setReasonInput={setReasonInput}
        handleWarning={handleWarning}
      />
    </SafeAreaView>
  );
};

styles = StyleSheet.create({
  containerEachItem: {
    paddingHorizontal: Dimension.setWidth(4),
    paddingVertical: Dimension.setHeight(2),
    marginVertical: Dimension.setHeight(1.3),
    marginHorizontal: Dimension.setWidth(5),
    borderRadius: 12,
    elevation: 5,
    ...shadowIOS,
    width: Dimension.setWidth(90),
    borderTopWidth: 7,
    alignSelf: 'center',
  },

  containerEachLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  iconic: {
    width: 30,
    height: 30,
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
