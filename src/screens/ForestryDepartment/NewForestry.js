import React, {useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {getCategoryForestry, getNewsList} from '../../redux/apiRequest';
import Dimension from '../../contants/Dimension';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import {shadowIOS} from '../../contants/propsIOS';
import LinearGradientUI from '../../components/LinearGradientUI';
import Header from '../../components/Header';
import {fontDefault} from '../../contants/Variable';
import {screen} from '../../screens/AllScreen/allScreen';
import {EmptyList} from '../../components/FlatlistComponent';
import Images from '../../contants/Images';
import {NewsSkeleton} from '../../components/Skeleton';
import {shareUrl} from '../../utils/download';

const NewsForestry = ({navigation}) => {
  const [featureIndex, setFeatureIndex] = useState(0);
  const [newsArr, setNewsArr] = useState([]);
  const [featureArr, setFeatureArr] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNewsList = async id => {
    setLoading(true);
    const list = await getNewsList(id);
    setNewsArr(list);
    setLoading(false);
  };

  const handlePickFeature = async (item, index) => {
    setFeatureIndex(index);
    await fetchNewsList(item.id);
  };

  const fetchCategory = async () => {
    try {
      const data = await getCategoryForestry();

      setFeatureArr(
        data.sort((a, b) => {
          return a.id - b.id;
        }),
      );
      await fetchNewsList(data[0].id);
    } catch (error) {
      console.log(error);
    }
  };
  useLayoutEffect(() => {
    fetchCategory();
  }, []);

  return (
    <LinearGradientUI>
      <SafeAreaView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        <Header title={'Tin tức Cục Lâm nghiệp'} navigation={navigation} />
        <View style={styles.featuresTitleContainer}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {featureArr?.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    handlePickFeature(item, index);
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

        <View style={{flex: 1, marginTop: Dimension.setHeight(1)}}>
          {loading ? (
            <NewsSkeleton />
          ) : (
            <FlatList
              data={newsArr}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      const data = {
                        ...item,
                        avatar: item.thumbnail,
                      };
                      navigation.navigate(screen.detailNews, {item: data});
                    }}
                    style={styles.hotNewsContainer}
                    key={index}>
                    {item.thumbnail.length != 0 ? (
                      <Image
                        style={styles.newsImg}
                        src={item.thumbnail}
                        resizeMode="cover"
                      />
                    ) : (
                      <Image
                        style={styles.newsImg}
                        source={Images.cln}
                        resizeMode="contain"
                      />
                    )}

                    <View
                      style={{
                        marginVertical: Dimension.setHeight(0.1),
                        marginHorizontal: Dimension.setWidth(2.2),
                      }}>
                      <Text
                        numberOfLines={2}
                        style={{
                          fontFamily: Fonts.SF_SEMIBOLD,
                          fontSize: Dimension.fontSize(14),
                          ...fontDefault,
                          textAlign: 'justify',
                        }}>
                        {item.title}
                      </Text>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontFamily: Fonts.SF_REGULAR,
                            color: Colors.DEFAULT_BLACK,
                            opacity: 0.6,
                            fontSize: Dimension.fontSize(12),
                          }}>
                          {item.createDate.replace(/\s+/g, ' - ')}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            shareUrl(item.url);
                          }}>
                          <Image
                            source={Images.share}
                            style={{width: 22, height: 22}}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              initialNumToRender={6}
              windowSize={6}
              removeClippedSubviews={true}
              refreshing={true}
              ListEmptyComponent={() => {
                return <EmptyList />;
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </LinearGradientUI>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginHorizontal: Dimension.setWidth(3),
  },

  hotNewsContainer: {
    marginHorizontal: Dimension.setWidth(3.5),
    borderWidth: 0.4,
    borderRadius: 10,
    borderColor: Colors.WHITE,
    backgroundColor: Colors.WHITE,
    marginBottom: Dimension.setHeight(1.8),
    elevation: 5,
    ...shadowIOS,
    padding: 5,
  },

  newsImg: {
    width: Dimension.setWidth(89),
    height: Dimension.setHeight(22),
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: Dimension.setHeight(0.6),
  },
});

export default NewsForestry;
