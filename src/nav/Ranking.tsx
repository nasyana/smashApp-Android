import React, { useState, useEffect } from 'react';
import { Text, View, Colors } from 'react-native-ui-lib';
import { Audio } from 'expo-av';
import { inject, observer } from 'mobx-react';

import { AntDesign } from '@expo/vector-icons';
import _ from 'lodash';
import AnimatedView from 'components/AnimatedView';
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"; 

import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance?.firestore;
import Firebase from 'config/Firebase';
import { dayNumberOfChallenge } from 'helpers/dateHelpers';
const completionAnimation = require('../lotties/findteam.json');

const Ranking = ({
   smashStore,
   teamsStore,
   team = false,
}) => {
 

   const { ordinal_suffix_of, uid } = smashStore;

   const { endOfCurrentWeekKey, todayDateKey,weeklyActivityHash } =
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

     
    }



   useEffect(() => {
   
  
      fetchRank();
    }, []);

   const myRank = myTeamRank || 0;

   if (myRank == 0) {

      return null
   }

   return (
      <AnimatedView
         style={{
            backgroundColor: '#333',
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
)(observer(Ranking));

