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
import {fontDefault, imgDefault} from '../contants/Variable';

const Header = ({title, navigation, refreshData, replace = false}) => {
  const showCreateButton =
    title === 'Lịch sử nghỉ phép' ||
    title === 'Lịch sử đặt vé' ||
    title === 'Lịch sử công tác' ||
    title === 'Lịch sử đăng kí xe';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Dimension.setHeight(2),
        paddingHorizontal: Dimension.setWidth(2),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginHorizontal: Dimension.setHeight(1.4),
        borderRadius: 25,
        marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
      }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <TouchableOpacity
        onPress={() => {
          replace == true ? navigation.navigate('Home') : navigation.goBack();
        }}>
        <Image
          source={Images.back}
          style={{width: 25, height: 18, ...imgDefault}}
        />
      </TouchableOpacity>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text
          style={{
            fontFamily: Fonts.SF_BOLD,
            fontSize: 18,
            ...fontDefault,
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
          <Image
            source={Images.adjust}
            style={{width: 30, height: 30, ...imgDefault}}
          />
        </TouchableOpacity>
      ) : (
        <View style={{width: 30}} />
      )}
    </View>
  );
};

export default Header;
