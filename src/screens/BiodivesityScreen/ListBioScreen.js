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
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Images from '../../contants/Images';
import Dimension from '../../contants/Dimension';
import Icons from '../../contants/Icons';
import {shadowIOS} from '../../contants/propsIOS';
import Loading from '../../components/LoadingUI';
import {FlatList} from 'native-base';
import {Dropdown} from 'react-native-element-dropdown';
import LinearGradientUI from '../../components/LinearGradientUI';
import Header from '../../components/Header';

export const dataLocation = [
  {
    key: '1',
    name: 'Bộ dữ liệu: Thực vật VQG Cúc Phương',
    ma: 'cp',
    logo: Images.cucphuong,
  },
  {
    key: '2',
    name: 'Bộ dữ liệu: Thực vật VQG Ba Vì',
    ma: 'bv',
    logo: Images.bavi,
  },
  {
    key: '3',
    name: 'Bộ dữ liệu: Thực vật VQG Tam Đảo',
    ma: 'td',
    logo: Images.tamdao,
  },
  {
    key: '4',
    name: 'Bộ dữ liệu: Thực vật VQG Bạch Mã',
    ma: 'bm',
    logo: Images.bachma,
  },
  {
    key: '5',
    name: ' Bộ dữ liệu: Thực vật VQG Cát Tiên',
    ma: 'ct',
    logo: Images.cattien,
  },
  {
    key: '6',
    name: 'Bộ dữ liệu: Thực vật VQG Yok Đôn',
    ma: 'yd',
    logo: Images.yokdon,
  },
];
const width = Dimensions.get('window').width / 2 - 22;

const ListBioScreen = ({navigation}) => {
  const [location, setLocation] = useState(dataLocation[0]);
  const [input, setInput] = useState('');
  const [speciesFilled, setSpeciesFilled] = useState(null);
  const [speciesArr, setSpeciesArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameBioSource, setNameBioSrc] = useState(dataLocation[0].name);
  const [isSelectLocation, setIsSelectLocation] = useState(false);
  const filterAvt = dataLocation.filter(item =>
    item.name.includes(nameBioSource),
  )[0];

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

  const handlePopupFilter = () => {
    setIsSelectLocation(true);
  };

  const RenderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SpecieDetail', item);
        }}
        style={styles.card}>
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
            style={{
              width: '100%',
              height: width,
              resizeMode: 'cover',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
        </View>

        <Text style={styles.nameLatin}>{fomatLatinName(item.loailatin)}</Text>
        <Text
          style={{
            paddingBottom: 6,
            textAlign: 'center',
            fontSize: Dimension.fontSize(14),
            fontFamily: Fonts.SF_REGULAR,
          }}>
          {item.loaitv}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradientUI>
      <SafeAreaView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        <Header
          navigation={navigation}
          title={'Động thực vật các VQG'}
          handleFilter={handlePopupFilter}
        />

        <View style={styles.searchFilterContainer}>
          <View
            style={{
              borderWidth: 1,
              borderColor: Colors.DEFAULT_GREEN,
              padding: 1,
              borderRadius: 50,
              marginBottom: 6,
            }}>
            <Image
              source={filterAvt.logo}
              style={{
                width: Dimension.boxHeight(50),
                height: Dimension.boxHeight(50),
                borderRadius: 50,
              }}
            />
          </View>
          <Text style={styles.tile}>{nameBioSource.split(':')[1]}</Text>
          <View style={styles.searchTextInputContainer}>
            <Icons.FontAwesome name="search" size={16} color="#888" />
            <TextInput
              onChangeText={e => handleSearch(e)}
              value={input}
              style={styles.searchTextInput}
              placeholder="Tìm kiếm loài"
            />
          </View>
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
                  console.log(item);
                }}
              />
              <TouchableOpacity
                style={styles.btnSelect}
                onPress={() => {
                  getListSpecies();
                  setIsSelectLocation(false);
                  setNameBioSrc(location.name);
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: Fonts.SF_MEDIUM,
                    fontSize: Dimension.fontSize(14),
                  }}>
                  Chọn
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
        {loading === true && <Loading />}
      </SafeAreaView>
    </LinearGradientUI>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
  },

  searchFilterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Dimension.setHeight(0.6),
    marginTop: Dimension.setHeight(1),
    width: '75%',
    alignSelf: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    borderRadius: 12,
    height:
      Platform.OS == 'ios' ? Dimension.setHeight(4) : Dimension.setHeight(6),
    marginRight: Dimension.setWidth(2),
    backgroundColor: 'white',
    elevation: 5,
    ...shadowIOS,
  },

  searchTextInput: {
    marginLeft: 10,
    fontSize: Dimension.fontSize(13),
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
    width: width,
    marginHorizontal: 8,
    borderRadius: 10,
    marginBottom: 15,
    ...shadowIOS,
    elevation: 5,
  },
  filterData: {
    alignItems: 'center',
    marginRight: Dimension.setWidth(2),
  },
  tileContainer: {
    padding: 5,
    marginLeft: 10,
    marginTop: Dimension.setHeight(1),
  },
  tile: {
    fontWeight: 'bold',
    fontSize: Dimension.fontSize(18),
    color: Colors.DEFAULT_GREEN,
    marginBottom: Dimension.setHeight(0.8),
  },
  nameLatin: {
    fontFamily: Fonts.SF_BOLD,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
    textAlign: 'center',
    fontSize: Dimension.fontSize(14),
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
    borderRadius: 16,
    marginTop: Dimension.setHeight(4),
    elevation: 5,
    ...shadowIOS,
  },
});

export default ListBioScreen;
