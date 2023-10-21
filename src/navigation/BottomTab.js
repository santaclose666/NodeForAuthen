import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import StactNavigator from './Stack';
import NotifiScreen from '../screens/Notification/NotifiScreens';
import AllNewsScreen from '../screens/News/AllNewsScreen';
import Images from '../contants/Images';
import CustomBottomTab from './BottomTabComponent/CustomBottomTab';

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
      name: 'AllNews',
      component: AllNewsScreen,
      iconInactive: Images.news1,
      iconActive: Images.news2,
      activeColor: '#ffba00',
    },
  ]);

  const CustomBottomTabs = props => {
    return <CustomBottomTab {...props} />;
  };

  return (
    <Tab.Navigator
      tabBar={CustomBottomTabs}
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      {screensList.map((item, index) => (
        <Tab.Screen key={index} name={item.name} component={item.component} />
      ))}
    </Tab.Navigator>
  );
};

export default TabNaviagtor;
