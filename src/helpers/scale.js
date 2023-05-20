import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const WIDTH = width;
const HEIGHT = height;
const GUIDELINE_BASE_WIDTH = 375;
const GUIDELINE_BASE_HEIGHT = 667;

const scale = (size) => (WIDTH / GUIDELINE_BASE_WIDTH) * size;
const verticalScale = (size) => (HEIGHT / GUIDELINE_BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
   size + (scale(size) - size) * factor;

export {scale, verticalScale, moderateScale};
