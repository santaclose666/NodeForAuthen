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
import {fontDefault, imgDefault} from '../contants/Variable';

const Header = ({
  title,
  navigation,
  refreshData,
  replace = false,
  handleFilter,
}) => {
  const showCreateButton =
    title === 'Lịch sử nghỉ phép' ||
    title === 'Lịch sử đặt vé' ||
    title === 'Lịch sử công tác' ||
    title === 'Lịch sử đăng kí xe';

  const showFitlerButon =
    title === 'Định mức Kinh tế Kĩ thuật' ||
    title === 'Dịch vụ môi trường rừng' ||
    title === 'Khung giá rừng' ||
    title === 'Ngành Lâm học' ||
    title === 'Kiểm kê rừng' ||
    title === 'Tài liệu Mùa vụ' ||
    title === 'Quản lý rừng bền vững' ||
    title === 'Tiêu chuẩn Việt Nam' ||
    title === 'Giống Lâm nghiệp' ||
    title === 'Văn phòng 809' ||
    title.includes('Động thực vật');

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
      <View style={{flex: 1, alignItems: 'center'}}>
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
          <Image source={Images.adjust} style={styles.rightIcon} />
        </TouchableOpacity>
      )}
      {showFitlerButon && (
        <TouchableOpacity onPress={handleFilter}>
          <Image
            source={Images.filter}
            style={{width: 23, height: 23, ...imgDefault}}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rightIcon: {
    width: 25,
    height: 25,
    ...imgDefault,
  },
});

export default Header;
