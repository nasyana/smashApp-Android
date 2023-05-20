import { inject, observer } from 'mobx-react';
import Box from '../../../components/Box';
import AnimatedView from '../../../components/AnimatedView';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { width } from 'config/scaleAccordingToDevice';
import CircularProgressBar from 'components/CircularProgressBar';
import WeeklyDayTargets from 'components/WeeklyDayTargets';
;

import {
   getTeamData,
   getDefaultWeeklyActivity, getTeamWeeklyData
} from 'helpers/teamDataHelpers';

import LottieAnimation from 'components/LottieAnimation';
import SectionHeader from 'components/SectionHeader';
import { ScrollView } from 'react-native';

const WeekTeamTarget = ({
   SPACING = 16,
   expandCard,
   goToTeamArena,
   weekDoc = false,
   smashStore,
   team,
   teamsStore,
   justToday,
}) => {
   const unit = 'pts';
   const {
      numberWithCommas,
      kFormatter,
      checkInfinity,
      setMasterIdsToSmash,
      // smashing,
   } = smashStore;

   const { weeklyActivityHash, endOfCurrentWeekKey } = teamsStore;



   const teamWeeklyKey = `${team.id}_${endOfCurrentWeekKey}`;

   const weeklyActivity = 
      weeklyActivityHash?.[teamWeeklyKey] || getDefaultWeeklyActivity(team);

   const {
      teamTodayProgress = 0,
      myScoreToday = 0,
      myTargetToday = 0,
      myTodayProgress = 0,
      thisWeekTarget = 0,
      alreadyWonWeek,
      score,
   } = weeklyActivity;


   const overBy = score - thisWeekTarget;
   const showLessThanOne = teamTodayProgress > 0 && teamTodayProgress < 1;
   const weekProgress = checkInfinity(score / thisWeekTarget) * 100;

  
   return (
      <View
 
         style={{ paddingTop: 16 }}>
        
         <SectionHeader title="This Week Team Targets" 
         
  
          />

            {weekProgress >= 100 && (
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
            

            {true && (
               <View
                  spread
                  centerV
                  style={{ paddingBottom: SPACING, paddingHorizontal: 16 }}>
                 
               <View marginT-0 >
                     <WeeklyDayTargets
                        teamWeeklyActivity={weeklyActivity}
                        {...{ team }}
                     />
                   
                  </View>
            
                  {weekProgress >= 100 && false && (
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
)(observer(WeekTeamTarget));
