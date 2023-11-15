/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import {firebase} from '@react-native-firebase/messaging';

firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
  await notifee.displayNotification(remoteMessage);
  await notifee.incrementBadgeCount();
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
    await notifee.decrementBadgeCount();

    await notifee.cancelNotification(notification.id);
  }
});

AppRegistry.registerComponent(appName, () => App);
