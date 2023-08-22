import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import Images from '../contants/Images';
import Fonts from '../contants/Fonts';
import Dimension from '../contants/Dimension';
import Colors from '../contants/Colors';
import {useSelector} from 'react-redux';
import {mainURL} from '../contants/Variable';

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
  const staffs = useSelector(state => state.staffs?.staffs?.allStaff);
  const avatar = staffs.filter(
    item => item.id === selectedItem?.id_nhansu && item.tendonvi === 'VST',
  );

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
          <Text
            style={{
              fontFamily: Fonts.SF_BOLD,
              fontSize: 20,
              color: checkInput ? '#57b85d' : '#f25157',
            }}>
            {checkInput ? 'Phê duyệt' : 'Từ chối'}
          </Text>
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
              style={{height: 55, width: 55}}
            />
            <Text
              style={{
                marginLeft: Dimension.setWidth(3),
                fontSize: 18,
                fontFamily: Fonts.SF_SEMIBOLD,
              }}>
              {selectedItem?.hoten}
            </Text>
          </View>
        )}
        {screenName === 'registerTicket' && (
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
                marginLeft: Dimension.setWidth(3),
                fontSize: 18,
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
                marginLeft: Dimension.setWidth(3),
                fontSize: 18,
                fontFamily: Fonts.SF_SEMIBOLD,
              }}>
              {selectedItem?.loaixe}
            </Text>
          </View>
        )}

        {screenName === 'registerWorkSchedule' && (
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
                marginLeft: Dimension.setWidth(3),
                fontSize: 18,
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

const styles = StyleSheet.create({
  containerEachLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Dimension.setHeight(1.3),
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
});
