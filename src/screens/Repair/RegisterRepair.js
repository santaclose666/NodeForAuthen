import React, {useState, useLayoutEffect, useCallback, useRef} from 'react';
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
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Dimension from '../../contants/Dimension';
import Header from '../../components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dropdown} from 'react-native-element-dropdown';
import {ToastAlert, ToastSuccess} from '../../components/Toast';
import RegisterBtn, {AddBtn} from '../../components/RegisterBtn';
import {shadowIOS} from '../../contants/propsIOS';
import Loading from '../../components/LoadingUI';
import LinearGradientUI from '../../components/LinearGradientUI';
import RedPoint from '../../components/RedPoint';
import {rowAlignCenter} from '../../contants/CssFE';
import {Swipeable} from 'react-native-gesture-handler';
import {
  getRepairList,
  registerRepair,
  getSubject,
  getRepairApproveList,
} from '../../redux/apiRequest';
import Colors from '../../contants/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import {fontDefault} from '../../contants/Variable';

if (Platform.OS == 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const temp = [
  {
    id: 2,
    bomon: 'Phòng TH',
  },
  {
    id: 3,
    bomon: 'BM CNMT',
  },
  {
    id: 4,
    bomon: 'BM ST&PTR',
  },
  {
    id: 5,
    bomon: 'BM UDVT',
  },
  {
    id: 6,
    bomon: 'TT CHĐTVR',
  },
  {
    id: 7,
    bomon: 'Phòng R&D',
  },
];

const RegisterRepair = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const subject = useSelector(state => state.subject?.subject?.data);
  const dispatch = useDispatch();
  const [listDevice, setListDevice] = useState([]);
  const [arrRender, setArrRender] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registerPerson, setRegisterPerson] = useState(user.hoten);
  const [subjectValue, setSubjectValue] = useState(
    (subject || temp)?.filter(item => item.id === parseInt(user?.id_phong))[0]
      .id,
  );
  const [toggleModal, setToggleModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [textTemp, setTextTemp] = useState('');
  const [isDevice, setIsDevice] = useState(null);
  const [errInputModal, setErrInputModal] = useState(false);
  const inputModalRef = useRef(null);

  const handleAddRepairDevice = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updatedArrRender = [...arrRender];

    updatedArrRender.push({
      listDevice: listDevice,
      listValue: '',
      status: '',
      isOrther: false,
    });
    setArrRender(updatedArrRender);
  };

  const handleDeleteRepairDevice = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updatedArrRender = [...arrRender];

    if (updatedArrRender?.length == 1) {
      return;
    } else {
      updatedArrRender.splice(index, 1);

      setArrRender(updatedArrRender);
    }
  };

  const handleRegister = async () => {
    const devicePicker = arrRender.map(item => {
      return item.listValue;
    });

    const status = arrRender.map(item => {
      return item.status;
    });

    if (
      subjectValue?.length != 0 &&
      registerPerson?.length != 0 &&
      devicePicker?.length != 0 &&
      status?.length != 0
    ) {
      setLoading(true);
      const data = {
        id_user: user.id,
        id_phong: subjectValue,
        hoten: registerPerson,
        arr_thietbi: devicePicker,
        arr_tinhtrang: status,
      };
      try {
        const res = await registerRepair(data);

        if (res) {
          getRepairApproveList(dispatch);
          ToastSuccess('Đăng kí thành công');
          setLoading(false);

          setTimeout(() => {
            navigation.goBack();
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      ToastAlert('Chưa nhập đầy đủ thông tin!');
    }
  };

  const handlePick = (status, data, index) => {
    setSelectedItem({...data, index});
    setToggleModal(true);
    setIsDevice(status);

    setTimeout(() => {
      inputModalRef.current.focus();
    });
  };

  const handlePickType = (item, index) => {
    const updatedArrRender = [...arrRender];

    const checkExist = updatedArrRender.some(
      filter => filter.listValue == item.thietbi,
    );
    if (checkExist) {
      ToastAlert('Thiết bị đã tồn tại!');
    } else {
      if (item.thietbi == 'Khác') {
        updatedArrRender[index].isOrther = true;
        updatedArrRender[index].listValue = '';
        updatedArrRender[index].status = '';

        setArrRender(updatedArrRender);
        setTimeout(() => {
          handlePick(true, item, index);
        });
      } else {
        updatedArrRender[index].listValue = item.thietbi;

        setArrRender(updatedArrRender);
      }
    }
  };

  const handleConfirmText = () => {
    if (textTemp?.length != 0) {
      let updatedArrRender = [...arrRender];

      if (isDevice) {
        updatedArrRender[selectedItem.index].listValue = textTemp;
      } else {
        updatedArrRender[selectedItem.index].status = textTemp;
      }

      setArrRender(updatedArrRender);
      setToggleModal(false);
      setErrInputModal(false);
      setTextTemp('');
    } else {
      setErrInputModal(true);
    }
  };

  const fetchAllDevices = async () => {
    try {
      const data = await getRepairList();

      const listDevice = [...data, {id: data?.length + 1, thietbi: 'Khác'}];
      const tempArr = [
        {
          listDevice: listDevice,
          listValue: '',
          status: '',
          isOrther: false,
        },
      ];

      setArrRender(tempArr);
      setListDevice(listDevice);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    if (!subject) {
      getSubject(dispatch);
    }
    fetchAllDevices();
  }, []);

  const rightSwipe = index => {
    return (
      <View style={styles.rightSwipeContainer}>
        <TouchableOpacity
          onPress={() => {
            handleDeleteRepairDevice(index);
          }}
          style={styles.btnRightSwipe}>
          <Image source={Images.delete} style={{width: 40, height: 40}} />
        </TouchableOpacity>
      </View>
    );
  };

  const RenderOptionData = useCallback(
    ({data, index}) => {
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
            <View style={[styles.containerEachLine, {width: '48.6%'}]}>
              <View style={rowAlignCenter}>
                <Text style={styles.title}>Loại thiết bị</Text>
                <RedPoint />
                {data.isOrther && (
                  <TouchableOpacity
                    onPress={() => {
                      const updatedArrRender = [...arrRender];
                      updatedArrRender[index].listValue = '';
                      updatedArrRender[index].status = '';
                      updatedArrRender[index].isOrther = false;

                      setArrRender(updatedArrRender);
                    }}
                    style={{marginLeft: '28%'}}>
                    <Image
                      source={Images.arrow}
                      style={{
                        width: 20,
                        height: 20,
                        tintColor: Colors.DEFAULT_GREEN,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {!data.isOrther ? (
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
                  data={data.listDevice}
                  maxHeight={Dimension.setHeight(30)}
                  labelField="thietbi"
                  valueField="thietbi"
                  value={data.listValue}
                  onChange={item => {
                    handlePickType(item, index);
                  }}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    handlePick(true, data, index);
                  }}>
                  <Text style={styles.textPicker}>{data.listValue}</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              disabled={data.listValue?.length > 0 ? false : true}
              onPress={() => {
                handlePick(false, data, index);
              }}
              style={[styles.containerEachLine, {width: '48.6%'}]}>
              <View style={rowAlignCenter}>
                <Text
                  style={[
                    styles.title,
                    {
                      color:
                        data.listValue?.length > 0
                          ? '#8bc7bc'
                          : Colors.INACTIVE_GREY,
                    },
                  ]}>
                  Tình trạng hoạt động
                </Text>
                <RedPoint />
              </View>

              <Text style={styles.textPicker}>{data.status}</Text>
            </TouchableOpacity>
          </View>
        </Swipeable>
      );
    },
    [arrRender],
  );

  return (
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header title="Đăng kí sửa chữa" navigation={navigation} />
        <ScrollView keyboardShouldPersistTaps="always" style={{flex: 1}}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="always"
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
            <View style={[styles.containerEachLine, {width: '100%'}]}>
              <View style={rowAlignCenter}>
                <Text style={styles.title}>Người đăng kí</Text>
                <RedPoint />
              </View>
              <TextInput
                style={styles.inputText}
                value={registerPerson}
                onChangeText={e => {
                  setRegisterPerson(e);
                }}
              />
            </View>

            <View style={[styles.containerEachLine, {width: '100%'}]}>
              <View style={rowAlignCenter}>
                <Text style={styles.title}>Phòng / Bộ môn</Text>
                <RedPoint />
              </View>
              <Dropdown
                style={styles.dropdown}
                placeholder="Chọn phòng / bộ môn"
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
                data={subject || temp}
                maxHeight={Dimension.setHeight(30)}
                labelField="bomon"
                valueField="id"
                value={subjectValue}
                onChange={item => {
                  setSubjectValue(item?.id);
                }}
              />
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
            <RegisterBtn nameBtn={'Đăng kí'} onEvent={handleRegister} />
          </KeyboardAwareScrollView>
        </ScrollView>
        <Modal
          isVisible={toggleModal}
          animationIn="fadeInUp"
          animationInTiming={100}
          animationOut="fadeOutDown"
          animationOutTiming={100}
          avoidKeyboard={true}>
          <View
            style={{
              flex: 1,
              position: 'absolute',
              alignSelf: 'center',
              width: Dimension.setWidth(85),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 14,
              paddingHorizontal: Dimension.setWidth(3),
              backgroundColor: '#e6d2c0',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: Dimension.setHeight(1),
                borderBottomWidth: 0.8,
                borderBlockColor: Colors.INACTIVE_GREY,
                width: '100%',
                height: Dimension.setHeight(4.5),
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SF_BOLD,
                  fontSize: Dimension.fontSize(20),
                  color: '#f0b263',
                }}>
                Tình trạng
              </Text>
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: Dimension.setHeight(1.5),
                paddingHorizontal: Dimension.setWidth(3),
                width: '100%',
              }}>
              <Image
                source={Images.brokenItem}
                style={{height: 55, width: 55}}
              />
              <Text
                style={{
                  marginLeft: Dimension.setWidth(3),
                  fontSize: Dimension.fontSize(17),
                  fontFamily: Fonts.SF_MEDIUM,
                  textAlign: 'center',
                  ...fontDefault,
                }}>
                {`Thiết bị lỗi: ${selectedItem?.listValue}`}
              </Text>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 12,
                  width: '86%',
                  paddingLeft: 6,
                  borderWidth: 1,
                  borderColor: !errInputModal ? Colors.INACTIVE_GREY : 'red',
                }}>
                <TextInput
                  ref={inputModalRef}
                  style={{
                    width: '100%',
                    height: Platform.OS == 'ios' ? hp('4%') : 'auto',
                  }}
                  placeholder={
                    isDevice ? 'Nhập thiết bị khác' : 'Mô tả tình trạng lỗi'
                  }
                  value={textTemp}
                  onChangeText={e => {
                    setTextTemp(e);
                  }}
                />
              </View>
            </View>

            <View
              style={[
                styles.containerEachLineModal,
                {
                  width: Dimension.setWidth(56),
                  justifyContent: 'space-between',
                },
              ]}>
              <TouchableOpacity
                onPress={handleConfirmText}
                style={[
                  styles.confirmBtn,
                  {
                    borderColor: '#57b85d',
                  },
                ]}>
                <Text style={[styles.textConfirm, {color: '#57b85d'}]}>
                  Xác nhận
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setToggleModal(false);
                  setErrInputModal(false);
                }}
                style={[styles.confirmBtn, {borderColor: '#f0b263'}]}>
                <Text style={[styles.textConfirm, {color: '#f0b263'}]}>
                  Hủy bỏ
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                setToggleModal(false);
                setErrInputModal(false);
              }}
              style={{position: 'absolute', right: 8, top: 8}}>
              <Image source={Images.minusclose} style={styles.btnModal} />
            </TouchableOpacity>
          </View>
        </Modal>
        <AddBtn event={handleAddRepairDevice} />
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

  textPicker: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.INACTIVE_GREY,
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: wp('3.8%'),
    marginTop: hp('1%'),
  },

  btnModal: {
    width: 28,
    height: 28,
  },
  confirmBtn: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f25157',
    paddingVertical: Dimension.setHeight(0.5),
    paddingHorizontal: Dimension.setWidth(2),
    width: Dimension.setWidth(25),
  },
  textConfirm: {
    fontSize: Dimension.fontSize(16),
    fontFamily: Fonts.SF_MEDIUM,
  },
  containerEachLineModal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Dimension.setHeight(1.3),
  },
});

export default RegisterRepair;