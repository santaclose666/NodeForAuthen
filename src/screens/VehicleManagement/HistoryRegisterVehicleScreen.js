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
import {getVehicleData} from '../../redux/apiRequest';
import {shadowIOS} from '../../contants/propsIOS';
import {mainURL} from '../../contants/Variable';

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
  const staffs = useSelector(state => state.staffs?.staffs?.allStaff);
  const allVehicleData = useSelector(
    state => state.vehicle?.vehicle?.statusData,
  );
  const [selectedItem, setSelectedItem] = useState(null);
  const [indexPicker, setIndexPicker] = useState(0);
  const [refreshComponent, setRefreshComponent] = useState(true);
  const bottomSheetModalRef = useRef(null);
  const dispatch = useDispatch();
  const snapPoints = useMemo(() => ['45%', '80%'], []);

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

  const handlePickItem = item => {
    setSelectedItem(item);
    setToggleApproveModal(true);
  };

  const handleNonAdjust = (check, item) => {
    setCheckInput(check);
    handlePickItem(item);
  };

  const handleSendNonAdjust = () => {
    const importantData = {
      idVehicle: selectedItem.id,
      id_user: user?.id,
    };
    if (!checkInput && selectedItem !== null) {
      const data = {
        ...importantData,
        lydo: reasonCancel,
      };
      rejectVehicleRequest(data);
      setReasonCancel(null);
      setRefreshComponent(!refreshComponent);
      setToggleApproveModal(false);
    } else if (checkInput && selectedItem !== null) {
      const data = {
        ...importantData,
        nhanxet: commnetInput,
      };
      resolveVehicleRequest(data);
      setCommentInput(null);
      setRefreshComponent(!refreshComponent);
      setToggleApproveModal(false);
    } else {
      ToastWarning('Nhập đầy đủ lý do');
    }
  };

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

    const userFilter = staffs.filter(
      user => item.id_user === user.id && user.tendonvi === 'IFEE',
    )[0];
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedItem({
            ...item,
            colorStatus: colorStatus,
            bgColorStatus: bgColorStatus,
          });
          handlePresentModalPress();
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
          paddingVertical: Dimension.setHeight(2),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontFamily: Fonts.SF_SEMIBOLD, fontSize: 19}}>
            {`${item.loaixe}: ${item.noidung}`}
          </Text>
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
            {item.noiden ? item.noiden : 'Không xác định'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: Dimension.setHeight(0.5),
              paddingHorizontal: Dimension.setWidth(1.4),
              borderRadius: 8,
              backgroundColor: bgColorStatus,
            }}>
            <Image
              source={icon}
              style={{
                height: 16,
                width: 16,
                marginRight: Dimension.setWidth(1),
                tintColor: colorStatus,
              }}
            />
            <Text
              style={{
                color: colorStatus,
                fontSize: 14,
                fontFamily: Fonts.SF_MEDIUM,
              }}>
              {status}
            </Text>
          </View>
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
          <Text style={styles.content}>{item.ngaydi}</Text>
          <Separation />
          <Text style={styles.content}>{item.ngayve}</Text>
        </View>
        {(user?.id == 2 || user?.id == 8) && item.pheduyet == null && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {}}
              style={[
                styles.buttonItem,
                {backgroundColor: 'rgba(0, 181, 32, 0.32)'},
              ]}>
              <Text style={{color: 'rgba(0, 84, 15, 1)'}}>Phê duyệt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={[
                styles.buttonItem,
                {backgroundColor: 'rgba(233, 0, 0, 0.32)'},
              ]}>
              <Text style={{color: 'rgba(233, 0, 0, 0.9)'}}>Từ chối</Text>
            </TouchableOpacity>
          </View>
        )}
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
                  tintColor: indexPicker === index ? item.color : '#edf2ed',
                }}
              />
              <Text
                style={{
                  fontFamily: Fonts.SF_MEDIUM,
                  fontSize: 16,
                  color: indexPicker === index ? item.color : '#edf2ed',
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

        {/* {selectedItem && (
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
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '66%',
                    }}>
                    <Text style={styles.title}>Mượn từ:{'  '}</Text>
                    <Text style={styles.content}>{selectedItem.ngaydi}</Text>
                    <Separation />
                    <Text style={styles.content}>{selectedItem.ngayve}</Text>
                  </View>
                </View>
                <View style={styles.containerEachLine}>
                  <Image source={Images.content} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '66%',
                    }}>
                    <Text style={styles.title}>Nội dung:{'  '}</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {selectedItem.noidung}
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
                  <Image source={Images.admin} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '66%',
                    }}>
                    <Text style={styles.title}>Người duyệt:{'  '}</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {getStaffByID(selectedItem.id_nguoiduyet)}
                    </Text>
                  </View>
                </View>
                <View style={styles.containerEachLine}>
                  <Image source={Images.outsideperson} style={styles.Iconic} />
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
                      {selectedItem.ngayduyet}
                    </Text>
                  </View>
                </View>
              </View>
            </BottomSheetScrollView>
          </BottomSheetModal>
        )} */}
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b6c987',
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
    alignSelf: 'center',
    color: '#747476',
    fontSize: 15,
    fontFamily: Fonts.SF_MEDIUM,
  },

  content: {
    fontSize: 16,
    fontFamily: Fonts.SF_SEMIBOLD,
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
});

export default HistoryRegisterVehicleScreen;
