import { Assets, Colors, View, Text } from 'react-native-ui-lib';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import Header from 'components/Header';
import TodayTarget from './components/TodayTarget';
import TimelineToday from 'modules/PlayerStats/TimelineToday';
import { inject, observer } from 'mobx-react';
import PlayerTodayStats from '../TeamArena/PlayerTodayStats';
import { playerColors } from 'helpers/teamDataHelpers';
import TeamPieChart from 'components/TeamPieChart';
import firebaseInstance from 'config/Firebase';
import { getFirestore, doc, onSnapshot } from '@firebase/firestore';

const firestore = firebaseInstance.firestore;
import { dayKeyToHuman } from 'helpers/dateHelpers';
import TeamSelectedDayTarget from 'modules/Home/components/TeamSelectedDayTarget';
const SingleTeamDay = ({ route, teamsStore, smashStore }) => {
   const [day, setDay] = useState(false);

   const { dayKey, team, user = false } = route?.params || {};
   const { kFormatter, todayDateKey } = smashStore;
   const {
      currentTeam,
      teamUsersByTeamId,
      endOfCurrentWeekKey,
      weeklyActivityHash,
   } = teamsStore;

   const thisWeekActivity = weeklyActivityHash?.[team.id] || {};
   useEffect(() => {
 
      const dailyActivityRef = doc(firestore, 'dailyActivity', `${team.id}_${dayKey}`);
      
      const unsubToTeamDayActivity = onSnapshot(dailyActivityRef, (snap) => {
        setDay(snap.data());
      });

      return () => {
         if (unsubToTeamDayActivity) {
            unsubToTeamDayActivity();
         }
      };
   }, [team.id, dayKey]);

   const playersArray =
      teamUsersByTeamId &&
      team?.id &&
      teamUsersByTeamId?.[team?.id] &&
      teamUsersByTeamId?.[team?.id];

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

   return (
      <View flex>
         <Header title={'Team Day (' + dayKeyToHuman(dayKey) + ')'} back />
         <ScrollView contentContainerStyle={{ paddingTop: 16 }}>
            {/* <TeamPieChart
               players={teamUsersByTeamId?.[team?.id]}
               todayActivity={day}
               teamId={team.id}
               dayKey={dayKey}
               isToday
            /> */}
            <TeamSelectedDayTarget
               team={team}
               day={day}
               dayKey={dayKey}
               SPACING={16}
               justToday
               smashStore={smashStore}
               teamsStore={teamsStore}
               hideButton
            />

            {playersArrayTwo.map((player, index) => (
               <PlayerTodayStats
                  todayActivity={day}
                  player={player}
                  team={team}
                  dayKey={dayKey}
                  color={playerColors[index]}
                  kFormatter={kFormatter}
                  key={player.id}
               />
            ))}

            {/* <TodayTarget
               SPACING={28}
               playerChallenge={playerChallenge}
               {...{ progress, dayScore, dayTarget }}
            />
            <TimelineToday
               SPACING={28}
               date={dayKey}
               focusUser={currentUser.uid}
               challengeId={playerChallenge.challengeId}
            /> */}
         </ScrollView>
      </View>
   );
};
export default inject('teamsStore', 'smashStore')(observer(SingleTeamDay));
