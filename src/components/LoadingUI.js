import React from 'react';
import {Spinner} from 'native-base';
import {BlurView} from '@react-native-community/blur';
import {View} from 'react-native';

const Loading = () => {
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
      }}>
      <BlurView
        blurType="light"
        blurAmount={30}
        reducedTransparencyFallbackColor="white">
        <Spinner size="lg" color="emerald.500" />
      </BlurView>
    </View>
  );
};

export default Loading;
