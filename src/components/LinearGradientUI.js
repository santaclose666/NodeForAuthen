import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const LinearGradientUI = ({children}) => {
  return (
    <LinearGradient
      colors={['#34495e', '#3498db']}
      style={{flex: 1}}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      {children}
    </LinearGradient>
  );
};

export default LinearGradientUI;
