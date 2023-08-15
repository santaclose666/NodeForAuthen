import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {AlertDialog, Button} from 'native-base';
import {useSelector} from 'react-redux';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import ListInfo from '../../components/ListInfo';
import {useDispatch} from 'react-redux';
import {logoutUser} from '../../redux/apiRequest';

const DetailStaffScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const item = route.params?.item;
  const user = useSelector(state => state.auth.login?.currentUser);
  const [userInfo, setUserInfo] = useState(null);
  const [workInfo, setWorkInfo] = useState({
    avatar: Images.avatar,
    fullName: item?.name,
    email: item?.email,
    role: item?.quyentruycap,
    position: item?.chucdanh,
    phone: null,
    hr: item?.id_bomon,
    birthday: item?.namsinh,
  });
  const [infoScreen, setInfoScreen] = useState(['User', 'IFEE']);
  const [indexInfo, setIndexInfo] = useState(0);
  const bgColor = indexInfo === 0 ? '#ffffff' : 'rgba(133, 229, 211, 0.8)';
  const [toggleConfirmOut, setTogglecConfirmOut] = useState(false);
  const cancelRef = useRef(null);

  const handleLogout = () => {
    onCloseConfirmOut();
    logoutUser(dispatch, navigation);
  };

  const handleCheck = () => {
    if (user) {
      setUserInfo({
        avatar: Images.avatar,
        fullName: user?.name,
        role: user?.quyentruycap,
        userName: user?.username,
        position: user?.chucdanh,
        email: user?.email,
        phone: user?.phone,
        hr: user?.id_bomon,
        birthday: user?.namsinh,
      });
    }

    item ? setIndexInfo(1) : setIndexInfo(0);
  };

  const onCloseConfirmOut = () => {
    setTogglecConfirmOut(false);
  };

  useEffect(() => {
    handleCheck();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: bgColor,
        justifyContent: 'center',
      }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      {item || user ? (
        <>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => {
                {
                  indexInfo === 0
                    ? navigation.navigate('HomePage')
                    : navigation.navigate('StaffList');
                }
              }}>
              <Image source={Images.back} style={{width: 25, height: 25}} />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: Fonts.SF_BOLD,
                fontSize: 22,
              }}>
              Thông tin
            </Text>
            <TouchableOpacity
              onPress={() => {
                setTogglecConfirmOut(true);
              }}>
              {indexInfo === 0 && (
                <Image source={Images.logout} style={{width: 35, height: 35}} />
              )}
            </TouchableOpacity>
            <AlertDialog
              leastDestructiveRef={cancelRef}
              isOpen={toggleConfirmOut}
              onClose={onCloseConfirmOut}>
              <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>
                  <Text style={{fontSize: 20, fontFamily: Fonts.SF_BOLD}}>
                    Đăng Xuất
                  </Text>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <Text style={{fontSize: 16, fontFamily: Fonts.SF_REGULAR}}>
                    Xác nhận đăng xuất tài khoản này?
                  </Text>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="unstyled"
                      colorScheme="coolGray"
                      onPress={onCloseConfirmOut}
                      ref={cancelRef}>
                      <Text
                        style={{fontSize: 15, fontFamily: Fonts.SF_REGULAR}}>
                        Hủy
                      </Text>
                    </Button>
                    <Button colorScheme="danger" onPress={handleLogout}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: Fonts.SF_REGULAR,
                          color: '#ffffff',
                        }}>
                        Xác nhận
                      </Text>
                    </Button>
                  </Button.Group>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog>
          </View>
          {/* <View style={styles.optionInfoContainer}>
        {infoScreen.map((item, index) => {
          const bdColor =
            indexInfo === index ? '#16202c' : 'rgba(255, 255, 255, 0)';
          const textColor =
            indexInfo === index ? '#ffffff' : Colors.INACTIVE_GREY;
          const checkIndex =
            indexInfo === 0 ? {marginLeft: 6} : {marginRight: -6};
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setIndexInfo(index)}
              style={{
                width: '50%',
                height: '100%',
                backgroundColor: bdColor,
                borderRadius: 32,
                alignItems: 'center',
                justifyContent: 'center',
                height: '80%',
                ...checkIndex,
              }}>
              <Text
                style={{
                  color: textColor,
                  fontFamily: Fonts.SF_BLACK,
                  fontSize: 17,
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View> */}
          <View style={{flex: 1}}>
            <ListInfo
              info={indexInfo === 0 ? userInfo : workInfo}
              index={indexInfo}
            />
          </View>
        </>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
          }}
          style={{
            borderRadius: 16,
            backgroundColor: '#6ac78c',
            alignSelf: 'center',
            elevation: 6,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.SF_BOLD,
              color: '#ffffff',
              paddingHorizontal: Dimension.setWidth(3),
              paddingVertical: Dimension.setHeight(1.2),
            }}>
            Đăng nhập
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Dimension.setWidth(3),
    marginTop: Dimension.setHeight(1.5),
  },

  optionInfoContainer: {
    borderRadius: 32,
    height: Dimension.setHeight(6.5),
    marginTop: Dimension.setHeight(4),
    marginHorizontal: Dimension.setWidth(6),
    flexDirection: 'row',
    backgroundColor: '#e1e9ea',
    alignItems: 'center',
  },
});

export default DetailStaffScreen;