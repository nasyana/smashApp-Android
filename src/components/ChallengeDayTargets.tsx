import React from 'react';
import { getDayChar, isToday } from 'helpers/generalHelpers';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { inject, observer } from 'mobx-react';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { isDateInPast, hexToRgbA } from 'helpers/generalHelpers';
import { useNavigation } from '@react-navigation/core';
import { GradientCircularProgress } from 'react-native-circular-gradient-progress';
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
const ChallengeDayTargets = (props) => {

   const { item, smashStore, small= false, navigation = false, repair } = props;

   const { navigate } = navigation ? navigation : useNavigation();
   const numDays = daysInChallenge(item);
   const { dayLabelsThisWeek, last7Keys, stringLimit, getDayLabelsInMonth, currentUser, last14Keys } =
      smashStore;

   const { daily = {}, selectedTarget, dailyTargets, selectedLevel = 1 } = item;
   

   const selectedIndex = selectedLevel - 1 || 0;
   const defaultDailyTarget =
      dailyTargets?.[selectedIndex] || parseInt(selectedTarget / numDays);

   const rgba = hexToRgbA(item.colorStart, 0.1);

   const rgba3 = hexToRgbA(item.colorStart, 0.3);

   // const gotToTargetsToday = (date) => {
   //    navigate('SingleChallengeDay',{date})
   // }

   const size = width / (small ? 16 : 10);
   return (
      <View row spread marginT-0 marginB-8={!small}  paddingH-16={!small} >
         {last7Keys.map((dayKey, index) => {

            const isSecondToLast = repair && index == last7Keys.length - 2;
            const past = isDateInPast(dayKey);
            const dateNumber = index + 1;

            const dailyTarget = daily?.[dayKey]?.target || defaultDailyTarget;
            const dayScore =
               item?.targetType == 'points'
                  ? daily?.[dayKey]?.score
                  : daily?.[dayKey]?.qty;

                  const repaired = item?.repaired;

            const progress =
               dailyTarget < 0 ? 100 : (dayScore / dailyTarget) * 100 || false;

            const today = isToday(dayKey);
            const isFuture = !past && !today;
            const gameWon = dayScore >= dailyTarget;
            return (
               <TouchableOpacity
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
                     borderRadius: 0,
                     alignContent: 'center', alignItems: 'center', justifyContent: 'center',
                     height: size, width: size,
                     marginLeft: small ? 0 : 8, marginRight: small ? 4 : 0 
                  }}>


                  <GradientCircularProgress
                     emptyColor={past ? rgba : '#eee'}
                     // style={{ position: 'absolute' }}
                     size={size}
                     startColor={item.colorEnd}
                     middleColor={item.colorEnd}
                     endColor={item.colorEnd}
                     progress={progress ? progress > 100 ? 100 : progress : gameWon ? 100 : 0}
                     rotation={0}
                     strokeWidth={4}
                     style={{ marginHorizontal: 2, paddingBottom: 4 }}
                     fillLineCap="round"
                     withSnail
                     tintColor={
                        progress > 0 // Means there is a target today and a score.
                           ? item.colorStart // If there is a target today and score then show endColor
                           : gameWon
                           ? Colors.green30 // Else if game is won and no progress that day, show Green,
                           : '#ccc'
                     }

                     backgroundColor={past ? rgba : '#eee'} />


                  <Text
                           secondaryContent
                           style={{
                              fontWeight: 'bold',
                              position: 'absolute',
                              textDecorationLine: today ? 'underline' : 'none',
                              fontSize: small ? 10 : 12,
                              color:
                                 progress > 0 // Was there a target that day or was challenge already won?
                                    ? progress >= 100 //Was Daily Target Completed?
                                       ? item.colorEnd // If it was completed, show Color for Text.
                                       : '#ccc' // Else show grey for text.
                                    : gameWon
                                    ? Colors.green30
                                    : '#ccc', /// Color to display if Challenge is already won and there was no target for today.
                           }}>
                           {isSecondToLast ? '😢' : stringLimit(getDayChar(dayKey), 1, false)}
                        </Text>

                  {progress >= 100 && (
                     <View style={{ position: 'absolute', bottom: 10, borderRadius: 30, right: -2, height: small ? 10 : 15, width: small ? 10 : 15, backgroundColor: Colors.green40, alignItems: 'center', justifyContent: 'center', }}>
                        <Text>{repaired ? <AntDesign name="check" color={'#333'} size={small ? 6 : 8} /> : <AntDesign name="check" color={'#fff'} size={small ? 6 : 8} />}</Text>
                     </View>
                  
                  )}
              
                  {today && (
                     <View
                        style={{
                           width: '100%',
                           justifyContent: 'center',
                           alignItems: 'center',
                           position: 'absolute',
                           bottom: -14,
                        }}>
                        <View
                           style={{
                              height: 5,
                              width: 5,
                              borderRadius: 14,
                              backgroundColor:
                                 item.colorStart || Colors.green30,
                              marginTop: 7,
                           }}
                        />
                     </View>
                  )}

               </TouchableOpacity>
            );
         })}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(ChallengeDayTargets));
