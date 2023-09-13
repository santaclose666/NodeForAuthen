import Images from '../contants/Images';

export const mainURL = 'https://forestry.ifee.edu.vn/';

export const newsURL = 'https://ifee.edu.vn/assets/img/blog/';

export const newsMvURL = 'https://muavutrongrung.ifee.edu.vn/web/images/CDDH/';

export const documentMvURL = 'https://muavutrongrung.ifee.edu.vn/TieuChuan/';

export const defaultIFEE = 'IFEE/ifee.png';

export const defaultXMG = 'XMG/user/xmg.jpg';

export const DocumentURL =
  'https://forestry.ifee.edu.vn/2023_Forestry4.0App/VanBanSoTay/';

export const serverKey =
  'AAAAcLNNRfs:APA91bE28a2U-d85I1raX7EWUrkWUFVOIFG4iHnlXmz3VR8blqF6fR3159guM8kzIXEHCCcqdAhZMD11K92A8pfQ3e9JDRe_I42-c0Savs_jLeErQiyoXHAiq4PjxyQAUp8aXNKEdjAf';

export const XMGGroup = [
  'Tất cả',
  'Ban Giám đốc',
  'Tổng hợp',
  'Kỹ thuật',
  'RnD',
  'Kinh doanh',
  'Đào tạo',
];

export const IFEEGroup = [
  'Tất cả',
  'Ban lãnh đạo',
  'Tổng hợp',
  'CNMT',
  'RnD',
  'STPTR',
  'UDVT',
  'TTDV',
];

export const XMGorder = [
  'Giám đốc',
  'Phó Giám đốc',
  'Chuyên gia',
  'Trưởng phòng',
  'Phó Trưởng phòng',
  'Nhân viên',
  'Cộng tác viên',
];

export const IFEEorder = [
  'Viện trưởng',
  'Phó Viện trưởng',
  'Giám đốc',
  'Phó giám đốc',
  'Trưởng phòng',
  'Phó trưởng phòng',
  'Phụ trách kế toán',
  'Văn thư',
  'Ngiên cứu viên',
];

export const approveArr = [
  {
    title: 'Chờ duyệt',
    color: '#f0b263',
    bgColor: 'rgba(254, 244, 235, 0.3)',
    icon: Images.pending1,
  },
  {
    title: 'Đã duyệt',
    color: '#57b85d',
    bgColor: 'rgba(222, 248, 237, 0.3)',
    icon: Images.approved1,
  },
  {
    title: 'Hủy bỏ',
    inActiveColor: '',
    color: '#f25157',
    bgColor: 'rgba(249, 223, 224, 0.3)',
    icon: Images.cancelled,
  },
];

export const planeCompany = [
  {
    label: 'Vietnam AirLine',
    value: 'Vietnam AirLine',
  },
  {
    label: 'Vietjet Air',
    value: 'Vietjet Air',
  },
  {
    label: 'Jetstar Pacific AirLines',
    value: 'Jetstar Pacific AirLines',
  },
  {
    label: 'Bambo Airways',
    value: 'Bambo Airways',
  },
];

export const ticketType = [
  {
    label: 'Phổ thông',
    value: 'Phổ thông',
  },
  {
    label: 'Hạng nhất',
    value: 'Hạng nhất',
  },
  {
    label: 'Thương gia',
    value: 'Thương gia',
  },
  {
    label: 'Phổ thông đặc biệt',
    value: 'Phổ thông đặc biệt',
  },
];

export const fontDefault = {opacity: 0.8, color: '#041d3b'};
export const imgDefault = {tintColor: '#041d3b', opacity: 0.8};

export const airplane = [
  {
    label: 'Hà Nội (HAN), Sân bay QT Nội Bài',
    value: 'Hà Nội (HAN), Sân bay QT Nội Bài',
  },
  {
    label: 'Sài Gòn (SGN), Sân bay QT Tân Sơn Nhất',
    value: 'Sài Gòn (SGN), Sân bay QT Tân Sơn Nhất',
  },
  {
    label: 'Đà Nẵng (DAD), Sân bay QT Đà Nẵng',
    value: 'Đà Nẵng (DAD), Sân bay QT Đà Nẵng',
  },
  {
    label: 'Quảng Ninh (VDO), Sân bay QT Vân Đồn',
    value: 'Quảng Ninh (VDO), Sân bay QT Vân Đồn',
  },
  {
    label: 'Hải Phòng (HPH), Sân bay QT Cát Bi',
    value: 'Hải Phòng (HPH), Sân bay QT Cát Bi',
  },
  {
    label: 'Nghệ An (VII), Sân bay QT Vinh',
    value: 'Nghệ An (VII), Sân bay QT Vinh',
  },
  {
    label: 'Huế (HUI), Sân bay QT Phú Bài',
    value: 'Huế (HUI), Sân bay QT Phú Bài',
  },
  {
    label: 'Khánh Hòa (CXR), Sân bay QT Cam Ranh',
    value: 'Khánh Hòa (CXR), Sân bay QT Cam Ranh',
  },
  {
    label: 'Lâm Đồng (DLI), Sân bay QT Liên Khương',
    value: 'Lâm Đồng (DLI), Sân bay QT Liên Khương',
  },
  {
    label: 'Bình Định (UIH), Sân bay QT Phù Cát',
    value: 'Bình Định (UIH), Sân bay QT Phù Cát',
  },
  {
    label: 'Cần Thơ (VCA), Sân bay QT Cần Thơ',
    value: 'Cần Thơ (VCA), Sân bay QT Cần Thơ',
  },
  {
    label: 'Kiên Giang (PQC), Sân bay QT Phú Quốc',
    value: 'Kiên Giang (PQC), Sân bay QT Phú Quốc',
  },
  {
    label: 'Điện Biên (DIN), Sân bay Điện Biên Phủ',
    value: 'Điện Biên (DIN), Sân bay Điện Biên Phủ',
  },
  {
    label: 'Thanh Hóa (THD), Sân bay Thọ Xuân',
    value: 'Thanh Hóa (THD), Sân bay Thọ Xuân',
  },
  {
    label: 'Quảng Bình (VDH), Sân bay Đồng Hới',
    value: 'Quảng Bình (VDH), Sân bay Đồng Hới',
  },
  {
    label: 'Quảng Nam (VCL), Sân bay Chu Lai',
    value: 'Quảng Nam (VCL), Sân bay Chu Lai',
  },
  {
    label: 'Phú Yên (TBB), Sân bay Tuy Hòa',
    value: 'Phú Yên (TBB), Sân bay Tuy Hòa',
  },
  {
    label: 'Gia Lai (PXU), Sân bay Pleiku',
    value: 'Gia Lai (PXU), Sân bay Pleiku',
  },
  {
    label: 'Đắk Lắk (BMV), Sân bay Buôn Mê Thuột',
    value: 'Đắk Lắk (BMV), Sân bay Buôn Mê Thuột',
  },
  {
    label: 'Kiên Giang (VKG), Sân bay Rạch Giá',
    value: 'Kiên Giang (VKG), Sân bay Rạch Giá',
  },
  {
    label: 'Cà Mau (CAH), Sân bay Cà Mau',
    value: 'Cà Mau (CAH), Sân bay Cà Mau',
  },
  {
    label: 'Bà Rịa Vũng Tàu (VCS), Sân bay Côn Đảo',
    value: 'Bà Rịa Vũng Tàu (VCS), Sân bay Côn Đảo',
  },
];
