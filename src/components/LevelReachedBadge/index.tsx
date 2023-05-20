import React from 'react'

import { moment } from 'helpers/generalHelpers';
import SmartImage from 'components/SmartImage/SmartImage';
import { LinearGradient } from 'expo-linear-gradient';

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
import {
   MaterialCommunityIcons,
   AntDesign,
   Ionicons,
   Feather,
} from '@expo/vector-icons';
import { inject, observer } from 'mobx-react';
import { badgeLevelStyles } from 'helpers/BadgeHelpers';
import { convertEndDateKeyToMonth } from 'helpers/playersDataHelpers';
const LevelReachedBadge = (props) => {
   const {
      level,
      kFormatter,
      gradient,
      playerChallengeData,
      playerChallenge,
      gotBadge,
   } = props;

   const style = badgeLevelStyles[level - 1];
   const wonLevel = playerChallengeData?.wonLevel > level;

   const selectedTarget = props.value;

   const size = 180;


   let badgeImage = Assets.icons.badge1;

   if (level == 2) {
      badgeImage = Assets.icons.badge2;
   }

   if (level == 3) {
      badgeImage = Assets.icons.badge3;
   }
   const endMonth = convertEndDateKeyToMonth(playerChallenge.endDateKey);

   return (
      <LinearGradient
         start={{ x: 0.6, y: 0.1 }}
         colors={['transparent', 'transparent'] || gradient}
         style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: gotBadge ? 1 : 1,
         }}>
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
               opacity: gotBadge ? 1 : 0.3,
            }}
         />
         <LinearGradient
            // Background Linear Gradient
            start={{ x: 0.1, y: 0.1 }}
            colors={[
               'transparent',
               gotBadge ? playerChallenge?.colorStart : '#ccc' || '#F62C62',
               gotBadge ? playerChallenge?.colorStart : '#ccc' || '#F62C62',
               gotBadge ? playerChallenge?.colorEnd : '#aaa' || '#F55A39',
               gotBadge ? playerChallenge?.colorEnd : '#aaa' || '#F55A39',
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
         <Text white marginT-8>
            {endMonth.toUpperCase()}
         </Text>
         {/* <Ionicons name={playerChallenge?.fitness ? "fitness-outline" : "checkmark-done-circle-outline"} color="white" style={{ fontSize: size / 4, marginBottom: -2, marginTop: -5 }} /> */}
         <Text
            white
            B18
            style={{
               fontSize: size / 5,
               color: style.targetColor,
               letterSpacing: -1,
            }}>
            {kFormatter(parseInt(props.value || selectedTarget))}
         </Text>
         <Text style={{ color: style.targetColor }}>KM</Text>

         <View row marginT-4>
            {Array(parseInt(level || 1))
               .fill(2)
               .map((l) => (
                  <AntDesign
                     name={'star'}
                     size={12}
                     color={gotBadge ? 'yellow' : 'rgba(255,255,255,0.7)'}
                  />
               ))}
         </View>
      </LinearGradient>
   );
};

export default inject("smashStore", "challengesStore", "challengeArenaStore")(observer(LevelReachedBadge))
