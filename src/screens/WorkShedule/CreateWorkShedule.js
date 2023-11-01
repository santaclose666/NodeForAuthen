import React, {useState, useLayoutEffect} from 'react';
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {ToastAlert, ToastSuccess} from '../../components/Toast';
import {
  compareDate,
  formatDate,
  formatDateToPost,
} from '../../utils/serviceFunction';
import RegisterBtn from '../../components/RegisterBtn';
import {useDispatch} from 'react-redux';
import {getAllWorkName, registerWorkSchedule} from '../../redux/apiRequest';
import {shadowIOS} from '../../contants/propsIOS';
import {mainURL} from '../../contants/Variable';
import Loading from '../../components/LoadingUI';
import LinearGradientUI from '../../components/LinearGradientUI';
import RedPoint from '../../components/RedPoint';
import {rowAlignCenter} from '../../contants/CssFE';

const optionData = [
  {
    label: 'Lịch công tác',
    value: 'Lịch công tác',
  },
];

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

const CreateWorkSchedule = ({navigation, route}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const workNameData = useSelector(state => state.work.works?.data);
  const [optionValue, setOptionValue] = useState(optionData[0].value);
  const [workValue, setWorkValue] = useState(workData[0].value);
  const [workNameValue, setWorkNameValue] = useState('');
  const [placeInput, setPlaceInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [clueInput, setClueInput] = useState('');
  const [componentInput, setComponentInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [ortherWorkInput, setOrtherWorkInput] = useState('');
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [checkPick, setCheckPick] = useState(null);
  const [startDay, setStartDay] = useState(formatDate(new Date()));
  const [endDay, setEndDay] = useState(null);
  const [apiCall, setApiCall] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchWorkNameData = async () => {
    const data ={
      tendonvi: user?.tendonvi
    }
    await getAllWorkName(dispatch, data);
  };

  useLayoutEffect(() => {
    fetchWorkNameData();
  }, []);

  const handlePickDate = date => {
    setToggleDatePicker(false);
    if (checkPick) {
      const dayStart = formatDate(date);
      if (endDay !== null) {
        compareDate(date, endDay)
          ? setStartDay(dayStart)
          : ToastAlert('Ngày bắt đầu không hợp lệ');
      } else {
        compareDate(new Date(), date)
          ? setStartDay(dayStart)
          : ToastAlert('Ngày bắt đầu không hợp lệ');
      }
    } else {
      const dayEnd = formatDate(date);
      compareDate(startDay, date)
        ? setEndDay(dayEnd)
        : ToastAlert('Ngày kết thúc không hợp lệ');
    }
  };

  const handleRegister = async () => {
    const checkOp =
      workValue === 1
        ? {op1_tenchuongtrinh: workNameValue}
        : {op2_tenchuongtrinh: ortherWorkInput};

    const data = {
      id_user: user?.id,
      tungay: formatDateToPost(startDay),
      denngay: formatDateToPost(endDay),
      diadiem: placeInput,
      noidung: contentInput,
      daumoi: clueInput,
      thanhphan: componentInput,
      ghichu: noteInput,
      op_tenchuongtrinh: workValue,
      ...checkOp,
    };

    if (
      endDay !== null &&
      placeInput !== '' &&
      contentInput !== '' &&
      (workValue === 2 ? ortherWorkInput !== '' : workNameValue !== '')
    ) {
      setLoading(true);

      try {
        const res = await registerWorkSchedule(data);

        if (res) {
          ToastSuccess('Đăng kí lịch công tác thành công');
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
            <View style={styles.containerEachLine}>
              <View style={rowAlignCenter}>
                <Text style={styles.title}>Lựa chọn loại</Text>
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
                      source={Images.work}
                      style={styles.leftIconDropdown}
                    />
                  );
                }}
                activeColor="#eef2feff"
                data={optionData}
                maxHeight={Dimension.setHeight(30)}
                labelField="label"
                valueField="value"
                value={optionValue}
                onChange={item => {
                  setOptionValue(item.value);
                }}
              />
            </View>

            <View style={styles.containerEachLine}>
              <View style={rowAlignCenter}>
                <Text style={styles.title}>Địa điểm</Text>
                <RedPoint />
              </View>
              <TextInput
                style={styles.inputText}
                placeholder="Nhập địa điểm"
                value={placeInput}
                onChangeText={e => setPlaceInput(e)}
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
                <View style={rowAlignCenter}>
                  <Text style={styles.title}>Từ ngày</Text>
                  <RedPoint />
                </View>

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
                <View style={rowAlignCenter}>
                  <Text style={styles.title}>Đến ngày</Text>
                  <RedPoint />
                </View>

                <View style={styles.dateTimePickerContainer}>
                  <Text style={styles.dateTimeText}>
                    {endDay ? endDay : 'Chọn ngày'}
                  </Text>
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
            <DateTimePickerModal
              isVisible={toggleDatePicker}
              mode="date"
              onConfirm={handlePickDate}
              onCancel={() => {
                setToggleDatePicker(false);
              }}
            />
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
                  valueField="id"
                  value={workNameValue}
                  onChange={item => {
                    setWorkNameValue(item.id);
                  }}
                />
              ) : (
                <TextInput
                  style={styles.inputText}
                  placeholder="Nhập tên chương trình"
                  value={ortherWorkInput}
                  onChangeText={e => setOrtherWorkInput(e)}
                />
              )}
            </View>

            <View style={styles.containerEachLine}>
              <View style={rowAlignCenter}>
                <Text style={styles.title}>Nội dung</Text>
                <RedPoint />
              </View>
              <TextInput
                style={styles.inputText}
                placeholder="Nhập nội dung"
                value={contentInput}
                onChangeText={e => setContentInput(e)}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={[styles.containerEachLine, {width: '48%'}]}>
                <Text style={styles.title}>Đầu mối</Text>
                <TextInput
                  style={styles.inputText}
                  value={clueInput}
                  onChangeText={e => setClueInput(e)}
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
                  style={styles.inputText}
                  value={componentInput}
                  onChangeText={e => setComponentInput(e)}
                />
              </View>
            </View>

            <View style={styles.containerEachLine}>
              <Text style={styles.title}>Ghi chú</Text>
              <TextInput
                style={styles.inputText}
                placeholder="Ghi chú"
                value={noteInput}
                onChangeText={e => setNoteInput(e)}
              />
            </View>

            <RegisterBtn nameBtn={'Thực hiện'} onEvent={handleRegister} />
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

  inputText: {
    borderBottomWidth: 0.6,
    borderBottomColor: 'gray',
    marginHorizontal: Dimension.setWidth(1.6),
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: Dimension.fontSize(16),
    height: Dimension.setHeight(6),
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

export default CreateWorkSchedule;
