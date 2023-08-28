import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import {shadowIOS} from '../../contants/propsIOS';
import {fontDefault} from '../../contants/Variable';

const DetailNewsScreen = ({navigation, route}) => {
  const {item} = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainImgContainer}>
        <Image
          resizeMode="cover"
          source={item.mainImg}
          style={{
            width: Dimension.setWidth(100),
            height: Dimension.setHeight(40),
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
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.SF_REGULAR,
              color: Colors.DEFAULT_BLACK,
              opacity: 0.6,
              marginVertical: Dimension.setHeight(1),
            }}>
            {item.date}
          </Text>
        </View>

        <View style={styles.descriptionContainer}>
          {item.header1 && <Text style={styles.header}>{item.header1}</Text>}
          {item.content1 && <Text style={styles.content}>{item.content1}</Text>}
          {item.header2 && <Text style={styles.header}>{item.header2}</Text>}
          {item.content2 && <Text style={styles.content}>{item.content2}</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#f2f2f2',
  },

  mainImgContainer: {
    position: 'absolute',
    height: Dimension.setHeight(40),
  },

  backHeartContainer: {
    width: 60,
    height: 60,
    left: 10,
    top: -20,
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
    height: Dimension.setHeight(70),
    top: Dimension.setHeight(33),
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
    marginVertical: Dimension.setHeight(2),
  },

  descriptionContainer: {
    marginHorizontal: Dimension.setWidth(6),
    marginBottom: Dimension.setHeight(14),
    flexWrap: 'wrap',
    width: '90%',
    flexDirection: 'row',
    flex: 1,
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
