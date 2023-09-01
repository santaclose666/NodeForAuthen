import {getAllNotifi} from '../redux/apiRequest';
import {getCurrentTime} from './serviceFunction';
import messaging from '@react-native-firebase/messaging';

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
    //   await messaging().registerDeviceForRemoteMessages();
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

  messaging().onMessage(async remoteMessage => {
    await saveNotification(notifiData, remoteMessage, dispatch);
  });
};
