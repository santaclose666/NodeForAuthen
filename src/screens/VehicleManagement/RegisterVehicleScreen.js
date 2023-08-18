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
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  formatTime,
  getCurrentTime,
  compareDate,
  formatDate,
} from '../../utils/serviceFunction';
import {ToastAlert, ToastSuccess} from '../../components/Toast';
import RegisterBtn from '../../components/RegisterBtn';
import {shadowIOS} from '../../contants/ShadowIOS';

const typeVehicle = [
  {
    label: 'WIGO',
    value: 'WIGO',
  },
  {
    label: 'Honda WAVE - Biển số: 29X1-897.78',
    value: 'Honda WAVE - Biển số: 29X1-897.78',
  },
  {
    label: 'Honda WAVE - Biển số: 29X1-902.14',
    value: 'Honda WAVE - Biển số: 29X1-902.14',
  },
];

const RegisterVehicleScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [dateTime, setDateTime] = useState(null);
  const [vehicleValue, setVehicleValue] = useState(typeVehicle[0].value);
  const [dateStart, setDateStart] = useState(formatDate(new Date()));
  const [receiveDate, setReceiveDate] = useState(formatDate(new Date()));
  const [receiveTime, setReceiveTime] = useState(getCurrentTime());
  const [check, setCheck] = useState(null);
  const [placeInput, setPlaceInput] = useState('');
  const [contentInput, setContentInput] = useState('');

  const handlePickDate = (event, date) => {
    const message = 'Ngày nhận xe không hợp lệ!';
    if (event.type === 'set') {
      setToggleDatePicker(false);
      if (check === 'startDate') {
        const startDate = formatDate(date);
        compareDate(receiveDate, startDate)
          ? setDateStart(startDate)
          : ToastAlert(message);
      } else if (check === 'receiveTime') {
        setReceiveTime(formatTime(date));
      } else {
        const dateReceive = formatDate(date);
        compareDate(dateReceive, dateStart)
          ? setReceiveDate(dateReceive)
          : ToastAlert(message);
      }
    } else {
      setToggleDatePicker(false);
    }
  };

  const handlePickStartDate = () => {
    setCheck('startDate');
    setDateTime('date');
    setToggleDatePicker(true);
  };

  const handlePickReceiveTime = () => {
    setCheck('receiveTime');
    setDateTime('time');
    setToggleDatePicker(true);
  };

  const handelePickReceiveDate = () => {
    setCheck('receiveDate');
    setDateTime('date');
    setToggleDatePicker(true);
  };

  const handleRegister = () => {
    ToastSuccess('Thành công');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Đăng kí sử dụng xe" navigation={navigation} />
      <ScrollView>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            backgroundColor: '#fbfbfd',
            borderRadius: 12,
            marginHorizontal: Dimension.setWidth(3),
            marginVertical: Dimension.setHeight(3),
            paddingHorizontal: Dimension.setWidth(3),
            paddingTop: Dimension.setHeight(3),
            elevation: 5,
            ...shadowIOS,
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
                {user?.hoten}
              </Text>
            </View>
          </View>
          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Loại xe</Text>
            <Dropdown
              style={styles.dropdown}
              autoScroll={false}
              showsVerticalScrollIndicator={false}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.containerOptionStyle}
              imageStyle={styles.imageStyle}
              iconStyle={styles.iconStyle}
              itemContainerStyle={styles.itemContainer}
              itemTextStyle={styles.itemText}
              fontFamily={Fonts.SF_MEDIUM}
              activeColor="#eef2feff"
              data={typeVehicle}
              maxHeight={Dimension.setHeight(30)}
              labelField="label"
              valueField="value"
              imageField="image"
              value={vehicleValue}
              renderLeftIcon={() => {
                return (
                  <Image
                    source={
                      vehicleValue === 'WIGO'
                        ? Images.vehicles
                        : Images.motorbike
                    }
                    style={styles.leftIconDropdown}
                  />
                );
              }}
              onChange={item => {
                setVehicleValue(item.value);
              }}
            />
          </View>
          <TouchableOpacity
            onPress={handlePickStartDate}
            style={styles.containerEachLine}>
            <Text style={styles.title}>Ngày đi</Text>
            <View style={styles.dateTimePickerContainer}>
              <Text style={styles.dateTimeText}>{dateStart}</Text>
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={handlePickReceiveTime}
              style={[styles.containerEachLine, {width: '48%'}]}>
              <Text style={styles.title}>Giờ nhận xe</Text>
              <View style={styles.dateTimePickerContainer}>
                <Text style={styles.dateTimeText}>{receiveTime}</Text>
                <View
                  style={[
                    styles.dateTimeImgContainer,
                    {backgroundColor: '#96d1d9'},
                  ]}>
                  <Image source={Images.time} style={styles.dateTimeImg} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handelePickReceiveDate}
              style={[styles.containerEachLine, {width: '48%'}]}>
              <Text style={styles.title}>Ngày nhận xe</Text>
              <View style={styles.dateTimePickerContainer}>
                <Text style={styles.dateTimeText}>{receiveDate}</Text>
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
            <Text style={styles.title}>Nơi đến</Text>
            <TextInput
              placeholder="Nhập địa điểm"
              style={{
                borderBottomWidth: 0.6,
                borderBottomColor: 'gray',
                marginHorizontal: Dimension.setWidth(1.6),
                fontFamily: Fonts.SF_MEDIUM,
                fontSize: 16,
              }}
              value={placeInput}
              onChangeText={e => setPlaceInput(e)}
            />
          </View>
          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Nội dung công tác</Text>
            <TextInput
              placeholder="Nhập nội dung"
              editable
              multiline
              numberOfLines={3}
              style={{
                borderBottomWidth: 0.6,
                borderBottomColor: 'gray',
                marginHorizontal: Dimension.setWidth(1.6),
                fontFamily: Fonts.SF_MEDIUM,
                fontSize: 16,
              }}
              value={contentInput}
              onChangeText={e => setContentInput(e)}
            />
          </View>

          <RegisterBtn nameBtn={'Đăng kí'} onEvent={handleRegister} />

          {toggleDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date()}
              mode={dateTime}
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={handlePickDate}
            />
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
});

export default RegisterVehicleScreen;
