import { width } from "config/scaleAccordingToDevice";
import React, { useState, useEffect } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Colors, Image, Assets, Text, Avatar, Button } from "react-native-ui-lib";
import ColDescription from "./components/ColDescription";
import Firebase from "../../config/Firebase"
import { inject, observer } from 'mobx-react';
import SmartImage from "../../components/SmartImage/SmartImage"
import Player from "./components/Player";
import FollowingUser from "./components/FollowingUser";

import moment from "moment";
import FollowingList from "./components/FollowingList";

const PlayersImFollowing = inject("smashStore", "challengeArenaStore", "challengesStore")(observer((props) => {


  const [players, setPlayers] = useState([]);

  const [loaded, setLoaded] = useState(true)

  const { smashStore, goToProfile, challengeIsSingleActivity, challenge, showPlayerSmashesFunc, challengeData, showFollowingList, challengesStore } = props;

  const { kFormatter, currentUser } = smashStore;

  const { setInsightsPlayerChallengeDoc, getPlayerChallengeData } = challengesStore;



  const renderItem = ({ item, index, }) => {

    const playerChallengeData = getPlayerChallengeData(item)
    const { like, invite } = smashStore;
    if (!item) { return null }
    return (
      <Player playerChallengeData={playerChallengeData} item={item} index={index} {...{ currentUser, challenge, challengesStore, setInsightsPlayerChallengeDoc, challengeData, like, invite, goToProfile, kFormatter, challengeIsSingleActivity, showPlayerSmashesFunc }} />
    );
  }


  const { uid } = currentUser;

  useEffect(() => {


    // const timeout = setTimeout(() => {

    //   setLoaded(true)

    // }, 800);



    const unsubscribeToPlayers = Firebase.firestore
      .collection('playerChallenges')
      .where('followers', 'array-contains', uid)
      .where('active', '==', true)
      .where('endUnix', '>', moment().unix())
      .where('challengeId', '==', challenge.id)
      .limit(30)
      .onSnapshot((snaps) => {

        if (!snaps.empty) {

          const challengesArray = []

          snaps.forEach((snap) => {

            const challenge = snap.data();

            challengesArray.push(challenge)
          })

          setPlayers(challengesArray)

        }

      })



    return () => {

      if (unsubscribeToPlayers) { unsubscribeToPlayers(); }
      clearTimeout(timeout);

    }
  }, [])

  if (!loaded) { return null }
  return (
    <View flex backgroundColor={Colors.background} >



      <FlatList
        data={(players || []).sort((a, b) => b?.score - a?.score)}
        renderItem={renderItem}
        scrollEnabled={false}
        keyExtractor={(item, index) => item?.user.uid}
        contentContainerStyle={{}}
        ListFooterComponent={() => <View><Button backgroundColor={'#fafafa'} color="white" onPress={showFollowingList} marginH-16 ><Text>Invite Friends</Text></Button></View>}
        ListHeaderComponent={() => {
          return (

            <ColDescription challenge={challenge} />
          );
        }}
      />
    </View>
  );
})
);
export default PlayersImFollowing;
