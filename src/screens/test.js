import React from 'react';
import {View, Dimensions} from 'react-native';
import Svg, {Path, RadialGradient, Defs, Stop} from 'react-native-svg';
import Dimension from '../contants/Dimension';
import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from 'react-native-size-matters';

const {width, height} = Dimensions.get('window');

const calHeight = height / 4 + 6;

const Rectangle = () => {
  return (
    <View style={{flex: 1}}>
      <Svg fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path
          d="M0 0H430V200C267.707 244.024 173.406 244.512 0 200V0Z"
          fill="#8EE297"
        />
      </Svg>
    </View>
  );
};

export default Rectangle;
