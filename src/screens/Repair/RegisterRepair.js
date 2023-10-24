import React, {
  useState,
  useLayoutEffect,
  memo,
  useRef,
  useCallback,
} from 'react';
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
import {useSelector} from 'react-redux';
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
import {getRepairList, registerRepair} from '../../redux/apiRequest';

if (Platform.OS == 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RegisterRepair = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const subject = useSelector(state => state.subject.subject?.data);
  const [listDevice, setListDevice] = useState([]);
  const [arrRender, setArrRender] = useState([
    {
      listValue: null,
      status: '',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [registerPerson, setRegisterPerson] = useState(user.hoten);
  const [subjectValue, setSubjectValue] = useState(0);
  const [textTemp, setTextTemp] = useState('');

  const handlePickType = (item, index) => {
    const updatedArrRender = [...arrRender];

    const checkExist = updatedArrRender.some(
      filter => filter.listValue == item.thietbi,
    );
    if (checkExist) {
      ToastAlert('Thiết bị đã tồn tại!');
    } else {
      updatedArrRender[index].listValue = item.thietbi;

      setArrRender(updatedArrRender);
    }
  };

  const handleChangeText = (text, index) => {
    const updatedArrRender = [...arrRender];
    console.log(text);

    updatedArrRender[index].status = text;
    setArrRender(updatedArrRender);
  };

  const handleAddRepairDevice = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updatedArrRender = [...arrRender];

    updatedArrRender.push({
      listValue: null,
      status: '',
    });
    setArrRender(updatedArrRender);
  };

  const handleDeleteRepairDevice = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updatedArrRender = [...arrRender];

    if (updatedArrRender.length == 1) {
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
      subjectValue.length != 0 &&
      registerPerson.length != 0 &&
      devicePicker.length != 0 &&
      status.length != 0
    ) {
      setLoading(true);
      const data = {
        id_user: user.id,
        id_phong: subjectValue,
        hoten: registerPerson,
        arr_thietbi: devicePicker,
        arr_tinhtrang: status,
      };
      console.log(data);
      try {
        const res = await registerRepair(data);

        if (res) {
          ToastSuccess('Đăng kí thành công');
          setLoading(false);
          navigation.goBack();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      ToastAlert('Chưa nhập đầy đủ thông tin!');
    }
  };

  const fetchAllDevices = async () => {
    try {
      const data = await getRepairList();

      const listDevice = [...data, {id: data.length + 1, thietbi: 'Khác'}];

      setListDevice(listDevice);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
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
                data={listDevice}
                maxHeight={Dimension.setHeight(30)}
                labelField="thietbi"
                valueField="thietbi"
                value={data.listValue}
                onChange={item => {
                  handlePickType(item, index);
                }}
              />
            </View>
            <View style={[styles.containerEachLine, {width: '48.6%'}]}>
              <View style={rowAlignCenter}>
                <Text style={styles.title}>Tình trạng hoạt động</Text>
                <RedPoint />
              </View>
              <TextInput
                style={styles.inputText}
                value={data.status}
                onChangeText={e => {
                  handleChangeText(e, index);
                }}
              />
            </View>
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
                data={subject}
                maxHeight={Dimension.setHeight(30)}
                labelField="bomon"
                valueField="id"
                value={subjectValue}
                onChange={item => {
                  setSubjectValue(item.id);
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
});

export default RegisterRepair;
