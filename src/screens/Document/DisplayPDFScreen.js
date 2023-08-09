import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import Pdf from 'react-native-pdf';
import Images from '../../contants/Images';
import Dimension from '../../contants/Dimension';
import Colors from '../../contants/Colors';

const DisplayPDF = ({navigation, route}) => {
  const {link} = route.params;
  const source = {
    uri: link,
    cache: true,
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={{}}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            source={Images.back}
            style={{width: 25, height: 25, tintColor: Colors.DARK_FIVE}}
          />
        </TouchableOpacity>
      </View>
      <Pdf trustAllCerts={false} source={source} style={styles.pdf} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  headerContainer: {
    position: 'absolute',
    left: Dimension.setWidth(4),
    top: Dimension.setHeight(7),
    zIndex: 999,
  },
});

export default DisplayPDF;
