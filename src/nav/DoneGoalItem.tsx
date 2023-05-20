import React, { useState, useEffect } from 'react';
import { Colors, Text, View } from 'react-native-ui-lib';
import { Audio } from 'expo-av';
import { inject, observer } from 'mobx-react';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
import SmartImage from '../components/SmartImage/SmartImage';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedView from 'components/AnimatedView';
import Shimmer from 'components/Shimmer';
import { width } from 'config/scaleAccordingToDevice';

import LottieAnimation from 'components/LottieAnimation';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { kFormatter } from 'utils/common';
import GoalRank from './GoalRank';
import { checkInfinity } from 'helpers/teamDataHelpers';
import { AntDesign, Feather } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-ui-lib/src/components/progressBar';
const completionAnimation = require('../lotties/findteam.json');

const DoneRenderItem = (props) => {
   const { item, index, stringLimit, smashStore } = props;

   const { multiplier, activtyWeAreSmashing, completion, uid } = smashStore;


   const value = smashStore.returnActionPointsValue(activtyWeAreSmashing);
   let pointsToAdd = parseInt(value) * parseInt(multiplier);

   async function playSound(index) {
      const { sound } = await Audio.Sound.createAsync(
         require('../sounds/gather.wav'),
      );

      await sound.playAsync();
   }
   const [loaded, setLoaded] = useState(false);
   const [playerChallenge, setPlayerChallenge] = useState(getPlayerChallengeData(item));

   useEffect(() => {
      setTimeout(() => {
         playSound();
         setLoaded(true);

         setPlayerChallenge(getPlayerChallengeData(item))
      }, index * 300);

      return () => { };
   }, []);

   if (!loaded) {
      return (
         <Shimmer
            style={{
               height: 55,
               marginTop: 8,
               width: width - 72,
               marginHorizontal: 16,
               borderRadius: 8,
            }}
         />
      );
   }



   const goal = item.goalDoc || {};
   const playerGoal = item;
   let playerGoalScore = goal.targetType == 'qty' ? playerGoal?.qty || 0 : playerGoal?.score || 0;


   const contribution = goal.targetType == 'qty' ? goal.contributionQty || 0 : goal.contributionScore || 0;

   const score = goal?.allowOthersToHelp ? contribution + completion.pointsToAdd : playerGoalScore + completion.pointsToAdd;

   const progress = checkInfinity((score / goal.target) * 100) || 0 // get percentage of goal completed using goal.target and score 
   const roundUpToClosestTenth = progress < 1 ? Math.ceil(progress / 100) : progress// round up to closest percent


   const target = goal.target || playerGoal.target || 0;

   const finalRemaining = target - score;
   //${goal?.user?.name}'s 
   const isMine = goal.uid == uid;
   const personLabel = isMine ? `Team ${goal.name}` : `Team ${goal.name}`
   const reachText = `${personLabel}` // ${kFormatter(goal?.target)} ${targetType == 'qty' ? qtyUnit : 'pts'}`

   const title = goal?.allowOthersToHelp ? reachText : reachText;

   const subText = goal?.allowOthersToHelp ? ' (' + kFormatter(score) + ' / ' + kFormatter(target) + ')' : ' (' + kFormatter(score) + ' / ' + kFormatter(target) + ')';
   if (!goal) { return null }

   return (
      <AnimatedView fade>
         <View
            marginB-8
            centerV
            style={{
               shadowColor: '#333',
               shadowOffset: {
                  width: 0,
                  height: 1,
               },
               shadowOpacity: 0.05,
               shadowRadius: 4.22,
               elevation: 3,
            }}
            key={index}
            duration={7000}>
            <View

               centerV
               style={{
                  borderBottomWidth: 0,
                  borderBottomColor: '#e6e6e6',
                  paddingHorizontal: 32,
                  shadowColor: '#333',
                  shadowOffset: {
                     width: 0,
                     height: 1,
                  },
                  shadowOpacity: 0.05,
                  shadowRadius: 4.22,
                  elevation: 3,
               }}>
               <View
                  centerV
                  style={{
                     marginTop: 4,
                     marginBottom: 0,
                     flexDirection: 'row',
                  }}>

                  {playerGoal?.picture?.uri?.length > 10 && <SmartImage
                     uri={playerGoal?.picture?.uri}
                     preview={playerGoal?.picture?.preview}
                     style={{
                        height: 40,
                        width: 40,
                        borderRadius: 5,
                        borderWidth: 0,
                        borderColor: playerGoal?.colorEnd || '#ccc',
                     }}
                  />}
                  {/* {!playerGoal?.picture?.uri && <Feather name="target" size={30} color={playerGoal?.colorEnd} />} */}

                  <View
                     centerV
                     style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginLeft: 0,
                        // justifyContent: 'space-between',
                        // alignplayerGoals: 'center',
                     }}>

                     <View row centerV spread flex>
                        <Text B14>
                           {stringLimit(title, 34)?.toUpperCase()}{' '}
                        </Text>
                        <Text R10 secondaryContent>{goal?.joined?.length} PARTICIPATING | GOAL</Text>
                        {/* <GoalRank
                              loadIndex={index}
                              newPoints={pointsToAdd}
                              newQty={multiplier}
                              playerGoal={playerGoal}
                              colorStart={playerGoal.colorStart}
                              rank={3}
                           /> */}
                     </View>




                  </View>

               </View>
               <View paddingH-0 row centerV>
                  <AnimatedView>
                     <Text
                        R12>
                        {score < target ? (
                           <Text secondaryContent B12>
                              {parseInt(finalRemaining) <= 0
                                 && 'Target Smashed!'
                              }

                              {/* {stringLimit(goal.name, 27)} */}
                              {/* {' '} */}
                              {subText}

                              {/* {parseInt(finalRemaining) > 0 && kFormatter(finalRemaining) + ' left'} */}
                           </Text>
                        ) : (
                           <Text B12 secondaryContent >
                              Target Smashed!{' '}
                              <Text buttonLink>{score}</Text> /{' '}
                              {kFormatter(target)}
                           </Text>
                        )}
                     </Text>
                  </AnimatedView>
                  <View flex marginL-8  ><ProgressBar progress={roundUpToClosestTenth} progressColor={Colors.smashPink} style={{ height: 16 }} /></View>
               </View>
            </View>
         </View>
      </AnimatedView>
   );
};

export default inject('smashStore', 'teamsStore')(observer(DoneRenderItem));
