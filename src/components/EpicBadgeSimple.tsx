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
import { dayNumberOfChallenge, daysInChallenge } from 'helpers/dateHelpers';
import { getCompareChallengeDaysSmashed, hexToRgbA } from 'helpers/generalHelpers';
import CircularProgressBar from './CircularProgressBar';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const badgeLevels = ['beginner', 'expert', 'guru'];
const EpicBadge = (props) => {
   const {
      smashStore,
      playerChallenge,
      challengesStore,
      size = 90,
      challengeData,
      challenge = {},
   } = props;

   const { challengesHash } = challengesStore;

   const selectedLevel = parseInt(playerChallenge?.selectedLevel);
   const { kFormatter, journeySettings } = smashStore;

   const { durations = {} } = journeySettings;

   const durationsArray = Object.values(durations).map((d) => d.duration);
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

   const challengeProgress = parseInt(parseInt(dayNumberOfChallenge(playerChallenge) || 0) / parseInt(compareArray?.[1] || 0) * 100);


   const startColorFaded = hexToRgbA(playerChallenge?.colorStart, 0.8);
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

            <LinearGradient
               // Background Linear Gradient
               start={{ x: 0.1, y: 0.1 }}
               colors={[
                  // 'transparent',
                  // playerChallenge?.colorStart || '#F62C62',
                  // playerChallenge?.colorStart || '#F62C62',
                  // startColorFaded || '#F62C62',

                  playerChallenge?.colorStart || '#F62C62',
                  playerChallenge?.colorStart || '#F62C62',
                  startColorFaded || '#F62C62',
                  startColorFaded || '#F62C62',
                  // playerChallenge?.colorEnd || '#F55A39',
                  // playerChallenge?.colorEnd || '#F55A39',
               ]}
               style={{
                  height: size,
                  width: size,
                  borderRadius: 50,
                  position: 'absolute',
                  opacity: 1,
               }}
            />


            <AnimatedCircularProgress

               size={size - 16}
               fill={challengeProgress}
               rotation={0}
               width={3}
               style={{ marginHorizontal: 2, position: 'absolute', }}
               fillLineCap="round"
               tintColor={'#fff'} />




            {/* {playerChallenge?.selectedLevel && (
               <Text white R10 marginB-0 style={{ ...textShadow }}>
                  {badgeLevels?.[levelIndex]?.toUpperCase()}
               </Text>
            )} */}

            {playerChallenge?.active && !isNaN(compareArray?.[1]) ? (
               <Text
                  H2B
                  style={{
                     // ...textShadow,
                     fontSize: 20,
                     letterSpacing: -1,
                     marginBottom: -6,
                     marginTop: 0,
                     color: badgeLevelStyles[levelIndex]?.targetColor,
                  }}>

                  {/* {compareArray?.[0]}/{compareArray?.[1]} */}
                  DAY
               </Text>
            ) : (
               <Text
                  H2B
                  center
                  style={{
                     ...textShadow,
                     fontSize: 16,
                     letterSpacing: -1,
                     marginBottom: 10,
                     marginTop: -5,
                     color: badgeLevelStyles[levelIndex]?.targetColor,
                  }}>
                  {/* {challenge?.unit?.length > 0 && challenge?.unit?.toUpperCase() || 'Points'} */}
                  {/* {daysInChallenge(playerChallenge) || '10'} */}
                     {/* {compareArray?.[0]} */}
                     {dayNumberOfChallenge(playerChallenge)} /{compareArray?.[1]}
               </Text>
            )}

            <Text

               white
               B18
               style={{
                  // ...badgeLevelStyles[levelIndex]?.unitStyle,
                  // ...textShadow,
                  // color: isDefaultBadge
                  //    ? greyBadge?.targetColor
                  //    : badgeLevelStyles[levelIndex]?.unitColor,
               }}
            >
               {dayNumberOfChallenge(playerChallenge)}/{compareArray?.[1]}
               {/* {playerChallenge?.unit?.length > 0
                  ? playerChallenge?.unit?.toUpperCase()
                  : 'POINTS'} */}
               {/* DAYS */}
            </Text>
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
};

export default inject(
   'smashStore',
   'challengeArenaStore',
   'challengesStore',
)(observer(EpicBadge));
