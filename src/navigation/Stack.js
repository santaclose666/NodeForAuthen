import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import StaffListScreen from '../screens/StaffListScreen';
import AllNewsScreen from '../screens/AllNewsScreen';
import DetailNewsScreen from '../screens/DetailNewsScreen';
import NotifiScreen from '../screens/NotifiScreens';
import DetailStaffScreen from '../screens/DetailStaffScreen';
import HomePageScreen from '../screens/HomePageScreen';

import DocumentListScreen from '../screens/DocumentListScreen';

const Stack = createStackNavigator();

const StactNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomePage"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomePage" component={HomePageScreen} />
      <Stack.Screen name="AllNews" component={AllNewsScreen} />
      <Stack.Screen name="DetailNews" component={DetailNewsScreen} />
      <Stack.Screen name="StaffList" component={StaffListScreen} />
      <Stack.Screen name="DetailStaff" component={DetailStaffScreen} />
      <Stack.Screen name="Notification" component={NotifiScreen} />
      <Stack.Screen name="DocumentList" component={DocumentListScreen} />
      
    </Stack.Navigator>
  );
};

export default StactNavigator;
