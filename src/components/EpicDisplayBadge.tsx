/// This badge is named epic badge because it can be a target badge or an acquired badge.

/// displayTypes: selectedTarget || baseTarget || acquiredTarget

import React from 'react';
import { moment } from 'helpers/generalHelpers';;
import { LinearGradient } from 'expo-linear-gradient';
import { getPlayerChallengeData } from '../helpers/playersDataHelpers';
import {
   MaterialCommunityIcons,
   AntDesign,
   Ionicons,
   Feather,
} from '@expo/vector-icons';
import {
   View,
   Image,
   Text,
   Colors,
   Assets,
   ProgressBar,
   TouchableOpacity,
   Button,
} from 'react-native-ui-lib';
import { badgeLevelStyles, greyBadge } from 'helpers/BadgeHelpers';
import SmartImage from './SmartImage/SmartImage';
const EpicDisplayBadge = (props) => {
   const {
      kFormatter,
      playerChallenge,
      challenge,
      endMonth,
      displayLevel,
      size,
      textShadow,
      smashStore,
   } = props;

   const badgeLevel = displayLevel || 1;
   const selectedLevel = badgeLevel;
   const { settings } = smashStore;

   const { badge: _badge = {} } = settings;
   const playerChallengeData = playerChallenge || {};

   const selectedGradient = playerChallengeData?.selectedGradient || [
      '#192840',
      '#2440dd',
   ];

   let badgeAsset = Assets.icons.whitebadge;

   if (!selectedLevel) {
      badgeAsset = Assets.icons.badge0;
   }
   if (selectedLevel == 2) {
      badgeAsset = Assets.icons.badge2;
   }
   if (selectedLevel == 3) {
      badgeAsset = Assets.icons.badge3;
   }

 
   return (
      <>
         <LinearGradient
            start={{ x: 0.6, y: 0.1 }}
            colors={['transparent', 'transparent'] || selectedGradient}
            style={{
               width: size,
               height: size,
               borderRadius: size / 2,
               alignItems: 'center',
               justifyContent: 'center',
               flex: 1,
            }}>
            <SmartImage
               uri={challenge?.picture?.uri}
               preview={challenge?.picture?.preview}
               style={{
                  height: size,
                  width: size,
                  position: 'absolute',
                  borderRadius: size / 2,
                  borderWidth: 2,
                  borderColor: '#eee',
               }}
            />

            <LinearGradient
               start={{ x: 0.1, y: 0.1 }}
               colors={[
                  'transparent',
                  challenge?.colorStart || '#F62C62',
                  challenge?.colorStart || '#F62C62',
                  challenge?.colorEnd || '#F55A39',
                  challenge?.colorEnd || '#F55A39',
               ]}
               style={{
                  height: size,
                  width: size,
                  borderRadius: size / 2,
                  position: 'absolute',
                  opacity: 0.75,
               }}
            />
            <Image
               source={Assets.bg.whitebadge}
               marginT-8
               style={{
                  height: size - 3,
                  width: size - 3,
                  position: 'absolute',
                  opacity: 1,
               }}
            />
            {/* <SmartImage
               uri={_badge?.picture?.uri || ''}
               preview={_badge?.picture?.preview || ''}
               style={{
                  height: size - 3,
                  width: size - 3,
                  position: 'absolute',
                  opacity: 1,
               }}
            /> */}

            <Text
               B18
               center
               style={{
                  fontSize: 12,
                  // lineHeight: 20,
                  letterSpacing: -1,
                  color: Colors.buttonLink,
                  marginBottom: 0,
                  color: '#fff',
                  ...textShadow,
               }}>
               {challenge?.unit?.length > 0
                  ? challenge?.unit?.toUpperCase()
                  : 'POINTS'}
               {/* {kFormatter(parseInt((selectedTarget / 31) * dayDuration))} */}
            </Text>
            {/* <Text
                  style={{
                     ...badgeLevelStyles[selectedLevel - 1]?.unitStyle,
                     color: '#fff',
                     ...textShadow,
                  }}>
                  {challenge?.unit?.length > 0
                     ? challenge?.unit?.toUpperCase()
                     : 'POINTS'}
               </Text> */}
         </LinearGradient>
      </>
   );
};

export default EpicDisplayBadge;
