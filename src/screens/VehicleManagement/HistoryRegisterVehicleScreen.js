import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Dimension from '../../contants/Dimension';
import Header from '../../components/Header';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import Separation from '../../components/Separation';
import Colors from '../../contants/Colors';
import {cancelVehicle, getVehicleData} from '../../redux/apiRequest';
import {shadowIOS} from '../../contants/propsIOS';
import {mainURL} from '../../contants/Variable';
import StatusUI from '../../components/StatusUI';
import {changeFormatDate} from '../../utils/serviceFunction';

export const approveArr = [
  {
    title: 'Sử dụng',
    color: '#618cf2',
    bgColor: 'rgba(254, 244, 235, 0.3)',
    icon: Images.all,
  },
  {
    title: 'Chờ duyệt',
    color: '#f0b263',
    bgColor: 'rgba(254, 244, 235, 0.3)',
    icon: Images.pending1,
  },
  {
    title: 'Đã trả',
    color: '#57b85d',
    bgColor: 'rgba(222, 248, 237, 0.3)',
    icon: Images.approved1,
  },
  {
    title: 'Hủy bỏ',
    color: '#f25157',
    bgColor: 'rgba(249, 223, 224, 0.3)',
    icon: Images.cancelled,
  },
];

const HistoryRegisterVehicleScreen = ({navigation, route}) => {
  const refresh = route.params?.refresh;
  const user = useSelector(state => state.auth.login?.currentUser);
  const IFEEstaffs = useSelector(state => state.staffs?.staffs?.IFEEStaff);
  const allVehicleData = useSelector(
    state => state.vehicle?.vehicle?.statusData,
  );
  const [selectedItem, setSelectedItem] = useState(null);
  const [indexPicker, setIndexPicker] = useState(0);
  const [refreshComponent, setRefreshComponent] = useState(true);
  const bottomSheetModalRef = useRef(null);
  const dispatch = useDispatch();
  const snapPoints = useMemo(() => ['45%', '80%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback(index => {
    if (index < 0) {
      setSelectedItem(null);
    }
  }, []);

  const handleBottomSheet = useCallback(
    (item, colorStatus, bgColorStatus) => {
      setSelectedItem({
        ...item,
        colorStatus,
        bgColorStatus,
      });
      setTimeout(() => {
        handlePresentModalPress();
      });
    },
    [selectedItem],
  );

  const handleApprove = useCallback(item => {
    const data = {
      id_dulieu: item.id,
      id_user: user?.id,
    };

    approveVehicle(data);
    setRefreshComponent(!refreshComponent);
  }, []);

  const handleCancel = useCallback(item => {
    const data = {
      id_dulieu: item.id,
      id_user: user?.id,
    };

    cancelVehicle(data);
    setRefreshComponent(!refreshComponent);
  }, []);

  const handlePickOption = useCallback(
    index => {
      setIndexPicker(index);
    },
    [indexPicker],
  );

  const handleFilter = useCallback(
    index => {
      switch (index) {
        case 0:
          return allVehicleData?.filter(
            item => item.km_nhan === 0 && item.pheduyet === '1',
          );
        case 1:
          return allVehicleData?.filter(item => item.pheduyet === null);
        case 2:
          return allVehicleData?.filter(
            item => item.pheduyet === '1' && item.km_nhan !== 0,
          );
        case 3:
          return allVehicleData?.filter(item => item.pheduyet === '0');
      }
    },
    [allVehicleData],
  );

  const fetchVehicleData = () => {
    getVehicleData(dispatch, user?.id);
  };

  useLayoutEffect(() => {
    fetchVehicleData();

    if (refresh) {
      setIndexPicker(1);
    }
  }, [refresh, refreshComponent]);

  const RenderVehicleData = ({item, index}) => {
    const colorStatus =
      item.pheduyet === null
        ? '#f9a86a'
        : item.pheduyet === '1'
        ? '#57b85d'
        : '#f25157';
    const bgColorStatus =
      item.pheduyet === null
        ? '#fef4eb'
        : item.pheduyet === '1'
        ? '#def8ed'
        : '#f9dfe0';
    const status =
      item.pheduyet === '1'
        ? 'Phê duyệt'
        : item.pheduyet === '0'
        ? 'Từ chối'
        : 'Chờ phê duyệt';
    const icon =
      item.pheduyet === null
        ? Images.pending
        : item.pheduyet === '1'
        ? Images.approve
        : Images.cancel;

    const checktStatus = () => {
      return (
        ((user?.id === 2 || user?.id === 8) && item.pheduyet !== null) ||
        (user?.id !== 2 && user?.id !== 8)
      );
    };

    const checkRole = () => {
      return (user?.id === 2 || user?.id === 8) && item.pheduyet === null;
    };

    const userFilter = IFEEstaffs.filter(user => item.id_user === user.id)[0];
    return (
      <TouchableOpacity
        onPress={() => {
          handleBottomSheet(item, colorStatus, bgColorStatus);
        }}
        key={index}
        style={{
          marginHorizontal: Dimension.setWidth(3),
          marginBottom: Dimension.setHeight(2),
          backgroundColor: '#ffffff',
          elevation: 5,
          ...shadowIOS,
          borderRadius: 15,
          paddingHorizontal: Dimension.setWidth(5),
          paddingTop: Dimension.setHeight(2),
          paddingBottom: Dimension.setHeight(1),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '66%',
          }}>
          <Text style={{fontFamily: Fonts.SF_SEMIBOLD, fontSize: 18}}>
            {item.loaixe}
          </Text>
        </View>
        <View
          style={{position: 'absolute', right: '5%', top: '7%', zIndex: 9999}}>
          {checktStatus() && (
            <StatusUI
              status={status}
              colorStatus={colorStatus}
              bgColorStatus={bgColorStatus}
              icon={icon}
            />
          )}
          {checkRole() && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: Dimension.setWidth(17),
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  handleApprove(item);
                }}>
                <Image
                  source={Images.approved}
                  style={[styles.approvedIcon, {tintColor: '#57b85d'}]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleCancel(item);
                }}>
                <Image
                  source={Images.cancelled}
                  style={[styles.approvedIcon, {tintColor: '#f25157'}]}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View
          style={{
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.SF_MEDIUM,
              color: '#747476',
              marginBottom: Dimension.setHeight(0.8),
            }}>
            {item.noiden}
          </Text>
        </View>

        <View style={styles.containerEachLine}>
          <Image
            src={mainURL + userFilter?.path}
            style={[styles.Iconic, {borderRadius: 50}]}
          />
          <Text style={styles.title}>Đăng kí: </Text>
          <Text style={styles.content}>{item.hoten}</Text>
        </View>

        <View style={styles.containerEachLine}>
          <Image source={Images.datetime} style={styles.Iconic} />
          <Text style={styles.title}>Mượn từ:{'  '}</Text>
          <Text style={styles.content}>{changeFormatDate(item.ngaydi)}</Text>
          <Separation />
          <Text style={styles.content}>
            {changeFormatDate(item.ngayve) !== 'Invalid date'
              ? changeFormatDate(item.ngayve)
              : 'Không xác định'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Lịch sử đăng kí xe" navigation={navigation} />
      <View
        style={{
          flex: 0.1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        {approveArr?.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => handlePickOption(index)}
              key={index}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: Dimension.setHeight(2.2),
                paddingBottom: Dimension.setHeight(1.5),
                paddingHorizontal: Dimension.setWidth(3),
                height: '100%',
                borderBottomWidth: indexPicker === index ? 1.6 : null,
                borderBlockColor: indexPicker === index ? item.color : null,
              }}>
              <Image
                source={item.icon}
                style={{
                  padding: 5,
                  height: 25,
                  width: 25,
                  tintColor: indexPicker === index ? item.color : item.color,
                }}
              />
              <Text
                style={{
                  fontFamily: Fonts.SF_MEDIUM,
                  fontSize: 16,
                  opacity: 0.8,
                  color:
                    indexPicker === index ? item.color : Colors.DEFAULT_BLACK,
                }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <BottomSheetModalProvider>
        {handleFilter(indexPicker)?.length !== 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              paddingTop: Dimension.setHeight(3),
            }}
            data={handleFilter(indexPicker)}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item, index}) => (
              <RenderVehicleData item={item} index={index} />
            )}
            initialNumToRender={6}
            windowSize={6}
            removeClippedSubviews={true}
            refreshing={true}
            extraData={allVehicleData}
          />
        ) : (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: Fonts.SF_MEDIUM,
                color: Colors.INACTIVE_GREY,
              }}>
              Không có dữ liệu nào được tìm thấy
            </Text>
          </View>
        )}

        {selectedItem && (
          <BottomSheetModal
            backgroundStyle={{backgroundColor: selectedItem.bgColorStatus}}
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: Dimension.setHeight(1.2),
                paddingBottom: Dimension.setHeight(1.5),
                borderBottomWidth: 0.8,
                borderBottomColor: Colors.INACTIVE_GREY,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SF_BOLD,
                  fontSize: 20,
                  color: selectedItem.colorStatus,
                }}>
                Thông tin chi tiết
              </Text>
            </View>
            <BottomSheetScrollView showsVerticalScrollIndicator={false}>
              <View
                style={[
                  styles.bottomSheetContainer,
                  {marginTop: Dimension.setHeight(2.5)},
                ]}>
                <Text style={styles.titleBottomSheet}>Thông tin xe</Text>
                <View style={styles.containerEachLine}>
                  <Image source={Images.vehicles} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '66%',
                    }}>
                    <Text style={styles.title}>Loại xe:{'  '}</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {selectedItem.loaixe}
                    </Text>
                  </View>
                </View>
                <View style={styles.containerEachLine}>
                  <Image source={Images.vehicleplate} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '66%',
                    }}>
                    <Text style={styles.title}>Km Giao:{'  '}</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {selectedItem.km_giao}
                    </Text>
                  </View>
                </View>
                <View style={styles.containerEachLine}>
                  <Image source={Images.datetime} style={styles.Iconic} />
                  <Text style={styles.title}>Mượn từ:{'  '}</Text>
                  <Text style={styles.content}>
                    {changeFormatDate(selectedItem.ngaydi)}
                  </Text>
                  <Separation />
                  <Text style={styles.content}>
                    {changeFormatDate(selectedItem.ngayve) !== 'Invalid date'
                      ? changeFormatDate(selectedItem.ngayve)
                      : 'Không xác định'}
                  </Text>
                </View>
                <View style={styles.containerEachLine}>
                  <Image source={Images.content} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '90%',
                    }}>
                    <Text style={styles.title}>
                      Nội dung:{'  '}
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.content}>
                        {selectedItem.noidung}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.bottomSheetContainer}>
                <Text style={styles.titleBottomSheet}>
                  Người đăng kí & phê duyệt
                </Text>
                <View style={styles.containerEachLine}>
                  <Image source={Images.registerperson} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '66%',
                    }}>
                    <Text style={styles.title}>Người đăng kí:{'  '}</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {selectedItem.hoten}
                    </Text>
                  </View>
                </View>
                <View style={styles.containerEachLine}>
                  <Image source={Images.datetime} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '66%',
                    }}>
                    <Text style={styles.title}>Ngày duyệt:{'  '}</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {changeFormatDate(selectedItem.ngayduyet)}
                    </Text>
                  </View>
                </View>
              </View>
            </BottomSheetScrollView>
          </BottomSheetModal>
        )}
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },

  containerEachLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Dimension.setHeight(1.4),
    marginLeft: Dimension.setWidth(1.6),
  },

  Iconic: {
    height: 33,
    width: 33,
    marginRight: Dimension.setWidth(2),
  },

  title: {
    color: '#747476',
    fontSize: 15,
    fontFamily: Fonts.SF_MEDIUM,
  },

  content: {
    fontSize: 16,
    fontFamily: Fonts.SF_SEMIBOLD,
    color: '#747476',
  },

  bottomSheetContainer: {
    marginHorizontal: Dimension.setWidth(3),
    marginBottom: Dimension.setHeight(2),
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingTop: Dimension.setHeight(2.2),
    paddingBottom: Dimension.setHeight(1),
    paddingHorizontal: Dimension.setWidth(3),
    elevation: 5,
    ...shadowIOS,
  },

  titleBottomSheet: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: 17,
    color: '#8bc7bc',
    marginBottom: Dimension.setHeight(1.6),
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonItem: {
    borderColor: 'black',
    borderWidth: 0.25,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    height: Dimension.setHeight(3.5),
  },

  approvedIcon: {
    width: 30,
    height: 30,
  },
});

export default HistoryRegisterVehicleScreen;
