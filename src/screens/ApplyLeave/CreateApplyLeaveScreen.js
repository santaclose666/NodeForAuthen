import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {useSelector} from 'react-redux';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import Header from '../../components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ToastAlert, ToastSuccess} from '../../components/Toast';
import {
  compareDate,
  formatDate,
  formatDateToPost,
} from '../../utils/serviceFunction';
import RegisterBtn from '../../components/RegisterBtn';
import {registerOnLeave} from '../../redux/apiRequest';

const numberOfDayOff = [
  {label: 'Buổi sáng', value: 0.5},
  {label: 'Buổi chiều', value: 0.5},
  {label: '1 ngày', value: 1},
  {label: 'Nhiều ngày', value: 'Nhiều ngày'},
];

const CreateApplyLeaveScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const [valueNumberOfDay, setValueNumberOfDay] = useState(null);
  const [offNumber, setOffNumber] = useState(2);
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [startDay, setStartDay] = useState(formatDate(new Date()));
  const [inputDecription, setInputDecription] = useState('');

  const handlePickDate = (event, date) => {
    if (event.type === 'set') {
      setToggleDatePicker(false);
      const message = 'Ngày bắt đầu không hợp lệ';
      compareDate(new Date(), date)
        ? setStartDay(formatDate(date))
        : ToastAlert(message);
    } else {
      setToggleDatePicker(false);
    }
  };

  const handleRegister = () => {
    if (valueNumberOfDay === null || inputDecription === '') {
      const message = 'Thiếu thông tin!';
      ToastAlert(message);
    } else {
      const data = {
        id_user: user?.id,
        lydo: inputDecription,
        tungay: formatDateToPost(startDay),
        tong: valueNumberOfDay === 'Nhiều ngày' ? offNumber : valueNumberOfDay,
      };

      registerOnLeave(data);

      const message = 'Đăng kí thành công';
      ToastSuccess(message);

      navigation.navigate('HistoryApplyLeave', {refresh: true});
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Đăng kí nghỉ phép" navigation={navigation} />
      <KeyboardAwareScrollView
        enableAutomaticScroll={true}
        enableResetScrollToCoords={true}
        enableOnAndroid={true}
        behavior="padding"
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
            }}
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
              setToggleDatePicker(true);
            }}
            style={[
              styles.containerEachLine,
              {width: '48%', paddingVertical: Dimension.setHeight(1.8)},
            ]}>
            <Text style={styles.title}>Nghỉ từ</Text>
            <View style={styles.dateTimePickerContainer}>
              <Text style={styles.dateTimeText}>{startDay}</Text>
              <View
                style={[
                  styles.dateTimeImgContainer,
                  {backgroundColor: '#ff8d6a'},
                ]}>
                <Image
                  source={Images.calendarBlack}
                  style={styles.dateTimeImg}
                />
              </View>
            </View>
          </TouchableOpacity>
          {valueNumberOfDay === 'Nhiều ngày' && (
            <View
              style={[
                styles.containerEachLine,
                ,
                {
                  width: '48%',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Text style={[styles.title, {alignSelf: 'center'}]}>
                Số ngày nghỉ phép
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    offNumber !== 0 ? setOffNumber(offNumber - 1) : null;
                  }}>
                  <Image
                    style={{height: 22, width: 22}}
                    source={Images.minus}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    marginHorizontal: Dimension.setWidth(3),
                    fontFamily: Fonts.SF_MEDIUM,
                    fontSize: 16,
                  }}>
                  {offNumber}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setOffNumber(offNumber + 1);
                  }}>
                  <Image style={{height: 22, width: 22}} source={Images.plus} />
                </TouchableOpacity>
              </View>
            </View>
          )}
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
        <RegisterBtn nameBtn={'Đăng kí'} onEvent={handleRegister} />

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
});

export default CreateApplyLeaveScreen;
