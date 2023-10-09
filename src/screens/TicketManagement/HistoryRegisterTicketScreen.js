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
  cancelPlaneTicket,
  getAllPlaneData,
} from '../../redux/apiRequest';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import StatusUI from '../../components/StatusUI';
import {ApproveCancelModal} from '../../components/Modal';
import {ToastWarning} from '../../components/Toast';
import {shadowIOS} from '../../contants/propsIOS';
import FilterStatusUI from '../../components/FilterStatusUI';
import LinearGradientUI from '../../components/LinearGradientUI';
import {EmptyList} from '../../components/FlatlistComponent';
import {InternalSkeleton} from '../../components/Skeleton';

const HistoryRegisterTicketScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const ticketPlaneData = useSelector(
    state => state.ticketPlane.ticketPlane?.data,
  );

  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const [toggleModal, setToggleModal] = useState(false);
  const [checkInput, setCheckInput] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [reasonCancel, setReasonCancel] = useState('');
  const [indexPicker, setIndexPicker] = useState(0);
  const [loading, setLoading] = useState(true);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['45%', '80%'], []);

  const handleBottomSheet = useCallback(
    (
      item,
      colorStatus,
      bgColorStatus,
      filterPlace,
      filterStartPlace,
      filterEndPlace,
    ) => {
      setSelectedItem({
        ...item,
        colorStatus,
        bgColorStatus,
        filterPlace,
        filterStartPlace,
        filterEndPlace,
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
      bottomSheetModalRef.current?.dismiss();
      setSelectedItem(item);
      setCheckInput(true);
      setToggleModal(true);
    },
    [selectedItem],
  );

  const handleCancel = useCallback(
    item => {
      bottomSheetModalRef.current?.dismiss();
      setSelectedItem(item);
      setCheckInput(false);
      setToggleModal(true);
    },
    [selectedItem],
  );

  const handleApproveCancel = () => {
    const data = {
      id_dulieu: selectedItem.id,
      noidung: checkInput ? commentInput : reasonCancel,
    };
    if (
      (commentInput.length !== 0 || reasonCancel.length !== 0) &&
      selectedItem !== null
    ) {
      if (checkInput) {
        approvePlaneTicket(data);
      } else {
        cancelPlaneTicket(data);
      }
      setTimeout(() => {
        fetchPlaneData();
      });
      setToggleModal(false);
    } else {
      ToastWarning('Nhập đầy đủ thông tin');
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
          return ticketPlaneData?.filter(item => item.status === 0);
        case 1:
          return ticketPlaneData?.filter(item => item.status === 1);
        case 2:
          return ticketPlaneData?.filter(item => item.status === 2);
      }
    },
    [ticketPlaneData],
  );

  const fetchPlaneData = async () => {
    try {
      await getAllPlaneData(dispatch);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    fetchPlaneData();
  }, []);

  const RenderTicketData = memo(({item, index}) => {
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
    const indexString = item.sanbayden.indexOf('(');
    const filterPlace = item.sanbayden.slice(0, indexString);
    const indexStartPlace = item.sanbaydi.indexOf('Sân');
    const filterStartPlace = item.sanbaydi.slice(indexStartPlace);
    const indexEndPlace = item.sanbayden.indexOf('Sân');
    const filterEndPlace = item.sanbayden.slice(indexEndPlace);

    const checktStatus = () => {
      return (
        (item.status !== 0 &&
          (user?.id_ht === 1 || user?.id_ht === 20 || user?.id_ht === 28)) ||
        (user?.id_ht !== 1 && user?.id_ht !== 20 && user?.id_ht !== 28)
      );
    };

    const checkRole = () => {
      return (
        item.status === 0 &&
        (user?.id_ht === 1 || user?.id_ht === 20 || user?.id_ht === 28)
      );
    };

    return (
      <TouchableOpacity
        onPress={() => {
          handleBottomSheet(
            item,
            colorStatus,
            bgColorStatus,
            filterPlace,
            filterStartPlace,
            filterEndPlace,
          );
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
            marginBottom: Dimension.setHeight(0.5),
          }}>
          <Text
            numberOfLines={2}
            style={{fontFamily: Fonts.SF_SEMIBOLD, fontSize: 18}}>
            {item.chuongtrinh}
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
        <Text
          style={{
            fontSize: Dimension.fontSize(16),
            fontFamily: Fonts.SF_MEDIUM,
            color: '#747476',
            marginBottom: Dimension.setHeight(0.8),
          }}>
          {filterPlace}
        </Text>
        <View style={styles.containerEachLine}>
          <Image source={Images.insideperson} style={styles.Iconic} />
          <Text style={[styles.title, {width: '90%'}]}>
            Trong viện:{' '}
            <Text style={styles.content}>
              {item.trongvien.map((item, index) => {
                return <Text key={index}>{item.hoten}, </Text>;
              })}
            </Text>
          </Text>
        </View>
        <View style={styles.containerEachLine}>
          <Image source={Images.outsideperson} style={styles.Iconic} />
          <Text style={styles.title}>Ngoài viện: </Text>
          <Text style={styles.content}>
            {item.ngoaivien.map((item, index) => {
              return <Text key={index}>{item}</Text>;
            })}
          </Text>
        </View>

        <View style={styles.containerEachLine}>
          <Image source={Images.datetime} style={styles.Iconic} />
          <Text style={styles.title}>Thời gian:{'  '}</Text>
          <Text style={styles.content}>{item.ngaydi}</Text>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header
          title="Lịch sử đặt vé"
          navigation={navigation}
          refreshData={fetchPlaneData}
        />
        <BottomSheetModalProvider>
          <FilterStatusUI
            handlePickOption={handlePickOption}
            indexPicker={indexPicker}
          />

          {loading ? (
            <InternalSkeleton />
          ) : (
            <FlatList
              contentContainerStyle={{
                flex: 1,
                paddingTop: Dimension.setHeight(3),
              }}
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
              extraData={ticketPlaneData}
              ListEmptyComponent={() => {
                return <EmptyList />;
              }}
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
                      <Text style={styles.title}>
                        Tên chương trình:{'  '}
                        <Text
                          numberOfLines={3}
                          ellipsizeMode="tail"
                          style={styles.content}>
                          {selectedItem.chuongtrinh}
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <View style={styles.containerEachLine}>
                    <Image source={Images.worklocation} style={styles.Iconic} />
                    <View style={styles.containerLine}>
                      <Text style={styles.title}>Địa điểm:{'  '}</Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.content}>
                        {selectedItem.filterPlace}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.bottomSheetContainer}>
                  <Text style={styles.titleBottomSheet}>Người tham gia</Text>
                  <View style={styles.containerEachLine}>
                    <Image
                      source={Images.registerperson}
                      style={styles.Iconic}
                    />
                    <View style={styles.containerLine}>
                      <Text style={styles.title}>Người đăng kí:{'  '}</Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.content}>
                        {selectedItem.name_user}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.containerEachLine}>
                    <Image source={Images.insideperson} style={styles.Iconic} />
                    <Text style={[styles.title, {width: '90%'}]}>
                      Người trong viện:{' '}
                      <Text style={styles.content}>
                        {selectedItem.trongvien?.map((item, index) => {
                          return <Text key={index}>{item.hoten}, </Text>;
                        })}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.containerEachLine}>
                    <Image
                      source={Images.outsideperson}
                      style={styles.Iconic}
                    />
                    <View style={styles.containerLine}>
                      <Text style={styles.title}>Người ngoài viện:{'  '}</Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.content}>
                        {selectedItem.ngoaivien?.map((item, index) => {
                          return <Text key={index}>{item}</Text>;
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.bottomSheetContainer}>
                  <Text style={styles.titleBottomSheet}>
                    Thông tin chuyến bay
                  </Text>
                  <View style={styles.containerEachLine}>
                    <Image source={Images.plane} style={styles.Iconic} />
                    <View style={styles.containerLine}>
                      <Text style={styles.title}>Hãng bay:{'  '}</Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.content}>
                        {selectedItem.hangbay}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.containerEachLine}>
                    <Image source={Images.planeTicket} style={styles.Iconic} />
                    <View style={styles.containerLine}>
                      <Text style={styles.title}>Hạng vé:{'  '}</Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.content}>
                        {selectedItem.hangve}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.containerEachLine}>
                    <Image source={Images.baggage} style={styles.Iconic} />
                    <View style={styles.containerLine}>
                      <Text style={styles.title}>Cân nặng hành lý:{'  '}</Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.content}>
                        {selectedItem.kygui}KG
                      </Text>
                    </View>
                  </View>
                  <View style={styles.containerEachLine}>
                    <Image source={Images.takeoff} style={styles.Iconic} />
                    <View style={styles.containerLine}>
                      <Text style={styles.title}>Địa điểm đi:{'  '}</Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.content}>
                        {selectedItem.filterStartPlace}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.containerEachLine}>
                    <Image source={Images.landing} style={styles.Iconic} />
                    <View style={styles.containerLine}>
                      <Text style={styles.title}>Địa điểm đến:{'  '}</Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.content}>
                        {selectedItem.filterEndPlace}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.containerEachLine}>
                    <Image source={Images.datetime} style={styles.Iconic} />
                    <View style={styles.containerLine}>
                      <Text style={styles.title}>Khởi hành lúc:{'  '}</Text>
                      <Text style={styles.content}>{selectedItem.ngaydi}</Text>
                    </View>
                  </View>
                </View>
              </BottomSheetScrollView>
            </BottomSheetModal>
          )}
        </BottomSheetModalProvider>
        <ApproveCancelModal
          screenName={'registerTicket'}
          toggleApproveModal={toggleModal}
          setToggleApproveModal={setToggleModal}
          checkInput={checkInput}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          commnetInput={commentInput}
          setCommentInput={setCommentInput}
          reasonCancel={reasonCancel}
          setReasonCancel={setReasonCancel}
          eventFunc={handleApproveCancel}
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

export default HistoryRegisterTicketScreen;
