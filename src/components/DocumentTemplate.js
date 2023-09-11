import React, {memo, useCallback, useState, useRef, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Platform,
} from 'react-native';
import unidecode from 'unidecode';
import Images from '../contants/Images';
import Icons from '../contants/Icons';
import Colors from '../contants/Colors';
import Fonts from '../contants/Fonts';
import Dimension from '../contants/Dimension';
import {shadowIOS} from '../contants/propsIOS';
import {fontDefault} from '../contants/Variable';
import Header from '../components/Header';
import LinearGradientUI from './LinearGradientUI';
import {CheckDownLoadModal} from './Modal';
import {useSelector} from 'react-redux';
import {request, PERMISSIONS} from 'react-native-permissions';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {Checkbox} from 'native-base';
import RegisterBtn from './RegisterBtn';
import {ToastAlert, ToastSuccess} from './Toast';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {downloadPermissionAndroid} from '../utils/permissionFunc';

const DocumentTemplate = ({
  screenName,
  navigation,
  pickFileIndex,
  setpickFileIndex,
  pickOptionIndex,
  setPickOptionIndex,
  input,
  setInput,
  data,
  groupOption,
  document,
  setDocument,
}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['96%'], []);
  const [toggleCheckDownload, setToggleCheckDownload] = useState(false);
  const [name, setName] = useState('');
  const [workUnit, setWorkUnit] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [checked, setChecked] = useState(true);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSearch = useCallback(
    text => {
      setInput(text);
      setpickFileIndex(null);

      const filter = data.filter(item =>
        unidecode(item.tenvanban.toLowerCase()).includes(text.toLowerCase()),
      );
      setDocument(filter);
    },
    [input],
  );

  const handlePickOption = useCallback(
    (keyWord, index) => {
      index === 0
        ? setDocument(data)
        : setDocument(data.filter(item => item.loaivanban === keyWord));

      setPickOptionIndex(index);
      setpickFileIndex(null);
    },
    [pickOptionIndex],
  );

  const handlePress = useCallback(path => {
    console.log(path);
    navigation.navigate('PDF', {link: encodeURI(path)});
  }, []);

  const handleCheckDownload = () => {
    if (!user) {
      setToggleCheckDownload(true);
    } else {
      ToastAlert('Logined');
    }
  };

  const downloadFile = async url => {
    const {config, fs} = ReactNativeBlobUtil;
    const cacheDir = fs.dirs.DownloadDir;

    const filename = url.split('/').pop();
    const pdfPath = `${cacheDir}/${filename}`;

    try {
      const configOptions = Platform.select({
        ios: {
          fileCache: true,
          path: pdfPath,
          appendExt: filename.split('.').pop(),
        },
        android: {
          fileCache: true,
          path: pdfPath,
          appendExt: filename.split('.').pop(),
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: pdfPath,
            description: 'File',
          },
        },
      });

      const response = await ReactNativeBlobUtil.config(configOptions).fetch(
        'GET',
        url,
      );

      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const dowloadPDFFile = async url => {
    if (Platform.OS === 'android') {
      downloadFile(url);
    } else {
      downloadFile(url).then(res => {
        ReactNativeBlobUtil.ios.previewDocument(res.path());
      });
    }
  };

  const handleRegisterDocument = () => {
    if (
      name.length !== 0 &&
      workUnit.length !== 0 &&
      phoneNumber.length !== 0 &&
      email.length !== 0 &&
      purpose.length !== 0
    ) {
      if (checked) {
        bottomSheetModalRef.current?.dismiss();
        ToastSuccess('Đăng kí thành công');
      } else {
        ToastAlert('Chưa cam kết sử dụng tài liệu đúng mục đích!');
      }
    } else {
      ToastAlert('Thiếu thông tin!');
    }
  };

  const RenderDocument = memo(({item, index}) => {
    return (
      <View style={{flex: 1, zIndex: 999}}>
        <TouchableOpacity
          onPress={() => handlePress(item.path)}
          style={styles.flatListItemContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: Dimension.setWidth(3),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '70%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  dowloadPDFFile(item.path);
                }}>
                <Image
                  source={Images.download}
                  style={{
                    width: 40,
                    height: 40,
                    marginRight: Dimension.setWidth(3),
                  }}
                />
              </TouchableOpacity>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{
                  fontFamily: Fonts.SF_SEMIBOLD,
                  fontSize: Dimension.fontSize(16),
                  ...fontDefault,
                }}>
                {item.tenvanban}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: Fonts.SF_SEMIBOLD,
                fontSize: Dimension.fontSize(15),
                color: Colors.INACTIVE_GREY,
              }}>
              {item.nam}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              pickFileIndex !== index
                ? setpickFileIndex(index)
                : setpickFileIndex(null);
            }}
            style={{
              marginTop: Dimension.setHeight(1.8),
              borderTopWidth: 0.5,
              borderTopColor: Colors.INACTIVE_GREY,
              marginHorizontal: Dimension.setWidth(7),
            }}>
            <View
              style={{
                paddingTop: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SF_REGULAR,
                  fontSize: Dimension.fontSize(14),
                  color: Colors.INACTIVE_GREY,
                }}>
                {pickFileIndex === index ? 'Thu gọn' : 'Chi tiết'}
              </Text>
              <Image
                source={pickFileIndex === index ? Images.up : Images.down}
                style={{
                  width: 16,
                  height: 16,
                  tintColor: Colors.INACTIVE_GREY,
                }}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
        {pickFileIndex === index && (
          <View style={styles.subMenuContainer}>
            <View style={{padding: 10, marginLeft: Dimension.setWidth(3)}}>
              <View style={[styles.subItem, {flexWrap: 'wrap'}]}>
                <Image source={Images.dot} style={styles.dot} />
                <Text style={styles.title}>Tên VB: </Text>
                <Text style={styles.content}>{item?.tenvanban}</Text>
              </View>
              <View style={styles.subItem}>
                <Image source={Images.dot} style={styles.dot} />
                <Text style={styles.title}>Năm ban hành: </Text>
                <Text style={styles.content}>{item?.nam}</Text>
              </View>
              {item?.sohieu && (
                <View style={styles.subItem}>
                  <Image source={Images.dot} style={styles.dot} />
                  <Text style={styles.title}>Số hiệu: </Text>
                  <Text style={styles.content}>{item?.sohieu}</Text>
                </View>
              )}
              {item?.loaivanban && (
                <View style={styles.subItem}>
                  <Image source={Images.dot} style={styles.dot} />
                  <Text style={styles.title}>Loại văn bản: </Text>
                  <Text style={styles.content}>{item?.loaivanban}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    );
  });

  return (
    <LinearGradientUI>
      <SafeAreaView style={styles.container}>
        <Header title={screenName} navigation={navigation} />
        <View style={styles.searchInput}>
          <Icons.Feather name="search" size={25} color={Colors.INACTIVE_GREY} />
          <TextInput
            onChangeText={e => handleSearch(e)}
            value={input}
            placeholder="Tìm văn bản"
            style={{
              fontFamily: Fonts.SF_REGULAR,
              marginLeft: 10,
              width: '80%',
            }}
          />
        </View>

        {groupOption && (
          <View style={styles.optionContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {groupOption?.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      handlePickOption(item, index);
                    }}
                    key={index}
                    style={{
                      marginRight: Dimension.setWidth(4.4),
                      paddingVertical: 3,
                      borderBottomWidth: pickOptionIndex === index ? 2 : 0,
                      borderBottomColor:
                        pickOptionIndex === index
                          ? Colors.DEFAULT_GREEN
                          : '#fff',
                    }}>
                    <Text
                      style={{
                        fontFamily:
                          pickOptionIndex === index
                            ? Fonts.SF_SEMIBOLD
                            : Fonts.SF_REGULAR,
                        fontSize: Dimension.fontSize(16),
                        opacity: 0.8,
                        color:
                          pickOptionIndex === index
                            ? Colors.DEFAULT_GREEN
                            : Colors.DEFAULT_BLACK,
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={styles.fileListContainer}>
          <FlatList
            data={document}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <RenderDocument item={item} index={index} />
            )}
            initialNumToRender={10}
            windowSize={6}
            extraData={document}
          />
        </View>

        <BottomSheetModalProvider>
          <BottomSheetModal
            backgroundStyle={{backgroundColor: '#cce0f2'}}
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: Dimension.setHeight(1.2),
                paddingBottom: Dimension.setHeight(1.5),
                borderBottomWidth: 0.8,
                borderBottomColor: Colors.INACTIVE_GREY,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SF_BOLD,
                  fontSize: Dimension.fontSize(20),
                  ...fontDefault,
                }}>
                Đăng kí sử dụng
              </Text>
            </View>
            <BottomSheetScrollView
              style={{
                marginTop: Dimension.setHeight(2),
                paddingHorizontal: Dimension.setWidth(3),
              }}
              showsVerticalScrollIndicator={false}>
              <View style={styles.containerEachLine}>
                <Text style={styles.title}>Họ tên</Text>
                <TextInput
                  style={styles.inputText}
                  placeholder="Nhập họ tên"
                  value={name}
                  onChangeText={e => setName(e)}
                />
              </View>
              <View style={styles.containerEachLine}>
                <Text style={styles.title}>Đơn vị công tác</Text>
                <TextInput
                  style={styles.inputText}
                  placeholder="Nhập tên đơn vị"
                  value={workUnit}
                  onChangeText={e => setWorkUnit(e)}
                />
              </View>
              <View style={styles.containerEachLine}>
                <Text style={styles.title}>Số điện thoại</Text>
                <TextInput
                  inputMode="numeric"
                  style={styles.inputText}
                  placeholder="Nhập số điện thoại"
                  value={phoneNumber}
                  onChangeText={e => setPhoneNumber(e)}
                />
              </View>
              <View style={styles.containerEachLine}>
                <Text style={styles.title}>Địa chỉ email</Text>
                <TextInput
                  style={styles.inputText}
                  placeholder="Nhập email"
                  value={email}
                  onChangeText={e => setEmail(e)}
                />
              </View>
              <View style={styles.containerEachLine}>
                <Text style={styles.title}>Mục đích sử dụng</Text>
                <TextInput
                  style={styles.inputText}
                  placeholder="Nhập mục đích"
                  value={purpose}
                  onChangeText={e => setPurpose(e)}
                />
              </View>
              <View
                style={{
                  paddingLeft: Dimension.setWidth(2),
                }}>
                <Checkbox
                  value="signupdocument"
                  fontFamily={'SFProDisplay-Medium'}
                  textDecorationLine={'underline'}
                  defaultIsChecked
                  onChange={e => {
                    setChecked(e);
                  }}>
                  Tôi cam kết sử dụng tài liệu đúng mục đích
                </Checkbox>
              </View>

              <View style={{marginTop: Dimension.setHeight(1)}}>
                <RegisterBtn
                  nameBtn={'Đăng kí'}
                  onEvent={handleRegisterDocument}
                />
              </View>
            </BottomSheetScrollView>
          </BottomSheetModal>
        </BottomSheetModalProvider>

        <CheckDownLoadModal
          navigation={navigation}
          toggleModal={toggleCheckDownload}
          setToggleModal={setToggleCheckDownload}
          handlePresentModalPress={handlePresentModalPress}
        />
      </SafeAreaView>
    </LinearGradientUI>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: Dimension.setHeight(2),
    marginHorizontal: Dimension.setWidth(5),
  },

  searchContainer: {
    marginTop: Dimension.setHeight(2),
    marginHorizontal: Dimension.setWidth(2),
    backgroundColor: '#ffffff',
    elevation: 4,
    ...shadowIOS,
    borderRadius: 8,
    borderWidth: 1,
    height: 30,
    width: '90%',
    alignSelf: 'center',
  },

  optionContainer: {
    marginTop: Dimension.setHeight(1.5),
    marginHorizontal: Dimension.setWidth(5),
  },

  fileListContainer: {
    flex: 1,
    marginTop: Dimension.setHeight(1.5),
    marginHorizontal: Dimension.setWidth(5),
  },

  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    width: 10,
    height: 10,
    marginRight: Dimension.setWidth(1),
  },

  title: {
    fontFamily: Fonts.SF_BOLD,
    fontSize: Dimension.fontSize(14),
    ...fontDefault,
  },

  content: {
    fontFamily: Fonts.SF_REGULAR,
    fontSize: Dimension.fontSize(14),
    marginLeft: Dimension.setWidth(2),
    textAlign: 'justify',
  },
  searchInput: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    width: '90%',
    borderRadius: 9,
    height: Dimension.setHeight(5.5),
    justifyContent: 'flex-start',
    paddingHorizontal: Dimension.setWidth(3),
    marginTop: 10,
  },

  flatListItemContainer: {
    backgroundColor: '#ffffff',
    marginBottom: Dimension.setHeight(1.1),
    marginTop: Dimension.setHeight(1.1),
    borderRadius: 9,
    elevation: 4,
    ...shadowIOS,
    borderWidth: 0.5,
    borderColor: Colors.WHITE,
    paddingTop: Dimension.setHeight(1.6),
    paddingBottom: Dimension.setHeight(1.2),
  },

  subMenuContainer: {
    marginHorizontal: Dimension.setWidth(5.5),
    backgroundColor: 'rgba(150, 160, 169, 0.2)',
    borderRadius: 12,
    width: '86%',
    marginBottom: Dimension.setHeight(0.6),
  },

  containerEachLine: {
    marginBottom: Dimension.setHeight(2),
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 12,
    paddingVertical: Dimension.setHeight(1.6),
    paddingHorizontal: Dimension.setWidth(3),
  },

  title: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: Dimension.fontSize(15),
    color: '#8bc7bc',
    marginBottom: Dimension.setHeight(1),
  },

  inputText: {
    borderBottomWidth: 0.6,
    borderBottomColor: 'gray',
    marginHorizontal: Dimension.setWidth(1.6),
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: Dimension.fontSize(16),
    height: Dimension.setHeight(6),
  },
});

export default DocumentTemplate;
