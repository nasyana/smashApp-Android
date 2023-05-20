import { useNavigation } from "@react-navigation/native";
import { width } from "config/scaleAccordingToDevice";
import React, { ReactElement, ReactNode, useCallback, useState } from 'react';
import { Platform, StyleSheet, ViewStyle } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { View, Colors, Text, Button, Assets } from 'react-native-ui-lib';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Routes from '../../config/Routes';
interface Props {
   btnLeft?: ReactNode;
   btnRight?: ReactNode;
   title: string;
   back?: boolean;
   style?: ViewStyle;
   color?: string;
   titleColor?: string;
   iconSource?: any;
   noShadow?: boolean;
   customRight?: ReactElement;
}
const Header = ({
   btnLeft,
   btnRight,
   title,
   back,
   backFn = false,
   style,
   color,
   iconSource,
   noShadow,
   customRight,
   dark = false
}: Props) => {
   const { goBack } = useNavigation();
   const [pressedGoBack, setPressedGoBack] = useState(false);
   const goBackOnce = () => {

      setPressedGoBack(true);

      if (!pressedGoBack) {
         goBack();
      }
   };

   const insets = useSafeAreaInsets();

   const isIOS  = Platform.OS === 'ios';

   const iosStyle = isIOS ? {  backgroundColor: dark ? Colors.darkBg : '#fff',paddingTop: insets.top - 16, height: getStatusBarHeight(true) + 16 + insets.top } : {};
  
   const left = useCallback(() => {
      return back ? (
         <Button
            iconSource={iconSource || Assets.icons.ic_back}
            link
            color={color || Colors.color28}
            onPress={backFn ? backFn : goBackOnce}
            // onPress={backFn}
            style={{
               justifyContent: 'flex-start',
               paddingVertical: 32,
               paddingRight: 16,
               borderRightWidth: 0,
            }}
         />
      ) : (
         btnLeft
      );
   }, [btnLeft, pressedGoBack]);
   const { navigate } = useNavigation();
   return (
      <View
         paddingH-16
         style={[
            styles.container,
            style,
            iosStyle,

            {
               shadowColor: noShadow ? 'transparent' : '#000',
               elevation: noShadow ? 0 : 2,
            },
         ]}>
         <View>{left()}</View>
         <View flex centerH centerV paddingR-16>
            <Text M18 color={color || Colors.color28}>
               {title}
            </Text>
         </View>
         {customRight ? customRight : <View>{btnRight}</View>}
      </View>
   );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    shadowColor: "rgba(0,0,0,0.02)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 2,
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? getStatusBarHeight(true) + 10 : getStatusBarHeight(true),
    height: Platform.OS === "android" ? getStatusBarHeight(true) + 44 : getStatusBarHeight(true) + 44,
    backgroundColor: Colors.white,
    flexDirection: "row",
    zIndex: 100,
    alignItems: "center",
    width: width,
  },
});
