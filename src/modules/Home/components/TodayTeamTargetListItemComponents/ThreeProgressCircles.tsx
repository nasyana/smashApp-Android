import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import SmartImage from 'components/SmartImage/SmartImage';
import Box from 'components/Box';
import AnimatedView from 'components/AnimatedView';
import {
   View,
   Text,
   Colors,
   TouchableOpacity,
   ProgressBar,
} from 'react-native-ui-lib';
import { Vibrate } from 'helpers/HapticsHelpers';
import { AntDesign, Feather } from '@expo/vector-icons';
import ButtonLinear from 'components/ButtonLinear';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Animated from 'react-native-reanimated';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
import { moment } from 'helpers/generalHelpers';;
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/core';
import { width } from 'config/scaleAccordingToDevice';
import LottieAnimation from 'components/LottieAnimation';
import CircularProgressBar from 'components/CircularProgressBar';
import WeeklyDayTargets from 'components/WeeklyDayTargets';
import SectionHeader from 'components/SectionHeader';
import { checkIfIHaveVoted, hasSomeoneVoted } from 'helpers/VotingHelpers';
import TeamScrollView from 'components/TeamScrollView';
import {
   getTeamData,
   getDefaultWeeklyActivity,
   checkInfinity,
   getTeamWeeklyData,
   getDaysLeft,
} from 'helpers/teamDataHelpers';

import Firebase from 'config/Firebase';
import { parseJSON } from 'date-fns/esm';

const ThreeProgressCircles = (props) => {
   const { team, teamsStore, smashStore, goToTeamArena } = props;


   const navigation = useNavigation();
   const { kFormatter, checkInfinity, setHomeTabsIndex, setQuickViewTeam } =
      smashStore;

   const {
      weeklyActivityHash,

      endOfCurrentWeekKey,
   } = teamsStore;

   const teamWeeklyKey = `${team.id}_${endOfCurrentWeekKey}`;

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
      teamWeekScore = 0,
      alreadyWonWeek = false,
      teamWeekProgress = 0,
      score = 0,
   } = weeklyActivity;

   const overBy = myScoreToday - myTargetToday;

   const remainingToday =
      myScoreToday < myTargetToday ? myTargetToday - myScoreToday : 0;
   const showLessThanOne = teamTodayProgress > 0 && teamTodayProgress < 1;

   const { uid } = Firebase.auth.currentUser;

   const goToMeToday = () => {
      Vibrate();
      smashStore.navigation = navigation;
      setQuickViewTeam({ ...team, meToday: true });
      // setHomeTabsIndex(2);
      // goToTeamArena(team);
   };;

   const goToTeamToday = () => {
      Vibrate();
      // setHomeTabsIndex(3);
      // goToTeamArena(team);
      smashStore.navigation = navigation;
      setQuickViewTeam({ ...team, teamToday: true });
   };
   const goToTeamWeek = () => {
      Vibrate();
      // setHomeTabsIndex(4);
      // goToTeamArena(team);
      smashStore.navigation = navigation;
      setQuickViewTeam({ ...team, teamWeek: true });
   };

   const { actions } = team;
   const activities = actions ? Object.values(actions) : [];
   const numberOfActivities = activities.length;

   const circleFontSize = 22;

   const circleSize = width / 5;

   const circleWidth = 12;

   const defaultColor = '#333';

   const fontWeight = 'regular';
   const justToday = true;

   if (teamWeekProgress >= 100) {
      return null;
   }

   const sizeChanger = 1;
   return (
      <View row centerV centerH marginB-16 style={{backgroundColor: '#fafafa', width: width - 64, padding: 24, borderColor: '#eee', borderWidth: 0}}>
         <TouchableOpacity
            onPress={goToTeamToday}
            style={{
               // position: 'absolute',
               // top: 100,
               // right: 24,
               marginHorizontal: 0,
               zIndex: 999999,
            }}>
            <AnimatedView style={{ marginRight: 0 }}>
               <CircularProgressBar
                  justToday={justToday}
                  size={circleSize - 10 * sizeChanger}
                  circle={false}
                  fontWeight={fontWeight}
                  topText={kFormatter(teamTodayScore || 0)}
                  smallBottomText={'Team'}
                  width={circleWidth - 4}
                  fontSize={circleFontSize - 7}
                  score={
                     teamTodayProgress < 0
                        ? 'DONE'
                        : parseInt(teamTodayProgress)
                  }
                  overBy={overBy}
                  textColor={defaultColor || Colors.teamToday}
                  showLessThanOne={showLessThanOne}
                  alreadyReached={teamTodayProgress >= 100 || alreadyWonWeek}
                  fill={checkInfinity(teamTodayProgress)}
                  showPercent={true}
                  hidePercent={false}
                  tintColor={
                     teamTodayProgress >= 100
                        ? Colors.teamToday
                        : Colors.teamToday
                  }
               />
               {teamTodayProgress >= 100 && (
                  <LottieAnimation
                     autoPlay
                     loop={false}
                     style={{
                        height: 50,
                        zIndex: 0,
                        top: 2,
                        right: -5,
                        position: 'absolute',
                     }}
                     source={require('../../../../lottie/win-day3.json')}
                  />
               )}
            </AnimatedView>
         </TouchableOpacity>
         <AnimatedView style={{ marginHorizontal: 16 }}>
            <TouchableOpacity onPress={goToMeToday}>
               <CircularProgressBar
                  size={circleSize + 10}
                  topText={kFormatter(myScoreToday || 0)}
                  // bottomText={'Target: ' + myTargetToday}
                  width={circleWidth - 4}
                  smallBottomText={'YOU'}
                  score={
                     myTodayProgress < 0 ? 'DONE' : parseInt(myTodayProgress)
                  }
                  fontSize={circleFontSize}
                  overBy={overBy}
                  fontWeight={fontWeight}
                  textColor={defaultColor || Colors.meToday}
                  showLessThanOne={showLessThanOne}
                  fill={checkInfinity(myTodayProgress)}
                  showPercent={true}
                  alreadyReached={myTodayProgress >= 100 || alreadyWonWeek}
                  tintColor={
                     myTodayProgress >= 100 ? Colors.meToday : Colors.meToday
                  }
               />
            </TouchableOpacity>

            {myTodayProgress >= 100 && (
               <LottieAnimation
                  autoPlay
                  loop={false}
                  style={{
                     height: 50,
                     zIndex: 0,
                     top: 0,
                     right: -5,
                     position: 'absolute',
                  }}
                  source={require('../../../../lottie/win-day3.json')}
               />
            )}
         </AnimatedView>
         {true && (
            <AnimatedView>
               <TouchableOpacity onPress={goToTeamWeek}>
                  <CircularProgressBar
                     justToday={justToday}
                     size={circleSize - 10 * sizeChanger}
                     fontWeight={fontWeight}
                     topText={kFormatter(teamWeekScore || 0)}
                     smallBottomText={'WEEK'}
                     // topText={`${currentUser.name} Today`}
                     // bottomText={myScoreToday}
                     width={circleWidth - 4}
                     score={kFormatter(teamWeekScore)}
                     overBy={overBy}
                     textColor={defaultColor || Colors.buttonLink}
                     fontSize={circleFontSize - 7}
                     // showLessThanOne={showLessThanOne}
                     alreadyReached={teamWeekProgress >= 100 || alreadyWonWeek}
                     fill={checkInfinity(teamWeekProgress)}
                     showPercent={true}
                     tintColor={
                        teamWeekProgress >= 100
                           ? Colors.buttonLink
                           : Colors.buttonLink
                     }
                  />
               </TouchableOpacity>
               {teamWeekProgress >= 100 && (
                  <LottieAnimation
                     autoPlay
                     loop={false}
                     style={{
                        height: 50,
                        zIndex: 0,
                        top: -3,
                        right: -5,
                        position: 'absolute',
                     }}
                     source={require('../../../../lottie/win-day3.json')}
                  />
               )}
            </AnimatedView>
         )}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(ThreeProgressCircles));
