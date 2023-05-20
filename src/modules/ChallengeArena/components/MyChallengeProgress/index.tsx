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
import {
   MaterialCommunityIcons,
   AntDesign,
   Ionicons,
   Feather,
   Entypo,
} from '@expo/vector-icons';
import { daysInChallenge, daysLeftInChallenge } from 'helpers/dateHelpers';
const MyChallengeProgress = inject(
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
         myRank,
      } = props;

      const {
         daysRemaining,
         kFormatter,
         toggleMeInChallenge,
         checkInfinity,
         ordinal_suffix_of,
         numberWithCommas,
      } = smashStore;

      const days = [];

      const targetView = props.smashStore.targetView;

      const { getChallengeData, playerChallengeHashByChallengeId } =
         challengesStore;
      const uid = Firebase?.auth?.currentUser?.uid;

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
                     <View row centerV>
                        <AntDesign
                           name={'star'}
                           size={14}
                           color={accentColor || color}
                        />
                        <Text secondaryContent>
                           {' '}
                           Daily Av. ({numberWithCommas(selectedDailyAverage)})
                        </Text>
                     </View>
                     <View row centerV>
                        <AntDesign
                           name={'staro'}
                           size={14}
                           color={accentColor || color}
                        />

                        <Text color6D marginL-4>
                           {numberWithCommas(selectedScore) || 0}{' '}
                           {/* {todayView ? dailyTargetFormatted : targetFormatted}{' '} */}
                           Total
                           {/* ({challenge?.unit || 'Points'}) */}
                        </Text>
                     </View>
                     <View row>
                        <Entypo
                           name={'medal'}
                           size={14}
                           color={accentColor || Colors.buttonLink}
                           style={{ marginLeft: 8, marginRight: 2 }}
                        />
                        <Text secondaryContent>
                           {myRank > 0 ? ordinal_suffix_of(myRank) : 'Not Started'}{' '}
                        </Text>
                     </View>
                  </View>
               </View>
            </View>
         </View>
      );
   }),
);

export default MyChallengeProgress;
