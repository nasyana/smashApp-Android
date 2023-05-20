import { width } from "config/scaleAccordingToDevice";
import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Colors, Image, Assets, Text, Avatar, Button,TouchableOpacity } from "react-native-ui-lib";
import ColDescription from "./components/ColDescription";
import Firebase from "../../config/Firebase"
import { inject, observer } from 'mobx-react';
import SmartImage from "../../components/SmartImage/SmartImage"
import Player from "./components/Player";

const PlayersImFollowing = inject("smashStore", "challengeArenaStore", "challengesStore")(observer((props) => {


  const [players, setPlayers] = useState([]);

  const [loaded, setLoaded] = useState(true)

  const {
     smashStore,
     goToProfile,
     challengeIsSingleActivity,
     showPlayerSmashesFunc,
     challengeData,
     showFollowingList,
     challengesStore,
     playerChallengeDoc,
     share
  } = props;

  const { kFormatter, currentUser } = smashStore;

  const {
     setInsightsPlayerChallengeDoc,
     getPlayerChallengeData,
      currentChallenge = {} } =
      challengesStore;



   const challenge = currentChallenge;

  const renderItem = ({ item, index }) => {
     const playerChallengeData = getPlayerChallengeData(item);
     const { like, invite } = smashStore;

   
     if (!item) {
        return null;
     }
     return (
        <Player
           playerChallengeData={playerChallengeData}
           item={item}
           index={index}
           {...{
              currentUser,
              challenge,
              challengesStore,
              setInsightsPlayerChallengeDoc,
              challengeData,
              like,
              invite,
              goToProfile,
              kFormatter,
              challengeIsSingleActivity,
              showPlayerSmashesFunc,
           }}
        />
     );
  };

  const { uid } = currentUser;

   useEffect(() => {



      // if (challenge.id) {

      console.log('set challenge in useEFfect', challenge.id)
      let dailyAvQuery = Firebase.firestore
         .collection('playerChallenges')
         .where('followers', 'array-contains', uid)
         .where('active', '==', true)
         .where('challengeId', '==', challenge.id)
         .where('dailyAverage', '>=', 0)
         .orderBy('dailyAverage', 'desc')
            .limit(30);

      if (challenge.targetType == 'qty') {
         dailyAvQuery = Firebase.firestore
            .collection('playerChallenges')
            .where('followers', 'array-contains', uid)
            .where('active', '==', true)
            .where('challengeId', '==', challenge.id)
            .where('dailyAverageQty', '>=', 0)
            .orderBy('dailyAverageQty', 'desc')

               .limit(30);
         }


      const unsubscribeToPlayers = dailyAvQuery.onSnapshot((snaps) => {
         if (!snaps.empty) {
            const challengesArray = [];

            snaps.forEach((snap) => {
               const challenge = snap.data();

               challengesArray.push(challenge);
            });

            setPlayers(challengesArray.filter((c) => c.duration > 0));
         }
      });

      // }

     return () => {
        if (unsubscribeToPlayers) {
           unsubscribeToPlayers();
        }

     };
  }, []);

  if (!loaded) {
     return null;
  }

   const data = (players || []);

   let rank = 1;

   for (let i = 1; i < data.length; i++) {

      if (data[i].dailyAverageQty < data[i - 1].dailyAverageQty) {

         rank++;

      }

      data[i].rank = rank;
      data[0].rank = 1;
   }

   const shareChallengeCode = () => {
      share()
   }


  return (
     <View flex backgroundColor={Colors.background}>
        <FlatList
           data={players || []}
           renderItem={renderItem}
           scrollEnabled={false}
           keyExtractor={(item, index) => item?.user.uid}
           contentContainerStyle={{}}
           ListFooterComponent={() => (
              <View>
                 <TouchableOpacity
                    backgroundColor={'#fafafa'}
                    color="white"
                    onPress={shareChallengeCode}
                    marginH-16
                    padding-24
                    center>
                    <Text>Invite Friends</Text>
                 </TouchableOpacity>
              </View>
           )}
           ListHeaderComponent={() => {
              return <ColDescription challenge={challenge} />;
           }}
        />
     </View>
  );
})
);
export default PlayersImFollowing;
