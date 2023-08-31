import React, {useState, useCallback, memo, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import unidecode from 'unidecode';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import {useSelector} from 'react-redux';
import {shadowIOS} from '../../contants/propsIOS';
import {fontDefault, mainURL} from '../../contants/Variable';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Header';
import {XMGGroup, IFEEGroup} from '../../contants/Variable';

const StaffListScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const [input, setInput] = useState(null);
  const [allStaff, setAllStaff] = useState(null);

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
    } else if (index === 1 && user?.tendonvi === 'IFEE') {
      return data?.filter(item => item.vitri_ifee == 1 || item.vitri_ifee == 2);
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
          borderColor: Colors.WHITE,
          backgroundColor: Colors.WHITE,
          paddingHorizontal: Dimension.setWidth(1),
          paddingVertical: Dimension.setWidth(2),
          marginVertical: Dimension.setWidth(1),
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
    <LinearGradient
      colors={['rgba(153,255,153,0.9)', 'rgba(255,204,204,0.8)']}
      style={{flex: 1, padding: 3}}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <SafeAreaView style={styles.container}>
        <Header title="Danh sách nhân sự" navigation={navigation} />
        <View
          style={{
            marginLeft: Dimension.setWidth(4),
            marginTop: Dimension.setHeight(1),
            marginBottom: Dimension.setHeight(1.5),
          }}>
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
                  style={{
                    marginRight: Dimension.setWidth(4.4),
                    paddingVertical: 3,
                    borderBottomWidth: selectId === index ? 2 : 0,
                    borderBottomColor:
                      selectId === index ? Colors.DEFAULT_GREEN : '#fff',
                  }}>
                  <Text
                    style={{
                      fontFamily:
                        selectId === index
                          ? Fonts.SF_SEMIBOLD
                          : Fonts.SF_REGULAR,
                      fontSize: 16,
                      opacity: 0.8,
                      color:
                        selectId === index
                          ? Colors.DEFAULT_GREEN
                          : Colors.DEFAULT_BLACK,
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
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
