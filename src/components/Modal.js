import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import Images from '../contants/Images';
import Fonts from '../contants/Fonts';
import Dimension from '../contants/Dimension';
import Colors from '../contants/Colors';
import {useSelector} from 'react-redux';
import {fontDefault, mainURL} from '../contants/Variable';
import {shadowIOS} from '../contants/propsIOS';

export const ApproveCancelModal = ({
  screenName,
  toggleApproveModal,
  setToggleApproveModal,
  checkInput,
  selectedItem,
  setSelectedItem,
  commnetInput,
  setCommentInput,
  reasonCancel,
  setReasonCancel,
  eventFunc,
}) => {
  const IFEEstaffs = useSelector(state => state.staffs?.staffs?.IFEEStaff);
  const avatar = IFEEstaffs.filter(item => item.id === selectedItem?.id_nhansu);

  return (
    <Modal
      isVisible={toggleApproveModal}
      animationIn="fadeInUp"
      animationInTiming={100}
      animationOut="fadeOutDown"
      animationOutTiming={100}
      avoidKeyboard={true}>
      <View
        style={{
          flex: 1,
          position: 'absolute',
          alignSelf: 'center',
          backgroundColor: checkInput ? '#def8ed' : '#f9dfe0',
          width: Dimension.setWidth(85),
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          paddingHorizontal: Dimension.setWidth(3),
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: Dimension.setHeight(1),
            borderBottomWidth: 0.8,
            borderBlockColor: Colors.INACTIVE_GREY,
            width: '100%',
            height: Dimension.setHeight(4.5),
          }}>
          {screenName === 'finishRequestWork' ? (
            <Text
              style={{
                fontFamily: Fonts.SF_BOLD,
                fontSize: Dimension.fontSize(20),
                color: checkInput ? '#57b85d' : '#f25157',
              }}>
              {checkInput ? 'Phê duyệt kết thúc' : 'Từ chối kết thúc'}
            </Text>
          ) : (
            <Text
              style={{
                fontFamily: Fonts.SF_BOLD,
                fontSize: Dimension.fontSize(20),
                color: checkInput ? '#57b85d' : '#f25157',
              }}>
              {checkInput ? 'Phê duyệt' : 'Từ chối'}
            </Text>
          )}
        </View>
        {screenName === 'registerOnleave' && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: Dimension.setHeight(1.5),
              paddingHorizontal: Dimension.setWidth(3),
            }}>
            <Image
              src={mainURL + avatar[0]?.path}
              style={{height: 55, width: 55, borderRadius: 50}}
            />
            <Text
              style={{
                fontSize: Dimension.fontSize(18),
                fontFamily: Fonts.SF_SEMIBOLD,
                ...fontDefault,
              }}>
              {selectedItem?.hoten}
            </Text>
          </View>
        )}
        {screenName === 'registerVehicle' && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: Dimension.setHeight(1.5),
              paddingHorizontal: Dimension.setWidth(3),
            }}>
            <Image
              src={mainURL + avatar[0]?.path}
              style={{height: 55, width: 55}}
            />
            <Text
              style={{
                marginLeft: Dimension.setWidth(3),
                fontSize: Dimension.fontSize(18),
                fontFamily: Fonts.SF_SEMIBOLD,
              }}>
              {selectedItem?.hoten}
            </Text>
          </View>
        )}
        {screenName === 'registerVehicalAndTicket' && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: Dimension.setHeight(1.5),
              paddingHorizontal: Dimension.setWidth(3),
              width: '100%',
            }}>
            <Image
              source={Images.workSchedule}
              style={{height: 55, width: 55}}
            />
            <Text
              style={{
                fontSize: Dimension.fontSize(18),
                fontFamily: Fonts.SF_SEMIBOLD,
              }}>
              {selectedItem?.chuongtrinh}
            </Text>
          </View>
        )}
        {screenName === 'registerVehicle' && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: Dimension.setHeight(1.5),
              paddingHorizontal: Dimension.setWidth(3),
              width: '100%',
            }}>
            <Image
              source={
                selectedItem?.loaixe?.includes('WAVE')
                  ? Images.motorbike
                  : Images.vehicles
              }
              style={{height: 55, width: 55}}
            />
            <Text
              style={{
                fontSize: Dimension.fontSize(18),
                fontFamily: Fonts.SF_SEMIBOLD,
              }}>
              {selectedItem?.loaixe}
            </Text>
          </View>
        )}

        {(screenName === 'registerWorkSchedule' ||
          screenName === 'finishRequestWork') && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: Dimension.setHeight(1.5),
              paddingHorizontal: Dimension.setWidth(3),
              width: '100%',
            }}>
            <Image
              source={Images.workSchedule}
              style={{height: 55, width: 55}}
            />
            <Text
              style={{
                fontSize: Dimension.fontSize(18),
                fontFamily: Fonts.SF_SEMIBOLD,
              }}>
              {selectedItem?.thuocchuongtrinh}
            </Text>
          </View>
        )}

        <View style={styles.containerEachLine}>
          <Image source={Images.comment} style={styles.iconic} />
          <TextInput
            multiline={true}
            placeholder={checkInput ? 'Nhận xét' : 'Lý do từ chối'}
            style={{
              backgroundColor: '#ffffff',
              paddingHorizontal: Dimension.setWidth(2),
              borderRadius: 10,
              fontFamily: Fonts.SF_REGULAR,
              width: '70%',
              height: Dimension.setHeight(5),
              maxHeight: Dimension.setHeight(9),
            }}
            onChangeText={e =>
              checkInput ? setCommentInput(e) : setReasonCancel(e)
            }
            value={checkInput ? commnetInput : reasonCancel}
          />
          <TouchableOpacity
            onPress={eventFunc}
            style={{
              backgroundColor: '#d9eafa',
              padding: 6,
              marginLeft: Dimension.setWidth(1.6),
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image source={Images.send} style={{width: 25, height: 25}} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            setSelectedItem(null);
            setToggleApproveModal(false);
          }}
          style={{position: 'absolute', right: '5%', top: '5%'}}>
          <Image source={Images.minusclose} style={styles.btnModal} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export const ConfirmModal = ({
  toggleModal,
  setToggleModal,
  item,
  status,
  handleApprove,
  handleCancel,
}) => {
  const approveMess = 'Chắc chắn xác nhận phê duyệt đăng kí?';
  const cancelMess = 'Chắc chắn xác nhận từ chối đăng kí?';

  return (
    <Modal
      isVisible={toggleModal}
      animationIn="fadeInUp"
      animationInTiming={100}
      animationOut="fadeOutDown"
      animationOutTiming={100}
      avoidKeyboard={true}>
      <View
        style={{
          flex: 1,
          position: 'absolute',
          alignSelf: 'center',
          backgroundColor: status ? '#def8ed' : '#f9dfe0',
          width: Dimension.setWidth(85),
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          paddingHorizontal: Dimension.setWidth(3),
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: Dimension.setHeight(1),
            borderBottomWidth: 0.8,
            borderBlockColor: Colors.INACTIVE_GREY,
            width: '100%',
            height: Dimension.setHeight(4.5),
          }}>
          <Text
            style={{
              fontFamily: Fonts.SF_BOLD,
              fontSize: Dimension.fontSize(20),
              color: status ? '#57b85d' : '#f25157',
            }}>
            {status ? 'Phê duyệt' : 'Từ chối'}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: Dimension.setHeight(1.5),
            paddingHorizontal: Dimension.setWidth(3),
            width: '100%',
          }}>
          <Image source={Images.vehicles} style={{height: 55, width: 55}} />
          <Text
            style={{
              marginLeft: Dimension.setWidth(3),
              fontSize: Dimension.fontSize(18),
              fontFamily: Fonts.SF_SEMIBOLD,
            }}>
            {status ? approveMess : cancelMess}
          </Text>
        </View>

        <View
          style={[
            styles.containerEachLine,
            {width: Dimension.setWidth(56), justifyContent: 'space-between'},
          ]}>
          <TouchableOpacity
            onPress={() => {
              status ? handleApprove(item) : handleCancel(item);
            }}
            style={[
              styles.confirmBtn,
              {borderColor: !status ? '#f25157' : '#57b85d'},
            ]}>
            <Text
              style={[
                styles.textConfirm,
                {color: !status ? '#f25157' : '#57b85d'},
              ]}>
              Xác nhận
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setToggleModal(false);
            }}
            style={[styles.confirmBtn, {borderColor: '#f0b263'}]}>
            <Text style={[styles.textConfirm, {color: '#f0b263'}]}>Hủy bỏ</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            setToggleModal(false);
          }}
          style={{position: 'absolute', right: '5%', top: '5%'}}>
          <Image source={Images.minusclose} style={styles.btnModal} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export const WarningModal = ({
  toggleModal,
  setToggleModal,
  item,
  reasonInput,
  setReasonInput,
  handleWarning,
}) => {
  return (
    <Modal
      isVisible={toggleModal}
      animationIn="fadeInUp"
      animationInTiming={100}
      animationOut="fadeOutDown"
      animationOutTiming={100}
      avoidKeyboard={true}>
      <View
        style={{
          flex: 1,
          position: 'absolute',
          alignSelf: 'center',
          width: Dimension.setWidth(85),
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          paddingHorizontal: Dimension.setWidth(3),
          backgroundColor: '#e6d2c0',
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: Dimension.setHeight(1),
            borderBottomWidth: 0.8,
            borderBlockColor: Colors.INACTIVE_GREY,
            width: '100%',
            height: Dimension.setHeight(4.5),
          }}>
          <Text
            style={{
              fontFamily: Fonts.SF_BOLD,
              fontSize: Dimension.fontSize(20),
              color: '#f0b263',
            }}>
            Cảnh báo
          </Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: Dimension.setHeight(1.5),
            paddingHorizontal: Dimension.setWidth(3),
            width: '100%',
          }}>
          <Image
            src={mainURL + item?.path}
            style={{height: 55, width: 55, borderRadius: 50}}
          />
          <Text
            style={{
              fontSize: Dimension.fontSize(17),
              fontFamily: Fonts.SF_MEDIUM,
              ...fontDefault,
              marginBottom: Dimension.setHeight(0.6),
            }}>
            {item?.name}
          </Text>
          <Text
            style={{
              fontSize: Dimension.fontSize(16),
              fontFamily: Fonts.SF_MEDIUM,
              ...fontDefault,
            }}>
            {item?.content}
          </Text>
        </View>

        <View style={styles.containerEachLine}>
          <Image source={Images.comment} style={styles.iconic} />
          <TextInput
            multiline={true}
            style={{
              backgroundColor: '#ffffff',
              paddingHorizontal: Dimension.setWidth(2),
              borderRadius: 10,
              fontFamily: Fonts.SF_REGULAR,
              width: '70%',
              height: Dimension.setHeight(6),
            }}
            onChangeText={e => setReasonInput(e)}
            value={reasonInput}
          />
          <TouchableOpacity
            onPress={() => {
              handleWarning(item.id, reasonInput);
            }}
            style={{
              backgroundColor: '#d9eafa',
              padding: 6,
              marginLeft: Dimension.setWidth(1.6),
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={Images.send}
              style={{
                width: 25,
                height: 25,
              }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            setToggleModal(false);
          }}
          style={{position: 'absolute', right: 8, top: 8}}>
          <Image source={Images.minusclose} style={styles.btnModal} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export const DisplayNotificationModal = ({
  toggleModal,
  setToggleModal,
  item,
}) => {
  const filterTime = item?.giotao.slice(0, 5);
  const halfDay = item?.giotao.slice(0, 2) > 12 ? 'pm' : 'am';

  return (
    <Modal
      isVisible={toggleModal}
      animationIn="fadeInUp"
      animationInTiming={100}
      animationOut="fadeOutDown"
      animationOutTiming={100}
      avoidKeyboard={true}>
      <View
        style={{
          flex: 1,
          position: 'absolute',
          alignSelf: 'center',
          width: Dimension.setWidth(85),
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          paddingHorizontal: Dimension.setWidth(3),
          backgroundColor: 'rgb(102, 153, 153)',
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: Dimension.setHeight(1),
            borderBottomWidth: 0.8,
            borderBlockColor: Colors.INACTIVE_GREY,
            width: '100%',
            height: Dimension.setHeight(4.5),
          }}>
          <Text
            style={{
              fontFamily: Fonts.SF_BOLD,
              fontSize: Dimension.fontSize(20),
              ...fontDefault,
            }}>
            Chi tiết thông báo
          </Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: Dimension.setHeight(1.5),
            paddingHorizontal: Dimension.setWidth(3),
            width: '100%',
          }}>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <View style={{elevation: 5, ...shadowIOS, borderRadius: 50}}>
              <Image
                src={mainURL + item?.avatar}
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 50,
                  marginRight: Dimension.setWidth(2),
                }}
              />
            </View>
            <Text
              style={{
                fontSize: Dimension.fontSize(17),
                fontFamily: Fonts.SF_SEMIBOLD,
                color: '#fff',
              }}>
              {item?.nguoigui}
            </Text>
          </View>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <Image
              source={Images.timecreate}
              style={{
                width: 18,
                height: 18,
                tintColor: '#59e9f1ff',
                marginRight: Dimension.setWidth(1),
              }}
            />
            <Text
              style={{
                fontSize: Dimension.fontSize(15),
                fontFamily: Fonts.SF_REGULAR,
                color: '#d5f0f9ff',
              }}>
              {`${filterTime} ${halfDay}`}
            </Text>
          </View>
        </View>

        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            paddingVertical: Dimension.setHeight(1.5),
            paddingHorizontal: Dimension.setWidth(3),
            width: '100%',
          }}>
          <Text
            style={{
              fontSize: Dimension.fontSize(17),
              fontFamily: Fonts.SF_SEMIBOLD,
              ...fontDefault,
              textAlign: 'left',
            }}>
            {item?.tieude}
          </Text>
          <Text
            style={{
              fontSize: Dimension.fontSize(15),
              fontFamily: Fonts.SF_REGULAR,
              color: '#fff',
              textAlign: 'left',
            }}>
            {item?.noidung}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setToggleModal(false);
          }}
          style={{position: 'absolute', right: 8, top: 8}}>
          <Image source={Images.minusclose} style={styles.btnModal} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export const CheckDownLoadModal = ({
  navigation,
  toggleModal,
  setToggleModal,
  handlePresentModalPress,
}) => {
  return (
    <Modal
      isVisible={toggleModal}
      animationIn="fadeInUp"
      animationInTiming={100}
      animationOut="fadeOutDown"
      animationOutTiming={100}
      avoidKeyboard={true}>
      <View
        style={{
          flex: 1,
          position: 'absolute',
          alignSelf: 'center',
          width: Dimension.setWidth(85),
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          paddingHorizontal: Dimension.setWidth(3),
          backgroundColor: '#cce0f2',
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: Dimension.setHeight(1),
            borderBottomWidth: 0.8,
            borderBlockColor: Colors.INACTIVE_GREY,
            width: '100%',
            height: Dimension.setHeight(4.5),
          }}>
          <Text
            style={{
              fontFamily: Fonts.SF_BOLD,
              fontSize: Dimension.fontSize(20),
              ...fontDefault,
              color: '#e86243',
            }}>
            Bạn chưa đăng nhập!
          </Text>
        </View>

        <Text
          style={{
            textAlign: 'center',
            fontFamily: Fonts.SF_MEDIUM,
            fontSize: Dimension.fontSize(16),
            ...fontDefault,
          }}>
          Nhấn đăng kí tài liệu để nhận đường dẫn tải file!
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Dimension.setHeight(1.6),
            marginTop: Dimension.setHeight(1),
          }}>
          <TouchableOpacity
            onPress={() => {
              setToggleModal(false);
              handlePresentModalPress();
            }}
            style={[styles.btnLoginRegister, {backgroundColor: '#d4994e'}]}>
            <Text style={styles.textLoginRegister}>Đăng kí tài liệu</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            setToggleModal(false);
          }}
          style={{position: 'absolute', right: 8, top: 8}}>
          <Image source={Images.minusclose} style={styles.btnModal} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerEachLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Dimension.setHeight(1.3),
  },

  confirmBtn: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f25157',
    paddingVertical: Dimension.setHeight(0.5),
    paddingHorizontal: Dimension.setWidth(2),
    width: Dimension.setWidth(25),
  },
  textConfirm: {
    fontSize: Dimension.fontSize(16),
    fontFamily: Fonts.SF_MEDIUM,
  },

  iconic: {
    height: 33,
    width: 33,
    marginRight: Dimension.setWidth(2),
  },

  btnModal: {
    width: 28,
    height: 28,
  },

  lineContainerModal: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  itemContainerModal: {
    paddingVertical: Dimension.setHeight(1),
    paddingHorizontal: Dimension.setWidth(2),
  },

  titleModal: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: Dimension.fontSize(13),
  },

  dateModalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: Dimension.setWidth(2.2),
    paddingVertical: Dimension.setHeight(0.8),
    elevation: 5,
    ...shadowIOS,
    width: Dimension.setWidth(35),
  },

  contentModal: {
    fontFamily: Fonts.SF_SEMIBOLD,
    fontSize: Dimension.fontSize(15),
  },

  imgModalContainer: {
    backgroundColor: '#ed735f',
    padding: Dimension.setWidth(1.1),
    borderRadius: 8,
  },

  imgDate: {
    height: 17,
    width: 17,
    tintColor: '#ffffff',
  },

  btnLoginRegister: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: Dimension.boxHeight(40),
    width: '39%',
    paddingHorizontal: Dimension.setWidth(2),
  },

  textLoginRegister: {
    fontFamily: Fonts.SF_MEDIUM,
    color: '#fff',
    fontSize: Dimension.fontSize(15),
    textAlign: 'center',
  },
});
