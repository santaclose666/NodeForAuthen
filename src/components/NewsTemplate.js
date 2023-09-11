import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import Dimension from '../contants/Dimension';
import {shadowIOS} from '../contants/propsIOS';
import {newsURL, newsMvURL} from '../contants/Variable';
import {changeFormatDate} from '../utils/serviceFunction';
import LinearGradientUI from '../components/LinearGradientUI';
import Header from '../components/Header';
import {fontDefault} from '../contants/Variable';

const NewsTemplate = ({
  screenName,
  navigation,
  featureIndex,
  setFeatureIndex,
  newsArr,
  featureArr,
  title,
  setTitle,
}) => {
  const checkURL = screenName === 'Chỉ đạo điều hành' ? newsMvURL : newsURL;

  const handlePickFeature = (title, index) => {
    setFeatureIndex(index);
    setTitle(title);
  };

  const handleFilter = () => {
    if (featureIndex == 0 || screenName === 'Chỉ đạo điều hành') {
      return newsArr;
    } else {
      return newsArr?.filter(item => item?.id_category === title);
    }
  };

  return (
    <LinearGradientUI>
      <SafeAreaView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        <Header title={screenName} navigation={navigation} replace={true} />

        {featureArr && (
          <View style={styles.featuresTitleContainer}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {featureArr.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      handlePickFeature(item.id_category, index);
                    }}
                    style={{
                      marginHorizontal: Dimension.setWidth(3),
                      paddingVertical: 3,
                      borderBottomWidth: featureIndex === index ? 2 : 0,
                      borderBottomColor:
                        featureIndex === index ? Colors.DEFAULT_GREEN : '#fff',
                    }}
                    key={index}>
                    <Text
                      style={{
                        fontFamily:
                          featureIndex === index
                            ? Fonts.SF_SEMIBOLD
                            : Fonts.SF_REGULAR,
                        fontSize: Dimension.fontSize(16),
                        opacity: 0.8,
                        color:
                          featureIndex === index
                            ? Colors.DEFAULT_GREEN
                            : Colors.DEFAULT_BLACK,
                      }}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={{flex: 1, marginTop: Dimension.setHeight(1.6)}}>
          <FlatList
            data={handleFilter()}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    const data = {
                      ...item,
                      screenName,
                    };
                    navigation.navigate('DetailNews', {item: data});
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
                      src={checkURL + item.avatar}
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
                          fontSize: Dimension.fontSize(14),
                          ...fontDefault,
                          paddingHorizontal: Dimension.setHeight(1),
                          textAlign: 'justify',
                        }}>
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.SF_REGULAR,
                          color: Colors.DEFAULT_BLACK,
                          opacity: 0.6,
                          fontSize: Dimension.fontSize(12),
                          paddingHorizontal: Dimension.setHeight(1),
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
        </View>
      </SafeAreaView>
    </LinearGradientUI>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
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
    fontSize: Dimension.fontSize(14),
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
    marginVertical: Dimension.setHeight(1.5),
  },

  featureTextContainer: {
    marginTop: Dimension.setHeight(0.5),
    marginLeft: Dimension.setWidth(4),
  },

  featureText: {
    fontFamily: Fonts.SF_REGULAR,
    fontSize: Dimension.fontSize(16),
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
    borderColor: Colors.WHITE,
    backgroundColor: Colors.WHITE,
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

export default NewsTemplate;
