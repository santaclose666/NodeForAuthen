import React, {memo, useCallback, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  SafeAreaView,
  VirtualizedList,
} from 'react-native';
import unidecode from 'unidecode';
import Images from '../../contants/Images';
import {ScrollView} from 'react-native-gesture-handler';
import Icons from '../../contants/Icons';
import Colors from '../../contants/Colors';
import Fonts from '../../contants/Fonts';
import Dimension from '../../contants/Dimension';
import {shadowIOS} from '../../contants/propsIOS';
import LinearGradient from 'react-native-linear-gradient';
import {DocumentData, DocumentURL, fontDefault} from '../../contants/Variable';
import Header from '../../components/Header';

const DocumentListScreen = ({navigation}) => {
  const [pickFileIndex, setpickFileIndex] = useState(null);
  const [pickOptionIndex, setPickOptionIndex] = useState(0);
  const [input, setInput] = useState('');
  const [groupOption, setGroupOption] = useState([
    'Tất cả',
    'Luật',
    'Nghị định',
    'Quyết định',
    'Thông tư',
    'Sổ tay',
    'Tài liệu tham khảo',
  ]);
  const [data, setData] = useState(DocumentData);

  const handleSearch = useCallback(
    text => {
      setInput(text);
      setPickOptionIndex(null);

      const filter = DocumentData.filter(
        item =>
          unidecode(item.SoHieu.toLowerCase()).includes(text.toLowerCase()) ||
          unidecode(item.TrichYeu.toLowerCase()).includes(text.toLowerCase()),
      );
      setData(filter);
    },
    [input],
  );

  const handlePickOption = useCallback(
    (keyWord, index) => {
      index === 0
        ? setData(DocumentData)
        : setData(DocumentData.filter(item => item.LoaiVB === keyWord));

      setPickOptionIndex(index);
    },
    [pickOptionIndex],
  );

  const handlePress = useCallback(fileName => {
    navigation.navigate('PDF', {link: DocumentURL + fileName});
  }, []);

  const RenderDocument = memo(({item, index}) => {
    return (
      <View key={item.ID}>
        <TouchableOpacity
          onPress={() => handlePress(item.TenFile)}
          style={styles.flatListItemContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: Dimension.setWidth(3),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '70%',
              }}>
              <Image
                source={Images.pdf}
                style={{width: 45, height: 45, marginRight: 5}}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontFamily: Fonts.SF_SEMIBOLD,
                  fontSize: Dimension.fontSize(16),
                  ...fontDefault,
                }}>
                {item.SoHieu}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: Fonts.SF_SEMIBOLD,
                fontSize: Dimension.fontSize(15),
                color: Colors.INACTIVE_GREY,
              }}>
              {item.Ngay}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              pickFileIndex !== index
                ? setpickFileIndex(index)
                : setpickFileIndex(null);
            }}
            style={{
              marginTop: Dimension.setHeight(1.8),
              borderTopWidth: 0.5,
              borderTopColor: Colors.INACTIVE_GREY,
              marginHorizontal: Dimension.setWidth(8),
            }}>
            <View
              style={{
                paddingTop: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SF_REGULAR,
                  fontSize: Dimension.fontSize(14),
                  color: Colors.INACTIVE_GREY,
                }}>
                {pickFileIndex === index ? 'Thu gọn' : 'Chi tiết'}
              </Text>
              <Image
                source={pickFileIndex === index ? Images.up : Images.down}
                style={{
                  width: 16,
                  height: 16,
                  tintColor: Colors.INACTIVE_GREY,
                }}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
        {pickFileIndex === index && (
          <View style={styles.subMenuContainer}>
            <View style={{padding: 10, marginLeft: Dimension.setWidth(3)}}>
              <View style={[styles.subItem, {flexWrap: 'wrap'}]}>
                <Image source={Images.dot} style={styles.dot} />
                <Text style={styles.title}>Số hiệu: </Text>
                <Text style={styles.content}>{item.SoHieu}</Text>
              </View>
              <View style={styles.subItem}>
                <Image source={Images.dot} style={styles.dot} />
                <Text style={styles.title}>Ngày ban hành: </Text>
                <Text style={styles.content}>{item.Ngay}</Text>
              </View>
              <View style={[styles.subItem, {flexWrap: 'wrap'}]}>
                <Image source={Images.dot} style={styles.dot} />
                <Text style={styles.title}>Trích dẫn: </Text>
                <Text style={[styles.content]}>{item.TrichYeu}</Text>
              </View>
              <View style={styles.subItem}>
                <Image source={Images.dot} style={styles.dot} />
                <Text style={styles.title}>Nhóm văn bản: </Text>
                <Text style={styles.content}>{item.LoaiVB}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  });

  return (
    <LinearGradient
      colors={['rgba(153,255,153,0.9)', 'rgba(255,204,204,0.8)']}
      style={{flex: 1}}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <SafeAreaView style={styles.container}>
        <Header title="Danh mục tài liệu" navigation={navigation} />
        <View style={styles.searchInput}>
          <Icons.Feather name="search" size={25} color={Colors.INACTIVE_GREY} />
          <TextInput
            onChangeText={e => handleSearch(e)}
            value={input}
            placeholder="Tìm văn bản"
            style={{
              fontFamily: Fonts.SF_REGULAR,
              marginLeft: 10,
              width: '80%',
            }}
          />
        </View>

        <View style={styles.optionContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {groupOption.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    handlePickOption(item, index);
                  }}
                  key={index}
                  style={{
                    marginRight: Dimension.setWidth(4.4),
                    paddingVertical: 3,
                    borderBottomWidth: pickOptionIndex === index ? 2 : 0,
                    borderBottomColor:
                      pickOptionIndex === index ? Colors.DEFAULT_GREEN : '#fff',
                  }}>
                  <Text
                    style={{
                      fontFamily:
                        pickOptionIndex === index
                          ? Fonts.SF_SEMIBOLD
                          : Fonts.SF_REGULAR,
                      fontSize: Dimension.fontSize(16),
                      opacity: 0.8,
                      color:
                        pickOptionIndex === index
                          ? Colors.DEFAULT_GREEN
                          : Colors.DEFAULT_BLACK,
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.fileListContainer}>
          <VirtualizedList
            data={data}
            keyExtractor={item => item.ID.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <RenderDocument item={item} index={index} />
            )}
            getItemCount={() => data.length}
            getItem={(data, index) => data[index]}
            getItemLayout={(data, index) => ({
              length: Dimension.setHeight(14),
              offset: Dimension.setHeight(14) * index,
              index,
            })}
            initialNumToRender={10}
            windowSize={6}
            removeClippedSubviews={true}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: Dimension.setHeight(2),
    marginHorizontal: Dimension.setWidth(5),
  },

  searchContainer: {
    marginTop: Dimension.setHeight(2),
    marginHorizontal: Dimension.setWidth(2),
    backgroundColor: '#ffffff',
    elevation: 4,
    ...shadowIOS,
    borderRadius: 8,
    borderWidth: 1,
    height: 30,
    width: '90%',
    alignSelf: 'center',
  },

  optionContainer: {
    marginTop: Dimension.setHeight(1.5),
    marginHorizontal: Dimension.setWidth(5),
  },

  fileListContainer: {
    flex: 1,
    marginTop: Dimension.setHeight(1.5),
    marginHorizontal: Dimension.setWidth(5),
  },

  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    width: 10,
    height: 10,
    marginRight: Dimension.setWidth(1),
  },

  title: {
    fontFamily: Fonts.SF_BOLD,
    fontSize: Dimension.fontSize(14),
    ...fontDefault,
  },

  content: {
    fontFamily: Fonts.SF_REGULAR,
    fontSize: Dimension.fontSize(14),
    marginLeft: Dimension.setWidth(2),
    textAlign: 'justify',
  },
  searchInput: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    width: '90%',
    borderRadius: 9,
    height: Dimension.setHeight(5.5),
    justifyContent: 'flex-start',
    paddingHorizontal: Dimension.setWidth(3),
    marginTop: 10,
  },

  flatListItemContainer: {
    backgroundColor: '#ffffff',
    marginBottom: Dimension.setHeight(1.1),
    marginTop: Dimension.setHeight(1.1),
    borderRadius: 9,
    elevation: 4,
    ...shadowIOS,
    marginHorizontal: 5,
    borderWidth: 0.5,
    borderColor: Colors.WHITE,
    paddingTop: Dimension.setHeight(1.6),
    paddingBottom: Dimension.setHeight(1.2),
  },

  subMenuContainer: {
    marginHorizontal: Dimension.setWidth(5.5),
    backgroundColor: 'rgba(150, 160, 169, 0.2)',
    borderRadius: 12,
    width: '86%',
    marginBottom: Dimension.setHeight(0.6),
  },
});

export default DocumentListScreen;
