import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PixelRatio,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import MapView, {WMSTile} from 'react-native-maps';
import {useRoute} from '@react-navigation/native';
import Colors from '../../contants/Colors';
import Images from '../../contants/Images';

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

const MapScreen = navigation => {
  const route = useRoute();
  const data = route.params;
  console.log(navigation);
  const [mapType, setMapType] = useState('satellite');
  const [initialRegion, setInitialRegion] = useState({
    latitude: data.centerPoint.y,
    longitude: data.centerPoint.x,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  });
  const [mapViewHeight, setMapViewHeight] = useState(null);
  const [mapViewWidth, setMapViewWidth] = useState(null);
  const [viewFullInfo, setViewFullInfo] = useState(false);
  const [regionFeatureInfo, setRegionFeatureInfo] = useState(null);
  const [loadingWMSGetInfo, setLoadingWMSGetInfo] = useState(false);

  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

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
    console.log(linkAPIGetInfoFull);
    return linkAPIGetInfoFull;
  };

  const _getWMSFeatureInfo = async linkAPIGetInfoFull => {
    try {
      setViewFullInfo(false);
      const ApiCall = await fetch(linkAPIGetInfoFull);
      const regionFeatureInfo = await ApiCall.json();
      let disPlayData = '';
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

      let disPlayDataFull = '';
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
      console.log(err);
      Alert.alert(
        'Thông tin đối tượng',
        'Không lấy được thông tin đối tượng',
        [
          {
            text: 'Huỷ',
          },
        ],
        {cancelable: false},
      );
    }
  };

  const handleMapPress = event => {
    const position = event.nativeEvent.position;
    if (Platform.OS === 'android') {
      position.x = position.x / PixelRatio.get();
      position.y = position.y / PixelRatio.get();
    }
    _getWMSFeatureInfo(_getWMSInfoAPILink(position.x, position.y));
  };

  const onLayout = event => {
    const {x, y, height, width} = event.nativeEvent.layout;
    console.log(event.nativeEvent.layout);
    setMapViewWidth(width);
    setMapViewHeight(height);
  };
  return (
    <View style={styles.container}>
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
      <MapView
        onLayout={event => onLayout(event)}
        style={styles.map}
        mapType={mapType}
        provider="google"
        initialRegion={initialRegion}
        onPress={handleMapPress}
        onRegionChangeComplete={Region => {
          setRegion(Region);
        }}>
        <WMSTile
          urlTemplate={data.WMSLink[0]}
          opacity={1}
          zIndex={100}
          tileSize={512}
        />
      </MapView>
    </View>
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
});

export default MapScreen;
