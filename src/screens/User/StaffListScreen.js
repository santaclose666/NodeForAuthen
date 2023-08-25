import React, {useState, useCallback, memo, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import unidecode from 'unidecode';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import Icons from '../../contants/Icons';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {shadowIOS} from '../../contants/propsIOS';
import {fontDefault, mainURL} from '../../contants/Variable';

const StaffListScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const [input, setInput] = useState(null);
  const [allStaff, setAllStaff] = useState(null);
  const XMGGroup = [
    'Tất cả',
    'Ban Giám đốc',
    'Tổng hợp',
    'Kỹ thuật',
    'RnD',
    'Kinh doanh',
    'Đào tạo',
  ];

  const IFEEGroup = [
    'Tất cả',
    'Tổng hợp',
    'CNMT',
    'RnD',
    'STPTR',
    'UDVT',
    'TTDV',
  ];
  const [selectId, setSelectId] = useState(0);
  const IFEEstaffs = useSelector(state => state.staffs?.staffs?.IFEEStaff);
  const XMGstaffs = useSelector(state => state.staffs?.staffs?.XMGStaff);

  const handleSearch = (text, typeStaffValue) => {
    setInput(text);
    if (text.length > 0) {
      setSelectId(null);

      const data = handlePickUnit(typeStaffValue);

      const dataFilter = data.filter(item =>
        unidecode(item.hoten.toLowerCase()).includes(text.toLowerCase()),
      );

      setAllStaff(dataFilter);
    } else {
      setAllStaff(null);
    }
  };

  const handlePickOption = index => {
    setAllStaff(null);
    setInput(null);
    setSelectId(index);
  };

  const handleFilter = useCallback(index => {
    const data = user?.tendonvi === 'XMG' ? XMGstaffs : IFEEstaffs;
    if (index === 0) {
      return data;
    } else {
      if (user?.tendonvi === 'IFEE') {
        return data?.filter(item => item.tenphong === IFEEGroup[index]);
      } else {
        return data?.filter(item => {
          return item.info_phong?.some(
            group => group.tenphong === XMGGroup[index],
          );
        });
      }
    }
  }, []);

  const RenderStaffs = memo(({item, index}) => {
    const role =
      user?.tendonvi === 'XMG' ? item.info_phong[0].chucdanh : item.chucdanh;

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('DetailStaff', {item: item});
        }}
        key={index}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 12,
          borderColor: Colors.INACTIVE_GREY,
          backgroundColor: index % 2 === 0 ? '#f8f7fc' : '#ffffff',
          paddingHorizontal: Dimension.setWidth(1),
          paddingVertical: Dimension.setHeight(1),
          elevation: 10,
          ...shadowIOS,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: Dimension.setHeight(1),
            marginLeft: Dimension.setWidth(2),
            maxWidth: Dimension.setWidth(60),
          }}>
          <Image
            src={`${mainURL + item.path}`}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              marginRight: Dimension.setWidth(3),
            }}
          />
          <View style={{justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: Fonts.SF_SEMIBOLD,
                fontSize: 19,
                ...fontDefault,
              }}>
              {item.hoten}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: Colors.INACTIVE_GREY,
                fontFamily: Fonts.SF_REGULAR,
                fontSize: 15,
                width: Dimension.setWidth(45),
              }}>
              {item.email}
            </Text>
          </View>
        </View>
        <View
          style={{
            alignItems: 'flex-end',
            marginRight: Dimension.setWidth(3.6),
          }}>
          <Text
            style={{
              fontFamily: Fonts.SF_REGULAR,
              fontSize: 16,
              color: Colors.INACTIVE_GREY,
            }}>
            Chức vụ
          </Text>
          <Text
            style={{
              fontFamily: Fonts.SF_SEMIBOLD,
              fontSize: 15,
              ...fontDefault,
            }}>
            {role}
          </Text>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={{marginRight: Dimension.setWidth(5)}}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={Images.back} style={{width: 25, height: 25}} />
        </TouchableOpacity>
        <View style={styles.searchInput}>
          <Icons.Feather name="search" size={25} color={Colors.INACTIVE_GREY} />
          <TextInput
            onChangeText={e => handleSearch(e, typeStaffValue)}
            value={input}
            placeholder="Tìm kiếm nhân sự"
            style={{
              fontFamily: Fonts.SF_REGULAR,
              marginLeft: Dimension.setWidth(3),
              width: '80%',
            }}
          />
        </View>
      </View>
      <View
        style={{
          marginLeft: Dimension.setWidth(4),
          marginTop: Dimension.setHeight(1),
          marginBottom: Dimension.setHeight(1.5),
        }}>
        <View style={{marginBottom: Dimension.setHeight(1)}}>
          <Text
            style={{
              fontFamily: Fonts.SF_SEMIBOLD,
              fontSize: 20,
            }}>
            Nhóm nhân sự
          </Text>
        </View>
        <FlatList
          data={user?.tendonvi === 'XMG' ? XMGGroup : IFEEGroup}
          keyExtractor={(_, index) => index}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          extraData={user?.tendonvi === 'XMG' ? XMGstaffs : IFEEstaffs}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => handlePickOption(index)}
                key={index}
                style={{marginRight: Dimension.setWidth(4)}}>
                <Text
                  style={{
                    fontFamily:
                      selectId !== index ? Fonts.SF_REGULAR : Fonts.SF_BOLD,
                    fontSize: 16,
                    opacity: 0.6,
                    color:
                      selectId === index ? '#85d4ee' : Colors.DEFAULT_BLACK,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={styles.staffListContainer}>
        <Text
          style={{
            fontFamily: Fonts.SF_SEMIBOLD,
            fontSize: 20,
            marginRight: Dimension.setWidth(2),
          }}>
          Danh sách nhân sự
        </Text>
      </View>
      <FlatList
        data={allStaff ? allStaff : handleFilter(selectId)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item, index}) => (
          <RenderStaffs item={item} index={index} />
        )}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },

  nameScreenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Dimension.setHeight(2.5),
    marginHorizontal: Dimension.setWidth(3.6),
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Dimension.setWidth(2.5),
    marginTop: Dimension.setHeight(1),
    marginBottom: Dimension.setHeight(2),
  },

  searchInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    width: '85%',
    borderRadius: 9,
    height: Dimension.setHeight(5.5),
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },

  filterBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
    width: '13%',
    marginTop: 20,
    marginBottom: 20,
    marginRight: 18,
    borderRadius: 10,
  },

  staffListContainer: {
    marginLeft: Dimension.setWidth(4),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Dimension.setHeight(1),
  },

  dropdown: {
    width: Dimension.setWidth(20),
  },
  containerOptionStyle: {
    borderRadius: 12,
    backgroundColor: '#f6f6f8ff',
    width: Dimension.setWidth(30),
    alignSelf: 'center',
  },
});

export default StaffListScreen;
