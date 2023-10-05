import React, {useEffect} from 'react';
import {NativeBaseProvider} from 'native-base';
import RootNavigator from './src/navigation/RootNavigation';
import {Provider} from 'react-redux';
import {store, persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import 'react-native-gesture-handler';

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
