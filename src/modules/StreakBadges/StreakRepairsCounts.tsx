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
import SectionHeader from 'components/SectionHeader';

const StreakRepairsCounts = ({currentUser, challengesStore}) => {

    const {challengesHash} = challengesStore;
    

    const {streakRepairs = {}} = currentUser;

    // hide if no streak repairs
    if(Object.keys(streakRepairs).length == 0){return null}
  return (
    <View >
        <SectionHeader title="Challenge Streak Repairs" />
        <View paddingH-24 paddingB-24>

     {Object.keys(streakRepairs)?.map((key)=> {

        const challengeRepairCount = streakRepairs[key];
        const challenge = challengesHash[key];

        if(challengeRepairCount == 0){return null}
        return <Text>{challenge?.name} ({challengeRepairCount})</Text>
     })} 
     </View>
    </View>
  )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(StreakRepairsCounts));