import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,
    
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors,TouchableOpacity } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';
import * as _ from 'lodash';
import Routes from 'config/Routes';
import firebaseInstance from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';
import { collection, query, where, getDocs } from 'firebase/firestore';

const firestore = firebaseInstance.firestore; 
const ActivityTeamsTakeVid = ({ uid = false, small = false, teamsStore, smashStore }) => {



    const [userTeams, setUserTeams] = useState([]);

    useEffect(() => {

        if (uid) { fetchMyTeams(); }
        return () => { }

    }, [])


    const fetchMyTeams = async () => {
        const teams = [];
        const q = query(collection(firestore, 'teams'), where('active', '==', true), where('joined', 'array-contains', uid));
        const snaps = await getDocs(q);
        if (!snaps.empty) {
          const teams = [];
          snaps.forEach((doc) => {
            if (!doc.exists()) return;
            const team = doc.data();
            teams.push(team);
          });
          setUserTeams(teams);
        }
      };
    const activity = smashStore.activtyWeAreSmashing || false;
    const { myTeams } = teamsStore;
    const theUid = uid || firebaseInstance.auth.currentUser?.uid;
    const teamsInActivity = uid ? userTeams.filter((c) => c.masterIds.includes(activity.id)) : myTeams.filter((c) => c.masterIds.includes(activity.id));
    if (teamsInActivity.length === 0) { return null }

    return (<View paddingH-24 style={{ position: 'absolute', top: 84 }}>
        <View>
            <Text R12 white marginB-4>Teams: </Text>
            <View marginB-8 style={{ flexWrap: 'wrap', paddingHorizontal: 0, paddingTop: 0, alignItems: 'center' }} row center>

            {/* {challengesInActivity?.map((challenge) => <TouchableOpacity style={{ backgroundColor: challenge.colorStart, padding: 16 }} onPress={() => goToChallenge(challenge)}><Text white>{challenge.challengeName}</Text></TouchableOpacity>)} */}

            {teamsInActivity?.map((team) => {

                if (team?.hideMasterIds?.includes(activity.id)) { return null }
                // const amIPlaying = myChallengesIds.includes(challenge.id)
                return <TouchableOpacity marginB-4 key={team.id}  style={{ marginRight: 4, borderColor: Colors.white, borderWidth: 1, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 16 }}>
                    <Text R12={small} white >{team.name}</Text></TouchableOpacity>
            })}
                {teamsInActivity.length === 0 && <Text R14 white>Not in any Teams</Text>}
        </View >
        </View>
        </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ActivityTeamsTakeVid));