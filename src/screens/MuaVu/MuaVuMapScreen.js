import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Text,
  Modal,
  TextInput,
  PixelRatio,
} from 'react-native';
import MapView, {WMSTile, MAP_TYPES} from 'react-native-maps';
import Colors from '../../contants/Colors';
import Images from '../../contants/Images';
import Dimension from '../../contants/Dimension';
import {Dropdown} from 'react-native-element-dropdown';
import Fonts from '../../contants/Fonts';
import {Button, Center, Fab} from 'native-base';

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

const listMonth = [
  {label: 'Tháng 1', value: 1},
  {label: 'Tháng 2', value: 2},
  {label: 'Tháng 3', value: 3},
  {label: 'Tháng 4', value: 4},
  {label: 'Tháng 5', value: 5},
  {label: 'Tháng 6', value: 6},
  {label: 'Tháng 7', value: 7},
  {label: 'Tháng 8', value: 8},
  {label: 'Tháng 9', value: 9},
  {label: 'Tháng 10', value: 10},
  {label: 'Tháng 11', value: 11},
  {label: 'Tháng 12', value: 12},
];

const d = new Date();
let month = d.getMonth();

const MuaVuMapScreen = ({navigation}) => {
  const mapViewRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [mapType, setMapType] = useState(MAP_TYPES.SATELLITE);

  const [mapViewHeight, setMapViewHeight] = useState(null);
  const [mapViewWidth, setMapViewWidth] = useState(null);
  const [queryLayer, setQueryLayer] = useState('');
  const [styleLayer, setStyleLayer] = useState('');
  const [levelSelect, setLevelSelect] = useState('province');
  const [provinceSelectCode, setProvinceSelectCode] = useState(0);
  const [monthSelect, setMonthSelect] = useState(month + 1);
  const [expainBasemap, setExpainBaeMap] = useState(false);
  const [currentBaseImg, setCurrentBaseImg] = useState(Images.baseSatellite);
  const [numberUnit, setNumberUnit] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [listProvince, setListProvince] = useState([]);

  const onLayout = event => {
    const {x, y, height, width} = event.nativeEvent.layout;
    setMapViewWidth(width);
    setMapViewHeight(height);
  };

  const listBaseMap = [
    {type: MAP_TYPES.STANDARD, image: Images.baseStandard},
    {type: MAP_TYPES.HYBRID, image: Images.baseHybrid},
    {type: MAP_TYPES.SATELLITE, image: Images.baseSatellite},
    {type: MAP_TYPES.TERRAIN, image: Images.baseTerrain},
  ];

  const getRegion = (x, y) => {
    //Tinh bbbox
    let minX = region.longitude - region.longitudeDelta / 2; // westLng - min lng
    let minY = region.latitude - region.latitudeDelta / 2; // southLat - min lat
    let maxX = region.longitude + region.longitudeDelta / 2; // eastLng - max lng
    let maxY = region.latitude + region.latitudeDelta / 2; // northLat - max lat
    let linkAPIGetInfoFull = `https://bando.ifee.edu.vn:8453/geoserver/ws_muavutrongrung/wms?service=WMS&version=1.1.1&request=GetFeatureInfo&layers=${
      levelSelect == 'province' ? 'rghc_tinh_muavu' : 'rghc_huyen_muavu'
    }&${queryLayer}&query_layers==ws_muavutrongrung:${
      levelSelect == 'province' ? 'rghc_tinh_muavu' : 'rghc_huyen_muavu'
    }&srs=EPSG:4326&info_format=application/json&bbox=${minX},${minY},${maxX},${maxY}&width=${Math.round(
      mapViewWidth,
    )}&height=${Math.round(mapViewHeight)}&x=${Math.round(x)}&y=${Math.round(
      y,
    )}`;
    console.log(linkAPIGetInfoFull);
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
        style={styles.findPoint}
        onPress={() => {
          setModalVisible(true);
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
          {listBaseMap.map(item => {
            return (
              <TouchableOpacity
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
        onLayout={event => onLayout(event)}
        ref={mapViewRef}
        style={styles.map}
        mapType={mapType}
        provider="google"
        initialRegion={initialRegion}
        onPress={handleMapPress}
        showsMyLocationButton={true}
        showsPointsOfInterest={true}
        showsUserLocation={true}
        showsCompass={true}
        onRegionChangeComplete={Region => {
          setRegion(Region);
        }}>
        <WMSTile
          urlTemplate={`https://bando.ifee.edu.vn:8453/geoserver/ws_ranhgioi/wms?service=WMS&version=1.1.1&request=GetMap&layers=ws_ranhgioi:RGHC_TQuoc_HaiDao&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true`}
          opacity={1}
          zIndex={100}
          tileSize={512}
        />
        <WMSTile
          urlTemplate={`https://bando.ifee.edu.vn:8453/geoserver/ws_muavutrongrung/wms?service=WMS&version=1.1.1&request=GetMap&layers=ws_muavutrongrung:${
            levelSelect == 'province' ? 'rghc_tinh_muavu' : 'rghc_huyen_muavu'
          }${queryLayer}${
            levelSelect == 'province'
              ? '&styles=MuaVu_T' + monthSelect
              : '&styles=MuaVu_T' + monthSelect + '_Huyen'
          }&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true`}
          opacity={1}
          zIndex={100}
          tileSize={512}
        />
      </MapView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        {/* <Pressable style={[Platform.OS === "ios" ? styles.iOSBackdrop : styles.androidBackdrop, styles.backdrop]} onPress={() => this.setState({ setModalVisible: false })} /> */}
        <View style={styles.viewModalContainer}>
          <Text style={styles.headerModal}>Lọc dữ liệu</Text>
          <Text style={styles.tileModal}>Chọn tháng</Text>
          <Dropdown
            style={styles.dropdown}
            autoScroll={false}
            showsVerticalScrollIndicator={false}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={styles.containerOptionStyle}
            imageStyle={styles.imageStyle}
            iconStyle={styles.iconStyle}
            itemContainerStyle={styles.itemContainer}
            itemTextStyle={styles.itemText}
            fontFamily={Fonts.SF_MEDIUM}
            activeColor="#eef2feff"
            placeholder="Hệ toạ độ"
            data={listMonth}
            maxHeight={Dimension.setHeight(30)}
            labelField="label"
            valueField="value"
            value={monthSelect}
            renderLeftIcon={() => {
              return (
                <Image
                  source={Images.worldwide}
                  style={styles.leftIconDropdown}
                />
              );
            }}
            onChange={item => {
              setMonthSelect(item.value);
            }}
          />

          <View style={styles.botBtnContainer}>
            <Button
              style={[styles.btnModal, {backgroundColor: 'green'}]}
              onPress={() => {
                // _findPoint();
                setModalVisible(false);
              }}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Chọn</Text>
            </Button>
            <Button
              style={[styles.btnModal, {backgroundColor: 'red'}]}
              onPress={() => {
                setModalVisible(false);
              }}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Hủy</Text>
            </Button>
          </View>
        </View>
      </Modal>

      <View style={styles.containerNode} pointerEvents="none">
        <Text style={[styles.H1, {color: '#82f06e'}]}>
          Bản đồ mùa vụ Tháng {monthSelect}
        </Text>
        <Text style={styles.H1}>
          <Text style={[styles.H1, {color: '#f53365'}]}>
            {numberUnit + ' ' + (levelSelect == 'province' ? 'Tỉnh' : 'Huyện')}
          </Text>{' '}
          trong mùa vụ
        </Text>
        <Text style={styles.H1}>Ghi chú màu</Text>
        <View style={styles.noteRow}>
          <View style={[styles.noteShape, {backgroundColor: 'white'}]} />
          <Text style={styles.h2}>0 Loài</Text>
        </View>
        <View style={styles.noteRow}>
          <View style={[styles.noteShape, {backgroundColor: '#33CC33'}]} />
          <Text style={styles.h2}>Từ 1 đến 10 loài</Text>
        </View>
        <View style={styles.noteRow}>
          <View style={[styles.noteShape, {backgroundColor: '#FFFF00'}]} />
          <Text style={styles.h2}>Từ 11 đến 20 loài</Text>
        </View>
        <View style={styles.noteRow}>
          <View style={[styles.noteShape, {backgroundColor: '#FF0000'}]} />
          <Text style={styles.h2}>Trên 20 loài</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MuaVuMapScreen;

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
  baseMapView: {
    width: 50,
    height: 50,
    position: 'absolute',
    zIndex: 1000,
    left: 9,
    bottom: 186,
  },
  baseMapContainer: {
    height: 60,
    position: 'absolute',
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    bottom: 250,
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
  viewModalContainer: {
    backgroundColor: 'white',
    width: '80%',
    height: 'auto',
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
  H1: {
    fontSize: 13,
    color: 'white',
    fontWeight: 'bold',
    paddingBottom: 3,
  },
  noteRow: {
    alignContent: 'center',
    flexDirection: 'row',
    marginBottom: 3,
    justifyContent: 'center',
  },
  noteShape: {
    width: 25,
    height: 20,
    marginRight: 3,
    justifyContent: 'center',
    borderRadius: 5,
  },
  h2: {
    alignContent: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 12,
  },
  findPoint: {
    width: 45,
    height: 45,
    position: 'absolute',
    zIndex: 1000,
    left: 15,
    top: 120,
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
  leftIconDropdown: {
    width: 20,
    height: 20,
    marginRight: Dimension.setWidth(1.8),
  },
  tileModal: {
    fontSize: 14,
    color: 'rgba(32, 73, 68, 1)',
    padding: 4,
  },
  headerModal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(32, 73, 68, 1)',
    padding: 8,
    alignSelf: 'center',
  },
  botBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 13,
    marginBottom: 13,
  },
  dropdown: {
    height: Dimension.setHeight(4.5),
    marginHorizontal: Dimension.setWidth(1.6),
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    width: '100%',
  },
  placeholderStyle: {
    fontSize: Dimension.fontSize(15),
  },
  selectedStyle: {
    borderRadius: 12,
    borderWidth: 0,
  },
  selectedTextStyle: {
    color: '#277aaeff',
    fontSize: Dimension.fontSize(15),
  },
  imageStyle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  containerOptionStyle: {
    borderRadius: 12,
    backgroundColor: '#f6f6f8ff',
    width: '110%',
    alignSelf: 'center',
  },
  itemContainer: {
    borderRadius: 12,
  },
  itemText: {
    color: '#57575a',
    fontSize: Dimension.fontSize(14),
  },
  btnModal: {
    borderRadius: 8,
    width: '40%',
    marginHorizontal: '5%',
    justifyContent: 'center',
  },
});
