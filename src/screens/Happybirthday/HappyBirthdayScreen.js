import React from 'react';
import Dimension from '../../contants/Dimension';
import {
  View,
  ImageBackground,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import {getCurrentYear} from '../../utils/serviceFunction';
import {mainURL, imgDefault} from '../../contants/Variable';

const HappyBirthdayScreen = ({navigation, route}) => {
  const item = route.params.item;
  const currYear = getCurrentYear();
  const birthYear = item.ngaysinh.slice(6, 10);
  const age = currYear - birthYear;
  const filterName = item.hoten.split(' ');
  const singleName = filterName[filterName.length - 1];

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
          <View
            style={{
              borderWidth: 3,
              padding: 1,
              borderRadius: Dimension.setWidth(50),
              marginBottom: 10,
              borderColor: '#e6ad48',
            }}>
            <Image
              src={mainURL + item.path}
              style={{
                width: Dimension.setWidth(33),
                height: Dimension.setWidth(33),
                borderRadius: Dimension.setWidth(50),
                borderWidth: 1,
              }}
            />
          </View>
          <Text
            style={{
              fontFamily: Fonts.LATO_REGULAR,
              fontSize: Dimension.fontSize(22),
              color: '#755a68',
              textDecorationLine: 'underline',
            }}>
            {item.hoten}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            top: Dimension.setHeight(52),
            left: Dimension.setWidth(0),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: Fonts.LATO_REGULAR_ITALIC,
              fontSize: Dimension.fontSize(16),
              textAlign: 'center',
              marginHorizontal: Dimension.setWidth(6),
              color: '#755a68',
            }}>
            Hôm nay là một ngày đặc biệt, thành viên đáng quý {item.hoten} của
            đơn vị tròn {age} tuổi. Trong thời gian qua, bạn không chỉ hoàn
            thành tốt công việc mà còn luôn giúp đỡ các thành viên khác trong
            đơn vị. Tuổi mới hy vọng mọi điều tốt đẹp trong cuộc sống sẽ đến với
            bạn!
            <Image source={Images.confetti} style={{width: 20, height: 20}} />
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            position: 'absolute',
            top: Dimension.setHeight(5),
            left: Dimension.setWidth(6),
          }}>
          <Image
            source={Images.back}
            style={{
              width: 30,
              height: 30,
              ...imgDefault,
              tintColor: '#c35e4fff',
            }}
          />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default HappyBirthdayScreen;