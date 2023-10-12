import React from 'react';
import {View, Dimensions, StatusBar} from 'react-native';
import Svg, {Path, RadialGradient, Defs, Stop} from 'react-native-svg';
import Dimension from '../contants/Dimension';

const {width, height} = Dimensions.get('window');

const SvgBg = ({children}) => {
  return (
    <Svg
      width={width}
      height={height / 5.2}
      viewBox={`0 0 430 178`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M0 0H430V152.658C267.707 186.261 173.406 186.633 0 152.658V0Z"
        fill="#8EE297"
      />
      {children}
    </Svg>
  );
};

export default SvgBg;
