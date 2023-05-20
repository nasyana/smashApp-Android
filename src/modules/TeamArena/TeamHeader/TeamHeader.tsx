import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
   Colors,
   View,
   Text,
   TouchableOpacity
} from 'react-native-ui-lib';
import {
   AntDesign
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import firebaseInstance from 'config/Firebase';
import Routes from 'config/Routes';
import MyTeamProgress from '../MyTeamProgress';
import { inject, observer } from 'mobx-react';
import TeamInfoBox from './TeamInfoBox';
import SectionHeader from 'components/SectionHeader';
import TeamScrollView from 'components/TeamScrollView';
import LottieAnimation from 'components/LottieAnimation';
import { width } from 'config/scaleAccordingToDevice';
import WeekTeamTarget from 'modules/Home/components/WeekTeamTarget';
import NumberOfVotesForTeam from 'components/NumberOfVotesForTeam';
import YourTargetTeamTargetToday from 'modules/Home/components/YourTargetTeamTargetToday';
import { SingleActivity } from '../../../components/Challenge/Activities';
const TeamHeader = (props) => {
   const { navigate } = useNavigation();

   const { uid } = firebaseInstance.auth.currentUser;
   const {
      teamsStore,
      buttonMarkup,
      showWeeklyTarget,
   } = props;
   const {
      thisWeekTarget,
      teamTargets = {},
      teamUsersByTeamId,
      weeklyActivityHash,
      returnActivityIdsForTeam,
      voteDocsHash,
   } = teamsStore;
   const {  currentTeam, myTeamsHash } = teamsStore;
   const { smashStore, voteDocs, team } = props;
   const { name, id, motto, actions = {} } = team;

   // const players = teamUsersByTeamId?.[team.id] || [];
   const {
      endWeekKey,
      todayDateKey,
      kFormatter,
      setMasterIdsToSmash,
      returnActionPointsValue,
      levelColors,
      numberWithCommas,
      isSuperUser,
      currentUser,
      libraryActivitiesHash,
   } = smashStore;

   const isAdmin = team.uid == uid;

   const isUserJoined = team?.joined?.includes(uid)
   const voteDoc = voteDocsHash?.[team.id];

   const { currentUserId, habitStacksHash } = smashStore;


  


const activityIds = returnActivityIdsForTeam(currentTeam,libraryActivitiesHash, habitStacksHash);
   const boxSize = 20;
   const weeklyActivityDoc = weeklyActivityHash[`${team.id}_${endWeekKey}`] || {};


   const {alreadyWonWeek = false} = weeklyActivityDoc

   const setManualTeamToVote = () => {
      teamsStore.manualTeamToVoteOn = team;
   };

   useEffect(() => {
      setTimeout(() => {
       setLoaded(true)
      }, 700);
   }, []);
   const [loaded, setLoaded] = useState(false);

   const openLibraryActivities = () => {
      teamsStore.setShowLibraryActivitiesModal('activities');
   };

   const openHabitStacks = () => {
      teamsStore.setShowLibraryActivitiesModal('habitStacks');
   };



   const onPressApproveUsers = () => {
      navigate(Routes.CreateTeam, { teamDoc: team, type: 'requestToJoin' });
   };

   const isUserAdmin = () => {
      // console.warn(currentUser.uid);

      return team?.admins?.includes(currentUserId);
   };

   const activitiesByCategory = activityIds.reduce((prev, curr) => {
      const category = curr?.actionCategory?.[0];
      if (!category && category != 0) return prev;
      if (!prev[category]) {
         prev[category] = [];
      }
      prev[category].push(curr);
      return prev;
   }, {});

   return (
      <View paddingH-10 paddingB-32 paddingT-16 style={{ marginTop: 0 }}>
         {weeklyActivityDoc?.thisWeekTarget <
            (weeklyActivityDoc?.score || 0) && (
            <LottieAnimation
               autoPlay
               loop={true}
               style={{
                  height: width,
                  zIndex: 0,
                  top: -50,
                  left: 0,
                  position: 'absolute',
               }}
               source={require('../../../lotties/confetti.json')}
            />
         )}
         {(!team.scores || !currentUser?.teamScores?.[team.id]) && false && (
            <TouchableOpacity
               style={{
                  backgroundColor: Colors.smashPink,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 24,
                  width: width / 2,
                  left: width / 4,
                  paddingVertical: 8,
                  top: -16,
                  // width: 25,
                  // height: 25,
                  position: 'absolute',
                  borderRadius: 25,
               }}
               onPress={() =>
                  (smashStore.tutorialVideo =
                     smashStore?.settings?.tutorials?.teams?.firstTeam)
               }>
               <Text white B14>
                  View Tutorial
               </Text>
            </TouchableOpacity>
         )}
         {team?.requested?.length > 0 && isUserAdmin() && (
            <TouchableOpacity
               onPress={onPressApproveUsers}
               row
               style={{
                  backgroundColor: Colors.smashPink,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 24,
                  width: width / 2,
                  left: width / 4,
                  paddingVertical: 8,
                  top: -32,
                  // width: 25,
                  // height: 25,
                  position: 'absolute',
                  borderRadius: 25,
               }}>
               <AntDesign name="adduser" size={16} color={Colors.white} />
               <Text white B14>
                  {team?.requested?.length}{' '}
                  {team?.requested?.length == 1
                     ? 'Player wants to join!'
                     : 'Players want to join!'}
               </Text>
               {/* <ActivityIndicator color={'white'} style={{marginLeft: 4}} /> */}
            </TouchableOpacity>
         )}


         <TeamInfoBox
            name={name}
            team={team}
            smashStore={smashStore}
            showInfoBox={!isUserJoined}
            motto={motto}
            showWeeklyTarget={showWeeklyTarget}
            teamsStore={teamsStore}
            activitiesCount={activityIds?.length}
            teamCount={team?.joined?.length}
            thisWeekTarget={thisWeekTarget}
         />
        

         {/* {!showWeeklyTarget && <View centerH>{setWeeklyActivities}</View>} */}
         {/* <TeamScrollViewWeek
            joinedUsersUIDs={team?.joined || []}
            teamId={team.id}
            team={team}
            isUserJoined={isUserJoined}
            isUserAdmin={isUserAdmin()}
            onPressApproveUsers={onPressApproveUsers}
         /> */}

         {isUserJoined && (
            <SectionHeader
               title={'Team Weekly Target'.toUpperCase()}
               top={8}
               subtitle={
                  alreadyWonWeek ? 
               <View paddingR-24><Text  center B12 smashPink>
                  🏆 SMASHED</Text></View>
                  : <View />
               }
            />
         )}
         {isUserJoined && (

            <MyTeamProgress

             
               activities={activityIds}
               team={team}
               openLibraryActivities={
                  isAdmin ? openLibraryActivities : () => null
               }
               onPress
               numberOfActivities={
                  team?.actions ? Object.keys(team.actions).length : 0
               }
            />

         )}

<View flex marginB-8 paddingV-8><NumberOfVotesForTeam team={team} /></View>

         {/* <TeamLeaderboard
            joinedUsersUIDs={team?.joined || []}
            teamId={team.id}
            team={team}
            isUserJoined={isUserJoined}
            isUserAdmin={isUserAdmin()}
            onPressApproveUsers={onPressApproveUsers}
         /> */}

       
       
        {/* <TeamWeek team={team}/> */}
           {isUserJoined && (
            <SectionHeader title={'Team Today'.toUpperCase()} style={{ marginTop: 0 }} />
         )}
     <TeamScrollView team={team}  />

    
         {/* {isUserJoined && (
            
         )} */}
         {isUserJoined && (
           <YourTargetTeamTargetToday team={team} />
         )}

      
         {isUserJoined && loaded && <WeekTeamTarget team={team} />}
        
         {/* <Text>asd</Text> */}
         {/* {false && (
            <>
               <SectionHeader title="Team Challenges" />
               <ThisTeamChallenges
                  challenges={challenges}
                  smashStore={smashStore}
                  team={team}
               />
            </>
         )} */}

         {voteDocs?.length > 0 && buttonMarkup}


         <View marginH-36 marginB-16 height={2} backgroundColor={Colors.line} />

        {false && <SectionHeader title="Team Info" />}
         {isUserJoined && false && (
            <View row marginB-16 marginH-16>
               <View style={{ height: boxSize, width: boxSize }}>
                  <AntDesign
                     name={'calendar'}
                     size={18}
                     color={Colors.color6D}
                  />
               </View>
               <Text R14 marginH-16 content28>
                  {'01/01/2022'} - {'10/01/2022'}
               </Text>
            </View>
         )}

         <View marginV-16 marginH-0>
            {/* <View marginH-16 row>
               <View style={{ height: boxSize, width: boxSize }}>
                  <AntDesign
                     name={'checksquareo'}
                     size={18}
                     color={Colors.color6D}
                  />
               </View>
               <Text R14 marginH-16 content28>
                  {motto}
               </Text>
            </View> */}
   {/* <SectionHeader title="Manage"  larger subtitle={}  /> */}
   <View row spread centerV paddingL-24><Text R14 secondaryContent>Need to change Habits?</Text><View row centerV><TouchableOpacity onPress={openLibraryActivities} padding-8 paddingV-4 style={{borderWidth: 1, borderRadius: 16, borderColor: Colors.buttonLink, marginRight: 8}}><Text R10 buttonLink>ACTIVITIES ({currentTeam?.masterIds?.length})</Text></TouchableOpacity><TouchableOpacity onPress={openHabitStacks} padding-8 paddingV-4 style={{borderWidth: 1, borderRadius: 16, borderColor: Colors.buttonLink, marginRight: 8}}><Text R10 buttonLink>STACKS ({currentTeam?.habitStackIds?.length})</Text></TouchableOpacity></View></View>
            {/* <DelayLoading> */}
            {loaded && <View marginT-16>
               {Object.entries(activitiesByCategory).map(
                  ([category, selectActivities]) => {
                     return (
                        <View key={category}>
                           <SectionHeader title={smashStore.activityCategoryLabels[category]}  top={24}/>
                           <View paddingH-16 >
                              {selectActivities.map((a) => {
                              

                        
                                 return (
                                    <View ><SingleActivity activity={a}  smashStore={smashStore} /></View>
                                 );
                              })}
                           </View>
                        </View>
                     );
                  },
               )}
            </View>}
         
         </View>





      </View>
   );
};;

export default inject(
   'teamsStore',
   'smashStore',
   'challengesStore',
)(observer(TeamHeader));

const styles = StyleSheet.create({});
