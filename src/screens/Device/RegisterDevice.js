import React, {useState, useLayoutEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  FlatList,
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
import {getAllDevices, registerPlaneTicket} from '../../redux/apiRequest';
import {shadowIOS} from '../../contants/propsIOS';
import {mainURL} from '../../contants/Variable';
import {planeCompany, ticketType, airplane} from '../../contants/Variable';
import Loading from '../../components/LoadingUI';
import LinearGradientUI from '../../components/LinearGradientUI';
import RedPoint from '../../components/RedPoint';
import {rowAlignCenter} from '../../contants/CssFE';
import Colors from '../../contants/Colors';

const RegisterDevices = ({navigation, route}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const [allDevice, setAllDevice] = useState([]);
  const [arrRender, setArrRender] = useState([]);
  const [typeDeviceArr, setTypeDeviceArr] = useState([]);
  const [typeDeviceValue, setTypeDeviceValue] = useState('');
  const [deviceArr, setDeviceArr] = useState([]);
  const [deviceValue, setDeviceValue] = useState([]);
  const [dateTime, setDateTime] = useState('date');
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const fetchAllDevices = async () => {
    try {
      const data = await getAllDevices();

      let filterType = [];
      data.forEach(item => {
        const typeExist = filterType.some(
          type => type.typeDevice == item.loaithietbi,
        );
        if (!typeExist) {
          filterType.push({typeDevice: item.loaithietbi});
        }
      });

      const tempArr = arrRender;
      tempArr.push({type: filterType, name: [], typeValue: [], nameValue: []});

      setArrRender(tempArr);
      setAllDevice(data);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    fetchAllDevices();
  }, []);

  const RenderOptionData = ({data, index}) => {
    return (
      <View
        key={index}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={[styles.containerEachLine, {width: '42%'}]}>
          <View style={rowAlignCenter}>
            <Text style={styles.title}>Chọn loại thiết bị</Text>
            <RedPoint />
          </View>
          <Dropdown
            style={styles.dropdown}
            placeholder="Chọn loại thiết bị"
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
            data={data.type}
            maxHeight={Dimension.setHeight(30)}
            labelField="typeDevice"
            valueField="typeDevice"
            value={data.typeValue}
            onChange={item => {
              const updatedArrRender = [...arrRender];
              updatedArrRender[index].typeValue = item.typeDevice;

              const filterItem = allDevice
                .filter(device => device.loaithietbi === item.typeDevice)
                .map(devices => {
                  return {
                    id: devices.id,
                    seri: devices.seri,
                  };
                });

              updatedArrRender[index].name = filterItem;
              setArrRender(updatedArrRender);
            }}
          />
        </View>
        <View style={[styles.containerEachLine, {width: '55%'}]}>
          <View style={rowAlignCenter}>
            <Text style={styles.title}>Chọn thiết bị</Text>
            <RedPoint />
          </View>
          <MultiSelect
            style={styles.dropdown}
            autoScroll={false}
            showsVerticalScrollIndicator={false}
            placeholderStyle={[
              styles.placeholderStyle,
              {
                color:
                  data.name.length != 0
                    ? Colors.DEFAULT_BLACK
                    : Colors.INACTIVE_GREY,
              },
            ]}
            selectedStyle={styles.selectedStyle}
            selectedTextStyle={[
              styles.selectedTextStyle,
              {
                fontSize: Dimension.fontSize(13),
              },
            ]}
            containerStyle={styles.containerOptionStyle}
            iconStyle={styles.iconStyle}
            itemContainerStyle={styles.itemContainer}
            itemTextStyle={styles.itemText}
            fontFamily={Fonts.SF_MEDIUM}
            activeColor="#eef2feff"
            alwaysRenderSelectedItem={false}
            visibleSelectedItem={false}
            data={data.name}
            maxHeight={Dimension.setHeight(30)}
            labelField="seri"
            valueField="id"
            placeholder={`${data.nameValue.length} thiết bị đã chọn`}
            value={data.nameValue}
            onChange={item => {
              const updatedArrRender = [...arrRender];
              updatedArrRender[index].nameValue = item;

              console.log(item);

              setArrRender(updatedArrRender);
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header title="Đăng kí sử dụng thiết bị" navigation={navigation} />
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
                  style={{height: 40, width: 40}}
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

            <FlatList
              showsVerticalScrollIndicator={false}
              data={arrRender}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({item, index}) => (
                <RenderOptionData data={item} index={index} />
              )}
              initialNumToRender={6}
              windowSize={6}
              removeClippedSubviews={true}
              extraData={arrRender}
            />

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
                    <Text style={styles.dateTimeText}>{''}</Text>
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
                    <Text style={styles.dateTimeText}>{''}</Text>
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

export default RegisterDevices;
