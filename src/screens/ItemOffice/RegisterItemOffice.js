import React, {useState, useLayoutEffect, memo} from 'react';
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {ToastAlert, ToastSuccess} from '../../components/Toast';
import {
  compareDate,
  formatDate,
  formatDateToPost,
  formatTime,
  formatTimeToPost,
  getCurrentDate,
} from '../../utils/serviceFunction';
import RegisterBtn from '../../components/RegisterBtn';
import {
  getAllDevices,
  getAllOfficeItem,
  registerDevice,
} from '../../redux/apiRequest';
import {shadowIOS} from '../../contants/propsIOS';
import {mainURL} from '../../contants/Variable';
import Loading from '../../components/LoadingUI';
import LinearGradientUI from '../../components/LinearGradientUI';
import RedPoint from '../../components/RedPoint';
import {rowAlignCenter} from '../../contants/CssFE';
import Colors from '../../contants/Colors';

const retunOption = [
  {label: 'Có trả', value: 0},
  {label: 'Không trả', value: 1},
];

const RegisterItemOffice = ({navigation, route}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const [allItem, setAllItem] = useState([]);
  const [arrRender, setArrRender] = useState([]);
  const [typeDeviceArr, setTypeDeviceArr] = useState([]);
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkDateInput, setCheckDateInput] = useState('');
  const [returnValue, setReturnValue] = useState(0);
  const [borrowDate, setBorrowDate] = useState(getCurrentDate());
  const [returnDate, setReturnDate] = useState('');
  const [content, setContent] = useState('');

  const handlePickType = (item, index) => {
    const updatedArrRender = [...arrRender];

    const checkExist = updatedArrRender.some(
      filter => filter.typeValue == item.typeDevice,
    );

    if (checkExist) {
      ToastAlert('Loại thiết bị đã tồn tại!');
    } else {
      updatedArrRender[index].typeValue = item.typeDevice;
      updatedArrRender[index].nameValue = [];
      const filterItem = allItem
        .filter(device => device.loaithietbi === item.typeDevice)
        .map(devices => {
          return {
            id: devices.id,
            seri: devices.seri,
          };
        });

      updatedArrRender[index].name = filterItem;
      setArrRender(updatedArrRender);
    }
  };

  const handleAddDevice = () => {
    const updatedArrRender = [...arrRender];

    updatedArrRender.push({
      type: typeDeviceArr,
      name: [],
      typeValue: [],
      nameValue: [],
    });

    setArrRender(updatedArrRender);
  };

  const handleDelete = index => {
    const updatedArrRender = [...arrRender];

    if (updatedArrRender.length == 1) {
      return;
    } else {
      updatedArrRender.splice(index, 1);

      setArrRender(updatedArrRender);
    }
  };

  const handlePickDate = date => {
    const message = 'Ngày vừa chọn không hợp lệ';
    if (checkDateInput == 'borrow') {
      compareDate(borrowDate, date) &&
      (returnDate.length == 0 || compareDate(date, returnDate))
        ? setBorrowDate(formatDate(date))
        : ToastAlert(message);
    } else {
      compareDate(borrowDate, date)
        ? setReturnDate(formatDate(date))
        : ToastAlert(message);
    }
    setToggleDatePicker(false);
  };

  const handleRegister = async () => {
    let idDevice = [];
    arrRender.forEach(item => {
      idDevice.push(...item.nameValue);
    });

    if (
      idDevice.length != 0 &&
      borrowDate.length != 0 &&
      returnDate.length != 0 &&
      content.length != 0
    ) {
      const data = {
        id_user: user.id,
        thietbi: idDevice,
        ngaymuon: formatDateToPost(borrowDate),
        ngaytra: formatDateToPost(returnDate),
        noidung: content,
        active: returnValue,
      };

      setLoading(true);
      try {
        const res = await registerDevice(data);

        if (res) {
          setLoading(false);
        }
      } catch (error) {}
    } else {
      ToastAlert('Chưa nhập đầy đủ thông tin!');
    }
  };

  const fetchAllIOfficeItem = async () => {
    try {
      const data = await getAllOfficeItem();

      const tempArr = arrRender;
      tempArr.push({type: data, name: [], typeValue: [], nameValue: []});

      setArrRender(data);
      setAllItem(data);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    fetchAllIOfficeItem();
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
        <View style={[styles.containerEachLine, {width: '50%'}]}>
          <View style={rowAlignCenter}>
            <Text style={styles.title}>Loại văn phòng phẩm</Text>
            <RedPoint />
          </View>
          <Dropdown
            style={styles.dropdown}
            placeholder="Chọn loại VPP"
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
            data={data.vpp}
            maxHeight={Dimension.setHeight(30)}
            labelField="vpp"
            valueField="vpp"
            value={data.typeValue}
            onChange={item => {
              handlePickType(item, index);
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            handleDelete(index);
          }}
          style={{alignSelf: 'center'}}>
          <Image style={{width: 18, height: 18}} source={Images.minus} />
        </TouchableOpacity>
        <View style={[styles.containerEachLine, {width: '42%'}]}>
          <View style={rowAlignCenter}>
            <Text style={styles.title}>Số lượng</Text>
            <RedPoint />
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header title="Đăng kí văn phòng phẩm" navigation={navigation} />
        <ScrollView style={{flex: 1}}>
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: Dimension.setWidth(1.6),
                }}>
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

            <FlatList
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              data={arrRender}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({item, index}) => (
                <RenderOptionData data={item} index={index} />
              )}
              initialNumToRender={6}
              windowSize={6}
              removeClippedSubviews={true}
            />

            <View style={[styles.containerEachLine, {width: '100%'}]}>
              <View style={rowAlignCenter}>
                <Text style={styles.title}>Dạng đăng kí</Text>
                <RedPoint />
              </View>
              <Dropdown
                style={styles.dropdown}
                placeholder="Chọn dạng đăng kí"
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
                data={retunOption}
                maxHeight={Dimension.setHeight(30)}
                labelField="label"
                valueField="value"
                value={returnValue}
                onChange={item => {
                  setReturnValue(item.value);
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
                  setCheckDateInput('borrow');
                  setToggleDatePicker(true);
                }}
                style={[
                  styles.containerEachLine,
                  {
                    width: '48%',
                  },
                ]}>
                <View style={rowAlignCenter}>
                  <Text style={styles.title}>Ngày mượn</Text>
                  <RedPoint />
                </View>
                <View style={styles.dateTimePickerContainer}>
                  <Text style={styles.dateTimeText}>{borrowDate}</Text>
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
                  setCheckDateInput('return');
                  setToggleDatePicker(true);
                }}
                style={[
                  styles.containerEachLine,
                  {
                    width: '48%',
                  },
                ]}>
                <View style={rowAlignCenter}>
                  <Text style={styles.title}>Ngày trả</Text>
                  <RedPoint />
                </View>
                <View style={styles.dateTimePickerContainer}>
                  <Text style={styles.dateTimeText}>{returnDate}</Text>
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
              <DateTimePickerModal
                isVisible={toggleDatePicker}
                mode={'date'}
                onConfirm={handlePickDate}
                onCancel={() => {
                  setToggleDatePicker(false);
                }}
              />
            </View>

            <View style={[styles.containerEachLine, {width: '100%'}]}>
              <View style={rowAlignCenter}>
                <Text style={styles.title}>Nội dung sử dụng</Text>
                <RedPoint />
              </View>
              <TextInput
                multiline={true}
                style={styles.inputText}
                placeholder="Nhập nội dung"
                value={content}
                onChangeText={e => {
                  setContent(e);
                }}
              />
            </View>
            <RegisterBtn nameBtn={'Đăng kí'} onEvent={handleRegister} />
          </KeyboardAwareScrollView>
        </ScrollView>
        <TouchableOpacity
          onPress={handleAddDevice}
          style={{
            position: 'absolute',
            bottom: Dimension.setHeight(4),
            right: Dimension.setWidth(7),
            padding: 10,
            backgroundColor: Colors.DEFAULT_GREEN,
            borderRadius: 50,
            opacity: 0.75,
          }}>
          <Image
            source={Images.add}
            style={{width: 22, height: 22, tintColor: '#ffffff'}}
          />
        </TouchableOpacity>
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
    paddingVertical: Dimension.setHeight(1),
    paddingHorizontal: Dimension.setWidth(2),
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
    fontSize: Dimension.fontSize(13),
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

export default RegisterItemOffice;
