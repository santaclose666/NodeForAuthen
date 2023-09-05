import {Dimensions} from 'react-native';

const standarWidth = 412;
const standarHeight = 868;
const {width, height} = Dimensions.get('window');

const boxWidth = w => (w / standarWidth) * width;
const boxHeight = h => (h / standarHeight) * height;
const fontSize = s => (s / standarWidth) * width;
const setWidth = w => (width / 100) * w;
const setHeight = h => (height / 100) * h;

export default {boxWidth, boxHeight, fontSize, setWidth, setHeight};
