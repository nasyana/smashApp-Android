import Box from "components/Box";
import { useNavigation } from "@react-navigation/core";
import ButtonLinear from "components/ButtonLinear";
import ActivityDetail from "components/ActivityDetail";
import PieChart from "components/PieChart";
import Firebase from "config/Firebase";
import { FONTS } from "config/FoundationConfig";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Text, View, Colors, Button } from "react-native-ui-lib";
import { inject, observer } from 'mobx-react';
import moment from "moment";
import Routes from "../../../config/Routes"
import { thisMonth } from 'helpers/dateHelpers';
const ChallengesBreakdownList = (props) => {
   const { navigate } = useNavigation();
   const { challengesStore, smashStore, focusUser, simple } = props;
   const { myChallenges } = challengesStore;
   const { libraryActivitiesHash, kFormatter, smashEffects, todayDateKey } =
      smashStore;

   const [userChallenges, setUserChallenges] = useState([]);
   const gotToChallengeArea = (playerChallenge) => {
      navigate(Routes.ChallengeArena, { playerChallenge });
   };
   useEffect(() => {
      const uid = focusUser ? focusUser.uid : Firebase?.auth?.currentUser?.uid;
      const unsubscribeToChallenges = Firebase.firestore
         .collection('playerChallenges')
         .where('active', '==', true)
         .where('uid', '==', uid)
         .where('endUnix', '>', moment().unix())
         .onSnapshot((snaps) => {
            if (!snaps.empty) {
               const challengesArray = [];

               snaps.forEach((snap) => {
                  const challenge = snap.data();

                  challengesArray.push(challenge);
               });

               setUserChallenges(challengesArray);
            }
         });

      return () => {
         if (unsubscribeToChallenges) {
            unsubscribeToChallenges();
         }
      };
   }, []);

   let DATA = userChallenges.map((playerChallenge) => {
      const playerChallengeData =
         challengesStore?.getPlayerChallengeData(playerChallenge) || {};
      const activityQuantities = playerChallenge.activityQuantities;

      return {
         colorTag: Colors.color5A,
         title: playerChallenge?.challengeName || 'nada',
         value: playerChallengeData?.selectedScore,
         items: activityQuantities ? Object.keys(activityQuantities) : [],
         activityQuantities: activityQuantities || {},
         selectedGradient: playerChallengeData?.selectedGradient || [
            '#ccc',
            '#333',
         ],
         ...playerChallenge,
         playerChallengeData,
         playerChallenge: playerChallenge,
         id: playerChallenge.challengeId,
         selectedScore: playerChallengeData?.selectedScore,
         selectedTarget: playerChallengeData?.selectedTarget,
         progress: playerChallengeData?.progress || 0,
      };
   });
   const goToTimeline = (data) => {
      smashEffects();
      navigate(Routes.Timeline, { uid, ...data });
   };

   const uid = Firebase.auth.currentUser.uid;
   return (
      <View flex>
         <View
            row
            paddingH-16
            paddingT-13
            paddingB-11
            centerV
            style={{
               justifyContent: 'space-between',
            }}>
            <Text H14 color28>
               {'Challenges Snapshots'.toUpperCase()}
            </Text>
            {/* <Button label="All" link color={Colors.buttonLink} /> */}
         </View>
         <View
            height={1}
            backgroundColor={Colors.line}
            style={{ marginBottom: 16 }}
         />
         {DATA.map((item, index) => {
            return (
               <ActivityDetail
                  item={item}
                  key={index}
                  {...{
                     libraryActivitiesHash,
                     kFormatter,
                     challengesStore,
                     goToTimeline,
                     todayDateKey,
                  }}
                  gotToChallengeArea={gotToChallengeArea}
                  simple={simple}
                  isWholeChallenge
                  showLast7
               />
            );
         })}
      </View>
   );
};

export default inject("smashStore", "challengesStore", "challengeArenaStore")(observer(ChallengesBreakdownList));
