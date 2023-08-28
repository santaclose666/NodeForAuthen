import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import Dimension from '../contants/Dimension';
import Fonts from '../contants/Fonts';

const RegisterBtn = ({nameBtn, onEvent}) => {
  return (
    <TouchableOpacity
      onPress={onEvent}
      style={{
        alignSelf: 'flex-end',
        marginRight: Dimension.setWidth(3),
        backgroundColor: '#ff9e57',
        paddingVertical: Dimension.setHeight(0.5),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        width: Dimension.setWidth(28),
        height: Dimension.setHeight(5),
        marginTop: Dimension.setHeight(1),
        marginBottom: Dimension.setHeight(2.5),
      }}>
      <Text
        style={{
          fontSize: 17,
          fontFamily: Fonts.SF_SEMIBOLD,
          color: '#ffffff',
        }}>
        {!nameBtn ? 'Đăng kí' : nameBtn}
      </Text>
    </TouchableOpacity>
  );
};

export default RegisterBtn;
