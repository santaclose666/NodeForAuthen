import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const LinearGradientUI = ({children}) => {
  const defaultColor = ['rgba(166,222,255,0.3)', 'rgba(234,234,234,1)'];
  return (
    <LinearGradient
      colors={defaultColor}
      style={{flex: 1}}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      {children}
    </LinearGradient>
  );
};

export default LinearGradientUI;
// background-image: radial-gradient( circle 1224px at 10.6% 8.8%,  rgba(255,255,255,1) 0%, rgba(153,202,251,1) 100.2% );
