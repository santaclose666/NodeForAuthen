import {useEffect} from 'react';
import {getAllNotifi} from '../redux/apiRequest';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';

PushNotification.createChannel(
  {
    channelId: 'channel-id',
    channelName: 'My channel',
    channelDescription: 'A channel to categorise your notifications',
    playSound: false,
    soundName: 'default',
    importance: Importance.HIGH,
    vibrate: true,
  },
  created => console.log(`createChannel returned '${created}'`),
);

export const getToken = async () => {
  try {
    const token = await messaging().getToken();

    return token;
  } catch (error) {
    console.log(error);
  }
};

export const navigateNotifi = navigation => {
  navigation.navigate('Notification');
};

export const notificationListenerData = (navigation) => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log(remoteMessage);
  });

  PushNotification.configure({
    onRegister: token => {
      console.log('TOKEN:', token);
    },

    onNotification: notification => {
      console.log(notification);

      if (notification.userInteraction) {
        navigation.navigate('Notification');
      }
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    onAction: notification => {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);
    },

    onRegistrationError: err => {
      console.error(err.message, err);
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });
};

export const notificationOpenApp = async navigation => {
  const notificationOpen = await messaging().getInitialNotification();
  if (notificationOpen) {
    navigateNotifi(navigation);
  }

  messaging().onNotificationOpenedApp(async remoteMessage => {
    if (remoteMessage) {
      navigateNotifi(navigation);
    }
  });
};

export const ForegroundListener = () => {
  useEffect(() => {
    const unSubcribe = messaging().onMessage(async remoteMessage => {
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
