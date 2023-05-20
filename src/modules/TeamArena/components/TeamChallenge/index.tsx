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
function kFormatter(num) {
   return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
      : Math.sign(num) * Math.abs(num).toFixed(1);
}
const TeamChallenge = (props: any) => {
   const { navigate } = useNavigation();
   const { smashStore, item, challengesStore } = props;
   const { playerChallengeId, challengeId } = item;
   const { checkInfinity, ordinal_suffix_of } = smashStore;

   const days: Array<any> = [];
   const targetView = props.smashStore.targetView;
   const uid = Firebase?.auth?.currentUser?.uid;

   const [rank, setRank] = useState(0);
   const [playerChallenge, setPlayerChallenge] = useState<any>(item);
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
                  if (pChallenge.id) {
                     setPlayerChallenge(pChallenge);
                  }
               }
            });

         let pointsToAdd = 5000;

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

   const selectedTarget = kFormatter(playerChallengeData?.selectedTarget) || 0;
   const selectedScore = kFormatter(playerChallengeData?.selectedScore) || 0;
   const durationLabel = playerChallengeData?.durationLabel || 'Monthly';
   const progress = playerChallengeData?.progress || 0;
   let score = playerChallenge?.score || 0;

   const isTeam = playerChallenge?.challengeType == 'team';
   const targetFormatted = selectedTarget > 0 ? kFormatter(selectedTarget) : 0;

   // let dailyTargetFormatted = kFormatter(dailyTarget);
   const todayView = targetView == 1;

   // if (targetView == 1) {
   //     score = todayScore;
   //     target = dailyTarget;
   // }

   const color = Colors.purple40;

   const goToArena = () => {
      smashStore.smashEffects();
      challengesStore.setActivePlayerChallengeDocId(playerChallenge);
      navigate(Routes.ChallengeArena, { challenge });
   };

   return (
      <TouchableOpacity
         onPress={goToArena}
         marginH-16
         marginB-16
         paddingB-16
         paddingL-16
         style={{
            borderRadius: 6,
            shadowColor: '#ccc',
            shadowOffset: {
               height: 1,
               width: 1,
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
            {/* <View marginH-16 marginT-16>
               <EpicBadge
                  challenge={challenge}
                  playerChallenge={playerChallenge}
                  kFormatter={kFormatter}
                  playerChallengeData={playerChallengeData}
                  durationLabel={durationLabel}
               />
            </View> */}
            <View paddingL-0 flex paddingT-16>
               <View row spread paddingR-16 centerV marginB-8>
                  <Text H16 color28>
                     {playerChallenge?.challengeName || 'loading'}
                  </Text>
                  {/* 
                  <Text R12 secondaryContent>
                     {isTeam && '(' + playerChallenge?.user?.name + ')'}
                  </Text> */}
               </View>
               {/* <View row centerV marginT-4>
                <View row>
                    <AntDesign name={'addusergroup'} size={14} color={Colors.color6D} />
                    <Text color6D marginL-4>
                        {numberOfPlayers || 0} Playing
                    </Text>
                </View>
                <View row marginL-8>
                    <AntDesign name={'checksquareo'} size={14} color={Colors.color6D} />
                    <Text color6D marginL-4>
                        {numberOfActivities} Activities
                    </Text>
                </View>
                </View>
                <View height={1} backgroundColor={Colors.line} marginV-10 marginR-20 /> 
            */}
               <View row centerV spread>
                  <View row>
                     <AntDesign name={'star'} size={14} color={color} />

                     <Text color6D marginL-4>
                        {selectedScore || 0} / {selectedTarget}{' '}
                     </Text>
                  </View>
                  <View row paddingR-20>
                     <AntDesign name={'calendar'} size={14} color={color} />
                     <Text color6D marginL-4>
                        {daysLeftWithText}
                     </Text>
                  </View>
               </View>
               <View paddingR-20 bottom marginT-5>
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
                  {/* <Text secondaryContent marginT-8>
                     You're coming {ordinal_suffix_of(rank + 1)}!
                  </Text> */}
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
};

export default inject('smashStore', 'challengesStore')(observer(TeamChallenge));
