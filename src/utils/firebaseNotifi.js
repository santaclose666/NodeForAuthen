import {useEffect} from 'react';
import {getAllNotifi} from '../redux/apiRequest';
import {getCurrentTime} from './serviceFunction';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';

PushNotification.createChannel(
  {
    channelId: 'channel-id', // (required)
    channelName: 'My channel', // (required)
    channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
    playSound: false, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

export const saveNotification = async (notifiData, remoteMessage, dispatch) => {
  if (remoteMessage) {
    const newObj = remoteMessage.data;
    newObj.time = getCurrentTime();

    let newNotifi = notifiData ? [newObj, ...notifiData] : [newObj];

    getAllNotifi(newNotifi, dispatch);
  }
};

export const getToken = async () => {
  try {
    const token = await messaging().getToken();

    return token;
  } catch (error) {
    console.log(error);
  }
};

export const notificationListener = async (
  notifiData,
  navigation,
  dispatch,
) => {
  const notificationOpen = await messaging().getInitialNotification();
  await saveNotification(notifiData, notificationOpen, dispatch);

  messaging().onNotificationOpenedApp(async remoteMessage => {
    await saveNotification(notifiData, remoteMessage, dispatch);
  });
};

export const ForegroundListener = () => {
  useEffect(() => {
    const unSubcribe = messaging().onMessage(async remoteMessage => {
      // await saveNotification(notifiData, remoteMessage, dispatch);

      const title = remoteMessage.notification.title;
      const body = remoteMessage.notification.body;

      if (Platform.OS == 'android') {
        PushNotification.localNotification({
          channelId: 'channel-id',
          channelName: 'My channel',
          title: title,
          message: body,
          soundName: 'default',
          vibrate: true,
          playSound: true,
        });
      } else {
        PushNotificationIOS.addNotificationRequest({
          id: remoteMessage.messageId,
          title: title,
          body: body,
          userInfo: remoteMessage.data,
        });
      }
    });

    return unSubcribe;
  }, []);

  return null;
};
