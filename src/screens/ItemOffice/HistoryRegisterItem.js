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
  approveRegisterOfficeItem,
  cancelRegisterOfficeItem,
  getAllListOfficeItem,
} from '../../redux/apiRequest';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import StatusUI from '../../components/StatusUI';
import {ConfirmModal} from '../../components/Modal';
import {shadowIOS} from '../../contants/propsIOS';
import LinearGradientUI from '../../components/LinearGradientUI';
import {changeFormatDate} from '../../utils/serviceFunction';
import {fontDefault, mainURL} from '../../contants/Variable';

const HistoryRegisterItem = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const officeItemData = useSelector(
    state => state.officeItem.officeItemSlice?.data,
  );
  const IFEEstaffs = useSelector(state => state.staffs?.staffs?.IFEEStaff);
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const [toggleModal, setToggleModal] = useState(false);
  const [checkInput, setCheckInput] = useState(null);
  const [indexPicker, setIndexPicker] = useState(0);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['45%', '80%'], []);

  const handleBottomSheet = useCallback(
    (item, path) => {
      setSelectedItem({...item, path});
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
    approveRegisterOfficeItem(data);
    setToggleModal(false);
    setTimeout(() => {
      fetchOfficeItemList();
    });
  }, []);

  const handleCancel = useCallback(item => {
    const data = {
      id_user: item?.id_user,
    };

    cancelRegisterOfficeItem(data);
    setToggleModal(false);
    setTimeout(() => {
      fetchOfficeItemList();
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
      //   switch (index) {
      //     case 0:
      //       return officeItemData?.filter(item => item.status === 0);
      //     case 1:
      //       return officeItemData?.filter(item => item.status === 1);
      //     case 2:
      //       return officeItemData?.filter(item => item.status === 2);
      //   }
      return officeItemData;
    },
    [officeItemData],
  );

  const fetchOfficeItemList = () => {
    getAllListOfficeItem(dispatch);
  };

  useLayoutEffect(() => {
    fetchOfficeItemList();
  }, []);

  const RenderTicketData = memo(({item, index}) => {
    const colorStatus = '#f9a86a';
    const bgColorStatus = '#fef4eb';
    const status = 'Chờ phê duyệt';
    const icon = Images.pending;

    const filterUser = IFEEstaffs.filter(user => user.id == item.id_user)[0];

    const checkRole = () => {
      return user?.quyentruycap <= 2;
    };

    return (
      <TouchableOpacity
        onPress={() => {
          handleBottomSheet(item, filterUser?.path);
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
            {`Tổng cộng ${item.vpp.length} văn phòng phẩm cần phê duyệt`}
          </Text>
        </View>
        <View
          style={{position: 'absolute', right: '5%', top: '7%', zIndex: 9999}}>
          {user?.quyentruycap > 2 && (
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
        </View>
        <View style={styles.containerEachLine}>
          <Image
            src={mainURL + filterUser?.path}
            style={[styles.Iconic, {borderRadius: 50}]}
          />
          <Text style={[styles.title, {width: '90%'}]}>
            Người đăng kí: <Text style={styles.content}>{item.nguoidk}</Text>
          </Text>
        </View>

        <View style={styles.containerEachLine}>
          <Image source={Images.datetime} style={styles.Iconic} />
          <Text style={styles.title}>Ngày đăng kí:{'  '}</Text>
          <Text style={styles.content}>{changeFormatDate(item.ngaydk)}</Text>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header
          title="Lịch sử đăng kí VPP"
          navigation={navigation}
          //   refreshData={fetchOfficeItemList}
        />
        <BottomSheetModalProvider>
          {/* <FilterStatusUI
            handlePickOption={handlePickOption}
            indexPicker={indexPicker}
          /> */}

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
                extraData={officeItemData}
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
                  <Text style={styles.titleBottomSheet}>Người đăng kí</Text>
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
                        {selectedItem.nguoidk}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.containerEachLine}>
                    <Image source={Images.note} style={styles.Iconic} />
                    <View style={styles.containerLine}>
                      <Text style={styles.title}>Bộ môn:{'  '}</Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.content}>
                        {selectedItem.bomon}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.containerEachLine}>
                    <Image source={Images.datetime} style={styles.Iconic} />
                    <View style={styles.containerLine}>
                      <Text style={styles.title}>Ngày đăng kí:{'  '}</Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.content}>
                        {changeFormatDate(selectedItem.ngaydk)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.bottomSheetContainer}>
                  <Text style={styles.titleBottomSheet}>Văn phòng phẩm</Text>
                  {selectedItem.vpp.map((item, index) => {
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
                              Loại VPP:{'  '}
                              <Text numberOfLines={2} style={styles.content}>
                                {item.vpp}
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
                            <Text style={styles.title}>Số lượng:{'  '}</Text>
                            <Text
                              numberOfLines={2}
                              ellipsizeMode="tail"
                              style={styles.content}>
                              {item.soluong}
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
          screenName={'HistoryRegisterItem'}
          toggleModal={toggleModal}
          setToggleModal={setToggleModal}
          item={selectedItem}
          status={checkInput}
          handleApprove={handleApprove}
          handleCancel={handleCancel}
        />
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

export default HistoryRegisterItem;
