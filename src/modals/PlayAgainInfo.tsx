import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import React, { useState, useEffect } from 'react';
import ButtonLinear from 'components/ButtonLinear';
import Firebase from 'config/Firebase';
import { Alert, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import SmartImage from 'components/SmartImage/SmartImage';
import firebase from 'firebase';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
import CelebratePlayAgain from 'components/CelebratePlayAgain';
import { durations } from 'helpers/generalHelpers';
import { moment } from 'helpers/generalHelpers';;
import { bottom, height, width, isSmall } from 'config/scaleAccordingToDevice';
import { challengeDaysSmashed } from 'helpers/generalHelpers';
import { Vibrate } from 'helpers/HapticsHelpers';
import { daysInMonthOfPlayerChallenge } from 'helpers/dateHelpers';

const PlayAgainInfo = (props) => {
   const {
      myFinishedChallenges,
      challengesStore,
      smashStore,
      disableForASecond,
      hasFinishedChallenges,
   } = props;

   const { toggleMeInChallenge } = challengesStore;
   const { currentUser } = smashStore;
   const playerChallenge = myFinishedChallenges?.[0];
   const endDateKey = challengesStore.getEndDateKey(playerChallenge);
   const endUnix = challengesStore.getEndUnix(playerChallenge);
   const [selectedDuration, setSelectedDuration] = useState(null);
   const [isPlayAgain, setIsPlayAgain] = useState(true);

   const challengeDuration = playerChallenge.duration || 7;
   // 1659268799
   const continueEndDate = (duration) => {
      if (challengeDuration > 1) {
         const daysToAdd = duration.key;
         return moment(playerChallenge.startDate, 'DDMMYYYY')
            .add(daysToAdd, 'days')
            .format('DDMMYYYY');
      } else {
         return 'nope';
      }
   };
   const continueChallenge = (duration) => {
      const daysToAdd = duration.key;
      const endDate = moment(playerChallenge.startDate, 'DDMMYYYY')
         .add(daysToAdd, 'days')
         .format('DDMMYYYY');
      const endUnix = moment(playerChallenge.startDate, 'DDMMYYYY')
         .add(daysToAdd, 'days').endOf('day')
         .unix();

      Firebase.firestore
         .collection('playerChallenges')
         .doc(playerChallenge.id)
         .set(
            {
               duration: daysToAdd,
               endDate,
               endUnix,
               historyLog: firebase.firestore.FieldValue.arrayUnion({
                  updatedAt: parseInt(Date.now() / 1000),
                  from: challengeDuration,
                  to: daysToAdd,
                  prevEndDate: playerChallenge.endDate,
                  prevEndDateUnix: playerChallenge.endUnix,
                  newEndDate: endDate,
                  newEndUnix: endUnix,
               }),
            },
            { merge: true },
         );
      setTimeout(() => {
         smashStore.simpleCelebrate = {
            name: `Challenge exended to ${daysToAdd} days!`,
            title: `Nice! You continued ${playerChallenge.challengeName}`,
            subtitle: `Try to smash more daily targets! 🔥🔥🔥`,
            buttonText: "Let's go!",
         };
      }, 1000);
      if (hasFinishedChallenges) {
         /// if has multiple then doesn't need to be cleared
      } else {
         // if has single then clear it from smashstore
         challengesStore.removeFinishedChallengeFromArray(0);
      }
   };

   const joinTheChallenge = (duration) => {
      const { challengesHash, joinChallenge } = challengesStore;
      const challengeToJoin = challengesHash?.[playerChallenge?.challengeId];

      const days = moment(duration.endDate, 'DDMMYYYY').diff(
         moment(duration.startDate, 'DDMMYYYY'),
         'days',
      );
      joinChallenge(challengeToJoin, currentUser, {
         startDate: duration.startDate,
         endDate: duration.endDate,
         duration: duration.key,
      });

      if (hasFinishedChallenges) {
         /// if has multiple then doesn't need to be cleared
      } else {
         // if has single then clear it from smashstore
         challengesStore.removeFinishedChallengeFromArray(0);
      }
   };

   const onSelectDuration = (duration) => {
      Vibrate();

      if (duration.key <= parseInt(challengeDuration) && !isPlayAgain) {
         //
         // alert('Oops you already smashed this one');
         return;
      }
      if (
         moment().isAfter(moment(continueEndDate(duration), 'DDMMYYYY')) &&
         !isPlayAgain
      ) {
         alert('Oops! Need to restart!');
         return;
      }
      if (isPlayAgain) {
         Firebase.firestore
            .collection('playerChallenges')
            .doc(playerChallenge.id)
            .set(
               { active: false, updatedAt: parseInt(Date.now() / 1000) },
               { merge: true },
            );
         disableForASecond();
         joinTheChallenge(duration);
      } else {
         continueChallenge(duration);
         disableForASecond();
      }

      // const days = moment(duration.endDate, 'DDMMYYYY').diff(
      //    moment(duration.startDate, 'DDMMYYYY'),
      //    'days',
      // );
      // setSelectedDuration({
      //    ...duration,
      //    days,
      // });
      // toggleMeInChallenge(challengeToJoin, currentUser, false, {
      //    startDate: duration.startDate,
      //    endDate: duration.endDate,
      //    duration: days,
      // });
   };

   const playAgain = async () => {
      const { uid } = Firebase.auth.currentUser;
      // const newPlayerChallengeId = `${uid}_${playerChallenge?.challengeId}_${endDateKey}`;
      smashStore.smashEffects();

      // const newPlayerChallenge = {
      //    ...playerChallenge,
      //    endUnix: endUnix,
      //    endDateKey: endDateKey,
      //    activityPoints: {},
      //    activityQuantities: {},
      //    active: true,
      //    daily: {},
      //    id: newPlayerChallengeId,
      //    qty: 0,
      //    score: 0,
      //    following: currentUser?.following || [],
      //    followers: currentUser?.followers || [],
      //    updatedAt: parseInt(Date.now() / 1000),
      //    timestamp: parseInt(Date.now() / 1000),
      //    started: parseInt(Date.now() / 1000),
      //    startUnix: parseInt(Date.now() / 1000),
      // };

      setTimeout(async () => {
         Firebase.firestore
            .collection('playerChallenges')
            .doc(playerChallenge.id)
            .set(
               { active: false, updatedAt: parseInt(Date.now() / 1000) },
               { merge: true },
            );
      }, 1100);

      setTimeout(async () => {
         // const doc = await Firebase.firestore
         //    .collection('challenges')
         //    .doc(playerChallenge?.challengeId)
         //    .get();

         const { challengesHash } = challengesStore;
         const challenge = challengesHash?.[playerChallenge?.challengeId];
         // if (!doc.empty) {
         //    const challenge = doc.data();
         challengesStore.setChallengeToJoin(challenge);
         // }
      }, 3000);

      // Firebase.firestore
      //    .collection('playerChallenges')
      //    .doc(newPlayerChallengeId)
      //    .set(newPlayerChallenge);

      if (hasFinishedChallenges) {
         /// if has multiple then doesn't need to be cleared
      } else {
         // if has single then clear it from smashstore
         challengesStore.removeFinishedChallengeFromArray(0);
      }

      // Firebase.firestore
      //    .collection('users')
      //    .doc(uid)
      //    .set(
      //       {
      //          inChallenge: {
      //             [endDateKey]: firebase.firestore.FieldValue.arrayUnion(
      //                playerChallenge.challengeId,
      //             ),
      //          },
      //          inChallengeMap: {
      //             [endDateKey]: { [playerChallenge.challengeId]: true },
      //          },
      //       },
      //       { merge: true },
      //    );

      // Firebase.firestore
      //    .collection('challenges')
      //    .doc(playerChallenge.challengeId)
      //    .set(
      //       {
      //          playing: firebase.firestore.FieldValue.increment(1),
      //          challengeTimeframes: {
      //             [endDateKey]: {
      //                playing: firebase.firestore.FieldValue.increment(1),
      //             },
      //          },
      //       },
      //       { merge: true },
      //    );
   };

   const nope = (playerChallenge) => {
      disableForASecond();
      smashStore.smashEffects();
      if (hasFinishedChallenges) {
         /// if has multiple then doesn't need to be cleared
      } else {
         // if has single then clear it from smashstore
         // challengesStore.removeFinishedChallengeFromArray(0);
      }

      Firebase.firestore
         .collection('playerChallenges')
         .doc(playerChallenge.id)
         .set(
            { active: false, updatedAt: parseInt(Date.now() / 1000) },
            { merge: true },
         );

      Firebase.firestore
         .collection('challenges')
         .doc(playerChallenge.challengeId)
         .set(
            {
               playing: firebase.firestore.FieldValue.increment(-1),
            },
            { merge: true },
         );


      Firebase.firestore
         .collection('users')
         .doc(playerChallenge.uid)
         .set(
            {
               inChallengeArray: firebase.firestore.FieldValue.arrayRemove(
                  playerChallenge.challengeId,
               ),

               inChallengeMap: { [playerChallenge.challengeId]: false },
            },
            { merge: true },
         );


         challengesStore.removeFromChallengesStore(playerChallenge.challengeId); 

   };

   const showAlert = (message) => {
      Alert.alert('Oops!', message, [
         // {
         //   text: 'Cancel',
         //   onPress: () => console.log('Cancel Pressed'),
         //   style: 'cancel',
         // },
         { text: 'Got It!', onPress: () => console.log('OK Pressed') },
      ]);
   };
   const offColor = '#bbb'
   return (
      <View>
         <SmartImage
            uri={playerChallenge?.picture?.uri}
            preview={playerChallenge?.picture?.preview}
            style={{ height: height / 8, width: '100%' }}
         />

         {!challengesStore.celebratePlayAgain && (
            <View>
               <View paddingT-32 marginB-8>
                  {challengeDuration > 0 && !isPlayAgain && (
                     <Text center>
                        You smashed {challengeDaysSmashed(playerChallenge)} of{' '}
                        {challengeDuration} days!
                     </Text>
                  )}
                  <Text B24 center>
                     {`${
                        isPlayAgain ? 'Play Again?' : 'Do you want to Continue?'
                     }`}
                  </Text>
               </View>

               <Text
                  R12
                  center
                  color97
                  style={{ letterSpacing: 2, marginBottom: 16 }}>
                  {playerChallenge?.challengeName?.toUpperCase() || ''}
               </Text>

               <View
                  row
                  style={{
                     flexWrap: 'wrap',
                     alignItems: 'center',
                     justifyContent: 'center',
                  }}>
                  {durations.map((duration, index) => {
                     const selected =
                        challengeDuration === duration.key && !isPlayAgain;
                     const disabled =
                        duration.key <= parseInt(challengeDuration) &&
                        !isPlayAgain;

                     const challengeDurationsSmashedHash = currentUser?.challengesSmashed?.[playerChallenge?.challengeId] || {}

                     const prevDuration = index > 0 ? durations[index - 1] : false;
                     const hasPassedThisDuration = challengeDurationsSmashedHash?.[duration.key] || false
                     const hasPassedPreviousDuration = challengeDurationsSmashedHash?.[prevDuration.key] || false
                     const allowedToDo =
                        duration.key <= durations[0].key || hasPassedPreviousDuration
                     const icon = durations[index].icon;
                     const color = durations[index].color;

                     return (
                        // <ButtonLinear
                        //    title={duration.text}
                        //    subTitle={duration.subText}
                        //    style={{
                        //       width: '100%',
                        //       marginBottom: 0,
                        //       marginTop: 24,
                        //       // padding: 10,
                        //    }}
                        //    styleText={{ fontSize: 20 }}
                        //    onPress={() => onSelectDuration(duration)}
                        // />
                        <TouchableOpacity
                           onPress={() =>
                              allowedToDo
                                 ? onSelectDuration(duration)
                                 : showAlert(
                                    'You need to unlock this challenge by completing the previous challenge level.',
                                 )
                           }
                           // disabled
                           style={{
                              width: '40%',
                              borderWidth: 2,
                              borderColor: allowedToDo
                                 ? Colors.buttonLink
                                 : '#aaa',
                              margin: 4,
                              borderRadius: 4,
                              alignItems: 'center',
                              justifyContent: 'center',
                              // opacity: isPlayAgain ? 1 : disabled ? 0.5 : 1,
                              padding: isSmall ? 16 : 24,
                              backgroundColor: selected
                                 ? Colors.buttonLink
                                 : 'transparent',
                           }}>
                           <View style={{
                              backgroundColor: allowedToDo
                                 ? color
                                 : offColor, width: 50, height: 50, borderRadius: 60
                           }}>
                              <Image
                                 source={icon}
                                 style={{
                                    height: 50,
                                    width: 50,
                                    position: 'absolute',

                                 }}
                              />
                           </View>
                           <Text
                              B18
                              center
                              marginV-8
                              style={{
                                 letterSpacing: 0,
                                 color: allowedToDo
                                    ? color
                                    : offColor,
                              }}>
                              {duration.key} DAYS{hasPassedThisDuration && ' ✅'}
                           </Text>
                           <Text center R10 secondaryContent white={selected}>
                              {duration.subText}
                           </Text>
                           {!isPlayAgain && (
                              <Text
                                 white={selected}
                                 R12
                                 marginT-8
                                 style={{
                                    color: disabled
                                       ? '#ccc'
                                       : Colors.buttonLink,
                                 }}>
                                 Extend to{' '}
                                 {moment(
                                    continueEndDate(duration),
                                    'DDMMYYYY',
                                 ).format('Do MMM')}
                              </Text>
                           )}
                        </TouchableOpacity>
                     );
                  })}

               </View>
               {/* <ButtonLinear
                  title={isPlayAgain ? 'Go back' : 'Restart Challenge'}
                  style={{ marginBottom: 10, marginTop: 24 }}
                  onPress={() => setIsPlayAgain((playAgain) => !playAgain)}
               /> */}

               <ButtonLinear
                  title="No, I'm all done for now"
                  bordered
                  onPress={() => nope(playerChallenge)}
                  colors={['#aaa', '#aaa']}
                  color={Colors.red40}
                  style={{ marginTop: 16, marginHorizontal: 36 }}
               />
            </View>
         )}
         {/* {challengesStore.celebratePlayAgain && (
            <CelebratePlayAgain
               oldPlayerChallenge={playerChallenge}
               smashStore={smashStore}
            />
         )} */}
      </View>
   );
};;;;;;;;;;;

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(PlayAgainInfo));
