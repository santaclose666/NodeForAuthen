import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Images from '../contants/Images';
import Fonts from '../contants/Fonts';
import Dimension from '../contants/Dimension';

export default RoleStatusUI = ({
  item,
  checkStatus,
  checkRole,
  handleNonAdjust,
  handleApproveAdjust,
  handleToggleCancel,
}) => {
  return (
    <View style={{position: 'absolute', right: '5%', top: '7%'}}>
      {checkStatus() && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            paddingVertical: Dimension.setHeight(0.5),
            paddingHorizontal: Dimension.setWidth(1.4),
            borderRadius: 8,
            backgroundColor:
              item.yc_update === 0 ? bgColorStatus : bgColorAdjustStatus,
          }}>
          <Image
            source={item.yc_update === 0 ? icon : iconAdjust}
            style={{
              height: 16,
              width: 16,
              marginRight: Dimension.setWidth(1),
              tintColor: item.yc_update === 0 ? colorStatus : colorAdjustStatus,
            }}
          />
          <Text
            style={{
              color: item.yc_update === 0 ? colorStatus : colorAdjustStatus,
              fontSize: 14,
              fontFamily: Fonts.SF_MEDIUM,
            }}>
            {item.yc_update === 0 ? status : adjustStatus}
          </Text>
        </View>
      )}
      {checkRole() && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: Dimension.setWidth(17),
            alignSelf: 'center',
            zIndex: 9999,
          }}>
          <TouchableOpacity
            onPress={() => {
              item.yc_update === 0
                ? handleNonAdjust(true, item)
                : handleApproveAdjust(item.id);
            }}>
            <Image
              source={Images.approved}
              style={[styles.approvedIcon, {tintColor: '#57b85d'}]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              item.yc_update === 0
                ? handleNonAdjust(false, item)
                : handleToggleCancel(item);
            }}>
            <Image
              source={Images.cancelled}
              style={[styles.approvedIcon, {tintColor: '#f25157'}]}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  approvedIcon: {
    width: 30,
    height: 30,
  },
});
