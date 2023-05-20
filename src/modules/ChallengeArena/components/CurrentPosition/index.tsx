import Tag from "components/Tag";
import React, { useEffect, useState } from "react";
import { inject, observer } from 'mobx-react';
import { useNavigation } from "@react-navigation/native";
import SmartImage from "../../../../components/SmartImage/SmartImage"
import { View, Image, Text, Colors, Assets, ProgressBar, TouchableOpacity, Button } from "react-native-ui-lib";
import { doc, onSnapshot } from 'firebase/firestore';
import SwipeableItem from "components/SwipeableItem/SwipeableItem";
import Routes from "../../../../config/Routes"
import moment, { ISO_8601 } from "moment";
import firebaseInstance from "../../../../config/Firebase";
const firestore = firebaseInstance.firestore;
import Badge from "../../../../components/Badge"
import { width } from "config/scaleAccordingToDevice";
import {
   MaterialCommunityIcons,
   AntDesign,
   Ionicons,
   Feather,
   Entypo,
} from '@expo/vector-icons';
import { daysInChallenge, daysLeftInChallenge } from 'helpers/dateHelpers';
import Box from "components/Box";
const CurrentPosition = inject(
   'smashStore',
   'challengesStore',
)(
   observer((props) => {
      const { navigate } = useNavigation();
      const {
         playerChallenge,
         smashStore,
         accentColor,
         challengesStore,
         playerChallengeData,
      } = props;

      const {
         daysRemaining,
         kFormatter,
         toggleMeInChallenge,
         checkInfinity,
         ordinal_suffix_of,
         numberWithCommas,
         currentUser
      } = smashStore;


      const targetView = props.smashStore.targetView;

      const { getChallengeData, myChallengeRankByChallengeId } =
         challengesStore;

      const myRank =
         myChallengeRankByChallengeId?.[playerChallenge?.challengeId] || 1;


      const uid = currentUser?.uid;
      const [streakDoc, setStreakDoc] = React.useState(false)
      const [challenge, setChallenge] = useState('');


      useEffect(() => {
         const unsubscribe = onSnapshot(doc(firestore, 'challengeStreaks', `${firebaseInstance.auth.currentUser.uid}_${playerChallenge.challengeId}`), snap => {
           if (snap.exists()) {
             const streak = snap.data();
             setStreakDoc(streak);
           }
         });
     
         return () => {
           unsubscribe();
         };
       }, [playerChallenge.challengeId]);
     
       useEffect(() => {
         const unsubscribe = onSnapshot(doc(firestore, 'challenges', playerChallenge.challengeId), snap => {
           if (snap.exists()) {
             const challenge = snap.data();
             setChallenge(challenge);
           }
         });
     
         return () => {
           unsubscribe();
         };
       }, [playerChallenge.challengeId]);

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

      const {
         challengeNotStartedYet,
         selectedTarget,
         selectedScore,
         todayScore,
         todayQty,
         daysUntilStartDate,
         targetType,
         dailyAverage,
         dailyAverageQty,
      } = playerChallenge;
      let score = playerChallenge?.score || 0;

      const targetFormatted = target > 0 ? kFormatter(selectedTarget) : 0;
      const hasReachedTarget = selectedScore > selectedTarget;

      let dailyTarget = (selectedTarget - selectedScore) / daysLeft;

      const selectedDailyAverage =
         targetType == 'points' ? dailyAverage : dailyAverageQty;
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

      const iconContainer = { marginRight: 12, backgroundColor: playerChallenge.colorEnd, borderRadius: 16, width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }
      return (

         <Box style={{ width: (width / 2) - 8, marginLeft: 8 }}>

            <View style={{ padding: 16 }} >
               <Text center B12 marginB-16>YOUR POSITION</Text>
               <View centerV spread>
                  <View row centerV marginB-10>
                     <View style={{ ...iconContainer }}>
                        <AntDesign
                           name={'star'}
                           size={12}
                           color={'#fff'}
                        />
                     </View>
                     <Text M14 secondaryContent>
                        Daily Av. ({numberWithCommas(selectedDailyAverage)})
                     </Text>
                  </View>
                  {false && <View row centerV marginB-10>
                     <View style={{ ...iconContainer }}>
                        <AntDesign
                           name={'staro'}
                           size={12}
                           color={'#fff'}
                        />
                     </View>
                     <Text M14 color6D >
                        {/* {numberWithCommas(selectedScore) || 0}{' '} */}
                        {/* {todayView ? dailyTargetFormatted : targetFormatted}{' '} */}
                        Activities: {playerChallenge.masterIds.length}
                        {/* ({challenge?.unit || 'Points'}) */}
                     </Text>
                  </View>}

                  <View row centerV marginB-10>
                     <View style={{ ...iconContainer }}>
                        <AntDesign
                           name={'staro'}
                           size={12}
                           color={'#fff'}
                        />
                     </View>
                     <Text M14 secondaryContent>
                        Highest: {streakDoc.highestStreak}
                     </Text>
                  </View>
                  <View row centerV >
                     <View style={{ ...iconContainer }}>
                        <Entypo
                           name={'medal'}
                           size={12}
                           color={'#fff'}
                        />
                     </View>
                     <Text M14 secondaryContent>
                        {myRank > 0 ? "Position: " + ordinal_suffix_of(myRank) : 'Not Started'}{' '}
                     </Text>
                  </View>




               </View>
            </View>
         </Box>

      );
   }),
);

export default CurrentPosition;
