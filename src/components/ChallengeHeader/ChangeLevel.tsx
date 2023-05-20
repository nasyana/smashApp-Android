import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,

    Alert,
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';
import { getTodayData } from 'helpers/playersDataHelpers';
import { collection, doc, setDoc } from 'firebase/firestore';
import firebaseInstance from '../../config/Firebase';
const firestore = firebaseInstance.firestore;

const ChangeLevel = ({ badgeLevels, smashStore, challengesStore, challengeId, colorEnd, setfilterSegmentIndex, playerChallengeDoc }) => {



    const { streaksHash } = challengesStore;

    const oops = (index) => {


        const numberToReach = index == 1 ? 30 : 40;

        Alert.alert('Level Locked!', `You need to win the previous level to unlock this level.`);
    }


    const { navigate } = useNavigation();

    const showConfirmationAlert = () =>
        new Promise((resolve) => {
            Alert.alert(
                "Confirm Level Change",
                "If you increase your level, you won't be able to change back to a lower level after scoring points today. You'll have to wait until tomorrow. Are you sure you want to proceed?",
                [
                    {
                        text: "Cancel",
                        onPress: () => resolve(false),
                        style: "cancel",
                    },
                    {
                        text: "Yes, Proceed",
                        onPress: () => resolve(true),
                    },
                ],
                { cancelable: false }
            );
        });


    const playerChallenge = playerChallengeDoc;

    const { selectedLevel } = playerChallenge || 1;


    const { uid } = firebaseInstance.auth.currentUser;
    const streakKey = `${uid}_${playerChallenge.challengeId}`;
    const [streakDoc, setStreakDoc] = React.useState(false)

    useEffect(() => {

        const streakDoc = streaksHash[streakKey] || false;

        setStreakDoc(streakDoc)

        return () => {

        }
    }, [streaksHash[streakKey]])



    const setPlayerChallengeLevel = async (level) => {


        if (level == playerChallenge?.selectedLevel) { return }
        // if(!smashStore.currentUser?.challengesSmashed?.[challengeId]?.[21]) {

        //    oops();

        //    return

        // }
        const todayChallengeData = getTodayData(playerChallenge);
        const { todayScore } = todayChallengeData;

        smashStore.setUniversalLoading("true");
        const playerChallengeDocRef = doc(
            collection(firestore, "playerChallenges"),
            playerChallengeDoc?.id
        );

        if (
            level > playerChallenge?.selectedLevel ||
            !playerChallenge?.selectedLevel ||
            todayScore == 0
        ) {
            if (level > playerChallenge?.selectedLevel && todayScore == 0) {
                const confirmed = await showConfirmationAlert();
                if (!confirmed) {
                    smashStore.setUniversalLoading(false);
                    return;
                }
            }

            setDoc(
                playerChallengeDocRef,
                { selectedLevel: level, updatedAt: parseInt(Date.now() / 1000) },
                { merge: true }
            );

            setTimeout(() => {
                smashStore.setUniversalLoading(false);
            }, 500);
        } else {
            Alert.alert(
                "Oops!",
                "You can't change to a lower level if you already have points today. Try again tomorrow."
            );

            setTimeout(() => {
                smashStore.setUniversalLoading(false);
            }, 500);

            return;
        }

        challengesStore.replacePlayerChallengeInMyChallengesById({
            ...playerChallenge,
            selectedLevel: level,
            updatedAt: parseInt(Date.now() / 1000),
        });
    };

    const onChangeLevel = (index) => {
        setfilterSegmentIndex(index);
        setPlayerChallengeLevel(index + 1);
    };

    return (
        <View row spread style={{ backgroundColor: '#fff' }}>
            {/* <Text>{streakDoc.highestStreak}</Text> */}
            {badgeLevels?.map((level, index) => {
                const isSelected = index + 1 === selectedLevel;
                const isLocked = index == 1 && parseInt(streakDoc.highestStreak || 0) < 30 || index == 2 && parseInt(streakDoc.highestStreak || 0) < 40 //index > 0;
                // console.log('smashStore.currentUser?.challengesSmashed?.[challengeId]', smashStore.currentUser?.challengesSmashed?.[challengeId])
                return <TouchableOpacity row key={level} 
                onPress={() => isLocked ? oops(index) : onChangeLevel(index)} 
                flex center centerV paddingB-16 paddingT-16 style={{ borderRightWidth: index == 0 || index == 1 ? 1 : 0, borderBottomWidth: isSelected ? 3 : 1, borderColor: isSelected ? colorEnd : '#ccc', borderRightColor: '#ccc' }}>
                    <Text R14 style={{ color: isSelected ? colorEnd : '#333' }}>{level}</Text>
                    {isLocked && <AntDesign name="lock" color={'#aaa'} size={15} />}
                    </TouchableOpacity>
            })}
        </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ChangeLevel));