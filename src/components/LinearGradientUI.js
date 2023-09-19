import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const LinearGradientUI = ({children}) => {
  return (
    <LinearGradient
      colors={['rgba(153,255,153,0.9)', 'rgba(255,204,204,0.8)']}
      style={{flex: 1}}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      {children}
    </LinearGradient>
  );
};

export default LinearGradientUI;
