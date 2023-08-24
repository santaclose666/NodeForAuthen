import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import {Switch, VStack} from 'native-base';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import {loginUser} from '../../redux/apiRequest';
import {useDispatch} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ToastAlert} from '../../components/Toast';
import {shadowIOS} from '../../contants/propsIOS';
import {defaultXMG, mainURL} from '../../contants/Variable';

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkShowHide, setCheckShowHide] = useState(true);
  const [save, setSave] = useState(true);

  const handleLogin = () => {
    if (email !== '' && password !== '') {
      const data = {email, password};
      loginUser(data, dispatch, navigation);
    } else {
      const mess = 'Vui lòng nhập đầy đủ thông tin!';
      ToastAlert(mess);
    }
  };

  return (
    <KeyboardAwareScrollView
      enableAutomaticScroll={true}
      enableResetScrollToCoords={true}
      enableOnAndroid={true}
      behavior="padding"
      style={{flex: 1, backgroundColor: '#ffffff'}}>
      <View style={styles.themeContainer}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}>
          <Image source={Images.back} style={{width: 20, height: 20}} />
        </TouchableOpacity>
        <Image
          source={Images.logo}
          resizeMode="cover"
          style={{
            width: Dimensions.get('screen').width / 1.5,
            height: Dimensions.get('screen').width / 1.5,
            borderRadius: 150,
          }}
        />
      </View>
      <View style={styles.loginFormContainer}>
        <Text
          style={{
            fontFamily: Fonts.SF_SEMIBOLD,
            fontSize: 25,
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
                  source={checkShowHide === true ? Images.eye : Images.noEye}
                  style={{width: 22, height: 22}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <VStack space={4}>
          <Switch size={'sm'} defaultIsChecked colorScheme="emerald" />
        </VStack>
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: Dimension.setHeight(2),
            borderColor: Colors.INACTIVE_GREY,
            backgroundColor: 'rgba(120, 255,100, 1)',
            borderRadius: 10,
            paddingVertical: Dimension.setHeight(1.6),
            elevation: 5,
            ...shadowIOS,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: Fonts.SF_BOLD,
              color: '#333',
            }}>
            Truy cập
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },

  themeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Dimension.setHeight(4),
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
    backgroundColor: 'rgba(120, 255,100, 1)',
    borderRadius: 12,
    elevation: 6,
    ...shadowIOS,
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginTop: Dimension.setHeight(2),
  },
});

export default LoginScreen;
