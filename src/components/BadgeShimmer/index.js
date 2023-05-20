import React, { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
   Easing,
   useAnimatedStyle,
   useSharedValue,
   withRepeat,
   withTiming,
} from 'react-native-reanimated';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const styleProps = { height: 100, width: 100, borderRadius: 50 };

export default function Shimmer(props) {
   const { width } = useWindowDimensions();
   const animTranslateX = useSharedValue(-100);

   const animatedStyle = useAnimatedStyle(() => ({
      opacity: 0.7,
      transform: [{ translateX: animTranslateX.value }],
   }));

   useEffect(() => {
      animTranslateX.value = withRepeat(
         withTiming(1000, { duration: 1500, easing: Easing.linear }),
         -1,
      );
   }, [animTranslateX]);

   return (
      <View style={[styles.container, { ...props.style }]}>
         <AnimatedLinearGradient
            colors={['#DCE6EE', '#ffffff', '#ffffff', '#DCE6EE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFill, animatedStyle]}
         />
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      backgroundColor: 'transparent',
      borderColor: '#ffffff',
      overflow: 'hidden',
   },
});
