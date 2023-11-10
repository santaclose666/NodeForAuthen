import React, {useState, useLayoutEffect, useCallback, memo} from 'react';
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
import {fontDefault} from '../../contants/Variable';
import {useForm, useFieldArray, Controller} from 'react-hook-form';

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

const RegisterRepair = ({navigation, route}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const unit = route.params.unit;
  const idByUnit = unit === 'IFEE' ? user?.id_ifee : user?.id_xmg;
  const subject = useSelector(state => state.subject?.subject?.data);
  const dispatch = useDispatch();
  const [listDevice, setListDevice] = useState([]);
  const [arrRender, setArrRender] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registerPerson, setRegisterPerson] = useState(user?.hoten);
  const [subjectValue, setSubjectValue] = useState(
    (subject || temp)?.filter(item => item.id === parseInt(user?.id_phong))[0]
      ?.id,
  );
  const {register, control, handleSubmit} = useForm();
  const {fields, append, remove, update} = useFieldArray({
    control,
    name: 'listDevices',
  });

  const startAnimation = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const handleRegister = async data => {
    console.log(data);
  };

  const handlePickType = (item, index) => {
    const checkExist = fields.some(filter => filter.listValue == item.thietbi);
    if (checkExist) {
      ToastAlert('Thiết bị đã tồn tại!');
    } else {
      if (item.thietbi == 'Khác') {
        update(index, {
          list: listDevice,
          listValue: '',
          status: '',
          isOther: true,
        });
      } else {
        update(index, {
          list: listDevice,
          listValue: item.thietbi,
          status: '',
          isOther: false,
        });
      }
    }
  };

  const fetchAllDevices = async () => {
    try {
      const donvi = {
        tendonvi: unit,
      };
      const data = await getRepairList(donvi);
      const list = [...data, {id: data?.length + 1, thietbi: 'Khác'}];

      update(0, {list: list, listValue: '', status: '', isOther: false});

      setListDevice(list);
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
            startAnimation();
            remove(index);
          }}
          style={styles.btnRightSwipe}>
          <Image source={Images.delete} style={{width: 40, height: 40}} />
        </TouchableOpacity>
      </View>
    );
  };

  const RenderOptionData = memo(({data, index}) => {
    console.log(data.isOrther);
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
                    update(index, {
                      list: listDevice,
                      listValue: '',
                      status: '',
                      isOther: false,
                    });
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
                data={data.list}
                maxHeight={Dimension.setHeight(30)}
                labelField="thietbi"
                valueField="thietbi"
                value={data.listValue}
                onChange={item => {
                  handlePickType(item, index);
                }}
              />
            ) : (
              <TextInput
                {...register(`listDevices.${index}.listValue`, {
                  required: true,
                })}
              />
            )}
          </View>
          <View style={[styles.containerEachLine, {width: '48.6%'}]}>
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

            <TextInput
              {...register(`listDevices.${index}.status`, {required: true})}
            />
          </View>
        </View>
      </Swipeable>
    );
  });

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
              data={fields}
              keyExtractor={item => item.id}
              renderItem={({item, index}) => (
                <RenderOptionData data={item} index={index} />
              )}
              initialNumToRender={6}
              windowSize={6}
              removeClippedSubviews={true}
            />
            <RegisterBtn
              nameBtn={'Đăng kí'}
              onEvent={handleSubmit(handleRegister)}
            />
          </KeyboardAwareScrollView>
        </ScrollView>
        <AddBtn
          event={() => {
            console.log(fields);
            startAnimation();
            append({
              list: listDevice,
              listValue: '',
              status: '',
              isOther: false,
            });
          }}
        />
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
