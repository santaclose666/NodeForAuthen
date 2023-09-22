import React, {useState, useLayoutEffect, useCallback} from 'react';
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
import Dimension from '../../contants/Dimension';
import Icons from '../../contants/Icons';
import {shadowIOS} from '../../contants/propsIOS';
import Loading from '../../components/LoadingUI';
import {FlatList} from 'native-base';
import {Dropdown} from 'react-native-element-dropdown';
import LinearGradientUI from '../../components/LinearGradientUI';
import Header from '../../components/Header';
import {dataVQG} from './test';
import {getAllEcosystem} from '../../redux/apiRequest';
import Images from '../../contants/Images';
import {fontDefault} from '../../contants/Variable';
import {ToastAlert} from '../../components/Toast';

const width = Dimensions.get('window').width / 2 - 22;

const ListBioScreen = ({navigation}) => {
  const [VQGData, setVQGData] = useState(dataVQG[0]);
  const [typeData, setTypeData] = useState(null);
  const [input, setInput] = useState('');
  const [speciesFilled, setSpeciesFilled] = useState(null);
  const [speciesArr, setSpeciesArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSelectLocation, setIsSelectLocation] = useState(false);
  const [heightBtn, setHeightBtn] = useState(0);
  const [nameVQG, setNameVQG] = useState(VQGData.tendonvi);
  const [logo, setLogo] = useState(VQGData.logo);

  useLayoutEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const data = await getAllEcosystem(
        typeData ? typeData : dataVQG[0].bodulieu[0].api,
      );

      if (data) {
        setSpeciesArr(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = text => {
    setInput(text);
    const data = speciesArr.filter(item => {
      let filter;
      if (item?.loaitv) {
        filter = unidecode(item?.loaitv?.toLowerCase()).includes(
          unidecode(text.toLowerCase()),
        );
      }
      return filter;
    });

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

  const handlePickOption = () => {
    if (typeData == null) {
      ToastAlert('Chưa chọn loại dữ liệu!');
    } else {
      fetchAllData();
      setLogo(VQGData.logo);
      setNameVQG(VQGData.tendonvi);
      setIsSelectLocation(false);
    }
  };

  const RenderItem = useCallback(
    ({item, index}) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            navigation.navigate('SpecieDetail', {
              data: {...item, link: VQGData.link},
            });
          }}
          style={styles.card}>
          <View
            style={{
              height: width,
              alignItems: 'center',
            }}>
            <Image
              src={VQGData.link + item.hinh1}
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
    },
    [logo],
  );

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
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: Colors.DEFAULT_GREEN,
                padding: 1,
                borderRadius: 50,
                marginBottom: 6,
                marginRight: 3,
              }}>
              <Image
                source={logo}
                style={{
                  width: Dimension.boxHeight(28),
                  height: Dimension.boxHeight(28),
                  borderRadius: 50,
                }}
              />
            </View>
            <Text style={styles.tile}>{nameVQG}</Text>
          </View>
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

        {loading ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Loading bg={false} />
          </View>
        ) : (
          <FlatList
            columnWrapperStyle={{justifyContent: 'space-between'}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              marginTop: 10,
              paddingBottom: 50,
            }}
            numColumns={2}
            data={speciesFilled ? speciesFilled : speciesArr}
            renderItem={({item, index}) => {
              return <RenderItem item={item} index={index} />;
            }}
            initialNumToRender={8}
            windowSize={8}
            removeClippedSubviews={true}
          />
        )}

        <Modal
          isVisible={isSelectLocation}
          animationIn="fadeInUp"
          animationInTiming={200}
          animationOut="fadeOutDown"
          animationOutTiming={200}>
          <View style={styles.modalBack}>
            <View style={styles.modalContainer}>
              <Text style={styles.tile}>Chọn dữ liệu</Text>
              <Text
                style={[
                  styles.labelModal,
                  {marginTop: Dimension.setHeight(1)},
                ]}>
                Chọn khu vực:
              </Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  {marginBottom: Dimension.setHeight(2)},
                ]}
                autoScroll={false}
                showsVerticalScrollIndicator={false}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                containerStyle={styles.containerOptionStyle}
                itemContainerStyle={styles.itemContainer}
                itemTextStyle={styles.itemText}
                fontFamily={Fonts.SF_MEDIUM}
                activeColor="#eef2feff"
                placeholder="Chọn đơn vị"
                data={dataVQG}
                maxHeight={Dimension.setHeight(30)}
                labelField="tendonvi"
                valueField="tendonvi"
                value={VQGData}
                onChange={item => {
                  setVQGData(item);
                }}
              />
              <Text style={styles.labelModal}>Chọn loại dữ liệu:</Text>
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
                placeholder="Chọn loại dữ liệu"
                data={VQGData?.bodulieu}
                maxHeight={Dimension.setHeight(30)}
                labelField="loaidulieu"
                valueField="api"
                value={typeData}
                onChange={item => {
                  setTypeData(item.api);
                }}
              />
              <TouchableOpacity
                onLayout={({nativeEvent}) => {
                  const {x, y, width, height} = nativeEvent.layout;
                  setHeightBtn(height);
                }}
                style={[styles.btnSelect, {bottom: -heightBtn / 2.5}]}
                onPress={handlePickOption}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: Fonts.SF_MEDIUM,
                    fontSize: Dimension.fontSize(14),
                  }}>
                  Tìm kiếm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsSelectLocation(false);
                }}
                style={{position: 'absolute', top: 12, right: 12, zIndex: 999}}>
                <Image
                  source={Images.minusclose}
                  style={{height: 22, width: 22}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
      Platform.OS == 'ios' ? Dimension.setHeight(4) : Dimension.setHeight(5),
    marginRight: Dimension.setWidth(2),
    backgroundColor: 'white',
    elevation: 5,
    ...shadowIOS,
  },

  searchTextInput: {
    marginLeft: 10,
    width: '90%',
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
    width: '86%',
    borderWidth: 0.8,
    borderColor: Colors.DEFAULT_GREEN,
    paddingHorizontal: Dimension.setWidth(2),
    borderRadius: 10,
  },
  btnSelect: {
    position: 'absolute',
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

  containerOptionStyle: {
    borderRadius: 10,
  },

  labelModal: {
    fontSize: Dimension.fontSize(17),
    fontFamily: Fonts.SF_MEDIUM,
    alignSelf: 'flex-start',
    ...fontDefault,
    marginBottom: Dimension.setHeight(1),
  },
});

export default ListBioScreen;
