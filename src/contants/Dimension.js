import {Dimensions} from 'react-native';

const standarWidth = 411;
const standarHeight = 867;
const {width, height} = Dimensions.get('window');

const boxWidth = w => (w / standarWidth) * width;
const boxHeight = h => (h / standarHeight) * height;
const fontSize = s => (s / standarWidth) * width;
const setWidth = w => (width / 100) * w;
const setHeight = h => (height / 100) * h;

export default {boxWidth, boxHeight, fontSize, setWidth, setHeight};
