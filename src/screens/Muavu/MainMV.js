import React, {useState} from 'react';
import {View, Image, TouchableOpacity, SafeAreaView, Text} from 'react-native';
import Images from '../../contants/Images';
import Dimension from '../../contants/Dimension';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import DocumentMV from './DocumentMV';
import NewsMV from './NewsMV';
import MuaVuMapScreen from './MuaVuMapScreen';

const MainMV = ({navigation}) => {
  const menuArr = [
    {
      title: 'Bản đồ',
      icon: Images.mapmv,
    },
    {
      title: 'Tài liệu',
      icon: Images.documentmv,
    },
    {
      title: 'Tin tức',
      icon: Images.newsmv,
    },
  ];
  const [menuId, setMenuId] = useState(0);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 9}}>
        {menuId == 0 ? (
          <MuaVuMapScreen navigation={navigation} />
        ) : menuId == 1 ? (
          <DocumentMV navigation={navigation} />
        ) : (
          <NewsMV navigation={navigation} />
        )}
      </View>
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
            <TouchableOpacity
              onPress={() => {
                setMenuId(index);
              }}
              key={index}
              style={{
                width: '33%',
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
    </SafeAreaView>
  );
};

export default MainMV;
