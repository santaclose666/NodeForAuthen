import React from 'react';
import {View, Text} from 'react-native';
import Dimension from '../contants/Dimension';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

export const EmptyList = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontSize: Dimension.fontSize(20),
          fontFamily: Fonts.SF_MEDIUM,
          color: Colors.INACTIVE_GREY,
        }}>
        Không có dữ liệu nào được tìm thấy
      </Text>
    </View>
  );
};
