import React, {useState, useEffect, useLayoutEffect} from 'react';
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
import {getWeatherData, getAllStaffs, getallNews} from '../../redux/apiRequest';
import {getToken, notificationListener} from '../../utils/firebaseNotifi';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import {shadowIOS} from '../../contants/propsIOS';
import {mainURL, newsURL, fontDefault} from '../../contants/Variable';
import {ToastAlert} from '../../components/Toast';
import LinearGradient from 'react-native-linear-gradient';

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
    const authStatus = await messaging().requestPermission();
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  }
};

const HomePageScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const weather = useSelector(state => state.weather.weathers?.data);

  const dispatch = useDispatch();
  const [interval, setInTerVal] = useState(null);
  const [newArr, setNewArr] = useState(null);
  const weekdays = getVietnameseDayOfWeek();
  const date = getFormattedDate();

  const fetchImportantData = async () => {
    await requestPermissions();
    await getWeatherData(dispatch);
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
    await getToken();
    await notificationListener(notifiData, navigation, dispatch);
  };

  const handleLimitedFeature = routeName => {
    if (user) {
      if (user?.tendonvi == 'XMG' && routeName !== 'StaffList') {
        ToastAlert('Tính năng dành riêng cho IFEE');
      } else {
        navigation.navigate(routeName);
      }
    } else {
      ToastAlert('Đăng nhập để sử dụng tính năng này');
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

    // notificationHandle();

    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient
      colors={['rgba(153,255,153,0.9)', 'rgba(255,204,204,0.8)']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <SafeAreaView style={{flex: 1}}>
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
                  navigation.navigate('DetailStaff');
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
                  navigation.navigate('Login');
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
                  navigation.navigate('DocumentList');
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
                  navigation.navigate('SelectWMSLayer');
                }}>
                <Image source={Images.map} style={styles.featureBtn} />
                <Text style={styles.featureText}>Bản đồ số</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonFuc}>
                <TouchableOpacity
                  style={styles.buttonFuc}
                  onPress={() => {
                    navigation.navigate('ListBio');
                  }}>
                  <Image
                    source={Images.biodiversity}
                    style={styles.featureBtn}
                  />
                  <Text style={styles.featureText}>ĐDSH</Text>
                </TouchableOpacity>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonFuc}></TouchableOpacity>
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
                IFEE Management
              </Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleLimitedFeature('StaffList');
                }}>
                <Image source={Images.staff} style={styles.featureBtn} />
                <Text style={styles.featureText}>Nhân sự</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleLimitedFeature('HistoryWorkShedule');
                }}>
                <Image source={Images.calendar2} style={styles.featureBtn} />
                <Text style={[styles.featureText, {alignSelf: 'center'}]}>
                  Lịch công tác
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  handleLimitedFeature('HistoryApplyLeave');
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
                  handleLimitedFeature('HistoryRegisterVehicle');
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
                  handleLimitedFeature('HistoryPlaneTicket');
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
    marginBottom: Dimension.setHeight(0.6),
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
});

export default HomePageScreen;
