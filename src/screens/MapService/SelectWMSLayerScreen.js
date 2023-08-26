import React, {Component} from 'react';
import {StyleSheet, Text, Image, Platform, View} from 'react-native';
import {
  Container,
  Header,
  Form,
  Item,
  Picker,
  Button,
  Left,
  Body,
  Title,
  Toast,
} from 'native-base';
import Colors from '../../contants/Colors';
import Images from '../../contants/Images';
const vnRegionMapData = require('../../utils/VnRegionMap.json');
const listLayerWMS = require('../../utils/listLayerWMSGeoPfes.json');

class SelectWMSLayerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTypeMap: [],
      listProvinces: [],
      listDistricts: [],
      listCommunes: [],
      listWMS: [],
      listYear: [],

      centerPoint: undefined, // Toạ độ điểm tâm lúc mở bản đồ
      selectTypeMapCode: undefined, // Mã nhóm bản đồ: DVMTR, RVB....
      selectYear: undefined, //Năm dữ liệu bản đồ
      selectNameRegionCol: undefined, // Tên cột để lấy danh sách tỉnh huyện xã
      selectProvince: undefined,
      selectProvinceCode: undefined,
      selectDistrict: undefined,
      selectDistrictCode: undefined,
      selectCommune: undefined,
      selectCommuneCode: undefined,
      queryLayer: '',
    };
  }

  _getLinkWMS() {
    let layerData = this._getLayer();
    let queryLayer = this._getQueryLayer(
      layerData.cql_filter,
      layerData.nameProvinCodeCol,
      layerData.nameDistrictCodeCol,
      layerData.nameCommuneCodeCol,
    );
    let link = `${layerData.linkRoot}&version=${layerData.version}&request=GetMap&layers=${layerData.layers}&cql_filter=${queryLayer}&styles=&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=${layerData.format}&transparent=true`;
    let links = [link];
    return links;
  }

  _getQueryLayer(
    cql_filter,
    nameProvinCodeCol,
    nameDistrictCodeCol,
    nameCommuneCodeCol,
  ) {
    const {selectProvinceCode, selectDistrictCode, selectCommuneCode} =
      this.state;
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
  }

  _getQueryInfoLinkWMS() {
    let layerData = this._getLayer();
    let queryLayer = this._getQueryLayer(
      layerData.cql_filter,
      layerData.nameProvinCodeCol,
      layerData.nameDistrictCodeCol,
      layerData.nameCommuneCodeCol,
    );
    let link = `${layerData.linkRoot}&version=${layerData.version}&request=GetFeatureInfo&layers=${layerData.layers}&cql_filter=${queryLayer}&query_layers=${layerData.layers}&srs=EPSG:4326&info_format=application/json`;
    //let link = `${layerData.linkRoot}&version=1.1.1&request=GetFeatureInfo&layers=${layerData.layers}&cql_filter=${queryLayer}&query_layers=${layerData.layers}&srs=EPSG:4326&info_format=application/json`;

    return link;
  }

  _onButtonPress = () => {
    this.props.navigation.goBack();
    let {selectTypeMapCode, selectYear, selectProvinceCode} = this.state;

    if (
      selectTypeMapCode !== undefined &&
      selectProvinceCode !== undefined &&
      selectYear !== undefined
    ) {
      let linkSelect = this._getLinkWMS();
      let joined = this.state.listWMS.concat(linkSelect);
      let centerPoint = this.state.centerPoint;
      let linkRootQueryInfo = this._getQueryInfoLinkWMS();
      this.props.navigation.state.params._onSelectWMS({
        listWMS: joined,
        centerPointWMS: centerPoint,
        linkRootQueryInfo: linkRootQueryInfo,
      });
      this.props.navigation.goBack();
    } else {
      Toast.show({
        text: 'Thiếu thông tin nhập vào',
        buttonText: 'Tắt',
        type: 'warning',
      });
    }
  };

  _getLayer() {
    const {selectTypeMapCode, selectNameRegionCol, selectProvinceCode} =
      this.state;
    //Lấy danh sách các lớp bản đồ trong nhóm theo năm
    let layer = null;
    for (var i = 0; i < listLayerWMS.length; i++) {
      if (
        listLayerWMS[i].codeMapGroup === selectTypeMapCode &&
        listLayerWMS[i].nameRegionCol === selectNameRegionCol
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
  }

  _getCenterPoint(typePoint, objectCode) {
    switch (typePoint) {
      case 'province':
        let listProvinces = this.state.listProvinces;
        for (var i = 0; i < listProvinces.length; i++) {
          if (listProvinces[i].provinCode == objectCode) {
            let centerPoint = {
              long: parseFloat(listProvinces[i].provinX),
              lat: parseFloat(listProvinces[i].provinY),
            };
            this.setState({centerPoint: centerPoint});
          }
        }
        break;
      case 'district':
        let listDistricts = this.state.listDistricts;
        for (var i = 0; i < listDistricts.length; i++) {
          if (listDistricts[i].districtCode == objectCode) {
            let centerPoint = {
              long: parseFloat(listDistricts[i].districtX),
              lat: parseFloat(listDistricts[i].districtY),
            };
            this.setState({centerPoint: centerPoint});
          }
        }
        break;
      case 'commune':
        let listCommunes = this.state.listCommunes;
        for (var i = 0; i < listCommunes.length; i++) {
          if (listCommunes[i].communeCode == objectCode) {
            let centerPoint = {
              long: parseFloat(listCommunes[i].communeX),
              lat: parseFloat(listCommunes[i].communeY),
            };
            this.setState({centerPoint: centerPoint});
          }
        }
        break;
    }
  }

  _getListTypeMap() {
    let listLayerRaw = [];
    for (var i = 0; i < listLayerWMS.length; i++) {
      let layer = {
        nameLayer: listLayerWMS[i].nameMapGroup,
        codeMapGroup: listLayerWMS[i].codeMapGroup,
        value: listLayerWMS[i].codeMapGroup,
      };
      listLayerRaw.push(layer);
    }
    let listLayerFull = this.remove_duplicates(listLayerRaw);
    // return listLayerFull;
    this.setState({listTypeMap: listLayerFull});
  }

  _getListYear(selectTypeMapCode) {
    let listYear = [];
    for (var i = 0; i < listLayerWMS.length; i++) {
      if (listLayerWMS[i].codeMapGroup === selectTypeMapCode) {
        let year = {
          year: listLayerWMS[i].year,
          value: listLayerWMS[i].nameRegionCol,
        };
        listYear.push(year);
      }
    }
    let listYearFull = this.remove_duplicates(listYear);
    this.setState({listYear: listYearFull});
  }

  async _getListProvinces(itemValue) {
    let listProvincesFull = [];
    let listProvincesShort = [];
    let nameColum = itemValue;
    try {
      for (var i = 0; i < vnRegionMapData.length; i++) {
        if (vnRegionMapData[i][nameColum] === '1') {
          var province = {
            provinName: vnRegionMapData[i].TINH,
            provinCode: vnRegionMapData[i].MATINH,
            provinX: vnRegionMapData[i].X_TINH,
            provinY: vnRegionMapData[i].Y_TINH,
          };
          //check if exsit?
          listProvincesFull.push(province);
        }
      }
    } catch {}
    listProvincesShort = this.remove_duplicates_key(
      listProvincesFull,
      item => item.provinCode,
    );
    this.setState({listProvinces: listProvincesShort});
  }
  _getListDistricts(itemValue) {
    let listDistrictFull = [];
    let listDistrictShort = [];
    let nameColum = this.state.selectNameRegionCol;
    try {
      for (var i = 0; i < vnRegionMapData.length; i++) {
        if (
          vnRegionMapData[i][nameColum] == 1 &&
          vnRegionMapData[i].MATINH == itemValue
        ) {
          var district = {
            districtName: vnRegionMapData[i].HUYEN,
            districtCode: vnRegionMapData[i].MAHUYEN,
            districtX: vnRegionMapData[i].X_HUYEN,
            districtY: vnRegionMapData[i].Y_HUYEN,
          };
          listDistrictFull.push(district);
        }
      }
    } catch {}
    listDistrictShort = this.remove_duplicates_key(
      listDistrictFull,
      item => item.districtCode,
    );
    this.setState({listDistricts: listDistrictShort});
  }

  _getListCommunes(itemValue) {
    let listCommuneFull = [];
    let listCommuneShort = [];
    let nameColum = this.state.selectNameRegionCol;
    try {
      for (var i = 0; i < vnRegionMapData.length; i++) {
        if (
          vnRegionMapData[i][nameColum] == 1 &&
          vnRegionMapData[i].MAHUYEN == itemValue
        ) {
          var commune = {
            communeName: vnRegionMapData[i].XA,
            communeCode: vnRegionMapData[i].MAXA,
            communeX: vnRegionMapData[i].X_XA,
            communeY: vnRegionMapData[i].Y_XA,
          };
          listCommuneFull.push(commune);
        }
      }
    } catch {}
    listCommuneShort = this.remove_duplicates_key(
      listCommuneFull,
      item => item.communeCode,
    );
    this.setState({listCommunes: listCommuneShort});
  }

  remove_duplicates_key(data, key) {
    return [...new Map(data.map(item => [key(item), item])).values()];
  }

  remove_duplicates(arrFull) {
    var arrShort = [];
    arrShort.push(arrFull[0]);

    for (var i = 1; i < arrFull.length; i++) {
      if (JSON.stringify(arrFull[i]) !== JSON.stringify(arrFull[i - 1])) {
        arrShort.push(arrFull[i]);
      }
    }

    return arrShort;
  }

  render() {
    //Lay danh sach cac lop ban do
    let map_pick = [];
    if (this.state.listTypeMap.length > 0) {
      if (Platform.OS === 'android') {
        map_pick.push(
          <Picker.Item label={'<Chọn lớp bản đồ>'} value={undefined} />,
        );
      }
      for (let index = 0; index < this.state.listTypeMap.length; index++) {
        map_pick.push(
          <Picker.Item
            label={this.state.listTypeMap[index].nameLayer}
            value={this.state.listTypeMap[index].value}
          />,
        );
      }
    } else {
      this._getListTypeMap();
    }

    let _getYearList = [];
    if (this.state.listYear.length > 0) {
      if (Platform.OS === 'android') {
        _getYearList.push(
          <Picker.Item label={'<Chọn năm>'} value={undefined} />,
        );
      }
      for (let index = 0; index < this.state.listYear.length; index++) {
        _getYearList.push(
          <Picker.Item
            label={this.state.listYear[index].year}
            value={this.state.listYear[index].value}
          />,
        );
      }
    }

    let _getProvince = [];
    if (this.state.listProvinces.length > 0) {
      if (Platform.OS === 'android') {
        _getProvince.push(
          <Picker.Item label={'<Chọn tỉnh>'} value={undefined} />,
        );
      }
      for (let index = 0; index < this.state.listProvinces.length; index++) {
        _getProvince.push(
          <Picker.Item
            label={this.state.listProvinces[index].provinName}
            value={this.state.listProvinces[index].provinCode}
          />,
        );
      }
    }

    let _getDistricts = [];
    if (this.state.listDistricts.length > 0) {
      if (Platform.OS === 'android') {
        _getDistricts.push(
          <Picker.Item label={'<Chọn huyện>'} value={undefined} />,
        );
      }
      for (let index = 0; index < this.state.listDistricts.length; index++) {
        _getDistricts.push(
          <Picker.Item
            label={this.state.listDistricts[index].districtName}
            value={this.state.listDistricts[index].districtCode}
          />,
        );
      }
    }

    let _getCommunes = [];
    if (this.state.listCommunes.length > 0) {
      if (Platform.OS === 'android') {
        _getCommunes.push(
          <Picker.Item label={'<Chọn xã>'} value={undefined} />,
        );
      }
      for (let index = 0; index < this.state.listCommunes.length; index++) {
        _getCommunes.push(
          <Picker.Item
            label={this.state.listCommunes[index].communeName}
            value={this.state.listCommunes[index].communeCode}
          />,
        );
      }
    }

    return (
      <Container>
        <Header
          style={{
            backgroundColor: Colors.DEFAULT_GREY,
            barStyle: 'light-content',
            height: 80,
            paddingTop: 30,
          }}
          androidStatusBarColor={Colors.DARK_FIVE}>
          <Left style={{flex: 0.1}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Image
                style={{width: 30, height: 30}}
                source={Images.back}></Image>
            </Button>
          </Left>
          <Body
            style={{
              flex: 0.9,
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <Title style={{color: 'white'}}>Thêm lớp bản đồ WMS</Title>
          </Body>
        </Header>
        <View>
          <Text style={styles.titleInput}>Chọn lớp bản đồ</Text>
          <Form>
            <Item picker>
              <Picker
                mode="dropdown"
                style={{width: undefined}}
                placeholder="Lớp bản đồ"
                placeholderStyle={{color: '#bfc6ea'}}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selectTypeMapCode}
                onValueChange={(itemValue, itemIndex) => {
                  try {
                    this.setState(
                      {
                        selectTypeMapCode: itemValue,
                        listProvinces: [],
                        listDistricts: [],
                        listCommunes: [],
                        listYear: [],
                        centerPoint: undefined,
                        selectYear: undefined,
                        selectNameRegionCol: undefined,
                        selectProvince: undefined,
                        selectProvinceCode: undefined,
                        selectDistrict: undefined,
                        selectDistrictCode: undefined,
                        selectCommune: undefined,
                        selectCommuneCode: undefined,
                        queryLayer: '',
                        name_boudary_layer: '',
                      },
                      function () {
                        if (this.state.selectTypeMapCode !== undefined) {
                          this._getListYear(itemValue);
                        }
                      },
                    );
                    // this._getListYear(itemValue)
                  } catch {}
                }}>
                {map_pick}
              </Picker>
            </Item>
          </Form>

          <Text style={styles.titleInput}>Chọn năm</Text>
          <Form>
            <Item picker>
              <Picker
                mode="dropdown"
                style={{width: undefined}}
                placeholder="Năm của dữ liệu bản đồ"
                placeholderStyle={{color: '#bfc6ea'}}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selectYear}
                onValueChange={(itemValue, itemIndex) => {
                  try {
                    this.setState(
                      {
                        selectYear: itemValue,
                        selectNameRegionCol: itemValue,
                        listProvinces: [],
                        listDistricts: [],
                        listCommunes: [],
                        centerPoint: undefined,
                        selectProvince: undefined,
                        selectProvinceCode: undefined,
                        selectDistrict: undefined,
                        selectDistrictCode: undefined,
                        selectCommune: undefined,
                        selectCommuneCode: undefined,
                        queryLayer: '',
                        name_boudary_layer: '',
                      },
                      function () {
                        if (this.state.selectNameRegionCol !== undefined) {
                          this._getListProvinces(itemValue);
                        }
                      },
                    );
                  } catch {}
                }}>
                {_getYearList}
              </Picker>
            </Item>
          </Form>

          <Text style={styles.titleInput}>Chọn Tỉnh/Thành phố</Text>
          <Form>
            <Item picker>
              <Picker
                mode="dropdown"
                style={{width: undefined}}
                placeholder="Tên Tỉnh/Thành phố"
                placeholderStyle={{color: '#bfc6ea'}}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selectProvince}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({
                    selectProvinceCode: itemValue,
                    selectProvince: itemValue,
                    listDistricts: [],
                    listCommunes: [],
                    centerPoint: undefined,
                    selectDistrict: undefined,
                    selectDistrictCode: undefined,
                    selectCommune: undefined,
                    selectCommuneCode: undefined,
                  });
                  if (itemValue !== undefined) {
                    this._getCenterPoint('province', itemValue);
                    this._getListDistricts(itemValue);
                  }
                }}>
                {_getProvince}
              </Picker>
            </Item>
          </Form>

          <Text style={styles.titleInput}>Chọn Quận/Huyện</Text>
          <Form>
            <Item picker>
              <Picker
                mode="dropdown"
                style={{width: undefined}}
                placeholder="Tên Quận/Huyện"
                placeholderStyle={{color: '#bfc6ea'}}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selectDistrict}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({
                    selectDistrictCode: itemValue,
                    selectDistrict: itemValue,
                    listCommunes: [],
                    selectCommune: undefined,
                    selectCommuneCode: undefined,
                  });
                  if (itemValue !== undefined) {
                    this._getCenterPoint('district', itemValue);
                    this._getListCommunes(itemValue);
                  }
                }}>
                {_getDistricts}
              </Picker>
            </Item>
          </Form>

          <Text style={styles.titleInput}>Chọn Xã/Phường/Thị trấn</Text>
          <Form>
            <Item picker>
              <Picker
                mode="dropdown"
                style={{width: undefined}}
                placeholder="Tên Xã/Phường/Thị trấn"
                placeholderStyle={{color: '#bfc6ea'}}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selectCommune}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({
                    selectCommuneCode: itemValue,
                    selectCommune: itemValue,
                  });
                  if (itemValue !== undefined) {
                    this._getCenterPoint('commune', itemValue);
                  }
                }}>
                {_getCommunes}
              </Picker>
            </Item>
          </Form>

          <Button
            success
            block
            onPress={this._onButtonPress}
            style={{
              marginTop: 15,
              width: '50%',
              marginLeft: '25%',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text style={{color: 'white'}}>Chọn hiển thị</Text>
          </Button>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  headingText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0000CC',
    textDecorationLine: 'underline',
  },
  titleInput: {
    marginLeft: 10,
    fontSize: 16,
    marginTop: 5,
    marginEnd: 5,
  },
});

export default SelectWMSLayerScreen;
