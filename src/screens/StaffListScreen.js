import React, {useState, useEffect, useCallback} from 'react';
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
import Images from '../contants/Images';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import Dimension from '../contants/Dimension';
import Icons from '../contants/Icons';
import {useSelector} from 'react-redux';

const StaffListScreen = ({navigation}) => {
  const [input, setInput] = useState('');
  const [allStaff, setAllStaff] = useState([]);
  const [staffGroup, setStaffGroup] = useState([
    'Tất cả',
    'Banh lãnh đạo', //id 2, 5
    'TH', //2 phòng tổng hợp
    'CNMT', //3 bộ môn công nghệ môi trường
    'ST&PRT', //4 bộ môn sinh thái phát triển rừng
    'UDVT', //5 bộ môn ứng dụng viễn thám
    'TTDV', //6 trung tâm nghiên cứu bảo tồn động vật hoang dã
    'R&D', //7 phòng nghiên cứu và phát triển
  ]);
  const [selectId, setSelectId] = useState(0);
  const staffs = useSelector(state => state.staffs?.staffs?.allStaff);

  const handleSearch = text => {
    setInput(text);
    setSelectId(null);

    const data = staffs.filter(item =>
      unidecode(item.name.toLowerCase()).includes(text.toLowerCase()),
    );

    setAllStaff(data);
  };

  const handleFilter = index => {
    setSelectId(index);

    if (index === 0) {
      setAllStaff(staffs);
    } else {
      const data =
        index === 1
          ? staffs.filter(item => item.id === 2 || item.id === 5)
          : staffs.filter(item => item.id_bomon === index);

      setAllStaff(data);
    }
  };

  useEffect(() => {
    if (staffs) {
      setAllStaff(staffs);
    }
  }, [staffs]);

  const RenderStaffs = useCallback(
    ({item, index}) => {
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
            marginBottom: Dimension.setHeight(1.5),
            borderBottomWidth: 1,
            borderColor: Colors.INACTIVE_GREY,
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
              source={Images.avatar}
              style={{
                width: 50,
                height: 50,
                marginRight: Dimension.setWidth(3),
              }}
            />
            <View style={{justifyContent: 'center'}}>
              <Text
                style={{
                  fontFamily: Fonts.SF_SEMIBOLD,
                  fontSize: 19,
                  lineHeight: Dimension.setHeight(3.8),
                }}>
                {item.name}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: Colors.INACTIVE_GREY,
                  fontFamily: Fonts.SF_REGULAR,
                  fontSize: 15,
                  width: Dimension.setWidth(45),
                  lineHeight: Dimension.setHeight(2),
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
                lineHeight: Dimension.setHeight(2.8),
              }}>
              Chức vụ
            </Text>
            <Text
              style={{
                fontFamily: Fonts.SF_SEMIBOLD,
                fontSize: 15,
                lineHeight: Dimension.setHeight(2.5),
              }}>
              {item.chucdanh}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [allStaff],
  );

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
            onChangeText={e => handleSearch(e)}
            value={input}
            placeholder="Tìm kiếm nhân sự"
            style={{
              fontFamily: Fonts.SF_REGULAR,
              marginLeft: Dimension.setWidth(3),
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
        <View style={{marginBottom: Dimension.setHeight(0.3)}}>
          <Text
            style={{
              fontFamily: Fonts.SF_SEMIBOLD,
              fontSize: 20,
            }}>
            Nhóm nhân sự
          </Text>
        </View>
        <FlatList
          data={staffGroup}
          keyExtractor={(_, index) => index}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => handleFilter(index)}
                key={index}
                style={{marginRight: Dimension.setWidth(4)}}>
                <Text
                  style={{
                    fontFamily:
                      selectId !== index ? Fonts.SF_REGULAR : Fonts.SF_BOLD,
                    fontSize: 16,
                    color:
                      selectId === index ? '#85d4ee' : Colors.INACTIVE_GREY,
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
          }}>
          Danh sách nhân sự
        </Text>
      </View>
      <FlatList
        style={{marginHorizontal: Dimension.setWidth(2)}}
        data={allStaff}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item, index}) => (
          <RenderStaffs item={item} index={index} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    marginHorizontal: Dimension.setWidth(4),
  },
});

export default StaffListScreen;
