import { getDayChar, getWeekDayKeys, isToday } from 'helpers/generalHelpers';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { inject, observer } from 'mobx-react';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
// import { useNavigation } from '@react-navigation/core';
import SmartImage from 'components/SmartImage/SmartImage';
import LottieAnimation from 'components/LottieAnimation';
import { dayKeyIsInFuture } from 'helpers/dateHelpers';


import {
   getDefaultWeeklyActivity
} from 'helpers/teamDataHelpers';
import Box from './Box';
// import Firebase from 'config/Firebase';
const WeeklyDayTargets = (props) => {
   const { smashStore, color, player = false, teamsStore, team = {}, showLeaders = false } = props;

   const teamId = team?.id;
   
   const { weeklyActivityHash, currentTeam, myTeamsHash,endOfCurrentWeekKey } = teamsStore;

   const { stringLimit, endWeekKey, smashing, getWeekKeys } = smashStore;

   const teamWeeklyKey = `${teamId}_${endWeekKey}`;

   const weeklyActivity = props.teamWeeklyActivity ||
      weeklyActivityHash?.[teamWeeklyKey] ||
      getDefaultWeeklyActivity(currentTeam);

      const dayLabelsThisWeek = getWeekDayKeys(weeklyActivity?.endWeekKey || endOfCurrentWeekKey);

   const { daily } = weeklyActivity;
   const users = weeklyActivity?.allPlayers;

   const goToTeamDay = (dayKey) => {

      if (dayKeyIsInFuture(dayKey)) {
         return;
      }
      smashStore.navigation.navigate('SingleTeamDay', {
         dayKey,
         team: myTeamsHash?.[teamId] || { id: teamId },
      });
   };

   return (
      <Box style={{ marginHorizontal: 0, borderWidth: 0, flex: 1, padding: 16 }}>
    
         <View row spread marginB-0 style={{ borderWidth: 0, marginTop: 0 }}>
         {dayLabelsThisWeek.map((dayKey, index) => {
            const dayScore = daily?.[dayKey]?.score || 0;
            const dayTarget = daily?.[dayKey]?.teamTarget || 0;
            const progress = (dayScore / dayTarget) * 100 || 0;

            const todayPlayers = daily?.[dayKey]?.players || {};
            let winnerUserId = '';
            let winnerHighScore = 0;

            Object.keys(todayPlayers).forEach((userId) => {
               const user = todayPlayers[userId] || {};
               if (user?.score > winnerHighScore) {
                  winnerUserId = userId;
                  winnerHighScore = user?.score;
               }
               // const winnerUserId =
            });
            const today = isToday(dayKey);
            const noTargetThisDay = dayTarget <= 0 ? true : false;
            const hasWinner = winnerUserId?.length > 1;
            return (
               <TouchableOpacity
                  onPress={() => goToTeamDay(dayKey)}
                  marginR-4
                  key={dayKey}
                >
                  <AnimatedCircularProgress
                     size={today ? 37 : 37}
                     fill={noTargetThisDay && dayScore > 0 ? 100 : progress}
                     rotation={0}
                     width={3}
                     style={{ marginHorizontal: 2 }}
                     fillLineCap="round"
                     tintColor={
                        progress >= 100
                           ? Colors.green40
                           : Colors.teamToday || '#ccc'
                     }
                     backgroundColor={'#eee'}>
                     {(fill) => (
                        <View centerV centerH>
                           <Text
                              B12
                              secondaryContent
                              style={{

                                 textDecorationLine: today
                                    ? 'underline'
                                    : 'none',
                                 // fontSize: 12,
                                 color: today
                                    ? '#777'
                                    : progress > 100
                                    ? Colors.green40
                                    : '#ccc',
                              }}>
                              {stringLimit(getDayChar(dayKey), 1, false)}
                           </Text>
                        </View>
                     )}
                  </AnimatedCircularProgress>
                  {/* <Text>{progress}</Text> */}

                  {progress >= 100 && (
                     <LottieAnimation
                        autoPlay
                        loop={false}
                        style={{
                           height: 35,
                           zIndex: 0,
                           top: -3,
                           right: -4,
                           position: 'absolute',
                           // backgroundColor: '#333',
                        }}
                        source={require('../lottie/win-day3.json')}
                     />
                  )}

                  {noTargetThisDay && progress < 100 && dayScore > 0 && (
                     <LottieAnimation
                        autoPlay
                        loop={true}
                        style={{
                           height: 30,
                           zIndex: 0,
                           top: -3,
                           right: -3,
                           position: 'absolute',
                           // backgroundColor: '#333',
                        }}
                        source={require('../lotties/fire-2.json')}
                     />
                  )}
                  {hasWinner && showLeaders && (
                     <SmartImage
                        uri={users?.[winnerUserId]?.picture?.uri}
                        preview={users?.[winnerUserId]?.picture?.preview}
                        style={{
                           width: 15,
                           height: 15,
                           right: -3,
                           bottom: 2,
                           borderRadius: 30,
                           position: 'absolute',
                           backgroundColor: '#333',
                        }}
                     />
                  )}
               </TouchableOpacity>
            );
         })}
      </View>
      </Box>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(WeeklyDayTargets));
