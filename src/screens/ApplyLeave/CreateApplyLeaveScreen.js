import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import {useSelector} from 'react-redux';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import Header from '../../components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dropdown} from 'react-native-element-dropdown';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ToastAlert, ToastSuccess} from '../../components/Toast';

const numberOfDayOff = [
  {label: 'Buổi sáng', value: 'Buổi sáng'},
  {label: 'Buổi chiều', value: 'Buổi chiều'},
  {label: '1 ngày', value: '1 ngày'},
  {label: 'Nhiều ngày', value: 'Nhiều ngày'},
];

const offType = [
  {label: 'Nghỉ phép ốm', value: 'Nghỉ phép ốm'},
  {label: 'Nghỉ phép chế độ', value: 'Nghỉ phép chế độ'},
  {label: 'Nghỉ phép năm', value: 'Nghỉ phép năm'},
  {label: 'Nghỉ phép cưới', value: 'Nghỉ phép cưới'},
];

const CreateApplyLeaveScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const [valueNumberOfDay, setValueNumberOfDay] = useState(null);
  const [valueOffType, setValueOffType] = useState(null);
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [checkPick, setCheckPick] = useState(null);
  const [startDay, setStartDay] = useState(moment(date).format('DD-MM-YYYY'));
  const [endDay, setEndDay] = useState(null);
  const [inputDecription, setInputDecription] = useState('');

  const checkStartDate = datePicker => {
    const currentDate = moment(new Date()).startOf('day');
    const endDate =
      endDay !== null
        ? moment(endDay, 'DD-MM-YYYY').startOf('day')
        : moment(datePicker).startOf('day');

    const formateStartDate = moment(datePicker).startOf('day');
    if (formateStartDate < currentDate || formateStartDate > endDate) {
      const message = 'Ngày bắt đầu không hợp lệ!';
      ToastAlert(message);
    } else {
      const StartDate = moment(datePicker).format('DD-MM-YYYY');

      setStartDay(StartDate);
    }
  };

  const checkEndDate = datePicker => {
    const formatStartDate = moment(startDay, 'DD-MM-YYYY').startOf('day');
    const formatEndDate = moment(datePicker, 'DD-MM-YYYY').startOf('day');

    if (formatStartDate < formatEndDate) {
      const EndDate = moment(datePicker).format('DD-MM-YYYY');

      setEndDay(EndDate);
    } else {
      const message = 'Ngày kết thúc không hợp lệ!';
      ToastAlert(message);
    }
  };

  const handlePickDate = (event, selectedDate) => {
    if (event.type === 'set') {
      setToggleDatePicker(false);
      setDate(selectedDate);
      if (checkPick) {
        checkStartDate(selectedDate);
      } else {
        checkEndDate(selectedDate);
      }
    } else {
      setToggleDatePicker(false);
    }
  };

  const handleRegister = () => {
    if (
      valueNumberOfDay === null ||
      valueOffType === null ||
      inputDecription === ''
    ) {
      const message = 'Thiếu thông tin!';
      ToastAlert(message);
    } else {
      const message = 'Đăng kí thành công';
      ToastSuccess(message);

      const data = {
        reason: inputDecription,
        type: valueOffType,
        leaveFrom: startDay,
        leaveTo: endDay,
        valueNumberOfDay,
      };
      setTimeout(() => {
        navigation.navigate('HistoryApplyLeave', {data});
      }, 1111);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Đăng kí nghỉ phép" navigation={navigation} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          backgroundColor: '#fbfbfd',
          borderRadius: 12,
          marginHorizontal: Dimension.setWidth(3),
          marginVertical: Dimension.setHeight(3),
          paddingHorizontal: Dimension.setWidth(4),
          paddingTop: Dimension.setHeight(3),
          elevation: 5,
        }}>
        <View style={styles.containerEachLine}>
          <Text style={styles.title}>Người đăng kí</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={Images.avatar} style={{height: 40, width: 40}} />
            <Text
              style={{
                marginLeft: Dimension.setWidth(3),
                fontSize: 19,
                fontFamily: Fonts.SF_SEMIBOLD,
              }}>
              {user?.name}
            </Text>
          </View>
        </View>
        <View style={styles.containerEachLine}>
          <Text style={styles.title}>Loại nghỉ phép</Text>
          <Dropdown
            style={styles.dropdown}
            autoScroll={false}
            showsVerticalScrollIndicator={false}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={styles.containerOptionStyle}
            iconStyle={styles.iconStyle}
            itemContainerStyle={styles.itemContainer}
            itemTextStyle={styles.itemText}
            fontFamily={Fonts.SF_MEDIUM}
            activeColor="#eef2feff"
            data={offType}
            maxHeight={Dimension.setHeight(23)}
            labelField="label"
            valueField="value"
            placeholder="Chọn loại nghỉ phép"
            value={valueOffType}
            onChange={item => {
              setValueOffType(item.value);
            }}
          />
        </View>
        <View style={styles.containerEachLine}>
          <Text style={styles.title}>Số ngày nghỉ</Text>
          <Dropdown
            style={styles.dropdown}
            autoScroll={false}
            showsVerticalScrollIndicator={false}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={styles.containerOptionStyle}
            iconStyle={styles.iconStyle}
            itemContainerStyle={styles.itemContainer}
            itemTextStyle={styles.itemText}
            fontFamily={Fonts.SF_MEDIUM}
            activeColor="#eef2feff"
            maxHeight={Dimension.setHeight(23)}
            labelField="label"
            valueField="value"
            placeholder="Chọn số ngày"
            data={numberOfDayOff}
            value={valueNumberOfDay}
            onChange={item => {
              setValueNumberOfDay(item.value);
              item.value !== 'Nhiều ngày' ? setEndDay(null) : null;
            }}
          />
        </View>
        <View style={styles.containerEachLine}>
          <Text style={styles.title}>Nghỉ từ</Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: Dimension.setWidth(1.6),
              backgroundColor: '#ffffff',
            }}>
            <TouchableOpacity
              onPress={() => {
                setCheckPick(true);
                setToggleDatePicker(true);
              }}
              style={styles.datePickerContainer}>
              <Image source={Images.minidate} style={styles.dateImg} />
              <Text style={styles.dateText}>{startDay}</Text>
            </TouchableOpacity>

            {valueNumberOfDay === 'Nhiều ngày' && (
              <>
                <View
                  style={{
                    width: '5%',
                    borderWidth: 1,
                    alignSelf: 'center',
                    marginHorizontal: Dimension.setWidth(3),
                    borderColor: Colors.INACTIVE_GREY,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setCheckPick(false);
                    setToggleDatePicker(true);
                  }}
                  style={styles.datePickerContainer}>
                  <Image source={Images.minidate} style={styles.dateImg} />
                  <Text style={styles.dateText}>
                    {endDay === null ? 'Chọn ngày' : endDay}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        <View style={styles.containerEachLine}>
          <Text style={styles.title}>Lý do cụ thể</Text>
          <TextInput
            style={{
              height: Dimension.setHeight(5.3),
              borderBottomWidth: 0.6,
              borderBottomColor: 'gray',
              marginHorizontal: Dimension.setWidth(1.6),
              fontFamily: Fonts.SF_MEDIUM,
            }}
            placeholder="Nhập mô tả"
            value={inputDecription}
            onChangeText={e => setInputDecription(e)}
          />
        </View>
        <TouchableOpacity
          onPress={handleRegister}
          style={{
            alignSelf: 'flex-end',
            marginRight: Dimension.setWidth(3),
            backgroundColor: '#ff9e57',
            paddingVertical: Dimension.setHeight(0.8),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            width: Dimension.setWidth(36),
            height: Dimension.setHeight(6),
            marginTop: Dimension.setHeight(1),
            marginBottom: Dimension.setHeight(2.5),
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.SF_SEMIBOLD,
              color: '#ffffff',
            }}>
            Đăng kí
          </Text>
        </TouchableOpacity>

        {toggleDatePicker && (
          <View style={styles.calendarView}>
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              onChange={handlePickDate}
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
            />
          </View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  containerEachLine: {
    marginBottom: Dimension.setHeight(2),
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 12,
    paddingVertical: Dimension.setHeight(1.6),
    paddingHorizontal: Dimension.setWidth(3),
  },

  title: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: 15,
    color: '#8bc7bc',
    lineHeight: Dimension.setHeight(2.2),
    marginBottom: Dimension.setHeight(1),
  },

  datePickerContainer: {
    borderWidth: 0.6,
    borderColor: Colors.INACTIVE_GREY,
    borderRadius: 7,
    width: '40%',
    height: Dimension.setHeight(4.5),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#dfedfa',
  },

  dateImg: {
    height: 20,
    width: 20,
    tintColor: Colors.INACTIVE_GREY,
  },

  dateText: {
    fontSize: 14,
    fontFamily: Fonts.SF_MEDIUM,
    marginLeft: Dimension.setWidth(2),
    color: '#277aaeff',
  },

  dropdown: {
    height: Dimension.setHeight(4.5),
    marginHorizontal: Dimension.setWidth(1.6),
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    color: '#277aaeff',
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  containerOptionStyle: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#f6f6f8ff',
  },
  itemContainer: {
    marginHorizontal: Dimension.setWidth(2),
  },
  itemText: {
    lineHeight: Dimension.setHeight(2),
    color: '#57575a',
  },
  pickTimeHolder: {
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  calendarView: {
    position: 'absolute',
    top: '25%',
    left: '5%',
    zIndex: 999,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    padding: 15,
    borderRadius: 15,
  },
});

export default CreateApplyLeaveScreen;
