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
import ForestPrice from '../screens/ForestPrice/ForestPrice';
import QLRBVScreen from '../screens/QLRBV/QLRBV';
import ForestryScreen from '../screens/Forestry/ForestryScreen';
import SendNotification from '../screens/Notification/SendNotification';
import ContributionDataScreen from '../screens/ContributionData/ContributionData';
import KKRScreen from '../screens/KKR/KKRScreen';
import TcvnScreen from '../screens/Tcvn/TcvnScreen';
import TreeTypeScreen from '../screens/TreeType/TreeTypeScreen';
import DMKTKTScreen from '../screens/DMKTKT/DMKTKTScreen';
import VP809Screen from '../screens/VP809/VP809Screen';
import SelectProvinceFFWScreen from '../screens/ForestFire/SelectProvinceFFWScreen';
import RegisterDevices from '../screens/Device/RegisterDevice';
import RegisterItemOffice from '../screens/ItemOffice/RegisterItemOffice';
import HistoryRegisterItem from '../screens/ItemOffice/HistoryRegisterItem';
import HistoryRegisterDevice from '../screens/Device/HistoryRegisterDevice';
import DVMTRMapScreen from '../screens/DVMTR/DVMTRMapScreen';
import {screen} from '../screens/AllScreen/allScreen';

const Stack = createStackNavigator();

const StactNavigator = () => {
  const dataNavigator = [
    {name: screen.home, component: HomePageScreen},
    {name: screen.staffList, component: StaffListScreen},
    {name: screen.staffDetail, component: DetailStaffScreen},
    {name: screen.notification, component: NotifiScreen},
    {name: screen.vnff, component: DocumentListScreen},
    {name: screen.applyLeaveList, component: HistoryApplyLeaveScreen},
    {name: screen.registerApplyLeave, component: CreateApplyLeaveScreen},
    {name: screen.registerPlaneTicket, component: RegisterPlaneScreen},
    {name: screen.planeTicketList, component: HistoryRegisterTicketScreen},
    {name: screen.registerVehicle, component: RegisterVehicleScreen},
    {name: screen.vehicleList, component: HistoryRegisterVehicleScreen},
    {name: screen.registerWorkSchedule, component: CreateWorkSchedule},
    {name: screen.workScheduleList, component: HistoryWorkShedule},
    {name: screen.allWorkSchedule, component: AllWorkScheduleScreen},
    {name: screen.deviceList, component: HistoryRegisterDevice},
    {name: screen.registerDevice, component: RegisterDevices},
    {name: screen.officeItemList, component: HistoryRegisterItem},
    {name: screen.registerOfficeItem, component: RegisterItemOffice},
    {name: screen.mapService, component: SelectWMSLayerScreen},
    {name: screen.mapDetail, component: MapScreen},
    {name: screen.bioList, component: ListBioScreen},
    {name: screen.bioDetail, component: SpecieDetailScreen},
    {name: screen.contributor, component: ContributorScreen},
    {name: screen.kgr, component: ForestPrice},
    {name: screen.qlrbv, component: QLRBVScreen},
    {name: screen.forestry, component: ForestryScreen},
    {name: screen.sendNotification, component: SendNotification},
    {name: screen.kkr, component: KKRScreen},
    {name: screen.tcvn, component: TcvnScreen},
    {name: screen.giongln, component: TreeTypeScreen},
    {name: screen.dmktkt, component: DMKTKTScreen},
    {name: screen.fireWarning, component: SelectProvinceFFWScreen},
    {name: screen.vp809, component: VP809Screen},
    {name: screen.contributorData, component: ContributionDataScreen},
    {name: screen.dvmtrMap, component: DVMTRMapScreen},
  ];

  return (
    <Stack.Navigator
      initialRouteName="HomePage"
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
  );
};

export default StactNavigator;
