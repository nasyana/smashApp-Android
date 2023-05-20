import { width } from "config/scaleAccordingToDevice";
import React, { useState, useEffect } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Colors, Image, Assets, Text, Avatar, Button } from "react-native-ui-lib";
import ColDescription from "./ColDescription";
import Firebase from "../../config/Firebase"
import { inject, observer } from 'mobx-react';

import Player from "./Player";
import FollowingUser from "./FollowingUser";

import moment from "moment";
import FollowingList from "./FollowingList";

const PlayersImFollowing = inject("smashStore", "challengeArenaStore", "challengesStore")(observer((props) => {


    const [players, setPlayers] = useState([]);

    const [loaded, setLoaded] = useState(true)

    const { smashStore, goToProfile, challengeIsSingleActivity, challenge, showPlayerSmashesFunc, challengeData, showFollowingList, challengesStore } = props;

    const { kFormatter, currentUser, selectedDayKey } = smashStore;

    const { setInsightsPlayerChallengeDoc } = challengesStore;


    const renderItem = ({ item, index, }) => {


        const { like, invite, todayDateKey, selectedDayKey } = smashStore;
        if (!item) { return null }
        return (
            <Player item={item} index={index} {...{ selectedDayKey, todayDateKey, currentUser, like, invite, goToProfile, kFormatter, challengeIsSingleActivity }} />
        );
    }


    const { uid } = currentUser;

    useEffect(() => {


        const unsubscribeToPlayers = Firebase.firestore
            .collection('users')
            .where('followers', 'array-contains', uid)
            .onSnapshot((snaps) => {

                if (!snaps.empty) {

                    const challengesArray = []

                    snaps.forEach((snap) => {

                        const challenge = snap.data();

                        challengesArray.push(challenge)
                    })

                    setPlayers(challengesArray)

                }

            })



        return () => {

            if (unsubscribeToPlayers) { unsubscribeToPlayers(); }
            clearTimeout(timeout);

        }
    }, [])

    if (!loaded) { return null }
    return (
        <View flex backgroundColor={Colors.background} >

            <FlatList
                data={([...players, currentUser] || []).sort((a, b) => (b?.dailyScores?.[selectedDayKey] || 0) - (a?.dailyScores?.[selectedDayKey] || 0))}
                renderItem={renderItem}
                keyExtractor={(item, index) => item?.uid}
                contentContainerStyle={{}}
                ListFooterComponent={() => props.showMore ? <View><Button backgroundColor={'#fafafa'} color="white" onPress={showFollowingList} marginH-16 ><Text>Show More</Text></Button></View> : null}
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
export default PlayersImFollowing;
