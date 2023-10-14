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
          elevation: 5,
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
                <TouchableOpacity style={styles.detailBtn}>
                  <Text
                    style={[
                      styles.smallText,
                      {textShadowRadius: 0, textShadowColor: 'transparent'},
                    ]}>
                    Chi tiết
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity style={styles.containerIntro}>
                  <Image
                    source={Images.facebook}
                    style={[styles.img, {tintColor: '#0866ff'}]}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image />
                </TouchableOpacity>
              </View>
            </>
          )}
        </ImageBackground>
      </TouchableOpacity>
    );
  });

  return (
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header title="Vườn Quốc Gia Việt Nam" navigation={navigation} />

        <FlatList
          style={{marginTop: hp('2%')}}
          data={npData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderStaffs item={item} index={index} />
          )}
          showsVerticalScrollIndicator={false}
        />
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

  detailBtn: {
    backgroundColor: '#45bd8d',
    paddingVertical: hp('0.2%'),
    paddingHorizontal: wp('2%'),
    borderRadius: 6,
    marginTop: hp('1%'),
    elevation: 6,
    ...shadowIOS,
  },

  img: {
    width: wp('5%'),
    height: wp('5%'),
  },

  containerIntro: {
    backgroundColor: '#ffffff',
  },
});

export default NationalParkList;
