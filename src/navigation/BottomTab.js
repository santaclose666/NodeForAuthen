import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import StactNavigator from './Stack';
import NotifiScreen from '../screens/NotifiScreens';
import DetailStaffScreen from '../screens/DetailStaffScreen';
import {View, Image} from 'react-native';
import Dimension from '../contants/Dimension';
import Images from '../contants/Images';

const Tab = createBottomTabNavigator();

const TabNaviagtor = () => {
  const [screensList, setScreensList] = useState([
    {
      name: 'Notification',
      component: NotifiScreen,
      iconInactive: Images.notification2,
      iconActive: Images.notificationActive,
      activeColor: '#1caeba',
    },
    {
      name: 'Home',
      component: StactNavigator,
      iconInactive: Images.home,
      iconActive: Images.homeActive,
      activeColor: '#63c05f',
    },
    {
      name: 'User',
      component: DetailStaffScreen,
      iconInactive: Images.user2,
      iconActive: Images.userActive,
      activeColor: '#ffba00',
    },
  ]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(148,187,233,0.3)',
          elevation: 4,
          height: Dimension.setHeight(10),
        },
      }}>
      {screensList.map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.name}
          component={item.component}
          options={{
            tabBarIcon: ({focused}) => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: Dimension.setHeight(6),
                  width: Dimension.setHeight(6),
                  borderRadius: 50,
                  backgroundColor: focused
                    ? item.activeColor
                    : 'rgba(238,174,202,0.12)',
                }}>
                <Image
                  source={focused ? item.iconActive : item.iconInactive}
                  resizeMode="contain"
                  style={{
                    width: 22,
                    height: 22,
                    marginBottom: 2,
                    tintColor: focused ? '#ffffff' : item.activeColor,
                  }}
                />
              </View>
            ),
            tabBarShowLabel: false,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default TabNaviagtor;
