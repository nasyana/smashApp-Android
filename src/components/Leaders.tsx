import React from 'react';
import { getDayChar, isToday } from 'helpers/generalHelpers';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { inject, observer } from 'mobx-react';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
// import { useNavigation } from '@react-navigation/core';
import { uid } from 'helpers/generalHelpers';
import SmartImage from 'components/SmartImage/SmartImage';
import LottieAnimation from 'components/LottieAnimation';
import { dayKeyIsInFuture } from 'helpers/dateHelpers';
import { width } from 'config/scaleAccordingToDevice';


import {
   getTeamData,
   getDefaultWeeklyActivity,
   checkInfinity,
} from 'helpers/teamDataHelpers';
import Box from './Box';
// import Firebase from 'config/Firebase';
const Leaders = (props) => {
   const { smashStore, color, player = false, teamsStore, team = {} } = props;

   // const { navigate } = useNavigation();
   const teamId = team?.id;
   // const {uid} = Firebase.auth.currentUser;
   const { weeklyActivityHash, currentTeam, myTeamsHash } = teamsStore;

   const { dayLabelsThisWeek, stringLimit, endWeekKey, smashing } = smashStore;

   const teamWeeklyKey = `${teamId}_${endWeekKey}`;

   // if (smashing) {
   //    return null;
   // }
   const weeklyActivity =
      weeklyActivityHash?.[teamWeeklyKey] ||
      getDefaultWeeklyActivity(currentTeam);

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
      <Box style={{ marginHorizontal: 0, borderWidth: 0, flex: 1, padding: 16, paddingBottom: 8 }}>
         {/* <Text R14>Team This Week</Text> */}
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
                     style={
                        {
                           // backgroundColor: '#333',
                           // borderRadius: 30,
                        }
                     }>
                     {/* <AnimatedCircularProgress
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
                                 secondaryContent
                                 style={{
                                    fontWeight: 'bold',
                                    textDecorationLine: today
                                       ? 'underline'
                                       : 'none',
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
                     </AnimatedCircularProgress> */}
                     {/* <Text>{progress}</Text> */}

                     {/* {progress >= 100 && (
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
                     )} */}

                     {/* {noTargetThisDay && progress < 100 && dayScore > 0 && (
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
                     )} */}


                     {hasWinner && (
                        <SmartImage
                           uri={users?.[winnerUserId]?.picture?.uri}
                           preview={users?.[winnerUserId]?.picture?.preview}
                           style={{
                              width: 27,
                              height: 27,
                              // right: -3,
                              bottom: 2,
                              borderRadius: 30,
                              marginHorizontal: 5,
                              // position: 'absolute',
                              backgroundColor: '#333',
                           }}
                        />
                     )}

                     {hasWinner && <Text

                        B12
                        center
                        secondaryContent
                        style={{

                           textDecorationLine: today
                              ? 'underline'
                              : 'none',
                           fontSize: 12,
                           color: today
                              ? '#777'
                              : progress > 100
                                 ? Colors.green40
                                 : '#ccc',
                        }}>
                        {stringLimit(getDayChar(dayKey), 1, false)}
                     </Text>}

                     {hasWinner && <Text style={{ position: 'absolute', top: -12, right: -4, transform: [{ rotate: '30deg' }], fontSize: 16 }}>👑</Text>}
                     {!hasWinner && <View style={{
                        width: 37,
                        height: 37,
                        // right: -3,
                        bottom: 2,
                        borderRadius: 30,
                        // position: 'absolute',
                        backgroundColor: 'transparent',
                     }} />}
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
)(observer(Leaders));
