import React, {useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import {shadowIOS} from '../../contants/propsIOS';
import {fontDefault, newsMvURL, newsURL} from '../../contants/Variable';
import IframeRenderer, {iframeModel} from '@native-html/iframe-plugin';
import RenderHtml from 'react-native-render-html';
import WebView from 'react-native-webview';
import {IOSDownload, shareAndroid} from '../../utils/download';
import {getDetailNew} from '../../redux/apiRequest';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {TextRenderSkeleton} from '../../components/Skeleton';

const DetailNewsScreen = ({navigation, route}) => {
  const {item} = route.params;
  const {width} = useWindowDimensions();
  const id = item.id;
  const [html, setHtml] = useState(item.content);
  const [loading, setLoading] = useState(true);

  const fetchDetailNew = async () => {
    const data = await getDetailNew(id);
    setHtml(data.content);
    setLoading(false);
  };

  useLayoutEffect(() => {
    if (!item.content) {
      fetchDetailNew();
    } else {
      setLoading(false);
    }
  }, []);

  const checkURL =
    item.screenName === 'Chỉ đạo điều hành'
      ? newsMvURL
      : item.screenName === 'Tin tức F4'
      ? newsURL
      : null;

  const renderers = {
    iframe: IframeRenderer,
  };

  const customHTMLElementModels = {
    iframe: iframeModel,
  };

  const source = {
    html: `${html}`,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainImgContainer}>
        <Image
          resizeMode="cover"
          src={
            (checkURL ? checkURL + item.avatar : item.avatar) ||
            'https://media.cntraveler.com/photos/5eb18e42fc043ed5d9779733/16:9/w_4288,h_2412,c_limit/BlackForest-Germany-GettyImages-147180370.jpg'
          }
          style={{
            width: Dimension.setWidth(100),
            height: Dimension.setHeight(30),
          }}
        />
      </View>

      <TouchableOpacity
        style={styles.backContainer}
        onPress={() => navigation.goBack()}>
        <Image
          source={Images.back}
          style={{width: 20, height: 20, tintColor: '#fff'}}
        />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.contentDetailContainer}>
        <View style={styles.titleContainer}>
          <Text
            style={{
              fontSize: Dimension.fontSize(18),
              fontFamily: Fonts.SF_SEMIBOLD,
              textAlign: 'justify',
              ...fontDefault,
            }}>
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: Dimension.fontSize(14),
              fontFamily: Fonts.SF_REGULAR,
              color: Colors.DEFAULT_BLACK,
              opacity: 0.6,
              marginTop: Dimension.setHeight(1),
            }}>
            {item.date_created || item.createDate.replace(/\s+/g, ' - ')}
          </Text>
        </View>

        <View style={styles.descriptionContainer}>
          {loading ? (
            <TextRenderSkeleton />
          ) : (
            <RenderHtml
              contentWidth={width}
              renderers={renderers}
              WebView={WebView}
              source={source}
              customHTMLElementModels={customHTMLElementModels}
              renderersProps={{
                iframe: {
                  scalesPageToFit: true,
                  webViewProps: {},
                },
              }}
            />
          )}
          {item?.files && (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: Dimension.fontSize(15),
                  fontFamily: Fonts.SF_MEDIUM,
                  marginRight: Dimension.setWidth(1),
                }}>
                Tệp đính kèm:
              </Text>
              <Text
                style={{
                  fontSize: Dimension.fontSize(15),
                  fontFamily: Fonts.SF_BOLD,
                  textDecorationLine: 'underline',
                  color: Colors.DEFAULT_GREEN,
                }}
                onPress={() => {
                  Platform.OS == 'ios'
                    ? IOSDownload(newsMvURL + item.files.filename)
                    : shareAndroid(newsMvURL + item.files.filename);
                }}>
                {item.files.hyperlink}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  mainImgContainer: {
    position: 'absolute',
  },

  backContainer: {
    position: 'absolute',
    top: Dimension.setHeight(8),
    left: Dimension.setWidth(5),
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: Colors.DEFAULT_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },

  headerBtn: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: Colors.DEFAULT_GREEN,
  },

  contentDetailContainer: {
    flex: 1,
    position: 'absolute',
    height: Dimension.setHeight(100),
    top: Dimension.setHeight(26),
    backgroundColor: '#fff',
    borderRadius: 36,
    borderWidth: 0.5,
    borderColor: Colors.INACTIVE_GREY,
    elevation: 5,
    ...shadowIOS,
  },

  titleContainer: {
    justifyContent: 'center',
    marginTop: Dimension.setHeight(2.2),
    marginHorizontal: Dimension.setWidth(5),
  },

  descriptionContainer: {
    flex: 1,
    paddingHorizontal: Dimension.setWidth(3),
    paddingBottom: Dimension.setHeight(28),
    width: wp('100%'),
  },

  header: {
    fontSize: Dimension.fontSize(22),
    fontFamily: Fonts.SF_SEMIBOLD,
    marginTop: Dimension.setHeight(1),
    padding: 5,
  },

  content: {
    fontSize: Dimension.fontSize(18),
    fontFamily: Fonts.SF_REGULAR,
    justifyContent: 'space-around',
    marginVertical: 5,
    textAlign: 'justify',
    ...fontDefault,
  },
});

export default DetailNewsScreen;
