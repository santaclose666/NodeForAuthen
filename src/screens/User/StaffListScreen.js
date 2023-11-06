import React, {useState, memo, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Platform,
} from 'react-native';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import {useDispatch, useSelector} from 'react-redux';
import {shadowIOS} from '../../contants/propsIOS';
import {fontDefault, mainURL} from '../../contants/Variable';
import LinearGradientUI from '../../components/LinearGradientUI';
import Header from '../../components/Header';
import {XMGGroup, IFEEGroup} from '../../contants/Variable';
import {getAllStaffs} from '../../redux/apiRequest';
import {screen} from '../AllScreen/allScreen';
import {StaffSkeleton} from '../../components/Skeleton';
import {Swipeable} from 'react-native-gesture-handler';
import Images from '../../contants/Images';
import {ToastAlert} from '../../components/Toast';

const StaffListScreen = ({navigation, route}) => {
  const unit = route.params;
  const dispatch = useDispatch();
  const [selectId, setSelectId] = useState(0);
  const staffs =
    unit === 'IFEE'
      ? useSelector(state => state.staffs?.staffs?.IFEEStaff)
      : useSelector(state => state.staffs?.staffs?.XMGStaff);
  const [loading, setLoading] = useState(true);

  const handleFilterIFEE = () => {
    if (selectId == 0) {
      return staffs;
    } else if (selectId == 1) {
      return staffs?.filter(
        item => item.vitri_ifee == 1 || item.vitri_ifee == 2,
      );
    } else if (selectId == 8) {
      return staffs?.filter(item => item.chucdanh == IFEEGroup[selectId]);
    } else {
      return staffs?.filter(item => item.tenphong == IFEEGroup[selectId]);
    }
  };

  const handleFilterXMG = () => {
    if (selectId == 0) {
      return staffs;
    } else if (selectId == 1) {
      const leader = staffs?.filter(
        item =>
          item.info_phong[0].vitri_ifee === '1' ||
          item.info_phong[0].vitri_ifee === '2',
      );
      return leader;
    } else if (selectId == 7) {
      return staffs?.filter(item => {
        return item.info_phong?.some(
          group => group.chucdanh == XMGGroup[selectId],
        );
      });
    } else {
      return staffs?.filter(item => {
        return item.info_phong?.some(
          group => group.tenphong == XMGGroup[selectId],
        );
      });
    }
  };

  const handleCall = async phoneNumber => {
    let phone =
      Platform.OS === 'ios' ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;

    try {
      const isSupported = await Linking.canOpenURL(phone);
      if (isSupported) {
        return Linking.openURL(phone);
      } else {
        ToastAlert('Invalid Phone Number!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllStaffList = async () => {
    try {
      await getAllStaffs(dispatch);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    fetchAllStaffList();
  }, []);

  const rightSwipe = phoneNumber => {
    return (
      <View style={styles.rightSwipeContainer}>
        <TouchableOpacity
          onPress={() => {
            handleCall(phoneNumber);
          }}
          style={styles.btnRightSwipe}>
          <Image source={Images.call} style={{width: 45, height: 45}} />
        </TouchableOpacity>
      </View>
    );
  };

  const RenderStaffs = memo(({item, index}) => {
    const role = unit === 'XMG' ? item.info_phong[0].chucdanh : item.chucdanh;

    return (
      <Swipeable
        renderRightActions={() => {
          return rightSwipe(item.sdt);
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(screen.staffDetail, {item: item});
          }}
          key={index}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 12,
            borderColor: Colors.WHITE,
            backgroundColor: Colors.WHITE,
            paddingHorizontal: Dimension.setWidth(1),
            paddingVertical: Dimension.setWidth(2),
            marginVertical: Dimension.setWidth(1),
            marginHorizontal: Dimension.setWidth(2),
            ...shadowIOS,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: Dimension.setHeight(1),
              marginLeft: Dimension.setWidth(2),
              maxWidth: Dimension.setWidth(60),
            }}>
            <Image
              src={`${mainURL + item.path}`}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                marginRight: Dimension.setWidth(3),
              }}
            />
            <View style={{justifyContent: 'center'}}>
              <Text
                style={{
                  fontFamily: Fonts.SF_SEMIBOLD,
                  fontSize: Dimension.fontSize(19),
                  ...fontDefault,
                }}>
                {item.hoten}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: Colors.INACTIVE_GREY,
                  fontFamily: Fonts.SF_REGULAR,
                  fontSize: Dimension.fontSize(15),
                  width: Dimension.setWidth(45),
                }}>
                {item.email}
              </Text>
            </View>
          </View>
          <View
            style={{
              alignItems: 'flex-end',
              marginRight: Dimension.setWidth(3.6),
            }}>
            <Text
              style={{
                fontFamily: Fonts.SF_REGULAR,
                fontSize: Dimension.fontSize(16),
                color: Colors.INACTIVE_GREY,
              }}>
              Chức vụ
            </Text>
            <Text
              style={{
                fontFamily: Fonts.SF_SEMIBOLD,
                fontSize: Dimension.fontSize(15),
                ...fontDefault,
              }}>
              {role}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  });

  return (
    <LinearGradientUI
      colors={['rgba(153,255,153,0.9)', 'rgba(255,204,204,0.8)']}
      style={{flex: 1, padding: 3}}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <SafeAreaView style={styles.container}>
        <Header title="Danh sách nhân sự" navigation={navigation} />
        <View
          style={{
            marginLeft: Dimension.setWidth(4),
            marginTop: Dimension.setHeight(1),
            marginBottom: Dimension.setHeight(1.5),
          }}>
          <FlatList
            data={unit === 'XMG' ? XMGGroup : IFEEGroup}
            keyExtractor={(_, index) => index}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            extraData={staffs}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => setSelectId(index)}
                  key={index}
                  style={{
                    marginRight: Dimension.setWidth(4.4),
                    paddingVertical: 3,
                    borderBottomWidth: selectId === index ? 2 : 0,
                    borderBottomColor:
                      selectId === index ? Colors.DEFAULT_GREEN : '#fff',
                  }}>
                  <Text
                    style={{
                      fontFamily:
                        selectId === index
                          ? Fonts.SF_SEMIBOLD
                          : Fonts.SF_REGULAR,
                      fontSize: Dimension.fontSize(16),
                      opacity: 0.8,
                      color:
                        selectId === index
                          ? Colors.DEFAULT_GREEN
                          : Colors.DEFAULT_BLACK,
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {loading ? (
          <StaffSkeleton />
        ) : (
          <FlatList
            data={unit === 'IFEE' ? handleFilterIFEE() : handleFilterXMG()}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item, index}) => (
              <RenderStaffs item={item} index={index} />
            )}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            windowSize={10}
            removeClippedSubviews={true}
          />
        )}
      </SafeAreaView>
    </LinearGradientUI>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
  },

  nameScreenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Dimension.setHeight(2.5),
    marginHorizontal: Dimension.setWidth(3.6),
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Dimension.setWidth(2.5),
    marginTop: Dimension.setHeight(1),
    marginBottom: Dimension.setHeight(2),
  },

  searchInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    width: '85%',
    borderRadius: 9,
    height: Dimension.setHeight(5.5),
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },

  filterBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
    width: '13%',
    marginTop: 20,
    marginBottom: 20,
    marginRight: 18,
    borderRadius: 10,
  },

  staffListContainer: {
    marginLeft: Dimension.setWidth(4),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Dimension.setHeight(1),
  },

  dropdown: {
    width: Dimension.setWidth(20),
  },
  containerOptionStyle: {
    borderRadius: 12,
    backgroundColor: '#f6f6f8ff',
    width: Dimension.setWidth(30),
    alignSelf: 'center',
  },
  rightSwipeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
});

export default StaffListScreen;
