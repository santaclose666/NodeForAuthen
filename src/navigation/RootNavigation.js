import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TabNaviagtor from './BottomTab';
import LoginScreen from '../screens/Login/LoginScreen';
import DisplayPDF from '../screens/Document/DisplayPDFScreen';
import DetailNewsScreen from '../screens/News/DetailNewsScreen';
import MyWorkScheduleScreen from '../screens/WorkShedule/MyWorkScheduleScreen';

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'BottomTab'}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="BottomTab" component={TabNaviagtor} />
        <Stack.Screen name="PDF" component={DisplayPDF} />
        <Stack.Screen name="DetailNews" component={DetailNewsScreen} />
        <Stack.Screen name="MyWorkSchedule" component={MyWorkScheduleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
