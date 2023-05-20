import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import SmartImage from '../../../components/SmartImage/SmartImage';
import Box from '../../../components/Box';
import AnimatedView from '../../../components/AnimatedView';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { AntDesign, Feather } from '@expo/vector-icons';
import ButtonLinear from 'components/ButtonLinear';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Animated from 'react-native-reanimated';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
import { moment } from 'helpers/generalHelpers';;
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/core';
import { width } from 'config/scaleAccordingToDevice';
import CircularProgressBar from 'components/CircularProgressBar';
import WeeklyTeamPlayerDayTargets from 'components/WeeklyTeamPlayerDayTargets';
import {
   getTeamData,
   getDefaultWeeklyActivity,
   checkInfinity,
} from 'helpers/teamDataHelpers';

import { uid } from 'helpers/generalHelpers';
import Firebase from 'config/Firebase';
import { parseJSON } from 'date-fns/esm';
import LottieAnimation from 'components/LottieAnimation';

const TodayTeamTarget = ({
   SPACING,
   expandCard,
   goToTeamArena,
   smashStore,
   team,
   teamsStore,
   justToday,
}) => {
   const unit = 'pts';
   const {
      stringLimit,
      kFormatter,
      checkInfinity,
      setMasterIdsToSmash,
      setHomeTabsIndex,
      currentUser,
   } = smashStore;

   const { weeklyActivityHash } = teamsStore;
   const {
      todayProgress = 0,
      selectedTodayTarget = 0,
      endWeekKey,
   } = getTeamData(team);
   const { navigate } = useNavigation();
   const teamWeeklyKey = `${team.id}_${endWeekKey}`;

   const weeklyActivity =
      weeklyActivityHash?.[teamWeeklyKey] || getDefaultWeeklyActivity(team);

   const {
      teamTodayScore = 0,
      teamTargetToday = 0,
      teamTodayProgress = 0,
      myScoreToday = 0,
      myTargetToday = 0,
      myTodayProgress = 0,
      thisWeekTarget = 0,
      alreadyWonWeek,
      daysLeft,
      numberOfPlayers,
      score,
   } = weeklyActivity;

   let weekIsAlreadyWon = score > thisWeekTarget ? true : false;

   const overBy = myScoreToday - myTargetToday;

   const remainingToday =
      myScoreToday < myTargetToday ? myTargetToday - myScoreToday : 0;
   const showLessThanOne = teamTodayProgress > 0 && teamTodayProgress < 1;

   const smashTeamActivities = () => {
      setMasterIdsToSmash(team.masterIds);
   };

   const goToTeamArenaPre = () => {
      setHomeTabsIndex(0);
      goToTeamArena(team);
   };
   const goToMeToday = () => {
      setHomeTabsIndex(0);
      goToTeamArena(team);
   };

   const goToTeamToday = () => {
      setHomeTabsIndex(0);
      goToTeamArena(team);
   };


   return (
      <View
         onPress={() => setExpandCard((prev) => !!prev)}
         style={{ marginTop: 0 }}>
         <Box
            style={{
               marginRight: 8,
               marginVertical: 10,
               padding: 24,
               overflow: 'hidden',
               backgroundColor: '#fff',
            }}>
            {myTodayProgress >= 100 && (
               <LottieAnimation
                  autoPlay
                  loop={true}
                  style={{
                     // width: 200,

                     height: width,
                     zIndex: 0,
                     top: 0,
                     left: 0,
                     position: 'absolute',
                  }}
                  source={require('../../../lotties/confetti.json')}
               />
            )}
            <TouchableOpacity onPress={goToTeamArenaPre}>
               <View row spread centerV>
                  <SmartImage
                     uri={team?.picture?.uri}
                     preview={team?.picture?.preview}
                     style={{
                        height: 60,
                        width: 60,

                        borderRadius: 5,
                        backgroundColor: '#ccc',
                        marginRight: 8,
                        // position: 'absolute',
                        top: 0,
                        left: 0,
                     }}
                  />
                  <View
                     uri={team?.picture?.uri}
                     preview={team?.picture?.preview}
                     style={{
                        height: 60,
                        width: 60,

                        borderRadius: 5,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        marginRight: 8,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                     }}
                  />

                  <View flex centerV marginL-8>
                     <View row centerV spread>
                        {team?.name && (
                           <Text H18>{stringLimit(team?.name, 25)}</Text>
                        )}
                        {/* <AntDesign
                        name={expandCard ? 'caretup' : 'caretdown'}
                        size={12}
                        color={'#333'}
                     /> */}
                     </View>
                     <View row>
                        <View row centerV marginT-2 center>
                           <Feather
                              name="target"
                              size={14}
                              color={Colors.blue50}
                           />
                           <Text
                              H12
                              color97
                              marginL-7
                              style={{
                                 textTransform: 'uppercase',
                                 letterSpacing: 0,
                              }}>
                              {myScoreToday} /{' '}
                              {parseFloat(myTargetToday).toFixed(0)} {unit}{' '}
                           </Text>
                        </View>
                     </View>
                  </View>
                  {/* <AntDesign name="right" color="#ccc" size={20} /> */}
               </View>
            </TouchableOpacity>

            <TouchableOpacity
               onPress={goToTeamToday}
               style={{
                  position: 'absolute',
                  top: 100,
                  right: 24,
                  zIndex: 999999,
               }}>
               <CircularProgressBar
                  justToday={justToday}
                  size={50}
                  circle={false}
                  // topText={`${currentUser.name} Today`}
                  // bottomText={'Target: ' + myTargetToday}
                  width={10}
                  fontSize={10}
                  // mainText={''}
                  overBy={overBy}
                  textColor={Colors.teamToday}
                  showLessThanOne={showLessThanOne}
                  alreadyReached={alreadyWonWeek}
                  fill={checkInfinity(teamTodayProgress)}
                  showPercent={true}
                  hidePercent={false}
                  tintColor={
                     myTodayProgress >= 100 ? Colors.green30 : Colors.teamToday
                  }
               />
            </TouchableOpacity>

            {/* {weeklyActivity && <Text>{JSON.stringify(weeklyActivity)}</Text>} */}

            {expandCard && (
               <View centerH centerV style={{ paddingTop: SPACING / 2 }}>
                  <AnimatedView>
                     <TouchableOpacity onPress={goToMeToday}>
                        <CircularProgressBar
                           justToday={justToday}
                           size={justToday ? 160 : 150}
                           topText={`${currentUser.name} Today`}
                           bottomText={'Target: ' + myTargetToday}
                           width={20}
                           mainText={myScoreToday}
                           overBy={overBy}
                           textColor={Colors.meToday}
                           showLessThanOne={showLessThanOne}
                           alreadyReached={alreadyWonWeek}
                           fill={checkInfinity(myTodayProgress)}
                           showPercent={false}
                           tintColor={
                              myTodayProgress >= 100
                                 ? Colors.green30
                                 : Colors.meToday
                           }
                        />
                     </TouchableOpacity>
                  </AnimatedView>
                  {/* <Text>{myTodayProgress}</Text> */}
                  {myTodayProgress >= 100 && (
                     <LottieAnimation
                        autoPlay
                        loop={false}
                        style={{
                           // width: 200,
                           height: 120,
                           zIndex: 99999,
                           top: 0,
                           right: 12,
                           position: 'absolute',
                        }}
                        source={require('../../../lotties/done-excited.json')}
                     />
                  )}

                  {!justToday && (
                     <WeeklyTeamPlayerDayTargets
                        item={weeklyActivity}
                        color={Colors.blue10}
                     />
                  )}
                  {parseInt(remainingToday) > 0 ? (
                     <ButtonLinear
                        title={`Get ${kFormatter(remainingToday)} more today`}
                        colors={[Colors.blue10, Colors.blue40]}
                        onPress={
                           smashTeamActivities
                           // () =>
                           // goToTeamArenaPre({
                           //    ...team,
                           // })
                        }
                        style={{
                           marginTop: SPACING / 2,
                           width: '100%',
                        }}
                     />
                  ) : (
                     //   <Text
                     //       B10
                     //       color77
                     //       style={{
                     //          marginTop: SPACING / 2,
                     //          textTransform: 'uppercase',
                     //          letterSpacing / 2: 0,
                     //       }}>

                     //    </Text>
                     <ButtonLinear
                        title={
                           weekIsAlreadyWon
                              ? 'Team Target is SMASHED!'
                              : "Today's Target is SMASHED"
                        }
                        colors={[Colors.green30, Colors.green50]}
                        bordered
                        color={Colors.green30}
                        onPress={() => {
                           goToTeamArenaPre(team);
                        }}
                        style={{
                           marginTop: SPACING / 2,
                           width: '100%',
                        }}
                     />
                     // <Text
                     //    B10
                     //    color77
                     //    style={{
                     //       marginTop: SPACING,
                     //       textTransform: 'uppercase',
                     //       letterSpacing: 0,
                     //    }}>
                     //    Today's Target is SMASHED
                     // </Text>
                  )}
               </View>
            )}
         </Box>
         {/* <Text center> teamTodayProgress {teamTodayProgress}</Text>
         <Text center> myScoreToday {myScoreToday}</Text>
         <Text center> myTargetToday {myTargetToday}</Text>
         <Text center>thisWeekTarget {thisWeekTarget}</Text>
         <Text center>endDate {team.endDate}</Text>
         <Text center>this week score {weeklyActivity?.score}</Text> */}
      </View>
   );
};



export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TodayTeamTarget));

