import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PixelRatio,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  Text,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {Button} from 'native-base';
import MapView, {WMSTile, Polygon, MAP_TYPES, Marker} from 'react-native-maps';
import {useRoute} from '@react-navigation/native';
import Colors from '../../contants/Colors';
import Images from '../../contants/Images';
import Dimension from '../../contants/Dimension';
import dataProjection from '../../utils/Vn2000Projection.json';
import {Dropdown} from 'react-native-element-dropdown';
import Fonts from '../../contants/Fonts';

var epsg = require('epsg-to-proj');
var proj = require('proj4');

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 21.1147;
const LONGITUDE = 105.546;
const LATITUDE_DELTA = 1;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

const listDisplayLabel = [
  'matinh',
  'mahuyen',
  'maxa',
  'huyen',
  'xa',
  'churung',
  'tk',
  'khoanh',
  'lo',
  'ldlr',
  'maldlr',
  'sldlr',
  'malr3',
];
const listDisplayLabelExplant = [
  'Mã tỉnh',
  'Mã huyện',
  'Mã xã',
  'Huyện',
  'Xã',
  'Chủ rừng',
  'Tiểu khu',
  'Khoảnh',
  'Lô',
  'Trạng thái',
  'Mã trạng thái',
  'Loài cây',
  'Quy hoạch',
];

const MapScreen = ({navigation}) => {
  const route = useRoute();
  const data = route.params;

  const [mapViewHeight, setMapViewHeight] = useState(null);
  const [mapViewWidth, setMapViewWidth] = useState(null);
  const [viewFullInfo, setViewFullInfo] = useState(false);
  const [regionFeatureInfo, setRegionFeatureInfo] = useState(null);
  const [loadingWMSGetInfo, setLoadingWMSGetInfo] = useState(false);
  const [selectRegion, setSelectRegion] = useState([]);
  const [expainBasemap, setExpainBaeMap] = useState(false);
  const [currentBaseImg, setCurrentBaseImg] = useState(Images.baseSatellite);
  const [selectedOptionCRS, setSelectedOptionCRS] = useState(0);
  const [listFindPoint, setListFindPoint] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [latFindPoint, setLatFindPoint] = useState('');
  const [longFindPoint, setLongFindPoint] = useState('');
  const [pointPress, setPointPress] = useState({});
  const mapViewRef = useRef(null);

  const listProject = dataProjection.map(item => {
    return {label: `${item.province} - ${item.zone}`, value: item.epsg_code};
  });

  const [mapType, setMapType] = useState(MAP_TYPES.SATELLITE);
  const [initialRegion, setInitialRegion] = useState({
    latitude: Number(data.centerPoint.y),
    longitude: Number(data.centerPoint.x),
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  });

  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const listBaseMap = [
    {type: MAP_TYPES.STANDARD, image: Images.baseStandard},
    {type: MAP_TYPES.HYBRID, image: Images.baseHybrid},
    {type: MAP_TYPES.SATELLITE, image: Images.baseSatellite},
    {type: MAP_TYPES.TERRAIN, image: Images.baseTerrain},
  ];

  // ham lay link api quyery data tu WMS
  const _getWMSInfoAPILink = (x, y) => {
    //Tinh bbbox
    let minX = region.longitude - region.longitudeDelta / 2; // westLng - min lng
    let minY = region.latitude - region.latitudeDelta / 2; // southLat - min lat
    let maxX = region.longitude + region.longitudeDelta / 2; // eastLng - max lng
    let maxY = region.latitude + region.latitudeDelta / 2; // northLat - max lat
    let linkAPIGetInfoFull = `${
      data.linkRootQueryInfo
    }&bbox=${minX},${minY},${maxX},${maxY}&width=${Math.round(
      mapViewWidth,
    )}&height=${Math.round(mapViewHeight)}&x=${Math.round(x)}&y=${Math.round(
      y,
    )}`;
    return linkAPIGetInfoFull;
  };

  const _getWMSFeatureInfo = async linkAPIGetInfoFull => {
    try {
      setViewFullInfo(false);
      const ApiCall = await fetch(linkAPIGetInfoFull);
      const regionFeatureInfo = await ApiCall.json();
      let disPlayData = `Vị trí chọn: \n Latitude: ${pointPress.latitude} \n Longitude: ${pointPress.longitude} \n`;
      // Dat vung to mau
      setSelectRegion(regionFeatureInfo.features[0].geometry.coordinates[0][0]);
      // lay tt thuoc tinh
      for (let [key, value] of Object.entries(
        regionFeatureInfo.features[0].properties,
      )) {
        for (var i = 0; i < listDisplayLabel.length; i++) {
          if (key.toLowerCase() === listDisplayLabel[i].toLowerCase()) {
            disPlayData =
              disPlayData + listDisplayLabelExplant[i] + ': ' + value + '\n';
          }
        }
      }

      let disPlayDataFull = `Vị trí chọn: \n Latitude: ${pointPress.latitude} \n Longitude: ${pointPress.longitude} \n`;
      for (let [key, value] of Object.entries(
        regionFeatureInfo.features[0].properties,
      )) {
        disPlayDataFull = disPlayDataFull + key + ': ' + value + '\n';
      }
      setRegionFeatureInfo(regionFeatureInfo.features[0].properties);
      setLoadingWMSGetInfo(false);

      Alert.alert(
        'Thông tin đối tượng',
        disPlayData,
        [
          {
            text: 'Xem thông tin đầy đủ',
            onPress: () =>
              Alert.alert(
                'Thông tin đối tượng',
                disPlayDataFull,
                [
                  {
                    text: 'Ok',
                    onPress: () => setLoadingWMSGetInfo(false),
                  },
                ],
                {cancelable: false},
              ),
          },
          {
            text: 'Ok',
            onPress: () => setLoadingWMSGetInfo(false),
          },
        ],
        {cancelable: false},
      );
    } catch (err) {
      console.log('222', err);
      setSelectRegion([]);
    }
  };

  const handleMapPress = event => {
    try {
      setPointPress(event.nativeEvent.coordinate);
      const position = event.nativeEvent.position;
      if (Platform.OS === 'android') {
        position.x = position.x / PixelRatio.get();
        position.y = position.y / PixelRatio.get();
      }
      _getWMSFeatureInfo(_getWMSInfoAPILink(position.x, position.y));
    } catch (err) {
      console.log('111', err);
    }
  };

  const _gotoLocation = (lat, long, latDelta, longDelta) => {
    console.log('go', lat, long);
    mapViewRef.current.animateToRegion({
      latitude: lat,
      longitude: long,
      latitudeDelta: latDelta,
      longitudeDelta: longDelta,
    });
  };

  const onLayout = event => {
    const {x, y, height, width} = event.nativeEvent.layout;
    console.log(event.nativeEvent.layout);
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

  // Tim diem bang toa do
  const _findPoint = () => {
    console.log(longFindPoint, latFindPoint, selectedOptionCRS);
    var findPoint = [];
    var pointConvert = [];
    if (latFindPoint == '' || longFindPoint == '') {
      Alert.alert('Dữ liệu đầu vào trống!');
      return null;
    }

    if (isNaN(latFindPoint) || isNaN(longFindPoint)) {
      Alert.alert('Dữ liệu đầu vào không đúng định dạng số!');
      return null;
    }

    try {
      if (selectedOptionCRS === 4326) {
        pointConvert = [Number(longFindPoint), Number(latFindPoint)];
      } else {
        var pointConvert = proj(epsg[selectedOptionCRS], epsg[4326], [
          Number(latFindPoint),
          Number(longFindPoint),
        ]);
      }

      findPoint = {
        id: listFindPoint.length,
        coordinate: {latitude: pointConvert[1], longitude: pointConvert[0]},
        baseCoordinates: {latitude: latFindPoint, longitude: longFindPoint},
      };

      if (
        findPoint.coordinate.latitude >= -90 &&
        findPoint.coordinate.latitude <= 90 &&
        findPoint.coordinate.longitude >= -180 &&
        findPoint.coordinate.longitude <= 180
      ) {
        let newListPointFind = [];
        newListPointFind = [...listFindPoint, findPoint];

        setListFindPoint(newListPointFind);
        setModalVisible(false);
        setLatFindPoint(null);
        setLongFindPoint(null);
        _gotoLocation(pointConvert[1], pointConvert[0], 0.015, 0.015);
      } else {
        Alert.alert('Dữ liệu đầu vào không hợp lệ!');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Lỗi chuyển toạ độ, kiểm tra lại dữ liệu đầu vào!');
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
        style={styles.baseMapView}
        onPress={() => {
          setExpainBaeMap(!expainBasemap);
        }}>
        <Image source={currentBaseImg} style={styles.btnBaseMap} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.findPoint}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Image source={Images.search} style={styles.icon} />
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
        {selectRegion.length > 2 && (
          <Polygon
            coordinates={fomatCoordinate(selectRegion)}
            strokeColor={'red'}
            fillColor={'rgba(242, 227, 235, 0.3)'}
            strokeWidth={2}
            zIndex={200}
          />
        )}

        {listFindPoint.length > 0 &&
          listFindPoint.map(item => {
            return (
              <Marker
                key={item.id}
                coordinate={item.coordinate}
                title={`Điểm tìm kiếm Số Số ${item.id}`}
                description={`Lat: ${item.baseCoordinates.latitude}; Long: ${item.baseCoordinates.longitude}`}
              />
            );
          })}
        <WMSTile
          urlTemplate={data.WMSLink[0]}
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
        <View
          style={{
            backgroundColor: 'white',
            width: '80%',
            height: 'auto',
            justifyContent: 'center',
            alignItems: 'baseline',
            marginHorizontal: '10%',
            marginTop: '30%',
            paddingHorizontal: 20,
            borderRadius: 8,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: 'rgba(32, 73, 68, 1)',
              padding: 8,
              marginLeft: '15%',
            }}>
            Tìm điểm theo tọa độ
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: 'rgba(32, 73, 68, 1)',
              padding: 4,
            }}>
            Nhập Vĩ độ
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: 'grey',
              borderRadius: 8,
              margin: 4,
              padding: 4,
              width: '100%',
            }}
            placeholder="Ví dụ: 12.432423 hoặc 435334"
            onChangeText={text => setLatFindPoint(text)}
            autoCompleteType="off"
            textContentType="none"
            value={latFindPoint}
          />
          <Text
            style={{
              fontSize: 14,
              color: 'rgba(32, 73, 68, 1)',
              padding: 4,
            }}>
            Nhập Kinh độ
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: 'grey',
              borderRadius: 8,
              margin: 4,
              padding: 4,
              width: '100%',
            }}
            placeholder="Ví dụ: 106.432423 hoặc 8974849"
            onChangeText={text => setLongFindPoint(text)}
            autoCompleteType="off"
            textContentType="none"
            value={longFindPoint}
          />
          <Text
            style={{
              fontSize: 14,
              color: 'rgba(32, 73, 68, 1)',
              padding: 4,
            }}>
            Chọn hệ toạ độ
          </Text>

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
            data={listProject}
            maxHeight={Dimension.setHeight(30)}
            labelField="label"
            valueField="value"
            value={selectedOptionCRS}
            renderLeftIcon={() => {
              return (
                <Image
                  source={Images.worldwide}
                  style={styles.leftIconDropdown}
                />
              );
            }}
            onChange={item => {
              setSelectedOptionCRS(item.value);
              console.log(item.value);
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              marginTop: 13,
              marginBottom: 13,
            }}>
            <Button
              style={{
                borderRadius: 8,
                backgroundColor: 'green',
                width: '40%',
                marginHorizontal: '5%',
                justifyContent: 'center',
              }}
              onPress={() => {
                _findPoint();
              }}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Tìm điểm</Text>
            </Button>
            <Button
              style={{
                borderRadius: 8,
                backgroundColor: 'red',
                width: '40%',
                marginHorizontal: '5%',
                justifyContent: 'center',
              }}
              onPress={() => {
                setModalVisible(false);
                setLatFindPoint(null);
                setLongFindPoint(null);
              }}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Hủy</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

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
    bottom: 35,
  },
  baseMapContainer: {
    height: 60,
    position: 'absolute',
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    bottom: 94,
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
  icon: {
    width: 30,
    height: 30,
  },

  findPoint: {
    width: 45,
    height: 45,
    position: 'absolute',
    zIndex: 1000,
    left: 15,
    top: 120,
    backgroundColor: '#b3e3ba',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 50,
  },

  containerEachLine: {
    marginBottom: Dimension.setHeight(0.5),
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 12,
    paddingVertical: Dimension.setHeight(1),
    paddingHorizontal: Dimension.setWidth(2),
  },

  title: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: Dimension.fontSize(15),
    color: '#8bc7bc',
    marginBottom: Dimension.setHeight(1),
  },

  dropdown: {
    height: Dimension.setHeight(4.5),
    marginHorizontal: Dimension.setWidth(1.6),
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    width: '100%',
  },
  leftIconDropdown: {
    width: 20,
    height: 20,
    marginRight: Dimension.setWidth(1.8),
  },
  itemContainer: {
    borderRadius: 12,
  },
  itemText: {
    fontSize: 13,
  },
});

export default MapScreen;
