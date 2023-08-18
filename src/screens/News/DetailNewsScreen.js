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

const DetailNewsScreen = ({navigation, route}) => {
  const {item} = route.params;
  console.log(item);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
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
          <Image source={Images.back} style={{width: 20, height: 20}} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.headerBtn}>
          <Image
            source={Images.heart}
            style={{width: 20, height: 20, tintColor: 'red'}}
          />
        </TouchableOpacity> */}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.contentDetailContainer}>
        <View style={styles.titleContainer}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.SF_SEMIBOLD,
            }}>
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: Fonts.SF_REGULAR,
              color: Colors.INACTIVE_GREY,
            }}>
            {item.date}
          </Text>
          {item.subImg && (
            <View>
              <Image
                resizeMode="cover"
                source={item.subImg}
                style={{
                  width: '100%',
                  height: Dimension.setHeight(25),
                  borderRadius: 6,
                }}
              />
            </View>
          )}
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
  },

  mainImgContainer: {
    position: 'absolute',
    height: Dimension.setHeight(40),
  },

  backHeartContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginHorizontal: Dimension.setWidth(5),
    marginTop: Dimension.setHeight(3),
  },

  headerBtn: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 10,
    ...shadowIOS,
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
  },
});

export default DetailNewsScreen;
