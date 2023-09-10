import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Linking,
} from 'react-native';
import React from 'react';
import LinearGradientUI from '../../components/LinearGradientUI';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import {imgDefault, fontDefault} from '../../contants/Variable';
import Dimension from '../../contants/Dimension';
import Colors from '../../contants/Colors';

const ContributionDataScreen = ({navigation}) => {
  return (
    <LinearGradientUI>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={Images.back}
              style={{width: 25, height: 18, ...imgDefault}}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: Fonts.SF_BOLD,
              fontSize: Dimension.fontSize(18),
              ...fontDefault,
            }}>
            CHIA SẺ DỮ LIỆU VÌ CỘNG ĐỒNG
          </Text>
          <View></View>
        </View>

        <View
          style={{
            flex: 1,
            marginTop: 40,
          }}>
          <Text style={styles.paragrap}>
            Vì mục tiêu phát triển cộng đồng Lâm nghiệp và chia sẻ dữ liệu đến
            những người quan tâm,chung tôi rất cần thêm những đóng góp từ cộng
            đồng người dùng ứng dụng.
          </Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://4forestry.xuanmaijsc.vn/chia-se/');
            }}>
            <Text style={styles.paragrap}>
              Nếu bạn có các tài liệu dữ liệu muốn được chi sẻ với mọi người vui
              lòng truy cập theo địa chỉ{' '}
              <Text style={{color: 'red', fontStyle: 'italic'}}>
                forestry.xuanmaijsc.vn
              </Text>
            </Text>
          </TouchableOpacity>
          <Text style={styles.paragrap}>Chân thành cảm ơn!</Text>
        </View>
      </SafeAreaView>
    </LinearGradientUI>
  );
};

export default ContributionDataScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Dimension.setHeight(2),
    paddingHorizontal: Dimension.setWidth(2.2),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: Dimension.setHeight(1.4),
    borderRadius: 25,
    marginTop: Platform.OS == 'android' ? 10 : 0,
  },
  mainLogo: {
    width: 150,
    height: 150,
    borderRadius: 20,
    marginVertical: 15,
  },
  paragrap: {
    textAlign: 'justify',
    fontSize: Dimension.fontSize(18),
    fontFamily: Fonts.SF_MEDIUM,
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: Colors.DEFAULT_BLACK,
    opacity: 0.8,
  },
  h1: {
    padding: 12,
    fontFamily: Fonts.SF_BOLD,
    fontSize: Dimension.fontSize(17),
    fontWeight: 'bold',
  },
  h2: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: Dimension.fontSize(17),
    paddingVertical: 1,
  },
  smallIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    marginRight: 15,
  },
  rowView: {
    flexDirection: 'row',
    width: '85%',
    alignItems: 'center',
    paddingBottom: 8,
  },
  themeUnit: {
    width: '80%',
    height: Dimension.setHeight(25),
    borderRadius: 14,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'white',
    paddingVertical: 8,
  },
});
