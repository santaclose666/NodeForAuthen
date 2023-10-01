import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  Platform,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Images from '../../contants/Images';
import Dimension from '../../contants/Dimension';
import Fonts from '../../contants/Fonts';
import {fontDefault} from '../../contants/Variable';
import ImageView from 'react-native-image-viewing';

const width = Dimensions.get('window').width;

const SpecieDetailScreen = ({navigation}) => {
  const [images, setImages] = useState([]);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const route = useRoute();
  const data = route.params.data;

  console.log(data);

  const words = data.loailatin?.split(' ');
  let formattedText;
  if (words?.length > 1 && (words[1] === 'sp' || words[1] === 'sp.')) {
    formattedText = (
      <Text style={{fontWeight: '600'}}>
        <Text>
          <Text style={{fontStyle: 'italic'}}>{words[0]}</Text>{' '}
          {words.slice(1).join(' ')}
        </Text>
      </Text>
    );
  } else {
    formattedText = (
      <Text style={{fontWeight: '600'}}>
        <Text style={{fontStyle: 'italic'}}>
          {words[0]} {words[1]}
        </Text>{' '}
        {words.slice(2).join(' ')}
      </Text>
    );
  }

  const getListImage = () => {
    var listImg = [];
    if (data.hinh1 != '') {
      listImg.push({
        uri: data.link + data.hinh1,
      });
    }
    if (data.hinh2 != '') {
      listImg.push({
        uri: data.link + data.hinh2,
      });
    }
    if (data.hinh3 != '') {
      listImg.push({
        uri: data.link + data.hinh3,
      });
    }

    setImages(listImg);
  };

  useEffect(() => {
    getListImage();
  }, []);

  return (
    <SafeAreaView showsVerticalScrollIndicator={false} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <View style={styles.searchFilterContainer}>
        <TouchableOpacity
          style={styles.headerContainer}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image style={styles.backImg} source={Images.back} />
        </TouchableOpacity>
        <View style={{flex: 6, alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: Fonts.SF_BOLD,
              fontSize: Dimension.fontSize(18),
              alignItems: 'center',
              ...fontDefault,
            }}>
            THÔNG TIN CHI TIẾT LOÀI
          </Text>
        </View>
      </View>

      {images.length > 0 && (
        <ImageView
          images={images}
          imageIndex={0}
          visible={isImageViewVisible}
          onRequestClose={() => setImageViewVisible(false)}
        />
      )}

      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <Text
            style={{
              textAlign: 'center',
              color: '#28a745',
              fontWeight: '600',
              fontSize: Dimension.fontSize(22),
              marginHorizontal: 8,
            }}>
            {data.loaitv}
          </Text>

          <Text
            style={{
              textAlign: 'center',
              color: '#28a745',
              fontWeight: '600',
              fontSize: Dimension.fontSize(16),
              marginHorizontal: 8,
            }}>
            {formattedText}
          </Text>

          {(data.iucn != null) | (data.sachdo != null) | (data.nd != null) ? (
            <>
              <Text
                style={{
                  marginLeft: 14,
                  marginTop: 14,
                  color: 'rgba(13, 15, 35, 0.8)',
                  fontSize: Dimension.fontSize(16),
                  fontWeight: '700',
                }}>
                Cấp độ bảo tồn
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 14,
                  marginTop: 8,
                  flex: 1,
                }}>
                <View style={{flex: 2}}>
                  <Text
                    style={{
                      color: 'rgba(13, 15, 35, 0.8)',
                      fontSize: Dimension.fontSize(14),
                    }}>
                    IUCN:
                  </Text>
                </View>
                <View style={{flex: 3}}>
                  <Text
                    style={{
                      color: '#dc3545',
                      fontSize: Dimension.fontSize(14),
                      fontWeight: 'bold',
                    }}>
                    {data.iucn}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 14,
                  marginTop: 8,
                  flex: 1,
                }}>
                <View style={{flex: 2}}>
                  <Text
                    style={{
                      color: 'rgba(13, 15, 35, 0.8)',
                      fontSize: Dimension.fontSize(14),
                    }}>
                    NĐ 84/2021:
                  </Text>
                </View>
                <View style={{flex: 3}}>
                  <Text
                    style={{
                      color: '#dc3545',
                      fontSize: Dimension.fontSize(14),
                      fontWeight: 'bold',
                    }}>
                    {data.nd}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 14,
                  marginTop: 8,
                  flex: 1,
                }}>
                <View style={{flex: 2}}>
                  <Text
                    style={{
                      color: 'rgba(13, 15, 35, 0.8)',
                      fontSize: Dimension.fontSize(14),
                    }}>
                    Sách đỏ:
                  </Text>
                </View>
                <View style={{flex: 3}}>
                  <Text
                    style={{
                      color: '#dc3545',
                      fontSize: Dimension.fontSize(14),
                      fontWeight: 'bold',
                    }}>
                    {data.sachdo}
                  </Text>
                </View>
              </View>
            </>
          ) : null}
          <Text style={styles.font2}>Thông tin chung</Text>
          <View style={styles.font1}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.8)',
                  fontSize: Dimension.fontSize(14),
                }}>
                Tên Ngành La Tinh:
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.6)',
                  fontSize: Dimension.fontSize(14),
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}>
                {data.nganhlatin}
              </Text>
            </View>
          </View>
          <View style={styles.font1}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.8)',
                  fontSize: Dimension.fontSize(14),
                }}>
                Tên Ngành Việt Nam:
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.6)',
                  fontSize: Dimension.fontSize(14),
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}>
                {data.nganhtv}
              </Text>
            </View>
          </View>

          <View style={styles.font1}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.8)',
                  fontSize: Dimension.fontSize(14),
                }}>
                Tên Lớp La Tinh:
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.6)',
                  fontSize: Dimension.fontSize(14),
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}>
                {data.loplatin}
              </Text>
            </View>
          </View>

          <View style={styles.font1}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.8)',
                  fontSize: Dimension.fontSize(14),
                }}>
                Tên Lớp Việt Nam:
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.6)',
                  fontSize: Dimension.fontSize(14),
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}>
                {data.loptv}
              </Text>
            </View>
          </View>

          <View style={styles.font1}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.8)',
                  fontSize: Dimension.fontSize(14),
                }}>
                Tên Bộ La Tinh:
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.6)',
                  fontSize: Dimension.fontSize(14),
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}>
                {data.bolatin}
              </Text>
            </View>
          </View>

          <View style={styles.font1}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.8)',
                  fontSize: Dimension.fontSize(14),
                }}>
                Tên Bộ Việt Nam:
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.6)',
                  fontSize: Dimension.fontSize(14),
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}>
                {data.botv}
              </Text>
            </View>
          </View>

          <View style={styles.font1}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.8)',
                  fontSize: Dimension.fontSize(14),
                }}>
                Tên Họ La Tinh:
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.6)',
                  fontSize: Dimension.fontSize(14),
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                }}>
                {data.holatin}
              </Text>
            </View>
          </View>

          <View style={styles.font1}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.8)',
                  fontSize: Dimension.fontSize(14),
                }}>
                Tên Họ Việt Nam:
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.6)',
                  fontSize: Dimension.fontSize(14),
                  fontWeight: 'bold',
                }}>
                {data.hotv}
              </Text>
            </View>
          </View>

          <View style={styles.font1}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.8)',
                  fontSize: Dimension.fontSize(14),
                }}>
                Tên Chi La Tinh:
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.6)',
                  fontSize: Dimension.fontSize(14),
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                }}>
                {data.chilatin}
              </Text>
            </View>
          </View>

          <View style={styles.font1}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.8)',
                  fontSize: Dimension.fontSize(14),
                }}>
                Tên Chi Việt Nam:
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'rgba(13, 15, 35, 0.6)',
                  fontSize: Dimension.fontSize(14),
                  fontWeight: 'bold',
                }}>
                {data.chitv}
              </Text>
            </View>
          </View>

          <Text style={styles.font2}>Hình ảnh</Text>
          <TouchableOpacity
            onPress={() => {
              setImageViewVisible(true);
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 8,
              flex: 1,
            }}>
            {data.hinh1 != '' && (
              <View
                style={{
                  flex: 1,
                  width: width / 3 - 25,
                  height: width / 3 - 25,
                  paddingHorizontal: 5,
                }}>
                <Image
                  source={{
                    uri: data.link + data.hinh1,
                  }}
                  style={{height: width / 3 - 25, width: width / 3 - 25}}
                />
              </View>
            )}
            {data.hinh2 != '' && (
              <View
                style={{
                  flex: 1,
                  width: width / 3 - 25,
                  height: width / 3 - 25,
                }}>
                <Image
                  source={{
                    uri: data.link + data.hinh2,
                  }}
                  style={{height: width / 3 - 25, width: width / 3 - 25}}
                />
              </View>
            )}
            {data.hinh3 != '' && (
              <View
                style={{
                  flex: 1,
                  width: width / 3 - 25,
                  height: width / 3 - 25,
                  paddingHorizontal: 5,
                }}>
                <Image
                  source={{
                    uri: data.link + data.hinh3,
                  }}
                  style={{height: width / 3 - 25, width: width / 3 - 25}}
                />
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.font2}>Đặc điểm</Text>
          <Text
            style={{
              marginHorizontal: 14,
              color: 'rgba(13, 15, 35, 0.6)',
              fontSize: Dimension.fontSize(16),
              marginTop: 8,
              textAlign: 'justify',
            }}>
            {data.dacdiem}
          </Text>

          <Text style={styles.font2}>Giá trị</Text>
          <Text
            style={{
              marginHorizontal: 14,
              color: 'rgba(13, 15, 35, 0.6)',
              fontSize: Dimension.fontSize(16),
              marginTop: 8,
              textAlign: 'justify',
            }}>
            {data.giatri}
          </Text>

          <Text style={styles.font2}>Phân bố</Text>
          <Text
            style={{
              marginHorizontal: 14,
              color: 'rgba(13, 15, 35, 0.6)',
              fontSize: Dimension.fontSize(16),
              marginTop: 8,
              textAlign: 'justify',
            }}>
            {data.phanbo}
          </Text>

          <Text style={styles.font2}>Nguồn</Text>
          <Text
            style={{
              marginHorizontal: 14,
              color: 'rgba(13, 15, 35, 0.6)',
              fontSize: Dimension.fontSize(16),
              marginTop: 8,
              textAlign: 'left',
            }}>
            {data.nguon}
          </Text>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Dimension.setWidth(3),
    marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
  },

  headerContainer: {
    width: '8%',
  },
  backImg: {
    width: 25,
    height: 25,
    tintColor: 'Black',
  },
  imageMain: {
    width: 380,
    height: 220,
    borderRadius: 5,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackGroud: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  picker: {
    margin: 3,
  },
  titleText: {
    fontSize: Dimension.fontSize(28),
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#655',
    paddingBottom: 10,
  },
  headingText: {
    fontSize: Dimension.fontSize(18),
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#655',
    paddingBottom: 7,
    paddingTop: 5,
  },
  textContent: {
    textAlign: 'justify',
  },
  font1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 14,
    marginTop: 8,
    flex: 1,
  },
  font2: {
    marginLeft: 14,
    marginTop: 14,
    color: 'rgba(13, 15, 35, 0.8)',
    fontSize: Dimension.fontSize(16),
    fontWeight: '700',
  },
});

export default SpecieDetailScreen;
