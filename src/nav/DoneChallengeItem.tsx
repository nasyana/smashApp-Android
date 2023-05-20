import React, { useState, useEffect } from 'react';
import { Text, View, Colors } from 'react-native-ui-lib';
import { Audio } from 'expo-av';
import { inject, observer } from 'mobx-react';
import {
   Modal,
   TextInput,
   TouchableOpacity,
   FlatList,
   ScrollView,
} from 'react-native';
import Animated, {
   Easing,
   useAnimatedProps,
   useSharedValue,
   withTiming,
} from 'react-native-reanimated';
import { moderateScale } from 'helpers/scale';
import { ProgressBar } from 'react-native-ui-lib';
import { AntDesign } from '@expo/vector-icons';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
import { getTeamData } from 'helpers/teamDataHelpers';
import SmartImage from '../components/SmartImage/SmartImage';
import _ from 'lodash';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedView from 'components/AnimatedView';
import Box from 'components/Box';
import Shimmer from 'components/Shimmer';
import { width, height } from 'config/scaleAccordingToDevice';

import { getTeamWeeklyData } from 'helpers/teamDataHelpers';
import LottieAnimation from 'components/LottieAnimation';
import TodayTarget from 'modules/SingleTeamDay/components/TodayTarget';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { kFormatter } from 'utils/common';
import Rank from './Rank';
import DoneGoalItem from './DoneGoalItem'
const completionAnimation = require('../lotties/findteam.json');

const DoneRenderItem = (props) => {
   const { item, index, stringLimit, smashStore } = props;

const {multiplier, activtyWeAreSmashing, completionsTeamsAndChallenges} = smashStore;


const value =  smashStore.returnActionPointsValue(activtyWeAreSmashing);
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

      return () => {};
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

   const remainingToday =
      playerChallenge.selectedTodayTarget - playerChallenge.selectedTodayScore || false;

   const removeFromTodayTarget =
      playerChallenge?.targetType == 'qty' ? multiplier : pointsToAdd;

   const finalRemaining = remainingToday - removeFromTodayTarget;

   const todayScore =
      parseInt(playerChallenge.selectedTodayScore) + parseInt(removeFromTodayTarget);

   const progress =
      ((playerChallenge.selectedTodayScore + removeFromTodayTarget) /
         playerChallenge.selectedTodayTarget) *
      100;

      // const goalsWithThisChallengeId = completionsTeamsAndChallenges.filter((goal)=>goal?.goalName?.length > 0).filter((goal) => goal.goalName == item.challengeName);

      // if(goalsWithThisChallengeId.length > 0){
         
      //    console.log('goalsWithThisChallengeId', goalsWithThisChallengeId)


      // }




   return (
      <View style={{borderBottomWidth: 0, paddingBottom: 8, marginBottom: 8}}>
      <AnimatedView fade>
         <View
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
                     marginTop: 16,
                     marginBottom: 8,
                     flexDirection: 'row',
                  }}>
                  {false && (
                     <LinearGradient
                        // Background Linear Gradient
                        start={{ x: 0.1, y: 0.1 }}
                        colors={[
                           // 'transparent',
                           playerChallenge?.colorStart || '#F62C62',
                           // playerChallenge?.colorStart || '#F62C62',
                           // playerChallenge?.colorEnd || '#F55A39',
                           playerChallenge?.colorEnd || '#F55A39',
                        ]}
                        style={{
                           height: 44,
                           width: 44,
                           borderRadius: 5,
                           position: 'absolute',
                           left: -2,
                           top: -2,
                           opacity: 1,
                        }}
                     />
                  )}
                  <SmartImage
                     uri={playerChallenge?.picture?.uri}
                     preview={playerChallenge?.picture?.preview}
                     style={{
                        height: 40,
                        width: 40,
                        borderRadius: 5,
                        borderWidth: 0,
                        borderColor: playerChallenge?.colorEnd || '#ccc',
                     }}
                  />

                  <View
                     centerV
                     style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginLeft: 16,
                        justifyContent: 'space-between',
                        // alignplayerChallenges: 'center',
                     }}>
                     <View>
                        <View row centerV>
                           <Text B14>
                              {stringLimit(playerChallenge.title, 14)?.toUpperCase()}{' '}
                           </Text>
                           <Rank
                              loadIndex={index}
                              newPoints={pointsToAdd}
                              newQty={multiplier}
                              playerChallenge={playerChallenge}
                              colorStart={playerChallenge.colorStart}
                              rank={3}
                           />
                        </View>

                        <AnimatedView>
                           {/* <Text M14 secondaryContent>
                              You're coming 3rd
                           </Text> */}
                           <Text
                              R14
                              style={
                                 {
                                    // fontSize: 20,
                                    // alignSelf: 'center',
                                    // fontWeight: 'bold',
                                    // color: Colors.rgba(224, 91, 60, 1),
                                 }
                              }>
                              {remainingToday && remainingToday > 0 ? (
                                 <Text secondaryContent R12>
                                    {parseInt(finalRemaining) <= 0
                                       ? 'Day Target Smashed!'
                                       : finalRemaining +
                                         //   (item.unit || 'points') +
                                         ' left today'}{' '}
                                    ({kFormatter(todayScore)} of {kFormatter(playerChallenge.selectedTodayTarget)}){' '}
                                    {/* {item.targetType == 'qty'
                                       ? item.unit || 'units'
                                       : 'Pts'}
                                    ) */}
                                 </Text>
                              ) : (
                                 <Text R12 secondaryContent>
                                    Day Target Smashed!{' '}
                                    <Text buttonLink>{kFormatter(todayScore)}</Text> /{' '}
                                    {kFormatter(playerChallenge.selectedTodayTarget)}
                                 </Text>
                              )}
                           </Text>
                        </AnimatedView>

                        {/* <Text
                          secondaryContent
                          style={{
                             fontSize: 10,
                             letterSpacing: 1,
                             opacity: 0.5,
                             marginTop: 4,
                          }}>
                          {item?.title?.toUpperCase()}
                       </Text> */}

                        {/* <Text
                           B10
                           secondaryContent
                           style={{
                              fontSize: 10,
                              letterSpacing: 1,
                              opacity: 0.5,
                              marginTop: 4,
                           }}>
                           {item.itemType.toUpperCase()}{' '}
                           <Text buttonLink>{todayScore}</Text> /{' '}
                           {item.selectedTodayTarget}
                        </Text> */}
                     </View>

                     {finalRemaining <= 0 ? (
                        <LottieAnimation
                           autoPlay
                           loop={false}
                           style={{
                              height: 56,
                              zIndex: 0,
                              top: -8,
                              right: -2,
                              position: 'absolute',
                           }}
                           source={require('./../lottie/trophy-winner.json')}
                        />
                     ) : (
                        <AnimatedCircularProgress
                           size={50}
                           fill={parseInt(progress) || 0}
                           rotation={0}
                           width={5}
                           style={{ marginHorizontal: 0, top: -8 }}
                           fillLineCap="round"
                           tintColor={playerChallenge.colorEnd}
                           backgroundColor={'#eee'}>
                           {(fill) => (
                              <View centerV centerH>
                                 <Text
                                    secondaryContent
                                    M12
                                    style={{
                                       // fontWeight: 'bold',

                                       // fontSize: 12,
                                       color: playerChallenge.colorEnd,
                                    }}>
                                    {parseInt(fill)}%
                                 </Text>
                              </View>
                           )}
                        </AnimatedCircularProgress>
                        //  <Text
                        //     R14
                        //     center
                        //     style={{
                        //        width: 40,
                        //        color: item.colorEnd || '#333',
                        //     }}>
                        //     {progress > 0 ? parseInt(progress) : 0}%
                        //  </Text>
                     )}
                  </View>
               </View>
            </View>
         </View>
         {/* <View paddingH-0>
      {goalsWithThisChallengeId?.map((item)=>{
      
      return <DoneGoalItem
                  {...{
                     item,
                     index,
                     multiplier,
                     pointsToAdd,
                     stringLimit,
                     kFormatter,
                  }}
               />})}
               </View> */}
      </AnimatedView>

     
               
               </View>
   );
};

export default inject('smashStore', 'teamsStore')(observer(DoneRenderItem));
