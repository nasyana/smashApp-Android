import { View, Text, Dimensions, Platform } from 'react-native';
import React from 'react';
import { LinearGradient } from "expo-linear-gradient";
import scaleAccordingToDevice from 'config/scaleAccordingToDevice'
import { width, height } from "config/scaleAccordingToDevice";
import LottieAnimation from 'components/LottieAnimation';

const isAndroid = Platform.OS === 'android';
const LinearLoading = () => {
   return (
      <LinearGradient
         colors={['#FF6243', '#FF0072']}
         style={{
            height: isAndroid ? height + 60 : height + 60,
            width,
            alignItems: 'center',
            justifyContent: 'center',
            top: -30
         }}>
         <LottieAnimation
            autoPlay
            loop={true}
            style={{
               // width: 200,
               height: 100,
               zIndex: 99999,
            }}
            source={require('../../lotties/loader.json')}
         />
      </LinearGradient>
   );
};

export default LinearLoading;
