import {createSlice} from '@reduxjs/toolkit';

const documentSlice = createSlice({
  name: 'document',
  initialState: {
    documentSlice: {
      forestData: null,
      forestryData: null,
      QLRBVData: null,
      kkrData: null,
      tcvnData: null,
      gionglnData: null,
      DMKTKTData: null,
      VP809Data: null,
      isFetching: false,
      err: false,
    },
  },

  reducers: {
    getDocumentStart: state => {
      state.documentSlice.isFetching = true;
    },
    getDocumentSuccess: (state, action) => {
      const forestCategory = ['Tất cả'];
      const forestryCategory = ['Tất cả'];
      const QLRBVCategory = ['Tất cả'];
      const KKRCategory = ['Tất cả'];
      const tcvnCategory = ['Tất cả'];
      const gionglnCategory = ['Tất cả'];
      const DMKTKTCategory = ['Tất cả'];
      const VP809Category = ['Tất cả'];
      action.payload.dinhgiarung.forEach(item => {
        if (!forestCategory.includes(item.loaivanban)) {
          forestCategory.push(item.loaivanban);
        }
      });
      action.payload.lamsinh.forEach(item => {
        if (!forestryCategory.includes(item.loaivanban)) {
          forestryCategory.push(item.loaivanban);
        }
      });
      action.payload.qlrbv.forEach(item => {
        if (!QLRBVCategory.includes(item.loaivanban)) {
          QLRBVCategory.push(item.loaivanban);
        }
      });
      action.payload.kkr.forEach(item => {
        if (!KKRCategory.includes(item.loaivanban)) {
          KKRCategory.push(item.loaivanban);
        }
      });
      action.payload.tcvn.forEach(item => {
        if (!tcvnCategory.includes(item.loaivanban)) {
          tcvnCategory.push(item.loaivanban);
        }
      });
      action.payload.giongln.forEach(item => {
        if (!gionglnCategory.includes(item.loaivanban)) {
          gionglnCategory.push(item.loaivanban);
        }
      });
      action.payload.dinhmuc_ktkt.forEach(item => {
        if (!DMKTKTCategory.includes(item.loaivanban)) {
          DMKTKTCategory.push(item.loaivanban);
        }
      });
      action.payload.vanphong_809.forEach(item => {
        if (!VP809Category.includes(item.loaivanban)) {
          VP809Category.push(item.loaivanban);
        }
      });
      state.documentSlice.isFetching = false;
      state.documentSlice.forestData = {
        category: forestCategory,
        data: action.payload.dinhgiarung,
      };
      state.documentSlice.forestryData = {
        category: forestryCategory,
        data: action.payload.lamsinh,
      };
      state.documentSlice.QLRBVData = {
        category: QLRBVCategory,
        data: action.payload.qlrbv,
      };
      state.documentSlice.kkrData = {
        category: KKRCategory,
        data: action.payload.kkr,
      };
      state.documentSlice.tcvnData = {
        category: tcvnCategory,
        data: action.payload.tcvn,
      };
      state.documentSlice.gionglnData = {
        category: gionglnCategory,
        data: action.payload.giongln,
      };
      state.documentSlice.DMKTKTData = {
        category: DMKTKTCategory,
        data: action.payload.dinhmuc_ktkt,
      };
      state.documentSlice.VP809Data = {
        category: VP809Category,
        data: action.payload.vanphong_809,
      };
    },
    getDocumentFailed: state => {
      state.documentSlice.isFetching = false;
      state.documentSlice.err = true;
    },
  },
});

export const {getDocumentStart, getDocumentSuccess, getDocumentFailed} =
  documentSlice.actions;

export default documentSlice.reducer;
