import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import Images from '../contants/Images';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import Dimension from '../contants/Dimension';
import {shadowIOS} from '../contants/propsIOS';
import {fontDefault} from '../contants/Variable';

const ListInfo = ({info, index}) => {
  const role =
    info?.role === 1 ? 'Admin' : info?.role === 2 ? 'Manager' : 'User';
  return (
    <View style={styles.container}>
      {index === 0 ? (
        <View style={styles.avatarContainer}>
          <View style={styles.avtContainer}>
            <Image style={styles.avatarImg} src={info?.avatar} />
          </View>
          <Text style={styles.fullNameText}>{info?.fullName}</Text>
        </View>
      ) : (
        <View style={styles.ifeeAvatarContainer}>
          <View
            style={{
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              top: 0,
              left: 0,
              right: 0,
              bottom: Dimension.setHeight(4.4),
            }}>
            <View style={styles.avtContainer}>
              <Image style={styles.avatarIfee} src={info?.avatar} />
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.fullNameIfee}>{info?.fullName}</Text>
              <Text style={styles.ifee}>Viện Sinh thái rừng & Môi trường</Text>
              <Text style={styles.roleTeamTittle}>{role}</Text>
            </View>
          </View>
        </View>
      )}
      <ScrollView
        style={styles.infoContainer}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.wrap, {marginTop: Dimension.setHeight(2.4)}]}>
          <Image
            style={[styles.img]}
            source={
              info?.userName !== undefined ? Images.user : Images.position
            }
          />
          <View style={styles.textContainer}>
            <Text style={[styles.titleText]}>
              {info?.userName !== undefined ? 'Tên người dùng' : 'Chức danh'}
            </Text>
            <Text style={styles.contentText}>
              {info?.userName !== undefined ? info?.userName : info?.position}
            </Text>
          </View>
        </View>
        <View style={styles.wrap}>
          <Image style={[styles.img]} source={Images.hr} />
          <View style={styles.textContainer}>
            <Text style={[styles.titleText]}>Bộ phận</Text>
            <Text style={styles.contentText}>{info?.hr}</Text>
          </View>
        </View>
        <View style={styles.wrap}>
          <Image style={[styles.img]} source={Images.year} />
          <View style={styles.textContainer}>
            <Text style={[styles.titleText]}>Sinh nhật</Text>
            <Text style={styles.contentText}>{info?.birthday}</Text>
          </View>
        </View>
        <View style={styles.wrap}>
          <Image style={[styles.img]} source={Images.email} />
          <View style={styles.textContainer}>
            <Text style={[styles.titleText]}>Email</Text>
            <Text style={styles.contentText}>{info?.email}</Text>
          </View>
        </View>
        <View style={styles.wrap}>
          <Image style={[styles.img]} source={Images.phone} />
          <View style={styles.textContainer}>
            <Text style={[styles.titleText]}>Số điện thoại</Text>
            <Text style={styles.contentText}>0{info?.phone}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  avatarContainer: {
    marginTop: Dimension.setHeight(3.6),
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarImg: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },

  fullNameText: {
    fontFamily: Fonts.SF_BOLD,
    fontSize: Dimension.fontSize(20),
  },

  ifeeAvatarContainer: {
    position: 'relative',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    height: Dimension.boxHeight(148),
    marginHorizontal: Dimension.setWidth(10),
    marginTop: Dimension.setHeight(8),
    elevation: 5,
    ...shadowIOS,
  },

  avtContainer: {
    borderWidth: 1,
    borderRadius: 50,
    padding: 1,
    borderColor: '#268fbe',
  },

  avatarIfee: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },

  fullNameIfee: {
    marginTop: Platform.OS == 'ios' ? Dimension.setHeight(1.3) : 0,
    fontFamily: Fonts.SF_BOLD,
    fontSize: Dimension.fontSize(20),
    ...fontDefault,
  },

  ifee: {
    fontFamily: Fonts.SF_BOLD,
    fontSize: Dimension.fontSize(14),
    color: Colors.DEFAULT_BLACK,
    opacity: 0.6,
    marginVertical: Platform.OS == 'ios' ? Dimension.setHeight(0.4) : -3,
  },

  roleTeamTittle: {
    fontFamily: Fonts.SF_BOLD,
    fontSize: Dimension.fontSize(16),
    color: Colors.DEFAULT_RED,
  },

  roleTeamText: {
    fontFamily: Fonts.SF_BOLD,
    fontSize: Dimension.fontSize(18),
    ...fontDefault,
    overflow: 'hidden',
  },

  infoContainer: {
    marginTop: Dimension.setHeight(4),
    backgroundColor: '#ffffff',
    height: '100%',
    elevation: 6,
    ...shadowIOS,
    borderWidth: 0.5,
    borderColor: Colors.INACTIVE_GREY,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Dimension.setWidth(7.5),
    marginBottom: Dimension.setHeight(1.8),
  },

  img: {
    width: 30,
    height: 30,
    tintColor: Colors.DEFAULT_GREEN,
  },

  textContainer: {
    marginLeft: 21,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.INACTIVE_GREY,
    width: '77%',
  },

  titleText: {
    fontSize: Dimension.fontSize(15),
    fontFamily: Fonts.SF_MEDIUM,
    color: Colors.DEFAULT_BLACK,
    opacity: 0.5,
  },

  contentText: {
    fontSize: Dimension.fontSize(16),
    fontFamily: Fonts.SF_BOLD,
    ...fontDefault,
    marginVertical: Platform.OS == 'ios' ? Dimension.setHeight(0.6) : -3,
  },
});

export default ListInfo;
