import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');
const pixelRatio = PixelRatio.get();

const baseWidth = 375; // Design width of your app
const baseHeight = 812; // Design height of your app
const basePixelRatio = 2; // Base pixel ratio of your app

const widthRatio = width / baseWidth;
const heightRatio = height / baseHeight;
const ratio = Math.min(widthRatio, heightRatio);

const scale = pixelRatio / basePixelRatio;

const normalize = (size) => {
  const newSize = size * ratio * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const deviceType = (() => {
  if (width <= 320) {
    return 'small';
  }
  if (width <= 375) {
    return 'medium';
  }
  return 'large';
})();

export { normalize, deviceType,width, height };
