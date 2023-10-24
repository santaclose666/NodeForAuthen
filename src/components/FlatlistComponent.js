import React from 'react';
import {View, Text} from 'react-native';
import Dimension from '../contants/Dimension';
import Fonts from '../contants/Fonts';

export const EmptyList = ({text}) => {
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
          color: '#243b55',
        }}>
        {text || 'Không có dữ liệu nào được tìm thấy'}
      </Text>
    </View>
  );
};
