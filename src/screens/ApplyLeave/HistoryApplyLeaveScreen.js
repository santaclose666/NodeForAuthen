import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import Header from '../../components/Header';

const HistoryApplyLeaveScreen = ({navigation, route}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const data = route?.params?.data;
  const [onLeaveData, setOnLeaveData] = useState([
    {
      reason: 'Đau đầu chóng mặt',
      type: 'Nghỉ phép ốm',
      leaveFrom: '16/06/2001',
      leaveTo: '18/06/2001',
      status: 'Pending',
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Lịch sử nghỉ phép" navigation={navigation} />
      <ScrollView style={{flex: 1, marginTop: Dimension.setHeight(2)}}>
        {onLeaveData.map((item, index) => {
          const colorStatus =
            item.status === 'Pending'
              ? '#f9a86a'
              : item.status === 'Approved'
              ? '#57b85d'
              : '#f25157';
          const bgColorStatus =
            item.status === 'Pending'
              ? '#fef4eb'
              : item.status === 'Approved'
              ? '#def8ed'
              : '#f9dfe0';
          return (
            <View
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
                <Text style={{fontFamily: Fonts.SF_SEMIBOLD, fontSize: 22}}>
                  {item.reason}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: Dimension.setHeight(0.5),
                    paddingHorizontal: Dimension.setWidth(1.4),
                    borderRadius: 8,
                    backgroundColor: bgColorStatus,
                  }}>
                  <Image
                    source={
                      item.status === 'Pending'
                        ? Images.pending
                        : item.status === 'Approved'
                        ? Images.approve
                        : Images.cancel
                    }
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
                    {item.status}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.SF_REGULAR,
                  color: '#747476',
                  marginBottom: Dimension.setHeight(0.8),
                }}>
                {item.type}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: Dimension.setHeight(1.3),
                }}>
                <Image
                  source={Images.avatar}
                  style={{
                    height: 33,
                    width: 33,
                    marginRight: Dimension.setWidth(2),
                  }}
                />
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: Fonts.SF_SEMIBOLD,
                  }}>
                  {user?.name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={Images.leaveDate}
                  style={{
                    height: 33,
                    width: 33,
                    marginRight: Dimension.setWidth(2),
                  }}
                />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      color: '#747476',
                      fontSize: 16,
                      fontFamily: Fonts.SF_MEDIUM,
                    }}>
                    Nghỉ từ:{' '}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.SF_SEMIBOLD,
                    }}>
                    {item.leaveFrom}
                  </Text>
                  <View
                    style={{
                      width: Dimension.setWidth(3),
                      borderBottomWidth: 1,
                      borderColor: Colors.INACTIVE_GREY,
                      marginHorizontal: Dimension.setWidth(2),
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.SF_SEMIBOLD,
                    }}>
                    {item.leaveTo}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b6c987',
  },
});

export default HistoryApplyLeaveScreen;
