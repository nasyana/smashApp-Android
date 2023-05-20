import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import SmartImage from '../../../components/SmartImage/SmartImage';
import Box from '../../../components/Box';
import AnimatedView from '../../../components/AnimatedView';
import {
   View,
   Text,
   Colors,
   TouchableOpacity,
   ProgressBar,
} from 'react-native-ui-lib';
import { Vibrate } from 'helpers/HapticsHelpers';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import TeamPieChart from 'components/TeamPieChart';
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/core';
import { width, height } from 'config/scaleAccordingToDevice';
import LottieAnimation from 'components/LottieAnimation';
import WeeklyDayTargets from 'components/WeeklyDayTargets';
import SectionHeader from 'components/SectionHeader';

import TeamScrollViewWeek from 'components/TeamScrollView/TeamScrollViewWeek';

import LastSmashedBy from './TodayTeamTargetListItemComponents/LastSmashedBy';
import ConfettiLottie from './TodayTeamTargetListItemComponents/ConfettiLottie';
import WeekSmashed from './TodayTeamTargetListItemComponents/WeekSmashed';
import TeamUnreads from './TodayTeamTargetListItemComponents/TeamUnreads';

import Shimmer from 'components/Shimmer';
import TeamListItemProgress from 'modules/MyTeamsHome/TeamProgress/TeamListItemProgress';
import TeamLeaderboard from 'components/TeamScrollView/TeamLeaderboard';
import TeamLeaderboardClean from 'components/TeamScrollView/TeamLeaderboardClean';
import ButtonLinear from 'components/ButtonLinear';
import Leaders from 'components/Leaders';

function PlayerWantsToJoin(props) {
   return (
      <TouchableOpacity
         onPress={props.onPressApproveUsers}
         row
         style={{
            backgroundColor: Colors.smashPink,
            alignItems: 'center',
            justifyContent: 'center',
            // marginBottom: 24,
            width: width / 2,

            paddingVertical: 8,

            // width: 25,
            // height: 25,

            borderRadius: 25,
         }}>
         <AntDesign name="adduser" size={16} color={Colors.white} />
         <Text white B14>
            {props.team?.requested?.length}{' '}
            {props.team?.requested?.length == 1
               ? 'Player wants to join!'
               : 'Players want to join!'}
         </Text>
      </TouchableOpacity>
   );
}

function ViewTutorial(props) {
   return (
      <TouchableOpacity
         onPress={() =>
            (props.smashStore.tutorialVideo =
               props.smashStore?.settings?.tutorials?.teams?.firstTeam)
         }
         row
         style={{
            backgroundColor: Colors.smashPink,
            alignItems: 'center',
            justifyContent: 'center',
            // marginBottom: 24,
            width: width / 2,

            paddingVertical: 8,

            // width: 25,
            // height: 25,

            borderRadius: 25,
         }}>
         <Text white B14>
            View Tutorial
         </Text>
      </TouchableOpacity>
   );
}

const WeekTeamTargetListItem = ({ smashStore, teamId, index, teamsStore }) => {
   const navigation = useNavigation();
   const {
      stringLimit,
      kFormatter,
      setMasterIdsToSmash,
      setHomeTabsIndex,
      setQuickViewTeam,
      numberWithCommas,
      currentUser,
   } = smashStore;

   const {
      todayDateKey,
      setTeamUsersByTeamId,

      setVoteDocsHash,
      setWeeklyActivityInHash,
      setTeamTodayActivityByTeamId,
      myTeams,
      endOfCurrentWeekKey,
      weeklyActivityHash,
      teamUsersByTeamId,
      teamWeeksHash
   } = teamsStore;

   const team = myTeams?.[index] || {};
   const [weekDone, setWeekDone] = useState(false);
   const { navigate } = useNavigation();
   const [loaded, setLoaded] = useState(true);
   const [full, setFull] = useState(true);


   useEffect(() => {
      setTimeout(() => {
         setLoaded(true);
      }, (index + 1) * 500);

      return () => {};
   }, []);

   const smashTeamActivities = () => {
      setMasterIdsToSmash(team.masterIds);
   };

   const goToTeamArenaPre = () => {
      Vibrate();
      setHomeTabsIndex(0);
      goToTeamArena(team);
   };
   const goToTeamArena = (team, initialIndex) => {
      navigate(Routes.TeamArena, { team, initialIndex: 0 || 0 });
   };

   const smashActivities = () => {
      setMasterIdsToSmash(team?.masterIds || false);
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

   const onPressApproveUsers = (props) => {
      navigate(Routes.CreateTeam, { teamDoc: team, type: 'requestToJoin' });
   };

   const isUserAdmin = () => {
      // console.warn(currentUser.uid);

      return team?.admins ? team?.admins?.includes(currentUser.uid) : false;
   };


   const thisWeekActivity = weeklyActivityHash?.[`${team.id}_${endOfCurrentWeekKey}`] || {};
   // console.log('weekDone', weekDone, team.name);
   return (
      <>
         <AnimatedView
            fade
            onPress={goToTeamArenaPre}
            style={{
               marginBottom: 0,
               flex: 1,
               marginTop: 0,
               // backgroundColor: '#fff',
               paddingBottom: 16,
               // borderBottomWidth: 10,
               borderTopWidth: index == 0 ? 0 : 10,
            }}>
            <>
               <SectionHeader
                  title={`${team.name}`}
                  subtitle={
                     <View>
                        <TouchableOpacity row centerV onPress={goToTeamArenaPre} style={{ borderWidth: 0, borderColor: '#333' }}>
                           <Text H12 buttonLink marginR-0 paddingB-0 marginB-0>
                              GO TO TEAM
                           </Text>
                           <AntDesign
                              name="right"
                              size={12}
                              color={Colors.buttonLink}
                           />
                        </TouchableOpacity>
                        </View>
                  }
                  onPress={goToTeamArenaPre}
                  style={{ marginTop: weekDone ? 0 : 24 }}
               />
               {team?.requested?.length > 0 && isUserAdmin() && (
                  <View padding-16 style={{ flexWrap: 'wrap' }}>
                     <PlayerWantsToJoin
                        team={team}
                        onPressApproveUsers={
                           onPressApproveUsers
                        }></PlayerWantsToJoin>
                  </View>
               )}

               <TeamScrollViewWeek
                  team={team}
                  home
                  onPressApproveUsers={onPressApproveUsers}
               />


               {/* <SectionHeader title={"Team Week Target"} style={{ marginTop: 16 }} subtitle={<View><Text R12>WEEK{' '}
                  {weeksCompleted.length > 1
                     ? weeksCompleted.length + 1
                     : weeksCompleted.length}</Text></View>} /> */}


               {/* <TeamPieChart

                  teamId={team?.id}

               /> */}

               {/* <SectionHeader title={"Team Week Leaderboard"} style={{ marginTop: 0 }} /> */}
               {/* <TeamLeaderboardClean
                  joinedUsersUIDs={team?.joined || []}
                  teamId={team.id}
                  team={team}
                  isUserJoined={true}
                  isUserAdmin={isUserAdmin()}
                  onPressApproveUsers={onPressApproveUsers}

               /> */}

               <View style={{ height: 24 }} />

               {team?.scores && thisWeekActivity?.score > 0 && <TeamPieChart
                  players={teamUsersByTeamId?.[team?.id]}
                  teamWeeksHash={teamWeeksHash}
                  endOfCurrentWeekKey={endOfCurrentWeekKey}
                  smashStore={smashStore}
                  teamId={team?.id}
                  inModal={true}
                  progress={<View
                     onPress={goToTeamArenaPre}
                     style={{ borderWidth: 0, marginTop: 0, paddingHorizontal: 0, marginTop: 0 }}>
                     <TeamListItemProgress team={team} />
                  </View>}
               />}

               {/* <TeamLeaderboard
                  joinedUsersUIDs={team?.joined || []}
                  teamId={team.id}
                  team={team}
                  isUserJoined={true}
                  isUserAdmin={isUserAdmin()}
                  onPressApproveUsers={onPressApproveUsers}
               /> */}

               {team?.scores &&  thisWeekActivity?.score > 0 &&  <View style={{ paddingHorizontal: 16 }}>
                  <WeeklyDayTargets
                     {...{ team }}
                     color={Colors.blue10}
                  /></View>}
               {team?.scores && thisWeekActivity?.score > 0 &&  <View style={{ paddingHorizontal: 16 }}>
                  <Leaders
                     leaders
                  {...{ team }}
                  color={Colors.blue10}
               /></View>}



               <View
                  style={{
                     marginRight: 8,
                     marginTop: 0,
                     width: '100%',
                     paddingHorizontal: 16,
                     overflow: 'hidden',
                     top: 0,
                  }}>
                  <ConfettiLottie team={team} />
                  {/* 
                  <SectionHeader
                     top={16}
                     bottom={0}
                     title="This Week Target"
                     style={{ marginLeft: 0, marginTop: 0 }}
                  /> */}


                  {/* <ButtonLinear title="SMASH" onPress={smashActivities} style={{ paddingTop: 0, marginHorizontal: 0 }} /> */}
                  {/* <View style={{ backgroundColor: '#fafafa' }} paddingH-8> */}

                  {false && <View row spread centerV marginT-24>
                     <LastSmashedBy teamId={teamId} goToRecent={goToRecent} />
                     <TouchableOpacity row centerV onPress={goToTeamArenaPre}>
                        <Text H12 buttonLink marginR-8 paddingB-0 marginB-0>
                           GO TO TEAM
                        </Text>
                        <AntDesign
                           name="right"
                           size={16}
                           color={Colors.buttonLink}
                        />
                     </TouchableOpacity>
                  </View>}
                  {/* </View> */}
               </View>
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
)(observer(WeekTeamTargetListItem));
