import React, {useState, useRef} from 'react';
import Dimension from '../../contants/Dimension';
import {View, ImageBackground, Image} from 'react-native';
import Images from '../../contants/Images';
import ConfettiCannon from 'react-native-confetti-cannon';

const HappyBirthdayScreen = () => {
  const [position, setPosition] = useState({
    x: Dimension.setWidth(50),
    y: Dimension.setHeight(0),
  });

  const confettiCannonRef = useRef();

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        source={Images.hpbd}
        resizeMode="cover"
        style={{flex: 1, justifyContent: 'center'}}>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            top: Dimension.setHeight(20),
            left: Dimension.setWidth(0),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={Images.avatar}
            style={{
              width: Dimension.setWidth(33),
              height: Dimension.setWidth(33),
            }}
          />
        </View>
        <ConfettiCannon
          testID="fetti1"
          count={300}
          origin={position}
          fadeOut={true}
          fallSpeed={1500}
          explosionSpeed={2500}
          colors={[
            '#dbe8def5',
            '#e0dbe8f5',
            '#dec59f',
            '#9fdec69e',
            '#d45ed2d6',
            '#d45e9bd6',
          ]}
          autoStart={true}
          ref={confettiCannonRef}
          onAnimationEnd={() => {
            let x = Math.random() * 200;
            let y = Math.random() * 400;

            setPosition({x: x, y: y});
            confettiCannonRef.current?.start();
          }}
        />
      </ImageBackground>
    </View>
  );
};

export default HappyBirthdayScreen;
