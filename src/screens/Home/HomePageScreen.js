import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
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
} from '../../utils/serviceFunction';
import {getAllStaffs, getWeatherData} from '../../redux/apiRequest';
import {getToken, notificationListener} from '../../utils/firebaseNotifi';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
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
  const notifiData = useSelector(
    state => state.notifi.notifications?.allNotifi,
  );
  const dispatch = useDispatch();
  const [interval, setInTerVal] = useState(null);
  const [newsArr, setNewArr] = useState([
    {
      topic: 'Chính sách',
      mainImg: require('../../assets/images/mainTopic1.png'),
      subImg: null,
      location: 'Tây Nguyên',
      date: '16/06/2011',
      name: 'Ứng dụng công nghệ số trong thực hiện chi trả dịch vụ môi trường rừng',
      header1: 'Số hóa dữ liệu chi trả DVMTR',
      content1:
        'Content: Việc duy trì bảo vệ khoảng 217.658 ha rừng cung ứng DVMTR trên địa bàn tỉnh Đắk Lắk với 24 chủ rừng là tổ chức, 13 UBND cấp xã/phường, 75  hộ gia đình, cá nhân và 54 cộng đồng dân cư thôn được Nhà nước giao đất, giao rừng là rất khó khăn. Theo kế hoạch chuyển đổi số của Sở Nông nghiệp và PTNT, việc theo dõi, quản lý diện tích rừng được chi trả tiền DVMTR cần được thực hiện khoa học, đảm bảo nhanh chóng, chính xác, phù hợp với xu thế về chuyển đổi số quốc gia đến năm 2025, định hướng đến năm 2030.',
      header2: 'Hướng tới sử dụng công nghệ số trong trả tiền DVMTR',
      content2:
        'Năm 2019, Quỹ Bảo vệ và phát triển rừng tỉnh thực hiện chi trả tiền DVMTR qua tài khoản ngân hàng, giao dịch điện tử đối với các chủ rừng là tổ chức, UBND các xã, thị trấn và hộ gia đình, cộng đồng, nhóm hộ nhận khoán bảo vệ rừng. Việc chi trả tiền DVMTR qua tài khoản góp phần đơn giản hóa thủ tục, đảm bảo tính công khai, minh bạch, an toàn, giúp chủ rừng thuận lợi hơn khi nhận tiền, tiết kiệm được thời gian, chi phí đi lại.',
    },
    {
      topic: 'Chỉ đạo điều hành',
      mainImg: require('../../assets/images/mainTopic2.png'),
      subImg: require('../../assets/images/subTopic2.png'),
      location: 'Tây Ninh',
      date: '16/06/2011',
      name: 'Tổng cục Lâm nghiệp: Tổ chức Hội nghị Công tác bảo vệ rừng và phòng cháy, chữa cháy rừng toàn quốc năm 2022 và triển khai nhiệm vụ năm 2023',
      header1: null,
      content1: `Theo báo cáo 9 tháng đầu năm 2022, công tác quản lý bảo vệ rừng và phòng cháy chữa cháy rừng có nhiều chuyển biến tích cực, các chỉ tiêu số vụ vi phạm và diện tích rừng bị ảnh hưởng tiếp tục giảm mạnh so với cùng kỳ các năm trước, cụ thể: diện tích rừng bị tác động giảm 63% so với cùng kỳ năm 2021; phòng cháy, chữa cháy rừng, xảy ra 46 vụ, giảm 143 vụ (giảm 76%), diện tích rừng bị ảnh hưởng là 30 ha (giảm 98%) so với cùng kỳ năm 2021.
      Hội nghị cũng đã đề ra kế hoạch thực hiện nhiệm vụ 03 tháng cuối năm 2022 và phương hướng nhiệm vụ năm 2023, tập trung vào các nhiệm vụ trọng tâm sau: Tập trung thực hiện đảm bảo hoàn thành các chỉ tiêu kế hoạch năm 2022; đẩy mạnh các hoạt động về công tác quản lý bảo vệ rừng và phòng cháy, chữa cháy rừng; Tiếp tục nghiêm túc thực hiện đóng cửa khai thác gỗ rừng tự nhiên; kiểm soát chặt chẽ chuyển mục đích sử dụng rừng sang mục đích khác.
      Ngoài ra, các đại biểu đã bổ sung, góp ý, đề xuất nhiều giải pháp phát sinh từ thực tế đề nghị cấp có thẩm quyền giải quyết gỡ vướng cho các địa phương, gồm: Về các cơ chế chính sách trong lĩnh vực lâm nghiệp; về tình hình công chức kiểm lâm và lực lượng chuyên trách bảo vệ rừng bỏ việc, thôi việc tại các địa phương.
      `,
      header2: null,
      content2: null,
    },
    {
      topic: 'Khoa học công nghệ',
      mainImg: require('../../assets/images/mainTopic3.png'),
      subImg: require('../../assets/images/subTopic3.png'),
      location: 'Tây Tạng',
      date: '16/06/2011',
      name: 'Ứng dụng SMART trong quản lý rừng và đa dạng sinh học tại Việt Nam',
      header1: null,
      content1:
        'Xuất phát từ thực tế trên, từ năm 2016, Tổ chức Hợp tác Phát triển Đức GIZ phối hợp với Tổng cục Lâm nghiệp Việt Nam và các bên liên quan khác trong khuôn khổ dự án "Bảo tồn và sử dụng bền vững đa dạng sinh học rừng và các dịch vụ hệ sinh thái ở Việt Nam" (dự án BIO) đã tiến hành chuẩn hóa mô hình dữ liệu SMART và giới thiệu sổ tay hướng dẫn áp dụng SMART trong toàn bộ hệ thống vườn quốc gia và khu bảo tồn. Đến năm 2021, mô hình dữ liệu SMART chuẩn và bộ tài liệu hướng dẫn kỹ thuật đã sẵn sàng để triển khai trên toàn quốc.',
      header2: null,
      content2: null,
    },
  ]);
  const weekdays = getVietnameseDayOfWeek();
  const date = getFormattedDate();

  const fetchImportantData = async () => {
    await requestPermissions();
    await getAllStaffs(dispatch);
    await getWeatherData(dispatch);
  };

  const notificationHandle = async () => {
    await getToken();
    await notificationListener(notifiData, navigation, dispatch);
  };

  useEffect(() => {
    if (weather) {
      setInTerVal(
        setInterval(() => {
          fetchImportantData();
        }, 1600000),
      );
    } else {
      fetchImportantData();
    }

    notificationHandle();

    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient
      colors={['rgba(238,174,202,1)', 'rgba(148,187,233,1)']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={false}
          style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" />
          <View style={styles.userInforContainer}>
            <View style={styles.userNameContainer}>
              <Text style={styles.userNameText}>Welcome, {user?.name} </Text>
              <Text style={styles.companyText}>Forestry 4.0</Text>
            </View>
            {user ? (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('DetailStaff');
                }}
                style={styles.avatarUserContainer}>
                <Image source={Images.avatar} style={styles.avatarUserImg} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  padding: 7,
                  borderRadius: 8,
                  backgroundColor: '#7bbf8c',
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
                  fontSize: 18,
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
                <Text style={styles.featureText}>Văn bản</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.featureBtnContainer}>
            <View style={styles.featureContainer}>
              <Text
                style={{
                  fontFamily: Fonts.SF_BOLD,
                  fontSize: 18,
                }}>
                IFEE Management
              </Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  navigation.navigate('StaffList');
                }}>
                <Image source={Images.staff} style={styles.featureBtn} />
                <Text style={styles.featureText}>Nhân sự</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  navigation.navigate('HistoryWorkShedule');
                }}>
                <Image source={Images.calendar2} style={styles.featureBtn} />
                <Text style={styles.featureText}>Lịch công tác</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonFuc}
                onPress={() => {
                  navigation.navigate('HistoryApplyLeave');
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
                  navigation.navigate('HistoryRegisterVehicle');
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
                  navigation.navigate('HistoryPlaneTicket');
                }}>
                <Image
                  source={Images.registerticket}
                  style={styles.featureBtn}
                />
                <Text style={styles.featureText}>Đăng kí vé</Text>
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
            data={newsArr}
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
                      source={item.mainImg}
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
                      {item.name}
                    </Text>
                    <Text style={styles.newsLocationText}>{item.location}</Text>
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
    color: Colors.INACTIVE_GREY,
    fontSize: 17,
  },

  companyText: {
    fontSize: 24,
    fontFamily: Fonts.SF_BOLD,
    lineHeight: Dimension.setHeight(3.3),
    color: '#388a60',
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
  },

  calendarText: {
    fontSize: 13,
    fontFamily: Fonts.SF_BOLD,
    color: Colors.INACTIVE_GREY,
    lineHeight: Dimension.setHeight(1.8),
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
    marginHorizontal: 18,
  },

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },

  buttonFuc: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: '3%',
    borderRadius: 8,
    width: '20%',
  },

  featureBtn: {
    width: 50,
    height: 50,
  },

  featureText: {
    fontFamily: Fonts.SF_SEMIBOLD,
    alignContent: 'center',
  },

  newTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Dimension.setWidth(2.5),
  },

  newsText: {
    fontFamily: Fonts.SF_BOLD,
    fontSize: 17,
    marginVertical: Dimension.setHeight(0.2),
  },

  viewAllText: {
    fontFamily: Fonts.SF_SEMIBOLD,
    color: Colors.INACTIVE_GREY,
    fontSize: 15,
  },

  newsContainer: {
    marginBottom: Dimension.setHeight(1),
    borderWidth: 0.4,
    borderRadius: 18,
    backgroundColor: '#f5f5ff',
    borderColor: Colors.INACTIVE_GREY,
    elevation: 5,
    marginLeft: Dimension.setWidth(2),
    marginRight: Dimension.setWidth(0.5),
    width: Dimension.setWidth(71),
    paddingVertical: Dimension.setHeight(1),
    paddingHorizontal: Dimension.setWidth(2),
  },

  newsImg: {
    width: Dimension.setWidth(68),
    height: Dimension.setHeight(18),
    borderRadius: 18,
  },

  newsTitleText: {
    fontFamily: Fonts.SF_SEMIBOLD,
    fontSize: 16,
    lineHeight: Dimension.setHeight(3.3),
  },

  newsLocationText: {
    fontFamily: Fonts.SF_REGULAR,
    color: Colors.INACTIVE_GREY,
    fontSize: 14,
    lineHeight: Dimension.setHeight(2.3),
  },
});

export default HomePageScreen;
