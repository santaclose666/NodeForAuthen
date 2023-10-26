import React, {useState} from 'react';
import {View, Image, TouchableOpacity, Text, Pressable} from 'react-native';
import Images from '../../contants/Images';
import Dimension from '../../contants/Dimension';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import HistoryRepair from './HistoryRepair';
import TrackRepair from './TrackRepair';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const MainRepair = ({navigation}) => {
  const safeDimension = useSafeAreaInsets();
  const menuArr = [
    {
      title: 'Lịch sử yêu cầu',
      icon: Images.history,
      component: <HistoryRepair navigation={navigation} />,
    },
    {
      title: 'Theo dõi sửa chữa',
      icon: Images.trackingRepair,
      component: <TrackRepair navigation={navigation} />,
    },
  ];
  const [menuId, setMenuId] = useState(0);
  const [ComponentPicker, setComponentPicker] = useState(menuArr[0].component);

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 10.1}}>{ComponentPicker}</View>
      <View
        style={{
          flex: 0.9,
          backgroundColor: '#fff',
          flexDirection: 'row',
          alignItems: 'center',
          elevation: 5,
        }}>
        {menuArr.map((item, index) => {
          const borderTopColor =
            menuId == index ? Colors.DEFAULT_GREEN : 'transparent';
          const textColor = menuId == index ? Colors.DEFAULT_GREEN : '#041d3b';
          return (
            <Pressable
              onPress={() => {
                setComponentPicker(item.component);
                setMenuId(index);
              }}
              key={index}
              style={{
                flex: 1,
                height: Dimension.setHeight(9),
                alignItems: 'center',
                justifyContent: 'center',
                borderTopWidth: 2,
                borderTopColor: borderTopColor,
                backgroundColor: '#ffffff',
                marginBottom: safeDimension.bottom,
              }}>
              <Image source={item.icon} style={{width: 30, height: 30}} />
              <Text
                style={{
                  fontSize: Dimension.fontSize(16),
                  fontFamily: Fonts.SF_MEDIUM,
                  color: textColor,
                  opacity: 0.8,
                }}>
                {item.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default MainRepair;
