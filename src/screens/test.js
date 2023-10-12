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
    <Svg
      width={scale(350)}
      height={verticalScale(175)}
      viewBox={`0 0 ${scale(350)} ${verticalScale(175)}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M0 0H430V200C267.707 244.024 173.406 244.512 0 200V0Z"
        fill="#8EE297"
      />
    </Svg>
  );
};

export default Rectangle;
