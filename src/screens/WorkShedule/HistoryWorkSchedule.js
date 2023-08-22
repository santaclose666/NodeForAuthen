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
  approveWorkSchedule,
  cancelWorkSchedule,
  getAllWorkSchedule,
} from '../../redux/apiRequest';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import FilterStatusUI from '../../components/FilterStatusUI';
import {changeFormatDate} from '../../utils/serviceFunction';
import StatusUI from '../../components/StatusUI';
import {mainURL} from '../../contants/Variable';
import {ApproveCancelModal} from '../../components/Modal';
import {ToastWarning} from '../../components/Toast';

const HistoryWorkShedule = ({navigation, route}) => {
  const refresh = route.params?.refresh;
  const user = useSelector(state => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const staffs = useSelector(state => state.staffs?.staffs?.allStaff);
  const workSheduleData = useSelector(
    state => state.workSchedule?.worksSchedule?.data,
  );
  const [refreshComponent, setRefreshComponent] = useState(false);
  const [indexPicker, setIndexPicker] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toggleModal, setToggleModal] = useState(false);
  const [checkInput, setCheckInput] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [reasonCancel, setReasonCancel] = useState('');
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['45%', '80%'], []);

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

  const handleApprove = useCallback(
    item => {
      setSelectedItem(item);
      setCheckInput(true);
      setToggleModal(true);
    },
    [selectedItem],
  );

  const handleCancel = useCallback(
    item => {
      setSelectedItem(item);
      setCheckInput(false);
      setToggleModal(true);
    },
    [selectedItem],
  );

  const handleSendNonAdjust = () => {
    if (checkInput && commentInput !== '' && selectedItem !== null) {
      const data = {
        id_lichcongtac: selectedItem.id,
        nhanxet: commentInput,
      };

      approveWorkSchedule(data);
      setCommentInput(null);
      setRefreshComponent(!refreshComponent);
      setToggleModal(false);
    } else if (!checkInput && reasonCancel !== '' && selectedItem !== null) {
      const data = {
        id_lichcongtac: selectedItem.id,
        lydo: reasonCancel,
      };

      cancelWorkSchedule(data);
      setReasonCancel(null);
      setRefreshComponent(!refreshComponent);
      setToggleModal(false);
    } else {
      ToastWarning('Nhập đầy đủ thông tin!');
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
          return workSheduleData;
        case 1:
          return workSheduleData?.filter(item => item.status === 0);
        case 2:
          return workSheduleData?.filter(item => item.status === 1);
        case 3:
          return workSheduleData?.filter(item => item.status === 2);
      }
    },
    [workSheduleData],
  );

  const fetchWorkSchedule = () => {
    getAllWorkSchedule(dispatch, user?.id);
  };

  useLayoutEffect(() => {
    fetchWorkSchedule();

    if (refresh) {
      setIndexPicker(0);
    }
  }, [refresh, refreshComponent]);

  const RenderWorkScheduleData = memo(({item, index}) => {
    const colorStatus =
      item.status === 0 ? '#f9a86a' : item.status === 1 ? '#57b85d' : '#f25157';
    const bgColorStatus =
      item.status === 0 ? '#fef4eb' : item.status === 1 ? '#def8ed' : '#f9dfe0';
    const status =
      item.status === 0
        ? 'Chờ phê duyệt'
        : item.status === 1
        ? 'Đã phê duyệt'
        : 'Đã hủy';
    const icon =
      item.status === 0
        ? Images.pending
        : item.status === 1
        ? Images.approve
        : Images.cancel;

    const filterUser = staffs.filter(
      staff => staff.id === item.id_user && staff.tendonvi === 'IFEE',
    )[0];
    const subject = filterUser.tenphong;
    const avatar = filterUser.path;

    const checkRole = () => {
      return (
        (item.status === 0 &&
          item.id_user !== user?.id &&
          user?.vitri_ifee === 3 &&
          filterUser.vitri_ifee > 3) ||
        (user?.vitri_ifee === 1 && item.status === 0)
      );
    };

    const checkStatus = () => {
      return (
        item.status !== 0 ||
        user?.vitri_ifee > 3 ||
        item.id_user === user?.id ||
        (user?.id === 1 && item.status !== 0)
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
            justifyContent: 'space-between',
            width: '66%',
            marginBottom: Dimension.setHeight(0.5),
          }}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontFamily: Fonts.SF_SEMIBOLD,
              fontSize: 19,
            }}>
            {item.thuocchuongtrinh}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: '5%',
            top: '7%',
            zIndex: 9999,
          }}>
          {checkStatus() && (
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
        <Text
          style={{
            fontSize: 16,
            fontFamily: Fonts.SF_MEDIUM,
            color: '#747476',
            marginBottom: Dimension.setHeight(0.8),
          }}>
          {item.diadiem}
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
            Họ tên: <Text style={styles.content}>{item.name_user}</Text>
          </Text>
        </View>

        <View style={styles.containerEachLine}>
          <Image source={Images.datetime} style={styles.Iconic} />
          <Text style={styles.title}>Thời gian:</Text>
          <Text style={styles.content}>{changeFormatDate(item.tungay)}</Text>
          <Separation />
          <Text style={styles.content}>{changeFormatDate(item.denngay)}</Text>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Lịch sử công tác" navigation={navigation} />
      <FilterStatusUI
        handlePickOption={handlePickOption}
        indexPicker={indexPicker}
      />
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
              <RenderWorkScheduleData item={item} index={index} />
            )}
            initialNumToRender={6}
            windowSize={6}
            removeClippedSubviews={true}
            refreshing={true}
            extraData={workSheduleData}
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
                <Text style={styles.titleBottomSheet}>Chương trình</Text>
                <View style={styles.containerEachLine}>
                  <Image source={Images.work} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                    }}>
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
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '66%',
                    }}>
                    <Text style={styles.title}>Địa điểm:</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {selectedItem.diadiem}
                    </Text>
                  </View>
                </View>
                <View style={styles.containerEachLine}>
                  <Image source={Images.content} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                    }}>
                    <Text ellipsizeMode="tail" style={styles.title}>
                      Nội dung:{' '}
                      <Text style={styles.content}>{selectedItem.noidung}</Text>
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.bottomSheetContainer}>
                <Text style={styles.titleBottomSheet}>Thông tin công tác</Text>
                <View style={styles.containerEachLine}>
                  <Image
                    src={mainURL + selectedItem.avatar}
                    style={styles.Iconic}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                    }}>
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
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                    }}>
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
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
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
          toggleApproveModal={toggleModal}
          setToggleApproveModal={setToggleModal}
          checkInput={checkInput}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          commnetInput={commentInput}
          setCommentInput={setCommentInput}
          reasonCancel={reasonCancel}
          setReasonCancel={setReasonCancel}
          eventFunc={handleSendNonAdjust}
        />
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
    color: '#747476',
    fontSize: 15,
    fontFamily: Fonts.SF_MEDIUM,
  },

  content: {
    fontSize: 16,
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
    fontSize: 17,
    color: '#8bc7bc',
    marginBottom: Dimension.setHeight(1.6),
  },

  approvedIcon: {
    width: 30,
    height: 30,
  },
});

export default HistoryWorkShedule;
