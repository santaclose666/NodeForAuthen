import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {Switch} from 'native-base';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import {loginUser} from '../../redux/apiRequest';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ToastAlert} from '../../components/Toast';
import {shadowIOS} from '../../contants/propsIOS';
import {fontDefault} from '../../contants/Variable';
import Loading from '../../components/LoadingUI';

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const credential = useSelector(
    state => state.credential.credential?.emailPwd,
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkShowHide, setCheckShowHide] = useState(true);
  const [save, setSave] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (email !== '' && password !== '') {
      const data = {email, password};

      setLoading(true);
      try {
        const res = await loginUser(data, dispatch, navigation, save);

        if (res) {
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const mess = 'Vui lòng nhập đầy đủ thông tin!';
      ToastAlert(mess);
    }
  };

  useLayoutEffect(() => {
    if (credential) {
      setEmail(credential.email);
      setPassword(credential.password);
    }
  }, []);

  return (
    <SafeAreaView style={{flex: 1, padding: 3}}>
      <KeyboardAwareScrollView
        enableAutomaticScroll={true}
        enableResetScrollToCoords={true}
        enableOnAndroid={true}
        behavior="padding"
        style={{flex: 1, backgroundColor: '#f2f2f2'}}>
        <View style={styles.themeContainer}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.goBack()}>
            <Image
              source={Images.back}
              style={{width: 18, height: 18, tintColor: '#fff'}}
            />
          </TouchableOpacity>
          <Image
            source={Images.F4_Lunar}
            resizeMode="cover"
            style={{
              width: Dimensions.get('screen').width / 1.8,
              height: Dimensions.get('screen').width / 1.8,
              borderRadius: 30,
            }}
          />
        </View>
        <View style={styles.loginFormContainer}>
          <Text
            style={{
              fontFamily: Fonts.SF_SEMIBOLD,
              fontSize: Dimension.fontSize(25),
              ...fontDefault,
              marginLeft: Dimension.setWidth(2),
              marginBottom: Dimension.setHeight(1),
            }}>
            Đăng nhập
          </Text>
          <View
            style={{
              marginBottom: Dimension.setHeight(2),
              marginTop: Dimension.setHeight(1),
            }}>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.INACTIVE_GREY,
                marginBottom: Dimension.setHeight(0.8),
                width: '95%',
                alignSelf: 'center',
              }}>
              <View style={styles.inputContainer}>
                <Image
                  source={Images.username}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: Colors.DEFAULT_GREEN,
                    marginRight: Dimension.setWidth(2),
                  }}
                />
                <TextInput
                  placeholder="Enter your Email"
                  style={{
                    fontFamily: Fonts.SF_REGULAR,
                    width: '100%',
                    height: Dimension.setHeight(6),
                  }}
                  onChangeText={text => setEmail(text)}
                  value={email}
                />
              </View>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.INACTIVE_GREY,
                width: '95%',
                alignSelf: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginHorizontal: Dimension.setWidth(2),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={Images.lock}
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: Colors.DEFAULT_GREEN,
                      marginRight: Dimension.setWidth(2),
                    }}
                  />
                  <TextInput
                    secureTextEntry={checkShowHide}
                    placeholder="Enter your Password"
                    style={{
                      fontFamily: Fonts.SF_REGULAR,
                      width: '85%',
                      height: Dimension.setHeight(6),
                    }}
                    onChangeText={text => setPassword(text)}
                    value={password}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setCheckShowHide(!checkShowHide);
                  }}>
                  <Image
                    source={checkShowHide === true ? Images.noEye : Images.eye}
                    style={{
                      width: 22,
                      height: 22,
                      tintColor: Colors.DEFAULT_GREEN,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Switch
              size={'sm'}
              colorScheme="emerald"
              isChecked={save}
              onChange={val => setSave(val.nativeEvent.value)}
            />
            <Text style={{fontFamily: Fonts.SF_MEDIUM}}>Lưu thông tin</Text>
          </View>
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: Dimension.setHeight(2),
              borderColor: Colors.INACTIVE_GREY,
              backgroundColor: '#22a87e',
              borderRadius: 10,
              paddingVertical: Dimension.setHeight(1.6),
              elevation: 5,
              ...shadowIOS,
            }}>
            <Text
              style={{
                fontSize: Dimension.fontSize(18),
                fontFamily: Fonts.SF_BOLD,
                color: '#fff',
              }}>
              Truy cập
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      {loading && <Loading bg={true} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  themeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginFormContainer: {
    marginHorizontal: Dimension.setWidth(5),
    marginVertical: Dimension.setHeight(5),
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Dimension.setWidth(2),
  },

  crossPlatformContainer: {
    marginHorizontal: Dimension.setWidth(5),
    marginTop: Dimension.setHeight(1.6),
  },

  space: {
    borderBottomWidth: 1.2,
    borderBottomColor: Colors.INACTIVE_GREY,
    width: '33%',
  },

  iconContainer: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: Colors.INACTIVE_GREY,
    elevation: 4,
    ...shadowIOS,
  },

  viewIconContainer: {
    padding: 14,
  },
  headerBtn: {
    padding: 10,
    backgroundColor: '#22a87e',
    borderRadius: 12,
    elevation: 6,
    ...shadowIOS,
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginVertical: Dimension.setHeight(2),
  },
});

export default LoginScreen;
