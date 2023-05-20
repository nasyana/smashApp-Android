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
const EpicBadge = (props) => {
   const {
      smashStore,
      playerChallenge,
      challenge,
      size = 110,
      challengeData,
   } = props;

   const selectedLevel = parseInt(playerChallenge?.selectedLevel);
   const { kFormatter } = smashStore;
   const playerChallengeData = playerChallenge
      ? getPlayerChallengeData(playerChallenge)
      : {};

   const isDefaultBadge = playerChallenge == null;
   const levelIndex = parseInt(selectedLevel) - 1 || 0;

   const selectedTarget = playerChallengeData?.selectedTarget || 0;

   const endMonth =
      convertEndDateKeyToMonth(
         playerChallenge.endDateKey || challengeData?.endDateKey,
      ) || '';
   return (
      <>
         <LinearGradient
            start={{ x: 0.6, y: 0.1 }}
            colors={['transparent', 'transparent']}
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
            <SmartImage
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
            />
            <LinearGradient
               // Background Linear Gradient
               start={{ x: 0.1, y: 0.1 }}
               colors={[
                  'transparent',
                  playerChallenge?.colorStart || '#F62C62',
                  playerChallenge?.colorStart || '#F62C62',
                  playerChallenge?.colorEnd || '#F55A39',
                  playerChallenge?.colorEnd || '#F55A39',
               ]}
               style={{
                  height: size,
                  width: size,
                  borderRadius: 50,
                  position: 'absolute',
                  opacity: 0.75,
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
            {size > 100 && (
               <Text white R12 marginB-0 style={{ ...textShadow }}>
                  {endMonth.toUpperCase()}
               </Text>
            )}
            <Text
               B18
               style={{
                  ...textShadow,
                  fontSize: 24,
                  letterSpacing: -1,
                  marginBottom: 10,
                  marginTop: -5,
                  color: badgeLevelStyles[levelIndex]?.targetColor,
               }}>
               {kFormatter(selectedTarget)}
            </Text>

            <Text
               style={{
                  ...badgeLevelStyles[levelIndex]?.unitStyle,
                  ...textShadow,
                  color: isDefaultBadge
                     ? greyBadge?.targetColor
                     : badgeLevelStyles[levelIndex]?.unitColor,
               }}>
               {playerChallenge?.unit?.length > 0
                  ? playerChallenge?.unit?.toUpperCase()
                  : 'POINTS'}
            </Text>
            <View row marginT-4>
               {Array(parseInt(playerChallenge.selectedLevel || 1))
                  .fill(2)
                  .map((l) => (
                     <AntDesign name={'star'} size={8} color={'yellow'} />
                  ))}
            </View>
         </LinearGradient>
      </>
   );
};

export default inject('smashStore', 'challengeArenaStore')(observer(EpicBadge));
