import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import unidecode from 'unidecode';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import Icons from '../../contants/Icons';
import {shadowIOS} from '../../contants/propsIOS';

const AllNewsScreen = ({navigation}) => {
  const [featureIndex, setFeatureIndex] = useState(0);
  const [newsArr, setNewsArr] = useState([
    {
      topic: 'Chính sách',
      mainImg: require('../../assets/images/mainTopic1.png'),
      subImg: null,
      location: 'Tây Nguyên',
      date: '16/06/2011',
      name: 'Ứng dụng công nghệ số trong thực hiện chi trả dịch vụ môi trường rừng',
      header1: 'Số hóa dữ liệu chi trả DVMTR',
      content1:
        'Content: Việc duy trì bảo vệ khoảng 217.658 ha rừng cung ứng DVMTR trên địa bàn tỉnh Đắk Lắk với 24 chủ rừng là tổ chức, 13 UBND cấp xã/phường, 75  hộ gia đình, cá nhân và 54 cộng đồng dân cư thôn được Nhà nước giao đất, giao rừng là rất khó khăn. Theo kế hoạch chuyển đổi số của Sở Nông nghiệp và PTNT, việc theo dõi, quản lý diện tích rừng được chi trả tiền DVMTR cần được thực hiện khoa học, đảm bảo nhanh chóng, chính xác, phù hợp với xu thế về chuyển đổi số quốc gia đến năm 2025, định hướng đến năm 2030.',
      header2: 'Hướng tới sử dụng công nghệ số trong trả tiền DVMTR',
      content2:
        'Năm 2019, Quỹ Bảo vệ và phát triển rừng tỉnh thực hiện chi trả tiền DVMTR qua tài khoản ngân hàng, giao dịch điện tử đối với các chủ rừng là tổ chức, UBND các xã, thị trấn và hộ gia đình, cộng đồng, nhóm hộ nhận khoán bảo vệ rừng. Việc chi trả tiền DVMTR qua tài khoản góp phần đơn giản hóa thủ tục, đảm bảo tính công khai, minh bạch, an toàn, giúp chủ rừng thuận lợi hơn khi nhận tiền, tiết kiệm được thời gian, chi phí đi lại.',
    },
    {
      topic: 'Chỉ đạo điều hành',
      mainImg: require('../../assets/images/mainTopic2.png'),
      subImg: require('../../assets/images/subTopic2.png'),
      location: 'Tây Ninh',
      date: '16/06/2011',
      name: 'Tổng cục Lâm nghiệp: Tổ chức Hội nghị Công tác bảo vệ rừng và phòng cháy, chữa cháy rừng toàn quốc năm 2022 và triển khai nhiệm vụ năm 2023',
      header1: null,
      content1: `Theo báo cáo 9 tháng đầu năm 2022, công tác quản lý bảo vệ rừng và phòng cháy chữa cháy rừng có nhiều chuyển biến tích cực, các chỉ tiêu số vụ vi phạm và diện tích rừng bị ảnh hưởng tiếp tục giảm mạnh so với cùng kỳ các năm trước, cụ thể: diện tích rừng bị tác động giảm 63% so với cùng kỳ năm 2021; phòng cháy, chữa cháy rừng, xảy ra 46 vụ, giảm 143 vụ (giảm 76%), diện tích rừng bị ảnh hưởng là 30 ha (giảm 98%) so với cùng kỳ năm 2021.
      Hội nghị cũng đã đề ra kế hoạch thực hiện nhiệm vụ 03 tháng cuối năm 2022 và phương hướng nhiệm vụ năm 2023, tập trung vào các nhiệm vụ trọng tâm sau: Tập trung thực hiện đảm bảo hoàn thành các chỉ tiêu kế hoạch năm 2022; đẩy mạnh các hoạt động về công tác quản lý bảo vệ rừng và phòng cháy, chữa cháy rừng; Tiếp tục nghiêm túc thực hiện đóng cửa khai thác gỗ rừng tự nhiên; kiểm soát chặt chẽ chuyển mục đích sử dụng rừng sang mục đích khác.
      Ngoài ra, các đại biểu đã bổ sung, góp ý, đề xuất nhiều giải pháp phát sinh từ thực tế đề nghị cấp có thẩm quyền giải quyết gỡ vướng cho các địa phương, gồm: Về các cơ chế chính sách trong lĩnh vực lâm nghiệp; về tình hình công chức kiểm lâm và lực lượng chuyên trách bảo vệ rừng bỏ việc, thôi việc tại các địa phương.
      `,
      header2: null,
      content2: null,
    },
    {
      topic: 'Khoa học công nghệ',
      mainImg: require('../../assets/images/mainTopic3.png'),
      subImg: require('../../assets/images/subTopic3.png'),
      location: 'Tây Tạng',
      date: '16/06/2011',
      name: 'Ứng dụng SMART trong quản lý rừng và đa dạng sinh học tại Việt Nam',
      header1: null,
      content1:
        'Xuất phát từ thực tế trên, từ năm 2016, Tổ chức Hợp tác Phát triển Đức GIZ phối hợp với Tổng cục Lâm nghiệp Việt Nam và các bên liên quan khác trong khuôn khổ dự án "Bảo tồn và sử dụng bền vững đa dạng sinh học rừng và các dịch vụ hệ sinh thái ở Việt Nam" (dự án BIO) đã tiến hành chuẩn hóa mô hình dữ liệu SMART và giới thiệu sổ tay hướng dẫn áp dụng SMART trong toàn bộ hệ thống vườn quốc gia và khu bảo tồn. Đến năm 2021, mô hình dữ liệu SMART chuẩn và bộ tài liệu hướng dẫn kỹ thuật đã sẵn sàng để triển khai trên toàn quốc.',
      header2: null,
      content2: null,
    },
    {
      topic: 'Bảo vệ rừng',
      mainImg: require('../../assets/images/mainTopic4.png'),
      subImg: null,
      location: 'Tây Tiến',
      date: '16/06/2011',
      name: 'Hội nghị đánh giá chính sách đầu tư và phát triển rừng, chế biến và thương mại lâm sản',
      header1: null,
      content1: `Nhờ chính sách đầu tư về lâm nghiệp thời gian qua đã đạt được nhiều kết quả tích cực. Cụ thể, ngành lâm nghiệp đã nâng độ che phủ rừng từ 40,84% lên 41,89 năm 2019, năm 2020 phấn đấu độ che phủ rừng sẽ đạt 42%. Giá trị sản xuất lâm nghiệp tăng bình quân khoảng 5,73%/năm, năm 2020 dự kiến tăng 5,5%. Nâng tổng kim ngạch xuất khẩu đồ gỗ và lâm sản tăng từ 7,1 tỷ USD năm 2015 lên 11,2 tỷ USD năm 2019, dự kiến năm 2020 đạt 12 tỷ USD. Về trồng rừng tập trung được 1,133 triệu ha, bình quân 227.000 ha/năm; 284,2 triệu cây phân tán, trung bình 57 triệu cây/năm, khoanh nuôi tái sinh bình quân 287.000 ha/năm…
        Các chính sách đầu tư cho lâm nghiệp thời gian qua đã góp phần quản lý, bảo vệ tốt diện tích rừng rự nhiện, chất lượng rừng được cải thiện, nhiều diện tích rừng tự nhiên đã có trữ lượng từ trung bình đến giàu; hình thành được vùng nguyên liệu gỗ tập trung gắn với công nghiệp chế biến gỗ. Gỗ và các sản phẩm từ gỗ đang là mặt hàng có kim ngạch xuất khẩu lớn trong các nhóm các ngành hàng nông sản.
        `,
      header2: null,
      content2: null,
    },
    {
      topic: 'Đa dạng sinh học',
      mainImg: require('../../assets/images/mainTopic5.png'),
      subImg: null,
      location: 'Tây Mỗ',
      date: '16/06/2011',
      name: 'Hệ thống giám sát, cảnh báo nguy cơ cháy rừng tỉnh Hà Giang',
      header1: 'Giới thiệu chung',
      content1:
        'Hà Giang có tổng diện tích rừng tự nhiên là 793.000 ha rừng, là một trong những tỉnh có diện tích rừng lớn trong nước. Với tình trạng trái đất mỗi năm một nóng lên đặc biệt là vào mùa nắng nóng, với nền nhiệt cao dẫn đến nguy cơ cháy rừng luôn ở mức cao, đặc biệt là các rừng có nhiều tre, nứa, khi cháy tốc độ lan nhanh . Trên cơ sở đó Chi cục Kiểm lâm tỉnh Hà Giang đã phối hợp cùng Liên doanh Viện sinh thái rừng và Môi trường – Công ty cổ phần hệ thống thông tin lâm nghiệp (gọi tắt là IFEE-FIS) phát triển hệ thống dự báo, cảnh báo nguy cơ cháy rừng trên nền tảng website sẽ giúp cho người dùng có thể truy cập thông tin bất cứ lúc nào và ở bất cứ đâu, từ đó chủ động việc chỉ đạo công tác tuần tra, kiểm soát ngăn ngừa các hành vi dùng lửa bất cẩn trong rừng và gần rừng, giúp giảm thiểu được nguy cơ cháy rừng.',
      header2: 'Các yếu tố xác định cấp nguy cơ cháy rừng',
      content2:
        'Bộ bảng tra cấp nguy cơ cháy rừng theo 3 nhân tố theo điều kiện thời tiết (nhiệt độ, độ ẩm và số ngày không mưa) cho một số trạng thái rừng chính của tỉnh Hà Giang giúp xác định cấp độ nguy cơ cháy rừng dựa trên các thông số thời tiết như nhiệt độ, độ ẩm và số ngày không mưa. Bảng tra giúp cho các cơ quan quản lý, cán bộ phụ trách có thể chủ động tính toán được cấp nguy cơ cháy, hiệu chỉnh cấp cháy (nếu cần thiết) tương ứng với điều kiện thời tiết thực tế trên địa bàn.',
    },
    {
      topic: 'Dịch vụ môi trường rừng',
      mainImg: require('../../assets/images/mainTopic6.png'),
      subImg: null,
      location: 'Tây Hồ',
      date: '16/06/2011',
      name: 'Phục hồi rừng trên đất lâm nghiệp đang sản xuất cây nông nghiệp, cây công nghiệp bằng giải pháp lâm nông kết hợp, giai đoạn 2018 -2020',
      header1: 'Kết quả thực hiện của đề án',
      content1:
        'Lâm Đồng nằm trong khu vực Tây Nguyên có độ che phủ rừng còn khá lớn trong cả nước. Tuy nhiên, Lâm Đồng cùng các tỉnh Tây Nguyên chịu nhiều áp lực về biến động tài nguyên rừng do tác động gây mất rừng và suy thoái rừng gia tăng. Chính phủ các cấp Bộ Ngành liên quan đã có nhiều chỉ đạo triển khai các giải pháp để khắc phục và ứng phó với biến đổi khí hậu.',
      header2: null,
      content2: null,
    },
  ]);
  const featureArr = [
    'Tất cả',
    'Chính sách',
    'Chỉ đạo điều hành',
    'Khoa học công nghệ',
    'Bảo vệ rừng',
    'Đa dạng sinh học',
    'Dịch vụ môi trường rừng',
  ];
  const [newsFilter, setNewsFilter] = useState(null);
  const [input, setInput] = useState('');

  const handlePickFeature = (title, index) => {
    setFeatureIndex(index);
    if (index !== 0) {
      const data = newsArr.filter(item => item.topic === title);
      setNewsFilter(data);
    } else {
      setNewsFilter(null);
    }
  };

  const handleSearch = text => {
    setInput(text);
    const data = newsArr.filter(item =>
      unidecode(item.name.toLowerCase()).includes(text.toLowerCase()),
    );

    setNewsFilter(data);
  };

  return (
    <SafeAreaView showsVerticalScrollIndicator={false} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <View style={styles.searchFilterContainer}>
        <TouchableOpacity
          style={styles.headerContainer}
          onPress={() => {
            navigation.navigate('Home');
          }}>
          <Image style={styles.backImg} source={Images.back} />
        </TouchableOpacity>
        <View style={styles.searchTextInputContainer}>
          <Icons.FontAwesome name="search" size={20} color="#888" />
          <TextInput
            onChangeText={e => handleSearch(e)}
            value={input}
            style={styles.searchTextInput}
            placeholder="Tìm kiếm bài báo"
          />
        </View>
        {/* <View style={styles.filerImgContainer}>
          <TouchableOpacity
            style={{
              padding: 8,
            }}>
            <Image style={styles.filterImg} source={Images.filter} />
          </TouchableOpacity>
        </View> */}
      </View>
      <View style={styles.featuresTitleContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: Dimension.setWidth(4),
          }}>
          <Text
            style={{
              fontFamily: Fonts.SF_BOLD,
              fontSize: 18,
            }}>
            Các lĩnh vực
          </Text>
        </View>

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {featureArr.map((item, index) => {
            const pdRight =
              index === featureArr.length - 1
                ? {marginRight: Dimension.setWidth(3.6)}
                : {marginRight: 0};
            const colorFeature =
              featureIndex === index ? '#85d4ee' : Colors.INACTIVE_GREY;
            return (
              <TouchableOpacity
                onPress={() => {
                  handlePickFeature(item, index);
                }}
                style={[styles.featureTextContainer, {...pdRight}]}
                key={index}>
                <Text style={[styles.featureText, {color: colorFeature}]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.hotNewTextContainer}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: Fonts.SF_BOLD,
          }}>
          Tin nổi bật
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {(newsFilter === null ? newsArr : newsFilter).map((item, index) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('DetailNews', {item: item});
            }}
            style={styles.hotNewsContainer}
            key={index}>
            <View
              style={{
                marginTop: Dimension.setHeight(0.7),
                marginBottom: Dimension.setHeight(0.8),
              }}>
              <Image
                style={styles.newsImg}
                source={item.mainImg}
                resizeMode="cover"
              />
              <View
                style={{
                  marginTop: Dimension.setHeight(0.6),
                  marginHorizontal: Dimension.setWidth(2.2),
                }}>
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: Fonts.SF_SEMIBOLD,
                    fontSize: 17,
                    color: Colors.DARK_FOUR,
                  }}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.SF_REGULAR,
                    fontSize: 15,
                    color: Colors.INACTIVE_GREY,
                  }}>
                  {item.location}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },

  searchFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Dimension.setHeight(1),
    marginLeft: Dimension.setWidth(3),
  },

  headerContainer: {
    width: '8%',
  },

  backImg: {
    width: 25,
    height: 25,
  },

  searchTextInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    borderColor: '#ccc',
    borderWidth: 0.8,
    borderRadius: 12,
    width: '90%',
    height: Dimension.setHeight(6),
    marginRight: Dimension.setWidth(4),
  },

  searchTextInput: {
    marginLeft: 10,
    fontSize: 14,
    width: '90%',
    fontFamily: Fonts.SF_REGULAR,
  },

  filerImgContainer: {
    flex: 1,
    backgroundColor: '#eef2fe',
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 5,
  },

  filterImg: {
    width: 28,
    height: 28,
    tintColor: Colors.INACTIVE_GREY,
  },

  featuresTitleContainer: {
    marginTop: Dimension.setHeight(1),
  },

  featureTextContainer: {
    marginTop: Dimension.setHeight(0.5),
    height: Dimension.setHeight(4),
    marginLeft: Dimension.setWidth(4),
  },

  featureText: {
    fontFamily: Fonts.SF_S,
    fontSize: 16,
  },

  hotNewTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Dimension.setHeight(0.5),
    marginBottom: Dimension.setHeight(0.3),
    marginHorizontal: Dimension.setWidth(4),
  },

  hotNewsContainer: {
    marginHorizontal: Dimension.setWidth(3.5),
    alignItems: 'center',
    borderWidth: 0.4,
    borderRadius: 10,
    borderColor: Colors.INACTIVE_GREY,
    backgroundColor: Colors.LIGHT_GREY,
    marginBottom: Dimension.setHeight(1.8),
    elevation: 5,
    ...shadowIOS,
  },

  newsImg: {
    width: Dimension.setWidth(90),
    height: Dimension.setHeight(21),
    borderRadius: 10,
    alignSelf: 'center',
  },
});

export default AllNewsScreen;
