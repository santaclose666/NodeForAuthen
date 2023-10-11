import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
  StyleSheet,
} from 'react-native';
import Images from '../contants/Images';
import Fonts from '../contants/Fonts';
import Dimension from '../contants/Dimension';
import Colors from '../contants/Colors';
import {fontDefault, imgDefault} from '../contants/Variable';
import {screen} from '../screens/AllScreen/allScreen';

const Header = ({
  title,
  navigation,
  refreshData,
  logo,
  replace = false,
  handleFilter,
}) => {
  const showCreateButton = title.includes('Lịch sử');

  const showFitlerButon =
    title === 'Định mức Kinh tế Kĩ thuật' ||
    title === 'Quỹ bảo vệ phát triển rừng' ||
    title === 'Khung giá rừng' ||
    title === 'Ngành Lâm học' ||
    title === 'Kiểm kê rừng' ||
    title === 'Quản lý rừng bền vững' ||
    title === 'Tiêu chuẩn Việt Nam' ||
    title === 'Giống Lâm nghiệp' ||
    title === 'Văn phòng 809' ||
    title.includes('VQG');

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Dimension.setHeight(1.6),
        paddingHorizontal: Dimension.setWidth(2),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginHorizontal: Dimension.setHeight(1.4),
        borderRadius: 25,
        marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
        height: Dimension.setHeight(7),
      }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      {title == 'Thông báo' ? (
        <View style={{width: 25, height: 25}}></View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            replace == true ? navigation.navigate('Home') : navigation.goBack();
          }}>
          <Image
            source={Images.back}
            style={{width: 23, height: 23, ...imgDefault}}
          />
        </TouchableOpacity>
      )}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {logo && (
          <View
            style={{
              borderWidth: 1,
              borderColor: Colors.DEFAULT_GREEN,
              padding: 1,
              borderRadius: 50,
              marginRight: 5,
            }}>
            <Image
              src={logo}
              style={{
                width: Dimension.boxHeight(25),
                height: Dimension.boxHeight(25),
                borderRadius: 50,
              }}
            />
          </View>
        )}
        <Text
          style={{
            fontFamily: Fonts.SF_BOLD,
            fontSize: Dimension.fontSize(18),
            ...fontDefault,
          }}>
          {title}
        </Text>
      </View>
      {showCreateButton && (
        <TouchableOpacity
          onPress={() => {
            if (title === 'Lịch sử nghỉ phép') {
              navigation.navigate(screen.registerApplyLeave, {
                refreshData: refreshData,
              });
            } else if (title === 'Lịch sử đặt vé') {
              navigation.navigate(screen.registerPlaneTicket, {
                refreshData: refreshData,
              });
            } else if (title === 'Lịch sử công tác') {
              navigation.navigate(screen.registerWorkSchedule, {
                refreshData: refreshData,
              });
            } else if (title === 'Lịch sử đăng kí xe') {
              navigation.navigate(screen.registerVehicle, {
                refreshData: refreshData,
              });
            } else if (title === 'Lịch sử đăng kí VPP') {
              navigation.navigate(screen.registerOfficeItem);
            } else if (title == 'Lịch sử đăng kí thiết bị') {
              navigation.navigate(screen.registerDevice);
            }
          }}>
          <Image source={Images.adjust} style={styles.rightIcon} />
        </TouchableOpacity>
      )}
      {showFitlerButon ? (
        <TouchableOpacity onPress={handleFilter}>
          <Image
            source={Images.filter}
            style={{width: 23, height: 23, ...imgDefault}}
          />
        </TouchableOpacity>
      ) : (
        <View style={{width: 6}} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rightIcon: {
    width: Dimension.boxHeight(26),
    height: Dimension.boxHeight(26),
    ...imgDefault,
  },
});

export default Header;
