import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import SmartImage from '../../../components/SmartImage/SmartImage';
import Box from '../../../components/Box';
import AnimatedView from '../../../components/AnimatedView';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { Vibrate } from 'helpers/HapticsHelpers';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';

import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/core';
import { width, height } from 'config/scaleAccordingToDevice';
import LottieAnimation from 'components/LottieAnimation';
import WeeklyDayTargets from 'components/WeeklyDayTargets';
import SectionHeader from 'components/SectionHeader';

import TeamScrollView from 'components/TeamScrollView';
import {
   getTeamData,
   getDefaultWeeklyActivity,
   checkInfinity,
   getTeamWeeklyData,
   getDaysLeft,
} from 'helpers/teamDataHelpers';

import { uid, unixToFromNow } from 'helpers/generalHelpers';
import Firebase from 'config/Firebase';
import { parseJSON } from 'date-fns/esm';
import ThreeProgressCircles from './TodayTeamTargetListItemComponents/ThreeProgressCircles';
import ThreeProgress from './TodayTeamTargetListItemComponents/ThreeProgress';
import LastSmashedBy from './TodayTeamTargetListItemComponents/LastSmashedBy';
import ConfettiLottie from './TodayTeamTargetListItemComponents/ConfettiLottie';
import WeekSmashed from './TodayTeamTargetListItemComponents/WeekSmashed';
import TeamUnreads from './TodayTeamTargetListItemComponents/TeamUnreads';
import Shimmer from 'components/Shimmer';
import TeamListItemProgress from 'modules/MyTeamsHome/TeamProgress/TeamListItemProgress';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const TodayTeamTargetListItem = ({ smashStore, teamId, index, teamsStore }) => {
   const navigation = useNavigation();
   const {
      stringLimit,
      kFormatter,
      setMasterIdsToSmash,
      setHomeTabsIndex,
      subscribeToUserStories,
      setQuickViewTeam,
      endWeekKey,
   } = smashStore;

   const {
      todayDateKey,
      setTeamUsersByTeamId,
      weeklyActivityHash,
      setVoteDocsHash,
      setWeeklyActivityInHash,
      setTeamTodayActivityByTeamId,
      myTeams,
      endOfCurrentWeekKey,
   } = teamsStore;

   const team = myTeams?.[index] || {};
   const [weekDone, setWeekDone] = useState(false);
   const { navigate } = useNavigation();
   const [loaded, setLoaded] = useState(false);
   const [full, setFull] = useState(false);
   useEffect(() => {
      setTimeout(() => {
         setLoaded(true);
      }, (index + 1) * 500);

      return () => {};
   }, []);

   useEffect(() => {
      Firebase.firestore
         .collection('votes')
         .doc(teamId)
         .onSnapshot((voteDocSnap) => {
            const voteDoc = voteDocSnap?.data();

            setVoteDocsHash(voteDoc, teamId);
         });

      return () => {};
   }, []);

   useEffect(() => {
      team?.joined?.map((uid) => {
         if (!smashStore.subscribedToUsers?.[uid]) {
            subscribeToUserStories(uid, todayDateKey);
            /// Also subscribes to user doc in allUsersHash
         }
      });

      return () => {
         smashStore.unSub?.map((unsub) => {
            unsub();
         });
      };
   }, [team.joined, todayDateKey]);

   useEffect(() => {
      const unsubscribeToPlayers = Firebase.firestore
         .collection('users')

         .where('teams', 'array-contains', team.id)
         .limit(30)
         .onSnapshot((snaps) => {
            if (!snaps.empty) {
               const playersArray = [];
               snaps.forEach((snap) => {
                  if (!snap.exists) return;
                  const user = snap.data();
                  playersArray.push(user);
               });

               setTeamUsersByTeamId(team.id, playersArray);
            }
         });

      return () => (unsubscribeToPlayers ? unsubscribeToPlayers() : null);
   }, []);

   useEffect(() => {
      const { id } = team;
      const unsubTeamDaily = Firebase.firestore
         .collection('dailyActivity')
         .doc(`${team.id}_${todayDateKey}`)
         .onSnapshot((doc: any) => {
            if (doc.exists) {
               const dailyDoc = doc.data();

               setTeamTodayActivityByTeamId(id, dailyDoc);
            }
         });

      const weeklyTeamKey = `${team.id}_${endOfCurrentWeekKey}`;

      let unsubWeekly = Firebase.firestore
         .collection('weeklyActivity')
         .doc(weeklyTeamKey)
         .onSnapshot((snap) => {
            if (snap.exists) {
               const weeklyActivityDoc = snap.data();
               const weeklyActivityData = getTeamWeeklyData(
                  weeklyActivityDoc,
                  team,
               );

               if (weeklyActivityData) {
                  setWeekDone(
                     weeklyActivityData.score >
                        weeklyActivityData.thisWeekTarget,
                  );
               }

               setWeeklyActivityInHash(weeklyTeamKey, weeklyActivityData);
            }
         });

      return () => {
         if (unsubWeekly) {
            unsubWeekly();
         }

         if (unsubTeamDaily) {
            unsubTeamDaily();
         }
      };
   }, []);

   const smashTeamActivities = () => {
      setMasterIdsToSmash(team.masterIds);
   };

   const goToTeamArenaPre = () => {
      Vibrate();
      setHomeTabsIndex(0);
      goToTeamArena(team);
   };

   const goToRecent = () => {
      Vibrate();
      // setHomeTabsIndex(0);
      // goToTeamArena(team);
      smashStore.navigation = navigation;
      setQuickViewTeam({ ...team, recent: true });
   };

   const goToTeamChat = () => {
      navigate('Chat', {
         stream: { streamId: team.id, streamName: team.name },
         streamId: team.id,
         streamName: team.name,
      });
   };

   const goToTeamArena = (team, initialIndex) => {
      navigate(Routes.TeamArena, { team, initialIndex: 1 || 0 });
   };

   const goToTeamWeek = () => {
      Vibrate();
      // setHomeTabsIndex(4);
      // goToTeamArena(team);
      smashStore.navigation = navigation;
      setQuickViewTeam({ ...team, teamContribution: true });
   };

   const teamWeeklyKey = `${team.id}_${endWeekKey}`;

   const weeklyActivity = weeklyActivityHash?.[teamWeeklyKey] || {};
   const {
      teamTodayScore = 0,
      teamTargetToday = 0,
      teamTodayProgress = 0,
      myScoreToday = 0,
      myTargetToday = 0,
      myTodayProgress = 0,
   } = weeklyActivity;

   

   if (!loaded) {
      return (
         <Shimmer
            style={{
               width: width - 32,
               height: height - 100,
               marginHorizontal: 16,
               borderRadius: 7,
               marginBottom: 16,
            }}
         />
      );
   }

   const circularSize = 25;
   // console.log('weekDone', weekDone, team.name);
   return (
      <>
         <AnimatedView
            fade
            onPress={goToTeamArenaPre}
            style={{ marginBottom: 0, flex: 1, marginTop: 8 }}>
            <>
               <SectionHeader
                  title={team.name}
                  style={{ marginLeft: 32, marginTop: weekDone ? 0 : 24 }}
               />
               <TeamScrollView team={team} home />
               <Box
                  style={{
                     marginRight: 8,
                     marginTop: 0,
                     width: width - 32,
                     padding: 24,
                     overflow: 'hidden',
                     backgroundColor: '#fff',
                     top: 0,
                  }}>
                  <ConfettiLottie team={team} />
                  <View onPress={goToTeamArenaPre}>
                     <View flex centerV marginB-24>
                        {false && (
                           <View row spread style={{ top: -8 }}>
                              <View />
                              <TouchableOpacity
                                 onPress={() => setFull(!full)}
                                 style={{
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    padding: 4,
                                    paddingHorizontal: 8,
                                    backgroundColor: '#fff', //
                                 }}>
                                 {full ? (
                                    // <AntDesign name="down" size={17} />
                                    <Text secondaryContent>
                                       Show Less{' '}
                                       <AntDesign name="down" size={14} />
                                    </Text>
                                 ) : (
                                    // <AntDesign name="up" size={14} />
                                    <Text secondaryContent>
                                       Show More{' '}
                                       <AntDesign name="up" size={14} />
                                    </Text>
                                 )}
                              </TouchableOpacity>
                           </View>
                        )}
                        <View row spread>
                           <View flex>
                              {team?.name && (
                                 <Text H18>
                                    {stringLimit(team?.name, 25)}
                                    {/* {kFormatter(team.mostRecentTarget)}) */}
                                 </Text>
                              )}
                              <Text
                                 H10
                                 color97
                                 style={{
                                    textTransform: 'uppercase',
                                    letterSpacing: 0,
                                 }}>
                                 {team.motto}
                              </Text>

                              {false && (
                                 <View marginT-16 marginB-4 centerV>
                                    {/* <AntDesign
                                    name={'addusergroup'}
                                    size={14}
                                    color={Colors.buttonLink}
                                 />
                                 <Text H10 color97 darkGrey marginL-4>
                                    {team?.joined?.length || 1}{' '}
                                    {team?.joined?.length == 1
                                       ? 'PLAYER'
                                       : 'PLAYERS'}
                                 </Text> */}
                                    <Text B12 secondaryContent>
                                       ME TODAY{' '}
                                    </Text>
                                    <Text H10 color97 darkGrey>
                                       <Text meToday>
                                          {kFormatter(myScoreToday)}{' '}
                                       </Text>
                                       / {kFormatter(myTargetToday)}
                                    </Text>
                                 </View>
                              )}
                              {false && (
                                 <View centerV>
                                    <Text B12 secondaryContent>
                                       TEAM TODAY:{' '}
                                    </Text>
                                    <Text H10 color97 darkGrey>
                                       <Text teamToday>
                                          {kFormatter(teamTodayScore)}
                                       </Text>{' '}
                                       / {kFormatter(teamTargetToday)}
                                    </Text>
                                    {/* <AntDesign
                                    name={'calendar'}
                                    size={14}
                                    color={Colors.buttonLink}
                                 />

                                 <Text H10 color97 darkGrey marginL-4>
                                    {getDaysLeft()} DAYS
                                 </Text> */}
                                 </View>
                              )}
                           </View>
                           <View flex row>
                              {false && (
                                 <TouchableOpacity
                                    onPress={goToTeamWeek}
                                    style={{
                                       backgroundColor: '#fafafa',
                                       width: '50%',
                                       height: width / 3.5,
                                       borderRadius: 5,
                                       alignItems: 'center',
                                       justifyContent: 'center',
                                       marginRight: 4,
                                       paddingTop: 4,
                                       paddingHorizontal: 4,
                                    }}>
                                    <AntDesign
                                       size={16}
                                       name="star"
                                       color={Colors.smashPink}
                                    />
                                    <Text
                                       center
                                       R10
                                       smashPink
                                       marginT-4
                                       padding-8>
                                       THIS WEEK SCORE
                                    </Text>
                                    <Text H18 marginT-8 paddingT-0>
                                       <Text
                                          smashPink
                                          B18
                                          style={{ letterSpacing: -1 }}>
                                          {kFormatter(
                                             team?.scores?.[
                                                endOfCurrentWeekKey
                                             ] || 0,
                                          )}
                                          {/* {score} */}
                                       </Text>
                                    </Text>
                                 </TouchableOpacity>
                              )}
                              <View
                                 style={{
                                    backgroundColor: '#fafafa',
                                    width: '50%',
                                    height: width / 3.5,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 4,
                                    paddingTop: 4,
                                 }}>
                                 {/* <Feather
                                    size={16}
                                    name="target"
                                    color={Colors.meToday}
                                 /> */}
                                 <AnimatedCircularProgress
                                    size={circularSize}
                                    fill={myTodayProgress}
                                    rotation={0}
                                    width={4}
                                    style={{
                                       marginHorizontal: 2,
                                       marginVertical: 8,
                                    }}
                                    fillLineCap="round"
                                    tintColor={Colors.meToday}
                                    backgroundColor={'#eee'}>
                                    {/* {(fill) => (
                                       <Text secondaryContent>
                                          {myTodayProgress}
                                       </Text>
                                    )} */}
                                 </AnimatedCircularProgress>
                                 <Text center R10 meToday marginT-4>
                                    MY TARGET TODAY
                                 </Text>
                                 <Text H18 marginT-4 paddingT-0>
                                    <Text
                                       meToday
                                       B18
                                       style={{ letterSpacing: -1 }}>
                                       {parseInt(myTodayProgress)}%
                                    </Text>
                                 </Text>
                              </View>

                              <View
                                 style={{
                                    backgroundColor: '#fafafa',
                                    width: '50%',
                                    height: width / 3.5,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 4,
                                    paddingTop: 4,
                                 }}>
                                 {/* <Feather
                                    size={16}
                                    name="target"
                                    color={Colors.teamToday}
                                 /> */}
                                 <AnimatedCircularProgress
                                    size={circularSize}
                                    fill={teamTodayProgress}
                                    rotation={0}
                                    width={4}
                                    style={{
                                       marginHorizontal: 2,
                                       marginVertical: 8,
                                    }}
                                    fillLineCap="round"
                                    tintColor={Colors.teamToday}
                                    backgroundColor={'#eee'}>
                                    {/* {(fill) => (
                                       <Text secondaryContent>
                                          {myTodayProgress}
                                       </Text>
                                    )} */}
                                 </AnimatedCircularProgress>
                                 <Text center R10 teamToday marginT-4>
                                    TODAY TEAM TARGET
                                 </Text>
                                 <Text H18 marginT-4 paddingT-0>
                                    <Text
                                       teamToday
                                       B18
                                       style={{ letterSpacing: -1 }}>
                                       {parseInt(teamTodayProgress)}%
                                    </Text>
                                 </Text>
                              </View>
                              {/* <View
                                 style={{
                                    backgroundColor: '#fafafa',
                                    width: '50%',
                                    height: width / 3.5,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 4,
                                    paddingTop: 4,
                                 }}>
                                 <Feather
                                    size={16}
                                    name="target"
                                    color={Colors.buttonLink}
                                 />
                                 <Text center R10 buttonLink marginT-4>
                                    THIS WEEK TARGET
                                 </Text>
                                 <Text H18 marginT-8 paddingT-0>
                                    <Text
                                       buttonLink
                                       B18
                                       style={{ letterSpacing: -1 }}>
                                       {kFormatter(team?.mostRecentTarget)}
                                    </Text>
                                 </Text>
                              </View> */}
                           </View>
                        </View>
                     </View>
                     {full && (
                        <View centerV centerH>
                           <ThreeProgressCircles
                              team={team}
                              goToTeamArena={goToTeamArena}
                           />

                           {/* <ThreeProgress
                           team={team}
                           goToTeamArena={goToTeamArena}
                        /> */}
                        </View>
                     )}
                  </View>

                  <TeamListItemProgress team={team} />
                  {/* <View style={{ backgroundColor: '#fafafa' }} paddingH-8> */}
                  {full && (
                     <SectionHeader
                        title="This Week"
                        style={{ marginLeft: 0, marginTop: 0 }}
                     />
                  )}
                  {full && (
                     <WeeklyDayTargets
                        // teamWeeklyActivity={weeklyActivity}
                        {...{ team }}
                        color={Colors.blue10}
                     />
                  )}

                  <View row spread centerV marginT-24={full}>
                     <LastSmashedBy teamId={teamId} goToRecent={goToRecent} />
                     <TouchableOpacity row centerV onPress={goToTeamArenaPre}>
                        <Text H12 buttonLink marginR-8 paddingB-0 marginB-0>
                           {team.battle ? 'GO TO TEAM AREA' : 'GO TO TEAM AREA'}
                        </Text>
                        <AntDesign
                           name="right"
                           size={16}
                           color={Colors.buttonLink}
                        />
                     </TouchableOpacity>
                  </View>
                  {/* </View> */}
               </Box>
               <WeekSmashed {...{ smashStore, teamsStore, team }} />

               <TeamUnreads
                  {...{ smashStore, teamsStore, team, goToTeamChat }}
               />
            </>
         </AnimatedView>
      </>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TodayTeamTargetListItem));
