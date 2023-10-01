import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  memo,
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
import Colors from '../../contants/Colors';
import {
  approvePlaneTicket,
  approveRegisterDevice,
  approveRegisterOfficeItem,
  cancelPlaneTicket,
  cancelRegisterDevice,
  cancelRegisterOfficeItem,
  getAllDevices,
  getAllListDevice,
  getAllListOfficeItem,
  getAllPlaneData,
  getMyListDevice,
} from '../../redux/apiRequest';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import StatusUI from '../../components/StatusUI';
import {ApproveCancelModal, ConfirmModal} from '../../components/Modal';
import {ToastWarning} from '../../components/Toast';
import {shadowIOS} from '../../contants/propsIOS';
import FilterStatusUI from '../../components/FilterStatusUI';
import LinearGradientUI from '../../components/LinearGradientUI';
import {changeFormatDate} from '../../utils/serviceFunction';
import {fontDefault, mainURL} from '../../contants/Variable';
import Loading from '../../components/LoadingUI';

const HistoryRegisterDevice = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const deviceData = useSelector(state => state.device.deviceSlice?.data);
  const myDeviceData = useSelector(state => state.myDevice.myDeviceSlice?.data);
  const IFEEstaffs = useSelector(state => state.staffs?.staffs?.IFEEStaff);
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const [toggleModal, setToggleModal] = useState(false);
  const [checkInput, setCheckInput] = useState(null);
  const [indexPicker, setIndexPicker] = useState(0);
  const [loading, setLoading] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['45%', '80%'], []);

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

  const getNameApprover = () => {
    let approver = IFEEstaffs.filter(
      item => item.id == selectedItem?.id_nguoiduyet,
    )[0];
    return approver?.hoten;
  };

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
          return checkRoleUser() ? deviceData?.data : myDeviceData?.choduyet;
        case 1:
          return checkRoleUser()
            ? deviceData?.data_dapheduyet
            : myDeviceData.lichsu;
        case 2:
          return [];
      }
    },
    [deviceData],
  );

  const checkRoleUser = () => {
    return user?.quyentruycap == 1 || user?.id_ht == 6;
  };

  const fetchAllListDevice = async () => {
    const data = {
      id_user: user?.id,
    };

    setLoading(true);
    try {
      await getAllListDevice(dispatch);
      await getMyListDevice(dispatch, data);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    fetchAllListDevice();
  }, []);

  const RenderTicketData = memo(({item, index}) => {
    const colorStatus =
      indexPicker === 0 ? '#f9a86a' : indexPicker === 1 ? '#57b85d' : '#f25157';
    const bgColorStatus =
      indexPicker === 0 ? '#fef4eb' : indexPicker === 1 ? '#def8ed' : '#f9dfe0';
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

    return (
      <TouchableOpacity
        onPress={() => {
          handleBottomSheet(item, filterUser?.path, bgColorStatus);
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
                  item.thietbi?.length
                } văn phòng phẩm ${status.toLocaleLowerCase()}`
              : `Thiết bị ${item?.tentb}`}
          </Text>
        </View>
        <View
          style={{position: 'absolute', right: '5%', top: '7%', zIndex: 9999}}>
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

        {indexPicker == 0 ? (
          <View style={styles.containerEachLine}>
            <Image source={Images.datetime} style={styles.Iconic} />
            <Text style={styles.title}>Ngày đăng kí:{'  '}</Text>
            <Text style={styles.content}>
              {changeFormatDate(item.ngaymuon)}
            </Text>
          </View>
        ) : (
          <View style={styles.containerEachLine}>
            <Image source={Images.datetime} style={styles.Iconic} />
            <Text style={styles.title}>Ngày duyệt:{'  '}</Text>
            <Text style={styles.content}>
              {changeFormatDate(item.ngayduyet)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  });

  return (
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header
          title={`Lịch sử đăng kí thiết bị ${checkRoleUser() ? '' : 'của tôi'}`}
          navigation={navigation}
        />
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
                refreshing={true}
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
                <View style={styles.bottomSheetContainer}>
                  <Text style={styles.titleBottomSheet}>Đăng kí</Text>

                  {checkRoleUser() && (
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
                  )}
                  <View style={styles.containerEachLine}>
                    <Image source={Images.admin} style={styles.Iconic} />
                    <View style={styles.containerLine}>
                      <Text style={styles.title}>Người duyệt:{'  '}</Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.content}>
                        {selectedItem?.nguoiduyet
                          ? selectedItem?.nguoiduyet
                          : getNameApprover()}
                      </Text>
                    </View>
                  </View>

                  {indexPicker == 0 ? (
                    <View style={styles.containerEachLine}>
                      <Image source={Images.datetime} style={styles.Iconic} />
                      <Text style={styles.title}>Ngày đăng kí:{'  '}</Text>
                      <Text style={styles.content}>
                        {changeFormatDate(selectedItem.ngaymuon)}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.containerEachLine}>
                      <Image source={Images.datetime} style={styles.Iconic} />
                      <Text style={styles.title}>Ngày duyệt:{'  '}</Text>
                      <Text style={styles.content}>
                        {changeFormatDate(selectedItem.ngayduyet)}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.bottomSheetContainer}>
                  <Text style={styles.titleBottomSheet}>Thiết bị</Text>
                  {checkRoleUser() ? (
                    selectedItem?.thietbi?.map((item, index) => {
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

                          {indexPicker == 0 ? (
                            <View style={styles.containerEachLine}>
                              <Image
                                source={Images.datetime}
                                style={styles.Iconic}
                              />
                              <Text style={styles.title}>
                                Ngày đăng kí:{'  '}
                              </Text>
                              <Text style={styles.content}>
                                {changeFormatDate(item.ngaymuon)}
                              </Text>
                            </View>
                          ) : (
                            <View style={styles.containerEachLine}>
                              <Image
                                source={Images.datetime}
                                style={styles.Iconic}
                              />
                              <Text style={styles.title}>
                                Ngày duyệt:{'  '}
                              </Text>
                              <Text style={styles.content}>
                                {changeFormatDate(item.ngayduyet)}
                              </Text>
                            </View>
                          )}

                          <View style={styles.containerEachLine}>
                            <Image source={Images.note} style={styles.Iconic} />
                            <View style={styles.containerLine}>
                              <Text style={styles.title}>
                                Nội dung mượn:{'  '}
                                <Text
                                  numberOfLines={2}
                                  ellipsizeMode="tail"
                                  style={[
                                    styles.content,
                                    {
                                      color: item.noidung
                                        ? '#747476'
                                        : '#eb5a6e',
                                    },
                                  ]}>
                                  {item.noidung ? item.noidung : 'Không có'}
                                </Text>
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <>
                      <View style={styles.containerEachLine}>
                        <Image source={Images.datetime} style={styles.Iconic} />
                        <Text style={styles.title}>Tên thiết bị:{'  '}</Text>
                        <Text style={styles.content}>
                          {selectedItem?.tentb}
                        </Text>
                      </View>
                      <View style={styles.containerEachLine}>
                        <Image
                          source={Images.returnDate}
                          style={styles.Iconic}
                        />
                        <Text style={[styles.title, {width: '90%'}]}>
                          Ngày trả:{' '}
                          <Text style={styles.content}>
                            {selectedItem?.ngaytra
                              ? changeFormatDate(selectedItem?.ngaytra)
                              : 'Không xác định'}
                          </Text>
                        </Text>
                      </View>
                    </>
                  )}
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
        {loading && <Loading />}
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
});

export default HistoryRegisterDevice;
