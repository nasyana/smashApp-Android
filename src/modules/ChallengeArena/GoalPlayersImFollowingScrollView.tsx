import { width } from "config/scaleAccordingToDevice";
import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Colors, Image, Assets, Text, Avatar, Button,TouchableOpacity } from "react-native-ui-lib";
import GoalColDescription from "./components/GoalColDescription";
import firebaseInstance from "../../config/Firebase";
const firestore = firebaseInstance.firestore;
import { inject, observer } from 'mobx-react';
import SmartImage from "../../components/SmartImage/SmartImage"
import GoalPlayer from "./components/GoalPlayer";
import { collection, where, orderBy, onSnapshot, query } from "firebase/firestore";

const GoalPlayersLeaderboard = inject("smashStore", "challengeArenaStore", "challengesStore")(observer((props) => {


  const [players, setPlayers] = useState([]);

  const [loaded, setLoaded] = useState(true)

  const {
     smashStore,
     challengeIsSingleActivity,
     showPlayerSmashesFunc,
     challengeData,
     challengesStore,
     goal,
     community,
     dark
  } = props;

  const { kFormatter, currentUser,shareChallenge } = smashStore;

  const {
     setInsightsPlayerChallengeDoc,
     getPlayerChallengeData,
     shareGoal,
      currentChallenge = {} } =
      challengesStore;




  const renderItem = ({ item, index }) => {
     const playerChallengeData = getPlayerChallengeData(item);
     const { like, invite } = smashStore;

    
     if (!item) {
        return null;
     }
     return (
        <GoalPlayer
         //   playerChallengeData={playerChallengeData}
           item={item}
           index={index}
           {...{
              currentUser,
              goal,
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
   let dailyAvQuery = query(collection(firestore, 'playerGoals'),
   // where('followers', 'array-contains', uid),
   where('active', '==', true),
   where('goalId', '==', goal?.id || false),
   orderBy('score', 'desc')
   // where('dailyAverage', '>', -1),
   // orderBy('dailyAverage', 'desc')
 );
 
 if (community) {
   dailyAvQuery = query(collection(firestore, 'playerGoals'),
     where('active', '==', true),
     where('goalId', '==', goal?.id || false),
     orderBy('score', 'desc')
   //   where('dailyAverage', '>', -1),
   //   orderBy('dailyAverage', 'desc')
   );
 
   if (goal.targetType == 'qty') {
     dailyAvQuery = query(collection(firestore, 'playerGoals'),
       where('active', '==', true),
       where('goalId', '==', goal?.id || false),
       orderBy('score', 'desc')
      //  where('dailyAverageQty', '>', -1),
      //  orderBy('dailyAverageQty', 'desc')
     );
   }
 } else {
   dailyAvQuery = query(collection(firestore, 'playerGoals'),
   //   where('followers', 'array-contains', uid),
     where('active', '==', true),
     where('goalId', '==', goal?.id || false),
     orderBy('score', 'desc')
   //   where('dailyAverage', '>', -1),
   //   orderBy('dailyAverage', 'desc')
   );
 
   if (goal.targetType == 'qty') {
     dailyAvQuery = query(collection(firestore, 'playerGoals'),
     
      //  where('followers', 'array-contains', uid),
       where('active', '==', true),
       where('goalId', '==', goal?.id || false),
       orderBy('qty', 'desc')
      //  where('dailyAverageQty', '>', -1),
      //  orderBy('dailyAverageQty', 'desc')
     );
   }
 }
 
 
   const unsubscribeToPlayers = onSnapshot(dailyAvQuery, (snaps) => {
     const challengesArray = [];
 
     snaps.forEach((snap) => {
       const goal = snap.data();
       challengesArray.push(goal);
     });
//  console.log('challengesArray',challengesArray)
     setPlayers(challengesArray);
   });
 
   return () => {
     if (unsubscribeToPlayers) {
       unsubscribeToPlayers();
     }
   };
 }, [goal?.id]);

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
      shareChallenge(goal)
   }

// console.warn(players)
  return (
     <View flex backgroundColor={dark ? Colors.darkBg : Colors.background}>
        <FlatList
           data={players || []}
           renderItem={renderItem}
           scrollEnabled={false}
           keyExtractor={(item, index) => item?.user.uid}
           contentContainerStyle={{}}
           ListFooterComponent={!community ? () => (
              <View style={{paddingBottom: 16, backgroundColor: dark ? Colors.darkBg : '#fff'}}>
                 <View
                  //   backgroundColor={'#fafafa'}
                    color="white"
                   
                    marginH-16
                    padding-24
                    center>
                     {players?.length == 1 && <Text R14 white center>Your Friends that join this goal will show in this leaderboard.</Text>}
                   <TouchableOpacity  onPress={()=>shareGoal(goal)} style={{marginTop: 8, paddingHorizontal: 16,paddingVertical: 8, backgroundColor: Colors.smashPink, borderRadius: 24}}><Text B14 white>Invite Friends</Text></TouchableOpacity>
                 </View>
              </View>
           ) : ()=>null}
           ListHeaderComponent={() => {
              return <GoalColDescription dark challenge={goal} />;
           }}
        />
     </View>
  );
})
);
export default GoalPlayersLeaderboard;
