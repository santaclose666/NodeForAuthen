import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
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

const HistoryWorkShedule = ({ navigation, route }) => {

    const [workSheduleData, setWorkSheduleData] = useState([
        {
            type: 'Lịch công tác',
            location: 'Hà Tĩnh',
            fromDay: '08/08/2022',
            toDay: '10/08/2022',
            clue: 'Lê Sỹ Doanh',
            ingrediment: 'Mr Doanh, Khang, Huân',
            programName: 'Đi gửi văn bản tới Bộ NN&PTNT',
            content: 'Họp thống nhất báo cáo khởi động và khảo sát hiện trường',
            note: 'Họp thống nhất báo cáo khởi động và khảo sát hiện trường',
            status: 'Pending'
        },

        {
            type: 'Lịch công tác',
            location: 'Hà Giang',
            fromDay: '04/08/2022',
            toDay: '10/08/2022',
            clue: 'Quỹ BVPTR tỉnh Hà Giang',
            ingrediment: 'Khiên, Văn, Bình, Bảo',
            programName: 'Xây dựng CSDL DDSH Cúc Phương',
            content: 'Hoàn thiện dữ liệu DVMT, làm việc lấy xác nhận của địa phương các huyện Vị Xuyên, Bắc Quang, Mèo Vạc, Quang Bình, CR2',
            note: 'a',
            status: 'Approved'
        },

        {
            type: 'Lịch công tác',
            location: 'TP Hồ Chí Minh',
            fromDay: '04/08/2022',
            toDay: '10/08/2022',
            clue: 'Quỹ BVPTR tỉnh Hà Giang',
            ingrediment: 'Khiên, Văn, Bình, Bảo',
            programName: 'Xây dựng CSDL DDSH Cúc Phương',
            content: 'Hoàn thiện dữ liệu DVMT, làm việc lấy xác nhận của địa phương các huyện Vị Xuyên, Bắc Quang, Mèo Vạc, Quang Bình, CR2',
            note: 'a',
            status: 'Cancelled'
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
                    {item.location}
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
                
                <View style={styles.containerEachLine}>
                  <Image source={Images.program} style={styles.Iconic} />
                  <Text style={styles.title}>Chương trình: </Text>
                  <Text style={styles.content}>{item.programName}</Text>
                </View>

                <View style={styles.containerEachLine}>
                  <Image source={Images.datetime} style={styles.Iconic} />
                  <Text style={styles.title}>Thời gian:{'  '}</Text>
                  <Text style={styles.content}>{item.toDay}</Text>
                  <Separation />
                  <Text style={styles.content}>{item.fromDay}</Text>
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
                  <Image source={Images.program} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                        flex:1,
                    }}>
                    <Text style={styles.title}>Tên chương trình:{'  '}</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {selectedItem.programName}
                    </Text>
                  </View>
                </View>
                <View style={styles.containerEachLine}>
                  <Image source={Images.location1} style={styles.Iconic} />
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
                      {selectedItem.location}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.bottomSheetContainer}>
                <Text style={styles.titleBottomSheet}>
                  Thông tin công tác
                </Text>
            
                <View style={styles.containerEachLine}>
                  <Image source={Images.content} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      flex:1
                    }}>
                    <Text style={styles.title}>Nội dung:{'  '}</Text>
                  </View>
                </View>
                <Text     
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {selectedItem.content}
                    </Text>
                <View style={styles.containerEachLine}>
                  <Image source={Images.clue} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      flex:1
                    }}>
                    <Text style={styles.title}>Đầu mối:{'  '}</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {selectedItem.clue}
                    </Text>
                  </View>
                </View>
                <View style={styles.containerEachLine}>
                  <Image source={Images.include} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      flex:1
                    }}>
                    <Text style={styles.title}>Thành phần:{'  '}</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {selectedItem.ingrediment}
                    </Text>
                  </View>
                </View>
                <View style={styles.containerEachLine}>
                  <Image source={Images.note} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      flex:1
                    }}>
                    <Text style={styles.title}>Ghi chú:{'  '}</Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.content}>
                      {selectedItem.note}
                    </Text>
                  </View>
                </View>
                <View style={styles.containerEachLine}>
                  <Image source={Images.datetime} style={styles.Iconic} />
                  <View
                    style={{
                      flexDirection: 'row',
                      flex:1
                    }}>
                    <Text style={styles.title}>Thời gian:{'  '}</Text>
                    <Text style={styles.content}>{selectedItem.toDay}</Text>
                    <Separation />
                    <Text style={styles.content}>{selectedItem.fromDay}</Text>
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
    flex:1,
    marginLeft:5
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

export default HistoryWorkShedule;
