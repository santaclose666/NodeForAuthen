import React, {memo, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Platform,
} from 'react-native';
import unidecode from 'unidecode';
import Images from '../contants/Images';
import Icons from '../contants/Icons';
import Colors from '../contants/Colors';
import Fonts from '../contants/Fonts';
import Dimension from '../contants/Dimension';
import {shadowIOS} from '../contants/propsIOS';
import {fontDefault} from '../contants/Variable';
import Header from '../components/Header';
import LinearGradientUI from './LinearGradientUI';
import RNFetchBlob from 'rn-fetch-blob';
import {downloadPermissionAndroid} from '../utils/permissionFunc';

const DocumentTemplate = ({
  screenName,
  navigation,
  pickFileIndex,
  setpickFileIndex,
  pickOptionIndex,
  setPickOptionIndex,
  input,
  setInput,
  data,
  groupOption,
  document,
  setDocument,
}) => {
  const handleSearch = useCallback(
    text => {
      setInput(text);
      setpickFileIndex(null);

      const filter = data.filter(item =>
        unidecode(item.tenvanban.toLowerCase()).includes(text.toLowerCase()),
      );
      setDocument(filter);
    },
    [input],
  );

  const handlePickOption = useCallback(
    (keyWord, index) => {
      index === 0
        ? setDocument(data)
        : setDocument(data.filter(item => item.loaivanban === keyWord));

      setPickOptionIndex(index);
      setpickFileIndex(null);
    },
    [pickOptionIndex],
  );

  const handlePress = useCallback(path => {
    navigation.navigate('PDF', {link: path});
  }, []);

  // const downloadFile = async url => {
  //   const {config, fs} = RNFetchBlob;
  //   const cacheDir = fs.dirs.DownloadDir;

  //   const filename = url.split('/').pop();
  //   const imagePath = `${cacheDir}/${filename}`;

  //   try {
  //     const configOptions = Platform.select({
  //       ios: {
  //         fileCache: true,
  //         path: imagePath,
  //         appendExt: filename.split('.').pop(),
  //       },
  //       android: {
  //         fileCache: true,
  //         path: imagePath,
  //         appendExt: filename.split('.').pop(),
  //         addAndroidDownloads: {
  //           useDownloadManager: true,
  //           notification: true,
  //           path: imagePath,
  //           description: 'File',
  //         },
  //       },
  //     });

  //     const response = await RNFetchBlob.config(configOptions).fetch(
  //       'GET',
  //       url,
  //     );

  //     return response;
  //   } catch (error) {
  //     console.error(error);
  //     return null;
  //   }
  // };

  // const handleDownload = async path => {
  //   console.log(path);
  //   if (Platform.OS === 'android') {
  //     try {
  //       const granted = await downloadPermissionAndroid();

  //       if (granted) {
  //         downloadFile(path);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     try {
  //       const res = await downloadFile(path);

  //       RNFetchBlob.ios.previewDocument(res.path());
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  const RenderDocument = memo(({item, index}) => {
    return (
      <View style={{flex: 1, zIndex: 999}}>
        <TouchableOpacity
          onPress={() => handlePress(item.path)}
          style={styles.flatListItemContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: Dimension.setWidth(3),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '70%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  handleDownload(item.path);
                }}>
                <Image
                  source={Images.download}
                  style={{
                    width: 40,
                    height: 40,
                    marginRight: Dimension.setWidth(3),
                  }}
                />
              </TouchableOpacity>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{
                  fontFamily: Fonts.SF_SEMIBOLD,
                  fontSize: Dimension.fontSize(16),
                  ...fontDefault,
                }}>
                {item.tenvanban}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: Fonts.SF_SEMIBOLD,
                fontSize: Dimension.fontSize(15),
                color: Colors.INACTIVE_GREY,
              }}>
              {item.nam}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              pickFileIndex !== index
                ? setpickFileIndex(index)
                : setpickFileIndex(null);
            }}
            style={{
              marginTop: Dimension.setHeight(1.8),
              borderTopWidth: 0.5,
              borderTopColor: Colors.INACTIVE_GREY,
              marginHorizontal: Dimension.setWidth(7),
            }}>
            <View
              style={{
                paddingTop: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SF_REGULAR,
                  fontSize: Dimension.fontSize(14),
                  color: Colors.INACTIVE_GREY,
                }}>
                {pickFileIndex === index ? 'Thu gọn' : 'Chi tiết'}
              </Text>
              <Image
                source={pickFileIndex === index ? Images.up : Images.down}
                style={{
                  width: 16,
                  height: 16,
                  tintColor: Colors.INACTIVE_GREY,
                }}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
        {pickFileIndex === index && (
          <View style={styles.subMenuContainer}>
            <View style={{padding: 10, marginLeft: Dimension.setWidth(3)}}>
              <View style={[styles.subItem, {flexWrap: 'wrap'}]}>
                <Image source={Images.dot} style={styles.dot} />
                <Text style={styles.title}>Tên VB: </Text>
                <Text style={styles.content}>{item?.tenvanban}</Text>
              </View>
              <View style={styles.subItem}>
                <Image source={Images.dot} style={styles.dot} />
                <Text style={styles.title}>Năm ban hành: </Text>
                <Text style={styles.content}>{item?.nam}</Text>
              </View>
              {item?.sohieu && (
                <View style={styles.subItem}>
                  <Image source={Images.dot} style={styles.dot} />
                  <Text style={styles.title}>Số hiệu: </Text>
                  <Text style={styles.content}>{item?.sohieu}</Text>
                </View>
              )}
              {item?.loaivanban && (
                <View style={styles.subItem}>
                  <Image source={Images.dot} style={styles.dot} />
                  <Text style={styles.title}>Loại văn bản: </Text>
                  <Text style={styles.content}>{item?.loaivanban}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    );
  });

  return (
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header title={screenName} navigation={navigation} />
        <View style={styles.searchInput}>
          <Icons.Feather name="search" size={25} color={Colors.INACTIVE_GREY} />
          <TextInput
            onChangeText={e => handleSearch(e)}
            value={input}
            placeholder="Tìm văn bản"
            style={{
              fontFamily: Fonts.SF_REGULAR,
              marginLeft: 10,
              width: '80%',
            }}
          />
        </View>

        {groupOption && (
          <View style={styles.optionContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {groupOption?.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      handlePickOption(item, index);
                    }}
                    key={index}
                    style={{
                      marginRight: Dimension.setWidth(4.4),
                      paddingVertical: 3,
                      borderBottomWidth: pickOptionIndex === index ? 2 : 0,
                      borderBottomColor:
                        pickOptionIndex === index
                          ? Colors.DEFAULT_GREEN
                          : '#fff',
                    }}>
                    <Text
                      style={{
                        fontFamily:
                          pickOptionIndex === index
                            ? Fonts.SF_SEMIBOLD
                            : Fonts.SF_REGULAR,
                        fontSize: Dimension.fontSize(16),
                        opacity: 0.8,
                        color:
                          pickOptionIndex === index
                            ? Colors.DEFAULT_GREEN
                            : Colors.DEFAULT_BLACK,
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={styles.fileListContainer}>
          <FlatList
            data={document}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <RenderDocument item={item} index={index} />
            )}
            initialNumToRender={10}
            windowSize={6}
            extraData={document}
          />
        </View>
      </SafeAreaView>
    </LinearGradientUI>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: Dimension.setHeight(2),
    marginHorizontal: Dimension.setWidth(5),
  },

  searchContainer: {
    marginTop: Dimension.setHeight(2),
    marginHorizontal: Dimension.setWidth(2),
    backgroundColor: '#ffffff',
    elevation: 4,
    ...shadowIOS,
    borderRadius: 8,
    borderWidth: 1,
    height: 30,
    width: '90%',
    alignSelf: 'center',
  },

  optionContainer: {
    marginTop: Dimension.setHeight(1.5),
    marginHorizontal: Dimension.setWidth(5),
  },

  fileListContainer: {
    flex: 1,
    marginTop: Dimension.setHeight(1.5),
    marginHorizontal: Dimension.setWidth(5),
  },

  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    width: 10,
    height: 10,
    marginRight: Dimension.setWidth(1),
  },

  title: {
    fontFamily: Fonts.SF_BOLD,
    fontSize: Dimension.fontSize(14),
    ...fontDefault,
  },

  content: {
    fontFamily: Fonts.SF_REGULAR,
    fontSize: Dimension.fontSize(14),
    marginLeft: Dimension.setWidth(2),
    textAlign: 'justify',
  },
  searchInput: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    width: '90%',
    borderRadius: 9,
    height: Dimension.setHeight(5.5),
    justifyContent: 'flex-start',
    paddingHorizontal: Dimension.setWidth(3),
    marginTop: 10,
  },

  flatListItemContainer: {
    backgroundColor: '#ffffff',
    marginBottom: Dimension.setHeight(1.1),
    marginTop: Dimension.setHeight(1.1),
    borderRadius: 9,
    elevation: 4,
    ...shadowIOS,
    borderWidth: 0.5,
    borderColor: Colors.WHITE,
    paddingTop: Dimension.setHeight(1.6),
    paddingBottom: Dimension.setHeight(1.2),
  },

  subMenuContainer: {
    marginHorizontal: Dimension.setWidth(5.5),
    backgroundColor: 'rgba(150, 160, 169, 0.2)',
    borderRadius: 12,
    width: '86%',
    marginBottom: Dimension.setHeight(0.6),
  },
});

export default DocumentTemplate;
