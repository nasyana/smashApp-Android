import Tag from 'components/Tag';
import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import SmartImage from '../../../../components/SmartImage/SmartImage';
import {
   View,
   Image,
   Text,
   Colors,
   Assets,
   ProgressBar,
   TouchableOpacity,
   Button,
} from 'react-native-ui-lib';
import SwipeableItem from 'components/SwipeableItem/SwipeableItem';
import Routes from '../../../../config/Routes';
import moment, { ISO_8601 } from 'moment';
import Firebase from '../../../../config/Firebase';
import EpicBadge from '../../../../components/EpicBadge';
import { AntDesign } from '@expo/vector-icons';
import { getDay } from 'date-fns/esm';

import { getPlayerChallengeData, getDaysLeft } from './playersDataHelpers';

const TeamChallenge = inject(
   'smashStore',
   'challengesStore',
)(
   observer((props: any) => {
      const { navigate } = useNavigation();
      const {
         playerChallengeId,
         challengeId,
         smashStore,
         qty,
         team,
         challengesStore,
      } = props;
      const {
         daysRemaining,
         kFormatter,
         toggleMeInChallenge,
         checkInfinity,
         ordinal_suffix_of,
      } = smashStore;

      const days: Array<any> = [];
      const targetView = props.smashStore.targetView;
      const uid = Firebase?.auth?.currentUser?.uid;
      const [rank, setRank] = useState(0);
      const [playerChallenge, setPlayerChallenge] = useState<any>(false);
      const [challenge, setChallenge] = useState('');
      const [playersAheadOfMe, setUsersAheadOfMe] = useState<Array<any>>([]);

      useEffect(() => {
         (async function () {
            const unsubscribeToChallenge = await Firebase.firestore
               .collection('challenges')
               .doc(challengeId)
               .onSnapshot((challengeSnap: any) => {
                  if (challengeSnap.exists) {
                     const challenge = challengeSnap.data();
                     setChallenge(challenge);
                  }
               });

            const unsubscribeToPlayerChallenge = await Firebase.firestore
               .collection('playerChallenges')
               .doc(playerChallengeId)
               .onSnapshot((challengeSnap: any) => {
                  if (challengeSnap.exists) {
                     const pChallenge = challengeSnap.data();
                     setPlayerChallenge(pChallenge);
                     // challengesStore.setPlayerChallengeInHash(pChallenge)
                  }
               });

            let pointsToAdd = 5000;
            // const unsubscribeToPlayersAheadOfMe = await Firebase.firestore
            //    .collection('playerChallenges')
            //    .where('following', 'array-contains', uid)
            //    .where('active', '==', true)
            //    .where('endDateKey', '==', playerChallenge.endDateKey)
            //    .where('score', '>', playerChallenge.score)
            //    .where('score', '<', playerChallenge.score + pointsToAdd)
            //    .where('challengeId', '==', playerChallenge.challengeId)
            //    .onSnapshot((snaps: any) => {
            //       let peopleAheadOfMe = [];

            //       let usersAheadOfMe: Array<any> = [];
            //       if (!snaps.empty) {
            //          snaps.forEach((snap: any) => {
            //             peopleAheadOfMe.push(
            //                snap.data().user.name + snap.data().score,
            //             );
            //             usersAheadOfMe.push(snap.data());
            //          });

            //          const size = snaps.size;
            //          props.challengesStore.setplayersAroundMeInChallenges(
            //             usersAheadOfMe,
            //             playerChallenge.challengeId,
            //          );
            //          setRank(size);
            //          setUsersAheadOfMe(usersAheadOfMe);
            //       }
            //    });

            if (unsubscribeToPlayerChallenge) {
               unsubscribeToPlayerChallenge();
            }



            if (unsubscribeToChallenge) {
               unsubscribeToChallenge();
            }
         })();
      }, []);

      // let { daysLeftWithText} = getChallengeData(challenge);

      const daysLeftWithText = getDaysLeft(challenge, true);
      const playerChallengeData = getPlayerChallengeData(
         playerChallenge,
         1,
         challengesStore,
         'target',
      );

      const selectedTarget =
         kFormatter(playerChallengeData?.selectedTarget) || 0;
      const selectedScore = kFormatter(playerChallengeData?.selectedScore) || 0;
      const durationLabel = playerChallengeData?.durationLabel || 'Monthly';
      const progress = playerChallengeData?.progress || 0;
      let score = playerChallenge?.score || 0;

      const isTeam = playerChallenge?.challengeType == 'team';
      const targetFormatted =
         selectedTarget > 0 ? kFormatter(selectedTarget) : 0;

      // let dailyTargetFormatted = kFormatter(dailyTarget);
      const todayView = targetView == 1;

      // if (targetView == 1) {
      //     score = todayScore;
      //     target = dailyTarget;
      // }



      const goToArena = () => {
         if (team) {
            smashStore.smashEffects();
            challengesStore.setActivePlayerChallengeDocId(playerChallenge);
            navigate(Routes.ChallengeArena, { challenge, team });
         } else {
            smashStore.smashEffects();
            challengesStore.setActivePlayerChallengeDocId(playerChallenge);
            navigate(Routes.ChallengeArena, { challenge });
         }
      };

  

      const smashed = progress >= 100;

      const color = Colors.purple40;
      return (
         <TouchableOpacity
            onPress={goToArena}
            marginH-16
            marginB-16
            paddingB-16
            style={{
               borderRadius: 6,
               // shadowColor: '#ccc',
               // shadowOffset: {
               //    height: 1,
               //    width: 1,
               // },
               // shadowOpacity: 0.52,
               // shadowRadius: 12.22,
               // elevation: 3,
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
               <View marginH-8 marginT-16>
                  {/* {Object.keys(playerChallenge).map((key) => (
                     <Text>{key + ', '}</Text>
                  ))} */}
                  {/* {playerChallenge && (
                     <EpicBadge
                        playerChallenge={playerChallenge}
                        kFormatter={kFormatter}
                        small
                     />
                  )} */}
               </View>
               <View paddingL-0 flex paddingT-16>
                  <View row centerV spread>
                     <Text H16 color28>
                        {playerChallenge?.challengeName || 'loading'}{' '}
                     </Text>
                     <View row>
                        <AntDesign name={'star'} size={14} color={color} />

                        <Text color6D marginL-4>
                           {selectedScore || 0} / {selectedTarget}{' '}
                        </Text>
                     </View>
                     <View row paddingR-20>
                        <AntDesign name={'calendar'} size={14} color={color} />
                        <Text color6D marginL-4 marginR-8>
                           {daysLeftWithText}
                        </Text>
                        {/* {smashed && (
                           <AntDesign name={'check'} size={14} color={color} />
                        )} */}

                        <AntDesign
                           name={'checkcircleo'}
                           size={14}
                           color={smashed ? Colors.green40 : '#ccc'}
                        />
                     </View>
                  </View>
                  <View paddingR-20 bottom marginT-5>
                     <View row spread paddingB-0>
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
                        style={{ height: 3 }}
                     />
                  </View>
               </View>
            </View>
            {/* <View
               style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  padding: 4,
                  backgroundColor: '#ccc',
                  borderBottomRightRadius: 7,
               }}>
               <Text flex center R10 white>
                  {durationLabel?.toUpperCase()}
               </Text>
            </View> */}
            {/* <View style={{ position: 'absolute', bottom: 16, left: 16 }}><Text>{durationLabel}</Text></View> */}
         </TouchableOpacity>
      );
   }),
);

export default TeamChallenge;
