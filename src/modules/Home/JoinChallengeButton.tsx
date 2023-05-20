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
import Box from 'components/Box';

const JoinChallengeButton = ({ smashStore, boxed = false, hideOnHome = false, challengesStore }) => {
    const navigation = useNavigation();
    const { settings = {} } = smashStore

    const { buttonText = {} } = settings;
    const { joinChallenge = {} } = buttonText
    const { moreChallengesDescription } = joinChallenge;
    const { navigate } = navigation;
    const goToJoinChallenge = () => {
        navigate(Routes.JoinChallenges);
    };

    const { numChallenges } = challengesStore
    const { noTeamsOrChallenges } = smashStore;

    const recommendToJoin = 3;

    const remaining = recommendToJoin - numChallenges;

    const challengeWord = remaining == 1 ? 'challenge' : 'challenges';
    // if (numChallenges > 3) { return null }

    if (boxed) {



        return (<Box style={{ marginHorizontal: 24, marginTop: 16 }}>
            <View padding-24 >
                <View paddingB-16 paddingH-16>
                    <Text M18 center marginB-8>{numChallenges > 0 ? "Join More Habit Challenges" : "Join A Habit Challenge"}</Text>
                    {numChallenges == 0 && <Text R14 center>{`We recommend to join ${recommendToJoin} challenges.`}</Text>}
                    {numChallenges > 0 && numChallenges < recommendToJoin && <Text R14 center>We recommend to join at least {remaining} more {challengeWord}.</Text>}
                    {numChallenges >= recommendToJoin && <Text R14 center>{moreChallengesDescription || 'Join as many challenges as you want!'}</Text>}
                </View>
                <ButtonLinear
                    title="Join A Habit Challenge"
                    onPress={
                        goToJoinChallenge
                        // () => smashStore.setFindChallenge(true)
                    }
                    style={{ marginTop: 0, marginHorizontal: 0 }}
                />
            </View>
        </Box>)
    }
    return (
        <ButtonLinear
            title="Join A Habit Challenge"
            onPress={
                goToJoinChallenge
                // () => smashStore.setFindChallenge(true)
            }
            style={{ marginTop: 0 }}
        />
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(JoinChallengeButton));