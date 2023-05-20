import React from 'react';
import { getDayChar, isToday } from 'helpers/generalHelpers';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { inject, observer } from 'mobx-react';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { uid } from 'helpers/generalHelpers';
import SmartImage from 'components/SmartImage/SmartImage';
import LottieAnimation from 'components/LottieAnimation';
import {
   getTeamData,
   getDefaultWeeklyActivity,
   checkInfinity,
} from 'helpers/teamDataHelpers';
// import Firebase from 'config/Firebase';
const WeeklyTeamPlayerDayTargets = (props) => {
   const {
      smashStore,
      color,
      player = false,
      teamsStore,
      teamWeeklyActivity = false,
      item
   } = props;

   const {
      weeklyActivityHash,
      currentTeam,
      weeksDayKeys
   } = teamsStore;

   const { dayLabelsThisWeek, stringLimit, endWeekKey, smashing, } = smashStore;
   // if (smashing) {
   //    return null;
   // }
   const weeksKeys = weeksDayKeys(item.endWeekKey);



   // const {uid} = Firebase.auth.currentUser;

   const teamId = item?.teamId || currentTeam.id;

   const teamWeeklyKey = `${teamId}_${endWeekKey}`;

   const weeklyActivity =
      weeklyActivityHash?.[teamWeeklyKey] ||
      getDefaultWeeklyActivity(currentTeam);

   const { daily = {} } = weeklyActivity;



const weekIsAlreadyWon = weeklyActivity?.score > weeklyActivity?.target;

const currentUserId = player?.id || uid();

const users = weeklyActivity?.allPlayers;

return (
   <View row spread marginB-0>
      {weeksKeys.map((dayKey, index) => {
         const dayScore = daily?.[dayKey]?.players?.[currentUserId]?.score || 0;
         const dayTarget =
            daily?.[dayKey]?.players?.[currentUserId]?.target || 0;
         const progress = (dayScore / dayTarget) * 100 || 0;

         const alreadyWon = weekIsAlreadyWon && dayTarget <= 0;
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

         const hasWinner =
            winnerUserId?.length > 1 && winnerUserId == player.uid;
         return (
            <View
               marginR-4
               key={dayKey}
               style={
                  {
                     // backgroundColor: '#333',
                     // borderRadius: 30,
                  }
               }>
               <AnimatedCircularProgress
                  size={today ? 37 : 37}
                  fill={alreadyWon ? 100 : progress}
                  rotation={0}
                  width={3}
                  style={{ marginHorizontal: 2 }}
                  fillLineCap="round"
                  tintColor={
                     alreadyWon
                        ? dayScore > 0
                           ? 'gold'
                           : '#eee'
                        : progress > 100
                        ? Colors.green40
                        : Colors.teamToday || '#ccc'
                  }
                  backgroundColor={'#eee'}>
                  {(fill) => (
                     <View centerV centerH>
                        <Text
                           secondaryContent
                           style={{
                              fontWeight: 'bold',
                              textDecorationLine: today ? 'underline' : 'none',
                              fontSize: 12,
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
               {hasWinner && (
                  <LottieAnimation
                     autoPlay
                     loop={false}
                     style={{
                        height: 30,
                        zIndex: 0,
                        top: -7,
                        right: 2,
                        position: 'absolute',
                        // backgroundColor: '#333',
                     }}
                     source={require('../lottie/crown.json')}
                  />
               )}

               {alreadyWon && dayScore > 0 && !hasWinner && (
                  <LottieAnimation
                     autoPlay
                     loop={false}
                     style={{
                        height: 40,
                        zIndex: 0,
                        top: -4,
                        right: -4,
                        position: 'absolute',
                        // backgroundColor: '#333',
                     }}
                     source={require('../lottie/win-day3.json')}
                  />
               )}
               {progress >= 100 && (
                  <LottieAnimation
                     autoPlay
                     loop={false}
                     style={{
                        height: 40,
                        zIndex: 0,
                        top: -4,
                        right: -4,
                        position: 'absolute',
                        // backgroundColor: '#333',
                     }}
                     source={require('../lottie/win-day3.json')}
                  />
               )}
               {hasWinner && (
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
            </View>
         );
      })}
   </View>
);
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(WeeklyTeamPlayerDayTargets));
