import React from 'react';
import {View, Dimensions} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import Dimension from '../contants/Dimension';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SvgBg = ({children}) => {
  const defaultW = wp('100%');
  const defaultH = hp('22%');

  return (
    <Svg
      width={defaultW}
      height={defaultH}
      viewBox={`0 0 ${defaultW} ${defaultH}`}
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
