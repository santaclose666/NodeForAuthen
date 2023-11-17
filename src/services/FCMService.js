import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
    console.log('register');
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
    console.log('registerFCM');
  };

  checkPermission = onRegister => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          this.getToken(onRegister);
        } else {
          this.requestPermission(onRegister);
        }
      })
      .catch(error => {});
  };

  getToken = onRegister => {
    messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
        }
      })
      .catch(error => {});
  };

  requestPermission = onRegister => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch(error => {});
  };

  deleteToken = () => {
    messaging()
      .deleteToken()
      .catch(error => {});
  };

  createNotificationListeners = async (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    messaging().onNotificationOpenedApp(async remoteMessage => {
      if (remoteMessage) {
        onOpenNotification(remoteMessage.data);
      }
      console.log('notifiListener');
    });

    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          onOpenNotification(remoteMessage.data);
        }
        console.log('initNotifi');
      });

    this.messageListener = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        console.log('B1---------', remoteMessage);
        onNotification(remoteMessage);
      }
    });

    messaging().onTokenRefresh(fcmToken => {
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
    this.messageListener();
  };
}

export const fcmService = new FCMService();
