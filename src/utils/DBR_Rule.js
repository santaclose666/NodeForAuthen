const listDisplayLabel = [
  'matinh',
  'mahuyen',
  'maxa',
  'huyen',
  'xa',
  'churung',
  'tk',
  'khoanh',
  'lo',
  'ldlr',
  'maldlr',
  'sldlr',
  'malr3',
];
const listDisplayLabelFull = [
  'tt',
  'matinh',
  'mahuyen',
  'maxa',
  'tinh',
  'huyen',
  'xa',
  'tk',
  'khoanh',
  'lo',
  'thuad',
  'tobando',
  'ddanh',
  'dtich',
  'nggocr',
  'ldlr',
  'maldlr',
  'mdsd',
  'mamdsd',
  'sldlr',
  'namtr',
  'captuoi',
  'thanhrung',
  'mgo',
  'mtn',
  'mgolo',
  'mtnlo',
  'lapdia',
  'malr3',
  'dtuong',
  'churung',
  'machur',
  'trchap',
  'khoan',
  'nqh',
  'nguoink',
  'mangnk',
  'ngsinh',
  'ktan',
  'nggocrt',
  'quyensd',
];
const listDisplayLabelExplant = [
  'Mã tỉnh',
  'Mã huyện',
  'Mã xã',
  'Huyện',
  'Xã',
  'Chủ rừng',
  'Tiểu khu',
  'Khoảnh',
  'Lô',
  'Trạng thái',
  'Mã trạng thái',
  'Loài cây',
  'Quy hoạch',
];
const listDisplayLabelExplantFull = [
  'Số thứ tự',
  'Mã tỉnh',
  'Mã huyện',
  'Mã xã',
  'Tỉnh',
  'Huyện',
  'Xã',
  'Tiểu khu',
  'Khoảnh',
  'Lô',
  'Thửa đất',
  'Tờ bản đồ',
  'Địa danh',
  'Diện tích',
  'Nguồn gốc rừng',
  'Loại đất loại rừng',
  'Mã loại đất loại rừng',
  'Mục đích sử dụng',
  'Mã mục đích sử dụng',
  'Loài cây trồng',
  'Năm trồng',
  'Cấp tuổi',
  'Tình trạng thành rừng',
  'Trữ lượng/ha',
  'Mật độ tre nứa/ha',
  'Trữ lượng/lô',
  'Mật độ tre nứa',
  'Điều kiện lập địa',
  'Mã loại rừng 3',
  'Đối tượng',
  'Tên chủ rừng',
  'Mã chủ rừng',
  'Tranh chấp',
  'Tình trạng khoán',
  'Ngoài quy hoạch',
  'Người nhận khoán',
  'Mã người nhận khoán',
  'Tình trạng nguyên sinh',
  'Khép tán',
  'Nguồn gốc rừng trồng',
  'Quyền sử dụng',
];

const fieldCode = [
  {
    code: 'nqh',
    data: [
      {label: 0, value: 'Trong quy hoạch'},
      {label: 1, value: 'Ngoài quy hoạch'},
      {label: 2, value: 'Trước khi thay đổi quy hoạch'},
    ],
  },
  {
    code: 'malr3',
    data: [
      {label: 1, value: 'Rừng phòng hộ'},
      {label: 2, value: 'Rừng đặc dụng'},
      {label: 3, value: 'Rừng sản xuất'},
    ],
  },
  {
    code: 'mamdsd',
    data: [
      {label: 1, value: 'Phòng hộ đầu nguồn'},
      {label: 2, value: 'Phòng hộ chắn sóng'},
      {label: 3, value: 'Phòng hộ chắn cát '},
      {label: 4, value: 'Phòng hộ môi sinh'},
      {label: 5, value: 'Vườn quốc gia'},
      {label: 6, value: 'Bảo tồn thiên nhiên'},
      {label: 7, value: 'Nghiên cứu khoa học'},
      {label: 8, value: 'Lịch sử văn hóa, cảnh quan'},
      {label: 9, value: 'Gỗ lớn'},
      {label: 10, value: 'Gỗ nhỏ'},
      {label: 11, value: 'Tre nứa'},
      {label: 12, value: 'Mục đích sx khác'},
    ],
  },
  {
    code: 'lapdia',
    data: [
      {label: 1, value: 'Núi đất'},
      {label: 2, value: 'Núi đá'},
      {label: 3, value: 'Đất ngập mặn'},
      {label: 4, value: 'Đất ngập phèn'},
      {label: 5, value: 'Đất ngập ngọt'},
      {label: 6, value: 'Bãi cát '},
    ],
  },
  {
    code: 'nggocr',
    data: [
      {label: 1, value: 'Rừng tự nhiên'},
      {label: 2, value: 'Rừng trồng'},
      {label: 3, value: 'Đất chưa có rừng'},
    ],
  },
  {
    code: 'ngsinh',
    data: [
      {label: 1, value: 'Rừng nguyên sinh'},
      {label: 2, value: 'Rừng thứ sinh'},
    ],
  },
  {
    code: 'nggocrt',
    data: [
      {label: 1, value: 'Trồng trên đất chưa có rừng trước đây'},
      {label: 2, value: 'Trồng trên đất đã từng có rừng'},
      {label: 3, value: 'Tái sinh từ rừng trồng'},
    ],
  },
  {
    code: 'thanhrung',
    data: [
      {label: 1, value: 'Đã thành rừng'},
      {label: 2, value: 'Chưa thành rừng'},
    ],
  },
  {
    code: 'ktan',
    data: [
      {label: 1, value: 'Rừng đã khép tán'},
      {label: 2, value: 'Rừng chưa khép tán'},
    ],
  },
  {
    code: 'dtuong',
    data: [
      {label: 1, value: 'Hộ gia đinh, cá nhân'},
      {label: 2, value: 'Cộng đồng'},
      {label: 3, value: 'UBND xã'},
      {label: 4, value: 'Ban quản lý rừng phòng hộ'},
      {label: 5, value: 'Lâm trường QD'},
      {label: 6, value: 'Công ty LN'},
      {label: 7, value: 'Doanh nghiệp tư nhân'},
      {label: 8, value: 'Doanh nghiệp Nước ngoài'},
      {label: 9, value: 'Đối tượng khác'},
      {label: 10, value: 'Ban quản lý rừng đặc dụng'},
      {label: 11, value: 'Các đơn vị vũ trang'},
    ],
  },
  {
    code: 'quyensd',
    data: [
      {label: 1, value: 'Có giấy chứng nhận quyền sử dụng đất 01 (sổ đỏ)'},
      {
        label: 2,
        value:
          'Có giấy chứng nhận quyền sử dụng đất 02 (sổ xanh, sổ lâm bạ, khế ước)',
      },
      {
        label: 3,
        value:
          'Có giấy chứng nhận quyền sử dụng đất khác (quyết định, công văn tạm giao, xác nhận vv..)',
      },
      {
        label: 4,
        value: 'Chưa có giấy chứng nhận quyền sử dụng đất',
      },
    ],
  },
];

const getCodeText = (field, code) => {
  for (let i = 0; i < fieldCode.length; i++) {
    if (fieldCode[i].code == field) {
      for (let j = 0; j < fieldCode[i].data.length; j++) {
        if (fieldCode[i].data[j].label == code) {
          return `${fieldCode[i].data[j].label} - ${fieldCode[i].data[j].value}`;
        }
      }
    }
  }
  return code;
};

export {
  listDisplayLabel,
  listDisplayLabelFull,
  listDisplayLabelExplant,
  listDisplayLabelExplantFull,
  getCodeText,
};
