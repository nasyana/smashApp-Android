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
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/core';
import {
   daysInChallenge,
   challengeConsistency,
   challengeDaysSmashed,
   unixToMonth,
} from 'helpers/dateHelpers';
import { getCompareChallengeDaysSmashed } from 'helpers/generalHelpers';
const EpicBadge = (props) => {
   const {
      smashStore,
      playerChallenge,
      challengesStore,
      size = 110,
      challengeData,
   } = props;

   const { navigate } = useNavigation();
   const { challengesHash } = challengesStore;

   const selectedLevel = parseInt(playerChallenge?.selectedLevel);
   const { kFormatter } = smashStore;
   const playerChallengeData = playerChallenge
      ? getPlayerChallengeData(playerChallenge)
      : {};
   const challenge = challengesHash?.[playerChallenge?.challengeId];
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
         playerChallenge.endDate || challengeData?.endDateKey,
      ) || '';

   const goToChallengeArena = () => {
      if (challenge.active && challenge.duration != 'weekly') {
         navigate(Routes.ChallengeArena, { challenge });
      } else {
         alert('Oops! Challenge no longer active');
      }
   };

   const percentTargetSmashed = parseInt(
      (playerChallenge.selectedScore / playerChallenge.selectedTarget) * 100,
   );


   const numDaysInChallenge = daysInChallenge(playerChallenge);

   const numDaysSmashed = challengeDaysSmashed(playerChallenge);

   const goToChallengeReview = () => {
      navigate(Routes.ChallengeReview, { playerChallenge });
   };

   const compareArray = getCompareChallengeDaysSmashed(playerChallenge);
   const levelLabels = ['beginner', 'expert', 'guru'];
   const challengeName =
      playerChallenge?.challengeName?.length > 10
         ? playerChallenge?.challengeName?.substring(0, 10)
         : playerChallenge?.challengeName || 'noname';
   // if (!smashed) return <View />;

   if (isNaN(compareArray?.[1])) {
      return null;
   }

   const wonChallenge =
      parseInt(compareArray?.[0]) >= parseInt(compareArray?.[1]);

   const smashed = wonChallenge


   return (
      <View centerH marginV-8 marginH-4>
         {/* <Text secondaryContent center R10>
            {moment(playerChallenge.startDate, 'DDMMYYYY').format('MMM')} -{' '}
            {moment(playerChallenge.endDate, 'DDMMYYYY').format('MMM')}
         </Text> */}

         <TouchableOpacity
            onPress={goToChallengeReview}
            style={{ width: size, height: size, borderRadius: size / 2 }}>
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
                     opacity: smashed ? 1 : 0,
                     borderRadius: size / 2,
                  }}
               /> */}
               <LinearGradient
                  // Background Linear Gradient
                  start={{ x: 0.1, y: 0.1 }}
                  colors={
                     smashed
                        ? [
                           //   'transparent',
                           //   playerChallenge?.colorStart || '#F62C62',
                           //   playerChallenge?.colorStart || '#F62C62',
                             playerChallenge?.colorEnd || '#F55A39',
                             playerChallenge?.colorEnd || '#F55A39',
                          ]
                        : ['#ccc', '#ccc']
                  }
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
               <View paddingH-8>
               <Text
                  B24
                     center
                  style={{
                     ...textShadow,
                     fontSize: 18,
                     letterSpacing: -1,
                     // lineHeight: 18,
                     marginBottom: 0,
                     marginTop: 10,
                     color: badgeLevelStyles[levelIndex]?.targetColor,

                  }}>
                  {/* <Text B12>{numDaysSmashed} of </Text> */}
                  {/* {numDaysInChallenge} */}
                     {daysInChallenge(playerChallenge)} DAYS
               </Text>
               </View>
               <Text
                  M12
                  white
                  style={{
                     marginTop: -4,
                     // ...badgeLevelStyles[levelIndex]?.unitStyle,
                     ...textShadow,

                     // color: isDefaultBadge
                     //    ? greyBadge?.targetColor
                     //    : badgeLevelStyles[levelIndex]?.unitColor,
                  }}>
                  {/* {playerChallenge?.unit?.length > 0
                  ? playerChallenge?.unit?.toUpperCase()
                  : 'POINTS'} */}
                  {/* {compareArray?.[0]}/{compareArray?.[1]} */}
                  {challengeName?.toUpperCase()}  
               </Text>
               <View row marginT-4>
                  {Array(parseInt(playerChallenge.selectedLevel || 1))
                     .fill(2)
                     .map((l) => (
                        <AntDesign name={'star'} size={8} color={'yellow'} />
                     ))}
               </View>
            </LinearGradient>
         </TouchableOpacity>
         {/* <Text center B12 secondaryContent>
            {levelLabels[levelIndex]?.toUpperCase()}
         </Text> */}
         {/* <Text center R10 secondaryContent>
            Consistency {challengeConsistency(playerChallenge)}%
         </Text> */}

         <Text secondaryContent center R10>
            <Text buttonLink>
               {/* {compareArray?.[0]} / {compareArray?.[1]} */}
               {/* Score: */}
               {/* {kFormatter(playerChallenge.selectedScore)} */}
            </Text>{' '}
            {/* / {kFormatter(playerChallenge.selectedTarget)}  */}
            {/* ({percentTargetSmashed + '%'}) */}
         </Text>
         {/* <Text>
            {moment(playerChallenge.endDate, 'DDMMYYYY').format('Do MMM')}
         </Text> */}
         {/* <Text>{playerChallenge.startDate}</Text>
         <Text>{playerChallenge.endDate}</Text>
         <Text>{playerChallenge.endUnix}</Text>
         <Text>{playerChallenge.duration}</Text>
         <Text>{playerChallenge.duration}</Text> */}
         {/* {wonChallenge && (
            <Text
               white
               R12
               marginB-0
               style={{
                  ...textShadow,
                  fontSize: 30,
                  position: 'absolute',
                  top: 8,
                  right: 0,
                  transform: [{ rotate: '25deg' }],
               }}>
               👑
            </Text>
         )} */}
      </View>
   );
};;;;;

export default inject(
   'smashStore',
   'challengeArenaStore',
   'challengesStore',
)(observer(EpicBadge));
