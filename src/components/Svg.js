import React from 'react';
import {View, Dimensions, StatusBar} from 'react-native';
import Svg, {Path, RadialGradient, Defs, Stop} from 'react-native-svg';
import Dimension from '../contants/Dimension';

const {width, height} = Dimensions.get('window');

const SvgBg = ({children}) => {
  return (
    <Svg
      width="100%"
      height={Dimension.boxHeight(height / 4.7)}
      preserveAspectRatio="none"
      viewBox={`0 0 ${'100%'} 190`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M0.5 0H430C430 0 430 88.6956 430 161.546C430 234.396 184.833 46.5914 26.4167 161.546C-132 276.5 0.5 0 0.5 0Z"
        fill="#8EE297"
      />
      {children}
    </Svg>
  );
};

export default SvgBg;
