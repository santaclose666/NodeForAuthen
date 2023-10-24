import React, {useState} from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import Images from '../../contants/Images';
import Dimension from '../../contants/Dimension';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import DocumentListScreen from './DocumentListScreen';
import DVMTRMapScreen from './DVMTRMapScreen';

const MainVNFF = ({navigation}) => {
  const menuArr = [
    {
      title: 'Bản đồ',
      icon: Images.documentmv,
      component: <DVMTRMapScreen navigation={navigation} />,
    },
    {
      title: 'Tài liệu',
      icon: Images.storage,
      component: <DocumentListScreen navigation={navigation} />,
    },
  ];
  const [menuId, setMenuId] = useState(0);
  const [ComponentPicker, setComponentPicker] = useState(menuArr[0].component);

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 10.1}}>{ComponentPicker}</View>
      <View
        style={{
          flex: 1,
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
            <TouchableOpacity
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
                backgroundColor: '#f4f8feff',
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
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default MainVNFF;
