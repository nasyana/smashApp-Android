import Tag from "components/Tag";
import React, { useEffect, useState } from "react";
import { inject, observer } from 'mobx-react';
import { useNavigation } from "@react-navigation/native";
import SmartImage from "../../../../components/SmartImage/SmartImage"
import { View, Image, Text, Colors, Assets, ProgressBar, TouchableOpacity, Button } from "react-native-ui-lib";
import SwipeableItem from "components/SwipeableItem/SwipeableItem";
import Routes from "../../../../config/Routes"
import moment, { ISO_8601 } from "moment";
import Firebase from "../../../../config/Firebase";
import Badge from "../../../../components/Badge"
import { MaterialCommunityIcons, AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import { daysLeftInChallenge } from 'helpers/dateHelpers';
const MyChallengeProgress = inject(
   'smashStore',
   'challengesStore',
)(
   observer((props) => {
      const { navigate } = useNavigation();
      const {
         playerChallenge,
         smashStore,
         qty,
         challengesStore,
         playerChallengeData,
      } = props;

      const {
         daysRemaining,
         kFormatter,
         toggleMeInChallenge,
         checkInfinity,
         ordinal_suffix_of,
      } = smashStore;

      const days = [];

      const targetView = props.smashStore.targetView;

      const { getChallengeData, playerChallengeHashByChallengeId } =
         challengesStore;
      const uid = Firebase?.auth?.currentUser?.uid;

      const [rank, setRank] = useState(0);
      const [challenge, setChallenge] = useState('');
      const [playersAheadOfMe, setUsersAheadOfMe] = useState([]);

      useEffect(() => {
         const unsubscribeToPlayerChallenge = Firebase.firestore
            .collection('challenges')
            .doc(playerChallenge.challengeId)
            .onSnapshot((challengeSnap) => {
               if (challengeSnap.exists) {
                  const challenge = challengeSnap.data();
                  setChallenge(challenge);
               }
            });

         let pointsToAdd = 5000;
         // const unsubscribeToPlayersAheadOfMe = await Firebase.firestore.collection('playerChallenges')
         //     .where('following', 'array-contains', uid)
         //     .where('active', '==', true)
         //     .where('endDateKey', '==', playerChallenge.endDateKey)
         //     .where('score', '>', playerChallenge.score)
         //     .where('score', '<', playerChallenge.score + pointsToAdd)
         //     .where('challengeId', '==', playerChallenge.challengeId).onSnapshot((snaps) => {

         //         let peopleAheadOfMe = [];

         //         let usersAheadOfMe = []
         //         if (!snaps.empty) {

         //             snaps.forEach((snap) => {

         //                 peopleAheadOfMe.push(snap.data().user.name + snap.data().score)
         //                 usersAheadOfMe.push(snap.data())
         //             })

         //             const size = snaps.size;
         //             props.challengesStore.setplayersAroundMeInChallenges(usersAheadOfMe, playerChallenge.challengeId)
         //             setRank(size)
         //             setUsersAheadOfMe(usersAheadOfMe)

         //         }

         //     })

         return () => {
            if (unsubscribeToPlayerChallenge) {
               unsubscribeToPlayerChallenge();
            }

         };
      }, []);

      let {
         numberOfActivities,
         daysLeftWithText,
         numberOfPlayers,
         daysLeft,
         target,
         duration,
         firstActivityId,
         firstActivity,
      } = getChallengeData(challenge);

      const { selectedTarget, selectedScore, todayScore, todayQty } =
         playerChallengeData;
      let score = playerChallenge?.score || 0;
      console.log('playerChallengeData', playerChallenge);
      const targetFormatted = target > 0 ? kFormatter(selectedTarget) : 0;
      const hasReachedTarget = selectedScore > selectedTarget;

      let dailyTarget = (selectedTarget - selectedScore) / daysLeft;
      let dailyTargetFormatted = kFormatter(dailyTarget);
      const todayView = targetView == 1;

      if (targetView == 1) {
         score = todayScore;
         target = dailyTarget;
      }

      const color = todayView ? Colors.color40 : Colors.buttonLink;

      const goToArena = () => {
         smashStore.smashEffects();
         challengesStore.setActivePlayerChallengeDocId(playerChallenge);
         navigate(Routes.ChallengeArena, { challenge });
      };

      let progress = hasReachedTarget
         ? 100
         : (parseInt(selectedScore) / parseInt(selectedTarget)) * 100;
      return (
         <View
            paddingH-16
            marginH-16
            marginB-16
            paddingB-16
            style={{
               borderRadius: 6,
               shadowColor: '#ccc',
               shadowOffset: {
                  height: 1,
               },
               shadowOpacity: 0.52,
               shadowRadius: 12.22,
               elevation: 3,
            }}
            backgroundColor={Colors.white}>
            <View
               row
               style={{
                  marginHorizontal: 0,
                  backgroundColor: '#FFF',
                  overflow: 'hidden',
                  marginBottom: 0,
                  paddingLeft: 0,
                  borderRadius: 7,
               }}>
               <View paddingL-0 flex paddingT-16>
                  <View row centerV spread>
                     <View row>
                        <AntDesign name={'star'} size={14} color={color} />

                        <Text color6D marginL-4>
                           {selectedScore || 0} /{' '}
                           {todayView ? dailyTargetFormatted : targetFormatted}{' '}
                           ({challenge?.unit || 'Smashes'})
                        </Text>
                     </View>
                     <View row paddingR-20>
                        <AntDesign
                           name={'calendar'}
                           size={14}
                           color={Colors.buttonLink}
                        />
                        <Text color6D marginL-4>
                           {daysLeftInChallenge(playerChallenge)}
                        </Text>
                     </View>
                  </View>
                  <View bottom marginT-5>
                     <View row spread paddingB-8>
                        {days?.map((day) => (
                           <View
                              style={{
                                 height: 7,
                                 width: 7,
                                 backgroundColor: '#eee',
                              }}
                           />
                        ))}
                     </View>
                     <ProgressBar
                        progress={checkInfinity(progress)}
                        progressColor={color}
                     />
                     <Text secondaryContent marginT-8>
                        You're coming {ordinal_suffix_of(rank + 1)}!
                     </Text>
                  </View>
               </View>
            </View>
         </View>
      );
   }),
);

export default MyChallengeProgress;
