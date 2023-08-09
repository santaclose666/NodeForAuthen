import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Toast, Box} from 'native-base';
import Images from '../contants/Images';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import Dimension from '../contants/Dimension';
import {loginUser} from '../redux/apiRequest';
import {useDispatch} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkShowHide, setCheckShowHide] = useState(true);

  const handleLogin = () => {
    if (email !== '' && password !== '') {
      const data = {email, password};
      loginUser(data, dispatch, navigation);
    } else {
      Toast.show({
        render: () => {
          return (
            <Box bg="blue.400" px="2" py="1" rounded="sm" mb={6}>
              <Text style={{fontSize: 17, color: 'white'}}>
                Vui lòng nhập đầy đủ thông tin!
              </Text>
            </Box>
          );
        },
      });
    }
  };

  return (
    <KeyboardAwareScrollView
      behavior="padding"
      style={{flex: 1, backgroundColor: '#ffffff'}}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <View style={styles.themeContainer}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}>
          <Image source={Images.back} style={{width: 20, height: 20}} />
        </TouchableOpacity>
        <Image
          source={Images.loginTheme}
          resizeMode="cover"
          style={{
            width: Dimension.setWidth(90),
            height: Dimension.setHeight(36),
            transform: [{rotate: '-4deg'}],
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
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: Dimension.setHeight(2),
            borderColor: Colors.INACTIVE_GREY,
            backgroundColor: 'rgba(120, 255,100, 1)',
            borderRadius: 10,
            paddingVertical: Dimension.setHeight(1.2),
            elevation: 5,
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
  },

  viewIconContainer: {
    padding: 14,
  },
  headerBtn: {
    padding: 10,
    backgroundColor: 'rgba(120, 255,100, 1)',
    borderRadius: 12,
    elevation: 10,
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginTop: Dimension.setHeight(2),
  },
});

export default LoginScreen;
