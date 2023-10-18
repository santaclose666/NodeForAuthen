import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Colors from '../../contants/Colors';
import {shadowIOS} from '../../contants/propsIOS';
import Fonts from '../../contants/Fonts';
import {rowAlignCenter} from '../../contants/CssFE';
import LinearGradient from 'react-native-linear-gradient';
import ImageView from 'react-native-image-viewing';
import Images from '../../contants/Images';

const SpecieDetailScreen = ({navigation, route}) => {
  const data = route.params.data;
  const imgData = [
    {uri: data.hinh1 && data.link + data.hinh1},
    {uri: data.hinh2 && data.link + data.hinh2},
    {uri: data.hinh3 && data.link + data.hinh3},
  ].filter(
    item => item.uri !== '' && item.uri !== null && item.uri !== undefined,
  );
  const [toggleCommonInfo, setToggleCommonInfo] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showImg, setShowImg] = useState(true);
  const [imgPicker, setImgPicker] = useState(0);
  const safeDimension = useSafeAreaInsets();
  const [dotHeight, setDotHeight] = useState(0);
  const filterName = data.loailatin.split(' ');
  const latinName = filterName.slice(0, 2).join(' ');
  const finder = filterName.slice(2).join(' ');

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#e4e4e4'}}>
      <StatusBar barStyle={'light-content'} />
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FlatList
          data={imgData}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.uri}
          pagingEnabled
          onScroll={e => {
            const x = e.nativeEvent.contentOffset.x;
            setCurrentIndex((x / wp('100%')).toFixed(0));
          }}
          horizontal
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setImgPicker(index);
                  setShowImg(true);
                }}
                style={{
                  width: wp('100%'),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    elevation: 6,
                    ...shadowIOS,
                  }}>
                  <FastImage
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                      uri: item.uri,
                      priority: 'high',
                    }}
                    style={{
                      width: wp('100%'),
                      height: hp('45%'),
                    }}
                  />
                </View>
                <LinearGradient
                  colors={[
                    'transparent',
                    'rgba(23, 23, 23, 0.6)',
                    'rgba(23, 23, 23, 1)',
                  ]}
                  style={{
                    width: wp('100%'),
                    height: hp('20%'),
                    position: 'absolute',
                    top: 0,
                  }}
                  start={{x: 0, y: 1}}
                  end={{x: 0, y: -1}}
                />
                <LinearGradient
                  colors={[
                    'transparent',
                    'rgba(23, 23, 23, 0.6)',
                    'rgba(23, 23, 23, 1)',
                  ]}
                  style={{
                    width: wp('100%'),
                    height: hp('3%'),
                    position: 'absolute',
                    bottom: 0,
                  }}
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 4}}
                />
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={() => {
            return (
              <View
                onPress={() => {
                  setImgPicker(index);
                  setShowImg(true);
                }}
                style={{
                  width: wp('100%'),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    elevation: 6,
                    ...shadowIOS,
                  }}>
                  <Image
                    source={Images.bio_bg}
                    style={{
                      width: wp('100%'),
                      height: hp('45%'),
                    }}
                  />
                </View>
                <LinearGradient
                  colors={[
                    'transparent',
                    'rgba(23, 23, 23, 0.6)',
                    'rgba(23, 23, 23, 1)',
                  ]}
                  style={{
                    width: wp('100%'),
                    height: hp('20%'),
                    position: 'absolute',
                    top: 0,
                  }}
                  start={{x: 0, y: 1}}
                  end={{x: 0, y: -1}}
                />
              </View>
            );
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: safeDimension.top,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={[styles.vnName, {fontSize: wp('5.3%')}]}>
            {data.loaitv}
          </Text>
          <View style={rowAlignCenter}>
            <Text style={styles.latinName}>{`${latinName} `}</Text>
            <Text style={styles.vnName}>{finder}</Text>
          </View>
        </View>
      </View>
      <View
        onLayout={({nativeEvent}) => {
          const {x, y, width, height} = nativeEvent.layout;
          setDotHeight(height);
        }}
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: -(1.6 * dotHeight),
        }}>
        {imgData.map((item, index) => {
          return (
            <View
              style={{
                width: currentIndex == index ? 30 : 8,
                height: currentIndex == index ? 10 : 8,
                borderRadius: currentIndex == index ? 5 : 4,
                backgroundColor:
                  currentIndex == index ? Colors.DEFAULT_GREEN : '#ffffff',
                marginLeft: 5,
              }}></View>
          );
        })}
      </View>
      <View
        style={[
          styles.containerEachLine,
          {
            marginTop: dotHeight * 2,
          },
        ]}>
        <TouchableOpacity
          onPress={() => {
            setToggleCommonInfo(!toggleCommonInfo);
          }}
          style={[rowAlignCenter, {justifyContent: 'space-between'}]}>
          <Text style={styles.title}>Thông tin chung</Text>

          <Image source={Images.down} style={{width: 20, height: 20}} />
        </TouchableOpacity>

        {toggleCommonInfo && (
          <View style={{marginLeft: wp('1.8%')}}>
            <View style={styles.containerCommonInfo}>
              <Text style={styles.lable}>Tên Ngành La Tinh:</Text>
              <Text style={styles.content}>{`  ${data.nganhlatin}`}</Text>
            </View>
            <View style={styles.containerCommonInfo}>
              <Text style={styles.lable}>Tên Ngành Việt Nam:</Text>
              <Text style={styles.content}>{`  ${data.nganhtv}`}</Text>
            </View>
            <View style={styles.containerCommonInfo}>
              <Text style={styles.lable}>Tên Lớp La Tinh:</Text>
              <Text style={styles.content}>{`  ${data.loplatin}`}</Text>
            </View>
            <View style={styles.containerCommonInfo}>
              <Text style={styles.lable}>Tên Lớp Việt Nam:</Text>
              <Text style={styles.content}>{`  ${data.loptv}`}</Text>
            </View>
            <View style={styles.containerCommonInfo}>
              <Text style={styles.lable}>Tên Bộ La Tinh:</Text>
              <Text style={styles.content}>{`  ${data.bolatin}`}</Text>
            </View>
            <View style={styles.containerCommonInfo}>
              <Text style={styles.lable}>Tên Bộ Việt Nam:</Text>
              <Text style={styles.content}>{`  ${data.botv}`}</Text>
            </View>
            <View style={styles.containerCommonInfo}>
              <Text style={styles.lable}>Tên Họ La Tinh:</Text>
              <Text style={styles.content}>{`  ${data.holatin}`}</Text>
            </View>
            <View style={styles.containerCommonInfo}>
              <Text style={styles.lable}>Tên Họ Việt Nam:</Text>
              <Text style={styles.content}>{` ${data.hotv}`}</Text>
            </View>
            <View style={styles.containerCommonInfo}>
              <Text style={styles.lable}>Tên Chi La Tinh:</Text>
              <Text style={styles.content}>{`  ${data.chilatin}`}</Text>
            </View>
            <View style={styles.containerCommonInfo}>
              <Text style={styles.lable}>Tên Chi Việt Nam:</Text>
              <Text style={styles.content}>{`  ${data.chitv}`}</Text>
            </View>
          </View>
        )}
      </View>
      {imgData.length > 0 && (
        <ImageView
          images={imgData}
          imageIndex={imgPicker}
          visible={showImg}
          onRequestClose={() => {
            setShowImg(false);
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  vnName: {
    color: '#71c96e',
    fontSize: wp('4.5%'),
    fontFamily: Fonts.SF_MEDIUM,
    textShadowRadius: 6,
    textShadowColor: 'grey',
  },

  latinName: {
    color: '#71c96e',
    fontSize: wp('4.5%'),
    textShadowRadius: 6,
    textShadowColor: 'grey',
    fontStyle: 'italic',
    fontWeight: '600',
  },

  containerEachLine: {
    backgroundColor: '#ffffff',
    marginHorizontal: wp('3%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('2%'),
    borderRadius: 16,
  },

  title: {
    fontFamily: Fonts.SF_SEMIBOLD,
    fontSize: wp('3.8%'),
  },

  containerCommonInfo: {
    ...rowAlignCenter,
    marginTop: hp('1.6%'),
  },

  lable: {
    fontFamily: Fonts.SF_THIN,
    fontSize: wp('3.3%'),
    color: '#4d4d4d',
  },

  content: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: wp('3.5%'),
    color: '#469943',
  },
});

export default SpecieDetailScreen;
