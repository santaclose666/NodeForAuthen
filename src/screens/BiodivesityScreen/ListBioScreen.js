import React, {useState, useEffect} from 'react';
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
  Dimensions,
} from 'react-native';
import unidecode from 'unidecode';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import Icons from '../../contants/Icons';
import {shadowIOS} from '../../contants/propsIOS';
import Loading from '../../components/LoadingUI';
import {FlatList} from 'native-base';

export const dataLocation = [
  {
    key: '1',
    name: 'VQG Cúc Phương',
    ma: 'cp',
  },
  {
    key: '2',
    name: 'VQG Ba Vì',
    ma: 'bv',
  },
  {
    key: '3',
    name: 'VQG Tam Đảo',
    ma: 'td',
  },
  {
    key: '4',
    name: 'VQG Bạch Mã',
    ma: 'bm',
  },
  {
    key: '1',
    name: 'VQG Cát Tiên',
    ma: 'ct',
  },
  {
    key: '6',
    name: 'VQG Yok Đôn',
    ma: 'yd',
  },
];
const width = Dimensions.get('window').width / 2 - 18;

const ListBioScreen = ({navigation}) => {
  const [location, setLocation] = useState(dataLocation[0]);
  const [input, setInput] = useState('');
  const [speciesFilled, setSpeciesFilled] = useState(null);
  const [speciesArr, setSpeciesArr] = useState([]);
  const [loading, setLoading] = useState([false]);

  useEffect(() => {
    getListSpecies(location);
  }, []);

  const getListSpecies = async location => {
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
      unidecode(item.loaitv.toLowerCase()).includes(text.toLowerCase()),
    );
    setSpeciesFilled(data);
  };

  const RenderItem = ({item}) => {
    return (
      <TouchableOpacity
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

          <Text
            style={{
              fontWeight: 'bold',
              fontStyle: 'italic',
              paddingHorizontal: 10,
              paddingTop: 10,
              paddingBottom: 5,
              textAlign: 'center',
              fontSize: 14,
            }}>
            {item.loailatin}
          </Text>
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
    <SafeAreaView showsVerticalScrollIndicator={false} style={styles.container}>
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
        <TouchableOpacity style={styles.filterData}>
          <Image style={{width: 25, height: 25}} source={Images.filter} />
        </TouchableOpacity>
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
      {loading === true && <Loading />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
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
    height: Dimension.setHeight(4),
    marginRight: Dimension.setWidth(2),
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
});

export default ListBioScreen;
