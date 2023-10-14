import React, {useState, memo, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Pressable,
  Linking,
} from 'react-native';
import Fonts from '../../contants/Fonts';
import {useDispatch, useSelector} from 'react-redux';
import {shadowIOS} from '../../contants/propsIOS';
import LinearGradientUI from '../../components/LinearGradientUI';
import Header from '../../components/Header';
import {getAllManageData} from '../../redux/apiRequest';
import {screen} from '../AllScreen/allScreen';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../contants/Colors';
import Images from '../../contants/Images';
import {ToastAlert} from '../../components/Toast';
import {rowAlignCenter} from '../../contants/CssFE';
import {NationalParkSkeleton} from '../../components/Skeleton';

const NationalParkList = ({navigation}) => {
  const npData = useSelector(
    state => state.nationalPark.nationalParkSlice?.data,
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [indexPicker, setIndexPicker] = useState(null);

  const fetchNationalPark = async () => {
    try {
      await getAllManageData(dispatch);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const openUrl = async link => {
    try {
      const openSupport = await Linking.canOpenURL(link);

      if (openSupport) {
        await Linking.openURL(link);
      } else {
        ToastAlert('Không thể truy cập đường dẫn!');
      }
    } catch (error) {
      ToastAlert('Không thể truy cập đường dẫn!');
    }
  };

  useLayoutEffect(() => {
    fetchNationalPark();
  }, []);

  const RenderStaffs = memo(({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          indexPicker != index ? setIndexPicker(index) : setIndexPicker(null);
        }}
        key={index}
        style={{
          marginBottom: hp('2%'),
          marginHorizontal: wp('2%'),
          elevation: 6,
          ...shadowIOS,
        }}>
        <ImageBackground
          resizeMode="cover"
          source={{uri: item.introImg}}
          style={{
            flex: 1,
            width: '100%',
            height: hp('21%'),
            justifyContent: indexPicker !== index ? 'flex-end' : 'center',
            backgroundColor: 'black',
            borderColor: Colors.INACTIVE_GREY,
            borderWidth: 0.8,
            borderRadius: 16,
          }}
          imageStyle={{
            borderRadius: 16,
            opacity: indexPicker == index ? 0.4 : 0.8,
          }}>
          {indexPicker !== index ? (
            <View style={{marginLeft: wp('2.5%'), marginBottom: hp('1%')}}>
              <Text style={styles.bigText}>{item.tendonvi}</Text>
              <Text style={styles.smallText}>{item.location}</Text>
            </View>
          ) : (
            <>
              <View style={{alignItems: 'center'}}>
                <Text style={[styles.bigText, {fontSize: wp('5.5%')}]}>
                  {item.tendonvi}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(screen.detailNationPark, {data: item});
                  }}
                  style={styles.detailBtn}>
                  <Text
                    style={[
                      styles.smallText,
                      {textDecorationLine: 'underline', color: '#2290b5'},
                    ]}>
                    Chi tiết
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {indexPicker === index && (
            <View
              style={{
                position: 'absolute',
                flexDirection: 'row',
                alignItems: 'center',
                left: 6,
                bottom: 6,
              }}>
              <TouchableOpacity
                onPress={() => {
                  openUrl(item.fb);
                }}
                style={[styles.containerIntro, {marginRight: wp('1%')}]}>
                <Image
                  source={Images.facebook}
                  style={[styles.img, {tintColor: '#0866ff'}]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  openUrl(item.homepage);
                }}
                style={styles.containerIntro}>
                <Image
                  source={Images.homeActive}
                  style={[styles.img, {tintColor: '#b8b646'}]}
                />
              </TouchableOpacity>
            </View>
          )}
          {indexPicker === index && (
            <View
              style={{
                position: 'absolute',
                flexDirection: 'row',
                alignItems: 'center',
                right: 6,
                bottom: 6,
              }}>
              {item.bodulieu.map((data, index) => {
                const iconic =
                  data.loaidulieu == 'Động vật'
                    ? Images.animal
                    : data.loaidulieu == 'Thực vật'
                    ? Images.plant
                    : Images.mushroom;
                const colors =
                  data.loaidulieu == 'Động vật'
                    ? '#f0b263'
                    : data.loaidulieu == 'Thực vật'
                    ? '#57b85d'
                    : '#ffffff';
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setIndexPicker(null);
                      const allData = {
                        ...data,
                        name: item.tendonvi,
                        logo: item.logo,
                      };
                      navigation.navigate(screen.bioList, {item: allData});
                    }}
                    key={index}
                    style={[rowAlignCenter, {marginLeft: wp('2%')}]}>
                    <Image
                      source={iconic}
                      style={{
                        width: wp('3%'),
                        height: wp('3%'),
                        tintColor: colors,
                        marginRight: wp('0.3%'),
                      }}
                    />
                    <Text
                      style={{
                        fontSize: wp('3%'),
                        fontFamily: Fonts.SF_MEDIUM,
                        color: colors,
                        textShadowRadius: 1,
                        textShadowColor: colors,
                      }}>
                      {data.loaidulieu}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ImageBackground>
      </TouchableOpacity>
    );
  });

  return (
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header title="Vườn Quốc Gia Việt Nam" navigation={navigation} />

        {loading ? (
          <NationalParkSkeleton />
        ) : (
          <FlatList
            style={{marginTop: hp('2%')}}
            data={npData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item, index}) => (
              <RenderStaffs item={item} index={index} />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </LinearGradientUI>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
  },

  bigText: {
    color: '#e1e9eaff',
    fontFamily: Fonts.SF_SEMIBOLD,
    fontSize: wp('4.5%'),
    elevation: 5,
    textShadowRadius: 6,
    textShadowColor: 'black',
  },

  smallText: {
    color: '#dfdddc',
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: wp('3.5%'),
    textShadowRadius: 6,
    textShadowColor: 'black',
  },

  detailBtn: {},

  img: {
    width: wp('4%'),
    height: wp('4%'),
  },

  containerIntro: {
    backgroundColor: '#ffffff',
    padding: 4,
    borderRadius: 50,
  },
});

export default NationalParkList;
