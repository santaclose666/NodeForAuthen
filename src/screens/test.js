import React from 'react';
import {View, Dimensions} from 'react-native';
import Svg, {Path, RadialGradient, Defs, Stop} from 'react-native-svg';
import Dimension from '../contants/Dimension';

const Rectangle = () => {
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, borderWidth: 1}}>
        <Svg fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path
            d="M0 0H430V200C267.707 244.024 173.406 244.512 0 200V0Z"
            fill="#8EE297"
          />
        </Svg>
      </View>
      <View style={{flex: 3, borderWidth: 1}} />
    </View>
  );
};

export default Rectangle;
