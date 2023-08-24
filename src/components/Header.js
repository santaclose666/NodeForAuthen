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
import Colors from '../contants/Colors';

const Header = ({title, eventFunc, navigation, refreshData}) => {
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
        backgroundColor: '#e4edfdff',
      }}>
      <StatusBar
        translucent
        // backgroundColor="#22a87e"
        barStyle="light-content"
      />
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={Images.back}
          style={{width: 25, height: 25, tintColor: Colors.DEFAULT_BLACK}}
        />
      </TouchableOpacity>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text
          style={{
            fontFamily: Fonts.SF_MEDIUM,
            fontSize: 18,
            opacity: 0.8,
            color: '#041d3b',
          }}>
          {title}
        </Text>
      </View>
      {showCreateButton ? (
        <TouchableOpacity
          onPress={() => {
            if (title === 'Lịch sử nghỉ phép') {
              navigation.navigate('RegisterApplyLeave', {
                refreshData: refreshData,
              });
            } else if (title === 'Lịch sử đặt vé') {
              navigation.navigate('RegisterPlaneTicket', {
                refreshData: refreshData,
              });
            } else if (title === 'Lịch sử công tác') {
              navigation.navigate('CreateWorkSchedule', {
                refreshData: refreshData,
              });
            } else if (title === 'Lịch sử đăng kí xe') {
              navigation.navigate('RegisterVehicle', {
                refreshData: refreshData,
              });
            }
          }}>
          <Image source={Images.adjust} style={{width: 30, height: 30}} />
        </TouchableOpacity>
      ) : (
        <View style={{width: 30}} />
      )}
    </SafeAreaView>
  );
};

export default Header;
