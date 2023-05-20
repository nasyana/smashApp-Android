/// This badge is named epic badge because it can be a target badge or an acquired badge.

/// displayTypes: selectedTarget || baseTarget || acquiredTarget

import React, { useEffect } from 'react';
import { boxShadow, moment } from 'helpers/generalHelpers';;
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
   FontAwesome5,
} from '@expo/vector-icons';
import {
   View,

   Text,
   Colors,
   Assets,
   ProgressBar,
   TouchableOpacity,
   Button,
} from 'react-native-ui-lib';

import { Image } from 'react-native'
import { inject, observer } from 'mobx-react';
import { badgeLevelStyles, greyBadge, textShadow } from 'helpers/BadgeHelpers';
import { durationImages } from 'helpers/generalHelpers';
import SmartImage from './SmartImage/SmartImage';
import { dayNumberOfChallenge, daysInChallenge } from 'helpers/dateHelpers';
import { getCompareChallengeDaysSmashed, hexToRgbA } from 'helpers/generalHelpers';
import CircularProgressBar from './CircularProgressBar';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import firebaseInstance from 'config/Firebase';
import AnimatedView from './AnimatedView';

const badgeLevels = ['beginner', 'expert', 'guru'];
const EpicBadge = (props) => {
   const {
      smashStore,
      playerChallenge,
      challengesStore,
      size = 90,
      challengeData,
      challenge = {},
      index
   } = props;


   // const { streaksHash } = challengesStore;


   const { uid } = firebaseInstance.auth.currentUser;

   // const streakKey = `${uid}_${playerChallenge.challengeId}`;
   // const streakDoc = streaksHash?.[streakKey] || {};


   const {  streaksHash } = challengesStore;
   const streakKey = `${uid}_${playerChallenge.challengeId}`;
   const [streakDoc, setStreakDoc] = React.useState(false)

   useEffect(() => {
   
    const streakDoc = streaksHash[streakKey] || false;
 
    setStreakDoc(streakDoc)
   
     return () => {
    
     }
   }, [streaksHash[streakKey]])


   // console.warn(streakDoc);

   const { highestStreak = 0, onGoingStreak = 0 } = streakDoc



   const selectedLevel = parseInt(playerChallenge?.selectedLevel);
   const { kFormatter, journeySettings = {}, currentUser } = smashStore;

   const { durations = {} } = journeySettings;

   const durationsArray = Object.values(durations).map((d) => d.duration);


   let nextStepInJourney = durationsArray[0];
   let durationImage = Assets.icons[0];

   durationsArray.forEach((d, index) => {

      const lastIndex = index == durationsArray.length - 1;
      const nextStepIndex = lastIndex ? index : index + 1;

      if (highestStreak >= d) {

         nextStepInJourney = durationsArray[nextStepIndex]
         durationImage = Assets.icons?.[nextStepIndex];

      }

   })

   const playerChallengeData = playerChallenge || {};
   const levelIndex = parseInt(selectedLevel) - 1 || 0;
   
   const selectedGradient = playerChallengeData?.selectedGradient || [
      '#192840',
      '#2440dd',
   ];

   const challengeProgress = parseInt(parseInt(onGoingStreak || 0) / parseInt(nextStepInJourney || 0) * 100);
   const startColorFaded = hexToRgbA(playerChallenge?.colorEnd, 0.8);
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
                  playerChallenge?.colorEnd || '#F62C62',
                  playerChallenge?.colorEnd || '#F62C62',
                  startColorFaded || '#F62C62',
                  startColorFaded || '#F62C62'
               ]}
               style={{
                  height: size,
                  width: size,
                  borderRadius: 50,
                  position: 'absolute',
                  opacity: 1,
                  ...boxShadow
               }}
            />


            <AnimatedCircularProgress

               size={size - 14}
               fill={challengeProgress}
               rotation={0}
               width={3}
               style={{ marginHorizontal: 2, position: 'absolute', }}
               fillLineCap="round"
               tintColor={'#fff'} />
            <Image
               source={durationImage}
               style={{
                  height: 30,
                  width: 30
               }}
            />
            <Text
               M12
               style={{
                  // ...textShadow,
                  fontSize: 10,
                  letterSpacing: -1,
                  marginBottom: -2,
                  marginTop: 0,
                  color: badgeLevelStyles[levelIndex]?.targetColor,
               }}>
               STREAKS
            </Text>

            <Text
               white
               B18
            >
               {onGoingStreak}/{nextStepInJourney}
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
