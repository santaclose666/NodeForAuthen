import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import StaffListScreen from '../screens/User/StaffListScreen';
import NotifiScreen from '../screens/Notification/NotifiScreens';
import DetailStaffScreen from '../screens/User/DetailStaffScreen';
import HomePageScreen from '../screens/Home/HomePageScreen';
import HistoryApplyLeaveScreen from '../screens/ApplyLeave/HistoryApplyLeaveScreen';
import DocumentListScreen from '../screens/Document/DocumentListScreen';
import CreateApplyLeaveScreen from '../screens/ApplyLeave/CreateApplyLeaveScreen';
import RegisterPlaneScreen from '../screens/TicketManagement/RegisterPlaneScreen';
import RegisterVehicleScreen from '../screens/VehicleManagement/RegisterVehicleScreen';
import HistoryRegisterVehicleScreen from '../screens/VehicleManagement/HistoryRegisterVehicleScreen';
import CreateWorkSchedule from '../screens/WorkShedule/CreateWorkShedule';
import HistoryWorkShedule from '../screens/WorkShedule/HistoryWorkSchedule';
import HistoryRegisterTicketScreen from '../screens/TicketManagement/HistoryRegisterTicketScreen';
import AllWorkScheduleScreen from '../screens/WorkShedule/AllWorkScheduleScreen';
import SelectWMSLayerScreen from '../screens/MapService/SelectWMSLayerScreen1';
import MapScreen from '../screens/MapService/MapScreen';
import ListBioScreen from '../screens/BiodivesityScreen/ListBioScreen';
import SpecieDetailScreen from '../screens/BiodivesityScreen/SpecieDetailScreen';
import ContributorScreen from '../screens/Contributors/Contributors';
import ForestryPrice from '../screens/ForestryPrice/ForestryPrice';

const Stack = createStackNavigator();

const StactNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomePage"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomePage" component={HomePageScreen} />
      <Stack.Screen name="StaffList" component={StaffListScreen} />
      <Stack.Screen name="DetailStaff" component={DetailStaffScreen} />
      <Stack.Screen name="Notification" component={NotifiScreen} />
      <Stack.Screen name="DocumentList" component={DocumentListScreen} />
      <Stack.Screen
        name="HistoryApplyLeave"
        component={HistoryApplyLeaveScreen}
      />
      <Stack.Screen
        name="RegisterApplyLeave"
        component={CreateApplyLeaveScreen}
      />
      <Stack.Screen
        name="RegisterPlaneTicket"
        component={RegisterPlaneScreen}
      />
      <Stack.Screen
        name="HistoryPlaneTicket"
        component={HistoryRegisterTicketScreen}
      />
      <Stack.Screen name="RegisterVehicle" component={RegisterVehicleScreen} />
      <Stack.Screen
        name="HistoryRegisterVehicle"
        component={HistoryRegisterVehicleScreen}
      />
      <Stack.Screen name="CreateWorkSchedule" component={CreateWorkSchedule} />
      <Stack.Screen name="HistoryWorkShedule" component={HistoryWorkShedule} />
      <Stack.Screen name="AllWorkSchedule" component={AllWorkScheduleScreen} />
      <Stack.Screen name="SelectWMSLayer" component={SelectWMSLayerScreen} />
      <Stack.Screen name="MapWMS" component={MapScreen} />
      <Stack.Screen name="ListBio" component={ListBioScreen} />
      <Stack.Screen name="SpecieDetail" component={SpecieDetailScreen} />
      <Stack.Screen name="Contributor" component={ContributorScreen} />
      <Stack.Screen name="ForestPrice" component={ForestryPrice} />
    </Stack.Navigator>
  );
};

export default StactNavigator;
