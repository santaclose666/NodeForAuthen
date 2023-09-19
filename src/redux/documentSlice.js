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
      const filterCategory = data => {
        let categoryFilter = ['Tất cả'];
        data.forEach(item => {
          if (item.id_loaivanban == 5) {
            if (!categoryFilter.includes(item.loaivbpl)) {
              categoryFilter.push(item.loaivbpl);
            }
          }

          if (
            !categoryFilter.includes(item.loaivanban) &&
            item.id_loaivanban != 5
          ) {
            categoryFilter.push(item.loaivanban);
          }
        });

        return categoryFilter.filter(item => item != 'Khác');
      };

      const filterYear = data => {
        let year = [];

        data.forEach(item => {
          let filterYear = parseInt(item?.nam?.split('/')[2]);
          if (filterYear && !year.includes(filterYear)) {
            year.push(filterYear);
          }
        });
        return year.sort((a, b) => {
          return b - a;
        });
      };

      const filterHieuLuc = data => {
        let hieuluc = [];

        data.forEach(item => {
          if (!hieuluc.includes(item.hieuluc)) {
            if (item.hieuluc != null) {
              hieuluc.push(item.hieuluc);
            }
          }
        });
        return hieuluc;
      };

      const filterUnit = data => {
        let unit = [];

        data.forEach(item => {
          if (!unit.includes(item.donvi)) {
            unit.push(item.donvi);
          }
        });
        return unit;
      };

      state.documentSlice.isFetching = false;
      state.documentSlice.dvmtrData = {
        category: filterCategory(action.payload.dvmtr),
        year: filterYear(action.payload.dvmtr),
        hieuluc: filterHieuLuc(action.payload.dvmtr),
        unit: filterUnit(action.payload.dvmtr),
        data: action.payload.dvmtr,
      };
      state.documentSlice.forestData = {
        category: filterCategory(action.payload.dinhgiarung),
        year: filterYear(action.payload.dinhgiarung),
        hieuluc: filterHieuLuc(action.payload.dinhgiarung),
        unit: filterUnit(action.payload.dinhgiarung),
        data: action.payload.dinhgiarung,
      };
      state.documentSlice.forestryData = {
        category: filterCategory(action.payload.lamsinh),
        year: filterYear(action.payload.lamsinh),
        hieuluc: filterHieuLuc(action.payload.lamsinh),
        unit: filterUnit(action.payload.lamsinh),
        data: action.payload.lamsinh,
      };
      state.documentSlice.QLRBVData = {
        category: filterCategory(action.payload.qlrbv),
        year: filterYear(action.payload.qlrbv),
        hieuluc: filterHieuLuc(action.payload.qlrbv),
        unit: filterUnit(action.payload.qlrbv),
        data: action.payload.qlrbv,
      };
      state.documentSlice.kkrData = {
        category: filterCategory(action.payload.kkr),
        year: filterYear(action.payload.kkr),
        hieuluc: filterHieuLuc(action.payload.kkr),
        unit: filterUnit(action.payload.kkr),
        data: action.payload.kkr,
      };
      state.documentSlice.tcvnData = {
        category: filterCategory(action.payload.tcvn),
        year: filterYear(action.payload.tcvn),
        hieuluc: filterHieuLuc(action.payload.tcvn),
        unit: filterUnit(action.payload.tcvn),
        data: action.payload.tcvn,
      };
      state.documentSlice.gionglnData = {
        category: filterCategory(action.payload.giongln),
        year: filterYear(action.payload.giongln),
        hieuluc: filterHieuLuc(action.payload.giongln),
        unit: filterUnit(action.payload.giongln),
        data: action.payload.giongln,
      };
      state.documentSlice.DMKTKTData = {
        category: filterCategory(action.payload.dinhmuc_ktkt),
        year: filterYear(action.payload.dinhmuc_ktkt),
        hieuluc: filterHieuLuc(action.payload.dinhmuc_ktkt),
        unit: filterUnit(action.payload.dinhmuc_ktkt),
        data: action.payload.dinhmuc_ktkt,
      };
      state.documentSlice.VP809Data = {
        category: filterCategory(action.payload.vanphong_809),
        year: filterYear(action.payload.vanphong_809),
        hieuluc: filterHieuLuc(action.payload.vanphong_809),
        unit: filterUnit(action.payload.vanphong_809),
        data: action.payload.vanphong_809,
      };

      console.log(filterUnit(action.payload.vanphong_809));
      console.log(filterHieuLuc(action.payload.vanphong_809));
      console.log(filterYear(action.payload.vanphong_809));
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
