import React, { useEffect, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';

import { Dimensions, Platform } from 'react-native';

import { Assets, Image, Colors, View, Text } from 'react-native-ui-lib';
import { height, width } from 'config/scaleAccordingToDevice';
import LottieAnimation from 'components/LottieAnimation';

const positiveMessages = [
   "Focus on progress, not perfection.",
   "Believe in your abilities and trust your journey.",
   "Your smile is contagious. Keep spreading the joy.",
   "Stay true to who you are and embrace your uniqueness.",
   "Your success is just around the corner. Keep pushing forward.",
   "Never give up on your dreams. They're closer than you think.",
   "Today is a new opportunity to create something amazing.",
   "Life is a journey, not a destination. Enjoy the ride.",
   "Small steps can lead to big victories. Keep moving forward.",
   "You're making progress, even if you don't see it yet.",
   "You're stronger than you think. Keep fighting the good fight.",
   "Don't be afraid to take risks and step outside of your comfort zone.",
   "Every challenge you face is an opportunity to grow and learn.",
   "Your potential is limitless. Keep reaching for the stars.",
   "Every day is a chance to start fresh and create something beautiful.",
   "You're amazing just the way you are. Don't let anyone tell you otherwise.",
   "Happiness is a choice. Choose to be happy and spread the joy.",
   "You're capable of greatness. Keep working hard and believe in yourself.",
   "Every setback is a setup for a comeback. Keep persevering.",
   "You're one step closer to your goals. Keep up the good work.",
 ];
const isAndroid = Platform.OS === 'android';

const UniversalLoader = (props) => {

   const { smashStore } = props;
   const { universalLoading } = smashStore;

   if (!universalLoading) {
      return null;
   }

   // create function to return random positive message

   const getRandomPositiveMessage = () => {
      return positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
   };
   const initialLoading = universalLoading == 'initialloading';
   return (
      <View
         style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            bottom: -30,
            left: 0,
            width: width,
            height: Platform.OS === 'android' ? height + 60 : height + 60,
            backgroundColor: 'rgba(0,0,0,0.5)',
            // zIndex: 990000,
         }}>
         <LottieAnimation
            autoPlay
            loop={true}
            style={{
               width: 200,
               height: 120,
               zIndex: 99999,
            }}
            source={require('../lotties/loader.json')}
         />
         {initialLoading && <View style={{paddingHorizontal: width / 8}} marginT-16>
         <Text white R16 center>Getting your data for you... Won't be long.</Text>
         </View>}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
)(observer(UniversalLoader));
