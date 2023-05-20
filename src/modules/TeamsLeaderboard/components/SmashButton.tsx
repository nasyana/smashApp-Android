import React from 'react'
import { Dimensions, TouchableOpacity, Modal, Platform } from 'react-native';
import { View, Colors, Assets, Image, Text } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import Routes from 'config/Routes';
import { inject, observer } from 'mobx-react';
import TakeVideo from '../../../modules/Smash/TakeVideo';
import LottieAnimation from 'components/LottieAnimation';
import { LinearGradient } from 'expo-linear-gradient';
const { width, height } = Dimensions.get('window');
const SmashButton = (props) => {
   const { challenge, masterIds, smashStore } = props;

   const { setMasterIdsToSmash, masterIdsToSmash } = smashStore;
   const { navigate } = useNavigation();

   const smashActivities = () => {
      setMasterIdsToSmash(masterIds);
   };
   // const goToCamera = () => { navigate(Routes.TakeVideo, { masterIds: challenge?.masterIds }) };
   if (Platform.OS === 'android') {
      return (
         <View
            style={{
               position: 'absolute',
               bottom: 40,
               width,
               alignItems: 'center',
               justifyContent: 'center',
            }}>
            <TouchableOpacity
               onPress={smashActivities}
               style={{
                  backgroundColor: '#111',
                  borderRadius: 70,
                  height: 70,
                  width: 70,
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               <LottieAnimation
                  autoPlay
                  loop={true}
                  style={{
                     width: 85,
                     height: 85,
                     zIndex: 99999,
                  }}
                  source={require('./lotties/smashButton.json')}
               />
               {/* <Image source={Assets.icons.smashIcon} style={{
                       width: 70,
                       height: 70,
                   }} /> */}
            </TouchableOpacity>

         </View>
      );
   }
   return (
      <View
         style={{
            position: 'absolute',
            bottom: 40,
            width,
            alignItems: 'center',
            justifyContent: 'center',
         }}>
         <TouchableOpacity onPress={smashActivities}>
            <LinearGradient
               colors={['#FF6243', '#FF0072']}
               style={{
                  backgroundColor: '#111',
                  borderRadius: 35,
                  height: 70,
                  width: 70,
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               <LottieAnimation
                  autoPlay
                  loop={true}
                  style={{
                     width: 85,
                     height: 85,
                     zIndex: 99999,
                  }}
                  source={require('./lotties/smashButton.json')}
               />
               {/* <Image source={Assets.icons.smashIcon} style={{

                    width: 70,
                    height: 70,

                }} /> */}
            </LinearGradient>
         </TouchableOpacity>

      
      </View>
   );
};

export default inject('smashStore', 'challengesStore')(observer(SmashButton));
