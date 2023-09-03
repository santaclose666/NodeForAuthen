import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TabNaviagtor from './BottomTab';
import LoginScreen from '../screens/Login/LoginScreen';
import DisplayPDF from '../screens/Document/DisplayPDFScreen';
import DetailNewsScreen from '../screens/News/DetailNewsScreen';
import LinearGradient from 'react-native-linear-gradient';
import HappyBirthdayScreen from '../screens/Happybirthday/HappyBirthdayScreen';
import HappyBirthdayList from '../screens/Happybirthday/HappyBirthdayList';

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <LinearGradient
        colors={['rgba(238,174,202,1)', 'rgba(148,187,233,1)']}
        style={{flex: 1}}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <Stack.Navigator
          initialRouteName={'BottomTab'}
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="BottomTab" component={TabNaviagtor} />
          <Stack.Screen name="PDF" component={DisplayPDF} />
          <Stack.Screen name="DetailNews" component={DetailNewsScreen} />
          <Stack.Screen name="HappyBirthday" component={HappyBirthdayScreen} />
          <Stack.Screen
            name="HappyBirthdayList"
            component={HappyBirthdayList}
          />
        </Stack.Navigator>
      </LinearGradient>
    </NavigationContainer>
  );
};

export default RootNavigator;
