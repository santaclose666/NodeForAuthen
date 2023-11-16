import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import React from 'react';
import LinearGradientUI from '../../components/LinearGradientUI';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import {imgDefault, fontDefault} from '../../contants/Variable';
import Dimension from '../../contants/Dimension';

const consultant = [
  'GS.TS. Vương Văn Quỳnh',
  'GS.TS. Phạm Văn Điển',
  'PGS.TS. Trần Quang Bảo',
];

const developer = [
  'Lê Sỹ Doanh',
  'Phạm Văn Duẩn',
  'Nguyễn Văn Thị',
  'Lã Nguyên Khang',
  'Phạm Quang Dương',
  'Trần Văn Hải',
  'Bùi Trung Hiếu',
  'Nguyễn Khả Đăng',
  'Lê Hữu Cường',
  'Vũ Thị Kim Oanh',
  'Phạm Văn Huân',
  'Kiều Đăng Anh',
  'Hoàng Văn Khiên',
  'Nguyễn Hữu Văn',
  'Nguyễn Thị Mai Dương',
  'Vũ Thị Thìn',
  'Nguyễn Văn Hiếu',
  'Nguyễn Văn Tùng',
  'Hồ Thu Phương',
  'Nguyễn Sơn Hà',
  'Phan Ngọc Sơn',
  'Nguyễn Vĩnh Nam',
  'Bàn Thị Thoa',
  'Lê Sỹ Hòa',
  'Nguyễn Song Anh',
];

const ContributorScreen = ({navigation}) => {
  return (
    <LinearGradientUI>
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
                fontSize: Dimension.fontSize(18),
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
              <Text style={styles.h1}>Chuyên gia tư vấn:</Text>
              {consultant.map((item, index) => {
                <Text key={index} style={styles.h2}>
                  {item}
                </Text>;
              })}
            </View>
            <View style={styles.paragrap}>
              <Text style={styles.h1}>Thành viên phát triển:</Text>
              {developer.map((item, index) => {
                <Text key={index} style={styles.h2}>
                  {item}
                </Text>;
              })}
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
    </LinearGradientUI>
  );
};

export default ContributorScreen;

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
