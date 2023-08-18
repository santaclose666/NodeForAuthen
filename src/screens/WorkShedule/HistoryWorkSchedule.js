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

const HistoryWorkShedule = ({navigation, route}) => {
  const [workSheduleData, setWorkSheduleData] = useState([
    {
      fullName: 'Bùi Trung Hiếu',
      subject: 'Phòng R&D',
      location: 'Hà Tĩnh',
      startDay: '08/08/2022',
      endDay: '10/08/2022',
      programName:
        'Gói thầu số 01: Rà soát, điều chỉnh cục bộ Quy hoạch ba loại rừng theo Quyết định số 3042/QĐ-UBND ngày 27/12/2018 của Ủy ban nhân dân tỉnh Hòa Bình',
      content: 'Làm việc tại CCKL',
      status: 'Pending',
    },
    {
      fullName: 'Bùi Trung Hiếu',
      subject: 'Phòng R&D',
      location: 'Hà Tĩnh',
      startDay: '08/08/2022',
      endDay: '10/08/2022',
      programName: 'Xây dựng CSDL DDSH Cúc Phương',
      content: 'Họp triển khai	',
      status: 'Pending',
    },
    {
      fullName: 'Bùi Trung Hiếu',
      subject: 'Phòng R&D',
      location: 'Ninh Bình	',
      startDay: '08/08/2022',
      endDay: '10/08/2022',
      programName: 'Đi gửi văn bản tới Bộ NN&PTNT',
      content: 'Đi gửi văn bản tới Bộ NN&PTNT',
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
      <Header title="Lịch sử công tác" navigation={navigation} />
      <BottomSheetModalProvider>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1, marginTop: Dimension.setHeight(2)}}>
          {workSheduleData.map((item, index) => {
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
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                      fontFamily: Fonts.SF_SEMIBOLD,
                      fontSize: 19,
                      width: '70%',
                    }}>
                    {item.programName}
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
                  {item.location}
                </Text>
                <View style={styles.containerEachLine}>
                  <Image source={Images.insideperson} style={styles.Iconic} />
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[styles.title, {width: '90%'}]}>
                    Họ tên: <Text style={styles.content}>{item.fullName}</Text>
                  </Text>
                </View>

                <View style={styles.containerEachLine}>
                  <Image source={Images.datetime} style={styles.Iconic} />
                  <Text style={styles.title}>Thời gian:</Text>
                  <Text style={styles.content}>{item.startDay}</Text>
                  <Separation />
                  <Text style={styles.content}>{item.endDay}</Text>
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
                      flex: 1,
                    }}>
                    <Text ellipsizeMode="tail" style={styles.title}>
                      Tên chương trình:{' '}
                      <Text style={styles.content}>
                        {selectedItem.programName}
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
                      {selectedItem.location}
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
                      <Text style={styles.content}>{selectedItem.content}</Text>
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.bottomSheetContainer}>
                <Text style={styles.titleBottomSheet}>Thông tin công tác</Text>
                <View style={styles.containerEachLine}>
                  <Image source={Images.insideperson} style={styles.Iconic} />
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
                      {selectedItem.fullName}
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
                    <Text style={styles.content}>{selectedItem.startDay}</Text>
                    <Separation />
                    <Text style={styles.content}>{selectedItem.endDay}</Text>
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
    lineHeight: Dimension.setHeight(2.2),
    marginBottom: Dimension.setHeight(1.6),
  },
});

export default HistoryWorkShedule;
