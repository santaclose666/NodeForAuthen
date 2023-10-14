import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import {fontDefault} from '../../contants/Variable';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../contants/Colors';

const DetailNationPark = ({navigation, route}) => {
  const data = route.params.data;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          position: 'absolute',
          top: hp('4%'),
          left: wp('3%'),
          zIndex: 999,
          padding: hp('1%'),
          backgroundColor: Colors.DEFAULT_GREEN,
          borderRadius: 50,
          alignItems: 'center',
        }}>
        <Image
          source={Images.back}
          style={{width: wp('4%'), height: wp('4%'), tintColor: '#ffffff'}}
        />
      </TouchableOpacity>
      <View>
        <Image
          src={data.introImg}
          style={{width: wp('100%'), height: hp('26%')}}
        />
        <LinearGradient
          colors={[
            'transparent',
            'rgba(23, 23, 23, 0.6)',
            'rgba(23, 23, 23, 1)',
          ]}
          style={{
            width: wp('100%'),
            height: hp('18%'),
            position: 'absolute',
            bottom: 0,
          }}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1.2}}
        />
        <View
          style={{
            position: 'absolute',
            left: wp('3%'),
            bottom: hp('0.8%'),
          }}>
          <Text style={styles.bigText}>{data.tendonvi}</Text>
          <Text style={styles.smallText}>{data.location}</Text>
        </View>
      </View>
      <View style={styles.containerText}>
        <Text style={styles.title}>Giới thiệu</Text>
        <Text style={styles.content}>{data.intro}</Text>
      </View>
      <View style={styles.containerText}>
        <Text style={styles.title}>Lịch sử, Địa lý</Text>
        <Text style={styles.content}>{data.hisGeo}</Text>
      </View>
      <View style={styles.containerText}>
        <Text style={styles.title}>Đa dạng sinh học</Text>
        <Text style={styles.content}>{data.biodiversity}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eceded',
  },

  bigText: {
    ...fontDefault,
    fontFamily: Fonts.SF_SEMIBOLD,
    fontSize: wp('4.5%'),
    textShadowRadius: 6,
    textShadowColor: 'black',
    color: '#ffffff',
  },

  smallText: {
    ...fontDefault,
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: wp('3.5%'),
    textShadowRadius: 6,
    textShadowColor: 'black',
    color: '#ffffff',
  },

  containerText: {
    marginHorizontal: wp('2.5%'),
    marginVertical: hp('1%'),
  },

  title: {
    fontSize: wp('4%'),
    fontFamily: Fonts.SF_MEDIUM,
    color: '#2c3773',
  },

  content: {
    fontSize: wp('3.6%'),
    color: '#6e6d73',
    textAlign: 'auto',
  },
});

export default DetailNationPark;
