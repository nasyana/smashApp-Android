import React from 'react'

import { moment } from 'helpers/generalHelpers';
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import { View, Image, Text, Colors, Assets, ProgressBar, TouchableOpacity, Button } from "react-native-ui-lib";
const Badge = (props) => {

    const { challenge, kFormatter, playerChallengeData, levelIndex } = props;

    const selectedTarget =
       playerChallengeData?.selectedTarget || challenge?.targets?.[1] || 0;
    const selectedLevel = parseInt(levelIndex + 1);
    const selectedGradient = playerChallengeData?.selectedGradient || [
       '#192840',
       '#2440dd',
    ];

    const size = 80;
    let badgeAsset = Assets.icons.badge1;
    if (selectedLevel == 2) {
       badgeAsset = Assets.icons.badge2;
    }
    if (selectedLevel == 3) {
       badgeAsset = Assets.icons.badge3;
    }
    return (
       <>
          <LinearGradient
             start={{ x: 0.6, y: 0.1 }}
             colors={['transparent', 'transparent'] || selectedGradient}
             style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                alignItems: 'center',
                justifyContent: 'center',
             }}>
             <Image
                source={badgeAsset}
                style={{
                   height: size - 3,
                   width: size - 3,
                   position: 'absolute',
                }}
             />
             {/* <Ionicons
                name={
                   challenge.fitness
                      ? 'fitness-outline'
                      : 'checkmark-done-circle-outline'
                }
                color="white"
                style={{ fontSize: 20, marginBottom: -2, marginTop: -5 }}
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
                {challenge.unit?.toUpperCase() || 'points'}
             </Text>
          </LinearGradient>
       </>
    );
}

export default Badge
