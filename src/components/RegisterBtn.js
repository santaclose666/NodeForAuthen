import React from 'react';
import {TouchableOpacity, Text, Image} from 'react-native';
import Dimension from '../contants/Dimension';
import Fonts from '../contants/Fonts';
import Images from '../contants/Images';
import Colors from '../contants/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const BackBtn = ({event, top, left}) => {
  const safeDimension = useSafeAreaInsets();
  const mt = top || safeDimension.top + hp('1.2%');
  const ml = left || safeDimension.left + wp('3.6%');

  return (
    <TouchableOpacity
      onPress={event}
      style={{
        backgroundColor: 'transparent',
        position: 'absolute',
        zIndex: 999,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        top: mt,
        left: ml,
      }}>
      <Image
        source={Images.back}
        style={{width: 24, height: 24, tintColor: '#ffffff'}}
      />
    </TouchableOpacity>
  );
};

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
          fontSize: Dimension.fontSize(17),
          fontFamily: Fonts.SF_SEMIBOLD,
          color: '#ffffff',
        }}>
        {!nameBtn ? 'Đăng kí' : nameBtn}
      </Text>
    </TouchableOpacity>
  );
};

export default RegisterBtn;
