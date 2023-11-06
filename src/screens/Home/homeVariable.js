import Images from '../../contants/Images';
import {screen} from '../AllScreen/allScreen';

export const forestryDepartment = [
  {
    featureName: 'Cục LN',
    component: screen.forestryDepartment,
    icon: Images.vnForest,
  },
  {
    featureName: 'Văn phòng 809',
    component: screen.vp809,
    icon: Images.book,
  },
  {
    featureName: 'VNFF',
    component: screen.vnff,
    icon: Images.documentation,
  },
  {
    featureName: 'CPFES',
    component: null,
    icon: Images.co2,
  },
  {
    featureName: 'Mùa vụ',
    component: screen.muavu,
    icon: Images.muavu,
  },
  {
    featureName: 'Định mức KTKT',
    component: screen.dmktkt,
    icon: Images.norms,
  },

  {
    featureName: 'Giống',
    component: screen.giongln,
    icon: Images.seed,
  },
  {
    featureName: 'Rừng ven biển',
    component: screen.mapService,
    icon: Images.mangroves,
    data: {modeView: 'RVB'},
  },
  {
    featureName: 'KGR',
    component: screen.kgr,
    icon: Images.trees1,
  },
  {
    featureName: 'QLRBV',
    component: screen.qlrbv,
    icon: Images.forest,
  },
  {
    featureName: 'TCVN',
    component: screen.tcvn,
    icon: Images.standard,
  },
  {
    featureName: 'Dự án KKR',
    component: screen.kkr,
    icon: Images.trees,
  },
  {
    featureName: 'Vườn QG',
    component: screen.nationalPark,
    icon: Images.nationalPark,
  },
  {
    featureName: 'Cảnh báo cháy',
    component: screen.fireWarning,
    icon: Images.forestFire,
  },
  {
    featureName: 'DV Bản đồ',
    component: screen.mapService,
    icon: Images.map,
  },
  {
    featureName: null,
    component: null,
    icon: null,
  },
];

export const VNUF = [
  {
    featureName: 'Khoa Lâm học',
    component: screen.forestry,
    icon: Images.logo_LamHoc,
  },
  {
    featureName: 'Khoa KT-QTKD',
    component: null,
    icon: Images.logo_KTQTKD,
  },
  {
    featureName: null,
    component: null,
    icon: null,
  },
  {
    featureName: null,
    component: null,
    icon: null,
  },
];

export const IFEEInternal = [
  {
    featureName: 'Nhân sự',
    component: screen.staffList,
    icon: Images.staff,
  },
  {
    featureName: 'Lịch công tác',
    component: screen.workScheduleList,
    icon: Images.calendar2,
  },
  {
    featureName: 'Đăng kí xe',
    component: screen.vehicleList,
    icon: Images.registervehicle,
  },
  {
    featureName: 'VP phẩm',
    component: screen.officeItemList,
    icon: Images.office,
  },
  {
    featureName: 'Thiết bị',
    component: screen.deviceList,
    icon: Images.device,
  },
  {
    featureName: 'Đăng kí vé',
    component: screen.planeTicketList,
    icon: Images.registerticket,
  },
  {
    featureName: 'Nghỉ phép',
    component: screen.applyLeaveList,
    icon: Images.busy,
  },
  {
    featureName: 'HPBD',
    component: screen.hpbdList,
    icon: Images.happybd,
  },
  {
    featureName: 'Sửa chữa',
    component: screen.historyRepair,
    icon: Images.repair,
  },
  {
    featureName: 'Gửi thông báo',
    component: screen.sendNotification,
    icon: Images.sendnotification,
    isAdmin: true,
  },
  {
    featureName: null,
    component: null,
    icon: null,
  },
  {
    featureName: null,
    component: null,
    icon: null,
  },
];

export const XMGInternal = [
  {
    featureName: 'Nhân sự',
    component: screen.staffList,
    icon: Images.staff,
  },
  {
    featureName: 'Lịch công tác',
    component: screen.workScheduleList,
    icon: Images.calendar2,
  },
  {
    featureName: 'Đăng kí xe',
    component: screen.vehicleList,
    icon: Images.registervehicle,
  },
  {
    featureName: 'VP phẩm',
    component: screen.officeItemList,
    icon: Images.office,
  },
  {
    featureName: 'Thiết bị',
    component: screen.deviceList,
    icon: Images.device,
  },
  {
    featureName: 'Đăng kí vé',
    component: screen.planeTicketList,
    icon: Images.registerticket,
  },
  {
    featureName: 'Nghỉ phép',
    component: screen.applyLeaveList,
    icon: Images.busy,
  },
  {
    featureName: 'Sửa chữa',
    component: screen.historyRepair,
    icon: Images.repair,
  },
];
