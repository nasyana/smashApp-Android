import { width } from "config/scaleAccordingToDevice";
import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Colors, Image, Assets, Text, Avatar, Button,TouchableOpacity } from "react-native-ui-lib";
import ColDescription from "./components/ColDescription";
import firebaseInstance from "../../config/Firebase";
const firestore = firebaseInstance.firestore;
import { inject, observer } from 'mobx-react';
import SmartImage from "../../components/SmartImage/SmartImage"
import Player from "./components/Player";
import { collection, where, orderBy, onSnapshot, query } from "firebase/firestore";

const PlayersImFollowing = inject("smashStore", "challengeArenaStore", "challengesStore")(observer((props) => {


  const [players, setPlayers] = useState([]);

  const [loaded, setLoaded] = useState(true)

  const {
     smashStore,
     challengeIsSingleActivity,
     showPlayerSmashesFunc,
     challengeData,
     challengesStore,
     challenge,
     community
  } = props;

  const { kFormatter, currentUser,shareChallenge } = smashStore;

  const {
     setInsightsPlayerChallengeDoc,
     getPlayerChallengeData,
      currentChallenge = {} } =
      challengesStore;




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
              smashStore,
              kFormatter,
              challengeIsSingleActivity,
              showPlayerSmashesFunc,
           }}
        />
     );
  };

  const { uid } = firebaseInstance.auth.currentUser;

  useEffect(() => {
   let dailyAvQuery = query(collection(firestore, 'playerChallenges'),
   where('followers', 'array-contains', uid),
   where('active', '==', true),
   where('challengeId', '==', challenge?.id || false),
   where('dailyAverage', '>', -1),
   orderBy('dailyAverage', 'desc')
 );
 
 if (community) {
   dailyAvQuery = query(collection(firestore, 'playerChallenges'),
     where('active', '==', true),
     where('challengeId', '==', challenge?.id || false),
     where('dailyAverage', '>', -1),
     orderBy('dailyAverage', 'desc')
   );
 
   if (challenge.targetType == 'qty') {
     dailyAvQuery = query(collection(firestore, 'playerChallenges'),
       where('active', '==', true),
       where('challengeId', '==', challenge?.id || false),
       where('dailyAverageQty', '>', -1),
       orderBy('dailyAverageQty', 'desc')
     );
   }
 } else {
   dailyAvQuery = query(collection(firestore, 'playerChallenges'),
     where('followers', 'array-contains', uid),
     where('active', '==', true),
     where('challengeId', '==', challenge?.id || false),
     where('dailyAverage', '>', -1),
     orderBy('dailyAverage', 'desc')
   );
 
   if (challenge.targetType == 'qty') {
     dailyAvQuery = query(collection(firestore, 'playerChallenges'),
       where('followers', 'array-contains', uid),
       where('active', '==', true),
       where('challengeId', '==', challenge?.id || false),
       where('dailyAverageQty', '>', -1),
       orderBy('dailyAverageQty', 'desc')
     );
   }
 }
 
 
   const unsubscribeToPlayers = onSnapshot(dailyAvQuery, (snaps) => {
     const challengesArray = [];
 
     snaps.forEach((snap) => {
       const challenge = snap.data();
       challengesArray.push(challenge);
     });
 
     setPlayers(challengesArray);
   });
 
   return () => {
     if (unsubscribeToPlayers) {
       unsubscribeToPlayers();
     }
   };
 }, [challenge?.id]);

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
      shareChallenge(challenge)
   }

// console.warn(players)
  return (
     <View flex backgroundColor={Colors.background}>
        <FlatList
           data={players || []}
           renderItem={renderItem}
           scrollEnabled={false}
           keyExtractor={(item, index) => item?.user.uid}
           contentContainerStyle={{}}
           ListFooterComponent={!community ? () => (
              <View style={{paddingBottom: 16}}>
                 <View
                    backgroundColor={'#fafafa'}
                    color="white"
                   
                    marginH-16
                    padding-24
                    center>
                     {players?.length == 1 && <Text B16 center>Your Friends that join this challenge will show in this leaderboard.</Text>}
                   <TouchableOpacity  onPress={shareChallengeCode} style={{marginTop: 8, paddingHorizontal: 16,paddingVertical: 8, backgroundColor: Colors.smashPink, borderRadius: 24}}><Text B14 white>Invite Friends</Text></TouchableOpacity>
                 </View>
              </View>
           ) : ()=>null}
           ListHeaderComponent={() => {
              return <ColDescription challenge={challenge} />;
           }}
        />
     </View>
  );
})
);
export default PlayersImFollowing;
