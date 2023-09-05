import React from 'react';
import {View, Text, Image} from 'react-native';
import Fonts from '../contants/Fonts';
import Dimension from '../contants/Dimension';

const StatusUI = ({status, colorStatus, bgColorStatus, icon}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Dimension.setHeight(0.6),
        paddingHorizontal: Dimension.setWidth(1.5),
        borderRadius: 8,
        backgroundColor: bgColorStatus,
        zIndex: 999,
      }}>
      <Image
        source={icon}
        style={{
          height: 16,
          width: 16,
          marginRight: Dimension.setWidth(1),
          tintColor: colorStatus,
        }}
      />
      <Text
        style={{
          color: colorStatus,
          fontSize: Dimension.fontSize(14),
          fontFamily: Fonts.SF_MEDIUM,
        }}>
        {status}
      </Text>
    </View>
  );
};

export default StatusUI;
