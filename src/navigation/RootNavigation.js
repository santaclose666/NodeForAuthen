import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TabNaviagtor from './BottomTab';
import LoginScreen from '../screens/LoginScreen';
import DisplayPDF from '../screens/DisplayPDFScreen';
import {useSelector} from 'react-redux';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const user = useSelector(state => state.auth.login?.currentUser);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'BottomTab'}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="BottomTab" component={TabNaviagtor} />
        <Stack.Screen name="PDF" component={DisplayPDF} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
