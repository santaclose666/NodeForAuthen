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
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {ToastAlert, ToastSuccess} from '../../components/Toast';
import {
  compareDate,
  formatDate,
  formatDateToPost,
  formatTime,
  formatTimeToPost,
  getCurrentTime,
} from '../../utils/serviceFunction';
import RegisterBtn from '../../components/RegisterBtn';
import {registerPlaneTicket} from '../../redux/apiRequest';
import {shadowIOS} from '../../contants/propsIOS';
import {mainURL} from '../../contants/Variable';
import {planeCompany, ticketType, airplane} from '../../contants/Variable';
import Loading from '../../components/LoadingUI';
import LinearGradientUI from '../../components/LinearGradientUI';
import RedPoint from '../../components/RedPoint';
import {rowAlignCenter} from '../../contants/CssFE';

const workData = [
  {
    label: 'Chọn từ danh sách',
    value: 1,
  },
  {
    label: 'Khác',
    value: 2,
  },
];

const RegisterPlaneScreen = ({navigation, route}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const IFEEstaffs = useSelector(state => state.staffs?.staffs?.IFEEStaff);
  const workNameData = useSelector(state => state.work.works?.data);
  const allStaffs = IFEEstaffs.map(item => {
    return {label: item.hoten, value: item.id};
  });
  const [multiStaff, setMultiStaff] = useState([]);
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [planeCompanyValue, setPlaneCompanyValue] = useState(
    planeCompany[0].value,
  );
  const [ticketTypeValue, setTicketTypeValue] = useState(ticketType[0].value);
  const [fromValue, setFromValue] = useState(airplane[0].value);
  const [toValue, setToValue] = useState(airplane[1].value);
  const [workName, setWorkName] = useState('');
  const [outSidePerson, setOutSidePerson] = useState(null);
  const [dateTime, setDateTime] = useState('date');
  const [dateValue, setDateValue] = useState(
    moment(new Date()).format('DD/MM/YYYY'),
  );
  const [timeValue, setTimeValue] = useState(getCurrentTime());
  const [kgNumber, setKgNumber] = useState(10);
  const [loading, setLoading] = useState(false);
  const [workValue, setWorkValue] = useState(workData[0].value);

  const handlePickDate = date => {
    if (dateTime === 'date') {
      const message = 'Ngày khởi hành không hợp lệ';
      compareDate(new Date(), date)
        ? setDateValue(formatDate(date))
        : ToastAlert(message);
    } else {
      setTimeValue(formatTime(date));
    }
    setToggleDatePicker(false);
  };

  const handleRegister = async () => {
    if (multiStaff.length !== 0 && workName.length !== 0) {
      const data = {
        id_user: user?.id,
        ds_ns: multiStaff,
        ngoaivien: outSidePerson,
        chuongtrinh: workName,
        hangbay: planeCompanyValue,
        sanbaydi: fromValue,
        sanbayden: toValue,
        ngaydi: `${formatDateToPost(dateValue)} ${formatTimeToPost(timeValue)}`,
        hangve: ticketTypeValue,
        kygui: kgNumber,
      };
      setLoading(true);
      try {
        const res = await registerPlaneTicket(data);

        if (res) {
          ToastSuccess('Đăng kí thành công');
          navigation.goBack();
          route.params?.refreshData();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      ToastAlert('Thiếu thông tin!');
    }
  };

  return (
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header title="Đăng kí vé máy bay" navigation={navigation} />
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
                <Image
                  src={mainURL + user?.path}
                  style={{height: 40, width: 40, borderRadius: 50}}
                />
                <Text
                  style={{
                    marginLeft: Dimension.setWidth(3),
                    fontSize: Dimension.fontSize(19),
                    fontFamily: Fonts.SF_SEMIBOLD,
                  }}>
                  {user?.hoten}
                </Text>
              </View>
            </View>
            <View style={styles.containerEachLine}>
              <View style={rowAlignCenter}>
                <Text style={styles.title}>Thuộc chương trình</Text>
                <RedPoint />
              </View>
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
                data={workData}
                maxHeight={Dimension.setHeight(30)}
                labelField="label"
                valueField="value"
                value={workValue}
                onChange={item => {
                  setWorkName('');
                  setWorkValue(item.value);
                }}
              />
            </View>
            <View style={styles.containerEachLine}>
              <View style={rowAlignCenter}>
                <Text style={styles.title}>Tên chương trình</Text>
                <RedPoint />
              </View>
              {workValue === 1 && workNameData ? (
                <Dropdown
                  style={styles.dropdown}
                  autoScroll={false}
                  showsVerticalScrollIndicator={false}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  selectedTextProps={{numberOfLines: 3}}
                  containerStyle={styles.containerOptionStyle}
                  iconStyle={styles.iconStyle}
                  itemContainerStyle={styles.itemContainer}
                  itemTextStyle={styles.itemText}
                  fontFamily={Fonts.SF_MEDIUM}
                  placeholder="Chọn chương trình"
                  search
                  searchPlaceholder="Tìm kiếm"
                  activeColor="#eef2feff"
                  data={workNameData}
                  maxHeight={Dimension.setHeight(40)}
                  labelField="tenhd"
                  valueField="tenhd"
                  value={workName}
                  onChange={item => {
                    setWorkName(item.tenhd);
                  }}
                />
              ) : (
                <TextInput
                  style={styles.inputText}
                  placeholder="Nhập tên chương trình"
                  value={workName}
                  onChangeText={e => setWorkName(e)}
                />
              )}
            </View>
            <View style={styles.containerEachLine}>
              <View style={rowAlignCenter}>
                <Text style={styles.title}>Người công tác</Text>
                <RedPoint />
              </View>
              <MultiSelect
                style={styles.dropdown}
                autoScroll={false}
                showsVerticalScrollIndicator={false}
                placeholderStyle={styles.placeholderStyle}
                selectedStyle={styles.selectedStyle}
                selectedTextStyle={[styles.selectedTextStyle, {fontSize: 13}]}
                containerStyle={styles.containerOptionStyle}
                iconStyle={styles.iconStyle}
                itemContainerStyle={styles.itemContainer}
                itemTextStyle={styles.itemText}
                fontFamily={Fonts.SF_MEDIUM}
                search
                searchPlaceholder="Tìm kiếm..."
                activeColor="#eef2feff"
                data={allStaffs}
                maxHeight={Dimension.setHeight(30)}
                labelField="label"
                valueField="value"
                placeholder="Chọn người công tác"
                value={multiStaff}
                renderLeftIcon={() => {
                  return (
                    <Image
                      source={Images.person}
                      style={styles.leftIconDropdown}
                    />
                  );
                }}
                onChange={item => {
                  setMultiStaff(item);
                }}
              />
            </View>
            <View style={styles.containerEachLine}>
              <Text style={styles.title}>Người ngoài viện</Text>
              <TextInput
                style={{
                  borderBottomWidth: 0.6,
                  borderBottomColor: 'gray',
                  marginHorizontal: Dimension.setWidth(1.6),
                  fontFamily: Fonts.SF_MEDIUM,
                  fontSize: Dimension.fontSize(16),
                  height: Dimension.setHeight(5),
                }}
                placeholder="ex: Người 1, người 2"
                value={outSidePerson}
                onChangeText={e => setOutSidePerson(e)}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={[styles.containerEachLine, {width: '54%'}]}>
                <View style={rowAlignCenter}>
                  <Text style={styles.title}>Hãng bay</Text>
                  <RedPoint />
                </View>
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
                  data={planeCompany}
                  maxHeight={Dimension.setHeight(30)}
                  labelField="label"
                  valueField="value"
                  imageField="image"
                  value={planeCompanyValue}
                  renderLeftIcon={() => {
                    return (
                      <Image
                        source={Images.plane}
                        style={styles.leftIconDropdown}
                      />
                    );
                  }}
                  onChange={item => {
                    setPlaneCompanyValue(item.value);
                  }}
                />
              </View>
              <View style={[styles.containerEachLine, {width: '44%'}]}>
                <View style={rowAlignCenter}>
                  <Text style={styles.title}>Hạng vé</Text>
                  <RedPoint />
                </View>
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
                  maxHeight={Dimension.setHeight(30)}
                  labelField="label"
                  valueField="value"
                  data={ticketType}
                  value={ticketTypeValue}
                  renderLeftIcon={() => {
                    return (
                      <Image
                        source={Images.planeTicket}
                        style={styles.leftIconDropdown}
                      />
                    );
                  }}
                  onChange={item => {
                    setTicketTypeValue(item.value);
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{width: '52%'}}>
                <TouchableOpacity
                  onPress={() => {
                    setDateTime('date');
                    setToggleDatePicker(true);
                  }}
                  style={[
                    styles.containerEachLine,
                    {
                      marginBottom: Dimension.setHeight(1),
                      width: '100%',
                      paddingVertical: Dimension.setHeight(1),
                    },
                  ]}>
                  <View style={rowAlignCenter}>
                    <Text style={styles.title}>Ngày tháng</Text>
                    <RedPoint />
                  </View>
                  <View style={styles.dateTimePickerContainer}>
                    <Text style={styles.dateTimeText}>{dateValue}</Text>
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
                    setDateTime('time');
                    setToggleDatePicker(true);
                  }}
                  style={[
                    styles.containerEachLine,
                    {width: '100%', paddingVertical: Dimension.setHeight(1)},
                  ]}>
                  <View style={rowAlignCenter}>
                    <Text style={styles.title}>Thời gian</Text>
                    <RedPoint />
                  </View>
                  <View style={styles.dateTimePickerContainer}>
                    <Text style={styles.dateTimeText}>{timeValue}</Text>
                    <View
                      style={[
                        styles.dateTimeImgContainer,
                        {backgroundColor: '#96d1d9'},
                      ]}>
                      <Image source={Images.time} style={styles.dateTimeImg} />
                    </View>
                  </View>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={toggleDatePicker}
                  mode={dateTime}
                  onConfirm={handlePickDate}
                  onCancel={() => {
                    setToggleDatePicker(false);
                  }}
                />
              </View>
              <View
                style={[
                  styles.containerEachLine,
                  ,
                  {
                    width: '45%',
                    height: Dimension.setHeight(12),
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}>
                <Text style={[styles.title, {alignSelf: 'center'}]}>
                  Cân nặng kí gửi
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      kgNumber !== 0 ? setKgNumber(kgNumber - 1) : null;
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
                      fontSize: Dimension.fontSize(16),
                    }}>
                    {kgNumber}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setKgNumber(kgNumber + 2);
                    }}>
                    <Image
                      style={{height: 22, width: 22}}
                      source={Images.plus}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.containerEachLine}>
              <View style={rowAlignCenter}>
                <Text style={styles.title}>Bay từ</Text>
                <RedPoint />
              </View>
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
                      source={Images.takeoff}
                      style={styles.leftIconDropdown}
                    />
                  );
                }}
                activeColor="#eef2feff"
                data={airplane}
                maxHeight={Dimension.setHeight(30)}
                labelField="label"
                valueField="value"
                value={fromValue}
                onChange={item => {
                  setFromValue(item.value);
                }}
              />
            </View>
            <View style={styles.containerEachLine}>
              <View style={rowAlignCenter}>
                <Text style={styles.title}>Đến</Text>
                <RedPoint />
              </View>
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
                      source={Images.landing}
                      style={styles.leftIconDropdown}
                    />
                  );
                }}
                activeColor="#eef2feff"
                data={airplane}
                maxHeight={Dimension.setHeight(28)}
                labelField="label"
                valueField="value"
                placeholder=""
                value={toValue}
                onChange={item => {
                  setToValue(item.value);
                }}
              />
            </View>
            <RegisterBtn nameBtn={'Đăng kí'} onEvent={handleRegister} />
          </KeyboardAwareScrollView>
        </ScrollView>
        {loading === true && <Loading bg={true} />}
      </SafeAreaView>
    </LinearGradientUI>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
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
    fontSize: Dimension.fontSize(15),
    color: '#8bc7bc',
    marginBottom: Dimension.setHeight(1),
  },

  inputText: {
    borderBottomWidth: 0.6,
    borderBottomColor: 'gray',
    marginHorizontal: Dimension.setWidth(1.6),
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: Dimension.fontSize(16),
    height: Dimension.setHeight(5),
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
    fontSize: Dimension.fontSize(16),
  },

  dropdown: {
    height: Dimension.setHeight(4.5),
    marginHorizontal: Dimension.setWidth(1.6),
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: Dimension.fontSize(15),
  },
  selectedStyle: {
    borderRadius: 12,
    borderWidth: 0,
  },
  selectedTextStyle: {
    color: '#277aaeff',
    fontSize: Dimension.fontSize(15),
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
    color: '#57575a',
    fontSize: Dimension.fontSize(14),
  },
  leftIconDropdown: {
    width: 20,
    height: 20,
    marginRight: Dimension.setWidth(1.3),
  },
});

export default RegisterPlaneScreen;
