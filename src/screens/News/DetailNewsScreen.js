import React from 'react';
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
import ReactNativeBlobUtil from 'react-native-blob-util';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import {shadowIOS} from '../../contants/propsIOS';
import {fontDefault, newsMvURL, newsURL} from '../../contants/Variable';
import IframeRenderer, {iframeModel} from '@native-html/iframe-plugin';
import RenderHtml from 'react-native-render-html';
import WebView from 'react-native-webview';
import {AndroidDownload, IOSDownload, shareAndroid} from '../../utils/download';

const DetailNewsScreen = ({navigation, route}) => {
  const {item} = route.params;
  const {width} = useWindowDimensions();

  const checkURL =
    item.screenName === 'Chỉ đạo điều hành' ? newsMvURL : newsURL;

  const source = {
    html: `${item.content}`,
  };

  const renderers = {
    iframe: IframeRenderer,
  };

  const customHTMLElementModels = {
    iframe: iframeModel,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainImgContainer}>
        <Image
          resizeMode="cover"
          src={checkURL + item.avatar}
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
            {item.date_created}
          </Text>
        </View>

        <View style={styles.descriptionContainer}>
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
    top: Dimension.setHeight(25),
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
    marginHorizontal: Dimension.setWidth(6),
  },

  descriptionContainer: {
    flex: 1,
    paddingHorizontal: Dimension.setWidth(3),
    paddingBottom: Dimension.setHeight(28),
  },

  header: {
    fontSize: Dimension.fontSize(22),
    fontFamily: Fonts.SF_SEMIBOLD,
    marginTop: Dimension.setHeight(1),
    padding: 5,
    textAlign: 'justify',
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
