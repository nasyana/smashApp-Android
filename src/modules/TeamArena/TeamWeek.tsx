import {  ScrollView, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import PlayerWeekStats from './PlayerWeekStats';
import { collection, where, onSnapshot } from 'firebase/firestore';

// import { useNavigation } from '@react-navigation/core';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import { inject, observer } from 'mobx-react';
import TeamPieChart from 'components/TeamPieChart';
import { playerColors } from 'helpers/teamDataHelpers';
import WeeklyTeamPlayerDayTargets from 'components/WeeklyTeamPlayerDayTargets';
import Shimmer from 'components/Shimmer';
import { width } from 'config/scaleAccordingToDevice';
import SectionHeader from 'components/SectionHeader';
import DelayLoading from 'components/DelayLoading';
import TeamActivitiesList from 'components/TeamActivitiesList'
import { Colors, Text,View } from 'react-native-ui-lib';
import MvpInLeaderBoard from './MvpInLeaderBoard';
export enum EnumTypeChart {
   week = 0,
   month = 1,
   year = 2,
   all = 3,
}
const TeamWeek = (props) => {
   // const { navigate } = useNavigation();
   const { teamsStore, smashStore, inModal = false, team = {} } = props;
   const {
      currentTeam,
      // teamUsersByTeamId,
      endOfCurrentWeekKey,
      weeklyActivityHash,
      teamUsersByTeamId,
   } = teamsStore;
   
   // const [thisWeekDayDocs, setThisWeekDayDocs] = useState(weeklyActivityHash?.[`${team.id}_${endOfCurrentWeekKey}`] || {});
   const [loaded, setLoaded] = useState(false);
   
   const [teamWeeksHash, setTeamWeeksHash] = useState({});

   
   // useEffect(() => {
   //    if (!team.id) { return }
    
   //  const {endOfCurrentWeekKey} = teamsStore;
   //    const firestore = firebaseInstance.firestore;
    
   //    let queryOne = collection(firestore, 'weeklyActivity');
   //    let queryTwo = where(queryOne, 'teamId', '==', team.id);
   //    let queryThree = where(queryTwo, 'endWeekKey', '==', endOfWeekKey);
    
   //    const unsubTeamWeeks = onSnapshot(queryThree, (snaps) => {
   //      let teamWeeksArray = [];
   //      let teamWeeksObj = {};
    
   //      snaps.forEach((week) => {
   //        const weekDoc = week.data();
   //        teamWeeksArray.push(weekDoc);
   //        teamWeeksObj[weekDoc?.endWeekKey] = weekDoc;
   //      });
    
   //      setTeamWeeksHash(teamWeeksObj);
   //    });
    
   //    return () => {
   //      if (unsubTeamWeeks) {
   //        unsubTeamWeeks();
   //      }
   //    };
   //  }, []);
   
   // if(!thisWeekDoc?.userWeekScores){return null}

   /// setLoaded in useEFfect after 1 second
   useEffect(() => {
      setTimeout(() => {
         setLoaded(true);
      }, 500);
   }, []);

   const thisWeekActivity = weeklyActivityHash?.[`${team.id}_${endOfCurrentWeekKey}`] || {};

   const thisWeekDayDocs = Object.keys(thisWeekActivity?.daily).map((dayKey)=>{ return thisWeekActivity?.daily?.[dayKey] || {} }) || [];
   let playerHash = {};

   const teamUsers = team.joined?.map((playerId)=>{return {uid: playerId, picture: team?.playerData?.[playerId]?.picture, name: team?.playerData?.[playerId]?.name}})

   thisWeekDayDocs?.length > 0
      ? teamUsers?.forEach((player, index) => {
           const playerId = player.id;
           let weeklyPlayerDoc = {};

           thisWeekDayDocs.forEach((day, index) => {
              weeklyPlayerDoc[day.startDay] = day?.userData?.[playerId] || false;
           });

           playerHash[playerId] = weeklyPlayerDoc;
        })
      : false;

   const thisWeekDoc = thisWeekActivity;

   const playerData = team?.playerdata || {};
   const playersArray = teamUsers || [];
      // (playerData &&
      //    team?.id &&
      //    playerData?.[team?.id] &&
      //    playerData?.[team?.id]) ||
      // [];

   let playersArrayTwo = [...playersArray].sort(
      (playerb, playera) =>
         (thisWeekDoc?.userWeekScores?.[playera.uid] ||
            thisWeekDoc?.players?.[playera.uid]?.score ||
            0) -
         (thisWeekDoc?.userWeekScores?.[playerb.uid] ||
            thisWeekDoc?.players?.[playerb.uid]?.score ||
            0),
   );

console.log('playersArrayTwo',playersArrayTwo,team.id,thisWeekActivity,teamUsers )
   const renderItem = ({ item, index }) => {
      const player = item;
      return (
         <PlayerWeekStats
            player={player}
            index={index}
            key={player.uid}
            initialNumToRender={1}
            thisWeekDoc={thisWeekDoc || false}
            team={team}
            playerWeekData={thisWeekActivity?.players?.[player.uid] || false}
            color={Colors.buttonLink || playerColors[index]}
            teamWeeksHash={teamWeeksHash}
            teamsStore={teamsStore}
            weekTargets={() => (
               <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
                  <WeeklyTeamPlayerDayTargets
                     item={thisWeekDoc}
                     player={player}
                  />
               </View>
            )}
         />
      );
   };
   if (!loaded) {
      return (
         <View>
              <View style={{ height: 16 }} />
            <SectionHeader title={'Team Leaderboard'}  />
            <View center paddingB-24>
                  <View row  paddingH-16>
                   <View row marginR-8 centerV><Text R14 center>🏆 Week Champ</Text>
                   </View>
                   <View row marginR-8 centerV><Text R14 center>🏀 Winning Shot</Text>
                   </View>
                   <View row marginR-8 centerV><Text R14 center>⭐ Day Champ</Text>
                   </View>
                
                  </View>
                  <View row spread>
                   {/* <View><Text R14 center>Day Champ {dayWinnersCount}</Text></View><View><Text R14 center>Day MVP</Text></View><View><Text R14 center>Day Shot</Text></View> */}
                  </View>
                  </View>
            <Shimmer style={{ width: width - 48, height: 60, left: 16, borderRadius: 8 }} />
            <Shimmer style={{ width: width - 48, height: 60, left: 16, marginTop: 16, borderRadius: 8 }} />
            <View style={{ height: 16 }} />
         </View>
      );
   }

   const mvp = playersArrayTwo?.[0] || false
   return (
      <>
         {/* {inModal && <SectionHeader title={team.name + ' this week'} />} */}

        {/* <MvpInLeaderBoard mvp={mvp} /> */}
      
         <ScrollView
            contentContainerStyle={{ marginTop: 0, paddingBottom: 16 }}>
            {/* {thisWeekActivity.score > 0 && (
               <SectionHeader title={'Team Stats'}  />
            )} */}
            {/* {thisWeekActivity.score > 0 && (
               <TeamPieChart
                  players={teamUsersByTeamId?.[team?.id]}
                  teamWeeksHash={teamWeeksHash}
                  endOfCurrentWeekKey={endOfCurrentWeekKey}
                  smashStore={smashStore}
                  teamId={team?.id}
                  inModal={inModal}
               />
            )} */}

            {/* {!inModal && <WeekTeamTarget team={team} />} */}

            {/* {thisWeekDoc?.score > 0 && <DelayLoading delay={200}><ButtonLinear onPress={goToTeamHistory} title={'View Team History'} marginB-16 /></DelayLoading>} */}
            <View style={{ height: 16 }} />
            <SectionHeader title={'Team Leaderboard'}  />
            {/* {!inModal && (
               <TouchableOpacity
                  onPress={goToTeamHistory}
                  marginH-16
                  marginB-16
                  right>
                  <Text>View Team History</Text>
               </TouchableOpacity>
            )} */}
  {/* {true && <DaysTimeLeft />} */}
        <FlatList
               initialNumToRender={1}
               // windowSize={1}
               keyExtractor={(item) => item.id}
               data={playersArrayTwo}
               ListHeaderComponent={ <View center paddingB-24>
                  <View row  paddingH-16>
                   <View row marginR-8 centerV><Text R14 center>🏆 Week Champ</Text>
                   </View>
                   <View row marginR-8 centerV><Text R14 center>🏀 Winning Shot</Text>
                   </View>
                   <View row marginR-8 centerV><Text R14 center>⭐ Day Champ</Text>
                   </View>
                
                  </View>
                  <View row spread>
                   {/* <View><Text R14 center>Day Champ {dayWinnersCount}</Text></View><View><Text R14 center>Day MVP</Text></View><View><Text R14 center>Day Shot</Text></View> */}
                  </View>
                  </View>}
               renderItem={renderItem}
            />
            
     {/* <SectionHeader title={'Team Activities'}  />
            <TeamActivitiesList team={team} />
             */}
         {/* {team?.joined.map((playerId, index) => {

            const player = playersHash?.[playerId] || false;
               return (<PlayerWeekStats
                  player={player}
                  key={player.id}
                  playerWeekData={false}
                  color={playerColors[index]}
                  teamWeeksHash={teamWeeksHash}
                  teamsStore={teamsStore}
               />)
            })}  */}
         </ScrollView>
      </>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(TeamWeek));
