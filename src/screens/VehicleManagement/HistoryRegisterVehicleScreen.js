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
  Keyboard,
  TouchableWithoutFeedback,
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
import {
  cancelVehicle,
  getVehicleData,
  approveVehicle,
  returnVehicle,
} from '../../redux/apiRequest';
import {shadowIOS} from '../../contants/propsIOS';
import {mainURL} from '../../contants/Variable';
import StatusUI from '../../components/StatusUI';
import {
  changeFormatDate,
  compareDate,
  formatDate,
  formatDateToPost,
} from '../../utils/serviceFunction';
import {ConfirmModal} from '../../components/Modal';
import LinearGradientUI from '../../components/LinearGradientUI';
import Modal from 'react-native-modal';
import {TextInput} from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {ToastAlert} from '../../components/Toast';
import {launchImageLibrary} from 'react-native-image-picker';
import {TransparentFullScreen} from '../../components/LoadingUI';
import ImageView from 'react-native-image-viewing';
import {Dropdown} from 'react-native-element-dropdown';
import RedPoint from '../../components/RedPoint';
import {rowAlignCenter} from '../../contants/CssFE';
import {EmptyList} from '../../components/FlatlistComponent';
import {InternalSkeleton} from '../../components/Skeleton';

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

const HistoryRegisterVehicleScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const IFEEstaffs = useSelector(state => state.staffs?.staffs?.IFEEStaff);
  const allVehicleData = useSelector(
    state => state.vehicle?.vehicle?.statusData,
  );
  const [selectedItem, setSelectedItem] = useState(null);
  const [indexPicker, setIndexPicker] = useState(0);
  const [isConfirm, setIsConfirm] = useState(null);
  const [toggleConfirmModal, setToggleConfirmModal] = useState(false);
  const [toggleReturnModal, setToggleReturnModal] = useState(false);
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [endDate, setEndDate] = useState(formatDate(new Date()));
  const [km, setKm] = useState('');
  const [gasPrice, setGasPrice] = useState('');
  const [maintenancePrice, setMaintenancePrice] = useState('');
  const [maintenancePerson, setMaintenancePerson] = useState(null);
  const [filePicker, setFilePicker] = useState(null);
  const [zoomImg, setZoomImg] = useState(false);
  const [loading, setLoading] = useState(true);
  const [propose, setPropose] = useState('');
  const allStaffs = IFEEstaffs.map(item => {
    return {name: item.hoten};
  });
  const [staffValue, setStaffValue] = useState(null);
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
    (item, path, colorStatus, bgColorStatus) => {
      setSelectedItem({
        ...item,
        path,
        colorStatus,
        bgColorStatus,
      });
      setTimeout(() => {
        handlePresentModalPress();
      });
    },
    [selectedItem],
  );

  const handlePickItem = useCallback((item, status) => {
    bottomSheetModalRef.current?.dismiss();
    setSelectedItem(item);
    setIsConfirm(status);
    setToggleConfirmModal(true);
  }, []);

  const handleApprove = useCallback(item => {
    const data = {
      id_dulieu: item.id,
      id_user: user?.id,
      tendonvi: user?.tendonvi,
    };

    approveVehicle(data);
    setToggleConfirmModal(false);
    setTimeout(() => {
      fetchVehicleData();
    });
  }, []);

  const handleCancel = useCallback(item => {
    const data = {
      id_dulieu: item.id,
      id_user: user?.id,
      tendonvi: user?.tendonvi,
    };

    cancelVehicle(data);
    setToggleConfirmModal(false);
    setTimeout(() => {
      fetchVehicleData();
    });
  }, []);

  const handleToggleReturnModal = item => {
    bottomSheetModalRef.current?.dismiss();
    setSelectedItem(item);
    setToggleReturnModal(true);
  };

  const handlePickDate = date => {
    compareDate(new Date(), date)
      ? setEndDate(formatDate(date))
      : ToastAlert('Ngày về không hợp lệ!');

    setToggleDatePicker(false);
  };

  const handlePickImg = async () => {
    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
      });

      setFilePicker(res.assets[0]);
      console.log(res.assets[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReturnVehicle = async () => {
    if (filePicker && km != '') {
      setToggleReturnModal(false);
      setLoading(true);
      const data = {
        id: selectedItem.id,
        ngayve: formatDateToPost(endDate),
        km_nhan: km,
        phixangxe: gasPrice,
        nguoimuaxang: staffValue,
        phibaoduong: maintenancePrice,
        nguoibaoduong: maintenancePerson,
        propose,
        file: {
          uri: filePicker.uri,
          type: filePicker.type,
          name: filePicker.fileName,
        },
        tendonvi: user?.tendonvi,
      };
      try {
        const res = await returnVehicle(data);

        if (res) {
          setLoading(false);
          setTimeout(() => {
            fetchVehicleData();
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      ToastAlert('Thiếu thông tin!');
    }

    setToggleReturnModal(false);
  };

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

  const fetchVehicleData = async () => {
    try {
      const data = {
        id: user?.id,
        tendonvi: user?.tendonvi,
      };

      const res = await getVehicleData(dispatch, data);

      if (res) {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    fetchVehicleData();
  }, []);

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

    const checkReturnCar = () => {
      return (
        item.km_nhan === 0 && item.pheduyet === '1' && user?.id === item.id_user
      );
    };

    const userFilter = IFEEstaffs.filter(user => item.id_user === user.id)[0];
    return (
      <TouchableOpacity
        onPress={() => {
          handleBottomSheet(item, userFilter?.path, colorStatus, bgColorStatus);
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
                  handlePickItem(item, true);
                }}>
                <Image
                  source={Images.approved}
                  style={[styles.approvedIcon, {tintColor: '#57b85d'}]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handlePickItem(item, false);
                }}>
                <Image
                  source={Images.cancelled}
                  style={[styles.approvedIcon, {tintColor: '#f25157'}]}
                />
              </TouchableOpacity>
            </View>
          )}
          {checkReturnCar() && (
            <TouchableOpacity
              onPress={() => {
                handleToggleReturnModal(item);
              }}
              style={{
                alignSelf: 'flex-end',
                marginTop: Dimension.setHeight(0.6),
              }}>
              <Image source={Images.return} style={{width: 36, height: 36}} />
            </TouchableOpacity>
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
              fontSize: Dimension.fontSize(16),
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
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header
          title="Lịch sử đăng kí xe"
          navigation={navigation}
          refreshData={fetchVehicleData}
        />
        <View
          style={{
            flex: 0.1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: Dimension.setHeight(1.8),
          }}>
          {approveArr?.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => handlePickOption(index)}
                key={index}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
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
                    fontSize: Dimension.fontSize(16),
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

        {loading ? (
          <InternalSkeleton />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              paddingTop: Dimension.setHeight(2),
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
            ListEmptyComponent={() => {
              return <EmptyList />;
            }}
          />
        )}
        <BottomSheetModalProvider>
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
                    fontSize: Dimension.fontSize(20),
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
                    <View style={styles.containerLine}>
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
                    <View style={styles.containerLine}>
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
                    <View style={styles.containerLine}>
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
                    <Image
                      src={mainURL + selectedItem.path}
                      style={styles.Iconic}
                    />
                    <View style={styles.containerLine}>
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
                    <View style={styles.containerLine}>
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
        <ConfirmModal
          screenName={'HistoryRegisterVehicle'}
          toggleModal={toggleConfirmModal}
          setToggleModal={setToggleConfirmModal}
          item={selectedItem}
          status={isConfirm}
          handleApprove={handleApprove}
          handleCancel={handleCancel}
        />

        <Modal
          isVisible={toggleReturnModal}
          animationIn="fadeInUp"
          animationInTiming={100}
          animationOut="fadeOutDown"
          animationOutTiming={100}
          avoidKeyboard={true}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}>
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
                  Trả xe
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: Dimension.setHeight(1.5),
                  paddingHorizontal: Dimension.setWidth(3),
                }}>
                <Image
                  source={
                    selectedItem?.loaixe.includes('WAVE')
                      ? Images.motorbike
                      : Images.vehicles
                  }
                  style={{height: 55, width: 55}}
                />
                <Text
                  style={{
                    fontSize: Dimension.fontSize(18),
                    fontFamily: Fonts.SF_SEMIBOLD,
                  }}>
                  {user?.hoten}
                </Text>
              </View>

              <View style={styles.lineContainerModal}>
                <View style={[styles.itemContainerModal, {width: '100%'}]}>
                  <Text style={styles.titleModal}>Người mua xăng</Text>
                  <View style={styles.containerEachLine1}>
                    <Dropdown
                      style={styles.dropdown}
                      autoScroll={false}
                      showsVerticalScrollIndicator={false}
                      placeholderStyle={styles.placeholderStyle}
                      selectedStyle={styles.selectedStyle}
                      selectedTextStyle={[
                        styles.selectedTextStyle,
                        {fontSize: 13},
                      ]}
                      containerStyle={styles.containerOptionStyle}
                      iconStyle={styles.iconStyle}
                      itemContainerStyle={styles.itemContainer}
                      itemTextStyle={styles.itemText}
                      fontFamily={Fonts.SF_MEDIUM}
                      search
                      searchPlaceholder="Tìm kiếm..."
                      activeColor="#eef2feff"
                      data={allStaffs}
                      maxHeight={Dimension.setHeight(30)}
                      labelField="name"
                      valueField="name"
                      placeholder="Chọn người mua xăng"
                      value={staffValue}
                      renderLeftIcon={() => {
                        return (
                          <Image
                            source={Images.person}
                            style={styles.leftIconDropdown}
                          />
                        );
                      }}
                      onChange={item => {
                        setStaffValue(item.name);
                      }}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.lineContainerModal}>
                <View style={styles.itemContainerModal}>
                  <View style={rowAlignCenter}>
                    <Text style={styles.titleModal}>Ngày về</Text>
                    <RedPoint />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setToggleDatePicker(true);
                    }}
                    style={[
                      styles.dateModalContainer,
                      {height: Dimension.setHeight(6.5)},
                    ]}>
                    <Text style={styles.contentModal}>{endDate}</Text>
                    <View
                      style={[
                        styles.imgModalContainer,
                        {backgroundColor: '#7cc985'},
                      ]}>
                      <Image
                        source={Images.calendarBlack}
                        style={styles.imgDate}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.itemContainerModal}>
                  <View style={rowAlignCenter}>
                    <Text style={styles.titleModal}>Km nhận</Text>
                    <RedPoint />
                  </View>
                  <View style={styles.dateModalContainer}>
                    <TextInput
                      style={{
                        borderBottomWidth: 0.6,
                        borderBottomColor: 'gray',
                        marginHorizontal: Dimension.setWidth(1.6),
                        fontFamily: Fonts.SF_MEDIUM,
                        fontSize: Dimension.fontSize(16),
                        height: Dimension.setHeight(6),
                        width: '65%',
                      }}
                      inputMode="numeric"
                      value={km}
                      onChangeText={e => setKm(e)}
                    />
                    <View
                      style={[
                        styles.imgModalContainer,
                        {backgroundColor: '#61c4b2'},
                      ]}>
                      <Image source={Images.km} style={[styles.imgDate]} />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.lineContainerModal}>
                <View style={[styles.itemContainerModal, {width: '100%'}]}>
                  <Text style={styles.titleModal}>Người bảo dưỡng</Text>
                  <View style={styles.containerEachLine1}>
                    <Dropdown
                      style={styles.dropdown}
                      autoScroll={false}
                      showsVerticalScrollIndicator={false}
                      placeholderStyle={styles.placeholderStyle}
                      selectedStyle={styles.selectedStyle}
                      selectedTextStyle={[
                        styles.selectedTextStyle,
                        {fontSize: 13},
                      ]}
                      containerStyle={styles.containerOptionStyle}
                      iconStyle={styles.iconStyle}
                      itemContainerStyle={styles.itemContainer}
                      itemTextStyle={styles.itemText}
                      fontFamily={Fonts.SF_MEDIUM}
                      search
                      searchPlaceholder="Tìm kiếm..."
                      activeColor="#eef2feff"
                      data={allStaffs}
                      maxHeight={Dimension.setHeight(30)}
                      labelField="name"
                      valueField="name"
                      placeholder="Chọn người bảo dưỡng"
                      value={maintenancePerson}
                      renderLeftIcon={() => {
                        return (
                          <Image
                            source={Images.person}
                            style={styles.leftIconDropdown}
                          />
                        );
                      }}
                      onChange={item => {
                        setMaintenancePerson(item.name);
                      }}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.lineContainerModal}>
                <View style={styles.itemContainerModal}>
                  <Text style={styles.titleModal}>Phí xăng xe</Text>
                  <View style={styles.dateModalContainer}>
                    <TextInput
                      style={{
                        borderBottomWidth: 0.6,
                        borderBottomColor: 'gray',
                        marginHorizontal: Dimension.setWidth(1.6),
                        fontFamily: Fonts.SF_MEDIUM,
                        fontSize: Dimension.fontSize(16),
                        height: Dimension.setHeight(6),
                        width: '65%',
                      }}
                      inputMode="numeric"
                      value={gasPrice}
                      onChangeText={e => setGasPrice(e)}
                    />
                    <View
                      style={[
                        styles.imgModalContainer,
                        {backgroundColor: '#edcb8b'},
                      ]}>
                      <Image source={Images.petro} style={[styles.imgDate]} />
                    </View>
                  </View>
                </View>
                <View style={styles.itemContainerModal}>
                  <Text style={styles.titleModal}>Phí bảo dưỡng</Text>
                  <View style={styles.dateModalContainer}>
                    <TextInput
                      style={{
                        borderBottomWidth: 0.6,
                        borderBottomColor: 'gray',
                        marginHorizontal: Dimension.setWidth(1.6),
                        fontFamily: Fonts.SF_MEDIUM,
                        fontSize: Dimension.fontSize(16),
                        height: Dimension.setHeight(6),
                        width: '65%',
                      }}
                      inputMode="numeric"
                      value={maintenancePrice}
                      onChangeText={e => setMaintenancePrice(e)}
                    />
                    <View
                      style={[
                        styles.imgModalContainer,
                        {backgroundColor: '#7f8cd1'},
                      ]}>
                      <Image
                        source={Images.maintenance}
                        style={[styles.imgDate]}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.lineContainerModal}>
                <View style={[styles.itemContainerModal, {width: '100%'}]}>
                  <Text style={styles.titleModal}>Đề xuất</Text>
                  <View style={[styles.dateModalContainer, {width: '100%'}]}>
                    <TextInput
                      placeholder="Nhập đề xuất"
                      style={{
                        borderBottomWidth: 0.6,
                        borderBottomColor: 'gray',
                        marginHorizontal: Dimension.setWidth(1.6),
                        fontFamily: Fonts.SF_MEDIUM,
                        fontSize: Dimension.fontSize(16),
                        height: Dimension.setHeight(6),
                        width: '95%',
                      }}
                      value={propose}
                      onChangeText={e => setPropose(e)}
                    />
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.lineContainerModal,
                  {justifyContent: 'flex-start'},
                ]}>
                <View style={styles.itemContainerModal}>
                  <View style={rowAlignCenter}>
                    <Text style={styles.titleModal}>File ảnh</Text>
                    <RedPoint />
                  </View>
                  <TouchableOpacity
                    onPress={handlePickImg}
                    style={styles.dateModalContainer}>
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontFamily: Fonts.SF_REGULAR,
                        color: '#cddef1',
                      }}>
                      Upload...
                    </Text>
                    <View
                      style={[
                        styles.imgModalContainer,
                        {backgroundColor: '#cddef1'},
                      ]}>
                      <Image source={Images.uploadimg} style={styles.imgDate} />
                    </View>
                  </TouchableOpacity>
                </View>

                {filePicker && (
                  <TouchableOpacity
                    style={styles.itemContainerModal}
                    onPress={() => {
                      setZoomImg(true);
                    }}>
                    <Image
                      source={{uri: filePicker.uri}}
                      style={{width: 66, height: 66, borderRadius: 6}}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                onPress={() => {
                  setToggleReturnModal(false);
                }}
                style={{position: 'absolute', left: 12, top: 12}}>
                <Image source={Images.minusclose} style={styles.btnModal} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleReturnVehicle}
                style={{position: 'absolute', right: 12, top: 12}}>
                <Image source={Images.confirm} style={styles.btnModal} />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
          <DateTimePickerModal
            isVisible={toggleDatePicker}
            mode="date"
            onConfirm={handlePickDate}
            onCancel={() => {
              setToggleDatePicker(false);
            }}
          />

          <ImageView
            images={[{uri: filePicker?.uri}]}
            imageIndex={0}
            visible={zoomImg}
            onRequestClose={() => setZoomImg(false)}
          />
        </Modal>
        {loading && <TransparentFullScreen />}
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
    fontSize: Dimension.fontSize(15),
    fontFamily: Fonts.SF_MEDIUM,
  },

  content: {
    fontSize: Dimension.fontSize(16),
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
    fontSize: Dimension.fontSize(17),
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
    backgroundColor: '#ed735f',
    padding: Dimension.setWidth(1.1),
    borderRadius: 8,
  },

  imgDate: {
    height: 17,
    width: 17,
    tintColor: '#ffffff',
  },

  btnModal: {
    width: 28,
    height: 28,
  },

  containerEachLine1: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 12,
    paddingVertical: Dimension.setHeight(1.6),
    paddingHorizontal: Dimension.setWidth(3),
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

  containerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '88%',
  },
});

export default HistoryRegisterVehicleScreen;
