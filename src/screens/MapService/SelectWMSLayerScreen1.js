import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Dimension from '../../contants/Dimension';
import Header from '../../components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dropdown} from 'react-native-element-dropdown';
import RegisterBtn from '../../components/RegisterBtn';
import {shadowIOS} from '../../contants/propsIOS';
import Loading from '../../components/LoadingUI';
import {ToastAlert} from '../../components/Toast';
const vnRegionMapData = require('../../utils/VnRegionMap.json');
const listLayerWMS = require('../../utils/listLayerWMSGeoPfes.json');

const SelectWMSLayerScreen1 = ({navigation}) => {
  const [listTypeMap, setListTypeMap] = useState([]);
  const [listProvinces, setListProvinces] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listCommunes, setListCommunes] = useState([]);
  const [listWMS, setListWMS] = useState([]);
  const [listYear, setListYear] = useState([]);

  const [centerPoint, setCenterPoint] = useState(undefined);
  const [selectTypeMapCode, setSelectTypeMapCode] = useState(undefined);
  const [selectYear, setSelectYear] = useState(undefined);
  const [selectProvince, setSelectProvince] = useState(null);
  const [selectProvinceCode, setSelectProvinceCode] = useState(undefined);
  const [selectDistrict, setSelectDistrict] = useState(undefined);
  const [selectDistrictCode, setSelectDistrictCode] = useState(undefined);
  const [selectCommune, setSelectCommune] = useState(undefined);
  const [selectCommuneCode, setSelectCommuneCode] = useState(undefined);
  const [nameRegionCol, setNameRegionCol] = useState('');

  useEffect(() => {
    getListMap();
  }, []);

  const getListMap = () => {
    let listLayerRaw = [];
    for (var i = 0; i < listLayerWMS.length; i++) {
      let layer = {
        nameLayer: listLayerWMS[i].nameMapGroup,
        value: listLayerWMS[i].codeMapGroup,
      };
      if (!listLayerRaw.some(obj => obj.value === layer.value)) {
        listLayerRaw.push(layer);
      }
    }
    setListTypeMap(listLayerRaw);
  };

  const getListYear = typeMap => {
    let listYear = [];
    for (var i = 0; i < listLayerWMS.length; i++) {
      if (listLayerWMS[i].codeMapGroup == typeMap) {
        let year = {
          label: listLayerWMS[i].year,
          value: listLayerWMS[i].nameRegionCol,
        };
        if (!listYear.some(obj => obj.label == year.label)) {
          listYear.push(year);
        }
      }
    }
    setListYear(listYear);
  };

  const getListProvince = nameColum => {
    let listProvinces = [];
    try {
      for (var i = 0; i < vnRegionMapData.length; i++) {
        if (vnRegionMapData[i][nameColum] === '1') {
          var province = {
            label: vnRegionMapData[i].TINH,
            value: vnRegionMapData[i].MATINH,
            provinX: vnRegionMapData[i].X_TINH,
            provinY: vnRegionMapData[i].Y_TINH,
          };
          //check if exsit?
          if (!listProvinces.some(obj => obj.value === province.value)) {
            listProvinces.push(province);
          }
        }
      }
    } catch (err) {
      consloe.log(err);
    }
    setListProvinces(listProvinces);
  };

  const getListDistrict = matinh => {
    let listDistrict = [];
    console.log(matinh);
    try {
      for (var i = 0; i < vnRegionMapData.length; i++) {
        if (
          vnRegionMapData[i][nameRegionCol] == '1' &&
          vnRegionMapData[i].MATINH == matinh
        ) {
          var district = {
            label: vnRegionMapData[i].HUYEN,
            value: vnRegionMapData[i].MAHUYEN,
            districtX: vnRegionMapData[i].X_HUYEN,
            districtY: vnRegionMapData[i].Y_HUYEN,
          };

          if (!listDistrict.some(obj => obj.value === district.value)) {
            listDistrict.push(district);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
    setListDistricts(listDistrict);
  };

  const getListCommune = mahuyen => {
    let listCommunesFill = [];
    try {
      for (var i = 0; i < vnRegionMapData.length; i++) {
        if (
          vnRegionMapData[i][nameRegionCol] == '1' &&
          vnRegionMapData[i].MAHUYEN == mahuyen
        ) {
          var commune = {
            label: vnRegionMapData[i].XA,
            value: vnRegionMapData[i].MAXA,
            communeX: vnRegionMapData[i].X_XA,
            communeY: vnRegionMapData[i].Y_XA,
          };
          if (!listCommunesFill.some(obj => obj.value == commune.value)) {
            listCommunesFill.push(commune);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
    setListCommunes(listCommunesFill);
  };

  const _getLinkWMS = () => {
    let layerData = _getLayer();

    console.log(layerData);

    let queryLayer = _getQueryLayer(
      layerData.cql_filter,
      layerData.nameProvinCodeCol,
      layerData.nameDistrictCodeCol,
      layerData.nameCommuneCodeCol,
    );

    let link = `${layerData.linkRoot}&version=${layerData.version}&request=GetMap&layers=${layerData.layers}&cql_filter=${queryLayer}&styles=&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=${layerData.format}&transparent=true`;
    let links = [link];
    return links;
  };

  const _getQueryLayer = (
    cql_filter,
    nameProvinCodeCol,
    nameDistrictCodeCol,
    nameCommuneCodeCol,
  ) => {
    let queryLayer = '';
    // trường hợp query theo tỉnh
    if (
      selectCommuneCode === undefined &&
      selectDistrictCode === undefined &&
      selectProvinceCode !== undefined
    ) {
      if (cql_filter !== '') {
        queryLayer = `${nameProvinCodeCol}%3D${selectProvinceCode}%20AND%20${cql_filter}`;
      } else {
        queryLayer = `${nameProvinCodeCol}=${selectProvinceCode}`;
      }
    }
    // trường hợp query theo huyen
    if (
      selectCommuneCode === undefined &&
      selectDistrictCode !== undefined &&
      selectProvinceCode !== undefined
    ) {
      if (cql_filter !== '') {
        queryLayer = `${nameDistrictCodeCol}%3D${selectDistrictCode}%20AND%20${cql_filter}`;
      } else {
        queryLayer = `${nameDistrictCodeCol}=${selectDistrictCode}`;
      }
    }
    // trường hợp query theo xã
    if (
      selectCommuneCode !== undefined &&
      selectDistrictCode !== undefined &&
      selectProvinceCode !== undefined
    ) {
      if (cql_filter !== '') {
        queryLayer = `${nameCommuneCodeCol}%3D${selectCommuneCode}%20AND%20${cql_filter}`;
      } else {
        queryLayer = `${nameCommuneCodeCol}=${selectCommuneCode}`;
      }
    }
    return queryLayer;
  };

  const _getLayer = () => {
    //Lấy danh sách các lớp bản đồ trong nhóm theo năm
    let layer = null;
    for (var i = 0; i < listLayerWMS.length; i++) {
      if (
        listLayerWMS[i].codeMapGroup === selectTypeMapCode &&
        listLayerWMS[i].nameRegionCol === nameRegionCol
      ) {
        //Kiểm tra nếu lớp bản đồ đó là của cấp tỉnh thì lấy tên theo mã tỉnh được chọn
        if (listLayerWMS[i].multiProvince === '0') {
          if (listLayerWMS[i].provinceCode === selectProvinceCode) {
            layer = listLayerWMS[i];
            return layer;
          }
        }
        // Kiểm tra nếu là của nhiều tỉnh thì trả về layer
        if (listLayerWMS[i].multiProvince === '1') {
          layer = listLayerWMS[i];
          return layer;
        }
      }
    }
  };

  const _getQueryInfoLinkWMS = () => {
    let layerData = _getLayer();
    let queryLayer = _getQueryLayer(
      layerData.cql_filter,
      layerData.nameProvinCodeCol,
      layerData.nameDistrictCodeCol,
      layerData.nameCommuneCodeCol,
    );
    let link = `${layerData.linkRoot}&version=${layerData.version}&request=GetFeatureInfo&layers=${layerData.layers}&cql_filter=${queryLayer}&query_layers=${layerData.layers}&srs=EPSG:4326&info_format=application/json`;
    //let link = `${layerData.linkRoot}&version=1.1.1&request=GetFeatureInfo&layers=${layerData.layers}&cql_filter=${queryLayer}&query_layers=${layerData.layers}&srs=EPSG:4326&info_format=application/json`;

    return link;
  };

  const onPressSelectMap = () => {
    if (
      selectTypeMapCode !== '' &&
      selectProvinceCode !== '' &&
      nameRegionCol !== ''
    ) {
      let linkSelect = _getLinkWMS();
      let joined = listWMS.concat(linkSelect);
      let linkRootQueryInfo = _getQueryInfoLinkWMS();
      const data = {
        WMSLink: joined,
        linkRootQueryInfo: linkRootQueryInfo,
        centerPoint: centerPoint,
      };
      navigation.navigate('MapWMS', data);
    } else {
      ToastAlert('Không đủ thông tin');
    }
  };

  // Rest of your functions

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Chọn lớp bản đồ" navigation={navigation} />
      <ScrollView>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            backgroundColor: '#fbfbfd',
            borderRadius: 12,
            marginHorizontal: Dimension.setWidth(3),
            marginVertical: Dimension.setHeight(3),
            paddingHorizontal: Dimension.setWidth(3),
            paddingTop: Dimension.setHeight(3),
            elevation: 5,
            ...shadowIOS,
          }}>
          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Loại bản đồ</Text>
            <Dropdown
              style={styles.dropdown}
              autoScroll={false}
              showsVerticalScrollIndicator={false}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.containerOptionStyle}
              imageStyle={styles.imageStyle}
              iconStyle={styles.iconStyle}
              itemContainerStyle={styles.itemContainer}
              itemTextStyle={styles.itemText}
              fontFamily={Fonts.SF_MEDIUM}
              activeColor="#eef2feff"
              placeholder="Chọn loại bản đồ"
              data={listTypeMap}
              maxHeight={Dimension.setHeight(30)}
              labelField="nameLayer"
              valueField="value"
              value={selectTypeMapCode}
              renderLeftIcon={() => {
                return (
                  <Image
                    source={Images.worldwide}
                    style={styles.leftIconDropdown}
                  />
                );
              }}
              onChange={item => {
                setSelectTypeMapCode(item.value);
                setListYear([]);
                setListProvinces([]);
                setListDistricts([]);
                setListCommunes([]);
                setSelectYear(undefined);
                setSelectProvince(undefined);
                setSelectProvinceCode(undefined);
                setSelectDistrict(undefined);
                setSelectDistrictCode(undefined);
                setSelectCommune(undefined);
                setSelectCommuneCode(undefined);
                setCenterPoint(null);
                getListYear(item.value);
              }}
            />
          </View>
          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Chọn Năm dữ liệu</Text>
            <Dropdown
              style={styles.dropdown}
              autoScroll={false}
              showsVerticalScrollIndicator={false}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.containerOptionStyle}
              imageStyle={styles.imageStyle}
              iconStyle={styles.iconStyle}
              itemContainerStyle={styles.itemContainer}
              itemTextStyle={styles.itemText}
              fontFamily={Fonts.SF_MEDIUM}
              activeColor="#eef2feff"
              placeholder="Chọn năm"
              data={listYear}
              maxHeight={Dimension.setHeight(30)}
              labelField="label"
              valueField="value"
              value={selectYear}
              renderLeftIcon={() => {
                return (
                  <Image
                    source={Images.worldwide}
                    style={styles.leftIconDropdown}
                  />
                );
              }}
              onChange={item => {
                setSelectYear(item.value);
                setNameRegionCol(item.value);
                setListProvinces([]);
                setListDistricts([]);
                setListCommunes([]);
                setSelectProvince(undefined);
                setSelectProvinceCode(undefined);
                setSelectDistrict(undefined);
                setSelectDistrictCode(undefined);
                setSelectCommune(undefined);
                setSelectCommuneCode(undefined);
                setCenterPoint(null);
                getListProvince(item.value);
              }}
            />
          </View>
          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Chọn Tỉnh/Thành phố</Text>
            <Dropdown
              style={styles.dropdown}
              autoScroll={false}
              showsVerticalScrollIndicator={false}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.containerOptionStyle}
              imageStyle={styles.imageStyle}
              iconStyle={styles.iconStyle}
              itemContainerStyle={styles.itemContainer}
              itemTextStyle={styles.itemText}
              fontFamily={Fonts.SF_MEDIUM}
              activeColor="#eef2feff"
              placeholder="Tỉnh"
              data={listProvinces}
              maxHeight={Dimension.setHeight(30)}
              labelField="label"
              valueField="value"
              value={selectProvince}
              renderLeftIcon={() => {
                return (
                  <Image
                    source={Images.worldwide}
                    style={styles.leftIconDropdown}
                  />
                );
              }}
              onChange={item => {
                setSelectProvince(item.value);
                setSelectProvinceCode(item.value);
                setListDistricts([]);
                setListCommunes([]);
                setSelectDistrict(undefined);
                setSelectDistrictCode(undefined);
                setSelectCommune(undefined);
                setSelectCommuneCode(undefined);
                setCenterPoint({x: item.provinX, y: item.provinY});
                getListDistrict(item.value);
              }}
            />
          </View>
          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Chọn Quận/Huyện/Thị xã</Text>
            <Dropdown
              style={styles.dropdown}
              autoScroll={false}
              showsVerticalScrollIndicator={false}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.containerOptionStyle}
              imageStyle={styles.imageStyle}
              iconStyle={styles.iconStyle}
              itemContainerStyle={styles.itemContainer}
              itemTextStyle={styles.itemText}
              fontFamily={Fonts.SF_MEDIUM}
              activeColor="#eef2feff"
              placeholder="Quận/huyện/thị xã"
              data={listDistricts}
              maxHeight={Dimension.setHeight(30)}
              labelField="label"
              valueField="value"
              value={selectDistrict}
              renderLeftIcon={() => {
                return (
                  <Image
                    source={Images.worldwide}
                    style={styles.leftIconDropdown}
                  />
                );
              }}
              onChange={item => {
                setSelectDistrict(item.value);
                setSelectDistrictCode(item.value);
                setListCommunes([]);
                setSelectCommune(undefined);
                setSelectCommuneCode(undefined);
                setCenterPoint({x: item.districtX, y: item.districtY});
                getListCommune(item.value);
              }}
            />
          </View>

          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Chọn Xã/Phường/Thị trấn</Text>
            <Dropdown
              style={styles.dropdown}
              autoScroll={false}
              showsVerticalScrollIndicator={false}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.containerOptionStyle}
              imageStyle={styles.imageStyle}
              iconStyle={styles.iconStyle}
              itemContainerStyle={styles.itemContainer}
              itemTextStyle={styles.itemText}
              fontFamily={Fonts.SF_MEDIUM}
              activeColor="#eef2feff"
              placeholder="Xã/Phường/Thị trấn"
              data={listCommunes}
              maxHeight={Dimension.setHeight(30)}
              labelField="label"
              valueField="value"
              value={selectCommune}
              renderLeftIcon={() => {
                return (
                  <Image
                    source={Images.worldwide}
                    style={styles.leftIconDropdown}
                  />
                );
              }}
              onChange={item => {
                setSelectCommune(item.value);
                setSelectCommuneCode(item.value);
                setCenterPoint({x: item.communeX, y: item.communeY});
              }}
            />
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
            <RegisterBtn
              nameBtn={'Mở bản đồ'}
              onEvent={() => onPressSelectMap()}
            />
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },

  containerEachLine: {
    marginBottom: Dimension.setHeight(0.5),
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 12,
    paddingVertical: Dimension.setHeight(1),
    paddingHorizontal: Dimension.setWidth(2),
  },

  title: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: 15,
    color: '#8bc7bc',
    marginBottom: Dimension.setHeight(1),
  },

  dropdown: {
    height: Dimension.setHeight(4.5),
    marginHorizontal: Dimension.setWidth(1.6),
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  leftIconDropdown: {
    width: 20,
    height: 20,
    marginRight: Dimension.setWidth(1.8),
  },
  itemContainer: {
    borderRadius: 12,
  },
});

export default SelectWMSLayerScreen1;
