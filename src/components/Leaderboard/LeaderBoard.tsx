import { width } from 'config/scaleAccordingToDevice';
import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
   View,
   Colors,
   Image,
   Assets,
   Text,
   Avatar,
   Button,
} from 'react-native-ui-lib';
import ColDescription from './ColDescription';
import Firebase from '../../config/Firebase';
import { inject, observer } from 'mobx-react';
import { getPlayerChallengeData } from '../../helpers/playersDataHelpers';
import Player from './Player';
import { moment } from 'helpers/generalHelpers';;
const LeaderBoard = inject(
   'smashStore',
   'challengeArenaStore',
   'challengesStore',
   'teamsStore',
)(
   observer((props) => {
      const [players, setPlayers] = useState([]);
      const [loaded, setLoaded] = useState(true);
      const [teamWeekDoc, setTeamWeekDoc] = useState(false);
      const [day, setDay] = useState(false);
      const {
         smashStore,
         goToProfile,
         challengeIsSingleActivity,
         showFollowingList,
         teamsStore,
         team,
      } = props;

      const { currentTeam, currentTeamWeekly, thisWeekTarget } = teamsStore;
      const isLegacy = team?.type === 'Game';

      const theTeam = team || currentTeam;
      const playersHash = currentTeamWeekly?.players || {};
      const {
         kFormatter,
         currentUser,
         selectedDayKey,
         invite,
         like,
         endWeekKey,
         todayDateKey,
      } = smashStore;

      const renderItem = ({ item, index }) => {
         if (!item) {
            return null;
         }

         let player = playersHash?.[item?.id] || item;

         let weekScore =
            teamWeekDoc?.userWeekScores?.[player.id] ||
            teamWeekDoc?.players?.[item.id]?.score ||
            0;
         return (
            <Player
               item={{ ...player, name: item.name, picture: item.picture }}
               index={index}
               team={theTeam}
               {...{
                  selectedDayKey,
                  thisWeekTarget,
                  todayDateKey,
                  currentUser,
                  like,
                  invite,
                  goToProfile,
                  kFormatter,
                  challengeIsSingleActivity,
                  weekScore,
                  day,
               }}
            />
         );
      };

      const { uid } = currentUser;

      useEffect(() => {
         const unsubToTeamDayActivity = Firebase.firestore
            .collection('dailyActivity')
            .doc(`${team.id}_${todayDateKey}`)
            .onSnapshot((snap) => {
               setDay(snap.data());
            });

         let longDateEndWeek = moment(endWeekKey, 'DDMMYYYY').format(
            'ddd Do MMM YYYY',
         );

         let query = Firebase?.firestore
            .collection('weeklyActivity')
            .doc(`${team.id}_${endWeekKey}`);

         if (isLegacy) {
            query = Firebase?.firestore
               .collection('teamWeeks')
               .doc(`${team.id}_${longDateEndWeek}`);
         }

         const unsubTeamWeeks = query.onSnapshot((snap) => {
            const teamWeekDoc = snap.data();

            setTeamWeekDoc(teamWeekDoc);
         });

         return () => {
            if (unsubTeamWeeks) {
               unsubTeamWeeks();
            }

            if (unsubToTeamDayActivity) {
               unsubToTeamDayActivity();
            }
         };
      }, [team.id, endWeekKey]);

      useEffect(() => {
         // const timeout = setTimeout(() => {
         //   setLoaded(true)
         // }, 800);

         let unsubscribeToPlayers;
         let challengesArray = [];
         if (isLegacy) {
            unsubscribeToPlayers = Firebase.firestore
               .collection('users')
               .where('joinedGames', 'array-contains', theTeam?.id)
               .onSnapshot((snaps) => {
                  if (!snaps.empty) {
                     snaps.forEach((snap) => {
                        const challenge = snap.data();
                        challengesArray.push(challenge);
                     });

                     setPlayers(challengesArray);
                  }
               });
         } else {
            unsubscribeToPlayers = Firebase.firestore
               .collection('users')
               .where('teams', 'array-contains', theTeam?.id)
               .onSnapshot((snaps) => {
                  if (!snaps.empty) {
                     snaps.forEach((snap) => {
                        const challenge = snap.data();
                        challengesArray.push(challenge);
                     });

                     setPlayers(challengesArray);
                  }
               });
         }

         return () => {
            if (unsubscribeToPlayers) {
               unsubscribeToPlayers();
            }
            clearTimeout(timeout);
         };
      }, []);

      if (!loaded) {
         return null;
      }

      let leadersData = ([...players] || []).sort(
         (a, b) =>
            (b?.dailyScores?.[selectedDayKey] || 0) -
            (a?.dailyScores?.[selectedDayKey] || 0),
      );

      if (isLegacy) {
         leadersData = [...players] || [];
      }
      return (
         <View flex marginT-24>
            <FlatList
               data={leadersData}
               renderItem={renderItem}
               keyExtractor={(item, index) => item?.uid}
               contentContainerStyle={{}}
               ListFooterComponent={() =>
                  props.showMore ? (
                     <View>
                        <Button
                           backgroundColor={'#fafafa'}
                           color="white"
                           onPress={showFollowingList}
                           marginH-16>
                           <Text>Show More</Text>
                        </Button>
                     </View>
                  ) : null
               }
               ListHeaderComponent={() => {
                  return <ColDescription />;
               }}
            />
         </View>
      );
   }),
);
export default LeaderBoard;
