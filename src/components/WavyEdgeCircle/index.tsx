import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from 'react-native-ui-lib';

interface WavyEdgeCircleProps {
   children?: JSX.Element;
}
const _gradientColors = ['#D81159', Colors.buttonLink];

const WavyEdgeCircle = ({ children }: WavyEdgeCircleProps) => {
   return (
      <View
      // style={styles.eightPointBurst}
      >
         {/* <LinearGradient
            colors={_gradientColors}
            start={{ x: 0.6, y: 0 }}
            style={styles.eightPointBurst20}
         />
         <LinearGradient
            colors={_gradientColors}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.eightPointBurst155}
         />
         <LinearGradient
            colors={_gradientColors}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.eightPointBurst270}
         />
         <View style={{ position: 'absolute', top: 2.5, left: 2.5 }}>
            <View style={styles.eightPointBurst20BB} />
            <View style={styles.eightPointBurst155BB} />
            <View style={styles.eightPointBurst270BB} />

            <View style={styles.eightPointBurst20CC} />
            <View style={styles.eightPointBurst155CC} />
            <View style={styles.eightPointBurst270CC} />
         </View> */}
         <View style={styles.children}>{children}</View>
      </View>
   );
};

export default React.memo(WavyEdgeCircle);

const widthHeight = 70;
const styles = StyleSheet.create({
   eightPointBurst: {
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 2,
      alignItems: 'center',
      justifyContent: 'center',
   },
   eightPointBurst20: {
      width: widthHeight,
      height: widthHeight,
      backgroundColor: Colors.buttonLink,
      borderRadius: 15,
      transform: [{ rotate: '20deg' }],
   },
   eightPointBurst155: {
      width: widthHeight,
      height: widthHeight,
      borderRadius: 15,
      position: 'absolute',
      backgroundColor: Colors.buttonLink,
      top: 0,
      left: 0,
      transform: [{ rotate: '155deg' }],
   },
   eightPointBurst270: {
      width: widthHeight,
      height: widthHeight,
      borderRadius: 15,
      position: 'absolute',
      backgroundColor: Colors.buttonLink,
      top: 0,
      left: 0,
      transform: [{ rotate: '270deg' }],
   },
   children: {
      position: 'absolute',
      top: 5,
      left: 15,
      alignItems: 'center',
      justifyContent: 'center',
   },
   eightPointBurst20BB: {
      width: widthHeight - 5,
      height: widthHeight - 5,
      position: 'absolute',
      borderRadius: 12,
      borderColor: 'white',
      borderWidth: 2,
      transform: [{ rotate: '20deg' }],
   },
   eightPointBurst20CC: {
      width: widthHeight - 9,
      height: widthHeight - 9,
      position: 'absolute',
      borderRadius: 12,
      borderColor: 'white',
      borderWidth: 0,
      backgroundColor: Colors.buttonLink,
      left: 2,
      top: 2,
      transform: [{ rotate: '20deg' }],
   },
   eightPointBurst155BB: {
      width: widthHeight - 5,
      height: widthHeight - 5,
      borderRadius: 12,
      position: 'absolute',
      borderColor: 'white',
      borderWidth: 2,
      top: 0,
      left: 0,
      transform: [{ rotate: '155deg' }],
   },
   eightPointBurst155CC: {
      width: widthHeight - 9,
      height: widthHeight - 9,
      position: 'absolute',
      borderRadius: 12,
      borderColor: 'white',
      borderWidth: 0,
      backgroundColor: Colors.buttonLink,
      left: 2,
      top: 2,
      transform: [{ rotate: '155deg' }],
   },
   eightPointBurst155CC: {
      width: widthHeight - 9,
      height: widthHeight - 9,
      position: 'absolute',
      borderRadius: 12,
      borderColor: 'white',
      borderWidth: 0,
      backgroundColor: Colors.buttonLink,
      left: 2,
      top: 2,
      transform: [{ rotate: '270deg' }],
   },
});
