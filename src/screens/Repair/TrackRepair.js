import React, {useState, useLayoutEffect, memo, useCallback} from 'react';
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
  getNotProcessedYetList,
  getProcessedList,
  updateProcessed,
} from '../../redux/apiRequest';
import {useSelector} from 'react-redux';
import {shadowIOS} from '../../contants/propsIOS';
import LinearGradientUI from '../../components/LinearGradientUI';
import {fontDefault} from '../../contants/Variable';
import {EmptyList} from '../../components/FlatlistComponent';
import {InternalSkeleton} from '../../components/Skeleton';
import Modal from 'react-native-modal';
import {changeFormatDate} from '../../utils/serviceFunction';
import Colors from '../../contants/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const approveArr = [
  {
    title: 'Chưa xử lý',
    color: '#f0b263',
    bgColor: 'rgba(254, 244, 235, 0.3)',
    icon: Images.pending1,
  },
  {
    title: 'Đã xử lý',
    color: '#57b85d',
    bgColor: 'rgba(222, 248, 237, 0.3)',
    icon: Images.approved1,
  },
];

const HistoryRepair = ({navigation, unit}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const idByUnit = unit === 'IFEE' ? user?.id_ifee : user?.id_xmg;
  const repairData = useSelector(state => state.repair.repair?.data);
  const [loading, setLoading] = useState(true);
  const [indexPicker, setIndexPicker] = useState(0);
  const [notYetProcessedData, setNotYetProcessedData] = useState('');
  const [processedData, setProcessedData] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [toggleModal, setToggleModal] = useState(false);

  const handlePickItem = useCallback(item => {
    setSelectedItem(item);
    setToggleModal(true);
  }, []);

  const handleUpdateProcessed = async () => {
    try {
      const data = {
        tendonvi: unit,
        id: selectedItem.id,
      };
      const res = await updateProcessed(data);

      if (res) {
        fetchListRepair();
        setToggleModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchListRepair = async () => {
    try {
      console.log('fetch');
      const data = {
        tendonvi: unit,
      };

      const res1 = await getNotProcessedYetList(data);
      const res2 = await getProcessedList(data);

      if (res1) {
        setNotYetProcessedData(res1);
        setProcessedData(res2);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handlePickOption = index => {
    switch (index) {
      case 0:
        return notYetProcessedData;
      case 1:
        return processedData;
    }
  };

  useLayoutEffect(() => {
    console.log('render');
    fetchListRepair();
  }, []);

  const RenderTicketData = memo(({item, index}) => {
    const date =
      item.tg_dukien || item.ngay_htxuly === null
        ? 'Không xác định'
        : changeFormatDate(item.tg_dukien || item.ngay_htxuly);

    return (
      <View
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
            width: '80%',
            marginBottom: Dimension.setHeight(0.8),
          }}>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: Fonts.SF_SEMIBOLD,
              fontSize: Dimension.fontSize(18),
              ...fontDefault,
            }}>
            {item.noidung}
          </Text>
        </View>

        <View style={styles.containerEachLine}>
          <Image
            source={Images.insideperson}
            style={[styles.Iconic, {borderRadius: 50}]}
          />
          <Text style={[styles.title, {width: '90%'}]}>
            Người đề nghị:{' '}
            <Text style={styles.content}>{item.nguoidenghi}</Text>
          </Text>
        </View>
        <View style={styles.containerEachLine}>
          <Image source={Images.work} style={styles.Iconic} />
          <Text style={[styles.title, {width: '90%'}]}>
            Bộ môn: <Text style={styles.contentModal}>{item.bomon}</Text>
          </Text>
        </View>
        <View style={styles.containerEachLine}>
          <Image source={Images.currStatus} style={styles.Iconic} />
          <Text style={[styles.title, {width: '90%'}]}>
            Hiện trạng: <Text style={styles.content}>{item.hientrang}</Text>
          </Text>
        </View>
        <View style={styles.containerEachLine}>
          <Image source={Images.datetime} style={styles.Iconic} />
          <Text style={[styles.title, {width: '90%'}]}>
            {indexPicker == 0 ? 'Ngày xử lý: ' : 'Thời gian dự kiến: '}
            <Text style={styles.content}>{date}</Text>
          </Text>
        </View>

        {indexPicker == 0 && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: '5%',
              top: '7%',
              zIndex: 9999,
            }}
            onPress={() => {
              handlePickItem(item);
            }}>
            <Image source={Images.fixed} style={styles.approvedIcon} />
          </TouchableOpacity>
        )}
      </View>
    );
  });

  return (
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header title={`Theo dõi sửa chữa`} navigation={navigation} />

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            height: hp('8%'),
            flexDirection: 'row',
          }}>
          {approveArr.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setIndexPicker(index);
                }}
                key={index}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: Dimension.setHeight(2.2),
                  paddingBottom: Dimension.setHeight(1.5),
                  paddingHorizontal: Dimension.setWidth(3),
                  height: '100%',
                  borderBottomWidth: indexPicker === index ? 1.6 : null,
                  borderBlockColor: indexPicker === index ? item.color : null,
                }}>
                <Image
                  source={item.icon}
                  style={{
                    height: 25,
                    width: 25,
                    tintColor: indexPicker === index ? item.color : item.color,
                  }}
                />
                <Text
                  style={{
                    fontFamily: Fonts.SF_MEDIUM,
                    fontSize: Dimension.fontSize(16),
                    opacity: 0.8,
                    color: indexPicker === index ? item.color : '#041d3b',
                  }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {loading ? (
          <InternalSkeleton />
        ) : (
          <FlatList
            style={{
              flex: 1,
              paddingTop: Dimension.setHeight(2),
            }}
            showsVerticalScrollIndicator={false}
            data={handlePickOption(indexPicker)}
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

        <Modal
          isVisible={toggleModal}
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
              backgroundColor: '#def8ed',
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
                  fontSize: Dimension.fontSize(20),
                  color: '#57b85d',
                }}>
                Xác nhận
              </Text>
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: Dimension.setHeight(1.5),
                paddingHorizontal: Dimension.setWidth(3),
                width: '100%',
              }}>
              <Image source={Images.item} style={{height: 55, width: 55}} />
              <Text
                style={{
                  marginLeft: Dimension.setWidth(3),
                  fontSize: Dimension.fontSize(17),
                  fontFamily: Fonts.SF_MEDIUM,
                  textAlign: 'center',
                  ...fontDefault,
                }}>
                {`Xác nhận đã ${selectedItem?.noidung} của ${selectedItem?.nguoidenghi}?`}
              </Text>
            </View>

            <View
              style={[
                styles.containerEachLine,
                {
                  width: Dimension.setWidth(56),
                  justifyContent: 'space-between',
                },
              ]}>
              <TouchableOpacity
                onPress={handleUpdateProcessed}
                style={[styles.confirmBtn, {borderColor: '#57b85d'}]}>
                <Text style={[styles.textConfirm, {color: '#57b85d'}]}>
                  Xác nhận
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setToggleModal(false);
                }}
                style={[styles.confirmBtn, {borderColor: '#f0b263'}]}>
                <Text style={[styles.textConfirm, {color: '#f0b263'}]}>
                  Hủy bỏ
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                setToggleModal(false);
              }}
              style={{position: 'absolute', right: '5%', top: '5%'}}>
              <Image source={Images.minusclose} style={styles.btnModal} />
            </TouchableOpacity>
          </View>
        </Modal>
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
    width: 36,
    height: 36,
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
  confirmBtn: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f25157',
    paddingVertical: Dimension.setHeight(0.5),
    paddingHorizontal: Dimension.setWidth(2),
    width: Dimension.setWidth(25),
  },
  textConfirm: {
    fontSize: Dimension.fontSize(16),
    fontFamily: Fonts.SF_MEDIUM,
  },
});

export default HistoryRepair;
