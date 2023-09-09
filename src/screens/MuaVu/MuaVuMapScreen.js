import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Text,
} from 'react-native';
import MapView, {WMSTile, MAP_TYPES} from 'react-native-maps';
import Colors from '../../contants/Colors';
import Images from '../../contants/Images';

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

  const onLayout = event => {
    const {x, y, height, width} = event.nativeEvent.layout;
    setMapViewWidth(width);
    setMapViewHeight(height);
  };

  console.log(monthSelect);

  const listBaseMap = [
    {type: MAP_TYPES.STANDARD, image: Images.baseStandard},
    {type: MAP_TYPES.HYBRID, image: Images.baseHybrid},
    {type: MAP_TYPES.SATELLITE, image: Images.baseSatellite},
    {type: MAP_TYPES.TERRAIN, image: Images.baseTerrain},
  ];

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
        onPress={() => {}}
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
          urlTemplate={`https://bando.ifee.edu.vn:8453/geoserver/ws_muavutrongrung/wms?service=WMS&version=1.1.1&request=GetMap&layers=ws_muavutrongrung:rghc_tinh_muavu${queryLayer}${
            levelSelect == 'province'
              ? '&styles=MuaVu_T' + monthSelect
              : '&styles=MuaVu_T' + monthSelect + '_Huyen'
          }&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true`}
          opacity={1}
          zIndex={100}
          tileSize={512}
        />
      </MapView>

      <View style={styles.containerNode}>
        <Text
          style={{
            fontSize: 13,
            color: 'white',
            fontWeight: 'bold',
            paddingBottom: 3,
          }}>
          Số loài trong mùa vụ
        </Text>
        <View
          style={{
            alignContent: 'center',
            flexDirection: 'row',
            marginBottom: 3,
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              width: 25,
              height: 20,
              marginRight: 3,
              justifyContent: 'center',
              borderRadius: 5,
            }}
          />
          <Text
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 12,
            }}>
            0 Loài
          </Text>
        </View>
        <View
          style={{
            alignContent: 'center',
            flexDirection: 'row',
            marginBottom: 3,
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#33CC33',
              width: 25,
              height: 20,
              marginRight: 3,
              justifyContent: 'center',
              borderRadius: 5,
            }}
          />
          <Text
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 12,
            }}>
            Từ 1 đến 10 loài
          </Text>
        </View>
        <View
          style={{
            alignContent: 'center',
            flexDirection: 'row',
            marginBottom: 3,
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#FFFF00',
              width: 25,
              height: 20,
              marginRight: 3,
              justifyContent: 'center',
              borderRadius: 5,
            }}
          />
          <Text
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 12,
            }}>
            Từ 11 đến 20 loài
          </Text>
        </View>
        <View
          style={{
            alignContent: 'center',
            flexDirection: 'row',
            marginBottom: 3,
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#FF0000',
              width: 25,
              height: 20,
              marginRight: 3,
              justifyContent: 'center',
              borderRadius: 5,
            }}
          />
          <Text
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 12,
            }}>
            Trên 20 loài
          </Text>
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
  baseMapOption: {
    padding: 5,
  },
  containerNode: {
    left: 10,
    padding: 5,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: 100,
    backgroundColor: 'rgba(25,11,61,0.50)',
    borderRadius: 8,
  },
});
