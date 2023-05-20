import React from 'react';
import { getDayChar, isToday } from 'helpers/generalHelpers';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { inject, observer } from 'mobx-react';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { isDateInPast, hexToRgbA } from 'helpers/generalHelpers';
import { useNavigation } from '@react-navigation/core';
import AnimatedView from './AnimatedView';
import LottieAnimation from 'components/LottieAnimation';
import FireLottie from './FireLottie';
import {
   MaterialCommunityIcons,
   Ionicons,
   Fontisto,
   Feather,
   SimpleLineIcons,
   AntDesign,
} from '@expo/vector-icons';
import {
   getDayLabelsForPlayerChallenge,
   daysInChallenge,
} from 'helpers/dateHelpers';
import { width } from 'config/scaleAccordingToDevice';
import { moment } from 'helpers/generalHelpers';;
const ChallengeDayTarget = (props) => {
   const { navigate } = useNavigation();
   const { item, date, smashStore, color, index = 0, rgba, state } = props;

   const dayKey = moment(date.dateString, 'YYYY-MM-DD').format('DDMMYYYY');


   const { currentUser, stringLimit } = smashStore;

   const { dailyTargets = {}, selectedLevel = 1, daily = {} } = item;

   const selectedIndex = selectedLevel - 1 || 0;

   const dailyTarget = daily?.[dayKey]?.target || dailyTargets?.[selectedIndex];

   const past = isDateInPast(dayKey);
   const dateNumber = index + 1;
   const dayScore =
      item?.targetType == 'points'
         ? daily?.[dayKey]?.score
         : daily?.[dayKey]?.qty;

         const repaired = daily?.[dayKey]?.repaired || false;
   

   const wasActive = dayScore > 0;
   const progress =
      dailyTarget < 0 ? 100 : (dayScore / dailyTarget) * 100 || false;

   const today = state == 'today';
   const isFuture = !past && !today;
   const gameWon = dayScore >= dailyTarget;

   return (
      <TouchableOpacity
         // marginR-0
         // marginL-0
         // marginT-8
         // marginB-8
         key={dayKey}
         onPress={() =>
            isFuture
               ? null
               : navigate('SingleChallengeDay', {
                  date: dayKey,
                  dayKey,
                  dayScore,
                  dayTarget: dailyTarget,
                  progress,
                  gameWon,
                  playerChallenge: item,
                  currentUser,
               })
         }
         style={{
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
         }}>


         {wasActive ? <AnimatedCircularProgress
            size={width / 10}
            fill={progress ? progress : gameWon ? 100 : 0}
            rotation={0}
            width={3}
            style={{ marginHorizontal: 2 }}
            fillLineCap="round"
            tintColor={
               progress > 0 // Means there is a target today and a score.
                  ? item.colorStart // If there is a target today and score then show endColor
                  : gameWon
                     ? Colors.green30 // Else if game is won and no progress that day, show Green,
                     : '#ccc'
            }
            backgroundColor={past ? rgba : '#eee'}>
            {(fill) => (
               <Text
                  secondaryContent
                  style={{
                     fontWeight: 'bold',
                     textDecorationLine: today ? 'underline' : 'none',
                     fontSize: 12,
                     color:
                        progress > 0 // Was there a target that day or was challenge already won?
                           ? progress >= 100 //Was Daily Target Completed?
                              ? item.colorStart // If it was completed, show Color for Text.
                              : '#ccc' // Else show grey for text.
                           : gameWon
                              ? Colors.green30
                              : '#ccc', /// Color to display if Challenge is already won and there was no target for today.
                  }}>
                  {/* {stringLimit(getDayChar(dayKey), 1, false)} */}
                  {date.day}
               </Text>
            )}
         </AnimatedCircularProgress> :
            <View style={{ padding: 12, alignItems: 'center', justifyContent: 'center' }} >
               <Text
                  secondaryContent
                  style={{
                     fontWeight: 'bold',
                     textDecorationLine: today ? 'underline' : 'none',
                     fontSize: 12,
                     color:
                        progress > 0 // Was there a target that day or was challenge already won?
                           ? progress >= 100 //Was Daily Target Completed?
                              ? item.colorStart // If it was completed, show Color for Text.
                              : '#ccc' // Else show grey for text.
                           : gameWon
                              ? Colors.green30
                              : '#ccc', /// Color to display if Challenge is already won and there was no target for today.
                  }}>
                  {/* {stringLimit(getDayChar(dayKey), 1, false)} */}
                  {date.day}
               </Text>
            </View>}
         {
            progress >= 100 && (
               <View style={{ position: 'absolute', bottom: 10, borderRadius: 30, right: -2, height: 15, width: 15, backgroundColor: repaired ? item.colorEnd : Colors.green40, alignItems: 'center', justifyContent: 'center', }}>
                  {repaired ? <Text>🪄</Text> : <Text><AntDesign name="check" color={'#fff'} size={8} /></Text>}
               </View>
               // <LottieAnimation
               //    autoPlay
               //    loop={false}
               //    style={{
               //       // width: 200,
               //       height: 50,
               //       zIndex: 99999,
               //       top: 2,
               //       right: -5,
               //       position: 'absolute',
               //    }}
               //    source={require('../lotties/done-excited.json')}
               // />
            )
         }
         {/* {progress > 200 && false && (
            <View style={{ position: 'absolute', top: 0, right: -2 }}>
               <Text>🔥</Text>
            </View>
         )} */}
         {
            today && (
               <View
                  style={{
                     // width: '100%',
                     justifyContent: 'center',
                     alignItems: 'center',
                     position: 'absolute',
                     bottom: -8,
                     borderWidth: 0
                  }}>
                  <View
                     style={{
                        height: 5,
                        width: 5,
                        borderRadius: 14,
                        backgroundColor:
                           item.colorStart || Colors.green30,
                        marginTop: 0,
                     }}
                  />
               </View>
            )
         }
         {/* <Text center>
                        {daily?.[dayKey]?.qty} / {dayTarget}
                     </Text>
                     <Text>item.colorStart {item.colorStart}</Text>
                     <Text>item.colorEnd {item.colorEnd}</Text> */}

      </TouchableOpacity >
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(ChallengeDayTarget));
