import { Dimensions, Platform } from "react-native";
import {
  getStatusBarHeight,
  getBottomSpace,
} from "react-native-iphone-x-helper";

export const { width, height } = Dimensions.get("window");
export const defaultHeight = 56;
export const heightHeader = defaultHeight + getStatusBarHeight(true);
const scale = 163 / 160;
export const widthImage = (width - 12) / 2;
export const heightImage = widthImage / scale;
export const ITEM_HEIGHT = Platform.OS === "ios" ? 232 : 260;
const scaleAccordingToDevice = (
  value: number,
  accordingHeight: boolean = false
) => {
  let ratio = width / 375;
  if (accordingHeight) {
    ratio = height / 812;
  }
  const convertValue = value * ratio;

  return convertValue;
};


export const largeDevice = height > 760;

export const scaleH = (value: number) => (height / 812) * value;
export const bottom = getBottomSpace() ? getBottomSpace() + 8 : 16;
export default scaleAccordingToDevice;

export const shadow = {
  shadowColor: "rgba(0,0,0,0.2)",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.18,
  shadowRadius: 1.0,
  elevation: 1,
  borderRadius: 6,
};

export const isSmall = width <= 400;
