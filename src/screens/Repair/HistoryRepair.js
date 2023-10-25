import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
  memo,
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
  approveRepair,
  cancelRepair,
  getRepairApproveList,
} from '../../redux/apiRequest';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {ConfirmModal} from '../../components/Modal';
import {shadowIOS} from '../../contants/propsIOS';
import LinearGradientUI from '../../components/LinearGradientUI';
import {fontDefault, mainURL} from '../../contants/Variable';
import {EmptyList} from '../../components/FlatlistComponent';
import {InternalSkeleton} from '../../components/Skeleton';
import StatusUI from '../../components/StatusUI';

const HistoryRepair = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const repairData = useSelector(state => state.repair.repair?.data);
  const IFEEstaffs = useSelector(state => state.staffs?.staffs?.IFEEStaff);
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const [toggleModal, setToggleModal] = useState(false);
  const [checkInput, setCheckInput] = useState(null);
  const [loading, setLoading] = useState(true);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['45%', '80%'], []);

  const checkRole = () => {
    return user?.quyentruycap <= 2;
  };

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
    approveRepair(item?.id_nguoidk);
    setToggleModal(false);
    setTimeout(() => {
      fetchListRepair();
    });
  }, []);

  const handleCancel = useCallback(item => {
    cancelRepair(item?.id_nguoidk);
    setToggleModal(false);
    setTimeout(() => {
      fetchListRepair();
    });
  }, []);

  const fetchListRepair = async () => {
    try {
      const res = await getRepairApproveList(dispatch);

      if (res) {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    fetchListRepair();
  }, []);

  const RenderTicketData = memo(({item, index}) => {
    const filterUser = IFEEstaffs.filter(user => user.id == item.id_nguoidk)[0];

    const dateReg = item.ngaydangky.split(' ')[0].replace(/-/g, '/');
    const timeReg = item.ngaydangky.split(' ')[1];

    const colorStatus = '#f9a86a';
    const bgColorStatus = '#fef4eb';
    const status = 'Chờ phê duyệt';
    const icon = Images.pending;

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
            width: '65%',
            marginBottom: Dimension.setHeight(0.8),
          }}>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: Fonts.SF_SEMIBOLD,
              fontSize: Dimension.fontSize(18),
              ...fontDefault,
            }}>
            {`Tổng cộng ${item.ds_thietbi?.length} thiết bị cần sửa chữa`}
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
          ) : (
            <StatusUI
              status={status}
              colorStatus={colorStatus}
              bgColorStatus={bgColorStatus}
              icon={icon}
            />
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
          <Text style={[styles.title, {width: '90%'}]}>
            Ngày đăng kí: <Text style={styles.content}>{dateReg}</Text>
          </Text>
        </View>
        <View style={styles.containerEachLine}>
          <Image source={Images.datetime} style={styles.Iconic} />
          <Text style={[styles.title, {width: '90%'}]}>
            Giờ đăng kí: <Text style={styles.content}>{timeReg}</Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header title={`Lịch sử đăng kí sửa chữa`} navigation={navigation} />
        <BottomSheetModalProvider>
          {loading ? (
            <InternalSkeleton />
          ) : (
            <FlatList
              style={{
                flex: 1,
                paddingTop: Dimension.setHeight(2),
              }}
              showsVerticalScrollIndicator={false}
              data={repairData}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({item, index}) => (
                <RenderTicketData item={item} index={index} />
              )}
              initialNumToRender={6}
              windowSize={6}
              removeClippedSubviews={true}
              extraData={repairData}
              ListEmptyComponent={() => {
                return <EmptyList />;
              }}
            />
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
                  marginBottom: Dimension.setHeight(2),
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

                  <View style={styles.containerEachLine}>
                    <Image
                      src={mainURL + selectedItem?.path}
                      style={[styles.Iconic, {borderRadius: 50}]}
                    />
                    <View style={styles.containerLine}>
                      <Text style={styles.title}>Người đăng kí:{'  '}</Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.content}>
                        {selectedItem.nguoidk}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.containerEachLine}>
                    <Image source={Images.work} style={styles.Iconic} />
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
                </View>

                <View style={styles.bottomSheetContainer}>
                  <Text style={styles.titleBottomSheet}>
                    Tình trạng hoạt động
                  </Text>
                  {selectedItem.ds_thietbi.map((item, index) => {
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
                              Nội dung:{'  '}
                              <Text numberOfLines={2} style={styles.content}>
                                {item?.noidung}
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
                            <Text style={styles.title}>Hiện trạng:{'  '}</Text>
                            <Text
                              numberOfLines={2}
                              ellipsizeMode="tail"
                              style={styles.content}>
                              {item.hientrang}
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
          screenName={'HistoryRegisterRepair'}
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

export default HistoryRepair;
