import React, {useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  StatusBar,
  Linking,
  TextInput,
} from 'react-native';
import {HStack, Spinner} from 'native-base';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import {PERMISSIONS, request} from 'react-native-permissions';
import {
  getVietnameseDayOfWeek,
  getFormattedDate,
  changeFormatDate,
} from '../../utils/serviceFunction';
import {
  getWeatherData,
  getAllStaffs,
  getallNews,
  sendFeedback,
  getAllDocument,
} from '../../redux/apiRequest';
import {getToken, notificationListener} from '../../utils/firebaseNotifi';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import {shadowIOS} from '../../contants/propsIOS';
import {mainURL, newsURL, fontDefault} from '../../contants/Variable';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {ToastAlert, ToastSuccess} from '../../components/Toast';

const HomePageScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const weather = useSelector(state => state.weather.weathers?.data);
  const dispatch = useDispatch();
  const [interval, setInTerVal] = useState(null);
  const [newArr, setNewArr] = useState(null);
  const [toggleFeedBack, setToggleFeedBack] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [gmailInput, setGmailInput] = useState('');
  const weekdays = getVietnameseDayOfWeek();
  const date = getFormattedDate();

  const fetchImportantData = async () => {
    await requestPermissions();
    await getWeatherData(dispatch);
    await getAllDocument(dispatch);
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
      } catch (err) {
        console.log(err);
      }
    } else {
      await request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
        console.log(result);
      });
      const authStatus = await messaging().requestPermission({
        alert: true,
        criticalAlert: true,
        badge: true,
        sound: true,
        announcement: true,
      });
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    }
  };

  const fetchAllNews = async () => {
    try {
      const res = await getallNews(dispatch);
      setNewArr(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllStaff = () => {
    getAllStaffs(dispatch);
  };

  const notificationHandle = async () => {
    await notificationListener(notifiData, navigation, dispatch);
  };

  const handleNavigate = routeName => {
    navigation.navigate(routeName);
  };

  const handleOpenApp = async link => {
    try {
      return Linking.openURL(link);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendFeedback = () => {
    if (
      nameInput.length != 0 &&
      gmailInput.length != 0 &&
      titleInput.length != 0 &&
      contentInput.length != 0
    ) {
      const data = {
        hoten: nameInput,
        email: gmailInput,
        tieude: titleInput,
        noidung: contentInput,
      };

      sendFeedback(data);

      setToggleFeedBack(false);
      ToastSuccess('Cảm ơn đã gửi góp ý cho chúng tôi!');
    } else {
      ToastAlert('Thiếu thông tin!');
    }
  };

  useLayoutEffect(() => {
    if (weather) {
      setInTerVal(
        setInterval(() => {
          fetchImportantData();
        }, 1600000),
      );
    } else {
      fetchImportantData();
    }

    fetchAllNews();
    fetchAllStaff();

    notificationHandle();

    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient
      colors={['rgba(153,255,153,0.9)', 'rgba(255,204,204,0.8)']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <SafeAreaView
        style={{
          flex: 1,
          marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
        }}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={false}
          style={styles.container}>
          <View style={styles.userInforContainer}>
            <View style={styles.userNameContainer}>
              <Text style={styles.userNameText}>Welcome, {user?.hoten} </Text>
              <Text style={styles.companyText}>Forestry 4.0</Text>
            </View>
            {user ? (
              <TouchableOpacity
                onPress={() => {
                  handleNavigate('DetailStaff');
                }}
                style={styles.avatarUserContainer}>
                <Image
                  src={`${mainURL + user?.path}`}
                  style={[styles.avatarUserImg, {borderRadius: 50}]}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  padding: 7,
                  borderRadius: 8,
                  backgroundColor: Colors.DEFAULT_GREEN,
                  paddingVertical: Dimension.setHeight(1.1),
                }}
                onPress={() => {
                  handleNavigate('Login');
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: Fonts.SF_SEMIBOLD,
                    color: '#ffffff',
                  }}>
                  Đăng nhập
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.todayInforContainer}>
            <View style={styles.calendarContainer}>
              <Image source={Images.calendar} style={styles.calendarImg} />
              <View
                style={{
                  marginLeft: Dimension.setWidth(2),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.dayInWeekText}>{weekdays}</Text>
                <Text style={styles.calendarText}>{date}</Text>
              </View>
            </View>
            <View style={styles.weatherContainer}>
              <Image
                source={{uri: weather?.iconUrl}}
                style={styles.weatherImg}
              />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.dayInWeekText}>Thời tiết</Text>
                {!weather ? (
                  <HStack space={8} justifyContent="center" alignItems="center">
                    <Spinner size="sm" />
                  </HStack>
                ) : (
                  <Text style={styles.calendarText}>
                    {weather?.name} {weather?.temp}°C
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View style={styles.featureBtnContainer}>
            <View style={styles.featureContainer}>
              <Text
                style={{
                  fontFamily: Fonts.SF_BOLD,
                  fontSize: 16,
                  color: Colors.DEFAULT_BLACK,
                  opacity: 0.9,
                }}>
                Công cụ tiện ích
              </Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleNavigate('DocumentList');
                }}>
                <Image
                  source={Images.documentation}
                  style={styles.featureBtn}
                />
                <Text style={styles.featureText}>Văn bản PFES</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleNavigate('SelectWMSLayer');
                }}>
                <Image source={Images.map} style={styles.featureBtn} />
                <Text style={styles.featureText}>Bản đồ số</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleNavigate('ListBio');
                }}>
                <Image source={Images.biodiversity} style={styles.featureBtn} />
                <Text style={styles.featureText}>ĐDSH</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonFuc} onPress={() => {}}>
                <Image source={Images.forest} style={styles.featureBtn} />
                <Text style={styles.featureText}>QLRBV</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.buttonFuc} onPress={() => {}}>
                <Image source={Images.trees1} style={styles.featureBtn} />
                <Text style={styles.featureText}>Khung giá rừng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonFuc} onPress={() => {}}>
                <Image source={Images.trees} style={styles.featureBtn} />
                <Text style={styles.featureText}>Kiểm kê rừng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonFuc} onPress={() => {}}>
                <Image source={Images.standard} style={styles.featureBtn} />
                <Text style={styles.featureText}>TCVN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleNavigate('HappyBirthday');
                }}
                style={styles.buttonFuc}>
                <Image source={Images.happybd} style={styles.featureBtn} />
                <Text style={styles.featureText}>HPBD</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.featureBtnContainer}>
            <View
              style={[
                styles.featureContainer,
                {flexDirection: 'row', alignItems: 'center'},
              ]}>
              <Text
                style={{
                  fontFamily: Fonts.SF_BOLD,
                  fontSize: 16,
                  color: Colors.DEFAULT_BLACK,
                  opacity: 0.9,
                  marginRight: Dimension.setWidth(1),
                }}>
                Trường Đại học Lâm nghiệp
              </Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.buttonFuc}>
                <Image
                  source={Images.logo_LamHoc}
                  style={[styles.featureBtn, {borderRadius: 10}]}
                />
                <Text style={styles.featureText}> Khoa Lâm học</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonFuc} onPress={() => {}}>
                <Image
                  source={Images.logo_KTQTKD}
                  style={[styles.featureBtn, {borderRadius: 10}]}
                />
                <Text style={styles.featureText}>Khoa KT-QTKD</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonFuc}></TouchableOpacity>
              <TouchableOpacity style={styles.buttonFuc}></TouchableOpacity>
            </View>
          </View>

          {user?.tendonvi === 'IFEE' && (
            <View style={styles.featureBtnContainer}>
              <View style={styles.featureContainer}>
                <Text
                  style={{
                    fontFamily: Fonts.SF_BOLD,
                    fontSize: 16,
                    color: Colors.DEFAULT_BLACK,
                    opacity: 0.9,
                  }}>
                  IFEE Management
                </Text>
              </View>
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={styles.buttonFuc}
                  onPress={() => {
                    handleNavigate('StaffList');
                  }}>
                  <Image source={Images.staff} style={styles.featureBtn} />
                  <Text style={styles.featureText}>Nhân sự</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonFuc}
                  onPress={() => {
                    handleNavigate('HistoryWorkShedule');
                  }}>
                  <Image source={Images.calendar2} style={styles.featureBtn} />
                  <Text style={[styles.featureText, {alignSelf: 'center'}]}>
                    Lịch công tác
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonFuc}
                  onPress={() => {
                    handleNavigate('HistoryApplyLeave');
                  }}>
                  <Image source={Images.busy} style={styles.featureBtn} />
                  <Text style={styles.featureText}>Nghỉ phép</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonFuc}>
                  <Image source={Images.morebtn} style={styles.featureBtn} />
                  <Text style={styles.featureText}>Thêm</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={styles.buttonFuc}
                  onPress={() => {
                    handleNavigate('HistoryRegisterVehicle');
                  }}>
                  <Image
                    source={Images.registervehicle}
                    style={styles.featureBtn}
                  />
                  <Text style={styles.featureText}>Đăng kí xe</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonFuc}
                  onPress={() => {
                    handleNavigate('HistoryPlaneTicket');
                  }}>
                  <Image
                    source={Images.registerticket}
                    style={styles.featureBtn}
                  />
                  <Text style={styles.featureText}>Đăng kí vé</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonFuc}></TouchableOpacity>
                <TouchableOpacity style={styles.buttonFuc}></TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.featureBtnContainer}>
            <View
              style={[
                styles.featureContainer,
                {flexDirection: 'row', alignItems: 'center'},
              ]}>
              <Text
                style={{
                  fontFamily: Fonts.SF_BOLD,
                  fontSize: 16,
                  color: Colors.DEFAULT_BLACK,
                  opacity: 0.9,
                  marginRight: Dimension.setWidth(1),
                }}>
                Kết nối
              </Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  setToggleFeedBack(true);
                }}>
                <Image source={Images.feedback} style={styles.featureBtn} />
                <Text style={styles.featureText}>Phản hồi</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleOpenApp('fb://profile/100051879741625');
                }}>
                <Image source={Images.fb} style={styles.featureBtn} />
                <Text style={styles.featureText}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleOpenApp('vnd.youtube:/@viensinhthairungvamoitruon4033');
                }}>
                <Image source={Images.youtube} style={styles.featureBtn} />
                <Text style={styles.featureText}>Youtube</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  navigation.navigate('Contributor');
                }}>
                <Image source={Images.information} style={styles.featureBtn} />
                <Text style={styles.featureText}>Tác giả</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.newTextContainer}>
            <Text style={styles.newsText}>Tin tức mới</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AllNews');
              }}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={newArr}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('DetailNews', {item: item});
                  }}
                  key={index}
                  style={styles.newsContainer}>
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                      src={newsURL + item.avatar}
                      resizeMode="cover"
                      style={styles.newsImg}
                    />
                  </View>
                  <View
                    style={{
                      marginTop: Dimension.setHeight(0.8),
                      marginHorizontal: Dimension.setWidth(1),
                    }}>
                    <Text numberOfLines={2} style={styles.newsTitleText}>
                      {item.title}
                    </Text>
                    <Text style={styles.newsLocationText}>
                      {changeFormatDate(item.date_created)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(_, index) => index}
          />

          <Modal
            isVisible={toggleFeedBack}
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
                backgroundColor: '#def8ed',
                width: Dimension.setWidth(85),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 14,
                paddingHorizontal: Dimension.setWidth(3),
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
                    fontSize: 20,
                    color: '#57b85d',
                  }}>
                  Phản hồi góp ý
                </Text>
              </View>

              <View style={styles.lineContainerModal}>
                <View style={styles.itemContainerModal}>
                  <Text style={styles.titleModal}>Họ tên</Text>
                  <View
                    style={[
                      styles.dateModalContainer,
                      {width: Dimension.setWidth(75)},
                    ]}>
                    <TextInput
                      style={{
                        borderBottomWidth: 0.6,
                        borderBottomColor: 'gray',
                        marginHorizontal: Dimension.setWidth(1.6),
                        fontFamily: Fonts.SF_MEDIUM,
                        fontSize: 16,
                        height: Dimension.setHeight(6),
                        width: '85%',
                      }}
                      value={nameInput}
                      onChangeText={e => setNameInput(e)}
                    />
                    <Image source={Images.person} style={styles.imgDate} />
                  </View>
                </View>
              </View>

              <View style={styles.lineContainerModal}>
                <View style={styles.itemContainerModal}>
                  <Text style={styles.titleModal}>Địa chỉ email</Text>
                  <View
                    style={[
                      styles.dateModalContainer,
                      {width: Dimension.setWidth(75)},
                    ]}>
                    <TextInput
                      style={{
                        borderBottomWidth: 0.6,
                        borderBottomColor: 'gray',
                        marginHorizontal: Dimension.setWidth(1.6),
                        fontFamily: Fonts.SF_MEDIUM,
                        fontSize: 16,
                        height: Dimension.setHeight(6),
                        width: '85%',
                      }}
                      value={gmailInput}
                      onChangeText={e => setGmailInput(e)}
                    />
                    <Image source={Images.mail} style={styles.imgDate} />
                  </View>
                </View>
              </View>

              <View style={styles.lineContainerModal}>
                <View style={styles.itemContainerModal}>
                  <Text style={styles.titleModal}>Tiêu đề</Text>
                  <View
                    style={[
                      styles.dateModalContainer,
                      {width: Dimension.setWidth(75)},
                    ]}>
                    <TextInput
                      style={{
                        borderBottomWidth: 0.6,
                        borderBottomColor: 'gray',
                        marginHorizontal: Dimension.setWidth(1.6),
                        fontFamily: Fonts.SF_MEDIUM,
                        fontSize: 16,
                        height: Dimension.setHeight(6),
                        width: '85%',
                      }}
                      value={titleInput}
                      onChangeText={e => setTitleInput(e)}
                    />
                    <Image source={Images.title} style={styles.imgDate} />
                  </View>
                </View>
              </View>

              <View style={styles.lineContainerModal}>
                <View style={styles.itemContainerModal}>
                  <Text style={styles.titleModal}>Nội dung</Text>
                  <View
                    style={[
                      styles.dateModalContainer,
                      {width: Dimension.setWidth(75)},
                    ]}>
                    <TextInput
                      multiline={true}
                      style={{
                        borderBottomWidth: 0.6,
                        borderBottomColor: 'gray',
                        marginHorizontal: Dimension.setWidth(1.6),
                        fontFamily: Fonts.SF_MEDIUM,
                        fontSize: 16,
                        height: Dimension.setHeight(12),
                        width: '96%',
                        textAlign: 'auto',
                      }}
                      value={contentInput}
                      onChangeText={e => setContentInput(e)}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setToggleFeedBack(false);
                }}
                style={{position: 'absolute', left: 12, top: 12}}>
                <Image source={Images.minusclose} style={styles.btnModal} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSendFeedback}
                style={{position: 'absolute', right: 12, top: 12}}>
                <Image source={Images.confirm} style={styles.btnModal} />
              </TouchableOpacity>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
  },

  userInforContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Dimension.setWidth(5),
    marginTop: Dimension.setHeight(1.6),
  },

  userNameText: {
    fontFamily: Fonts.SF_BOLD,
    ...fontDefault,
    fontSize: 16,
  },

  companyText: {
    fontSize: 24,
    fontFamily: Fonts.SF_BOLD,
    color: '#388a60',
    letterSpacing: 1,
  },

  avatarUserContainer: {
    borderWidth: 1,
    borderRadius: 50,
    padding: 1,
    borderColor: '#268fbe',
  },

  avatarUserImg: {
    width: 50,
    height: 50,
  },

  todayInforContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    marginVertical: Dimension.setHeight(3),
    marginHorizontal: Dimension.setWidth(3),
    backgroundColor: '#f5f5f9',
    elevation: 5,
    ...shadowIOS,
    paddingVertical: Dimension.setHeight(1.8),
    paddingHorizontal: Dimension.setWidth(1.5),
  },

  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },

  calendarImg: {
    width: 40,
    height: 40,
  },

  dayInWeekText: {
    fontSize: 18,
    fontFamily: Fonts.SF_BOLD,
    ...fontDefault,
  },

  calendarText: {
    fontSize: 13,
    fontFamily: Fonts.SF_BOLD,
    ...fontDefault,
    opacity: 0.6,
  },

  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    borderLeftWidth: 1,
    borderColor: Colors.INACTIVE_GREY,
  },

  weatherImg: {
    width: 50,
    height: 50,
  },

  featureContainer: {
    marginBottom: Dimension.setHeight(0.8),
  },

  featureBtnContainer: {
    marginBottom: 10,
    marginHorizontal: Dimension.setWidth(3.6),
  },

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginBottom: Dimension.setHeight(1.4),
  },

  buttonFuc: {
    flex: 1,
    alignItems: 'center',
  },

  featureBtn: {
    width: 44,
    height: 44,
  },

  featureText: {
    fontFamily: Fonts.SF_MEDIUM,
    alignContent: 'center',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 1,
    ...fontDefault,
  },

  newTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    marginHorizontal: Dimension.setWidth(2.5),
  },

  newsText: {
    fontFamily: Fonts.SF_BOLD,
    fontSize: 16,
    marginVertical: Dimension.setHeight(0.2),
    color: Colors.DEFAULT_BLACK,
    opacity: 0.9,
  },

  viewAllText: {
    fontFamily: Fonts.SF_SEMIBOLD,
    fontSize: 14,
    color: Colors.DEFAULT_BLACK,
    opacity: 0.6,
  },

  newsContainer: {
    marginBottom: Dimension.setHeight(1),
    borderWidth: 0.4,
    borderRadius: 20,
    backgroundColor: '#f5f5ff',
    borderColor: Colors.WHITE,
    elevation: 10,
    ...shadowIOS,
    marginHorizontal: 5,
    width: Dimension.setWidth(72),
    paddingVertical: Dimension.setHeight(1.2),
    paddingHorizontal: Dimension.setWidth(1.2),
  },

  newsImg: {
    width: Dimension.setWidth(66.5),
    height: Dimension.setHeight(18),
    borderRadius: 18,
  },

  newsTitleText: {
    fontFamily: Fonts.SF_SEMIBOLD,
    fontSize: 14,
    ...fontDefault,
    paddingHorizontal: Dimension.setHeight(1),
    textAlign: 'justify',
  },

  newsLocationText: {
    fontFamily: Fonts.SF_REGULAR,
    color: Colors.DEFAULT_BLACK,
    opacity: 0.6,
    fontSize: 12,
    paddingHorizontal: Dimension.setHeight(1),
  },

  lineContainerModal: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  itemContainerModal: {
    paddingVertical: Dimension.setHeight(1),
    paddingHorizontal: Dimension.setWidth(2),
  },

  titleModal: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: 14,
    marginBottom: Dimension.setHeight(0.6),
  },

  dateModalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: Dimension.setWidth(2.2),
    paddingVertical: Dimension.setHeight(0.8),
    elevation: 5,
    ...shadowIOS,
    width: Dimension.setWidth(35),
  },

  contentModal: {
    fontFamily: Fonts.SF_SEMIBOLD,
    fontSize: 15,
  },

  imgModalContainer: {
    padding: Dimension.setWidth(1.1),
    borderRadius: 8,
  },

  imgDate: {
    height: 25,
    width: 25,
  },

  btnModal: {
    width: 28,
    height: 28,
  },
});

export default HomePageScreen;
