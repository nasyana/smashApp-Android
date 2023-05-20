import Box from 'components/Box';
import ButtonLinear from 'components/ButtonLinear';
import ActivityDetail from 'components/ActivityDetail';
import PieChart from 'components/PieChart';
import Firebase from 'config/Firebase';
import { FONTS } from 'config/FoundationConfig';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View, Colors, Button } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import Routes from 'config/Routes';
const TeamsBreakdownList = (props) => {
   const { navigate } = useNavigation();
   const { challengesStore, smashStore, today, date, focusUser } = props;
   const { myChallenges } = challengesStore;
   const {
      libraryActivitiesHash,
      kFormatter,
      activity,
      todayDateKey,
      smashEffects,
   } = smashStore;

   const [userDay, setUserDay] = useState(false);
   const goToTimeline = (data) => {
      smashEffects();
      navigate(Routes.Timeline, {
         activityId: data.activityId,
         dayKey: date,
      });
   };
   useEffect(() => {
      const { uid } = Firebase.auth.currentUser;

      const userId = focusUser ? focusUser.uid : uid;
      const unsubscribeToUserActivity = Firebase.firestore
         .collection('dailyActivity')
         .doc(`${userId}_${todayDateKey}`)
         .onSnapshot((snap) => {
            setUserDay(snap.data());
         });

      return () => {
         if (unsubscribeToUserActivity) {
            unsubscribeToUserActivity();
         }
      };
   }, []);

   const { dayKeyToHuman } = smashStore;

   const humanDate = dayKeyToHuman(date);

   const day = activity[date];

   const DATA = day?.teams
      ? Object.keys(day?.teams).map((chId) => {
           const challengeBlock = day?.challenges[chId];
           const activityQuantities = challengeBlock?.activityQuantities;
           return {
              colorTag: Colors.color5A,
              title: challengeBlock.challengeName || 'nada',
              dayTotal: challengeBlock?.score || '',
              value: challengeBlock.score,
              items: activityQuantities ? Object.keys(activityQuantities) : [],
              activityQuantities: activityQuantities || {},
              daily: challengeBlock.daily,
           };
        })
      : [];
   if (DATA?.length == 0) {
      return null;
   }
   const uid = Firebase.auth.currentUser.uid;
   return (
      <View flex>
         <View
            row
            paddingH-24
            paddingT-13
            paddingB-11
            centerV
            style={{
               justifyContent: 'space-between',
            }}>
            <Text H12 color28>
               {'Challenges'.toUpperCase()}
            </Text>
            <Text H12>{humanDate.toUpperCase()}</Text>
            {/* <Button label={humanDate} link color={Colors.buttonLink} /> */}
         </View>
         <View height={1} backgroundColor={Colors.line} />
         {DATA.map((item, index) => {
            return (
               <ActivityDetail
                  today={today}
                  item={item}
                  key={date}
                  {...{
                     libraryActivitiesHash,
                     kFormatter,
                     date,
                     challengesStore,
                     smashStore,
                     goToTimeline,
                  }}
               />
            );
         })}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
)(observer(TeamsBreakdownList));
