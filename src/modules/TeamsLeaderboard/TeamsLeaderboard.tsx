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
import ColDescription from './components/ColDescription';
import firebaseInstance from '../../config/Firebase';
import { getFirestore, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { inject, observer } from 'mobx-react';
import SmartImage from '../../components/SmartImage/SmartImage';
import Player from './components/Player';
import FollowingUser from './components/FollowingUser';

import { moment } from 'helpers/generalHelpers';;
import FollowingList from './components/FollowingList';
import Header from 'components/Header';
import TeamThisWeekInLeaderboard from './TeamThisWeekInLeaderboard';

const TeamsLeaderboard = inject(
   'smashStore',
   'challengeArenaStore',
   'challengesStore',
)(
   observer((props) => {
      const [players, setPlayers] = useState([]);

      const [loaded, setLoaded] = useState(true);

      const {
         smashStore,
         goToProfile,
         challengeIsSingleActivity,
         challenge,
         showPlayerSmashesFunc,
         challengeData,
         showFollowingList,
         challengesStore,
         playerChallengeDoc,
      } = props;

      const { kFormatter, currentUser, todayDateKey, endWeekKey } = smashStore;

      const { setInsightsPlayerChallengeDoc, getPlayerChallengeData } =
         challengesStore;

      const renderItem = ({ item, index }) => {
         const team = item;
         if (!item) {
            return null;
         }
         return <TeamThisWeekInLeaderboard team={team} index={index} />;
      };

      const { uid } = currentUser;

      useEffect(() => {
       
       
         const unsubscribeToWeeklyActivity = onSnapshot(
           query(collection(firebaseInstance.firestore, 'teams'), where('active', '==', true), orderBy('updatedAt', 'desc')),
           (snaps) => {
             if (!snaps.empty) {
               const challengesArray = [];
       
               snaps.forEach((snap) => {
                 const challenge = snap.data();
       
                 challengesArray.push(challenge);
               });
       
               setPlayers(challengesArray);
               // console.log('challengesArray', challengesArray);
             }
           }
         );
       
         return () => {
           if (unsubscribeToWeeklyActivity) {
             unsubscribeToWeeklyActivity();
           }
         
         };
       }, []);

      //    const unsubscribeToWeeklyActivity = await Firebase.firestore
      //       .collection('weeklyActivity')
      //       .where('endWeekKey', '==', endWeekKey)
      //       .where('dailyPlayerAverage', '>', 0)
      //       .orderBy('dailyPlayerAverage', 'desc')
      //       .limit(30)
      //       .onSnapshot((snaps) => {
      //          if (!snaps.empty) {
      //             const challengesArray = [];

      //             snaps.forEach((snap) => {
      //                const challenge = snap.data();

      //                challengesArray.push(challenge);
      //             });

      //             setPlayers(challengesArray);
      //             console.log('challengesArray', challengesArray);
      //          }
      //       });

      //    return () => {
      //       if (unsubscribeToWeeklyActivity) {
      //          unsubscribeToWeeklyActivity();
      //       }
      //       clearTimeout(timeout);
      //    };
      // }, []);
      if(!smashStore.currentUser.superUser){return null}
      if (!loaded) {
         return null;
      }
      return (
         <View flex backgroundColor={Colors.background}>
            <Header title="Teams Leaderboard" back />
            <FlatList
               data={players || []}
               renderItem={renderItem}
               scrollEnabled={true}
               keyExtractor={(item, index) => item?.id}
               contentContainerStyle={{ paddingBottom: 50 }}
               ListFooterComponent={() => (
                  <View>
                     {/* <Button
                        backgroundColor={'#fafafa'}
                        color="white"
                        onPress={showFollowingList}
                        marginH-16>
                        <Text>Invite Friends</Text>
                     </Button> */}
                  </View>
               )}
               ListHeaderComponent={() => {
                  return <ColDescription challenge={challenge} />;
               }}
            />
         </View>
      );
   }),
);
export default TeamsLeaderboard;
