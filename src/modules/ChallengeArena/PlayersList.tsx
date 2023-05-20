import { width } from "config/scaleAccordingToDevice";
import React, { useState, useEffect } from "react";
import { FlatList, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Colors, Image, Assets, Text, Avatar } from "react-native-ui-lib";
import ColDescription from "./components/ColDescription";
import Firebase from "../../config/Firebase"
import { inject, observer } from 'mobx-react';
import SmartImage from "../../components/SmartImage/SmartImage"
import Player from "./components/Player"
const PlayersList = inject("smashStore")(observer((props) => {


  return (
    <View flex backgroundColor={Colors.background}>


      <FlatList
        data={props.players}
        renderItem={({ item, index }) => {

          return (
            <Player item={item} index={index} />
          );
        }}
        keyExtractor={(item, index) => item.challengeId}
        contentContainerStyle={{}}
        ListHeaderComponent={() => {
          return (

            <ColDescription />
          );
        }}
      />
    </View>
  );
})
);
export default PlayersList;
