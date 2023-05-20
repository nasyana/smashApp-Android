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
   const { numberWithCommas, kFormatter, checkInfinity, setMasterIdsToSmash } =
      smashStore;

   const { weeklyActivityHash } = teamsStore;
   const {
      todayProgress = 0,
      selectedTodayTarget = 0,
      endWeekKey,
   } = getTeamData(team);

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
   return (
      <View
         // marginH-16
         // onPress={() => setExpandCard((prev) => !!prev)}
         style={{ marginTop: 0 }}>
         {/* <SmartImage
            uri={team?.picture?.uri}
            preview={team?.picture?.preview}
            style={{
               height: 180,
               width: width - 30,

               borderRadius: 10,
               backgroundColor: '#ccc',
               marginRight: 8,
               position: 'absolute',
               top: 16,
               left: 15,
            }}
         /> */}

         <Box
            style={{
               marginHorizontal: SPACING,
               marginVertical: SPACING,
               padding: SPACING / 2,
               overflow: 'hidden',
               // backgroundColor: '#000',
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
            {/* 
            <View row spread>
               <View flex centerV marginL-12>
                  <View row center>
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
            </View> */}

            {/* {weeklyActivity && <Text>{JSON.stringify(weeklyActivity)}</Text>} */}

            {true && (
               <View centerH centerV style={{ paddingTop: SPACING }}>
                  <AnimatedView>
                     <CircularProgressBar
                        topText={'Your Points Today'}
                        bottomText={
                           myTargetToday > 0
                              ? 'Target: ' + kFormatter(myTargetToday)
                              : 'WEEK SMASHED'
                        }
                        mainText={kFormatter(myScoreToday)}
                        myScoreToday={myScoreToday}
                        width={20}
                        kFormatter={kFormatter}
                        textColor={
                           myTodayProgress < 100
                              ? Colors.meToday
                              : Colors.green30
                        }
                        fontSize={36}
                        justToday={justToday}
                        size={justToday ? 210 : 150}
                        overBy={overBy}
                        showLessThanOne={showLessThanOne}
                        alreadyReached={alreadyWonWeek}
                        fill={checkInfinity(myTodayProgress)}
                        tintColor={
                           myTodayProgress >= 100
                              ? Colors.green30
                              : Colors.meToday
                        }
                     />
                  </AnimatedView>
                  <View marginV-16>
                     {parseInt(remainingToday) > 0 ? (
                        <Text secondaryContent>
                           Get {kFormatter(remainingToday)} more today
                        </Text>
                     ) : (
                        <Text secondaryContent>Today's Target is SMASHED!</Text>
                     )}
                  </View>
                  {!justToday && <WeeklyTeamPlayerDayTargets />}
                  {/* <Text>{myTodayProgress}</Text> */}
                  {myTodayProgress >= 100 && (
                     <LottieAnimation
                        autoPlay
                        loop={false}
                        style={{
                           // width: 200,
                           height: 120,
                           zIndex: 99999,
                           top: 5,
                           right: 12,
                           position: 'absolute',
                        }}
                        source={require('../../../lotties/done-excited.json')}
                     />
                  )}

                  {/* {parseInt(remainingToday) > 0 ? (
                     <ButtonLinear
                        title={`Get ${kFormatter(remainingToday)} more today`}
                        colors={[Colors.meToday, Colors.meToday]}
                        onPress={smashTeamActivities}
                        color={Colors.meToday}
                        outline
                        bordered
                        style={{
                           marginTop: SPACING / 2,
                           width: '100%',
                        }}
                     />
                  ) : (
                     <ButtonLinear
                        title={
                           weekIsAlreadyWon
                              ? 'Team Target is SMASHED!'
                              : "Today's Target is SMASHED"
                        }
                        colors={[Colors.green30, Colors.green50]}
                        bordered
                        color={Colors.green30}
                        // onPress={() => {
                        //    goToTeamArena(team);
                        // }}
                        style={{
                           marginTop: SPACING / 2,
                           width: '100%',
                        }}
                     />
                  )} */}
               </View>
            )}
         </Box>

         {false && (
            <View flex row spread marginT-8>
               <Box
                  style={{
                     flex: 1,
                     padding: 16,
                     marginRight: 0,
                     marginLeft: 16,
                  }}>
                  <TouchableOpacity>
                     <Text>My Target</Text>
                     <Text B28 marginT-8>
                        {kFormatter(parseFloat(myTargetToday).toFixed(0)) > 0
                           ? kFormatter(parseFloat(myTargetToday).toFixed(0))
                           : 'N/A'}
                     </Text>
                  </TouchableOpacity>
               </Box>

               <Box
                  style={{
                     flex: 1,
                     margin: 0,
                     padding: 16,
                     marginRight: 0,
                     marginLeft: 8,
                  }}>
                  <TouchableOpacity>
                     <Text>My Score</Text>
                     <Text B28 meToday marginT-8>
                        {kFormatter(myScoreToday)}
                     </Text>
                  </TouchableOpacity>
               </Box>

               <Box
                  style={{
                     flex: 1,
                     padding: 16,
                     marginRight: 16,
                     marginLeft: 8,
                  }}>
                  <TouchableOpacity>
                     <Text>Complete</Text>
                     <Text
                        B28
                        marginT-8
                        style={{
                           color:
                              myScoreToday >= 100
                                 ? Colors.green30
                                 : Colors.grey40,
                        }}>
                        {checkInfinity(myTodayProgress) > 0
                           ? checkInfinity(myTodayProgress) + '%'
                           : '100%'}
                     </Text>
                  </TouchableOpacity>
               </Box>
            </View>
         )}

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

