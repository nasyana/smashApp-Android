import { ActivityIndicator, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import PlayerTodayStats from './PlayerTodayStats';
import { inject, observer } from 'mobx-react';
import TeamPieChart from 'components/TeamPieChart';
import { collection, doc, onSnapshot } from "firebase/firestore";

import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import { playerColors } from 'helpers/teamDataHelpers';
import TeamTodayTeamTarget from 'modules/Home/components/TeamTodayTeamTarget';
import Shimmer from 'components/Shimmer';
import { width, height } from 'config/scaleAccordingToDevice';
import { Text, View } from 'react-native-ui-lib';
import SectionHeader from 'components/SectionHeader';
export enum EnumTypeChart {
   week = 0,
   month = 1,
   year = 2,
   all = 3,
}
const TeamToday = (props) => {
   const { teamsStore, smashStore, team, inModal, noScroll = false } = props;

   const { todayDateKey, kFormatter } = smashStore;
   const dayKey = todayDateKey;


   const { currentTeam } = teamsStore;

   const theTeam = team || currentTeam;


   const [loading, setLoading] = useState(true);


 
   useEffect(() => {
      const timeout = setTimeout(() => {
         setLoading(false);
      }, 300);

      return () => {
         if (timeout) {
            clearTimeout(timeout);
         }
      };
   }, []);


   const [day, setDay] = useState(false);
   console.log('render team today');



   useEffect(() => {
      if(!theTeam.id){return}

    

      const unsubToTeamDayActivity = onSnapshot(doc(collection(firestore, 'dailyActivity'), `${theTeam.id}_${dayKey}`), (snap) => {
         setDay(snap.data());
       });

         return unsubToTeamDayActivity ? unsubToTeamDayActivity : ()=> null

      }, [theTeam.id]);




   // const playersArray = theTeam.joined?.map((playerId)=>playersByTeamUIDHash?.[])

   let playerIds = day ? [...theTeam.joined].sort((playerbId, playeraId) => {
           return (
              (day?.userData?.[playeraId]?.userTotal ||
                 day?.players?.[playeraId]?.score ||
                 0) -
              (day?.userData?.[playerbId]?.userTotal ||
                 day?.players?.[playerbId]?.score ||
                 0)
           );
        })
      : [...theTeam.joined];

   

   if (loading || !theTeam.id) {
      return (
         <View>
            <SectionHeader title={noScroll ? 'Today' : team.name + ' Today'} />
            <View padding-64 ><ActivityIndicator /></View>
            {/* {theTeam.joined?.map((id)=><Shimmer style={{ width: width - 32, height: 150, left: 16, marginBottom: 4 }} />)} */}
          
         </View>
      );
   }
   return (
      <ScrollView
      scrollEnabled={noScroll ? false : true}
         contentContainerStyle={{ marginTop: 0, paddingBottom: noScroll ? 0 : 0 }}
         style={{ flex: 1 }}>
      <SectionHeader title={noScroll ? 'Today' : team.name + ' Today'} />
 
         {team.joined?.length > 0 && playerIds?.length > 0 && playerIds.map((playerId, index) => {
            
            const player = day?.players[playerId] ? {...day?.players[playerId], id: playerId, uid: playerId} : {id: playerId, uid: playerId};
            return (
            
            <PlayerTodayStats
               todayActivity={day}
               player={player}
               playerId={playerId}
               disableTouch
               team={theTeam}
               dayKey={todayDateKey}
               color={playerColors[index]}
               kFormatter={kFormatter}
               key={playerId}
            />
         )})}
      </ScrollView>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(TeamToday));
