import React from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Icon, Text } from 'react-native-ui-lib';
import Ripple from 'react-native-material-ripple';
import { LinearGradient } from 'expo-linear-gradient';
import { width } from 'config/scaleAccordingToDevice';
interface Props {
   title: string;
   onPress: () => void;
   style?: ViewStyle;
   colors?: string[];
   styleText?: TextStyle;
   styleLinear?: ViewStyle;
}
const ButtonLinear = ({
   colors,
   color,
   title,
   onPress,
   style,
   styleText,
   styleSubText,
   styleLinear,
   bordered,
   minus,
   subTitle,
   icon = false,
   full = false,
}: Props) => {
   return (
      <Ripple
         style={[
            styles.container,
            {
               borderWidth: bordered || color ? 1 : 0,
               borderColor: color ? color : bordered ? '#FF6243' : '#fff',
               width: full ? '100%' : 'auto',
               ...style,
            },
         ]}
         onPress={onPress}>
         <LinearGradient
            colors={
               bordered
                  ? ['transparent', 'transparent']
                  : colors || ['#FF6243', '#FF0072']
            }
            start={{
               x: 0,
               y: 1,
            }}
            end={{
               x: 1,
               y: 1,
            }}
            style={[styles.linear, styleLinear]}>
            <Text
               B14
               contentW
               uppercase
               style={[
                  styleText,
                  { color: color ? color : bordered ? '#FF6243' : '#fff' },
               ]}>
               {title} {icon && icon}
            </Text>
            {subTitle && (
               <Text
                  R10
                  contentW
                  uppercase
                  style={[
                     styleSubText,
                     { color: color ? color : bordered ? '#FF6243' : '#fff' },
                  ]}>
                  {subTitle}
               </Text>
            )}
         </LinearGradient>
      </Ripple>
   );
};

export default ButtonLinear;

const styles = StyleSheet.create({
  container: {
    width: width - 48,
    marginHorizontal: 24,
    height: 50,
    borderRadius: 100,
    overflow: "hidden",
  },
  linear: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 16,
  },
});
