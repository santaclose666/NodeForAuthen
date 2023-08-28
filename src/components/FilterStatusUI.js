import React from 'react';
import {approveArr} from '../contants/Variable';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Colors from '../contants/Colors';
import Dimension from '../contants/Dimension';
import Fonts from '../contants/Fonts';

const FilterStatusUI = ({handlePickOption, indexPicker}) => {
  return (
    <View
      style={{
        borderBottomWidth: 0.6,
        borderBlockColor: Colors.INACTIVE_GREY,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        height: Dimension.setHeight(10),
        flexDirection: 'row',
      }}>
      {approveArr.map((item, index) => {
        return (
          <TouchableOpacity
            onPress={() => handlePickOption(index)}
            key={index}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: Dimension.setHeight(2.2),
              paddingBottom: Dimension.setHeight(1.5),
              paddingHorizontal: Dimension.setWidth(3),
              height: '100%',
              borderBottomWidth: indexPicker === index ? 1.6 : null,
              borderBlockColor: indexPicker === index ? item.color : null,
            }}>
            <Image
              source={item.icon}
              style={{
                height: 25,
                width: 25,
                tintColor: indexPicker === index ? item.color : item.color,
              }}
            />
            <Text
              style={{
                fontFamily: Fonts.SF_MEDIUM,
                fontSize: 16,
                opacity: 0.8,
                color: indexPicker === index ? item.color : '#041d3b',
              }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default FilterStatusUI;
