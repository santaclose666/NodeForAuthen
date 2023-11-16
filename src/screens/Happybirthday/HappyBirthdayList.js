import React, {useState, useLayoutEffect} from 'react';
import Dimension from '../../contants/Dimension';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import {getBirthdayList} from '../../redux/apiRequest';
import {mainURL, imgDefault} from '../../contants/Variable';
import {screen} from '../AllScreen/allScreen';
import {useSelector} from 'react-redux';

const HappyBirthdayList = ({navigation}) => {
  const unit = useSelector(state => state.unit?.unitOption?.data);
  const [birthdayList, setBirthdayList] = useState([]);

  const fetchBirthdayList = async () => {
    try {
      const data = {
        tendonvi: unit,
      };
      const res = await getBirthdayList(data);

      setBirthdayList(res);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    fetchBirthdayList();

    const {width, height} = Dimensions.get('window');
    console.log(width, height);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffb901ff',
        paddingVertical: Dimension.setHeight(1.8),
        paddingHorizontal: Dimension.setWidth(3),
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          borderRadius: 14,
        }}>
        <View style={[styles.layoutContainer, {flex: 2.5}]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingHorizontal: Dimension.setWidth(3),
              marginTop: Dimension.setHeight(4),
              marginBottom: Dimension.setHeight(7),
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={Images.back}
                style={{width: 25, height: 25, ...imgDefault}}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: Fonts.LATO_REGULAR_ITALIC,
                fontSize: Dimension.fontSize(25),
                color: '#a91a22ff',

                textDecorationLine: 'underline',
              }}>
              Sinh nhật nhân sự sắp tới
            </Text>
            <View />
          </View>
          <FlatList
            data={birthdayList}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <View
                  key={index}
                  style={{
                    flex: 1,
                    width: Dimension.setWidth(31),
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={styles.containerAvt}
                    onPress={() => {
                      navigation.navigate(screen.hpbd, {item: item});
                    }}>
                    <Image src={mainURL + item.path} style={styles.avt} />
                  </TouchableOpacity>
                  <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <Text style={styles.birthdayText}>{item.chucdanh}</Text>
                    <Text numberOfLines={2} style={styles.nameText}>
                      {item.hoten}
                    </Text>
                    <Text style={styles.birthdayText}>{item.ngaysinh}</Text>
                  </View>
                </View>
              );
            }}
            keyExtractor={(_, index) => index}
          />
        </View>
        <View style={[styles.layoutContainer, {flex: 4}]}>
          <Image
            source={Images.decoraction}
            resizeMode="cover"
            style={[
              styles.imgMain,
              {
                height: Dimension.setHeight(16),
                marginTop: Dimension.setHeight(3.5),
              },
            ]}
          />
          <Image
            source={Images.hpbdparty}
            resizeMode="cover"
            style={[styles.imgMain, {height: Dimension.setHeight(30)}]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  layoutContainer: {
    alignItems: 'center',
  },

  containerAvt: {
    borderWidth: 2,
    borderColor: '#ffb901ff',
    borderRadius: 50,
    padding: 1.6,
  },

  avt: {
    width: 66,
    height: 66,
    borderRadius: 50,
  },

  nameText: {
    fontFamily: Fonts.LATO_REGULAR,
    fontSize: Dimension.fontSize(15),
    color: '#a91a22ff',
    textAlign: 'center',
  },

  birthdayText: {
    fontFamily: Fonts.LATO_REGULAR,
    fontSize: Dimension.fontSize(13),
    color: '#a91a22ff',
    textAlign: 'center',
  },

  imgMain: {
    width: '100%',
  },
});

export default HappyBirthdayList;
