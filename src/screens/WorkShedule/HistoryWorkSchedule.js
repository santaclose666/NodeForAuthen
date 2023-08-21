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
import {getAllWorkSchedule} from '../../redux/apiRequest';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import FilterStatusUI from '../../components/FilterStatusUI';
import {changeFormatDate} from '../../utils/serviceFunction';

const HistoryWorkShedule = ({navigation, route}) => {
  const refresh = route.params?.refresh;
  const user = useSelector(state => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const workSheduleData = useSelector(
    state => state.workShedule?.worksSchedule?.data,
  );
  const [refreshComponent, setRefreshComponent] = useState(false);
  const [indexPicker, setIndexPicker] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['45%', '80%'], []);

  const handleSheetChanges = useCallback(() => {
    setSelectedItem(null);
  }, []);

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

    console.log(workSheduleData[0].id);
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

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedItem({
            ...item,
            colorStatus: colorStatus,
            bgColorStatus: bgColorStatus,
          });
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
            {item.thuocchuongtrinh}
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
              source={icon}
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
              {status}
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
          {item.diadiem}
        </Text>
        <View style={styles.containerEachLine}>
          <Image source={Images.insideperson} style={styles.Iconic} />
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
    marginBottom: Dimension.setHeight(1.6),
  },
});

export default HistoryWorkShedule;
