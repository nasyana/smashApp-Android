import { width } from "config/scaleAccordingToDevice";
import React, { useMemo, useState, useEffect } from "react";
import { FlatList, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Colors, Image, Assets, Text, Avatar } from "react-native-ui-lib";
import Player from "./components/Player";
import ColDescription from "./components/ColDescription";
import { inject, observer } from 'mobx-react';
import Firebase from "../../config/Firebase"
import { getEndDateKey } from 'helpers/playersDataHelpers';
import { moment } from 'helpers/generalHelpers';;
import { FlashList } from "@shopify/flash-list";
import { useNavigation, useRoute } from '@react-navigation/core';
import Routes from "config/Routes";
const CommunityList = (props) => {
   const { uid } = Firebase.auth.currentUser
   const { navigate, goBack, } = useNavigation();
   const [loaded, setLoaded] = useState(true);
   const [players, setPlayers] = useState('');
   const {
      smashStore,
      challengeIsSingleActivity,
      challengeData,
      challengesStore,
      community
   } = props;
   const { setInsightsPlayerChallengeDoc, getPlayerChallengeData, currentChallenge = {} } =
      challengesStore;


   const goToProfile = (user) => {

      if (user.uid === uid) {
         navigate(Routes.MyProfile, { user });
      } else {

         navigate(Routes.MyProfileHome, { user });
      }

   };

   const challenge = currentChallenge;
   const renderItem = ({ item, index }) => {
      const { like, invite, kFormatter, toggleFollowUnfollow, currentUser } =
         smashStore;
      const playerChallengeData = getPlayerChallengeData(item);

;
      return (
         <Player
            playerChallengeData={playerChallengeData}
            item={item}
            community
            index={index}
            {...{
               currentUser,
               challenge,
               challengesStore,
               setInsightsPlayerChallengeDoc,
               like,
               invite,
               goToProfile,
               kFormatter,
               challengeIsSingleActivity,
               toggleFollowUnfollow,
            }}
         />
      );
   };
   const visible = true;
   const data = (players || []);

   let rank = 1;
   
   for (let i = 1; i < data.length; i++) {

      if (data[i].dailyAverageQty < data[i - 1].dailyAverageQty) {

         rank++;

      }

      data[i].rank = rank;
      data[0].rank = 1;
   }
   // const endDateKey = getEndDateKey(challenge);
   useEffect(() => {
      let unsubscribeToPlayers


      if(community){


         if (challenge.id) {
         
            let dailyAvQuery = Firebase.firestore
               .collection('playerChallenges')
               .where('active', '==', true)
               // .where('endDateKey', '==', endDateKey)
               .where('challengeId', '==', challenge.id)
               // .where('endUnix', '>', moment().unix())
               // .where('duration', '>', 0)
               .where('dailyAverage', '>=', 0)
               .orderBy('dailyAverage', 'desc')
               .limit(30);
      
      
            if (challenge.targetType == 'qty') {
               dailyAvQuery = Firebase.firestore
                  .collection('playerChallenges')
                  .where('active', '==', true)
                  // .where('endDateKey', '==', endDateKey)
                  .where('challengeId', '==', challenge.id)
                  // .where('endUnix', '>', moment().unix())
                  // .where('duration', '>', 0)
                  .where('dailyAverageQty', '>=', 0)
                  .orderBy('dailyAverageQty', 'desc')
                  .limit(30);
            }
      
               unsubscribeToPlayers = dailyAvQuery.onSnapshot((snaps) => {
               if (!snaps.empty) {
                  const playerChallengesArray = [];
      
                  snaps.forEach((snap) => {
                     const playerChallenge = snap.data();
                     playerChallengesArray.push(playerChallenge);
                  });
      
                  setPlayers(playerChallengesArray);
               
               } else {
                  console.warn('empty!');
               }
            });
      
            }



      }else{


         if (challenge.id) {
         
            let dailyAvQuery = Firebase.firestore
               .collection('playerChallenges')
               .where('active', '==', true)
               // .where('endDateKey', '==', endDateKey)
               .where('challengeId', '==', challenge.id)
               // .where('endUnix', '>', moment().unix())
               // .where('duration', '>', 0)
               .where('dailyAverage', '>=', 0)
               .orderBy('dailyAverage', 'desc')
               .limit(30);
      
      
            if (challenge.targetType == 'qty') {
               dailyAvQuery = Firebase.firestore
                  .collection('playerChallenges')
                  .where('active', '==', true)
                  // .where('endDateKey', '==', endDateKey)
                  .where('challengeId', '==', challenge.id)
                  // .where('endUnix', '>', moment().unix())
                  // .where('duration', '>', 0)
                  .where('dailyAverageQty', '>=', 0)
                  .orderBy('dailyAverageQty', 'desc')
                  .limit(30);
            }
      
               unsubscribeToPlayers = dailyAvQuery.onSnapshot((snaps) => {
               if (!snaps.empty) {
                  const playerChallengesArray = [];
      
                  snaps.forEach((snap) => {
                     const playerChallenge = snap.data();
                     playerChallengesArray.push(playerChallenge);
                  });
      
                  setPlayers(playerChallengesArray);
               
               } else {
                  console.warn('empty!');
               }
            });
      
            }



      }



      return () => {
         if (unsubscribeToPlayers) {
            unsubscribeToPlayers();
         }
      };
   }, [challenge.id]);



   return (

      // <View style={{ height: 400, backgroundColor: '#000' }} />
      <FlashList
      estimatedItemSize={91} 
            data={data}
            scrollEnabled={false}
            renderItem={renderItem}
         keyExtractor={(item, index) => item?.uid ? `${item?.uid}_${item?.challengeId}` : index + 'N'}

            ListHeaderComponent={() => {
               return (
                  <ColDescription
                     challenge={challengeData}
                     unit={challenge.unit}
                  />
               );
            }}
      />

   );
};

export default inject("smashStore", "challengesStore", "challengeArenaStore")(observer(CommunityList));
