import SwipeableItem from "components/SwipeableItem/SwipeableItem";
import Tag from "components/Tag";
import { useNavigation } from "@react-navigation/native";
import ItemWorkOutPlan from "components/ItemWorkOutPlan";
import SegmentedRoundDisplay from "components/SegmentedRoundDisplay";
import { FONTS } from "config/FoundationConfig";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Routes from "config/Routes";
import moment from "moment";
import { Assets, Colors, View, Text, Image, ProgressBar, TouchableOpacity } from "react-native-ui-lib";
import Challenge from "./components/Challenge";
import Firebase from "../../config/Firebase";

const Challenge = (props) => {

  const { item, smashStore } = props;
  const { daysRemaining } = smashStore;
  const [playerChallengeDoc, setPlayerChallengeDoc] = useState(false);

  useEffect(() => {

    const uid = Firebase?.auth?.currentUser?.uid;
    const unsubscribeToPlayerChallengeDoc = Firebase.firestore.collection('playerChallenges').doc(`${uid}_${item.id}`).onSnapshot((snap) => {

      const playerChallengeDoc = snap.data();
      setPlayerChallengeDoc(playerChallengeDoc);

    })
    return () => {
      if (unsubscribeToPlayerChallengeDoc) { unsubscribeToPlayerChallengeDoc(); }
    }
  }, [])


  const { navigate } = useNavigation();
  const { title, activities, target } = item;

  const { qty } = playerChallengeDoc;
  const progress = qty / target * 100;
  return (
    <TouchableOpacity

      onPress={() => {


        navigate(Routes.ChallengeArena, { challenge: item });
      }}

      marginH-16
      marginB-16
      style={{
        borderRadius: 6,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
      }}

      backgroundColor={Colors.white}
    >
      <View
        row
        paddingH-16
        paddingV-12
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >

        <Text H14 color28 uppercase>
          {item.target} x {item.activityName} {item.challengeType}
        </Text>
        <Text H14 color={Colors.buttonLink} uppercase>
          {daysRemaining(moment(item.endUnix, "X"))} days left
        </Text>

      </View>
      <View height={1} backgroundColor={Colors.line} />
      <Challenge qty={qty} item={item} myChallenge progress={progress} />


    </TouchableOpacity>
  );
};

export default Challenge;

const styles = StyleSheet.create({});
