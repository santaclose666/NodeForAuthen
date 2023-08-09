import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Images from '../contants/Images';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import Dimension from '../contants/Dimension';
import {useSelector} from 'react-redux';

const NotifiScreen = () => {
  const notifiData = useSelector(
    state => state.notifi.notifications?.allNotifi,
  );
  const [notifiMenu, setNotifiMenu] = useState([
    'Tất cả',
    'Yêu cầu',
    'Sự kiện',
  ]);
  const [notifiMenuId, setNotifiMenuId] = useState(0);
  const [allNotifi, setAllNotifi] = useState([]);

  useEffect(() => {
    if (notifiData) {
      setAllNotifi(notifiData);
    }
  }, [notifiData]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />
        <View style={styles.notifiMenuContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: Dimension.setWidth(2),
            }}>
            <Text
              style={{
                fontFamily: Fonts.SF_BOLD,
                fontSize: 26,
              }}>
              Thông báo
            </Text>
            <View style={{marginRight: Dimension.setWidth(2)}}>
              <Image
                source={Images.notification}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.notifiItemContainer}>
          <FlatList
            data={notifiMenu}
            keyExtractor={(_, index) => index}
            horizontal={true}
            renderItem={({item, index}) => {
              const colorBorder =
                notifiMenuId === index ? 'black' : 'rgba(255, 255, 255, 0)';
              const colorText =
                notifiMenuId === index ? 'black' : Colors.INACTIVE_GREY;
              const bdWidth = notifiMenuId === index ? 2 : 0.6;
              return (
                <View
                  key={index}
                  style={{
                    marginLeft: Dimension.setWidth(4.4),
                    borderBottomWidth: bdWidth,
                    borderColor: colorBorder,
                  }}>
                  <TouchableOpacity onPress={() => setNotifiMenuId(index)}>
                    <Text
                      style={{
                        fontFamily: Fonts.SF_SEMIBOLD,
                        fontSize: 18,
                        color: colorText,
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
        <View
          style={{
            flex: 20,
            flexDirection: 'row',
            marginHorizontal: Dimension.setWidth(2.5),
            marginTop: Dimension.setHeight(2),
          }}>
          {allNotifi.length !== 0 && (
            <FlatList
              data={allNotifi}
              keyExtractor={(_, index) => index}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <View key={index} style={styles.notifiContainer}>
                    <Image source={Images.avatar} style={styles.notifiImg} />
                    <View
                      style={{
                        marginLeft: Dimension.setWidth(3),
                        flexDirection: 'column',
                      }}>
                      <View style={styles.textContainer}>
                        <Text style={styles.obj2}>
                          <Text style={styles.obj1}>{item?.obj1}</Text>{' '}
                          {item?.content} {item?.obj2}
                        </Text>
                      </View>
                      <Text style={styles.time}>{item?.time}</Text>
                    </View>
                  </View>
                );
              }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  notifiMenuContainer: {
    marginTop: Dimension.setHeight(3),
    marginLeft: Dimension.setWidth(3.3),
    marginBottom: Dimension.setHeight(0.5),
  },

  notifiItemContainer: {
    flex: 1.1,
    marginHorizontal: Dimension.setWidth(3.6),
    borderBottomWidth: 0.6,
    borderColor: Colors.INACTIVE_GREY,
  },

  allNotifiContainer: {
    marginTop: Dimension.setHeight(2.5),
    marginHorizontal: Dimension.setWidth(3.6),
    borderBottomWidth: 0.6,
    borderColor: Colors.INACTIVE_GREY,
  },

  notifiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Dimension.setWidth(4),
    marginBottom: Dimension.setHeight(3.6),
  },

  notifiImg: {
    width: 50,
    height: 50,
  },

  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: Dimension.setWidth(70),
    marginBottom: 3,
  },

  obj1: {
    flexWrap: 'wrap',
    color: '#3a5072',
    fontFamily: Fonts.SF_BOLD,
    fontSize: 18,
    lineHeight: Dimension.setHeight(2.5),
  },

  obj2: {
    flexWrap: 'wrap',
    color: '#7f84a1',
    fontFamily: Fonts.SF_REGULAR,
    fontSize: 18,
    lineHeight: Dimension.setHeight(2.5),
  },

  time: {
    color: Colors.INACTIVE_GREY,
    fontFamily: Fonts.SF_REGULAR,
    fontSize: 15,
  },
});

export default NotifiScreen;
