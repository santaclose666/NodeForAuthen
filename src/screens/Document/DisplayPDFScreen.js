import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import Pdf from 'react-native-pdf';
import Images from '../../contants/Images';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';

const DisplayPDF = ({navigation, route}) => {
  const {link} = route.params;
  const source = {
    uri: link,
    cache: true,
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.headerContainer}
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={Images.back}
          style={{width: 18, height: 18, tintColor: Colors.WHITE}}
        />
      </TouchableOpacity>
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
    left: Dimension.setWidth(5),
    top: Dimension.setHeight(7),
    zIndex: 999,
    padding: 10,
    borderRadius: 100,
    backgroundColor: Colors.DEFAULT_GREEN,
  },
});

export default DisplayPDF;
