import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import {topicForAll} from './AllTopic';

export const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      topicForAll();
    } catch (err) {
      console.log(err);
    }
  } else {
    await request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
      console.log(result);
    });
    const authStatus = await messaging().requestPermission({
      alert: true,
      criticalAlert: true,
      badge: true,
      sound: true,
      announcement: true,
    });
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  }
};
