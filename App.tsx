import React, {useLayoutEffect} from 'react';
import {NativeBaseProvider} from 'native-base';
import RootNavigator from './src/navigation/RootNavigation';
import {Provider} from 'react-redux';
import {store, persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import 'react-native-gesture-handler';
import BootSplash from 'react-native-bootsplash';
import codePush from 'react-native-code-push';
import { topicForAll } from './src/utils/AllTopic';
import { clearBadgeCount, DisplayNotification } from './src/utils/firebaseNotifee';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  useLayoutEffect(() => {
    setTimeout(() => {
      BootSplash.hide({fade: true});
    }, 1606);

    topicForAll();
    clearBadgeCount();
    const unSubscribed = messaging().onMessage(async remoteMessage => {
      DisplayNotification(remoteMessage);
    });

    return () =>{
      unSubscribed()
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NativeBaseProvider>
          <RootNavigator />
        </NativeBaseProvider>
      </PersistGate>
    </Provider>
  );
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.IMMEDIATE,
};

export default codePush(codePushOptions)(App);
