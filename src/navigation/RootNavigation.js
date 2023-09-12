import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TabNaviagtor from './BottomTab';
import LoginScreen from '../screens/Login/LoginScreen';
import DisplayPDF from '../screens/Document/DisplayPDFScreen';
import DetailNewsScreen from '../screens/News/DetailNewsScreen';
import HappyBirthdayScreen from '../screens/Happybirthday/HappyBirthdayScreen';
import HappyBirthdayList from '../screens/Happybirthday/HappyBirthdayList';
import MainMV from '../screens/Muavu/MainMV';

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
        <Stack.Screen name="HappyBirthday" component={HappyBirthdayScreen} />
        <Stack.Screen name="HappyBirthdayList" component={HappyBirthdayList} />
        <Stack.Screen name="Muavu" component={MainMV} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
