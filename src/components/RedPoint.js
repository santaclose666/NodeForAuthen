import React from 'react';
import {View, Text} from 'react-native';
import Dimension from '../contants/Dimension';
import Fonts from '../contants/Fonts';

const RedPoint = () => {
  return (
    <Text
      style={{
        fontSize: Dimension.fontSize(28),
        fontFamily: Fonts.SF_SEMIBOLD,
        color: 'red',
        marginLeft: 3,
      }}>
      *
    </Text>
  );
};

export default RedPoint;
