import { View, Text } from 'react-native-ui-lib';
import { ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import Firebase from 'config/Firebase';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { width, height } from 'config/scaleAccordingToDevice';
import EpicBadgeProfile from 'components/EpicBadgeProfile';
import { unixToFromNow } from 'helpers/generalHelpers';
import { unixToMonth } from 'helpers/dateHelpers';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
const PlayerBadgesHorizontalScrollview = (props) => {
   const [badges, setBadges] = useState([]);

   const uid = props.uid || Firebase.auth.currentUser.uid;
   useEffect(() => {
      const unsub = Firebase.firestore
         .collection('playerChallenges')
         .where('uid', '==', uid)
         .where('endDate', '!=', null)
         // .orderBy('timestamp', 'desc')
         .onSnapshot((snaps) => {
            let badgesArray = [];
            snaps.forEach((snap) => {
               const badge = snap.data();
               badgesArray.push(getPlayerChallengeData(badge));
            });

            setBadges(badgesArray);
         });

      return () => {
         if (unsub) {
            unsub();
         }
      };
   }, [uid]);

   const badgesWhereSelectedScoreIsHigherThanTarget = (badge) => {
      const score =
         badge.targetType == 'points' ? badge.score || 0 : badge.qty || 0;
      return score >= badge.target;
   };

   const wonBadges = badges.filter(badgesWhereSelectedScoreIsHigherThanTarget);
   if (wonBadges.length == 0) {
      return null;
   }
   return (
      <View>
         <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ width }}
            contentContainerStyle={{
               paddingHorizontal: 24,
               paddingBottom: 16,
               paddingTop: 8,
            }}>
            {wonBadges.map((badge) => {
               return (
                  <View style={{ alignItems: 'center' }}>
                     <EpicBadgeProfile playerChallenge={badge} uid size={110} />
                  </View>
               );
            })}
         </ScrollView>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
)(observer(PlayerBadgesHorizontalScrollview));
