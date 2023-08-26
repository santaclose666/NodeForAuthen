import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import MapView, {WMSTile} from 'react-native-maps';
import {useRoute} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 21.1147;
const LONGITUDE = 105.546;
const LATITUDE_DELTA = 1;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

const MapScreen = navigation => {
  const route = useRoute();
  const data = route.params;
  const [linkWMS, setLinkWMS] = useState(data.linkWMS);
  const [mapType, setMapType] = useState('satellite');
  const [initialRegion, setInitialRegion] = useState({
    latitude: 21.058052476351282,
    longitude: 105.36820924109524,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [mapViewHeight, setMapViewHeight] = useState(null);
  const [mapViewWidth, setMapViewWidth] = useState(null);

  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  useEffect(() => {
    getInitRegion();
    setLinkWMS(data.linkWMS);
  }, []);

  const getInitRegion = () => {
    // {
    //   latitude: 37.78825,
    //   longitude: -122.4324,
    //   latitudeDelta: 0.0922,
    //   longitudeDelta: 0.0421,
    // }
  };

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
    )}&height=${Math.round(mapViewHeight)}&x=${x}&y=${y}`;
    console.log(linkAPIGetInfoFull);
    return linkAPIGetInfoFull;
  };

  const _getWMSFeatureInfo = async linkAPIGetInfoFull => {
    try {
      const ApiCall = await fetch(linkAPIGetInfoFull);
      const regionFeatureInfo = await ApiCall.json();
      console.log(regionFeatureInfo);
    } catch (err) {
      console.log(err);
    }
  };

  const handleMapPress = event => {
    const {coordinate} = event.nativeEvent;
    console.log(coordinate);
    _getWMSFeatureInfo(
      _getWMSInfoAPILink(coordinate.latitude, coordinate.longitude),
    );
  };

  const onLayout = event => {
    const {x, y, height, width} = event.nativeEvent.layout;
    setMapViewWidth(width);
    setMapViewHeight(height);
  };
  return (
    <View style={styles.container}>
      <MapView
        onLayout={event => onLayout(event)}
        style={styles.map}
        mapType={mapType}
        provider="google"
        initialRegion={initialRegion}
        onPress={handleMapPress}>
        <WMSTile
          urlTemplate={linkWMS}
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
});

export default MapScreen;
