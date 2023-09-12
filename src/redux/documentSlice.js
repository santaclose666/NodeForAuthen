import {createSlice} from '@reduxjs/toolkit';

const documentSlice = createSlice({
  name: 'document',
  initialState: {
    documentSlice: {
      dvmtrData: null,
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
      const dvmtrCategory = ['Tất cả'];
      const forestCategory = ['Tất cả'];
      const forestryCategory = ['Tất cả'];
      const QLRBVCategory = ['Tất cả'];
      const KKRCategory = ['Tất cả'];
      const tcvnCategory = ['Tất cả'];
      const gionglnCategory = ['Tất cả'];
      const DMKTKTCategory = ['Tất cả'];
      const VP809Category = ['Tất cả'];

      const filterCategory = (dataArr, category) => {
        const data = dataArr.forEach(item => {
          if (!category.includes(item.loaivanban)) {
            category.push(item.loaivanban);
          }
        });

        return data;
      };

      action.payload.dvmtr.forEach(item => {
        if (item.id_loaivanban == 5) {
          if (!dvmtrCategory.includes(item.loaivbpl)) {
            dvmtrCategory.push(item.loaivbpl);
          }
        }

        if (
          !dvmtrCategory.includes(item.loaivanban) &&
          item.id_loaivanban != 5
        ) {
          dvmtrCategory.push(item.loaivanban);
        }
      });

      state.documentSlice.isFetching = false;
      state.documentSlice.dvmtrData = {
        category: dvmtrCategory,
        data: action.payload.dvmtr,
      };
      state.documentSlice.forestData = {
        category: filterCategory(action.payload.dinhgiarung, forestCategory),
        data: action.payload.dinhgiarung,
      };
      state.documentSlice.forestryData = {
        category: filterCategory(action.payload.lamsinh, forestryCategory),
        data: action.payload.lamsinh,
      };
      state.documentSlice.QLRBVData = {
        category: filterCategory(action.payload.qlrbv, QLRBVCategory),
        data: action.payload.qlrbv,
      };
      state.documentSlice.kkrData = {
        category: filterCategory(action.payload.kkr, KKRCategory),
        data: action.payload.kkr,
      };
      state.documentSlice.tcvnData = {
        category: filterCategory(action.payload.tcvn, tcvnCategory),
        data: action.payload.tcvn,
      };
      state.documentSlice.gionglnData = {
        category: filterCategory(action.payload.giongln, gionglnCategory),
        data: action.payload.giongln,
      };
      state.documentSlice.DMKTKTData = {
        category: filterCategory(action.payload.dinhmuc_ktkt, DMKTKTCategory),
        data: action.payload.dinhmuc_ktkt,
      };
      state.documentSlice.VP809Data = {
        category: filterCategory(action.payload.vanphong_809, VP809Category),
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
