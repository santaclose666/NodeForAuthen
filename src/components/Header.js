import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import Images from '../contants/Images';
import Fonts from '../contants/Fonts';
import Dimension from '../contants/Dimension';

const Header = ({title, eventFunc, navigation}) => {
  const showCreateButton =
    title === 'Lịch sử nghỉ phép' ||
    title === 'Lịch sử đặt vé' ||
    title === 'Lịch sử công tác' ||
    title === 'Lịch sử đăng kí xe';

  return (
    <SafeAreaView
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Dimension.setHeight(2),
        paddingHorizontal: Dimension.setWidth(2),
        backgroundColor: '#22a87e',
      }}>
      <StatusBar
        translucent
        backgroundColor="#22a87e"
        barStyle="light-content"
      />
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={Images.back}
          style={{width: 22, height: 22, tintColor: '#fff'}}
        />
      </TouchableOpacity>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text
          style={{
            fontFamily: Fonts.SF_MEDIUM,
            fontSize: 18,
            color: '#fff',
          }}>
          {title}
        </Text>
      </View>
      {showCreateButton ? (
        <TouchableOpacity
          onPress={() => {
            if (title === 'Lịch sử nghỉ phép') {
              navigation.navigate('RegisterApplyLeave');
            } else if (title === 'Lịch sử đặt vé') {
              navigation.navigate('RegisterPlaneTicket');
            } else if (title === 'Lịch sử công tác') {
              navigation.navigate('CreateWorkSchedule');
            } else if (title === 'Lịch sử đăng kí xe') {
              navigation.navigate('RegisterVehicle');
            }
          }}>
          <Image source={Images.create} style={{width: 30, height: 30}} />
        </TouchableOpacity>
      ) : (
        <View style={{width: 30}} />
      )}
    </SafeAreaView>
  );
};

export default Header;
