import React, {useCallback, useLayoutEffect, useState} from 'react';
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
import {ToastAlert, ToastSuccess} from '../../components/Toast';
import RegisterBtn from '../../components/RegisterBtn';
import {shadowIOS} from '../../contants/propsIOS';
import {mainURL} from '../../contants/Variable';
import Loading from '../../components/LoadingUI';
import LinearGradient from 'react-native-linear-gradient';
import {postNotifcation} from '../../redux/apiRequest';

const group = [
  {
    title: 'Tất cả mọi người',
    id: 1,
  },
  {
    title: 'Trưởng bộ phận',
    id: 2,
  },
  {
    title: 'Trưởng/phó bộ phận',
    id: 3,
  },
  {
    title: 'Phòng/bộ môn/trung tâm',
    id: 4,
  },
  {
    title: 'Người cụ thể',
    id: 5,
  },
];

const IFEEFull = [
  {name: 'Phòng Tổng hợp', ortherName: 'Tổng hợp'},
  {name: 'Bộ môn Công nghệ môi trường', ortherName: 'CNMT'},
  {name: 'Phòng Nghiên cứu và Phát triển', ortherName: 'RnD'},
  {name: 'Bộ môn Sinh thái và Phát triển rừng', ortherName: 'STPTR'},
  {name: 'Bộ môn Ứng dụng viễn thám trong Lâm nghiệp', ortherName: 'UDVT'},
  {
    name: 'Trung tâm nghiên cứu bảo tồn động thực vật hoang dã',
    ortherName: 'TTDV',
  },
];

const SendNotification = ({navigation}) => {
  const IFEEstaffs = useSelector(state => state.staffs?.staffs?.IFEEStaff);
  const allStaffs = IFEEstaffs.map(item => {
    return {name: item.hoten, ortherName: item.id_ht};
  });
  const user = useSelector(state => state.auth.login?.currentUser);
  const [filterDataValue, setFilterDataValue] = useState([]);
  const [groupValue, setGroupValue] = useState(group[0].title);
  const [loading, setLoading] = useState(false);
  const [dataPicker, setDataPicker] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handlePickGroup = id => {
    let received;
    switch (id) {
      case 1:
        received = IFEEstaffs.map(item => {
          return item.id_ht;
        });
        setDataPicker(received);
        break;
      case 2:
        received = IFEEstaffs.filter(item => item.vitri_ifee <= 3).map(item => {
          return item.id_ht;
        });
        setDataPicker(received);
        break;
      case 3:
        received = IFEEstaffs.filter(item => item.vitri_ifee <= 4).map(item => {
          return item.id_ht;
        });
        setDataPicker(received);
    }
  };

  const handlePickSubject = subject => {
    const dataFilter = IFEEstaffs.filter(item =>
      subject.includes(item.tenphong),
    ).map(item => {
      return item.id_ht;
    });

    console.log(dataFilter);

    setDataPicker(dataFilter);
  };

  const handlePickPerson = idArr => {
    setDataPicker(idArr);
  };

  const handleSendNotification = async () => {
    if (title.length != 0 && content != 0) {
      const data = {
        id: dataPicker,
        title: title,
        content: content,
      };

      setLoading(true);
      try {
        const res = await postNotifcation(data);

        if (res) {
          ToastSuccess('Gửi thông báo thành công');
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      ToastAlert('Thiếu thông tin!');
    }
  };

  useLayoutEffect(() => {
    if (groupValue == 4) {
      handlePickSubject(filterDataValue);
    } else if (groupValue == 5) {
      handlePickPerson(filterDataValue);
    }
  }, []);

  return (
    <LinearGradient
      colors={['rgba(153,255,153,0.9)', 'rgba(255,204,204,0.8)']}
      style={{flex: 1}}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <SafeAreaView style={styles.container}>
        <Header title="Gửi thông báo" navigation={navigation} />
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
              <Text style={styles.title}>Người gửi</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  src={mainURL + user?.path}
                  style={{height: 40, width: 40}}
                />
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
              <Text style={styles.title}>Nhóm nhận tin</Text>
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
                placeholder="Chọn nhóm"
                activeColor="#eef2feff"
                data={group}
                maxHeight={Dimension.setHeight(30)}
                labelField="title"
                valueField="id"
                value={groupValue}
                onChange={item => {
                  setGroupValue(item.id);
                  handlePickGroup(item.id);
                }}
              />
            </View>
            {(groupValue == 4 || groupValue == 5) && (
              <View style={styles.containerEachLine}>
                <Text style={styles.title}>Người nhận tin</Text>
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
                  activeColor="#eef2feff"
                  data={groupValue == 4 ? IFEEFull : allStaffs}
                  maxHeight={Dimension.setHeight(30)}
                  labelField="name"
                  valueField="ortherName"
                  placeholder={
                    groupValue == 4
                      ? 'Chọn phòng/bộ môn/trung tâm'
                      : 'Chọn người'
                  }
                  value={filterDataValue}
                  renderLeftIcon={() => {
                    return (
                      <Image
                        source={Images.person}
                        style={styles.leftIconDropdown}
                      />
                    );
                  }}
                  onChange={async item => {
                    setFilterDataValue(item);

                    groupValue == 4
                      ? handlePickSubject(item)
                      : handlePickPerson(item);
                  }}
                />
              </View>
            )}

            <View style={styles.containerEachLine}>
              <Text style={styles.title}>Tiêu đề</Text>
              <TextInput
                style={{
                  borderBottomWidth: 0.6,
                  borderBottomColor: 'gray',
                  marginHorizontal: Dimension.setWidth(1.6),
                  fontFamily: Fonts.SF_MEDIUM,
                  fontSize: 16,
                  height: Dimension.setHeight(6),
                }}
                placeholder="Nhập tiêu đề"
                value={title}
                onChangeText={e => setTitle(e)}
              />
            </View>

            <View style={styles.containerEachLine}>
              <Text style={styles.title}>Nội dung</Text>
              <TextInput
                multiline
                style={{
                  borderBottomWidth: 0.6,
                  borderBottomColor: 'gray',
                  marginHorizontal: Dimension.setWidth(1.6),
                  fontFamily: Fonts.SF_MEDIUM,
                  fontSize: 16,
                  height: Dimension.setHeight(12),
                }}
                value={content}
                onChangeText={e => setContent(e)}
              />
            </View>

            <RegisterBtn nameBtn={'Gửi'} onEvent={handleSendNotification} />
          </KeyboardAwareScrollView>
        </ScrollView>
        {loading === true && <Loading />}
      </SafeAreaView>
    </LinearGradient>
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
    fontSize: 15,
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
    fontSize: 16,
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
    fontSize: 14,
  },
  leftIconDropdown: {
    width: 20,
    height: 20,
    marginRight: Dimension.setWidth(1.3),
  },
  nocar: {
    fontSize: 16,
    fontFamily: Fonts.SF_SEMIBOLD,
    color: 'red',
    alignSelf: 'center',
  },
});

export default SendNotification;
