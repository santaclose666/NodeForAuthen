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

const HistoryRegisterTicketScreen = ({navigation}) => {
  const [registationTicketData, setRegistationTicketData] = useState([
    {
      workName: 'Điều tra rừng Cà Mau',
      registerPerson: 'Phạm Quang Dương',
      insidePerson: 'Lê Ngọc Trọng',
      outsidePerson: 'Hoàng Văn Huy',
      planeCompany: 'Vietnam Airline',
      typeTicket: 'Phổ thông',
      baggage: '40KG',
      startPlace: 'Hồ Chí Minh (SGN), Sân bay QT Tân Sơn Nhất',
      endPlace: 'Cà Mau (CAH), Sân bay Cà Mau',
      startDate: '08-08-2023',
      startTime: '13:00 pm',
      status: 'Pending',
    },
    {
      workName: 'Thiết kế giao diện',
      registerPerson: 'Phạm Quang Dương',
      insidePerson: 'Lê Hữu Cường',
      outsidePerson: 'Nguyễn Vũ Thuật',
      planeCompany: 'Vietnam Airline',
      typeTicket: 'Thương gia',
      baggage: '20KG',
      startPlace: 'Hồ Chí Minh (SGN), Sân bay QT Tân Sơn Nhất',
      endPlace: 'Hà Nội (CAH), Sân bay Cà Mau',
      startDate: '16-06-2023',
      startTime: '15:00 pm',
      status: 'Approved',
    },
    {
      workName: 'Thiết kế giao diện',
      registerPerson: 'Phạm Quang Dương',
      insidePerson: 'Nguyễn Hữu A',
      outsidePerson: 'Nguyễn Vũ B',
      planeCompany: 'Vietnam Airline',
      typeTicket: 'VIP',
      baggage: '20KG',
      startPlace: 'Hồ Chí Minh (SGN), Sân bay QT Tân Sơn Nhất',
      endPlace: 'Hà Nội (CAH), Sân bay Cà Mau',
      startDate: '16-06-2023',
      startTime: '15:00 pm',
      status: 'Cancelled',
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
      <Header title="Lịch sử đặt vé" navigation={navigation} />
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
            const indexString = item.endPlace.indexOf('(');
            const filterPlace = item.endPlace.slice(0, indexString);
            const indexStartPlace = item.startPlace.indexOf('Sân');
            const filterStartPlace = item.startPlace.slice(indexStartPlace);
            const indexEndPlace = item.endPlace.indexOf('Sân');
            const filterEndPlace = item.endPlace.slice(indexEndPlace);
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedItem({
                    ...item,
                    colorStatus: colorStatus,
                    bgColorStatus: bgColorStatus,
                    filterPlace: filterPlace,
                    filterStartPlace: filterStartPlace,
                    filterEndPlace: filterEndPlace,
                  });
                  handlePresentModalPress();
                }}
                key={index}
                style={{
                  marginHorizontal: Dimension.setWidth(3),
                  marginBottom: Dimension.setHeight(2),
                  backgroundColor: '#ffffff',
                  elevation: 5,
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
                  <Text style={{fontFamily: Fonts.SF_SEMIBOLD, fontSize: 22}}>
                    {item.workName}
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
                  {filterPlace}
                </Text>
                <View style={styles.containerEachLine}>
                  <Image source={Images.insideperson} style={styles.Iconic} />
                  <Text style={styles.title}>Trong viện: </Text>
                  <Text style={styles.content}>{item.insidePerson}</Text>
                </View>
                <View style={styles.containerEachLine}>
                  <Image source={Images.outsideperson} style={styles.Iconic} />
                  <Text style={styles.title}>Ngoài viện: </Text>
                  <Text style={styles.content}>{item.outsidePerson}</Text>
                </View>

                <View style={styles.containerEachLine}>
                  <Image source={Images.datetime} style={styles.Iconic} />
                  <Text style={styles.title}>Thời gian:{'  '}</Text>
                  <Text style={styles.content}>{item.startTime}</Text>
                  <Separation />
                  <Text style={styles.content}>{item.startDate}</Text>
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
                <Text style={styles.titleBottomSheet}>Chương trình</Text>
                <View style={styles.containerEachLine}>
                  <Image source={Images.work} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '66%',
                    }}>
                    <Text style={styles.title}>Tên chương trình:{'  '}</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {selectedItem.workName}
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
                  <Image source={Images.insideperson} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '66%',
                    }}>
                    <Text style={styles.title}>Người trong viện:{'  '}</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {selectedItem.insidePerson}
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
                    <Text style={styles.title}>Người ngoài viện:{'  '}</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {selectedItem.outsidePerson}
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
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '66%',
                    }}>
                    <Text style={styles.title}>Hãng bay:{'  '}</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {selectedItem.planeCompany}
                    </Text>
                  </View>
                </View>
                <View style={styles.containerEachLine}>
                  <Image source={Images.planeTicket} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '66%',
                    }}>
                    <Text style={styles.title}>Hạng vé:{'  '}</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {selectedItem.typeTicket}
                    </Text>
                  </View>
                </View>
                <View style={styles.containerEachLine}>
                  <Image source={Images.baggage} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '66%',
                    }}>
                    <Text style={styles.title}>Cân nặng hành lý:{'  '}</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {selectedItem.baggage}
                    </Text>
                  </View>
                </View>
                <View style={styles.containerEachLine}>
                  <Image source={Images.takeoff} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '66%',
                    }}>
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
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '66%',
                    }}>
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
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '66%',
                    }}>
                    <Text style={styles.title}>Khởi hành lúc:{'  '}</Text>
                    <Text style={styles.content}>{selectedItem.startTime}</Text>
                    <Separation />
                    <Text style={styles.content}>{selectedItem.startDate}</Text>
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
  },

  titleBottomSheet: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: 17,
    color: '#8bc7bc',
    lineHeight: Dimension.setHeight(2.2),
    marginBottom: Dimension.setHeight(1.6),
  },
});

export default HistoryRegisterTicketScreen;
