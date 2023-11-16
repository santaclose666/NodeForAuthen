import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import {
  PERMISSIONS,
  request,
  requestNotifications,
} from 'react-native-permissions';

export const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
  } else {
    await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
    await requestNotifications(['alert', 'sound', 'badge', 'criticalAlert']);
    await messaging().requestPermission();
  }
};
