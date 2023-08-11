import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Dimension from '../../contants/Dimension';
import Header from '../../components/Header';
import {getAllOnLeaveData} from '../../redux/apiRequest';
import {changeFormatDate} from '../../utils/serviceFunction';
import Separation from '../../components/Separation';

const HistoryApplyLeaveScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const leaveData = useSelector(state => state.onLeave.onLeaves?.data);
  const staffs = useSelector(state => state.staffs?.staffs?.allStaff);
  const dispatch = useDispatch();
  
  useEffect(() => {
    getAllOnLeaveData(user?.id, dispatch);
  }, []);

  const RenderLeaveList = ({item, index}) => {
    const colorStatus =
      item.status === 0 ? '#f9a86a' : item.status === 1 ? '#57b85d' : '#f25157';
    const bgColorStatus =
      item.status === 0 ? '#fef4eb' : item.status === 1 ? '#def8ed' : '#f9dfe0';
    const status =
      item.status === 0
        ? 'Chờ phê duyệt'
        : item.status === 1
        ? 'Đã phê duyệt'
        : 'Từ chối';
    const icon =
      item.status === 0
        ? Images.pending
        : item.status === 1
        ? Images.approve
        : Images.cancel;
    return (
      <TouchableOpacity
        key={index}
        style={{
          marginHorizontal: Dimension.setWidth(3),
          marginBottom: Dimension.setHeight(2),
          backgroundColor: '#ffffff',
          elevation: 5,
          borderRadius: 15,
          paddingHorizontal: Dimension.setWidth(5),
          paddingVertical: Dimension.setHeight(2),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: Fonts.SF_SEMIBOLD,
              fontSize: 19,
              width: '60%',
            }}>
            {item.lydo}
          </Text>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start',
                paddingVertical: Dimension.setHeight(0.5),
                paddingHorizontal: Dimension.setWidth(1.4),
                borderRadius: 8,
                backgroundColor: bgColorStatus,
              }}>
              <Image
                source={icon}
                style={{
                  height: 16,
                  width: 16,
                  marginRight: Dimension.setWidth(1),
                  tintColor: colorStatus,
                }}
              />
              <Text
                style={{
                  color: colorStatus,
                  fontSize: 14,
                  fontFamily: Fonts.SF_MEDIUM,
                }}>
                {status}
              </Text>
            </View>
            {item.status === 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: Dimension.setWidth(17),
                  alignSelf: 'flex-end',
                }}>
                <TouchableOpacity>
                  <Image
                    source={Images.approved}
                    style={[styles.approvedIcon, {tintColor: '#57b85d'}]}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={Images.cancelled}
                    style={[styles.approvedIcon, {tintColor: '#f25157'}]}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <Text
          style={{
            fontSize: 16,
            fontFamily: Fonts.SF_REGULAR,
            color: '#747476',
            marginBottom: Dimension.setHeight(0.8),
          }}>
          {item.nam}
        </Text>
        <View style={styles.containerEachLine}>
          <Image source={Images.avatar} style={styles.iconic} />
          <Text style={styles.title}>Họ tên: </Text>
          <Text style={styles.content}>{item.hoten}</Text>
        </View>
        <View style={styles.containerEachLine}>
          <Image source={Images.avatar} style={styles.iconic} />
          <Text style={styles.title}>Người duyệt: </Text>
          <Text style={styles.content}>{item.nguoiduyet}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image source={Images.leaveDate} style={styles.iconic} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.title}>Nghỉ từ: </Text>
            <Text style={styles.content}>{changeFormatDate(item.tungay)}</Text>
            <Separation />
            <Text style={styles.content}>{changeFormatDate(item.denngay)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Lịch sử nghỉ phép" navigation={navigation} />

      <FlatList
        style={{flex: 1, marginTop: Dimension.setHeight(2)}}
        data={leaveData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item, index}) => (
          <RenderLeaveList item={item} index={index} />
        )}
        initialNumToRender={6}
        windowSize={6}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b6c987',
  },

  containerEachLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Dimension.setHeight(1.3),
  },

  approvedIcon: {
    width: 30,
    height: 30,
  },

  iconic: {
    height: 33,
    width: 33,
    marginRight: Dimension.setWidth(2),
  },

  title: {
    color: '#747476',
    fontSize: 16,
    fontFamily: Fonts.SF_MEDIUM,
  },

  content: {
    fontSize: 17,
    fontFamily: Fonts.SF_SEMIBOLD,
  },
});

export default HistoryApplyLeaveScreen;
