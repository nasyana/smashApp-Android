/// This badge is named epic badge because it can be a target badge or an acquired badge.

/// displayTypes: selectedTarget || baseTarget || acquiredTarget

import React from 'react';
import { moment } from 'helpers/generalHelpers';;
import { LinearGradient } from 'expo-linear-gradient';
import {
   getPlayerChallengeData,
   convertEndDateKeyToMonth,
   getEndDateKey,
} from '../helpers/playersDataHelpers';
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
import { inject, observer } from 'mobx-react';
import { badgeLevelStyles, greyBadge, textShadow } from 'helpers/BadgeHelpers';
import SmartImage from './SmartImage/SmartImage';
import { daysInChallenge } from 'helpers/dateHelpers';
import { getCompareChallengeDaysSmashed } from 'helpers/generalHelpers';

const badgeLevels = ['beginner', 'expert', 'guru'];
const EpicBadge = (props) => {
   const {
      smashStore,
      playerChallenge,
      challengesStore,
      size = 110,
      challengeData,
      challenge = {},
   } = props;

   const { challengesHash } = challengesStore;

   const selectedLevel = parseInt(playerChallenge?.selectedLevel);
   const { kFormatter, stringLimit } = smashStore;
   const playerChallengeData = playerChallenge || {};
   // const challenge = playerChallenge
   //    ? challengesHash?.[playerChallenge?.challengeId]
   //    : challengesHash?.[challenge.id];
   const isDefaultBadge = playerChallenge == null;
   const levelIndex = parseInt(selectedLevel) - 1 || 0;
   const wonLevel = false;

   const selectedGradient = playerChallengeData?.selectedGradient || [
      '#192840',
      '#2440dd',
   ];

   let badgeAsset = Assets.icons.badge1;

   if (!playerChallenge) {
      badgeAsset = Assets.icons.badge0;
   }
   if (selectedLevel == 2) {
      badgeAsset = Assets.icons.badge2;
   }
   if (selectedLevel == 3) {
      badgeAsset = Assets.icons.badge3;
   }



   const selectedTarget = playerChallengeData?.selectedTarget || 0;

   // const endDateKey = getEndDateKey(playerChallenge);
   const endMonth =
      convertEndDateKeyToMonth(
         playerChallenge.endDateKey || challengeData?.endDateKey,
      ) || '';

   const compareArray = getCompareChallengeDaysSmashed(playerChallenge);
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
               borderWidth: 2,
               borderColor: '#fff',
            }}>
            {/* <SmartImage
               uri={
                  playerChallenge?.picture?.uri ||
                  'https://firebasestorage.googleapis.com/v0/b/smash-app-81ca9.appspot.com/o/00000smashAssets%2Fwhitebadge.png?alt=media&token=34a662e6-6625-401c-bae9-3bf2eb133597'
               }
               preview={playerChallenge?.picture?.preview}
               style={{
                  height: size,
                  width: size,
                  position: 'absolute',
                  opacity: 1,
                  borderRadius: size / 2,
               }}
            /> */}
            <LinearGradient
               // Background Linear Gradient
               start={{ x: 0.1, y: 0.1 }}
               colors={[
                  // 'transparent',
                  challenge?.colorStart || '#F62C62',
                  challenge?.colorStart || '#F62C62',
                  challenge?.colorEnd || '#F55A39',
                  challenge?.colorEnd || '#F55A39',
               ]}
               style={{
                  height: size,
                  width: size,
                  borderRadius: 50,
                  position: 'absolute',
                  opacity: 1,
               }}
            />
            <SmartImage
               uri={
                  challenge?.badgeDecorationPicture?.uri ||
                  'https://firebasestorage.googleapis.com/v0/b/smash-app-81ca9.appspot.com/o/00000smashAssets%2Fwhitebadge.png?alt=media&token=34a662e6-6625-401c-bae9-3bf2eb133597'
               }
               preview={challenge?.badgeDecorationPicture?.preview}
               style={{
                  height: size - 3,
                  width: size - 3,
                  position: 'absolute',
                  opacity: 1,
               }}
            />

            {/* <Ionicons
                name={
                   challenge.fitness
                      ? 'fitness-outline'
                      : 'checkmark-done-circle-outline'
                }
                color="white"
                style={{ fontSize: 20, marginBottom: -2, marginTop: -5 }}
             /> */}

            {playerChallenge?.selectedLevel && (
               <Text white R10 marginB-0 >
                  {badgeLevels?.[levelIndex]?.toUpperCase()}
               </Text>
            )}

            {playerChallenge?.active && !isNaN(compareArray?.[1]) ? (
               <Text
                  H2B
                  style={{
                     ...textShadow,
                     fontSize: 20,
                     letterSpacing: -1,
                     marginBottom: -6,
                     marginTop: 0,
                     color: badgeLevelStyles[levelIndex]?.targetColor,
                  }}>

                  {/* {compareArray?.[0]}/{compareArray?.[1]} */}
                  {daysInChallenge(playerChallenge) || '10'} DAYS
               </Text>
            ) : (
               <Text
                  H2B
                  center
                  style={{
                     // ...textShadow,
                     fontSize: 18,
                     letterSpacing: -1,
                     marginBottom: 0,
                     // marginTop: -5,
                     maxWidth: size - 10,
                     color: badgeLevelStyles[levelIndex]?.targetColor,
                  }}>


                     {challenge?.unit?.length > 0 && (challenge?.unit?.toUpperCase()) || 'POINTS'}
                  {/* {daysInChallenge(playerChallenge) || '10'} */}
               </Text>
            )}

            {false && <Text

               white
               R14
               style={{
                  // ...badgeLevelStyles[levelIndex]?.unitStyle,
                  // ...textShadow,
                  // color: isDefaultBadge
                  //    ? greyBadge?.targetColor
                  //    : badgeLevelStyles[levelIndex]?.unitColor,
               }}
            >
               {playerChallenge?.unit?.length > 0
                  ? playerChallenge?.unit?.toUpperCase()
                  : 'POINTS'}
            </Text>}
            {/* <View row marginT-4>
               {Array(parseInt(playerChallenge.selectedLevel || 1))
                  .fill(2)
                  .map((l) => (
                     <AntDesign name={'star'} size={8} color={'yellow'} />
                  ))}
            </View> */}
         </LinearGradient>
      </>
   );
};;;;;;;;

export default inject(
   'smashStore',
   'challengeArenaStore',
   'challengesStore',
)(observer(EpicBadge));
