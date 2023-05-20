import { View, Text } from 'react-native';
import React from 'react';
import LottieAnimation from 'components/LottieAnimation';
const FireLottie = () => {
   return (
      <LottieAnimation
         autoPlay
         loop={true}
         style={{
            // width: 200,
            height: 30,
            zIndex: 99999,
            top: 2,
            right: -2,
            position: 'absolute',
         }}
         source={require('../lotties/fire.json')}
      />
   );
};

export default FireLottie;
