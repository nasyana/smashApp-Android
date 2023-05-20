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
import * as _ from 'lodash';
import Routes from 'config/Routes';
import Firebase from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;

const ActivityTeams = ({ activity, smashStore, challengesStore, small = false, teamsStore }) => {

    const { myChallengesHash, myChallenges, challengesArray } = challengesStore
    const { myTeams } = teamsStore;
    const { habitStacksList } = smashStore;

    const teamsInActivity = myTeams.filter((c) => c.masterIds.includes(activity.id))
    // const habitStacksIDs = habitStacksInActivity.map((c) => c.id);
    // const alsoIn = challengesArray.filter((c) => c.masterIds.includes(activity.id) && c.duration != 'weekly');

    // const challengesImNotIn = _.difference(challengesInActivity, alsoIn).map((c) => c)

    return (
        <View style={{ flexWrap: 'wrap', paddingHorizontal: 0, paddingTop: 0 }} row>

            {/* {challengesInActivity?.map((challenge) => <TouchableOpacity style={{ backgroundColor: challenge.colorStart, padding: 16 }} onPress={() => goToChallenge(challenge)}><Text white>{challenge.challengeName}</Text></TouchableOpacity>)} */}

            {teamsInActivity?.map((team) => {
                // const amIPlaying = myChallengesIds.includes(challenge.id)
                return <TouchableOpacity style={{ marginRight: 4, borderColor: '#aaa', borderWidth: 1, paddingVertical: small ? 4 : 8, paddingHorizontal: small ? 8 : 12, borderRadius: 16 }}>
                    <Text R12={small} R14={!small} >{team.name}</Text></TouchableOpacity>
            })}
            {teamsInActivity.length === 0 && <Text R14 secondaryContent>Not in any Teams</Text>}
        </View >
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ActivityTeams));