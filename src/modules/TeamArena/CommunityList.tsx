import { width } from "config/scaleAccordingToDevice";
import React, { useMemo, useState, useEffect } from "react";
import { FlatList, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Colors, Image, Assets, Text, Avatar } from "react-native-ui-lib";
import Player from "./components/Player";
import ColDescription from "./components/ColDescription";
import { inject, observer } from 'mobx-react';
import Firebase from "../../config/Firebase"

const CommunityList = (props) => {


    const [loaded, setLoaded] = useState(true)
    const [players, setPlayers] = useState("");
    const { smashStore, goToProfile, challengeIsSingleActivity, challengeData, challengesStore } = props;
    const { setInsightsPlayerChallengeDoc, getPlayerChallengeData } = challengesStore;


    const renderItem = ({ item, index }) => {

        const { like, invite, kFormatter, toggleFollowUnfollow, currentUser } = smashStore;
        const playerChallengeData = getPlayerChallengeData(item)
        return (<Player playerChallengeData={playerChallengeData} item={item} community index={index} {...{ currentUser, challengeData, setInsightsPlayerChallengeDoc, like, invite, goToProfile, kFormatter, challengeIsSingleActivity, toggleFollowUnfollow }} />)

    }
    const visible = true
    const data = (players || [])?.sort((a, b) => b.score - a.score);


    useEffect(() => {




        const unsubscribeToPlayers = Firebase.firestore.collection('playerChallenges').where('active', '==', true).where('endDateKey', '==', challengeData.endDateKey).where('challengeId', '==', challengeData.id).orderBy("score", 'desc').limit(30).onSnapshot((snaps) => {

            if (!snaps.empty) {

                const playerChallengesArray = []

                snaps.forEach((snap) => {

                    const playerChallenge = snap.data();
                    playerChallengesArray.push(playerChallenge);

                })

                setPlayers(playerChallengesArray)

            }

        })


        return () => {
            if (unsubscribeToPlayers) { unsubscribeToPlayers(); }
        }
    }, [])

    return (
        <View flex backgroundColor={Colors.background} >
            <FlatList
                data={data}
                scrollEnabled={false}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.uid}_${item.challengeId}`}
                contentContainerStyle={{}}
                ListHeaderComponent={() => {
                    return (
                        <ColDescription challenge={challengeData} />
                    );
                }}
            />
        </View>
    );




};

export default inject("smashStore", "challengesStore", "challengeArenaStore")(observer(CommunityList));
