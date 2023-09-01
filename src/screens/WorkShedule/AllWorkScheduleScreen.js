import React, {useState, useCallback, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Dimension from '../../contants/Dimension';
import Header from '../../components/Header';
import {shadowIOS} from '../../contants/propsIOS';
import {totalWorkSchedule, warningWorkSchedule} from '../../redux/apiRequest';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {
  formatDateToPost,
  getFirstDateOfWeek,
} from '../../utils/serviceFunction';
import {WarningModal} from '../../components/Modal';
import {Agenda} from 'react-native-calendars';
import Loading from '../../components/LoadingUI';
import {defaultIFEE, fontDefault, mainURL} from '../../contants/Variable';
import LinearGradient from 'react-native-linear-gradient';

const AllWorkScheduleScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const totalWorkData = useSelector(
    state => state.totalWork.totalWorkSchedule?.data,
  );
  const dayOfWeek = getFirstDateOfWeek();
  const currentDate = formatDateToPost(new Date());
  const IFEEstaffs = useSelector(state => state.staffs?.staffs?.IFEEStaff);
  const [toggleWarningModal, setToggleWarningModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reasonInput, setReasonInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePickItem = useCallback(item => {
    setSelectedItem(item);
    setToggleWarningModal(true);
  }, []);

  const handleWarning = useCallback(async (id, reason) => {
    try {
      setToggleWarningModal(false);
      setLoading(true);
      const data = {
        id_lichchitiet: id,
        lydo: reason,
      };

      const res = await warningWorkSchedule(data);

      if (res) {
        setLoading(false);
        setTimeout(() => {
          fetTotalWorkSchedule();
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetTotalWorkSchedule = async () => {
    totalWorkSchedule(dispatch);
  };

  useLayoutEffect(() => {
    fetTotalWorkSchedule();
  }, []);

  const RenderTaskOfDay = useCallback(item => {
    const borderColorStatus =
      item.ct == 1
        ? '#f0b263'
        : item.content === 'Nghỉ phép'
        ? '#f25157'
        : '#57b85d';

    const filterUser = IFEEstaffs.filter(staff => staff.id == item.id_user)[0];
    const bgColor = item.warning === 0 ? '#f2f2f2' : 'rgba(249, 223, 224, 1)';

    const checkRole = () => {
      return (
        item.warning == 0 &&
        (user?.vitri_ifee == 1 ||
          (user?.vitri_ifee == 3 &&
            filterUser?.vitri_ifee > 3 &&
            user?.tenphong == filterUser?.tenphong))
      );
    };

    const avt = filterUser?.path ? filterUser?.path : defaultIFEE;

    return (
      <View
        key={item.id}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-end',
          paddingHorizontal: Dimension.setWidth(4),
          paddingVertical: Dimension.setHeight(2),
          marginVertical: Dimension.setHeight(1.2),
          marginRight: Dimension.setWidth(4),
          borderRadius: 12,
          elevation: 5,
          ...shadowIOS,
          borderTopWidth: 7,
          borderTopColor: borderColorStatus,
          backgroundColor: bgColor,
          width: '96%',
        }}>
        <View
          style={{
            width: '66%',
            marginRight: Dimension.setWidth(5),
          }}>
          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Họ tên: </Text>
            <Text style={styles.content}>{item.name}</Text>
          </View>
          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Địa điểm: </Text>
            <Text style={styles.content}>{item.location}</Text>
          </View>
          <View style={styles.containerEachLine}>
            <Text numberOfLines={3} ellipsizeMode="tail" style={styles.title}>
              Nội dung: <Text style={styles.content}>{item.content}</Text>
            </Text>
          </View>
        </View>
        <View style={styles.avatarUserContainer}>
          <Image
            style={{width: 66, height: 66, borderRadius: 50}}
            src={mainURL + avt}
          />
        </View>
        {checkRole() && (
          <TouchableOpacity
            onPress={() => {
              const data = {
                ...item,
                path: filterUser?.path,
              };
              handlePickItem(data);
            }}
            style={{
              position: 'absolute',
              top: Dimension.setHeight(0.8),
              right: Dimension.setWidth(2.2),
            }}>
            <Image source={Images.warning} style={styles.iconic} />
          </TouchableOpacity>
        )}
      </View>
    );
  }, []);

  return (
    <LinearGradient
      colors={['rgba(153,255,153,0.9)', 'rgba(255,204,204,0.8)']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Header title={'Tổng hợp lịch công tác'} navigation={navigation} />
        <Agenda
          items={totalWorkData}
          selected={currentDate}
          minDate={dayOfWeek.firstDay}
          maxDate={dayOfWeek.lastDay}
          renderItem={RenderTaskOfDay}
          rowHasChanged={(r1, r2) => {
            return r1.id !== r2.id;
          }}
          showClosingKnob={true}
          pastScrollRange={1}
          futureScrollRange={1}
          initialNumToRender={6}
          windowSize={6}
          removeClippedSubviews={true}
          style={{backgroundColor: 'transparent'}}
          theme={{reservationsBackgroundColor: 'transparent'}}
          onRefresh={fetTotalWorkSchedule}
          extraData={totalWorkData}
        />

        <WarningModal
          toggleModal={toggleWarningModal}
          setToggleModal={setToggleWarningModal}
          item={selectedItem}
          reasonInput={reasonInput}
          setReasonInput={setReasonInput}
          handleWarning={handleWarning}
        />

        {loading && <Loading />}
      </SafeAreaView>
    </LinearGradient>
  );
};

styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerEachLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  iconic: {
    width: 25,
    height: 25,
  },

  title: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: 15,
  },

  content: {
    fontFamily: Fonts.SF_REGULAR,
    fontSize: 16,
    textAlign: 'justify',
    ...fontDefault,
  },

  avatarUserContainer: {
    borderWidth: 1,
    borderRadius: 50,
    padding: 1,
    borderColor: '#268fbe',
  },
});

export default AllWorkScheduleScreen;
