import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import unidecode from 'unidecode';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import Icons from '../../contants/Icons';
import {shadowIOS} from '../../contants/propsIOS';
import Loading from '../../components/LoadingUI';
import {FlatList} from 'native-base';
import {Dropdown} from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';

export const dataLocation = [
  {
    key: '1',
    name: 'Bộ dữ liệu: Thực vật VQG Cúc Phương',
    ma: 'cp',
  },
  {
    key: '2',
    name: 'Bộ dữ liệu: Thực vật VQG Ba Vì',
    ma: 'bv',
  },
  {
    key: '3',
    name: 'Bộ dữ liệu: Thực vật VQG Tam Đảo',
    ma: 'td',
  },
  {
    key: '4',
    name: 'Bộ dữ liệu: Thực vật VQG Bạch Mã',
    ma: 'bm',
  },
  {
    key: '1',
    name: ' Bộ dữ liệu: Thực vật VQG Cát Tiên',
    ma: 'ct',
  },
  {
    key: '6',
    name: 'Bộ dữ liệu: Thực vật VQG Yok Đôn',
    ma: 'yd',
  },
];
const width = Dimensions.get('window').width / 2 - 18;

const ListBioScreen = ({navigation}) => {
  const [location, setLocation] = useState(dataLocation[0]);
  const [input, setInput] = useState('');
  const [speciesFilled, setSpeciesFilled] = useState(null);
  const [speciesArr, setSpeciesArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameBioSource, setNameBioSrc] = useState(dataLocation[0].name);
  const [isSelectLocation, setIsSelectLocation] = useState(false);

  useEffect(() => {
    getListSpecies();
  }, []);

  const getListSpecies = async () => {
    setLoading(true);
    await fetch(
      `http://vuonquocgiavietnam.ifee.edu.vn/api/dsLoai/${location.ma}`,
    )
      .then(res => res.json())
      .then(async resJSON => {
        setSpeciesArr(resJSON);
      })
      .catch(error => {
        console.error(error);
      });
    setLoading(false);
  };

  const handleSearch = text => {
    setInput(text);
    const data = speciesArr.filter(item =>
      unidecode(item.loaitv.toLowerCase()).includes(
        unidecode(text.toLowerCase()),
      ),
    );

    setSpeciesFilled(data);
  };

  const fomatLatinName = text => {
    const words = text.split(' ');
    let formattedText;
    if (words.length > 1 && (words[1] === 'sp' || words[1] === 'sp.')) {
      formattedText = (
        <Text>
          <Text>
            <Text style={{fontStyle: 'italic'}}>{words[0]}</Text>{' '}
            {words.slice(1).join(' ')}
          </Text>
        </Text>
      );
    } else {
      formattedText = (
        <Text>
          <Text style={{fontStyle: 'italic'}}>
            {words[0]} {words[1]}
          </Text>{' '}
          {words.slice(2).join(' ')}
        </Text>
      );
    }
    return formattedText;
  };

  const RenderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.renderItemBg}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('SpecieDetail', item);
        }}>
        <View style={styles.card}>
          <View
            style={{
              height: width,
              alignItems: 'center',
            }}>
            <Image
              source={{
                uri:
                  'http://vuonquocgiavietnam.ifee.edu.vn/web/images/img_ddsh/' +
                  item.hinh1,
              }}
              style={{width: width, height: width, resizeMode: 'cover'}}
            />
          </View>

          <Text style={styles.nameLatin}>{fomatLatinName(item.loailatin)}</Text>
          <Text
            style={{
              paddingBottom: 10,
              paddingHorizontal: 10,
              textAlign: 'center',
              fontSize: 14,
            }}>
            {item.loaitv}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['rgba(153,255,153,0.9)', 'rgba(255,204,204,0.8)']}
      style={{flex: 1}}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <SafeAreaView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />
        <View style={styles.searchFilterContainer}>
          <TouchableOpacity
            style={styles.headerContainer}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image style={styles.backImg} source={Images.back} />
          </TouchableOpacity>
          <View style={styles.searchTextInputContainer}>
            <Icons.FontAwesome name="search" size={20} color="#888" />
            <TextInput
              onChangeText={e => handleSearch(e)}
              value={input}
              style={styles.searchTextInput}
              placeholder="Tìm kiếm loài"
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              setIsSelectLocation(true);
            }}
            style={styles.filterData}>
            <Image style={{width: 25, height: 25}} source={Images.filter} />
          </TouchableOpacity>
        </View>

        <View style={styles.tileContainer}>
          <Text style={styles.tile}>{nameBioSource}</Text>
        </View>

        <FlatList
          columnWrapperStyle={{justifyContent: 'space-between'}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: 10,
            paddingBottom: 50,
          }}
          numColumns={2}
          data={speciesFilled ? speciesFilled : speciesArr}
          renderItem={({item}) => {
            return <RenderItem item={item} navigation={navigation} />;
          }}
          initialNumToRender={12}
          windowSize={12}
          removeClippedSubviews={true}
          refreshing={true}
          extraData={speciesFilled ? speciesFilled : speciesArr}
        />
        <Modal
          isVisible={isSelectLocation}
          animationIn="fadeInUp"
          animationInTiming={1}
          animationOut="fadeOutDown"
          animationOutTiming={1}
          style={{flex: 1}}>
          <TouchableOpacity
            onPress={() => {
              setIsSelectLocation(false);
            }}
            style={styles.modalBack}>
            <View style={styles.modalContainer}>
              <Text style={styles.tile}>Chọn dữ liệu</Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  alignSelf: 'flex-start',
                  padding: 5,
                }}>
                Chọn khu vực:
              </Text>
              <Dropdown
                style={styles.dropdown}
                autoScroll={false}
                showsVerticalScrollIndicator={false}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                containerStyle={styles.containerOptionStyle}
                itemContainerStyle={styles.itemContainer}
                itemTextStyle={styles.itemText}
                fontFamily={Fonts.SF_MEDIUM}
                activeColor="#eef2feff"
                placeholder="Vùng"
                data={dataLocation}
                maxHeight={Dimension.setHeight(30)}
                labelField="name"
                valueField="ma"
                value={location}
                onChange={item => {
                  setLocation(item);
                }}
              />
              <TouchableOpacity
                style={styles.btnSelect}
                onPress={() => {
                  getListSpecies();
                  setIsSelectLocation(false);
                  setNameBioSrc(location.name);
                }}>
                <Text>Chọn</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
        {loading === true && <Loading />}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
  },

  searchFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: Dimension.setHeight(1),
  },

  headerContainer: {
    flex: 0.6,
    alignSelf: 'center',
    marginLeft: Dimension.setWidth(2),
    marginRight: Dimension.setWidth(2),
  },

  backImg: {
    width: 25,
    height: 25,
  },

  searchTextInputContainer: {
    flex: 7,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    borderColor: '#ccc',
    borderWidth: 0.8,
    borderRadius: 12,
    height:
      Platform.OS == 'ios' ? Dimension.setHeight(5) : Dimension.setHeight(6),
    marginRight: Dimension.setWidth(2),
    backgroundColor: 'white',
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
    fontFamily: Fonts.SF_REGULAR,
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
  card: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    width,
    marginHorizontal: 6,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
  },
  filterData: {
    alignItems: 'center',
    flex: 1,
    marginRight: Dimension.setWidth(2),
  },
  tileContainer: {
    padding: 5,
    marginLeft: 10,
  },
  tile: {fontWeight: 'bold', fontSize: 19, color: Colors.DEFAULT_GREEN},
  nameLatin: {
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
    textAlign: 'center',
    fontSize: 14,
  },
  modalContainer: {
    width: '95%',
    height: '30%',
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalBack: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    borderRadius: 12,
  },
  dropdown: {
    width: '100%',
  },
  btnSelect: {
    backgroundColor: Colors.DEFAULT_YELLOW,
    width: Dimension.setWidth(30),
    height: Dimension.setHeight(4),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.DEFAULT_BLACK,
    borderRadius: 15,
    borderWidth: 1,
    marginTop: 40,
  },
  renderItemBg: {
    ...shadowIOS,
    elevation: 5,
  },
});

export default ListBioScreen;
