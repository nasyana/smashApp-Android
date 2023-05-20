import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';

import Routes from 'config/Routes';
import Firebase from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;

const Icons = ({smashStore, player}) => {
    const { friendsTodayDocsHash,checkInfinity } = smashStore;
    const todayPlayer = friendsTodayDocsHash[player.uid] || {}
    const playerTodayScore = todayPlayer?.score || 0;
    const playerTodayTarget = 0;
    const progress = checkInfinity((playerTodayScore / playerTodayTarget) * 100);

    console.log('render icons',todayPlayer.updatedAt)
    if(progress >= 100){



    return (
        <View
        style={{
           position: 'absolute',
           top: -4,
           right: -8,
           backgroundColor: 'transparent' || Colors.white,
           height: 37,
           width: 37,
           alignItems: 'center',
           justifyContent: 'center',
           borderRadius: 37,
        }}>
        <AnimatedView>
           <Text R18>✅</Text>
        </AnimatedView>
     </View>
    )
}
else{

    return null
}
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(Icons));