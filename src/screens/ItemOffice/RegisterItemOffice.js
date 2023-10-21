import React, {useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Dimension from '../../contants/Dimension';
import Header from '../../components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {ToastAlert, ToastSuccess} from '../../components/Toast';
import {
  compareDate,
  formatDate,
  formatDateToPost,
  formatTime,
  formatTimeToPost,
  getCurrentDate,
  getCurrentTime,
} from '../../utils/serviceFunction';
import RegisterBtn from '../../components/RegisterBtn';
import {
  getAllListOfficeItem,
  getAllOfficeItem,
  registerOfficeItem,
} from '../../redux/apiRequest';
import {shadowIOS} from '../../contants/propsIOS';
import {mainURL} from '../../contants/Variable';
import Loading from '../../components/LoadingUI';
import LinearGradientUI from '../../components/LinearGradientUI';
import RedPoint from '../../components/RedPoint';
import {rowAlignCenter} from '../../contants/CssFE';
import Colors from '../../contants/Colors';
import {Swipeable} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

if (Platform.OS == 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RegisterItemOffice = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const [allItem, setAllItem] = useState([]);
  const [arrRender, setArrRender] = useState([]);
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dateTime, setDateTime] = useState('date');
  const [receiveDate, setReceiveDate] = useState(getCurrentDate());
  const [receiveTime, setReceiveTime] = useState(getCurrentTime());

  const handlePickType = (item, index) => {
    const updatedArrRender = [...arrRender];

    const checkExist = updatedArrRender.some(
      filter => filter.typeValue == item.id,
    );

    if (checkExist) {
      ToastAlert('Văn phòng phẩm đã tồn tại!');
    } else {
      updatedArrRender[index].typeValue = item.id;
      updatedArrRender[index].unit = item.donvitinh;
      updatedArrRender[index].quantity = 1;

      setArrRender(updatedArrRender);
    }
  };

  const handleAddDevice = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updatedArrRender = [...arrRender];

    updatedArrRender.push({
      type: allItem,
      unit: '',
      typeValue: '',
      quantity: 0,
      isOpen: false,
    });

    setArrRender(updatedArrRender);
  };

  const handleDelete = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
    if (dateTime == 'date') {
      compareDate(new Date(), date)
        ? setReceiveDate(formatDate(date))
        : ToastAlert(message);
    } else {
      setReceiveTime(formatTime(date));
    }
    setToggleDatePicker(false);
  };

  const handleRegister = async () => {
    let idItem = [];
    let quantityItem = [];
    arrRender.forEach(item => {
      if (item.quantity != 0) {
        idItem.push(item.typeValue);
        quantityItem.push(item.quantity);
      }
    });

    if (idItem.length != 0 && quantityItem.length != 0) {
      const data = {
        id_user: user?.id,
        loaivpp: idItem,
        soluong: quantityItem,
        ngaynhan: formatDateToPost(receiveDate),
        gionhan: formatTimeToPost(receiveTime),
      };

      setLoading(true);
      try {
        const res = await registerOfficeItem(data);

        if (res) {
          fetchOfficeItemList();
          ToastSuccess('Đăng kí văn phòng phẩm thành công!');
          setLoading(false);
          navigation.goBack();
        }
      } catch (error) {}
    } else {
      ToastAlert('Chưa nhập đầy đủ thông tin!');
    }
  };

  const fetchOfficeItemList = async () => {
    await getAllListOfficeItem(dispatch);
  };

  const fetchAllIOfficeItem = async () => {
    try {
      const data = await getAllOfficeItem();

      const tempArr = [...arrRender];
      tempArr.push({
        type: data,
        unit: '',
        typeValue: '',
        quantity: 0,
        isOpen: false,
      });

      setArrRender(tempArr);
      setAllItem(data);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    fetchAllIOfficeItem();
  }, []);

  const RenderOptionData = ({data, index}) => {
    const rightSwipe = () => {
      return (
        <View style={styles.rightSwipeContainer}>
          <TouchableOpacity
            onPress={() => {
              handleDelete(index);
            }}
            style={styles.btnRightSwipe}>
            <Image source={Images.delete} style={{width: 40, height: 40}} />
          </TouchableOpacity>
        </View>
      );
    };
    return (
      <Swipeable
        renderRightActions={() => {
          return rightSwipe(index);
        }}>
        <View
          key={index}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={[styles.containerEachLine, {width: '52%'}]}>
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
              data={data.type}
              maxHeight={Dimension.setHeight(30)}
              labelField="vpp"
              valueField="id"
              value={data.typeValue}
              onChange={item => {
                handlePickType(item, index);
              }}
            />
          </View>
          <View
            style={[
              styles.containerEachLine,
              {
                width: '45%',
                height: hp('9%'),
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}>
            <Text style={[styles.title, {alignSelf: 'center'}]}>Số lượng</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (data.typeValue.length == 0) {
                    return ToastAlert('Chưa chọn loại văn phòng phẩm!');
                  }

                  if (data.quantity > 1) {
                    const updatedArrRender = [...arrRender];
                    updatedArrRender[index].quantity =
                      updatedArrRender[index].quantity - 1;

                    setArrRender(updatedArrRender);
                  }
                }}>
                <Image style={{height: 22, width: 22}} source={Images.minus} />
              </TouchableOpacity>
              <Text
                style={{
                  marginHorizontal: Dimension.setWidth(3),
                  fontFamily: Fonts.SF_MEDIUM,
                  fontSize: Dimension.fontSize(16),
                }}>
                {`${data.quantity} ${data.unit}`}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (data.typeValue.length == 0) {
                    return ToastAlert('Chưa chọn loại văn phòng phẩm!');
                  }

                  const updatedArrRender = [...arrRender];
                  updatedArrRender[index].quantity =
                    updatedArrRender[index].quantity + 1;

                  setArrRender(updatedArrRender);
                }}>
                <Image style={{height: 22, width: 22}} source={Images.plus} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header title="Đăng kí văn phòng phẩm" navigation={navigation} />
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
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setDateTime('date');
                  setToggleDatePicker(true);
                }}
                style={[
                  styles.containerEachLine,
                  {
                    width: '48%',
                  },
                ]}>
                <View style={rowAlignCenter}>
                  <Text style={styles.title}>Ngày nhận</Text>
                  <RedPoint />
                </View>
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
              <TouchableOpacity
                onPress={() => {
                  setDateTime('time');
                  setToggleDatePicker(true);
                }}
                style={[
                  styles.containerEachLine,
                  {
                    width: '48%',
                  },
                ]}>
                <View style={rowAlignCenter}>
                  <Text style={styles.title}>Giờ nhận</Text>
                  <RedPoint />
                </View>
                <View style={styles.dateTimePickerContainer}>
                  <Text style={styles.dateTimeText}>{receiveTime}</Text>
                  <View
                    style={[
                      styles.dateTimeImgContainer,
                      {backgroundColor: '#dbd265'},
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

            <RegisterBtn nameBtn={'Đăng kí'} onEvent={handleRegister} />
          </KeyboardAwareScrollView>
        </ScrollView>
        <TouchableOpacity
          onPress={handleAddDevice}
          style={{
            position: 'absolute',
            bottom: hp('11%'),
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

  rightSwipeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingBottom: Dimension.setHeight(1.6),
  },
});

export default RegisterItemOffice;
