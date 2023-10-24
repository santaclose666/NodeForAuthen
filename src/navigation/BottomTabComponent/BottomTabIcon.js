import React from 'react';
import {View} from 'react-native';
import Home from '../../assets/svg/home.svg';
import Bell from '../../assets/svg/bell.svg';
import News from '../../assets/svg/news.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const BottomTabIcon = ({route, isFocused}) => {
  const renderIcon = (route, isFocused) => {
    let height = wp('6%');
    let width = wp('6%');

    switch (route) {
      case 'Notification':
        return (
          <Bell
            width={width}
            height={height}
            fill={isFocused ? '#8EE297' : '#ffffff'}
          />
        );
      case 'Home':
        return (
          <Home
            width={width}
            height={height}
            fill={isFocused ? '#8EE297' : '#ffffff'}
          />
        );
      case 'AllNews':
        return (
          <News
            width={width}
            height={height}
            fill={isFocused ? '#8EE297' : '#ffffff'}
          />
        );

      default:
        break;
    }
  };

  return <View>{renderIcon(route, isFocused)}</View>;
};

export default BottomTabIcon;
