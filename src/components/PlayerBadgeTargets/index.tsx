import React from 'react'

import { moment } from 'helpers/generalHelpers';
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import { View, Image, Text, Colors, Assets, ProgressBar, TouchableOpacity, Button } from "react-native-ui-lib";
import { inject, observer } from 'mobx-react';
import {
   getPlayerChallengeData,
   getDaysLeft,
} from 'helpers/playersDataHelpers';
const PlayerBadgeTargets = (props) => {

    const { playerChallenge, kFormatter } = props;


    const playerChallengeData = getPlayerChallengeData(playerChallenge, false, false, 'target') || false;

    const selectedTarget = playerChallengeData?.selectedTarget || 0
    const selectedScore = playerChallengeData?.selectedScore || 0;
    const gradient = playerChallengeData?.gradient || ['red', '#333'];

    const greyGradient = playerChallengeData?.greyGradient || ['#ccc', '#333']



    // const { selectedGradient = fitnessGradient } = playerChallengeData;
    const win = selectedScore > selectedTarget;

    const size = props.large ? 180 : 90;

    return (
       <LinearGradient
          start={{ x: 0.6, y: 0.1 }}
          colors={['transparent', 'transparent'] || gradient}
          style={{
             width: size,
             height: size,
             borderRadius: size / 2,
             alignItems: 'center',
             justifyContent: 'center',
          }}>
          <Image
             source={Assets.icons.badge1}
             style={{ height: size - 5, width: size - 5, position: 'absolute' }}
          />
          {/* <Ionicons
             name={
                playerChallenge?.fitness
                   ? 'fitness-outline'
                   : 'checkmark-done-circle-outline'
             }
             color="white"
             style={{ fontSize: size / 4, marginBottom: -2, marginTop: -5 }}
          /> */}
          <Text
             B18
             style={{
                fontSize: 24,
                letterSpacing: -1,
                color: Colors.buttonLink,
                marginBottom: 10,
             }}>
             {kFormatter(selectedTarget)}
          </Text>
          <Text white style={{ fontSize: 10, marginTop: -20 }}>
             {playerChallenge?.unit?.length > 0
                ? playerChallenge?.unit?.toUpperCase()
                : 'points'}
          </Text>
       </LinearGradient>
    );
}

export default inject("smashStore", "challengesStore", "challengeArenaStore")(observer(PlayerBadgeTargets))
