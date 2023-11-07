import React from 'react';
import {View} from 'react-native';
import Dimension from '../contants/Dimension';
import Colors from '../contants/Colors';

const Separation = ({width}) => {
  const defaultW = Dimension.setWidth(3);
  return (
    <View
      style={{
        width: width || defaultW,
        height: 0,
        borderWidth: 1,
        marginHorizontal: Dimension.setWidth(1.1),
        borderColor: Colors.INACTIVE_GREY,
        alignSelf: 'center',
      }}
    />
  );
};

export default Separation;
