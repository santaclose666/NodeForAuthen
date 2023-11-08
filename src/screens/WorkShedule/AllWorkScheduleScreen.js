import React, {useState, useCallback, useLayoutEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
} from 'react-native';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Dimension from '../../contants/Dimension';
import Header from '../../components/Header';
import {shadowIOS} from '../../contants/propsIOS';
import {totalWorkSchedule, warningWorkSchedule} from '../../redux/apiRequest';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {getCurrentDayOfWeek, getDayOfWeek} from '../../utils/serviceFunction';
import {WarningModal} from '../../components/Modal';
import Loading from '../../components/LoadingUI';
import {defaultIFEE, fontDefault, mainURL} from '../../contants/Variable';
import LinearGradientUI from '../../components/LinearGradientUI';
import {rowAlignCenter} from '../../contants/CssFE';
import Separation from '../../components/Separation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../contants/Colors';

const AllWorkScheduleScreen = ({navigation, route}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const unit = route.params.unit;
  const dispatch = useDispatch();
  const totalWorkData = useSelector(
    state => state.totalWork.totalWorkSchedule?.data,
  );
  const staffs =
    unit === 'IFEE'
      ? useSelector(state => state.staffs?.staffs?.IFEEStaff)
      : useSelector(state => state.staffs?.staffs?.XMGStaff);
  const [toggleWarningModal, setToggleWarningModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reasonInput, setReasonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [indexPicker, setIndexPicker] = useState(0);
  const currentDate = getDayOfWeek();
  const workRef = useRef(null);

  const handlePickItem = useCallback(item => {
    setSelectedItem(item);
    setToggleWarningModal(true);
  }, []);

  const handleWarning = useCallback(async (id, reason) => {
    try {
      setToggleWarningModal(false);
      setLoading(true);
      const data = {
        id_lichchitiet: id,
        lydo: reason,
        tendonvi: unit,
      };

      const res = await warningWorkSchedule(data);

      if (res) {
        setLoading(false);
        setTimeout(() => {
          fetTotalWorkSchedule();
        });
      }
    } catch (error) {
      setLoading(false);
    }
  }, []);

  const fetTotalWorkSchedule = async () => {
    const data = {
      tendonvi: unit,
    };
    await totalWorkSchedule(dispatch, data);
  };

  const handleFilter = index => {
    switch (index) {
      case 0:
        return totalWorkData?.t2;
      case 1:
        return totalWorkData?.t3;
      case 2:
        return totalWorkData?.t4;
      case 3:
        return totalWorkData?.t5;
      case 4:
        return totalWorkData?.t6;
      case 5:
        return totalWorkData?.t7;
      case 6:
        return totalWorkData?.cn;
    }
  };

  const handleSetDayOfWeek = () => {
    const dow = getCurrentDayOfWeek();
    if (dow === 0) {
      setIndexPicker(6);
    } else {
      setIndexPicker(dow - 1);
    }
  };

  const handlePullToRefresh = async () => {
    setRefresh(true);
    try {
      await fetTotalWorkSchedule();

      setRefresh(false);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    handleSetDayOfWeek();
    fetTotalWorkSchedule();
  }, []);

  const RenderTaskOfDay = useCallback(
    ({item}) => {
      const bgStatus =
        item.ct == 1
          ? '#fb872c'
          : item.noidung === 'Nghỉ phép'
          ? '#f25157'
          : '#31a277';
      const status =
        item.ct == 1
          ? 'Công tác'
          : item.noidung === 'Nghỉ phép'
          ? 'Nghỉ phép'
          : 'Cơ quan';
      const icon =
        item.ct == 1
          ? Images.working
          : item.noidung === 'Nghỉ phép'
          ? Images.leaveNoColor
          : Images.timecreate;

      const filterUser =
        unit === 'IFEE'
          ? staffs.filter(staff => staff.id_ifee == item.id_user)[0]
          : staffs.filter(staff => staff.id_xmg == item.id_user)[0];
      const bgColor = item.canhbao === 0 ? '#ffffff' : 'rgba(244, 222, 222, 1)';

      const checkRole = () => {
        if (unit === 'IFEE') {
          return (
            item.canhbao == 0 &&
            (user?.quyentruycap === 1 ||
              user?.vitri_ifee == 1 ||
              (user?.vitri_ifee == 3 &&
                filterUser?.vitri_ifee > 3 &&
                user?.tenphong == filterUser?.tenphong &&
                user.tendonvi === unit))
          );
        } else {
          return (
            item.canhbao == 0 &&
            (user?.quyentruycap === 1 ||
              user?.vitri_ifee == 1 ||
              (user?.vitri_ifee == 3 &&
                filterUser.info_phong[0]?.vitri_ifee > 3 &&
                user?.tenphong == filterUser.info_phong[0]?.tenphong &&
                user.tendonvi === unit))
          );
        }
      };

      const avt = filterUser?.path ? filterUser?.path : defaultIFEE;

      return (
        <View
          style={{
            alignItems: 'flex-start',
            alignSelf: 'center',
            paddingHorizontal: Dimension.setWidth(4),
            paddingVertical: Dimension.setHeight(2),
            marginVertical: Dimension.setHeight(1.2),
            borderRadius: 12,
            elevation: 5,
            ...shadowIOS,
            backgroundColor: bgColor,
            width: '86%',
          }}>
          <View
            style={{
              marginRight: Dimension.setWidth(5),
            }}>
            <View style={[styles.containerEachLine, {width: '86%'}]}>
              <Text style={styles.taskContentHeader}>{item.noidung}</Text>
            </View>
            <View style={[styles.containerEachLine, {width: '86%'}]}>
              <Text style={styles.content}>{item.diadiem}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: hp('1.2%'),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: bgStatus,
                borderRadius: 6,
                paddingHorizontal: 4,
                paddingVertical: Platform.OS === 'ios' ? 4 : 0,
              }}>
              <Image
                source={icon}
                style={{
                  width: 12,
                  height: 12,
                  tintColor: '#ffffff',
                  marginRight: 3,
                }}
              />
              <Text style={styles.smallText}>{status}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.nameText}>{item.ten}</Text>
              <Image
                src={mainURL + avt}
                style={{width: 32, height: 32, borderRadius: 50, marginLeft: 4}}
              />
            </View>
          </View>
          {checkRole() && (
            <TouchableOpacity
              onPress={() => {
                const data = {
                  ...item,
                  path: filterUser?.path,
                };
                handlePickItem(data);
              }}
              style={{
                position: 'absolute',
                top: hp('1.8%'),
                right: wp('2.8%'),
              }}>
              <Image source={Images.warning} style={styles.iconic} />
            </TouchableOpacity>
          )}
          {item.canhbao === 1 && (
            <View
              style={{
                position: 'absolute',
                top: hp('1.6%'),
                right: wp('2.6%'),
              }}>
              <Image source={Images.gotWarning} style={styles.iconic} />
            </View>
          )}
        </View>
      );
    },
    [totalWorkData],
  );

  return (
    <LinearGradientUI>
      <SafeAreaView style={{flex: 1}}>
        <Header title={'Tổng hợp lịch công tác'} navigation={navigation} />
        <View style={{marginVertical: hp('1.6%'), paddingLeft: wp('3%')}}>
          <View style={[rowAlignCenter, {marginBottom: hp('1%')}]}>
            <Text
              style={styles.headerText}>{`Tuần ${totalWorkData?.tuan}`}</Text>
            <Separation />
            <Text
              style={
                styles.headerText
              }>{`${currentDate.currMonth}/${currentDate?.currentYear}`}</Text>
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {currentDate.dayOfWeek.map((item, index) => {
              const isEqual = indexPicker === index;
              return (
                <TouchableOpacity
                  onPress={() => {
                    setIndexPicker(index);
                    setTimeout(() => {
                      workRef?.current?.scrollToIndex({
                        index: 0,
                        animated: true,
                      });
                    });
                  }}
                  style={{
                    marginRight: wp('4%'),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: isEqual ? 0 : 1,
                    borderColor: isEqual ? 'transparent' : '#696969',
                    paddingVertical: hp('0.6%'),
                    paddingHorizontal: wp('1%'),
                    borderRadius: 8,
                    width: wp('13%'),
                    backgroundColor: isEqual ? '#ffffff' : 'transparent',
                  }}
                  key={index}>
                  <Text
                    style={{
                      fontFamily: Fonts.SF_SEMIBOLD,
                      fontSize: wp('4.5%'),
                      color: isEqual ? '#11183c' : '#696969',
                      marginBottom: Platform.OS === 'ios' ? hp('1.5%') : 0,
                    }}>
                    {item.day}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.SF_SEMIBOLD,
                      fontSize: wp('3%'),
                      color: isEqual ? '#11183c' : '#696969',
                    }}>
                    {item.weekdays}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <FlatList
          ref={workRef}
          data={handleFilter(indexPicker)}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <RenderTaskOfDay item={item} index={index} />
          )}
          initialNumToRender={6}
          windowSize={6}
          removeClippedSubviews={true}
          refreshing={refresh}
          onRefresh={handlePullToRefresh}
        />

        <WarningModal
          toggleModal={toggleWarningModal}
          setToggleModal={setToggleWarningModal}
          item={selectedItem}
          reasonInput={reasonInput}
          setReasonInput={setReasonInput}
          handleWarning={handleWarning}
        />

        {loading && <Loading bg={true} />}
      </SafeAreaView>
    </LinearGradientUI>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerText: {
    fontFamily: Fonts.SF_BOLD,
    fontSize: wp('5%'),
    color: '#11124d',
  },

  smallText: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: wp('2.8%'),
    color: '#ffffff',
  },

  nameText: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: wp('3.3%'),
    color: Colors.DEFAULT_BLUE,
  },

  containerEachLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  iconic: {
    width: 22,
    height: 22,
  },

  title: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: Dimension.fontSize(15),
  },

  taskContentHeader: {
    fontFamily: Fonts.SF_SEMIBOLD,
    fontSize: wp('4%'),
    color: '#11124d',
  },

  content: {
    fontFamily: Fonts.SF_REGULAR,
    fontSize: wp('3.3%'),
    ...fontDefault,
  },

  avatarUserContainer: {
    borderWidth: 1,
    borderRadius: 50,
    padding: 1,
    borderColor: '#268fbe',
  },
});

export default AllWorkScheduleScreen;
