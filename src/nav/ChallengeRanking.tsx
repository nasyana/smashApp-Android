import React, { useState, useEffect } from 'react';
import { Text, View, Colors } from 'react-native-ui-lib';
import { Audio } from 'expo-av';
import { inject, observer } from 'mobx-react';

import { AntDesign } from '@expo/vector-icons';
import _ from 'lodash';
import AnimatedView from 'components/AnimatedView';

import Firebase from 'config/Firebase';
import { dayNumberOfChallenge } from 'helpers/dateHelpers';
const completionAnimation = require('../lotties/findteam.json');

const ChallengeRanking = ({
   rank = 0,
   colorStart = Colors.buttonLink,
   smashStore,
   challengesStore,
   teamsStore,
   team = false,
   today = false,
   loadIndex = 0,
   playerChallenge = false,
   newPoints = false,
   newQty = false
}) => {
   // const [loaded, setLoaded] = useState(true);
   const [tempMyRank, setTempRank] = useState(false);

   const { ordinal_suffix_of, uid } = smashStore;


   const { myChallengeRankByChallengeId } = challengesStore;

   const { endOfCurrentWeekKey, todayDateKey, myTeams, weeklyActivityHash } =
      teamsStore;

   let myTeamRank = 1;

   const weeklyActivity =
      weeklyActivityHash[`${team.id}_${endOfCurrentWeekKey}`];

   const todayPlayers = weeklyActivity?.daily?.[todayDateKey]?.players;

   // console.warn(todayPlayers);

   if (todayPlayers) {
      Object.keys(todayPlayers)
         .sort(
            (a, b) =>
               (todayPlayers[b].score || 0) - (todayPlayers[a].score || 0),
         )
         .forEach((userId, index) => {
            const user = todayPlayers[userId] || {};
            // alert(user.score);
            if (userId == uid) {
               myTeamRank = index + 1;
            }
         });
   }


   async function fetchRank() {
      // Calculate myTeamRank
      if (todayPlayers) {
        Object.keys(todayPlayers)
          .sort(
            (a, b) =>
              (todayPlayers[b].score || 0) - (todayPlayers[a].score || 0),
          )
          .forEach((userId, index) => {
            const user = todayPlayers[userId] || {};
            if (userId == uid) {
              myTeamRank = index + 1;
            }
          });
      }

      if (newPoints && newQty) {
      //   const rank = await checkMyNewRank(playerChallenge, newPoints, newQty);
        setTempRank(rank);
      }
    }



   useEffect(() => {
   
  
      fetchRank();
    }, []);

   const myRank = (newPoints && newQty) && tempMyRank || playerChallenge
      && myChallengeRankByChallengeId?.[playerChallenge?.challengeId] || 1;

   if (myRank == 0) {

      return null
   }
console.log('challenge ranking',playerChallenge?.challengeId)
   return (
      <AnimatedView
         style={{
            backgroundColor: today ? Colors.meToday : colorStart,
            borderRadius: 10,
            paddingHorizontal: 4,
            minHeight: 18,
            alignItems: 'center',
            justifyContent: 'center',
         }}

      >
         <Text white B14 >
            <AntDesign name={'star'} size={10} />
            {myRank > 0 ? ordinal_suffix_of(myRank) : ''}
         </Text>
      </AnimatedView>
   );
};

export default inject(
   'smashStore',
   'teamsStore',
   'challengesStore',
)(observer(ChallengeRanking));


