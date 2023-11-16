/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {incrementBagde} from './src/utils/firebaseNotifee';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  await notifee.displayNotification(remoteMessage);
  incrementBagde();
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

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
