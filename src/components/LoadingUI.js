import React, {useState, useLayoutEffect} from 'react';
import {Spinner} from 'native-base';
import {View} from 'react-native';

export const TransparentFullScreen = () => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'transparent',
      }}
    />
  );
};

const Loading = ({bg}) => {
  const [defaultBg, setDefaultBg] = useState('rgba(85, 106, 115, 0.35)');

  useLayoutEffect(() => {
    if (!bg) {
      setDefaultBg('transparent');
    }
  }, []);

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: defaultBg,
      }}>
      <Spinner size="lg" color="emerald.500" />
    </View>
  );
};

export default Loading;
