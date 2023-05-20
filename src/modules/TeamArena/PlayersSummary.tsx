import { FlatList, ScrollView } from 'react-native';
import { Text, View, Colors, Button } from 'react-native-ui-lib';
import React, { useState, useEffect } from 'react';
import PlayerTodayStats from './PlayerTodayStats';
import Stats from 'modules/DailyDetail/Stats';
import { inject, observer } from 'mobx-react';
import TeamPieChart from 'components/TeamPieChart';
import Firebase from 'config/Firebase';
import { playerColors } from 'helpers/teamDataHelpers';
import TeamTodayTeamTarget from 'modules/Home/components/TeamTodayTeamTarget';
import SectionHeader from 'components/SectionHeader';
export enum EnumTypeChart {
   week = 0,
   month = 1,
   year = 2,
   all = 3,
}
const PlayersSummary = (props) => {
   const { teamsStore, smashStore, team } = props;

   const { todayDateKey, kFormatter } = smashStore;
   const dayKey = todayDateKey;
   const {
      currentTeam,
      teamUsersByTeamId,
      endOfCurrentWeekKey,
   } = teamsStore;

   const [renderScreen, setRenderScreen] = useState(false);

   const theTeam = team || currentTeam;
   const isLegacy = currentTeam?.type === 'Game';
   // const [teamWeeks, setTeamWeeks] = useState([]);
   const [teamWeeksHash, setTeamWeeksHash] = useState({});
   const [todayActivity, setTodayActivity] = useState(false);
   const [day, setDay] = useState(false);
   // console.log('theTeamtheTeam', theTeam);
   let query = Firebase?.firestore
      .collection('weeklyActivity')
      .where('teamId', '==', theTeam.id);

   if (isLegacy) {
      query = Firebase?.firestore
         .collection('teamWeeks')
         .where('teamId', '==', theTeam.id);
   }

   useEffect(() => {
      setTimeout(() => {
         setRenderScreen(true);
      }, 1000);

      return () => {};
   }, []);

   useEffect(() => {
      const unsubToTeamDayActivity = Firebase.firestore
         .collection('dailyActivity')
         .doc(`${team.id}_${dayKey}`)
         .onSnapshot((snap) => {
            setDay(snap.data());
         });

      const unsubTeamWeeks = query.onSnapshot((snaps) => {
         let teamWeeksArray = [];
         let teamWeeksObj = {};

         snaps.forEach((week) => {
            const weekDoc = week.data();
            teamWeeksArray.push(weekDoc);
            teamWeeksObj[weekDoc?.endWeekKey] = weekDoc;
         });

         // setTeamWeeks(teamWeeksArray);
         setTeamWeeksHash(teamWeeksObj);
      });

      return () => {
         if (unsubTeamWeeks) {
            unsubTeamWeeks();
         }
      };
   }, [theTeam.id]);

   const thisWeekActivity = teamWeeksHash?.[endOfCurrentWeekKey] || {};

   const playersArray =
      teamUsersByTeamId &&
      theTeam?.id &&
      teamUsersByTeamId?.[theTeam?.id] &&
      teamUsersByTeamId?.[theTeam?.id];

   let playersArrayTwo = playersArray
      ? [...playersArray].sort((playerb, playera) => {
           return (
              (day?.userData?.[playera.id]?.userTotal ||
                 day?.players?.[playera.id]?.score ||
                 0) -
              (day?.userData?.[playerb.id]?.userTotal ||
                 day?.players?.[playerb.id]?.score ||
                 0)
           );
        })
      : [];

   if (!renderScreen) {
      return null;
   }

   const renderItem = ({ item, index }) => {
      let player = item;
      return (
         <PlayerTodayStats
            todayActivity={day}
            player={player}
            team={theTeam}
            dayKey={todayDateKey}
            color={playerColors[index]}
            kFormatter={kFormatter}
            key={player.id}
         />
      );
   };

   return (
      <FlatList
         data={playersArrayTwo}
         // windowSize={1}
         ListHeaderComponent={<SectionHeader title="PLAYER STATS TODAY" bottom={0} top={32} />}
         keyExtractor={(item) => item.uid}
         initialNumToRender={3}
         contentContainerStyle={{ marginTop: 0, paddingBottom: 126 }}
         renderItem={renderItem}
         style={{ flex: 1 }}
      />
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(PlayersSummary));
