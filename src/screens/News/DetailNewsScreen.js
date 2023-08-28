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
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import {shadowIOS} from '../../contants/propsIOS';
import {fontDefault, newsURL} from '../../contants/Variable';
import IframeRenderer, {iframeModel} from '@native-html/iframe-plugin';
import RenderHtml from 'react-native-render-html';
import WebView from 'react-native-webview';

const DetailNewsScreen = ({navigation, route}) => {
  const {item} = route.params;
  const {width} = useWindowDimensions();

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
          src={newsURL + item.avatar}
          style={{
            width: Dimension.setWidth(100),
            height: Dimension.setHeight(26),
          }}
        />
      </View>

      <View style={styles.backHeartContainer}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}>
          <Image
            source={Images.back}
            style={{width: 18, height: 16, tintColor: '#fff'}}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.contentDetailContainer}>
        <View style={styles.titleContainer}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: Fonts.SF_SEMIBOLD,
              textAlign: 'justify',
              ...fontDefault,
            }}>
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 14,
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
    height: Dimension.setHeight(26),
  },

  backHeartContainer: {
    width: 60,
    height: 60,
    left: 10,
    top: Platform.OS == 'ios' ? -20 : 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerBtn: {
    padding: 10,
    borderRadius: 100,
    backgroundColor: Colors.DEFAULT_GREEN,
  },

  contentDetailContainer: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: Dimension.setHeight(100),
    top: Dimension.setHeight(22),
    backgroundColor: '#fff',
    borderRadius: 36,
    borderWidth: 0.8,
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
    fontSize: 22,
    fontFamily: Fonts.SF_SEMIBOLD,
    marginTop: Dimension.setHeight(1),
    padding: 5,
    textAlign: 'justify',
  },

  content: {
    fontSize: 18,
    fontFamily: Fonts.SF_REGULAR,
    justifyContent: 'space-around',
    marginVertical: 5,
    textAlign: 'justify',
    ...fontDefault,
  },
});

export default DetailNewsScreen;
