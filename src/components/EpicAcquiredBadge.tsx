/// This badge is named epic badge because it can be a target badge or an acquired badge.

/// displayTypes: selectedTarget || baseTarget || acquiredTarget

import React, { useEffect, useState } from 'react';
import { moment } from 'helpers/generalHelpers';;
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
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
import AnimatedView from './AnimatedView';
import { convertEndDateKeyToMonth } from 'helpers/playersDataHelpers';
import Shimmer from 'components/Shimmer';
const EpicAcquiredBadge = (props) => {
   const { kFormatter, playerChallenge } = props;

   const playerChallengeData = playerChallenge;
   const [loaded, setloaded] = useState(false);
   const levelIndex =
      parseInt(playerChallenge?.selectedLevel) - 1 || parseInt(0);

   const wonTarget = playerChallengeData?.wonTarget || 0;

   const baseTarget = playerChallengeData?.baseTarget || 0;

   const wonLevel = playerChallengeData?.wonLevel
      ? parseInt(playerChallengeData?.wonLevel)
      : false;

   const selectedGradient = playerChallengeData?.selectedGradient || [
      '#192840',
      '#2440dd',
   ];

   useEffect(() => {
      setTimeout(() => {
         setloaded(true);
      }, 1200);

      return () => {};
   }, []);

   const size = 100;
   let badgeAsset = Assets.icons.badge0;

   if (wonLevel == 1) {
      badgeAsset = Assets.icons.badge1;
   }
   if (wonLevel == 2) {
      badgeAsset = Assets.icons.badge2;
   }
   if (wonLevel == 3) {
      badgeAsset = Assets.icons.badge3;
   }

   const wonAtLeastOneBadge = wonLevel > 0;
   const endMonth = convertEndDateKeyToMonth(playerChallenge.endDateKey);

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
               opacity: wonAtLeastOneBadge ? 1 : 1,
            }}>
            {/* <Image
               source={badgeAsset}
               style={{
                  height: size - 3,
                  width: size - 3,
                  position: 'absolute',
                  opacity: wonAtLeastOneBadge ? 1 : 0.2,
               }}
            /> */}
            {loaded ? (
               <SmartImage
                  uri={
                     playerChallenge?.picture?.uri ||
                     'https://firebasestorage.googleapis.com/v0/b/smash-app-81ca9.appspot.com/o/00000smashAssets%2Fwhitebadge.png?alt=media&token=34a662e6-6625-401c-bae9-3bf2eb133597'
                  }
                  preview={playerChallenge?.picture?.preview}
                  style={{
                     height: size - 3,
                     width: size - 3,
                     position: 'absolute',
                     opacity: 1,
                  }}
               />
            ) : (
               <Shimmer
                  style={{
                     height: size - 3,
                     width: size - 3,
                     position: 'absolute',
                     opacity: 1,
                  }}
               />
            )}
            <LinearGradient
               // Background Linear Gradient
               start={{ x: 0.1, y: 0.1 }}
               colors={[
                  'transparent',
                  wonAtLeastOneBadge
                     ? playerChallenge?.colorStart || '#F62C62'
                     : '#ccc',
                  wonAtLeastOneBadge
                     ? playerChallenge?.colorStart || '#F62C62'
                     : '#ccc',
                  wonAtLeastOneBadge
                     ? playerChallenge?.colorEnd || '#F55A39'
                     : '#ccc',
                  wonAtLeastOneBadge
                     ? playerChallenge?.colorEnd || '#F55A39'
                     : '#ccc',
               ]}
               style={{
                  height: size,
                  width: size,
                  borderRadius: 50,
                  position: 'absolute',
                  opacity: 0.75,
               }}
            />
            {/* <AnimatedView delay={100} duration={300}> */}
            <SmartImage
               uri={
                  playerChallenge?.badgeDecorationPicture?.uri ||
                  'https://firebasestorage.googleapis.com/v0/b/smash-app-81ca9.appspot.com/o/00000smashAssets%2Fwhitebadge.png?alt=media&token=34a662e6-6625-401c-bae9-3bf2eb133597'
               }
               preview={playerChallenge?.badgeDecorationPicture?.preview}
               style={{
                  height: size - 3,
                  width: size - 3,
                  position: 'absolute',
                  opacity: 1,
               }}
            />
            {/* </AnimatedView> */}
            <Text white marginT-8>
               {endMonth.toUpperCase()}
            </Text>
            <Text
               B18
               style={{
                  fontSize: 24,
                  opacity: wonAtLeastOneBadge ? 1 : 0.7,
                  letterSpacing: -1,
                  marginTop: -5,
                  color: '#fff',
               }}>
               {wonTarget > 0 ? kFormatter(wonTarget) : kFormatter(baseTarget)}
            </Text>
            <Text
               style={{
                  ...(badgeLevelStyles[wonLevel - 1]?.unitStyle ||
                     greyBadge?.unitStyle),
                  marginTop: -5,
                  marginBottom: 0,
                  fontSize: 8,
                  color: '#fff',
               }}>
               {playerChallenge?.unit?.length > 0
                  ? playerChallenge?.unit?.toUpperCase()
                  : 'points'}
            </Text>
            <View row marginT-4>
               {Array(parseInt(playerChallenge.selectedLevel || 1))
                  .fill(2)
                  .map((l) => (
                     <AntDesign
                        name={'star'}
                        size={8}
                        color={
                           wonAtLeastOneBadge
                              ? 'yellow'
                              : 'rgba(255,255,255,0.7)'
                        }
                     />
                  ))}
            </View>
         </LinearGradient>
      </>
   );
};

export default EpicAcquiredBadge;
