import Dimension from './Dimension';
import Colors from './Colors';

export const shadowIOS = {
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: 0.3,
  shadowRadius: 4,
  shadowColor: 'black',
};

export const calendarView = {
  position: 'absolute',
  top: Dimension.setHeight(16),
  alignSelf: 'center',
  zIndex: 999,
  backgroundColor: 'rgba(219, 231, 240, 1)',
  borderWidth: 1,
  borderColor: Colors.INACTIVE_GREY,
  padding: 15,
  borderRadius: 15,
};
