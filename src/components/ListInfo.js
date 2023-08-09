import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';
import Images from '../contants/Images';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import Dimension from '../contants/Dimension';

const ListInfo = ({info, index}) => {
  const colorText = Colors.INACTIVE_GREY;
  const hrArr = [
    'Phòng tổng hợp',
    'Bộ môn công nghệ môi trường',
    'Bộ môn sinh thái phát triển rừng',
    'Bộ môn ứng dụng viễn thám',
    'TT Nghiên cứu bảo tồn động vật hoang dã',
    'Phòng nghiên cứu và phát triển',
  ];
  const filterBomon = hrArr[info?.hr - 2];
  const role =
    info?.role === 1 ? 'Admin' : info?.role === 2 ? 'Manager' : 'User';
  return (
    <View style={styles.container}>
      {index === 0 ? (
        <View style={styles.avatarContainer}>
          <Image style={styles.avatarImg} source={info?.avatar} />
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
              bottom: Dimension.setHeight(6.6),
              margin: 'auto',
            }}>
            <Image style={styles.avatarIfee} source={info?.avatar} />
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.fullNameIfee}>{info?.fullName}</Text>
              <Text style={styles.ifee}>Viện Sinh thái rừng & Môi trường</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: Dimension.setHeight(0.6),
              }}>
              <Text style={styles.roleTeamTittle}>Quyền truy cập</Text>
              <Text style={styles.roleTeamText}>{role}</Text>
            </View>
          </View>
        </View>
      )}
      <ScrollView
        style={styles.infoContainer}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.wrap, {marginTop: Dimension.setHeight(2.4)}]}>
          <Image
            style={[styles.img, {tintColor: colorText}]}
            source={
              info?.userName !== undefined ? Images.user : Images.position
            }
          />
          <View style={styles.textContainer}>
            <Text style={[styles.titleText, {color: colorText}]}>
              {info?.userName !== undefined ? 'Tên người dùng' : 'Chức danh'}
            </Text>
            <Text style={styles.contentText}>
              {info?.userName !== undefined ? info?.userName : info?.position}
            </Text>
          </View>
        </View>
        <View style={styles.wrap}>
          <Image
            style={[styles.img, {tintColor: colorText}]}
            source={Images.hr}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.titleText, {color: colorText}]}>Bộ phận</Text>
            <Text style={styles.contentText}>{filterBomon}</Text>
          </View>
        </View>
        <View style={styles.wrap}>
          <Image
            style={[styles.img, {tintColor: colorText}]}
            source={Images.year}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.titleText, {color: colorText}]}>Năm sinh</Text>
            <Text style={styles.contentText}>{info?.birthday}</Text>
          </View>
        </View>
        <View style={styles.wrap}>
          <Image
            style={[styles.img, {tintColor: colorText}]}
            source={Images.email}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.titleText, {color: colorText}]}>Email</Text>
            <Text style={styles.contentText}>{info?.email}</Text>
          </View>
        </View>
        <View style={styles.wrap}>
          <Image
            style={[styles.img, {tintColor: colorText}]}
            source={Images.phone}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.titleText, {color: colorText}]}>
              Số điện thoại
            </Text>
            <Text style={styles.contentText}>{info?.phone}</Text>
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
    marginTop: Dimension.setHeight(2.3),
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarImg: {
    width: 90,
    height: 90,
    marginBottom: Dimension.setHeight(0.6),
  },

  fullNameText: {
    fontFamily: Fonts.SF_BOLD,
    fontSize: 20,
  },

  ifeeAvatarContainer: {
    position: 'relative',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    width: Dimension.setWidth(80),
    height: Dimension.setHeight(22),
    marginHorizontal: Dimension.setWidth(10),
    marginTop: Dimension.setHeight(8),
    elevation: 5,
  },

  avatarIfee: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginBottom: Dimension.setHeight(0.6),
  },

  fullNameIfee: {
    fontFamily: Fonts.SF_BOLD,
    fontSize: 24,
  },

  ifee: {
    fontFamily: Fonts.SF_BOLD,
    fontSize: 16,
    color: Colors.INACTIVE_GREY,
    lineHeight: Dimension.setHeight(2.2),
  },

  roleTeamTittle: {
    fontFamily: Fonts.SF_BOLD,
    fontSize: 15,
    color: Colors.INACTIVE_GREY,
  },

  roleTeamText: {
    fontFamily: Fonts.SF_BOLD,
    fontSize: 20,
    color: '#4a4c56',
    lineHeight: Dimension.setHeight(2.5),
    overflow: 'hidden',
  },

  infoContainer: {
    flex: 1,
    marginTop: Dimension.setHeight(3),
    backgroundColor: '#ffffff',
    height: '100%',
    elevation: 6,
    borderTopWidth: 0.6,
    borderLeftWidth: 0.6,
    borderRightWidth: 0.6,
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
  },

  textContainer: {
    marginLeft: 21,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.INACTIVE_GREY,
    width: '77%',
  },

  titleText: {
    fontSize: 15,
    fontFamily: Fonts.SF_BOLD,
  },

  contentText: {
    fontSize: 19,
    fontFamily: Fonts.SF_BOLD,
    color: '#4a4c56',
    lineHeight: Dimension.setHeight(3.3),
  },
});

export default ListInfo;
