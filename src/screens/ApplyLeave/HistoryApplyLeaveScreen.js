import React, {useState, useCallback, memo, useLayoutEffect} from 'react';
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
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Dimension from '../../contants/Dimension';
import Header from '../../components/Header';
import {
  adjustOnLeave,
  approveAdjustOnLeave,
  cancelAdjustOnLeave,
  getAllOnLeaveData,
  rejectLeaveRequest,
  resolveLeaveRequest,
} from '../../redux/apiRequest';
import {
  changeFormatDate,
  formatDate,
  compareDate,
  formatDateToPost,
} from '../../utils/serviceFunction';
import Separation from '../../components/Separation';
import Modal from 'react-native-modal';
import Colors from '../../contants/Colors';
import {ToastWarning, ToastAlert} from '../../components/Toast';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {ApproveCancelModal} from '../../components/Modal';
import {shadowIOS} from '../../contants/propsIOS';
import {mainURL} from '../../contants/Variable';
import FilterStatusUI from '../../components/FilterStatusUI';

const HistoryApplyLeaveScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const leaveData = useSelector(state => state.onLeave.onLeaves?.data);
  const [selectedItem, setSelectedItem] = useState(null);
  const [commnetInput, setCommentInput] = useState(null);
  const [reasonCancel, setReasonCancel] = useState(null);
  const [checkInput, setCheckInput] = useState(null);
  const [toggleApproveModal, setToggleApproveModal] = useState(false);
  const [toggleEditModal, setToggleEditModal] = useState(false);
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [datePicker, setDatePicker] = useState(formatDate(new Date()));
  const [reasonCancelAdjust, setReasonCancelAdjust] = useState(null);
  const [toggleCancelAdjust, setToggleCancelAdjust] = useState(false);
  const [refreshComponent, setRefreshComponent] = useState(false);
  const [indexPicker, setIndexPicker] = useState(0);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    handleGetAllLeaveData();
  }, []);

  const handleGetAllLeaveData = () => {
    getAllOnLeaveData(user?.id, dispatch);
  };

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
      id_nghiphep: selectedItem.id,
      id_user: user?.id,
    };
    if (!checkInput && reasonCancel !== null && selectedItem !== null) {
      const data = {
        ...importantData,
        lydo: reasonCancel,
      };
      rejectLeaveRequest(data);
      setReasonCancel(null);
      setToggleApproveModal(false);
      setTimeout(() => {
        handleGetAllLeaveData();
      });
    } else if (checkInput && selectedItem !== null) {
      const data = {
        ...importantData,
        nhanxet: commnetInput,
      };
      resolveLeaveRequest(data);

      setCommentInput(null);
      setToggleApproveModal(false);
      setTimeout(() => {
        handleGetAllLeaveData();
      });
    } else {
      ToastWarning('Nhập đầy đủ lý do');
    }
  };

  const handleToggleAdjust = useCallback(item => {
    setSelectedItem(item);
    setToggleEditModal(true);
  }, []);

  const handlePickDate = useCallback(date => {
    setToggleDatePicker(false);
    const message = 'Ngày điều chỉnh không hợp lệ';
    compareDate(new Date(), date)
      ? setDatePicker(formatDate(date))
      : ToastAlert(message);
  }, []);

  const handleAdjust = () => {
    const data = {
      id_nghiphep: selectedItem.id,
      ngay_dc: formatDateToPost(datePicker),
    };

    adjustOnLeave(data);
    setDatePicker(formatDate(new Date()));
    setRefreshComponent(!refreshComponent);

    setToggleEditModal(false);
  };

  const handleApproveAdjust = id_nghiphep => {
    approveAdjustOnLeave(id_nghiphep);
    setRefreshComponent(!refreshComponent);
  };

  const handleToggleCancel = useCallback(item => {
    setSelectedItem(item);
    setToggleCancelAdjust(true);
  }, []);

  const handleCancelAdjust = () => {
    if (reasonCancelAdjust) {
      const data = {
        id_nghiphep: selectedItem.id,
        lydo: reasonCancelAdjust,
      };

      cancelAdjustOnLeave(data);
      setRefreshComponent(!refreshComponent);

      setToggleCancelAdjust(false);
    } else {
      ToastWarning('Thiếu thông tin');
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
          return leaveData?.filter(
            item => item.status === 0 || item.yc_update === 1,
          );
        case 1:
          return leaveData?.filter(
            item =>
              (item.status === 1 &&
                item.yc_update !== 1 &&
                item.yc_update !== 3) ||
              item.yc_update === 2,
          );
        case 2:
          return leaveData?.filter(
            item => item.status === 2 || item.yc_update === 3,
          );
      }
    },
    [leaveData],
  );

  const RenderLeaveList = memo(({item}) => {
    const colorStatus =
      item.status === 0 ? '#f9a86a' : item.status === 1 ? '#57b85d' : '#f25157';
    const bgColorStatus =
      item.status === 0 ? '#fef4eb' : item.status === 1 ? '#def8ed' : '#f9dfe0';
    const status =
      item.status === 0
        ? 'Chờ phê duyệt'
        : item.status === 1
        ? 'Đã phê duyệt'
        : 'Từ chối';
    const icon =
      item.status === 0
        ? Images.pending
        : item.status === 1
        ? Images.approve
        : Images.cancel;

    const colorAdjustStatus =
      item.yc_update === 1
        ? '#f9a86a'
        : item.yc_update === 2
        ? '#57b85d'
        : '#f25157';
    const bgColorAdjustStatus =
      item.yc_update === 1
        ? '#fef4eb'
        : item.yc_update === 2
        ? '#def8ed'
        : '#f9dfe0';
    const adjustStatus =
      item.yc_update === 1
        ? 'Chờ duyệt đ/c'
        : item.yc_update === 2
        ? 'Đã phê duyệt đ/c'
        : 'Từ chối duyệt đ/c';
    const iconAdjust =
      item.yc_update === 1
        ? Images.pending
        : item.yc_update === 2
        ? Images.approve
        : Images.cancel;

    const checkRole = () => {
      return (
        ((item.status === 0 || item.yc_update === 1) &&
          user?.id !== item.id_nhansu &&
          user?.vitri_ifee === 3 &&
          item.vitri_ifee > 3) ||
        (user?.vitri_ifee == 1 && (item.status === 0 || item.yc_update === 1))
      );
    };

    const checkStatus = () => {
      return (
        (item.status !== 0 && item.yc_update !== 1) ||
        user?.vitri_ifee > 3 ||
        item.id_nhansu === user?.id ||
        (user?.id === 1 && item.status !== 0 && item.yc_update !== 1)
      );
    };

    return (
      <View
        key={item.id}
        style={{
          marginHorizontal: Dimension.setWidth(3.5),
          marginBottom: Dimension.setHeight(2),
          backgroundColor: '#ffffff',
          elevation: 5,
          ...shadowIOS,
          borderRadius: 15,
          paddingHorizontal: Dimension.setWidth(5),
          paddingTop: Dimension.setHeight(2),
          paddingBottom: Dimension.setHeight(0.6),
        }}>
        <Text
          style={{
            fontFamily: Fonts.SF_SEMIBOLD,
            fontSize: 18,
            width: '60%',
          }}>
          {item.lydo}
        </Text>
        <View
          style={{position: 'absolute', right: '5%', top: '7%', zIndex: 999}}>
          {checkStatus() && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start',
                paddingVertical: Dimension.setHeight(0.5),
                paddingHorizontal: Dimension.setWidth(1.4),
                borderRadius: 8,
                backgroundColor:
                  item.yc_update === 0 ? bgColorStatus : bgColorAdjustStatus,
                marginBottom: Dimension.setHeight(0.6),
              }}>
              <Image
                source={item.yc_update === 0 ? icon : iconAdjust}
                style={{
                  height: 16,
                  width: 16,
                  marginRight: Dimension.setWidth(1),
                  tintColor:
                    item.yc_update === 0 ? colorStatus : colorAdjustStatus,
                }}
              />
              <Text
                style={{
                  color: item.yc_update === 0 ? colorStatus : colorAdjustStatus,
                  fontSize: 14,
                  fontFamily: Fonts.SF_MEDIUM,
                }}>
                {item.yc_update === 0 ? status : adjustStatus}
              </Text>
            </View>
          )}
          {checkRole() && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: Dimension.setWidth(17),
                alignSelf: 'center',
                zIndex: 9999,
              }}>
              <TouchableOpacity
                onPress={() => {
                  item.yc_update === 0
                    ? handleNonAdjust(true, item)
                    : handleApproveAdjust(item.id);
                }}>
                <Image
                  source={Images.approved}
                  style={[styles.approvedIcon, {tintColor: '#57b85d'}]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  item.yc_update === 0
                    ? handleNonAdjust(false, item)
                    : handleToggleCancel(item);
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
            fontSize: 15,
            fontFamily: Fonts.SF_REGULAR,
            color: Colors.INACTIVE_GREY,
            marginBottom: Dimension.setHeight(0.8),
          }}>
          ID: {item.id}
        </Text>
        <View style={styles.containerEachLine}>
          <Image source={Images.avatar} style={styles.iconic} />
          <Text style={styles.title}>Họ tên: </Text>
          <Text style={styles.content}>{item.hoten}</Text>
        </View>
        {item.status !== 0 && (
          <View style={styles.containerEachLine}>
            <Image source={Images.avatar} style={styles.iconic} />
            <Text style={styles.title}>
              {item.status !== 2 ? 'Người duyệt:' : 'Từ chối bởi:'}{' '}
            </Text>
            <Text style={styles.content}>{item.nguoiduyet}</Text>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Dimension.setHeight(1.3),
          }}>
          <Image source={Images.leaveDate} style={styles.iconic} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.title}>Nghỉ từ: </Text>
            <Text style={styles.content}>{changeFormatDate(item.tungay)}</Text>
            <Separation />
            <Text style={styles.content}>{changeFormatDate(item.denngay)}</Text>
            {item.yc_update === 0 &&
              item.status === 1 &&
              item.id_nhansu === user?.id && (
                <TouchableOpacity
                  onPress={() => {
                    handleToggleAdjust(item);
                  }}
                  style={{
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginLeft: Dimension.setWidth(1),
                  }}>
                  <Image
                    source={Images.adjust}
                    style={{
                      height: 25,
                      width: 25,
                    }}
                  />
                </TouchableOpacity>
              )}
          </View>
        </View>
        {item.ngay_dc && (
          <View style={styles.containerEachLine}>
            <Image source={Images.leaveDate} style={styles.iconic} />
            <Text style={styles.title}>Ngày điều chỉnh: </Text>
            <Text style={styles.content}>{changeFormatDate(item.ngay_dc)}</Text>
          </View>
        )}
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Lịch sử nghỉ phép"
        navigation={navigation}
        refreshData={handleGetAllLeaveData}
      />

      <FilterStatusUI
        handlePickOption={handlePickOption}
        indexPicker={indexPicker}
      />

      {handleFilter(indexPicker)?.length !== 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            paddingTop: Dimension.setHeight(3),
          }}
          data={handleFilter(indexPicker)}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item}) => <RenderLeaveList item={item} />}
          initialNumToRender={6}
          windowSize={6}
          removeClippedSubviews={true}
          refreshing={true}
          extraData={leaveData}
        />
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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

      <ApproveCancelModal
        screenName={'registerOnleave'}
        toggleApproveModal={toggleApproveModal}
        setToggleApproveModal={setToggleApproveModal}
        checkInput={checkInput}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        commnetInput={commnetInput}
        setCommentInput={setCommentInput}
        reasonCancel={reasonCancel}
        setReasonCancel={setReasonCancel}
        eventFunc={handleSendNonAdjust}
      />

      <Modal
        isVisible={toggleEditModal}
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
                fontSize: 20,
                color: '#f9a86a',
              }}>
              Điều chỉnh
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: Dimension.setHeight(1.5),
              paddingHorizontal: Dimension.setWidth(3),
            }}>
            <Image src={mainURL + user?.path} style={{height: 55, width: 55}} />
            <Text
              style={{
                marginLeft: Dimension.setWidth(3),
                fontSize: 18,
                fontFamily: Fonts.SF_SEMIBOLD,
              }}>
              {user?.hoten}
            </Text>
          </View>
          <View style={styles.lineContainerModal}>
            <View style={styles.itemContainerModal}>
              <Text style={styles.titleModal}>Ngày hiện tại</Text>
              <View style={styles.dateModalContainer}>
                <Text style={styles.contentModal}>
                  {changeFormatDate(selectedItem?.denngay)}
                </Text>
                <View style={styles.imgModalContainer}>
                  <Image source={Images.calendarBlack} style={styles.imgDate} />
                </View>
              </View>
            </View>
            <View style={styles.itemContainerModal}>
              <Text style={styles.titleModal}>Ngày điều chỉnh</Text>
              <TouchableOpacity
                onPress={() => {
                  setToggleDatePicker(true);
                }}
                style={styles.dateModalContainer}>
                <Text style={styles.contentModal}>{datePicker}</Text>
                <View
                  style={[
                    styles.imgModalContainer,
                    {backgroundColor: '#7cc985'},
                  ]}>
                  <Image source={Images.calendarBlack} style={styles.imgDate} />
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
            onPress={() => setToggleEditModal(false)}>
            <Image source={Images.minusclose} style={styles.btnModal} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAdjust}
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
          mode="date"
          onConfirm={handlePickDate}
          onCancel={() => {
            setToggleDatePicker(false);
          }}
        />
      </Modal>

      <Modal
        isVisible={toggleCancelAdjust}
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
            backgroundColor: '#f9dfe0',
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
                fontSize: 20,
                color: '#f25157',
              }}>
              Từ chối
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: Dimension.setHeight(1.5),
              paddingHorizontal: Dimension.setWidth(3),
            }}>
            <Image source={Images.avatar} style={{height: 55, width: 55}} />
            <Text
              style={{
                marginLeft: Dimension.setWidth(3),
                fontSize: 18,
                fontFamily: Fonts.SF_SEMIBOLD,
              }}>
              {selectedItem?.hoten}
            </Text>
          </View>
          <View style={styles.containerEachLine}>
            <Image source={Images.comment} style={styles.iconic} />
            <TextInput
              multiline={true}
              placeholder="Lý do từ chối đ/c"
              style={{
                backgroundColor: '#ffffff',
                paddingHorizontal: Dimension.setWidth(2),
                borderRadius: 10,
                fontFamily: Fonts.SF_REGULAR,
                width: '70%',
                height: Dimension.setHeight(6),
                maxHeight: Dimension.setHeight(9),
              }}
              onChangeText={e => setReasonCancelAdjust(e)}
              value={reasonCancelAdjust}
            />
            <TouchableOpacity
              onPress={handleCancelAdjust}
              style={{
                backgroundColor: '#d9eafa',
                padding: 6,
                marginLeft: Dimension.setWidth(1.6),
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image source={Images.send} style={{width: 25, height: 25}} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setToggleCancelAdjust(false)}
            style={{position: 'absolute', right: '5%', top: '5%'}}>
            <Image source={Images.minusclose} style={styles.btnModal} />
          </TouchableOpacity>
        </View>
      </Modal>
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
    marginBottom: Dimension.setHeight(1.3),
  },

  approvedIcon: {
    width: 30,
    height: 30,
  },

  iconic: {
    height: 33,
    width: 33,
    borderRadius: 50,
    marginRight: Dimension.setWidth(2),
  },

  title: {
    color: '#747476',
    fontSize: 16,
    fontFamily: Fonts.SF_MEDIUM,
  },

  content: {
    fontSize: 17,
    fontFamily: Fonts.SF_SEMIBOLD,
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
    fontSize: 13,
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
    fontSize: 15,
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

export default HistoryApplyLeaveScreen;
