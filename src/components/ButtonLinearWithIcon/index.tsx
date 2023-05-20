import React from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Icon, Text, View } from 'react-native-ui-lib';
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
const ButtonLinearWithIcon = ({
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
               borderWidth: 0,
               borderColor: color ? color : bordered ? '#FF6243' : '#fff',
               width: full ? '100%' : 'auto',
               ...style,
               backgroundColor: '#eee'
            },
         ]}
         onPress={onPress}
         centerV>
         <View
            row
            spread
            centerV
            paddingL-32
            paddingR-6
            paddingV-6

         >
            <View centerV>
               <Text
                  M16
               >
                  {title}
               </Text>
            </View>
            <LinearGradient
               style={{ borderRadius: 22.5, width: 45, height: 45, justifyContent: 'center', alignItems: 'center' }}
               colors={
                  ['#FF6243', '#FF0072']
               }
               start={{
                  x: 0,
                  y: 1,
               }}
               end={{
                  x: 1,
                  y: 1,
               }}
            >
               <View style={{ borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>{icon && icon}</View>
            </LinearGradient>

         </View>
      </Ripple>
   );
};

export default ButtonLinearWithIcon;

const styles = StyleSheet.create({
   container: {
      width: width - 48,
      marginHorizontal: 24,
      // height: 50,
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
