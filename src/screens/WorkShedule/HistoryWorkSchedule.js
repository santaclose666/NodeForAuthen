import React, {
  useRef,
  useState,
  useCallback,
  memo,
  useLayoutEffect,
  useMemo,
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
import Separation from '../../components/Separation';
import Colors from '../../contants/Colors';
import {shadowIOS} from '../../contants/propsIOS';
import {
  approveFinishRequest,
  approveWorkSchedule,
  cancelFinishRequest,
  cancelWorkSchedule,
  getAllWorkSchedule,
  requestFinishWorkSchedule,
} from '../../redux/apiRequest';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {
  changeFormatDate,
  formatDate,
  formatTime,
  formatDateToPost,
  formatTimeToPost,
  compareDate,
} from '../../utils/serviceFunction';
import StatusUI from '../../components/StatusUI';
import {defaultIFEE, defaultXMG, mainURL} from '../../contants/Variable';
import {ApproveCancelModal} from '../../components/Modal';
import {ToastWarning} from '../../components/Toast';
import StaggerUI from '../../components/StaggerUI';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {ToastAlert} from '../../components/Toast';
import LinearGradientUI from '../../components/LinearGradientUI';
import {screen} from '../AllScreen/allScreen';
import {EmptyList} from '../../components/FlatlistComponent';
import {InternalSkeleton} from '../../components/Skeleton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const approveArr = [
  {
    title: 'Tất cả',
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
    title: 'Đã duyệt',
    color: '#57b85d',
    bgColor: 'rgba(222, 248, 237, 0.3)',
    icon: Images.approved1,
  },
  {
    title: 'Hủy bỏ',
    inActiveColor: '',
    color: '#f25157',
    bgColor: 'rgba(249, 223, 224, 0.3)',
    icon: Images.cancelled,
  },
];

const HistoryWorkShedule = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const unit = useSelector(state => state.unit.unitOption?.data);
  const idByUnit = unit === 'IFEE' ? user?.id_ifee : user?.id_xmg;
  const dispatch = useDispatch();
  const staffs =
    unit === 'IFEE'
      ? useSelector(state => state.staffs?.staffs?.IFEEStaff)
      : useSelector(state => state.staffs?.staffs?.XMGStaff);
  const workSheduleData = useSelector(
    state => state.workSchedule?.worksSchedule?.data,
  );
  const [indexPicker, setIndexPicker] = useState(0);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(formatTime(new Date()));
  const [dateTime, setDateTime] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toggleConfirmModal, setToggleConfirmModal] = useState(false);
  const [toggleHandleFinishModal, setToggleHandleFinishModal] = useState(false);
  const [checkInput, setCheckInput] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [reasonCancel, setReasonCancel] = useState('');
  const [toggleFinishModal, setToggleFinishModal] = useState(false);
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['45%', '80%'], []);
  const [refresh, setRefresh] = useState(false);

  const handleBottomSheet = useCallback(
    (item, subject, avatar, bgColorStatus, colorStatus) => {
      setSelectedItem({
        ...item,
        subject,
        avatar,
        bgColorStatus,
        colorStatus,
      });
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

  const handlePickDate = date => {
    if (dateTime == 'time') {
      setTime(formatTime(date));
    } else {
      const message = 'Ngày về không hợp lệ';
      console.log(selectedItem.denngay);
      compareDate(date, changeFormatDate(selectedItem.denngay))
        ? setDate(date)
        : ToastAlert(message);
    }
    setToggleDatePicker(false);
  };

  const handleRequestFinish = () => {
    bottomSheetModalRef.current?.dismiss();
    const data = {
      id_lichcongtac: selectedItem.id,
      ngayve: formatDateToPost(date),
      giove: formatTimeToPost(time),
      tendonvi: unit,
    };

    requestFinishWorkSchedule(data);
    setToggleFinishModal(false);
    setTimeout(() => {
      fetchWorkSchedule();
    });
  };

  const handleApprove = useCallback(
    item => {
      bottomSheetModalRef.current?.dismiss();
      setSelectedItem(item);
      setCheckInput(true);
      item.kt_congtac == 1
        ? setToggleHandleFinishModal(true)
        : setToggleConfirmModal(true);
    },
    [selectedItem],
  );

  const handleCancel = useCallback(
    item => {
      bottomSheetModalRef.current?.dismiss();
      setSelectedItem(item);
      setCheckInput(false);
      item.kt_congtac == 1
        ? setToggleHandleFinishModal(true)
        : setToggleConfirmModal(true);
    },
    [selectedItem],
  );

  const handleApproveCancelFinish = () => {
    if (checkInput && commentInput !== '' && selectedItem !== null) {
      const data = {
        id_lichcongtac: selectedItem.id,
        nhanxet: commentInput,
        tendonvi: unit,
      };

      approveFinishRequest(data);
      setCommentInput('');
      setToggleHandleFinishModal(false);
      setTimeout(() => {
        fetchWorkSchedule();
      });
    } else if (!checkInput && reasonCancel !== '' && selectedItem !== null) {
      const data = {
        id_lichcongtac: selectedItem.id,
        lydo: reasonCancel,
        tendonvi: unit,
      };

      cancelFinishRequest(data);
      setReasonCancel('');
      setToggleHandleFinishModal(false);
      setTimeout(() => {
        fetchWorkSchedule();
      });
    } else {
      ToastWarning('Nhập đầy đủ thông tin!');
    }
  };

  const handleSendNonAdjust = () => {
    if (checkInput && commentInput !== '' && selectedItem !== null) {
      const data = {
        id_lichcongtac: selectedItem.id,
        nhanxet: commentInput,
        tendonvi: unit,
      };

      approveWorkSchedule(data);
      setCommentInput(null);
      setToggleConfirmModal(false);
      setTimeout(() => {
        fetchWorkSchedule();
      });
    } else if (!checkInput && reasonCancel !== '' && selectedItem !== null) {
      const data = {
        id_lichcongtac: selectedItem.id,
        lydo: reasonCancel,
        tendonvi: unit,
      };

      cancelWorkSchedule(data);
      setReasonCancel(null);
      setToggleConfirmModal(false);
      setTimeout(() => {
        fetchWorkSchedule();
      });
    } else {
      ToastWarning('Nhập đầy đủ thông tin!');
    }
  };

  const handleToggleFinish = item => {
    bottomSheetModalRef.current?.dismiss();
    setSelectedItem(item);
    setToggleFinishModal(true);
  };

  const handlePickOption = useCallback(
    index => {
      setIndexPicker(index);
      bottomSheetModalRef.current?.dismiss();
    },
    [indexPicker],
  );

  const handleFilter = useCallback(
    index => {
      switch (index) {
        case 0:
          return workSheduleData;
        case 1:
          return workSheduleData?.filter(
            item =>
              item.status === 0 ||
              (item.trangthai === 0 && item.kt_congtac === 1),
          );
        case 2:
          return workSheduleData?.filter(
            item => item.status === 1 && item.kt_congtac !== 1,
          );
        case 3:
          return workSheduleData?.filter(item => item.status === 2);
      }
    },
    [workSheduleData],
  );

  const handleRedirectMyWorkSchedule = useCallback(() => {
    navigation.navigate(screen.allWorkSchedule, {unit: unit});
  }, []);

  const handlePullToRefresh = async () => {
    setRefresh(true);
    try {
      await fetchWorkSchedule();

      setRefresh(false);
    } catch (error) {
      setRefresh(false);
    }
  };

  const fetchWorkSchedule = useCallback(async () => {
    try {
      const data = {
        tendonvi: unit,
        id: idByUnit,
      };
      await getAllWorkSchedule(dispatch, data);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useLayoutEffect(() => {
    fetchWorkSchedule();
  }, []);

  const unitRole = item => {
    if (unit === 'IFEE') {
      return (
        idByUnit != item.id_nhansu &&
        user?.vitri_ifee == 3 &&
        item.vitri_ifee > 3
      );
    } else {
      return idByUnit != item.id_nhansu && user?.vitri == 3 && item.vitri > 3;
    }
  };

  const RenderWorkScheduleData = memo(({item, index}) => {
    const colorStatus =
      item.status === 0 ? '#f9a86a' : item.status === 1 ? '#57b85d' : '#f25157';
    const bgColorStatus =
      item.status === 0 ? '#fef4eb' : item.status === 1 ? '#def8ed' : '#f9dfe0';
    const status =
      item.status == 0
        ? 'Chờ phê duyệt'
        : item.status == 1
        ? 'Đã phê duyệt'
        : 'Đã hủy';
    const icon =
      item.status === 0
        ? Images.pending
        : item.status === 1
        ? Images.approve
        : Images.cancel;

    const finishStatus =
      item.kt_congtac == 1
        ? 'Chờ duyệt k/t'
        : item.kt_congtac == 2 && item.nhanxet_duyetve !== null
        ? 'Đã duyệt k/t'
        : item.kt_congtac == 0 && item.nhanxet_duyetve !== null
        ? 'Từ chối k/t'
        : status;
    const finishIcon =
      item.trangthai == 0 && item.kt_congtac == 1
        ? Images.pending
        : item.trangthai == 1 && item.kt_congtac == 2
        ? Images.approve
        : item.kt_congtac == 0 && item.nhanxet_duyetve !== null
        ? Images.cancel
        : icon;
    const finishColorStatus =
      item.trangthai == 0 && item.kt_congtac == 1
        ? '#f9a86a'
        : item.trangthai == 1 && item.kt_congtac == 2
        ? '#57b85d'
        : item.kt_congtac == 0 && item.nhanxet_duyetve !== null
        ? '#f25157'
        : colorStatus;
    const finishBgColorStatus =
      item.trangthai == 0 && item.kt_congtac == 1
        ? '#fef4eb'
        : item.trangthai == 1 && item.kt_congtac == 2
        ? '#def8ed'
        : item.kt_congtac == 0 && item.nhanxet_duyetve !== null
        ? '#f9dfe0'
        : bgColorStatus;

    const filterUser =
      unit === 'IFEE'
        ? staffs.filter(staff => staff.id_ifee === item.id_user)[0]
        : staffs.filter(staff => staff.id_xmg === item.id_user)[0];
    const subject =
      filterUser?.tenphong === undefined
        ? 'Không xác định'
        : filterUser?.tenphong;
    const avatar =
      filterUser?.path === undefined
        ? unit === 'IFEE'
          ? defaultIFEE
          : defaultXMG
        : filterUser?.path;

    const checkRole = () => {
      return (
        (item?.status == 0 || item?.kt_congtac == 1) &&
        (user?.quyentruycap <= 2 || user?.truongbophan === 1 || unitRole(item))
      );
    };

    // const checkStatus = () => {
    //   return (
    //     (item.status != 0 && item.kt_congtac != 1) ||
    //     user?.vitri_ifee > 3 ||
    //     item.id_user == idByUnit ||
    //     (user?.vitri_ifee == 1 && item.status != 0)
    //   );
    // };

    const checkFinished = () => {
      return (
        item.status == 1 && item.id_user == idByUnit && item.kt_congtac !== 1
      );
    };

    return (
      <TouchableOpacity
        onPress={() => {
          handleBottomSheet(item, subject, avatar, bgColorStatus, colorStatus);
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
            width: '66%',
          }}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontFamily: Fonts.SF_SEMIBOLD,
              fontSize: Dimension.fontSize(19),
            }}>
            {item?.thuocchuongtrinh}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: '5%',
            top: '7%',
            zIndex: 9999,
          }}>
          {checkRole() ? (
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
          ) : (
            <StatusUI
              status={finishStatus}
              colorStatus={finishColorStatus}
              bgColorStatus={finishBgColorStatus}
              icon={finishIcon}
            />
          )}
          {checkFinished() && (
            <>
              {item.trangthai == 1 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    marginTop: Dimension.setHeight(0.6),
                  }}>
                  <Image
                    source={Images.flagcolor}
                    style={styles.approvedIcon}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    handleToggleFinish(item);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    marginTop: Dimension.setHeight(0.6),
                  }}>
                  <Image
                    source={Images.flagnocolor}
                    style={styles.approvedIcon}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        <Text
          style={{
            fontSize: Dimension.fontSize(16),
            fontFamily: Fonts.SF_MEDIUM,
            color: '#747476',
            marginVertical: Dimension.setHeight(0.6),
          }}>
          {item?.diadiem}
        </Text>

        <View style={styles.containerEachLine}>
          <Image
            src={mainURL + avatar}
            style={[styles.Iconic, {borderRadius: 50}]}
          />
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[styles.title, {width: '90%'}]}>
            Họ tên: <Text style={styles.content}>{item?.name_user}</Text>
          </Text>
        </View>

        <View style={styles.containerEachLine}>
          <Image source={Images.datetime} style={styles.Iconic} />
          <Text style={styles.title}>Thời gian:</Text>
          <Text style={styles.content}>{changeFormatDate(item?.tungay)}</Text>
          <Separation />
          <Text style={styles.content}>{changeFormatDate(item?.denngay)}</Text>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header
          title="Lịch sử công tác"
          navigation={navigation}
          refreshData={fetchWorkSchedule}
          unit={unit}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            height: Dimension.setHeight(10),
            flexDirection: 'row',
          }}>
          {approveArr.map((item, index) => {
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
                  borderBottomWidth: indexPicker === index ? 2 : 0,
                  borderBottomColor:
                    indexPicker === index ? Colors.DEFAULT_GREEN : '#fff',
                }}>
                <Image
                  source={item.icon}
                  style={{
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
                    color: indexPicker === index ? item.color : '#041d3b',
                  }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <BottomSheetModalProvider>
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
                <RenderWorkScheduleData item={item} index={index} />
              )}
              initialNumToRender={6}
              windowSize={6}
              removeClippedSubviews={true}
              refreshing={refresh}
              extraData={workSheduleData}
              ListEmptyComponent={() => {
                return <EmptyList />;
              }}
              onRefresh={handlePullToRefresh}
            />
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
                  <Text style={styles.titleBottomSheet}>Chương trình</Text>
                  <View style={styles.containerEachLine}>
                    <Image source={Images.work} style={styles.Iconic} />
                    <View style={styles.containerLine}>
                      <Text ellipsizeMode="tail" style={styles.title}>
                        Tên chương trình:{' '}
                        <Text style={styles.content}>
                          {selectedItem.thuocchuongtrinh}
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <View style={styles.containerEachLine}>
                    <Image source={Images.worklocation} style={styles.Iconic} />
                    <View style={styles.containerLine}>
                      <Text ellipsizeMode="tail" style={styles.title}>
                        Địa điểm:{' '}
                        <Text style={styles.content}>
                          {selectedItem.diadiem}
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <View style={styles.containerEachLine}>
                    <Image source={Images.content} style={styles.Iconic} />
                    <View style={styles.containerLine}>
                      <Text ellipsizeMode="tail" style={styles.title}>
                        Nội dung:{' '}
                        <Text style={styles.content}>
                          {selectedItem.noidung}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.bottomSheetContainer}>
                  <Text style={styles.titleBottomSheet}>
                    Thông tin công tác
                  </Text>
                  <View style={styles.containerEachLine}>
                    <Image
                      src={mainURL + selectedItem.avatar}
                      style={[styles.Iconic, {borderRadius: 50}]}
                    />
                    <View style={styles.containerLine}>
                      <Text style={styles.title}>Người công tác:{''}</Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.content}>
                        {selectedItem.name_user}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.containerEachLine}>
                    <Image source={Images.note} style={styles.Iconic} />
                    <View style={styles.containerLine}>
                      <Text style={styles.title}>Bộ môn:{''}</Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.content}>
                        {selectedItem.subject}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.containerEachLine}>
                    <Image source={Images.datetime} style={styles.Iconic} />
                    <View style={styles.containerLine}>
                      <Text style={styles.title}>Thời gian:{''}</Text>
                      <Text style={styles.content}>
                        {changeFormatDate(selectedItem.tungay)}
                      </Text>
                      <Separation />
                      <Text style={styles.content}>
                        {changeFormatDate(selectedItem.denngay)}
                      </Text>
                    </View>
                  </View>
                </View>
              </BottomSheetScrollView>
            </BottomSheetModal>
          )}
          <ApproveCancelModal
            screenName={'registerWorkSchedule'}
            toggleApproveModal={toggleConfirmModal}
            setToggleApproveModal={setToggleConfirmModal}
            checkInput={checkInput}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            commnetInput={commentInput}
            setCommentInput={setCommentInput}
            reasonCancel={reasonCancel}
            setReasonCancel={setReasonCancel}
            eventFunc={handleSendNonAdjust}
            staffs={staffs}
          />

          <ApproveCancelModal
            screenName={'finishRequestWork'}
            toggleApproveModal={toggleHandleFinishModal}
            setToggleApproveModal={setToggleHandleFinishModal}
            checkInput={checkInput}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            commnetInput={commentInput}
            setCommentInput={setCommentInput}
            reasonCancel={reasonCancel}
            setReasonCancel={setReasonCancel}
            eventFunc={handleApproveCancelFinish}
          />

          <Modal
            isVisible={toggleFinishModal}
            animationIn="fadeInUp"
            animationInTiming={1}
            animationOut="fadeOutDown"
            animationOutTiming={1}
            avoidKeyboard={true}>
            <View
              style={{
                flex: 1,
                position: 'absolute',
                alignSelf: 'center',
                backgroundColor: '#fef4eb',
                width: Dimension.setWidth(85),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 14,
                paddingHorizontal: Dimension.setWidth(3),
                paddingBottom: Dimension.setHeight(1),
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
                    color: '#f9a86a',
                  }}>
                  Yêu cầu kết thúc
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
                  source={Images.workSchedule}
                  style={{height: 55, width: 55}}
                />
                <Text
                  style={{
                    marginLeft: Dimension.setWidth(3),
                    fontSize: Dimension.fontSize(18),
                    fontFamily: Fonts.SF_SEMIBOLD,
                  }}>
                  {selectedItem?.thuocchuongtrinh}
                </Text>
              </View>
              <View style={styles.lineContainerModal}>
                <View style={styles.itemContainerModal}>
                  <Text style={styles.titleModal}>Ngày về</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setDateTime('date');
                      setToggleDatePicker(true);
                    }}
                    style={styles.dateModalContainer}>
                    <Text style={styles.contentModal}>{formatDate(date)}</Text>
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
                  <Text style={styles.titleModal}>Giờ về</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setDateTime('time');
                      setToggleDatePicker(true);
                    }}
                    style={styles.dateModalContainer}>
                    <Text style={styles.contentModal}>{time}</Text>
                    <View
                      style={[
                        styles.imgModalContainer,
                        {backgroundColor: '#e3c242'},
                      ]}>
                      <Image source={Images.time} style={styles.imgDate} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  left: '5%',
                  top: '5%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => setToggleFinishModal(false)}>
                <Image source={Images.minusclose} style={styles.btnModal} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRequestFinish}
                style={{
                  position: 'absolute',
                  right: '5%',
                  top: '5%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image source={Images.confirm} style={styles.btnModal} />
              </TouchableOpacity>
            </View>
            <DateTimePickerModal
              isVisible={toggleDatePicker}
              mode={dateTime}
              onConfirm={handlePickDate}
              onCancel={() => {
                setToggleDatePicker(false);
              }}
            />
          </Modal>

          <View
            style={{
              flex: 1,
              position: 'absolute',
              bottom: hp('11%'),
              right: Dimension.setWidth(6),
            }}>
            <StaggerUI eventFunc1={handleRedirectMyWorkSchedule} />
          </View>
        </BottomSheetModalProvider>
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

  containerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '88%',
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
    marginLeft: Dimension.setWidth(1),
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
    fontSize: Dimension.fontSize(13),
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
});

export default HistoryWorkShedule;
