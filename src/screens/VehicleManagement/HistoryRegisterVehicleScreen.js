import React, {useRef, useState, useCallback, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
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

const HistoryRegisterVehicleScreen = ({navigation}) => {
  const [registationTicketData, setRegistationTicketData] = useState([
    {
      actionType: 'Mượn xe',
      vehicleType: 'WIGO',
      numberPlates: null,
      registerPerson: 'Phạm Quang Dương',
      approveBy: 'Admin',
      approveDate: '28-02-2023',
      startDate: '08-08-2023',
      endDate: '05-05-2023',
      content: 'Tập huấn phần mềm Cháy - Chi cục kiểm lầm Hà Giang',
      status: 'Pending',
    },
    {
      actionType: 'Trả xe',
      vehicleType: 'WIGO',
      numberPlates: null,
      registerPerson: 'Lê Hữu Cường',
      approveBy: 'Admin',
      approveDate: '28-02-2023',
      startDate: '03-03-2023',
      endDate: '05-05-2023',
      content: 'Kiểm tra, sửa chữa server. - Nâng cấp, thay SSD IMac',
      status: 'Approved',
    },
    {
      actionType: 'Mượn xe',
      vehicleType: 'Wave',
      numberPlates: '29X1-897.78',
      registerPerson: 'Nguyễn Vũ Thuật',
      approveBy: 'Admin',
      approveDate: '28-02-2023',
      startDate: '08-08-2023',
      endDate: '05-05-2023',
      content: 'Triển khai lắp biển nhiệm vụ Số hóa cây xanh Thành cổ Sơn Tây',
      status: 'Cancelled',
    },
    {
      actionType: 'Trả xe',
      vehicleType: 'Wave',
      numberPlates: '29X1-902.14',
      registerPerson: 'Phạm Quang Dương',
      approveBy: 'Admin',
      approveDate: '28-02-2023',
      startDate: '03-03-2023',
      endDate: '05-05-2023',
      content: 'Chuyển đồ, thiết bị',
      status: 'Approved',
    },
  ]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rerender, setRerender] = useState(false);

  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ['45%', '80%'], []);

  const handlePresentModalPress = useCallback(() => {
    setRerender(true);
  }, [selectedItem]);
  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  useEffect(() => {
    if (rerender) {
      bottomSheetModalRef.current?.present();
      setRerender(false);
    }
  }, [rerender, selectedItem]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Lịch sử đăng kí xe" navigation={navigation} />
      <BottomSheetModalProvider>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1, marginTop: Dimension.setHeight(2)}}>
          {registationTicketData.map((item, index) => {
            const colorStatus =
              item.status === 'Pending'
                ? '#f9a86a'
                : item.status === 'Approved'
                ? '#57b85d'
                : '#f25157';
            const bgColorStatus =
              item.status === 'Pending'
                ? '#fef4eb'
                : item.status === 'Approved'
                ? '#def8ed'
                : '#f9dfe0';
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
                    {`${item.actionType} ${item.vehicleType}`}
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
                      source={
                        item.status === 'Pending'
                          ? Images.pending
                          : item.status === 'Approved'
                          ? Images.approve
                          : Images.cancel
                      }
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
                      {item.status}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.SF_MEDIUM,
                    color: '#747476',
                    marginBottom: Dimension.setHeight(0.8),
                  }}>
                  {item.numberPlates ? item.numberPlates : 'Không xác định'}
                </Text>
                <View style={styles.containerEachLine}>
                  <Image source={Images.registerperson} style={styles.Iconic} />
                  <Text style={styles.title}>Đăng kí: </Text>
                  <Text style={styles.content}>{item.registerPerson}</Text>
                </View>

                <View style={styles.containerEachLine}>
                  <Image source={Images.datetime} style={styles.Iconic} />
                  <Text style={styles.title}>Mượn từ:{'  '}</Text>
                  <Text style={styles.content}>{item.startDate}</Text>
                  <Separation />
                  <Text style={styles.content}>{item.endDate}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
                      {selectedItem.vehicleType}
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
                    <Text style={styles.title}>Biển số:{'  '}</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {selectedItem.numberPlates
                        ? selectedItem.numberPlates
                        : 'Không xác định'}
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
                    <Text style={styles.content}>{selectedItem.startDate}</Text>
                    <Separation />
                    <Text style={styles.content}>{selectedItem.endDate}</Text>
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
                      {selectedItem.content}
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
                      {selectedItem.registerPerson}
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
                      {selectedItem.approveBy}
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
                      {selectedItem.status === 'Approved'
                        ? selectedItem.approveDate
                        : selectedItem.status === 'Pending'
                        ? 'Đang chờ duyệt'
                        : 'Bị hủy bỏ'}
                    </Text>
                  </View>
                </View>
              </View>
            </BottomSheetScrollView>
          </BottomSheetModal>
        )}
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
    lineHeight: Dimension.setHeight(2.2),
    marginBottom: Dimension.setHeight(1.6),
  },
});

export default HistoryRegisterVehicleScreen;
