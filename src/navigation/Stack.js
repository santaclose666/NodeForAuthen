import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StaffListScreen from '../screens/User/StaffListScreen';
import AllNewsScreen from '../screens/News/AllNewsScreen';
import DetailNewsScreen from '../screens/News/DetailNewsScreen';
import NotifiScreen from '../screens/Notification/NotifiScreens';
import DetailStaffScreen from '../screens/User/DetailStaffScreen';
import HomePageScreen from '../screens/Home/HomePageScreen';
import HistoryApplyLeaveScreen from '../screens/ApplyLeave/HistoryApplyLeaveScreen';
import DocumentListScreen from '../screens/Document/DocumentListScreen';
import CreateApplyLeaveScreen from '../screens/ApplyLeave/CreateApplyLeaveScreen';
import RegisterPlaneScreen from '../screens/TicketManagement/RegisterPlaneScreen';
import HistoryRegisterTicketScreen from '../screens/TicketManagement/HistoryRegisterTicket';
import CreateWorkSchedule from '../screens/WorkShedule/CreateWorkShedule';
import HistoryWorkShedule from '../screens/WorkShedule/HistoryWorkSchedule';
import DetailWorkShedule from '../screens/WorkShedule/DetailWorkShedule';

const Stack = createStackNavigator();

const StactNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomePage"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePage" component={HomePageScreen} />
      <Stack.Screen name="AllNews" component={AllNewsScreen} />
      <Stack.Screen name="DetailNews" component={DetailNewsScreen} />
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

      <Stack.Screen
        name="CreateWorkSchedule"
        component={CreateWorkSchedule}
      />
      <Stack.Screen name="HistoryWorkShedule" component={HistoryWorkShedule} />
      <Stack.Screen name="DetailWorkShedule" component={DetailWorkShedule} />
    </Stack.Navigator>
  );
};

export default StactNavigator;
