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
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {Checkbox} from 'native-base';
import RegisterBtn from './RegisterBtn';
import {ToastAlert, ToastSuccess} from './Toast';
import {getAllDocument, sendRequestUseDocument} from '../redux/apiRequest';
import {IOSDownload, AndroidDownload} from '../utils/download';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch} from 'react-redux';

const DocumentTemplate = ({screenName, navigation, data, groupOption}) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['96%'], []);
  const [toggleCheckDownload, setToggleCheckDownload] = useState(false);
  const [name, setName] = useState('');
  const [workUnit, setWorkUnit] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [checked, setChecked] = useState(false);
  const [docId, setDocId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [pickFileIndex, setpickFileIndex] = useState(null);
  const [pickOptionIndex, setPickOptionIndex] = useState({
    item: 'Tất cả',
    index: 0,
  });
  const [input, setInput] = useState('');
  const [document, setDocument] = useState(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSearch = useCallback(
    text => {
      setInput(text);
      setpickFileIndex(null);

      const filter = data.filter(item =>
        unidecode(item.tenvanban.toLowerCase()).includes(
          unidecode(text.toLowerCase()),
        ),
      );

      setDocument(filter);
    },
    [input],
  );

  const handlePickOption = useCallback(() => {
    if (pickOptionIndex?.index === 0) {
      return data;
    } else {
      return data.filter(
        item =>
          item.loaivanban === pickOptionIndex?.item ||
          item.loaivbpl === pickOptionIndex?.item,
      );
    }
  }, [pickOptionIndex]);

  const handlePress = useCallback(path => {
    console.log(path);
    navigation.navigate('PDF', {link: encodeURI(path)});
  }, []);

  const handleCheckDownload = (id, path) => {
    if (!user) {
      setDocId(id);
      setToggleCheckDownload(true);
    } else {
      dowloadPDFFile(encodeURI(path));
    }
  };

  const dowloadPDFFile = async url => {
    if (Platform.OS === 'android') {
      AndroidDownload(url);
    } else {
      IOSDownload(url);
    }
  };

  const handleRegisterDocument = () => {
    if (
      name.length !== 0 &&
      workUnit.length !== 0 &&
      (phoneNumber.length == 10 || phoneNumber.length == 11) &&
      email.includes('@') &&
      purpose.length !== 0 &&
      docId !== null
    ) {
      if (checked) {
        const data = {
          id_vanban: docId,
          hoten: name,
          sdt: phoneNumber,
          donvi: workUnit,
          mucdich_sd: purpose,
          email: email,
        };

        sendRequestUseDocument(data);

        bottomSheetModalRef.current?.dismiss();
        setPurpose('');
        ToastSuccess(
          'Đăng kí thành công, Chúng tôi sẽ xem xét và xử lý yêu cầu của bạn!',
        );
      } else {
        ToastAlert('Chưa cam kết việc sử dụng tài liệu!');
      }
    } else {
      ToastAlert('Thông tin không phù hợp!');
    }
  };

  const handleRefresh = async () => {
    setRefresh(true);

    try {
      await getAllDocument(dispatch);

      setPickOptionIndex({item: null, index: 0});
      setRefresh(false);
    } catch (error) {
      console.log(error);
    }
  };

  const RenderDocument = memo(({item, index}) => {
    const colorHieuluc =
      item.hieuluc == 'Còn hiệu lực'
        ? '#30a62c'
        : item.hieuluc == 'Hết hiệu lực'
        ? '#cc2333'
        : item.hieuluc == 'Sắp có hiệu lực'
        ? '#c7b841'
        : {...fontDefault};

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
                width: '66%',
              }}>
              <Image
                source={Images.pdf}
                style={{
                  width: 40,
                  height: 40,
                  marginRight: Dimension.setWidth(3),
                }}
              />
              <View>
                {item.id_donvi != 99 && item.donvi && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={Images.certicate}
                      style={{
                        width: 16,
                        height: 16,
                        marginRight: 2,
                      }}
                    />
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={{
                        fontFamily: Fonts.SF_SEMIBOLD,
                        fontSize: Dimension.fontSize(12),
                        ...fontDefault,
                        color: '#63c8f5',
                      }}>
                      {item.donvi}
                    </Text>
                  </View>
                )}
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{
                    fontFamily: Fonts.SF_SEMIBOLD,
                    fontSize: Dimension.fontSize(15),
                    ...fontDefault,
                  }}>
                  {item.tenvanban}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                handleCheckDownload(item.id, item.path);
              }}
              style={{width: 40, height: 40}}>
              <Image
                source={Images.download}
                style={{
                  width: 30,
                  height: 30,
                  marginRight: Dimension.setWidth(3),
                }}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              pickFileIndex !== index
                ? setpickFileIndex({item: item, index: index})
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

              {item?.loaivanban && (
                <View style={styles.subItem}>
                  <Image source={Images.dot} style={styles.dot} />
                  <Text style={styles.title}>Loại văn bản: </Text>
                  <Text style={styles.content}>{item?.loaivanban}</Text>
                </View>
              )}
              {item?.id_loaivanban == 5 && (
                <>
                  <View style={styles.subItem}>
                    <Image source={Images.dot} style={styles.dot} />
                    <Text style={styles.title}>Số hiệu: </Text>
                    <Text style={styles.content}>{item?.sohieu}</Text>
                  </View>
                  <View style={styles.subItem}>
                    <Image source={Images.dot} style={styles.dot} />
                    <Text style={styles.title}>Hiệu lực: </Text>
                    <Text
                      style={[
                        styles.content,
                        {color: colorHieuluc, fontFamily: Fonts.SF_BOLD},
                      ]}>
                      {item?.hieuluc}
                    </Text>
                  </View>
                </>
              )}
              <View style={styles.subItem}>
                <Image source={Images.dot} style={styles.dot} />
                <Text style={styles.title}>Năm: </Text>
                <Text style={styles.content}>{item?.nam}</Text>
              </View>
              {item?.id_donvi != 99 && (
                <View style={[styles.subItem, {flexWrap: 'wrap'}]}>
                  <Image source={Images.dot} style={styles.dot} />
                  <Text style={styles.title}>Nguồn: </Text>
                  <Text style={styles.content}>{item?.donvi}</Text>
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
                      setPickOptionIndex({item: item, index: index});
                      setpickFileIndex(null);
                    }}
                    key={index}
                    style={{
                      marginRight: Dimension.setWidth(4.4),
                      paddingVertical: 3,
                      borderBottomWidth:
                        pickOptionIndex.index === index ? 2 : 0,
                      borderBottomColor:
                        pickOptionIndex.index === index
                          ? Colors.DEFAULT_GREEN
                          : '#fff',
                    }}>
                    <Text
                      style={{
                        fontFamily:
                          pickOptionIndex.index === index
                            ? Fonts.SF_SEMIBOLD
                            : Fonts.SF_REGULAR,
                        fontSize: Dimension.fontSize(16),
                        opacity: 0.8,
                        color:
                          pickOptionIndex.index === index
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
            data={document ? document : handlePickOption()}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <RenderDocument item={item} index={index} />
            )}
            initialNumToRender={10}
            windowSize={6}
            extraData={document}
            refreshing={refresh}
            onRefresh={handleRefresh}
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
              <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                  backgroundColor: '#fbfbfd',
                  borderRadius: 12,
                  marginHorizontal: Dimension.setWidth(0.6),
                  marginBottom: Dimension.setHeight(2),
                  paddingHorizontal: Dimension.setWidth(3),
                  paddingTop: Dimension.setHeight(3),
                  elevation: 5,
                  ...shadowIOS,
                }}>
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
                <View style={{paddingLeft: Dimension.setWidth(1)}}>
                  <Checkbox
                    value="signupdocument"
                    textAlign={'justify'}
                    onChange={e => {
                      setChecked(e);
                    }}>
                    <Text
                      style={{
                        fontSize: Dimension.fontSize(16),
                        fontFamily: Fonts.SF_REGULAR,
                      }}>
                      Tôi cam kết sử dụng tài liệu đúng mục đích
                    </Text>
                  </Checkbox>
                </View>

                <View style={{marginTop: Dimension.setHeight(1)}}>
                  <RegisterBtn
                    nameBtn={'Đăng kí'}
                    onEvent={handleRegisterDocument}
                  />
                </View>
              </KeyboardAwareScrollView>
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
    fontSize: Dimension.fontSize(15),
    ...fontDefault,
    color: '#2c336b',
  },

  content: {
    fontFamily: Fonts.SF_REGULAR,
    fontSize: Dimension.fontSize(14),
    marginLeft: Dimension.setWidth(1),
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
