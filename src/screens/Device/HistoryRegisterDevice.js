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
  TextInput,
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
import Colors from '../../contants/Colors';
import {
  approveRegisterDevice,
  cancelRegisterDevice,
  getAllListDevice,
  returnDevice,
} from '../../redux/apiRequest';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import StatusUI from '../../components/StatusUI';
import {ConfirmModal} from '../../components/Modal';
import {shadowIOS} from '../../contants/propsIOS';
import FilterStatusUI from '../../components/FilterStatusUI';
import LinearGradientUI from '../../components/LinearGradientUI';
import {
  changeFormatDate,
  formatDateToPost,
  getCurrentDate,
} from '../../utils/serviceFunction';
import {fontDefault, mainURL} from '../../contants/Variable';
import Loading from '../../components/LoadingUI';
import Modal from 'react-native-modal';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import RedPoint from '../../components/RedPoint';
import {rowAlignCenter} from '../../contants/CssFE';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {compareDate, formatDate} from '../../utils/serviceFunction';
import {ToastAlert, ToastSuccess} from '../../components/Toast';

const deviceState = [{state: 'Bình thường'}, {state: 'Hỏng'}, {state: 'Lỗi'}];

const HistoryRegisterDevice = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const deviceData = useSelector(state => state.device.deviceSlice?.data);
  const IFEEstaffs = useSelector(state => state.staffs?.staffs?.IFEEStaff);
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleReturnModal, setToggleReturnModal] = useState(false);
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [checkInput, setCheckInput] = useState(null);
  const [indexPicker, setIndexPicker] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deviceStateValue, setDeviceStateValue] = useState(
    deviceState[0].state,
  );
  const [notReturnData, setNotReturnData] = useState([]);
  const [notReturnDataValue, setNotReturnDataValue] = useState([]);
  const [returnDate, setReturnDate] = useState(getCurrentDate());
  const [reason, setReason] = useState(null);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['45%', '80%'], []);

  const checkRoleUser = () => {
    return user?.quyentruycap == 1 || user?.id_ht == 6;
  };

  const handlePickDate = date => {
    compareDate(new Date(), date)
      ? setReturnDate(formatDate(date))
      : ToastAlert('Ngày về không hợp lệ!');

    setToggleDatePicker(false);
  };

  const handleBottomSheet = useCallback(
    (item, path, bgColorStatus) => {
      setSelectedItem({...item, path, bgColorStatus});
      setTimeout(() => {
        handlePresentModalPress();
      });
    },
    [selectedItem],
  );

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback(index => {
    if (index < 0) {
      setSelectedItem(null);
    }
  }, []);

  const handlePickItem = useCallback((item, status) => {
    bottomSheetModalRef.current?.dismiss();
    setSelectedItem(item);
    setCheckInput(status);
    setToggleModal(true);
  }, []);

  const handleApprove = useCallback(item => {
    const data = {
      id_user: item?.id_user,
    };

    approveRegisterDevice(data);
    setToggleModal(false);
    setTimeout(() => {
      fetchAllListDevice();
    });
  }, []);

  const handleCancel = useCallback(item => {
    const data = {
      id_user: item?.id_user,
    };

    cancelRegisterDevice(data);
    setToggleModal(false);
    setTimeout(() => {
      fetchAllListDevice();
    });
  }, []);

  const handleReturnDevice = async () => {
    if (notReturnDataValue.length != 0) {
      setLoading(true);
      setToggleReturnModal(false);
      const data = {
        id_user: user?.id,
        id_thietbi: notReturnDataValue,
        ngaytra_thucte: formatDateToPost(returnDate),
        tinhtrangTB: deviceStateValue,
        nguyennhan: reason,
      };

      const res = await returnDevice(data);

      if (res) {
        await getAllListDevice(dispatch, data, checkRoleUser());

        setTimeout(() => {
          setLoading(false);
        });
      }
    } else {
      ToastAlert('Thiếu thông tin thiết bị!');
    }
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
          return deviceData?.pending;
        case 1:
          return deviceData?.approved;
        case 2:
          return [];
      }
    },
    [deviceData],
  );

  const fetchAllListDevice = async () => {
    setLoading(true);
    try {
      const data = {
        id_user: user?.id,
      };

      const res = await getAllListDevice(dispatch, data, checkRoleUser());

      if (res) {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    fetchAllListDevice();
  }, []);

  const RenderTicketData = useCallback(
    ({item, index}) => {
      const colorStatus =
        indexPicker === 0
          ? '#f9a86a'
          : indexPicker === 1
          ? '#57b85d'
          : '#f25157';
      const bgColorStatus =
        indexPicker === 0
          ? '#fef4eb'
          : indexPicker === 1
          ? '#def8ed'
          : '#f9dfe0';
      const status =
        indexPicker === 0
          ? 'Chờ phê duyệt'
          : indexPicker === 1
          ? 'Đã phê duyệt'
          : 'Đã hủy';
      const icon =
        indexPicker === 0
          ? Images.pending
          : indexPicker === 1
          ? Images.approve
          : Images.cancel;

      const filterUser = IFEEstaffs.filter(user => user.id == item.id_user)[0];

      const checkRole = () => {
        return indexPicker == 0 && checkRoleUser();
      };

      const checkReturn = () => {
        const check = item?.daduyet?.some(
          check => check?.tinhtrang_trathietbi == '0',
        );

        return check;
      };

      return (
        <TouchableOpacity
          onPress={() => {
            checkRoleUser()
              ? handleBottomSheet(item, filterUser?.path, bgColorStatus)
              : null;
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
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '66%',
              marginBottom: Dimension.setHeight(0.8),
            }}>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: Fonts.SF_SEMIBOLD,
                fontSize: Dimension.fontSize(18),
                ...fontDefault,
              }}>
              {checkRoleUser()
                ? `Tổng cộng ${
                    indexPicker == 0
                      ? item.thietbi?.length
                      : item.daduyet?.length
                  } văn phòng phẩm ${status.toLocaleLowerCase()}`
                : `${item?.thietbi}`}
            </Text>
          </View>

          <View
            style={{
              position: 'absolute',
              right: '5%',
              top: '7%',
              zIndex: 9999,
            }}>
            <StatusUI
              status={status}
              colorStatus={colorStatus}
              bgColorStatus={bgColorStatus}
              icon={icon}
            />
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

            {checkRoleUser() && checkReturn() && (
              <TouchableOpacity
                onPress={() => {
                  const filterDevice = item.daduyet
                    .filter(filter => filter.tinhtrang_trathietbi == '0')
                    .map(map => {
                      return {
                        name: `${map.thietbi}-${map.id_thietbi}`,
                        id: map.id,
                      };
                    });

                  setNotReturnData(filterDevice);

                  setTimeout(() => {
                    setToggleReturnModal(true);
                  });
                }}
                style={{
                  alignSelf: 'flex-end',
                  marginTop: Dimension.setHeight(0.6),
                }}>
                <Image source={Images.return} style={{width: 36, height: 36}} />
              </TouchableOpacity>
            )}
          </View>

          {checkRoleUser() ? (
            <View style={styles.containerEachLine}>
              <Image
                src={mainURL + filterUser?.path}
                style={[styles.Iconic, {borderRadius: 50}]}
              />
              <Text style={[styles.title, {width: '90%'}]}>
                Người đăng kí:{' '}
                <Text style={styles.content}>{item.nguoidangky}</Text>
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.containerEachLine}>
                <Image source={Images.borrowDate} style={styles.Iconic} />
                <Text style={[styles.title, {width: '90%'}]}>
                  Ngày mượn:{' '}
                  <Text style={styles.content}>
                    {changeFormatDate(item.ngaymuon)}
                  </Text>
                </Text>
              </View>
              <View style={styles.containerEachLine}>
                <Image source={Images.returnDate} style={styles.Iconic} />
                <Text style={[styles.title, {width: '90%'}]}>
                  Ngày trả:{' '}
                  <Text style={styles.content}>
                    {item.ngaytra
                      ? changeFormatDate(item.ngaytra)
                      : 'Không xác định'}
                  </Text>
                </Text>
              </View>
            </>
          )}
        </TouchableOpacity>
      );
    },
    [indexPicker],
  );

  return (
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header title={`Lịch sử đăng kí thiết bị`} navigation={navigation} />
        <BottomSheetModalProvider>
          <FilterStatusUI
            handlePickOption={handlePickOption}
            indexPicker={indexPicker}
          />

          {handleFilter(indexPicker)?.length !== 0 ? (
            <View
              style={{
                flex: 1,
                paddingTop: Dimension.setHeight(3),
              }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={handleFilter(indexPicker)}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item, index}) => (
                  <RenderTicketData item={item} index={index} />
                )}
                initialNumToRender={6}
                windowSize={6}
                removeClippedSubviews={true}
                extraData={deviceData}
              />
            </View>
          ) : (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text
                style={{
                  fontSize: Dimension.fontSize(20),
                  fontFamily: Fonts.SF_MEDIUM,
                  color: Colors.INACTIVE_GREY,
                }}>
                Không có dữ liệu nào được tìm thấy
              </Text>
            </View>
          )}
          {selectedItem && (
            <BottomSheetModal
              backgroundStyle={{
                backgroundColor: selectedItem.bgColorStatus || '#f7d6b2',
              }}
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
                {checkRoleUser() && (
                  <View style={styles.bottomSheetContainer}>
                    <Text style={styles.titleBottomSheet}>Đăng kí</Text>

                    <View style={styles.containerEachLine}>
                      <Image
                        src={mainURL + selectedItem?.path}
                        style={[styles.Iconic, {borderRadius: 50}]}
                      />
                      <View style={styles.containerLine}>
                        <Text style={styles.title}>Họ tên:{'  '}</Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.content}>
                          {selectedItem.nguoidangky}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                <View style={styles.bottomSheetContainer}>
                  <Text style={styles.titleBottomSheet}>Thiết bị</Text>
                  {(indexPicker == 0
                    ? selectedItem?.thietbi
                    : selectedItem?.daduyet
                  )?.map((item, index) => {
                    return (
                      <View
                        style={{marginLeft: Dimension.setWidth(2)}}
                        key={index}>
                        <Text
                          style={{
                            fontSize: Dimension.fontSize(17),
                            fontFamily: Fonts.SF_BOLD,
                          }}>{`${index + 1}.`}</Text>

                        <View style={styles.containerEachLine}>
                          <Image
                            source={Images.item}
                            style={[styles.Iconic, {borderRadius: 50}]}
                          />
                          <View style={styles.containerLine}>
                            <Text style={styles.title}>
                              Thiết bị:{'  '}
                              <Text numberOfLines={2} style={styles.content}>
                                {item?.thietbi}
                              </Text>
                            </Text>
                          </View>
                        </View>

                        <View style={styles.containerEachLine}>
                          <Image
                            source={Images.quantity}
                            style={styles.Iconic}
                          />
                          <View style={styles.containerLine}>
                            <Text style={styles.title}>
                              Dạng đăng kí:{'  '}
                            </Text>
                            <Text
                              numberOfLines={2}
                              ellipsizeMode="tail"
                              style={styles.content}>
                              {item.active == 1 ? 'Không trả' : 'Có trả'}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.containerEachLine}>
                          <Image
                            source={Images.datetime}
                            style={styles.Iconic}
                          />
                          <Text style={styles.title}>Ngày trả:{'  '}</Text>
                          <Text style={styles.content}>
                            {item.ngaytra
                              ? changeFormatDate(item.ngaytra)
                              : 'Không xác định'}
                          </Text>
                        </View>

                        <View style={styles.containerEachLine}>
                          <Image source={Images.return} style={styles.Iconic} />
                          <View style={styles.containerLine}>
                            <Text style={styles.title}>
                              Tình trạng trả:{'  '}
                              <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={[
                                  styles.content,
                                  {
                                    color: item.noidung ? '#747476' : '#eb5a6e',
                                  },
                                ]}>
                                {item.tinhtrang_trathietbi == '0'
                                  ? 'Chưa trả'
                                  : 'Đã trả'}
                              </Text>
                            </Text>
                          </View>
                        </View>

                        <View style={styles.containerEachLine}>
                          <Image source={Images.note} style={styles.Iconic} />
                          <View style={styles.containerLine}>
                            <Text style={styles.title}>
                              Nội dung:{'  '}
                              <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={[
                                  styles.content,
                                  {
                                    color: item.noidung ? '#747476' : '#eb5a6e',
                                  },
                                ]}>
                                {item.noidung ? item.noidung : 'Không có'}
                              </Text>
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </BottomSheetScrollView>
            </BottomSheetModal>
          )}
        </BottomSheetModalProvider>
        <ConfirmModal
          screenName={'HistoryRegisterDevice'}
          toggleModal={toggleModal}
          setToggleModal={setToggleModal}
          item={selectedItem}
          status={checkInput}
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
                Trả thiết bị
              </Text>
            </View>

            <View style={styles.lineContainerModal}>
              <View style={[styles.itemContainerModal, {width: '100%'}]}>
                <View style={rowAlignCenter}>
                  <Text style={styles.titleModal}>Thiết bị</Text>
                  <RedPoint />
                </View>
                <View style={styles.containerEachLine1}>
                  <MultiSelect
                    style={styles.dropdown}
                    autoScroll={false}
                    showsVerticalScrollIndicator={false}
                    placeholderStyle={styles.placeholderStyle}
                    selectedStyle={styles.selectedStyle}
                    selectedTextStyle={[
                      styles.selectedTextStyle,
                      {fontSize: Dimension.fontSize(13)},
                    ]}
                    containerStyle={styles.containerOptionStyle}
                    iconStyle={styles.iconStyle}
                    itemContainerStyle={styles.itemContainer}
                    itemTextStyle={styles.itemText}
                    fontFamily={Fonts.SF_MEDIUM}
                    activeColor="#eef2feff"
                    data={notReturnData}
                    maxHeight={Dimension.setHeight(30)}
                    labelField="name"
                    valueField="id"
                    placeholder="Chọn thiết bị"
                    value={notReturnDataValue}
                    renderLeftIcon={() => {
                      return (
                        <Image
                          source={Images.device}
                          style={styles.leftIconDropdown}
                        />
                      );
                    }}
                    onChange={item => {
                      console.log(item);
                      setNotReturnDataValue(item);
                    }}
                  />
                </View>
              </View>
            </View>

            <View style={styles.lineContainerModal}>
              <View style={[styles.itemContainerModal, {width: '50%'}]}>
                <View style={rowAlignCenter}>
                  <Text style={styles.titleModal}>Ngày trả</Text>
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
                  <Text style={styles.contentModal}>{returnDate}</Text>
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

              <View style={[styles.itemContainerModal, {width: '52%'}]}>
                <View style={rowAlignCenter}>
                  <Text style={styles.titleModal}>Tình trạng</Text>
                  <RedPoint />
                </View>
                <View style={styles.containerEachLine1}>
                  <Dropdown
                    style={styles.dropdown}
                    autoScroll={false}
                    showsVerticalScrollIndicator={false}
                    placeholderStyle={styles.placeholderStyle}
                    selectedStyle={styles.selectedStyle}
                    selectedTextStyle={[
                      styles.selectedTextStyle,
                      {fontSize: Dimension.fontSize(13)},
                    ]}
                    containerStyle={styles.containerOptionStyle}
                    iconStyle={styles.iconStyle}
                    itemContainerStyle={styles.itemContainer}
                    itemTextStyle={styles.itemText}
                    fontFamily={Fonts.SF_MEDIUM}
                    activeColor="#eef2feff"
                    data={deviceState}
                    maxHeight={Dimension.setHeight(30)}
                    labelField="state"
                    valueField="state"
                    value={deviceStateValue}
                    renderLeftIcon={() => {
                      return (
                        <Image
                          source={Images.return}
                          style={styles.leftIconDropdown}
                        />
                      );
                    }}
                    onChange={item => {
                      setDeviceStateValue(item.state);
                    }}
                  />
                </View>
              </View>
            </View>

            <View style={styles.lineContainerModal}>
              <View style={[styles.itemContainerModal, {width: '100%'}]}>
                <Text
                  style={[
                    styles.titleModal,
                    {
                      color:
                        deviceStateValue != 'Bình thường'
                          ? Colors.DEFAULT_BLACK
                          : Colors.INACTIVE_GREY,
                    },
                  ]}>
                  Nguyên nhân
                </Text>
                <View style={[styles.dateModalContainer, {width: '100%'}]}>
                  <TextInput
                    editable={deviceStateValue != 'Bình thường' ? true : false}
                    placeholder={
                      deviceStateValue != 'Bình thường'
                        ? 'Nhập nguyên nhân'
                        : ''
                    }
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.INACTIVE_GREY,
                      marginHorizontal: Dimension.setWidth(1.6),
                      fontFamily: Fonts.SF_MEDIUM,
                      fontSize: Dimension.fontSize(12),
                      height: Dimension.setHeight(5),
                      width: '86%',
                    }}
                    value={reason}
                    onChangeText={e => {
                      setReason(e);
                    }}
                  />
                  <View
                    style={[
                      styles.imgModalContainer,
                      {
                        backgroundColor:
                          deviceStateValue != 'Bình thường'
                            ? '#d95656'
                            : Colors.INACTIVE_GREY,
                        padding: Dimension.setWidth(1.3),
                      },
                    ]}>
                    <Image source={Images.errorDevice} style={styles.imgDate} />
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                setToggleReturnModal(false);
              }}
              style={{position: 'absolute', left: 12, top: 12}}>
              <Image source={Images.minusclose} style={styles.btnModal} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleReturnDevice}
              style={{position: 'absolute', right: 12, top: 12}}>
              <Image source={Images.confirm} style={styles.btnModal} />
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={toggleDatePicker}
            mode="date"
            onConfirm={handlePickDate}
            onCancel={() => {
              setToggleDatePicker(false);
            }}
          />
        </Modal>

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

  approvedIcon: {
    width: 30,
    height: 30,
  },

  containerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '88%',
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

  leftIconDropdown: {
    width: 20,
    height: 20,
    marginRight: Dimension.setWidth(1.3),
  },

  dropdown: {
    height: Dimension.setHeight(3.6),
    marginHorizontal: Dimension.setWidth(1),
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

  containerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '88%',
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
});

export default HistoryRegisterDevice;
