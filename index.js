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
  await notifee
    .setBadgeCount(16)
    .then(() => notifee.getBadgeCount())
    .then(count => console.log(count));
  console.log(remoteMessage);
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  console.log('background app', notification);

  if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
    await notifee.decrementBadgeCount();

    await notifee.cancelNotification(notification.id);
  }
});

AppRegistry.registerComponent(appName, () => App);
