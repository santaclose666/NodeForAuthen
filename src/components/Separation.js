import React from 'react';
import {View} from 'react-native';
import Dimension from '../contants/Dimension';
import Colors from '../contants/Colors';

const Separation = () => {
  return (
    <View
      style={{
        width: Dimension.setWidth(3),
        height: 0,
        borderWidth: 1,
        marginHorizontal: Dimension.setWidth(1.5),
        borderColor: Colors.INACTIVE_GREY,
        alignSelf: 'center',
      }}
    />
  );
};

export default Separation;
