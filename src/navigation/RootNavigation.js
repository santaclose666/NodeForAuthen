import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TabNaviagtor from './BottomTab';
import LoginScreen from '../screens/Login/LoginScreen';
import DetailNewsScreen from '../screens/News/DetailNewsScreen';
import HappyBirthdayScreen from '../screens/Happybirthday/HappyBirthdayScreen';
import HappyBirthdayList from '../screens/Happybirthday/HappyBirthdayList';
import MainMV from '../screens/MuaVu/MainMV';
import DisplayPDF from '../screens/Document/DisplayPDFScreen';
import {screen} from '../screens/AllScreen/allScreen';
import MainVNFF from '../screens/Document/MainVNFF';
import Webview from '../screens/ForestryDepartment/WebView';
import DetailNationPark from '../screens/NationalPark/DetailNationPark';
import SpecieDetailScreen from '../screens/BiodivesityScreen/SpecieDetailScreen';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const dataNavigator = [
    {name: screen.login, component: LoginScreen},
    {name: 'BottomTab', component: TabNaviagtor},
    {name: screen.pdf, component: DisplayPDF},
    {name: screen.detailNews, component: DetailNewsScreen},
    {name: screen.hpbd, component: HappyBirthdayScreen},
    {name: screen.hpbdList, component: HappyBirthdayList},
    {name: screen.muavu, component: MainMV},
    {name: screen.vnff, component: MainVNFF},
    {name: screen.webview, component: Webview},
    {name: screen.detailNationPark, component: DetailNationPark},
    {name: screen.bioDetail, component: SpecieDetailScreen},
  ];

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'BottomTab'}
        screenOptions={{headerShown: false}}>
        {dataNavigator.map((item, index) => {
          return (
            <Stack.Screen
              key={index}
              name={item.name}
              component={item.component}
            />
          );
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
