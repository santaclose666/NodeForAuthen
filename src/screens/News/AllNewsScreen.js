import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import unidecode from 'unidecode';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import Icons from '../../contants/Icons';
import {shadowIOS} from '../../contants/propsIOS';
import {useSelector} from 'react-redux';
import {newsURL} from '../../contants/Variable';
import {changeFormatDate} from '../../utils/serviceFunction';

const AllNewsScreen = ({navigation}) => {
  const [featureIndex, setFeatureIndex] = useState(0);
  const newsArr = useSelector(state => state.news.newSlice?.data);
  const category = useSelector(state =>
    state.news.newSlice?.category.map(item => {
      return {title: item.name, id_category: item.id};
    }),
  );

  const featureArr = [{title: 'Tất cả', id_category: 0}, ...category];
  const [newsFilter, setNewsFilter] = useState(null);
  const [input, setInput] = useState('');

  const handlePickFeature = (title, index) => {
    setFeatureIndex(index);
    if (index !== 0) {
      const data = newsArr.filter(item => item.id_category === title);
      setNewsFilter(data);
    } else {
      setNewsFilter(null);
    }
  };

  const handleSearch = text => {
    setInput(text);
    const data = newsArr.filter(item =>
      unidecode(item.name.toLowerCase()).includes(text.toLowerCase()),
    );

    setNewsFilter(data);
  };

  return (
    <SafeAreaView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.searchFilterContainer}>
        <TouchableOpacity
          style={styles.headerContainer}
          onPress={() => {
            navigation.navigate('Home');
          }}>
          <Image style={styles.backImg} source={Images.back} />
        </TouchableOpacity>
        <View style={styles.searchTextInputContainer}>
          <Icons.FontAwesome name="search" size={20} color="#888" />
          <TextInput
            onChangeText={e => handleSearch(e)}
            value={input}
            style={styles.searchTextInput}
            placeholder="Tìm kiếm bài báo"
          />
        </View>
      </View>
      <View style={styles.featuresTitleContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: Dimension.setWidth(4),
          }}>
          <Text
            style={{
              fontFamily: Fonts.SF_BOLD,
              fontSize: 18,
            }}>
            Các lĩnh vực
          </Text>
        </View>

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {featureArr.map((item, index) => {
            const pdRight =
              index === featureArr.length - 1
                ? {marginRight: Dimension.setWidth(3.6)}
                : {marginRight: 0};
            const colorFeature =
              featureIndex === index
                ? Colors.DEFAULT_GREEN
                : Colors.DEFAULT_BLACK;
            const fontFML =
              featureIndex === index ? Fonts.SF_SEMIBOLD : Colors.SF_REGULAR;
            return (
              <TouchableOpacity
                onPress={() => {
                  handlePickFeature(item.id_category, index);
                }}
                style={[styles.featureTextContainer, {...pdRight}]}
                key={index}>
                <Text
                  style={[
                    styles.featureText,
                    {color: colorFeature, opacity: 0.8, fontFamily: fontFML},
                  ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.hotNewTextContainer}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: Fonts.SF_BOLD,
          }}>
          Tin nổi bật
        </Text>
      </View>

      <FlatList
        data={newsFilter ? newsFilter : newsArr}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('DetailNews', {item: item});
              }}
              style={styles.hotNewsContainer}
              key={index}>
              <View
                style={{
                  marginTop: Dimension.setHeight(0.7),
                  marginBottom: Dimension.setHeight(0.8),
                }}>
                <Image
                  style={styles.newsImg}
                  src={newsURL + item.avatar}
                  resizeMode="cover"
                />
                <View
                  style={{
                    marginTop: Dimension.setHeight(0.6),
                    marginHorizontal: Dimension.setWidth(2.2),
                  }}>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontFamily: Fonts.SF_SEMIBOLD,
                      fontSize: 17,
                      color: Colors.DARK_FOUR,
                    }}>
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.SF_REGULAR,
                      fontSize: 15,
                      color: Colors.INACTIVE_GREY,
                    }}>
                    {changeFormatDate(item.date_created)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        initialNumToRender={6}
        windowSize={6}
        removeClippedSubviews={true}
        refreshing={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },

  searchFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Dimension.setHeight(1),
    marginLeft: Dimension.setWidth(3),
  },

  headerContainer: {
    width: '8%',
  },

  backImg: {
    width: 25,
    height: 25,
  },

  searchTextInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    borderColor: '#ccc',
    borderWidth: 0.8,
    borderRadius: 12,
    width: '90%',
    height: Dimension.setHeight(6),
    marginRight: Dimension.setWidth(4),
  },

  searchTextInput: {
    marginLeft: 10,
    fontSize: 14,
    width: '90%',
    fontFamily: Fonts.SF_REGULAR,
  },

  filerImgContainer: {
    flex: 1,
    backgroundColor: '#eef2fe',
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 5,
  },

  filterImg: {
    width: 28,
    height: 28,
    tintColor: Colors.INACTIVE_GREY,
  },

  featuresTitleContainer: {
    marginTop: Dimension.setHeight(1),
  },

  featureTextContainer: {
    marginTop: Dimension.setHeight(0.5),
    height: Dimension.setHeight(4),
    marginLeft: Dimension.setWidth(4),
  },

  featureText: {
    fontFamily: Fonts.SF_REGULAR,
    fontSize: 16,
  },

  hotNewTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Dimension.setHeight(0.5),
    marginBottom: Dimension.setHeight(0.3),
    marginHorizontal: Dimension.setWidth(4),
  },

  hotNewsContainer: {
    marginHorizontal: Dimension.setWidth(3.5),
    alignItems: 'center',
    borderWidth: 0.4,
    borderRadius: 10,
    borderColor: Colors.INACTIVE_GREY,
    backgroundColor: Colors.LIGHT_GREY,
    marginBottom: Dimension.setHeight(1.8),
    elevation: 5,
    ...shadowIOS,
  },

  newsImg: {
    width: Dimension.setWidth(90),
    height: Dimension.setHeight(21),
    borderRadius: 10,
    alignSelf: 'center',
  },
});

export default AllNewsScreen;
