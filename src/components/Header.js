import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Images from '../contants/Images';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import Dimension from '../contants/Dimension';

const Header = ({title, eventFunc, navigation}) => {
  const showCreateButton =
    title === 'Lịch sử nghỉ phép' || title === 'Lịch sử đặt vé';

  return (
    <SafeAreaView
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: Dimension.setWidth(3),
        marginTop: Dimension.setHeight(1.5),
        backgroundColor: 'rgba(254, 254, 254, 0)',
      }}>
      <StatusBar
        backgroundColor="rgba(254, 254, 254, 0)"
        barStyle="dark-content"
      />
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Image source={Images.back} style={{width: 25, height: 25}} />
      </TouchableOpacity>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text
          style={{
            fontFamily: Fonts.SF_BOLD,
            fontSize: 22,
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
