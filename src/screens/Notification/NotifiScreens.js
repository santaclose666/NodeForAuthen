import React, {useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradientUI from '../../components/LinearGradientUI';
import Header from '../../components/Header';
import {getAllNotifi} from '../../redux/apiRequest';
import Loading from '../../components/LoadingUI';
import {mainURL, fontDefault} from '../../contants/Variable';
import {DisplayNotificationModal} from '../../components/Modal';
import Images from '../../contants/Images';
import {changeFormatDate} from '../../utils/serviceFunction';
import Separation from '../../components/Separation';

const NotifiScreen = ({navigation, route}) => {
  const receiveNotifi = route.params?.notifi;
  const user = useSelector(state => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const allNotifi = useSelector(state => state.notifi.notifications?.allNotifi);
  const notifiMenu = ['Nội bộ', 'Sự kiện', 'Sinh nhật'];
  const [notifiMenuId, setNotifiMenuId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toggleNotifiModal, setToggleNotifiModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handlePickItem = notifi => {
    setSelectedItem(notifi);

    if (notifi.type == 'sinhnhat') {
      const item = notifi.user_sn;
      navigation.navigate('HappyBirthday', {item: item});
    } else {
      setToggleNotifiModal(true);
    }
  };

  const handleFilterNotifi = () => {
    if (user) {
      switch (notifiMenuId) {
        case 0:
          return allNotifi?.noibo;
        case 1:
          return allNotifi?.sukien;
        case 2:
          return allNotifi?.sinhnhat;
      }
    } else {
      return allNotifi?.sukien;
    }
  };

  const fetchAllNotifi = async () => {
    setLoading(true);
    try {
      const idUser = user ? user?.id_ht : null;
      await getAllNotifi(idUser, dispatch);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    fetchAllNotifi();

    if (receiveNotifi) {
      setSelectedItem(receiveNotifi);

      setToggleNotifiModal(true);
    }
  }, []);

  return (
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header title="Thông báo" navigation={navigation} replace={true} />
        {user && (
          <View style={styles.notifiItemContainer}>
            <FlatList
              data={notifiMenu}
              keyExtractor={(_, index) => index}
              horizontal={true}
              renderItem={({item, index}) => {
                const colorBorder =
                  notifiMenuId === index ? Colors.DEFAULT_GREEN : Colors.WHITE;
                const bdWidth = notifiMenuId === index ? 2 : 0;
                return (
                  <View
                    key={index}
                    style={{
                      marginLeft: Dimension.setWidth(4.4),
                      borderBottomWidth: bdWidth,
                      borderColor: colorBorder,
                      marginBottom: 0,
                      flex: 1,
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity onPress={() => setNotifiMenuId(index)}>
                      <Text
                        style={{
                          fontFamily:
                            notifiMenuId === index
                              ? Fonts.SF_SEMIBOLD
                              : Fonts.SF_REGULAR,
                          fontSize: Dimension.fontSize(16),
                          opacity: 0.8,
                          color:
                            notifiMenuId === index
                              ? Colors.DEFAULT_GREEN
                              : Colors.DEFAULT_BLACK,
                        }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        )}
        <FlatList
          data={handleFilterNotifi()}
          keyExtractor={(_, index) => index}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          windowSize={6}
          removeClippedSubviews={true}
          refreshing={true}
          renderItem={({item, index}) => {
            const filterTime = item?.giotao.slice(0, 5);
            const halfDay = item?.giotao.slice(0, 2) > 12 ? 'PM' : 'AM';
            const avt =
              item?.type != 'sinhnhat' ? item?.avatar : item?.user_sn.path;

            return (
              <TouchableOpacity
                onPress={() => {
                  handlePickItem(item);
                }}
                key={index}
                style={styles.notifiContainer}>
                <View style={{width: '77%'}}>
                  <View
                    style={{
                      width: Dimension.setWidth(55),
                      marginBottom: Dimension.setHeight(0.5),
                    }}>
                    <Text numberOfLines={2} style={styles.obj1}>
                      {item?.noidung}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: Dimension.setWidth(66),
                    }}>
                    {!item?.nguoigui.includes('Forestry 4.0') && (
                      <>
                        <Text
                          style={{
                            color: '#1b2061',
                            fontFamily: Fonts.SF_REGULAR,
                            fontSize: Dimension.fontSize(15),
                          }}>
                          {item?.nguoigui}
                        </Text>
                        <Image
                          source={Images.dot}
                          style={{
                            width: 8,
                            height: 8,
                            marginHorizontal: Dimension.setWidth(0.6),
                            tintColor: Colors.INACTIVE_GREY,
                          }}
                        />
                      </>
                    )}
                    <Text
                      style={styles.time}>{`${filterTime} ${halfDay}`}</Text>

                    <Separation />
                    <Text style={styles.time}>
                      {`${changeFormatDate(item?.ngaytao)} `}
                    </Text>
                  </View>
                </View>
                <View>
                  <Image src={mainURL + avt} style={styles.notifiImg} />
                </View>
              </TouchableOpacity>
            );
          }}
        />
        <DisplayNotificationModal
          toggleModal={toggleNotifiModal}
          setToggleModal={setToggleNotifiModal}
          item={selectedItem}
        />
        {loading === true && <Loading />}
      </SafeAreaView>
    </LinearGradientUI>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
  },

  notifiMenuContainer: {
    marginTop: Dimension.setHeight(3),
    marginLeft: Dimension.setWidth(3.3),
    marginBottom: Dimension.setHeight(0.5),
  },

  notifiItemContainer: {
    marginHorizontal: Dimension.setWidth(3.6),
    marginTop: Dimension.setHeight(1.6),
  },

  notifiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Dimension.setHeight(1),
    marginBottom: Dimension.setHeight(2),
    marginHorizontal: Dimension.setWidth(3),
    paddingHorizontal: Dimension.setWidth(4),
    alignSelf: 'center',
  },

  notifiImg: {
    width: Dimension.fontSize(50),
    height: Dimension.fontSize(50),
    borderRadius: 50,
  },

  textContainer: {
    width: Dimension.setWidth(68),
  },

  obj1: {
    color: '#3a5072',
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: Dimension.fontSize(18),
  },

  time: {
    color: '#636363ff',
    fontFamily: Fonts.SF_REGULAR,
    fontSize: Dimension.fontSize(15),
  },
});

export default NotifiScreen;
