import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import Header from '../../components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ToastAlert, ToastSuccess} from '../../components/Toast';
import {getCurrentTime} from '../../utils/serviceFunction';

const listLuaChon = [
  {
    label: 'Lịch công tác',
    value: 'Lịch công tác',
  },
  {
    label: 'Khác',
    value: 'Khác',
  },
];

const listChuongTrinh = [
  {
    label: 'Chương trình 1',
    value: 'Chương trình 1',
  },
  {
    label: 'Chương trình 2',
    value: 'Chương trình 2',
  },
];

const listTenChuongTrinh = [
  {
    label: 'Tên chương trình 1',
    value: 'Tên chương trình 1',
  },
  {
    label: 'Tên chương trình 2',
    value: 'Tên chương trình 2',
  },
];

const CreateWorkSchedule = ({navigation}) => {
  const [luaChon, setLuaChon] = useState(listLuaChon[0].value,);
  const [chuongTrinh, setChuongTrinh] = useState(listChuongTrinh[0].value,);
  const [tenChuongTrinh, setTenChuongTrinh] = useState(listTenChuongTrinh[0].value,);
  const [inputDiaDiem, setInputDiaDiem] = useState('');
  const [inputNoiDung, setInputNoiDung] = useState('');
  const [inputDauMoi, setInputDauMoi] = useState('');
  const [inputThanhPhan, setInputThanhPhan] = useState('');
  const [inputGhiChu, setInputGhiChu] = useState('');
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [checkPick, setCheckPick] = useState(null);
  const [startDay, setStartDay] = useState(moment(date).format('DD-MM-YYYY'));
  const [endDay, setEndDay] = useState(null);

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

  const handleRegister = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Lập lịch công tác" navigation={navigation} />
      <ScrollView>
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
            <Text style={styles.title}>Lựa chọn loại</Text>
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
              renderLeftIcon={() => {
                return (
                  <Image
                    source={Images.select}
                    style={styles.leftIconDropdown}
                  />
                );
              }}
              activeColor="#eef2feff"
              data={listLuaChon}
              maxHeight={Dimension.setHeight(30)}
              labelField="label"
              valueField="value"
              value={luaChon}
              onChange={item => {
                setLuaChon(item.value);
              }}
            />
          </View>

          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Địa điểm</Text>
            <TextInput
              style={{
                height: Dimension.setHeight(5.3),
                borderBottomWidth: 0.6,
                borderBottomColor: 'gray',
                marginHorizontal: Dimension.setWidth(1.6),
                fontFamily: Fonts.SF_MEDIUM,
                fontSize: 16,
              }}
              placeholder="Nhập địa điểm"
              value={inputDiaDiem}
              onChangeText={e => setInputDiaDiem(e)}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <TouchableOpacity
               onPress={() => {
                setCheckPick(true);
                setToggleDatePicker(true);
              }}
                style={[
                  styles.containerEachLine,
                  {
                    marginBottom: Dimension.setHeight(1),
                    width: '48%',
                    paddingVertical: Dimension.setHeight(1),
                  },
                ]}>
                <Text style={styles.title}>Từ ngày</Text>
                <View style={styles.dateTimePickerContainer}>
                  <Text style={styles.dateTimeText}>{startDay}</Text>
                  <View
                    style={[
                      styles.dateTimeImgContainer,
                      {backgroundColor: '#dbd265'},
                    ]}>
                    <Image
                      source={Images.calendarBlack}
                      style={styles.dateTimeImg}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              {toggleDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                onChange={handlePickDate}
              />
            )}
              <TouchableOpacity
               onPress={() => {
                setCheckPick(false);
                setToggleDatePicker(true);
              }}
                style={[
                  styles.containerEachLine,
                  {
                    marginBottom: Dimension.setHeight(1),
                    width: '48%',
                    paddingVertical: Dimension.setHeight(1),
                  },
                ]}>
                <Text style={styles.title}>Đến ngày</Text>
                <View style={styles.dateTimePickerContainer}>
                  <Text style={styles.dateTimeText}>{endDay === null ? 'Chọn ngày' : endDay}</Text>
                  <View
                    style={[
                      styles.dateTimeImgContainer,
                      {backgroundColor: '#dbd265'},
                    ]}>
                    <Image
                      source={Images.calendarBlack}
                      style={styles.dateTimeImg}
                    />
                  </View>
                </View>
              </TouchableOpacity>
          </View>

          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Thuộc chương trình</Text>
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
              data={listChuongTrinh}
              maxHeight={Dimension.setHeight(30)}
              labelField="label"
              valueField="value"
              value={chuongTrinh}
              onChange={item => {
                setChuongTrinh(item.value);
              }}
            />
          </View>

          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Tên chương trình</Text>
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
              data={listTenChuongTrinh}
              maxHeight={Dimension.setHeight(30)}
              labelField="label"
              valueField="value"
              value={tenChuongTrinh}
              onChange={item => {
                setTenChuongTrinh(item.value);
              }}
            />
          </View>

          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Nội dung</Text>
            <TextInput
              style={{
                height: Dimension.setHeight(5.3),
                borderBottomWidth: 0.6,
                borderBottomColor: 'gray',
                marginHorizontal: Dimension.setWidth(1.6),
                fontFamily: Fonts.SF_MEDIUM,
                fontSize: 16,
              }}
              placeholder="Nhập nội dung"
              value={inputNoiDung}
              onChangeText={e => setInputNoiDung(e)}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <View style={[styles.containerEachLine, 
               {
                marginBottom: Dimension.setHeight(1),
                width: '48%',
                paddingVertical: Dimension.setHeight(1),
              },]}>
            <Text style={styles.title}>Đầu mối</Text>
            <TextInput
              style={{
                height: Dimension.setHeight(5.3),
                borderBottomWidth: 0.6,
                borderBottomColor: 'gray',
                marginHorizontal: Dimension.setWidth(1.6),
                fontFamily: Fonts.SF_MEDIUM,
                fontSize: 16,
              }}
              value={inputDauMoi}
              onChangeText={e => setInputDauMoi(e)}
            />
          </View>

          <View style={[styles.containerEachLine,
           {
            marginBottom: Dimension.setHeight(1),
            width: '48%',
            paddingVertical: Dimension.setHeight(1),
          },]}>
            <Text style={styles.title}>Thành phần</Text>
            <TextInput
              style={{
                height: Dimension.setHeight(5.3),
                borderBottomWidth: 0.6,
                borderBottomColor: 'gray',
                marginHorizontal: Dimension.setWidth(1.6),
                fontFamily: Fonts.SF_MEDIUM,
                fontSize: 16,
              }}
              value={inputThanhPhan}
              onChangeText={e => setInputThanhPhan(e)}
            />
          </View>
          </View>

          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Ghi chú</Text>
            <TextInput
              style={{
                height: Dimension.setHeight(5.3),
                borderBottomWidth: 0.6,
                borderBottomColor: 'gray',
                marginHorizontal: Dimension.setWidth(1.6),
                fontFamily: Fonts.SF_MEDIUM,
                fontSize: 16,
              }}
              placeholder="Ghi chú"
              value={inputGhiChu}
              onChangeText={e => setInputGhiChu(e)}
            />
          </View>

            <View style={{flexDirection:'row' ,justifyContent:'space-between'}}>
              <TouchableOpacity
            onPress={handleRegister}
            style={{
              alignSelf: 'center',
              marginRight: Dimension.setWidth(3),
              backgroundColor: '#ff9e57',
              paddingVertical: Dimension.setHeight(0.8),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              width: Dimension.setWidth(36),
              height: Dimension.setHeight(6),
              marginTop: Dimension.setHeight(1),
              marginBottom: Dimension.setHeight(2),
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: Fonts.SF_SEMIBOLD,
                color: '#ffffff',
              }}>
              Tải về
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleRegister}
            style={{
              alignSelf: 'center',
              marginRight: Dimension.setWidth(3),
              backgroundColor: '#ff9e57',
              paddingVertical: Dimension.setHeight(0.8),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              width: Dimension.setWidth(36),
              height: Dimension.setHeight(6),
              marginTop: Dimension.setHeight(1),
              marginBottom: Dimension.setHeight(2),
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: Fonts.SF_SEMIBOLD,
                color: '#ffffff',
              }}>
              Thực hiện
            </Text>
          </TouchableOpacity>
            </View>

          
        </KeyboardAwareScrollView>
      </ScrollView>
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

  dateTimePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Dimension.setWidth(1.6),
  },

  dateTimeImgContainer: {
    padding: Dimension.setWidth(1.1),
    borderRadius: 8,
  },

  dateTimeImg: {
    height: 17,
    width: 17,
    tintColor: '#ffffff',
  },

  dateTimeText: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: 16,
    lineHeight: Dimension.setHeight(2.2),
  },

  dropdown: {
    height: Dimension.setHeight(4.5),
    marginHorizontal: Dimension.setWidth(1.6),
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: 15,
  },
  selectedStyle: {
    borderRadius: 12,
    borderWidth: 0,
  },
  selectedTextStyle: {
    color: '#277aaeff',
    fontSize: 15,
    lineHeight: Dimension.setHeight(2),
  },
  imageStyle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  containerOptionStyle: {
    borderRadius: 12,
    backgroundColor: '#f6f6f8ff',
    width: '110%',
    alignSelf: 'center',
  },
  itemContainer: {
    borderRadius: 12,
  },
  itemText: {
    lineHeight: Dimension.setHeight(2),
    color: '#57575a',
    fontSize: 14,
  },
  leftIconDropdown: {
    width: 20,
    height: 20,
    marginRight: Dimension.setWidth(1.3),
  },
});

export default CreateWorkSchedule;
