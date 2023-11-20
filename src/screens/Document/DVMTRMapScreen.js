import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Text,
  Modal,
  PixelRatio,
  ScrollView,
  TextInput,
} from 'react-native';
import {WMSTile, MAP_TYPES, Polygon, Marker, Callout} from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import Colors from '../../contants/Colors';
import Images from '../../contants/Images';
import {Button, Center, Fab} from 'native-base';
import unidecode from 'unidecode';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 21.1147;
const LONGITUDE = 105.546;
const LATITUDE_DELTA = 1;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

const initialRegion = {
  latitude: 16.12137688439525,
  longitude: 107.0748096599727,
  latitudeDelta: 10,
  longitudeDelta: 10,
};

const listBaseMap = [
  {type: MAP_TYPES.STANDARD, image: Images.baseStandard},
  {type: MAP_TYPES.HYBRID, image: Images.baseHybrid},
  {type: MAP_TYPES.SATELLITE, image: Images.baseSatellite},
  {type: MAP_TYPES.TERRAIN, image: Images.baseTerrain},
];

const DVMTRMapScreen = ({navigation}) => {
  const mapViewRef = useRef(null);
  const [region, setRegion] = useState(initialRegion);
  const [mapType, setMapType] = useState(MAP_TYPES.SATELLITE);
  const [expainBasemap, setExpainBaeMap] = useState(false);
  const [currentBaseImg, setCurrentBaseImg] = useState(Images.baseSatellite);
  const [forceRefresh, setForceRefresh] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [mapViewHeight, setMapViewHeight] = useState(null);
  const [mapViewWidth, setMapViewWidth] = useState(null);
  const [selectRegion, setSelectRegion] = useState([]);
  const [listOutPointFull, setListOutPointFull] = useState([]);
  const [listOutPointFillter, setListOutPointFillter] = useState([]);
  const [findDV, setFindDV] = useState('');
  const [sqlFillter, setSqlFillter] = useState('');
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const ApiCall = await fetch(`https://luuvucvn.ifee.edu.vn/api/daura/all`);
      const listOutPoint = await ApiCall.json();
      setListOutPointFull(listOutPoint);
      setListOutPointFillter(listOutPoint);
    } catch (err) {
      console.log(err);
    }
  };

  const handleMapPress = event => {
    try {
      const position = event.nativeEvent.position;
      if (Platform.OS === 'android') {
        position.x = position.x / PixelRatio.get();
        position.y = position.y / PixelRatio.get();
      }
      getRegion(position.x, position.y);
    } catch (err) {
      console.log('111', err);
    }
  };

  const handleSearch = text => {
    setFindDV(text);
    const data = listOutPointFull.filter(item => {
      let filter;
      if (item?.tendonvi) {
        filter = unidecode(item?.tendonvi?.toLowerCase()).includes(
          unidecode(text.toLowerCase()),
        );
      }
      return filter;
    });

    setListOutPointFillter(data);
  };

  const getRegion = async (x, y) => {
    try {
      //Tinh bbbox
      let minX = region.longitude - region.longitudeDelta / 2; // westLng - min lng
      let minY = region.latitude - region.latitudeDelta / 2; // southLat - min lat
      let maxX = region.longitude + region.longitudeDelta / 2; // eastLng - max lng
      let maxY = region.latitude + region.latitudeDelta / 2; // northLat - max lat
      let linkAPIGetInfoFull = `https://bando.ifee.edu.vn:8453/geoserver/LuuVucPfes_2023/wms?service=WMS&version=1.1.1&request=GetFeatureInfo&layers=luuvuc&query_layers==LuuVucPfes_2023:luuvuc${sqlFillter}&srs=EPSG:4326&info_format=application/json&bbox=${minX},${minY},${maxX},${maxY}&width=${Math.round(
        mapViewWidth,
      )}&height=${Math.round(mapViewHeight)}&x=${Math.round(x)}&y=${Math.round(
        y,
      )}`;
      setSelectRegion([]);
      const ApiCall = await fetch(linkAPIGetInfoFull);
      const regionFeatureInfo = await ApiCall.json();
      const regionProperties = regionFeatureInfo.features[0].properties;
      if (regionProperties != null) {
        setSelectRegion(
          regionFeatureInfo.features[0].geometry.coordinates[0][0],
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const selectUnit = item => {
    setModalVisible(false);
    setListOutPointFillter([item]);
    setSqlFillter(`&cql_filter=maluuvuc='${item.maluuvuc}'`);
    animateToRegion(item.latitude, item.longitude);
    // refreshMap();
  };

  const refreshMap = () => {
    setForceRefresh(Math.floor(Math.random() * 100));
  };

  const animateToRegion = (lat, long) => {
    let region = {
      latitude: lat,
      longitude: long,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
    mapViewRef.current.animateToRegion(region, 2000);
  };

  const onLayout = event => {
    const {x, y, height, width} = event.nativeEvent.layout;
    setMapViewWidth(width);
    setMapViewHeight(height);
  };

  const fomatCoordinate = coor => {
    const polygon = coor.map(coordsArr => ({
      latitude: coordsArr[1],
      longitude: coordsArr[0],
    }));
    return polygon;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backHeartContainer}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            source={Images.back}
            style={{width: 18, height: 16, tintColor: '#fff'}}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backLevel}
        onPress={() => {
          setRegion(initialRegion);
          setListOutPointFillter(listOutPointFull);
          setSqlFillter('');
          refreshMap();
        }}>
        <Image source={Images.refresh} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.viewDetail}
        onPress={() => {
          setModalVisible(true);
          setListOutPointFillter(listOutPointFull);
        }}>
        <Image source={Images.filterBlue} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.baseMapView}
        onPress={() => {
          setExpainBaeMap(!expainBasemap);
        }}>
        <Image source={currentBaseImg} style={styles.btnBaseMap} />
      </TouchableOpacity>

      {expainBasemap && (
        <View style={styles.baseMapContainer}>
          {listBaseMap.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.baseMapOption}
                onPress={() => {
                  setMapType(item.type);
                  setCurrentBaseImg(item.image);
                  setExpainBaeMap(false);
                }}>
                <Image source={item.image} style={styles.btnBaseMap} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <MapView
        key={forceRefresh}
        onLayout={event => onLayout(event)}
        ref={mapViewRef}
        style={styles.map}
        mapType={mapType}
        provider="google"
        initialRegion={region}
        onPress={handleMapPress}
        showsMyLocationButton={true}
        showsPointsOfInterest={true}
        showsUserLocation={true}
        showsCompass={true}
        onRegionChangeComplete={Region => {
          setRegion(Region);
        }}>
        {selectRegion.length > 2 && (
          <Polygon
            coordinates={fomatCoordinate(selectRegion)}
            strokeColor={'red'}
            fillColor={'rgba(242, 227, 235, 0.3)'}
            strokeWidth={3}
            zIndex={999}
          />
        )}
        <WMSTile
          urlTemplate={`https://bando.ifee.edu.vn:8453/geoserver/ws_ranhgioi/wms?service=WMS&version=1.1.1&request=GetMap&layers=ws_ranhgioi:rg_vn_toanquoc&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true`}
          opacity={1}
          zIndex={100}
          tileSize={512}
        />
        <WMSTile
          urlTemplate={`https://bando.ifee.edu.vn:8453/geoserver/LuuVucPfes_2023/wms?service=WMS&version=1.1.1&request=GetMap&layers=LuuVucPfes_2023%3Aluuvuc${sqlFillter}&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true`}
          opacity={1}
          zIndex={100}
          tileSize={512}
        />
        {listOutPointFillter.length > 0 &&
          listOutPointFillter.map((item, index) => {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(item.latitude),
                  longitude: parseFloat(item.longitude),
                }}>
                <Image
                  source={item.loaidonvi == 'NMNS' ? Images.nmns : Images.nmtb}
                  style={{width: 30, height: 30}}
                />
                <Callout style={{padding: 5, borderRadius: 8}}>
                  <View style={styles.bubble}>
                    <View>
                      <Text style={styles.h1}>THÔNG TIN ĐƠN VỊ</Text>
                    </View>
                    {item.hinhanh != '' && (
                      <Image src={item.hinhanh} style={styles.imgDonVi} />
                    )}
                    <View style={styles.rowInfo}>
                      <Text style={styles.h1}>Tên:</Text>
                      <Text
                        style={[
                          styles.h3,
                          {fontWeight: 'bold', color: '#b82c2c'},
                        ]}>{`${item.tendonvi}`}</Text>
                    </View>
                    <View style={styles.rowInfo}>
                      <Text style={styles.h1}>Xã:</Text>
                      <Text style={styles.h3}>{`${item.tenxa}`}</Text>
                    </View>
                    <View style={styles.rowInfo}>
                      <Text style={styles.h1}>Huyện:</Text>
                      <Text style={styles.h3}>{`${item.tenhuyen}`}</Text>
                    </View>
                    <View style={styles.rowInfo}>
                      <Text style={styles.h1}>Tỉnh:</Text>
                      <Text style={styles.h3}>{`${item.tentinh}`}</Text>
                    </View>
                    <View style={styles.rowInfo}>
                      <Text style={styles.h1}>Sông chính:</Text>
                      <Text style={styles.h3}>{`${item.tensong}`}</Text>
                    </View>
                    <View style={styles.rowInfo}>
                      <Text style={styles.h1}>Mã lưu vực:</Text>
                      <Text style={styles.h3}>{`${item.maluuvuc}`}</Text>
                    </View>
                    <View style={styles.rowInfo}>
                      <Text style={styles.h1}>Loại lưu vực:</Text>
                      <Text style={styles.h3}>{`${item.loailuuvuc}`}</Text>
                    </View>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        <Marker
          coordinate={{
            latitude: 16.649559054878615,
            longitude: 112.72635619193963,
          }}
          title={`Quần đảo Hoàng Sa`}
          description={`Thành phố Đà Nẵng`}>
          <Image source={Images.vietnam} style={{width: 44, height: 44}} />
        </Marker>
        <Marker
          coordinate={{
            latitude: 9.215961963744183,
            longitude: 113.43436962795047,
          }}
          title={`Quần đảo Trường sa`}
          description={`Tỉnh Khánh Hoà`}>
          <Image source={Images.vietnam} style={{width: 44, height: 44}} />
        </Marker>
      </MapView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.viewModalContainer}>
          <Text style={styles.headerModal}>Danh sách lưu vực</Text>
          <TextInput
            style={styles.txInput}
            placeholder="Nhập tên đơn vị"
            onChangeText={text => handleSearch(text)}
            autoCompleteType="off"
            textContentType="none"
            value={findDV}
          />

          <ScrollView style={styles.modalList}>
            {listOutPointFillter.length > 0 &&
              listOutPointFillter.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      paddingBottom: hp('0.6%'),
                      paddingTop: hp('0.8%'),
                      borderBottomWidth: 1,
                    }}
                    onPress={() => selectUnit(item)}>
                    <View
                      style={{
                        width: '40%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {item.hinhanh.length != 0 ? (
                        <Image src={item.hinhanh} style={styles.imgDonVi_s} />
                      ) : (
                        <Image source={Images.logo} style={styles.imgDonVi_s} />
                      )}
                    </View>
                    <View
                      style={{
                        width: '60%',
                      }}>
                      <Text style={[styles.h3, {fontWeight: 'bold'}]}>
                        {item.tendonvi}
                      </Text>
                      <Text style={styles.h3}>{`- ${item.tentinh}`}</Text>
                      <Text style={styles.h3}>{`- ${item.tensong}`}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>

          <View style={styles.botBtnContainer}>
            <Button
              style={[styles.btnModal, {backgroundColor: 'red'}]}
              onPress={() => {
                setModalVisible(false);
              }}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Đóng</Text>
            </Button>
          </View>
        </View>
      </Modal>

      <View style={styles.containerNode} pointerEvents="none">
        <Text style={styles.H1}>Ghi chú</Text>
        <View style={styles.noteRow}>
          <Image source={Images.nmtb} style={{width: 24, height: 24}} />
          <Text style={styles.h2}>NM Thuỷ điện</Text>
        </View>
        <View style={styles.noteRow}>
          <Image source={Images.nmns} style={{width: 24, height: 24}} />
          <Text style={styles.h2}>NM Nước</Text>
        </View>
        <View style={styles.noteRow}>
          <View
            style={[
              styles.noteShape,
              {
                backgroundColor: '#7DF7EF',
                borderWidth: 1,
                borderColor: '#e41a1c',
              },
            ]}
          />
          <Text style={styles.h2}>Lưu vực Liên tỉnh</Text>
        </View>
        <View style={styles.noteRow}>
          <View
            style={[
              styles.noteShape,
              {
                backgroundColor: '#83FAAD',
                borderWidth: 1,
                borderColor: '#e41a1c',
              },
            ]}
          />
          <Text style={styles.h2}>Lưu vực Nội tỉnh</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DVMTRMapScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  noteShape: {
    width: 25,
    height: 20,
    marginRight: 3,
    justifyContent: 'center',
    borderRadius: 5,
  },
  h1: {
    alignContent: 'center',
    justifyContent: 'center',
    color: '#15223d',
    fontSize: 13,
    alignSelf: 'center',
    marginLeft: 5,
    fontWeight: 'bold',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  h2: {
    alignContent: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 13,
    alignSelf: 'center',
    marginLeft: 5,
    flexWrap: 'wrap',
  },
  h3: {
    fontSize: 13,
    marginLeft: 5,
    flexWrap: 'wrap',
  },
  tileModal: {
    fontSize: 14,
    color: 'rgba(32, 73, 68, 1)',
    padding: 4,
  },
  headerModal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#02424f',
    padding: 8,
    alignSelf: 'center',
  },
  containerNode: {
    left: 5,
    padding: 5,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: 15,
    backgroundColor: 'rgba(25,11,61,0.50)',
    borderRadius: 8,
  },
  baseMapContainer: {
    height: 60,
    position: 'absolute',
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    bottom: 200,
    left: 9,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  btnBaseMap: {
    width: 50,
    height: 50,
    borderWidth: 1.2,
    borderColor: 'white',
    borderRadius: 7,
  },
  baseMapView: {
    width: 50,
    height: 50,
    position: 'absolute',
    zIndex: 1000,
    left: 9,
    bottom: 148,
  },
  viewModalContainer: {
    backgroundColor: 'white',
    width: '80%',
    height: 'auto',
    maxHeight: '65%',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginHorizontal: '10%',
    marginTop: '30%',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  baseMapOption: {
    padding: 5,
  },
  H1: {
    fontSize: 13,
    color: 'white',
    fontWeight: 'bold',
    paddingBottom: 3,
    flexWrap: 'wrap',
  },
  noteRow: {
    alignContent: 'center',
    flexDirection: 'row',
    marginBottom: 3,
    justifyContent: 'center',
  },
  backHeartContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
    left: 10,
    top: 40,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBtn: {
    padding: 10,
    borderRadius: 100,
    backgroundColor: Colors.DEFAULT_GREEN,
  },
  bubble: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: 220,
  },
  rowInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  imgDonVi: {
    width: 200,
    height: 120,
    borderRadius: 8,
    marginBottom: 5,
  },
  imgDonVi_s: {
    width: '96%',
    height: hp('8%'),
    borderRadius: 8,
    marginBottom: 5,
  },

  backLevel: {
    width: 45,
    height: 45,
    position: 'absolute',
    zIndex: 1000,
    left: 15,
    top: 110,
    backgroundColor: '#e6e6c5',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 50,
  },
  viewDetail: {
    width: 45,
    height: 45,
    position: 'absolute',
    zIndex: 1000,
    left: 15,
    top: 170,
    backgroundColor: '#e6e6c5',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 50,
  },
  icon: {
    width: 27,
    height: 27,
  },
  botBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 13,
    marginBottom: 13,
    alignItems: 'center',
    width: '100%',
  },
  modalList: {
    width: '100%',
  },
  txInput: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    margin: 4,
    padding: 8,
    width: '100%',
    marginBottom: 10,
  },
  btnModal: {
    borderRadius: 8,
    width: '40%',
    marginHorizontal: '5%',
    justifyContent: 'center',
  },
});
