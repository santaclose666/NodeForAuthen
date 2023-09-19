import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {AlertDialog, Button} from 'native-base';
import {useSelector} from 'react-redux';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Dimension from '../../contants/Dimension';
import ListInfo from '../../components/ListInfo';
import {useDispatch} from 'react-redux';
import {logoutUser} from '../../redux/apiRequest';
import {changeFormatDate} from '../../utils/serviceFunction';
import {mainURL, imgDefault, fontDefault} from '../../contants/Variable';
import LinearGradientUI from '../../components/LinearGradientUI';

const DetailStaffScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const item = route.params?.item;
  const user = useSelector(state => state.auth.login?.currentUser);
  const [userInfo, setUserInfo] = useState(null);
  const [workInfo, setWorkInfo] = useState({
    avatar: mainURL + item?.path,
    fullName: item?.hoten,
    email: item?.email,
    role: item?.quyentruycap,
    position: item?.chucdanh,
    phone: item?.sdt,
    hr: item?.tenphong,
    birthday: changeFormatDate(item?.ngaysinh),
  });
  const [indexInfo, setIndexInfo] = useState(0);
  const [toggleConfirmOut, setTogglecConfirmOut] = useState(false);
  const cancelRef = useRef(null);

  const handleLogout = () => {
    onCloseConfirmOut();
    logoutUser(dispatch, navigation, user);
  };

  const handleCheck = () => {
    if (user) {
      setUserInfo({
        avatar: mainURL + user?.path,
        fullName: user?.hoten,
        role: user?.quyentruycap,
        userName: user?.username,
        position: user?.chucdanh,
        email: user?.email,
        phone: user?.sdt,
        hr: user?.tenphong,
        birthday: changeFormatDate(user?.ngaysinh),
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
    <LinearGradientUI>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
        }}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              {
                indexInfo === 0 ? navigation.goBack() : navigation.goBack();
              }
            }}>
            <Image
              source={Images.back}
              style={{width: 25, height: 18, ...imgDefault}}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: Fonts.SF_BOLD,
              fontSize: Dimension.fontSize(18),
              ...fontDefault,
            }}>
            Thông tin
          </Text>
          <TouchableOpacity
            onPress={() => {
              setTogglecConfirmOut(true);
            }}
            style={{width: 24}}>
            {indexInfo === 0 && (
              <Image
                source={Images.logout}
                style={{width: 24, height: 24, ...imgDefault}}
              />
            )}
          </TouchableOpacity>
          <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={toggleConfirmOut}
            onClose={onCloseConfirmOut}>
            <AlertDialog.Content>
              <AlertDialog.CloseButton />
              <AlertDialog.Header>
                <Text
                  style={{
                    fontSize: Dimension.fontSize(20),
                    fontFamily: Fonts.SF_BOLD,
                  }}>
                  Đăng Xuất
                </Text>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <Text
                  style={{
                    fontSize: Dimension.fontSize(16),
                    fontFamily: Fonts.SF_REGULAR,
                  }}>
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
                      style={{
                        fontSize: Dimension.fontSize(15),
                        fontFamily: Fonts.SF_REGULAR,
                      }}>
                      Hủy
                    </Text>
                  </Button>
                  <Button colorScheme="danger" onPress={handleLogout}>
                    <Text
                      style={{
                        fontSize: Dimension.fontSize(15),
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

        <View style={{flex: 1}}>
          <ListInfo
            info={indexInfo === 0 ? userInfo : workInfo}
            index={indexInfo}
          />
        </View>
      </View>
    </LinearGradientUI>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Dimension.setHeight(2),
    paddingHorizontal: Dimension.setWidth(2.2),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: Dimension.setHeight(1.4),
    borderRadius: 25,
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
