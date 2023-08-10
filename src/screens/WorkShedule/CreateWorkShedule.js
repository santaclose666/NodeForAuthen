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
import Dimension from '../../contants/Dimension';
import Header from '../../components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ToastAlert, ToastSuccess} from '../../components/Toast';
import {compareDate, formatDate} from '../../utils/serviceFunction';
import RegisterBtn from '../../components/RegisterBtn';

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
  const user = useSelector(state => state.auth.login?.currentUser);
  const [luaChon, setLuaChon] = useState(listLuaChon[0].value);
  const [chuongTrinh, setChuongTrinh] = useState(listChuongTrinh[0].value);
  const [tenChuongTrinh, setTenChuongTrinh] = useState(
    listTenChuongTrinh[0].value,
  );
  const [inputDiaDiem, setInputDiaDiem] = useState('');
  const [inputNoiDung, setInputNoiDung] = useState('');
  const [inputDauMoi, setInputDauMoi] = useState('');
  const [inputThanhPhan, setInputThanhPhan] = useState('');
  const [inputGhiChu, setInputGhiChu] = useState('');
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [checkPick, setCheckPick] = useState(null);
  const [startDay, setStartDay] = useState(formatDate(new Date()));
  const [endDay, setEndDay] = useState('Chọn ngày');

  const handlePickDate = (event, date) => {
    if (event.type === 'set') {
      setToggleDatePicker(false);
      if (checkPick) {
        const dayStart = formatDate(date);
        if (endDay !== 'Chọn ngày') {
          compareDate(dayStart, endDay)
            ? setStartDay(dayStart)
            : ToastAlert('Ngày bắt đầu không hợp lệ');
        } else {
          setStartDay(dayStart);
        }
      } else {
        const dayEnd = formatDate(date);
        compareDate(startDay, dayEnd)
          ? setEndDay(dayEnd)
          : ToastAlert('Ngày kết thúc không hợp lệ');
      }
    } else {
      setToggleDatePicker(false);
    }
  };

  const handleRegister = () => {
    ToastSuccess('Thành công');
  };

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
                  width: '48%',
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

            <TouchableOpacity
              onPress={() => {
                setCheckPick(false);
                setToggleDatePicker(true);
              }}
              style={[
                styles.containerEachLine,
                {
                  width: '48%',
                },
              ]}>
              <Text style={styles.title}>Đến ngày</Text>
              <View style={styles.dateTimePickerContainer}>
                <Text style={styles.dateTimeText}>{endDay}</Text>
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
            <View
              style={[
                styles.containerEachLine,
                {
                  width: '48%',
                },
              ]}>
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

            <View
              style={[
                styles.containerEachLine,
                {
                  width: '48%',
                },
              ]}>
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

          <RegisterBtn nameBtn={'Thực hiện'} onEvent={handleRegister} />

          {toggleDatePicker && (
            <View style={styles.calendarView}>
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode="date"
                onChange={handlePickDate}
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
              />
            </View>
          )}
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
  calendarView: {
    position: 'absolute',
    top: '15%',
    left: '5%',
    zIndex: 999,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    padding: 15,
    borderRadius: 15,
  },
});

export default CreateWorkSchedule;
