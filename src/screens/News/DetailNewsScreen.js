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
                webViewProps: {
                  /* Any prop you want to pass to iframe WebViews */
                },
              },
            }}
          />
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
    marginTop: Dimension.setHeight(6),
    marginLeft: Dimension.setWidth(5),
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: Colors.DEFAULT_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: Dimension.setHeight(20),
    flex: 1,
    paddingHorizontal: Dimension.setWidth(3),
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
