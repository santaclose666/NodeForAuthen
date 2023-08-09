import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const setWidth = w => (width / 100) * w;
const setHeight = h => (height / 100) * h;

export default {setWidth, setHeight};
