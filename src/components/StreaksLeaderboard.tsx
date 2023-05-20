import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList,
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
import RenderStreakUser from './RenderStreakUser';




const ChallengeStreakList = () => {


    // Query the challengeStreaks collection for documents with onGoingStreak > 0

    const useMonthKey = moment().format('MMYYYY');

    const challengeStreaksRef = Firebase.firestore
        .collection('celebrations')
        // .where('uid', '==', uid)
        .where('type', '==', 'challengeStreak')
        .where('monthKey', '==', useMonthKey)
        .orderBy('streak', 'desc');
    // const challengeStreaksRef = Firebase.firestore.collection('challengeStreaks').where('onGoingStreak', '>', 0).orderBy('onGoingStreak', 'desc');
    const [challengeStreaks, setChallengeStreaks] = useState([]);

    useEffect(() => {
        const unsubscribe = challengeStreaksRef.onSnapshot((snapshot) => {

            const updatedChallengeStreaks = snapshot.docs.map((doc) => doc.data());
            setChallengeStreaks(updatedChallengeStreaks);
        });

        return () => unsubscribe();
    }, [challengeStreaksRef]);

    // Render the FlatList
    return (
        <FlatList
            data={challengeStreaks}
            renderItem={({ item, index }) => <RenderStreakUser streak={item} />}
            keyExtractor={(item) => item.id}
        />
    );
};

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ChallengeStreakList));