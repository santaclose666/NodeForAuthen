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
  StatusBar,
  Linking,
  Share,
  TextInput,
} from 'react-native';
import {HStack, Spinner} from 'native-base';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import {
  getVietnameseDayOfWeek,
  getFormattedDate,
  changeFormatDate,
} from '../../utils/serviceFunction';
import {
  getWeatherData,
  getAllDocumentMv,
  getallNews,
  sendFeedback,
  getAllDocument,
} from '../../redux/apiRequest';
import {fcmService} from '../../services/FCMService';
import {localNotificationService} from '../../services/LocalNotificationService';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {shadowIOS} from '../../contants/propsIOS';
import {mainURL, newsURL, fontDefault} from '../../contants/Variable';
import Modal from 'react-native-modal';
import {ToastAlert, ToastSuccess} from '../../components/Toast';
import LinearGradientUI from '../../components/LinearGradientUI';
import {requestPermissions} from '../../utils/permissionFunc';
import {topicForAll} from '../../utils/AllTopic';
import Loading from '../../components/LoadingUI';

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
  const [loading, setLoading] = useState(false);
  const weekdays = getVietnameseDayOfWeek();
  const date = getFormattedDate();

  const fetchImportantData = async () => {
    try {
      await getAllDocument(dispatch);
      await requestPermissions();
      await getWeatherData(dispatch);
      topicForAll();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllNews = async () => {
    setLoading(true);
    try {
      const res = await getallNews(dispatch);

      setNewArr(res);

      getAllDocumentMv(dispatch);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigate = routeName => {
    navigation.navigate(routeName);
  };

  const handleOpenApp = async (appUrl, webUrl) => {
    try {
      const openSupport = await Linking.canOpenURL(appUrl);

      if (openSupport) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      await Linking.openURL(webUrl);
    }
  };

  const shareApp = async () => {
    try {
      const result = await Share.share({
        message:
          Platform.OS == 'android'
            ? 'https://play.google.com/store/apps/details?id=com.forestry_4_v7'
            : 'https://apps.apple.com/vn/app/forestry-4-0/id6452552409?l=vi',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {}
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

  const handleAlert = () => {
    ToastAlert('Chức năng đang được phát triển');
  };

  useLayoutEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    if (weather) {
      setInTerVal(
        setInterval(() => {
          fetchImportantData();
        }, 1606201),
      );
    } else {
      fetchImportantData();
    }

    fetchAllNews();

    return () => clearInterval(interval);
  }, []);

  const onRegister = token => {
    console.log('[App] onRegister: ', token);
  };

  const onNotification = notify => {
    const options = {
      soundName: 'default',
      playSound: true,
    };

    localNotificationService.showNotification(
      0,
      notify.notification.title,
      notify.notification.body,
      notify,
      options,
    );
  };

  const onOpenNotification = async notify => {
    navigation.navigate(notify.screen, {item: notify});
  };

  return (
    <LinearGradientUI>
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
                    fontSize: Dimension.fontSize(14),
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
                  fontSize: Dimension.fontSize(16),
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
                <Text style={styles.featureText}>DVMTR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleNavigate('SelectWMSLayer');
                }}>
                <Image source={Images.map} style={styles.featureBtn} />
                <Text style={styles.featureText}>DV bản đồ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleNavigate('SelectProvinceFFW');
                }}>
                <Image source={Images.forestFire} style={styles.featureBtn} />
                <Text style={styles.featureText}>Cảnh báo cháy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleNavigate('ListBio');
                }}>
                <Image source={Images.biodiversity} style={styles.featureBtn} />
                <Text style={styles.featureText}>ĐDSH</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleNavigate('ForestPrice');
                }}>
                <Image source={Images.trees1} style={styles.featureBtn} />
                <Text style={styles.featureText}>Khung giá rừng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleNavigate('KKR');
                }}>
                <Image source={Images.trees} style={styles.featureBtn} />
                <Text style={styles.featureText}>Kiểm kê rừng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleNavigate('TCVN');
                }}>
                <Image source={Images.standard} style={styles.featureBtn} />
                <Text style={styles.featureText}>TCVN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleNavigate('TreeType');
                }}>
                <Image source={Images.seed} style={styles.featureBtn} />
                <Text style={styles.featureText}>Giống LN</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleNavigate('DMKTKT');
                }}>
                <Image source={Images.norms} style={styles.featureBtn} />
                <Text style={styles.featureText}>Định mức KTKT</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleNavigate('VP809');
                }}>
                <Image source={Images.book} style={styles.featureBtn} />
                <Text style={styles.featureText}>Văn Phòng 809</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleNavigate('QLRBV');
                }}>
                <Image source={Images.forest} style={styles.featureBtn} />
                <Text style={styles.featureText}>QLRBV</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleNavigate('Muavu');
                }}>
                <Image source={Images.muavu} style={styles.featureBtn} />
                <Text style={styles.featureText}>Mùa vụ</Text>
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
                  fontSize: Dimension.fontSize(16),
                  color: Colors.DEFAULT_BLACK,
                  opacity: 0.9,
                  marginRight: Dimension.setWidth(1),
                }}>
                Trường Đại học Lâm nghiệp
              </Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={() => {
                  handleNavigate('Forestry');
                }}
                style={styles.buttonFuc}>
                <Image
                  source={Images.logo_LamHoc}
                  style={[styles.featureBtn, {borderRadius: 50}]}
                />
                <Text style={styles.featureText}> Lâm học</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonFuc} onPress={handleAlert}>
                <Image
                  source={Images.logo_KTQTKD}
                  style={[styles.featureBtn, {borderRadius: 50}]}
                />
                <Text style={styles.featureText}>KT-QTKD</Text>
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
                    fontSize: Dimension.fontSize(16),
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
                    handleNavigate('HistoryItemOffice');
                  }}>
                  <Image source={Images.office} style={styles.featureBtn} />
                  <Text style={styles.featureText}>Văn phòng phẩm</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  onPress={() => {
                    handleNavigate('HistoryRegisterDevice');
                  }}
                  style={styles.buttonFuc}>
                  <Image source={Images.device} style={styles.featureBtn} />
                  <Text style={styles.featureText}>Thiết bị</Text>
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
                <TouchableOpacity
                  style={styles.buttonFuc}
                  onPress={() => {
                    handleNavigate('HistoryApplyLeave');
                  }}>
                  <Image source={Images.busy} style={styles.featureBtn} />
                  <Text style={styles.featureText}>Nghỉ phép</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleNavigate('HappyBirthdayList');
                  }}
                  style={styles.buttonFuc}>
                  <Image source={Images.happybd} style={styles.featureBtn} />
                  <Text style={styles.featureText}>HPBD</Text>
                </TouchableOpacity>
              </View>
              {user?.quyentruycap == 1 && (
                <View style={styles.btnContainer}>
                  <TouchableOpacity
                    style={styles.buttonFuc}
                    onPress={() => {
                      handleNavigate('SendNotification');
                    }}>
                    <Image
                      source={Images.sendnotification}
                      style={styles.featureBtn}
                    />
                    <Text style={styles.featureText}>Gửi thông báo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonFuc}></TouchableOpacity>
                  <TouchableOpacity style={styles.buttonFuc}></TouchableOpacity>
                  <TouchableOpacity style={styles.buttonFuc}></TouchableOpacity>
                </View>
              )}
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
                  fontSize: Dimension.fontSize(16),
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
                  navigation.navigate('Contributor');
                }}>
                <Image source={Images.information} style={styles.featureBtn} />
                <Text style={styles.featureText}>Tác giả</Text>
              </TouchableOpacity>
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
                  handleOpenApp(
                    'fb://profile/100051879741625',
                    'https://www.facebook.com/lamnghiep4.0',
                  );
                }}>
                <Image source={Images.fb} style={styles.featureBtn} />
                <Text style={styles.featureText}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleOpenApp(
                    'vnd.youtube:/@viensinhthairungvamoitruon4033',
                    'https://www.youtube.com/channel/UCMMHXxI1RsJbNj1KjhnMZKQ',
                  );
                }}>
                <Image source={Images.youtube} style={styles.featureBtn} />
                <Text style={styles.featureText}>Youtube</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  navigation.navigate('ContributionData');
                }}>
                <Image source={Images.contribution} style={styles.featureBtn} />
                <Text style={styles.featureText}>Vì cộng đồng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  shareApp();
                }}>
                <Image source={Images.network} style={styles.featureBtn} />
                <Text style={styles.featureText}>Chia sẻ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonFuc}></TouchableOpacity>
              <TouchableOpacity style={styles.buttonFuc}></TouchableOpacity>
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
                    fontSize: Dimension.fontSize(20),
                    color: '#57b85d',
                  }}>
                  Phản hồi góp ý
                </Text>
              </View>

              <View style={styles.containerEachLine}>
                <Text style={styles.title}>Họ tên</Text>
                <TextInput
                  style={{
                    borderBottomWidth: 0.6,
                    borderBottomColor: 'gray',
                    marginHorizontal: Dimension.setWidth(1.6),
                    fontFamily: Fonts.SF_MEDIUM,
                    fontSize: Dimension.fontSize(16),
                    height: Dimension.setHeight(6),
                  }}
                  placeholder="Nhập tên"
                  value={nameInput}
                  onChangeText={e => setNameInput(e)}
                />
              </View>
              <View style={styles.containerEachLine}>
                <Text style={styles.title}>Địa chỉ email</Text>
                <TextInput
                  style={{
                    borderBottomWidth: 0.6,
                    borderBottomColor: 'gray',
                    marginHorizontal: Dimension.setWidth(1.6),
                    fontFamily: Fonts.SF_MEDIUM,
                    fontSize: Dimension.fontSize(16),
                    height: Dimension.setHeight(6),
                  }}
                  placeholder="Nhập gmail"
                  value={gmailInput}
                  onChangeText={e => setGmailInput(e)}
                />
              </View>
              <View style={styles.containerEachLine}>
                <Text style={styles.title}>Tiêu đề</Text>
                <TextInput
                  style={{
                    borderBottomWidth: 0.6,
                    borderBottomColor: 'gray',
                    marginHorizontal: Dimension.setWidth(1.6),
                    fontFamily: Fonts.SF_MEDIUM,
                    fontSize: Dimension.fontSize(16),
                    height: Dimension.setHeight(6),
                  }}
                  placeholder="Nhập tiêu đề"
                  value={titleInput}
                  onChangeText={e => setTitleInput(e)}
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
                    fontSize: Dimension.fontSize(16),
                    height: Dimension.setHeight(12),
                  }}
                  value={contentInput}
                  onChangeText={e => setContentInput(e)}
                />
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
        {loading && <Loading bg={true} />}
      </SafeAreaView>
    </LinearGradientUI>
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
    fontSize: Dimension.fontSize(16),
  },

  companyText: {
    fontSize: Dimension.fontSize(24),
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
    fontSize: Dimension.fontSize(18),
    fontFamily: Fonts.SF_BOLD,
    ...fontDefault,
  },

  calendarText: {
    fontSize: Dimension.fontSize(13),
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
    alignItems: 'flex-start',
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
    fontSize: Dimension.fontSize(14),
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
    fontSize: Dimension.fontSize(16),
    marginVertical: Dimension.setHeight(0.2),
    color: Colors.DEFAULT_BLACK,
    opacity: 0.9,
  },

  viewAllText: {
    fontFamily: Fonts.SF_SEMIBOLD,
    fontSize: Dimension.fontSize(14),
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
    fontSize: Dimension.fontSize(14),
    ...fontDefault,
    paddingHorizontal: Dimension.setHeight(1),
    textAlign: 'justify',
  },

  newsLocationText: {
    fontFamily: Fonts.SF_REGULAR,
    color: Colors.DEFAULT_BLACK,
    opacity: 0.6,
    fontSize: Dimension.fontSize(12),
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
    fontSize: Dimension.fontSize(14),
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
    fontSize: Dimension.fontSize(15),
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

  containerEachLine: {
    marginBottom: Dimension.setHeight(2),
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 12,
    paddingVertical: Dimension.setHeight(1.6),
    paddingHorizontal: Dimension.setWidth(3),
    width: '100%',
  },

  title: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: Dimension.fontSize(15),
    color: '#8bc7bc',
    marginBottom: Dimension.setHeight(1),
  },
});

export default HomePageScreen;
