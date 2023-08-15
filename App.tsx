import React from 'react';
import {NativeBaseProvider} from 'native-base';
import RootNavigator from './src/navigation/RootNavigation';
import {Provider} from 'react-redux';
import {store, persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import 'react-native-gesture-handler';
import {connectToDevTools} from 'react-devtools-core';

if (__DEV__) {
  connectToDevTools({
    host: 'localhost',
    port: 8097,
  });
}

const App = () => {
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

export default App;
