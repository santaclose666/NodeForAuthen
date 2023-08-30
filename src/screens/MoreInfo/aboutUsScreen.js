import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  StatusBar,
  ImageBackground,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import {imgDefault, fontDefault} from '../../contants/Variable';
import Dimension from '../../contants/Dimension';

const aboutUsScreen = ({navigation}) => {
  return (
    <LinearGradient
      colors={['rgba(153,255,153,0.9)', 'rgba(255,204,204,0.8)']}
      style={{flex: 1, padding: 3}}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
        <ScrollView>
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
                fontSize: 18,
                ...fontDefault,
              }}>
              Thông tin tác giả
            </Text>
            <View />
          </View>

          <View
            style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
            <Image style={styles.mainLogo} source={Images.logo} />
            <View style={styles.paragrap}>
              <Text style={styles.h1}>Nhóm tác giả:</Text>
              <Text style={styles.h2}>1. GS.TS. Vương Văn Quỳnh</Text>
              <Text style={styles.h2}>2. NGƯT.GS.TS. Phạm Văn Điển</Text>
              <Text style={styles.h2}>3. PGS.TS. Trần Quang Bảo</Text>
              <Text style={styles.h2}>4. TS. Lê Sỹ Doanh</Text>
              <Text style={styles.h2}>5. TS. Phạm Văn Duẩn</Text>
              <Text style={styles.h2}>6. Ths. Nguyễn Văn Thị</Text>
              <Text style={styles.h2}>7. TS. Lã Nguyên Khang</Text>
              <Text style={styles.h2}>8. Ths. Phạm Quang Dương</Text>
              <Text style={styles.h2}>9. Ths. Trần Văn Hải</Text>
              <Text style={styles.h2}>10. Ths. Bùi Trung Hiếu</Text>
              <Text style={styles.h2}>11. CN. Lê Hữu Cường</Text>
              <Text style={styles.h2}>12. CN. Nguyễn Khả Đăng</Text>
            </View>

            <View style={styles.paragrap}>
              <Text style={styles.h1}>Đơn vị thực hiện:</Text>
              <View style={styles.rowView}>
                <Image source={Images.IFEELogo} style={styles.smallIcon} />
                <Text style={styles.h2}>
                  Viện Sinh thái rừng và Môi trường - Trường Đại học Lâm nghiệp
                </Text>
              </View>
              <Image source={Images.IFEETeam} style={styles.themeUnit} />
              <View style={styles.rowView}>
                <Image source={Images.XMGLogo} style={styles.smallIcon} />
                <Text style={styles.h2}>
                  Công ty Cổ phần thương mại công nghệ Xuân Mai Green{' '}
                </Text>
              </View>
              <Image source={Images.XMGTeam} style={styles.themeUnit} />
            </View>
            <View style={styles.paragrap}>
              <Text style={styles.h1}>Nguồn dữ liệu</Text>
              <Text style={styles.h2}>1. Cục Lâm nghiệp</Text>
              <Text style={styles.h2}>2. Cục Kiểm lâm</Text>
              <Text style={styles.h2}>
                3. Quỹ Bảo vệ và Phát triển rừng Việt Nam
              </Text>
              <Text style={styles.h2}>
                Các Quỹ tỉnh: Nghệ An, Sơn La, Hoà Bình, Hà Giang, Bình Thuận...
              </Text>
              <Text style={styles.h2}>
                Chi cục Kiểm lâm các tỉnh: Hà Nội, Ninh Bình, Hoà Bình, Hà
                Giang, Gia Lai, Nghệ An...
              </Text>
              <Text style={styles.h2}></Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default aboutUsScreen;

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
    width: '92%',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  h1: {
    padding: 12,
    fontFamily: Fonts.SF_BOLD,
    fontSize: 17,
    fontWeight: 'bold',
  },
  h2: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: 17,
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
