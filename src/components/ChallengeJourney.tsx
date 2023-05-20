import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    ActivityIndicator
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors,Assets } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';

import Routes from 'config/Routes';
import firebaseInstance from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;
import Box from './Box';
import BadgeSeparator from './BadgeSeparator';
import AnimatedView from './AnimatedView';
import ChallengeJourneyBadge from './ChallengeJourneyBadge';
import { getDurationImages } from 'helpers/generalHelpers';

const ChallengeJourney = ({ smashStore, playerChallenge, challengesStore, challenge, showLabel = false, small = false }) => {

    const { streaksHash } = challengesStore;
//    const [dImages, setDImages] = useState(false);
    const { uid } = firebaseInstance.auth.currentUser;
    const streakKey = `${uid}_${playerChallenge.challengeId}`;
    const [streakDoc, setStreakDoc] = React.useState(false)

    // console.log('durationImages',durationImages)

    // useEffect(() => {
    //  setTimeout(() => {
    //    setDImages(durationImages)
    //  }, 500);
    
    //   return () => {
        
    //   }
    // }, [])
    

    useEffect(() => {

        const streakDoc = streaksHash[streakKey] || false;

        setStreakDoc(streakDoc)

        return () => {

        }
    }, [streaksHash[streakKey]])


    const { challengesSimulatedArray = [],dImages } = smashStore;

    const offColor = 'rgba(255,255,255,0.2)'
    const offColorText = 'rgba(255,255,255,0.5)'


    const colorEnd = playerChallenge?.colorEnd || challenge?.colorEnd;

// if(!dImages?.[0]){

//     return <ActivityIndicator />
// }
    return (
        <View>
            <View style={{ backgroundColor: showLabel ? '#1C1C1C' : 'transparent' || colorEnd, padding: showLabel ? 24 : 0, margin: 0, marginHorizontal: 0, borderRadius: 0 }}>
                {showLabel && <Text white B12 marginB-8>CHALLENGE BADGES</Text>}
                <View
                    row
                    spread
                    marginT-4={!showLabel}
                >

                    {/* {!loaded && <View style={{ height: 60 }} />} */}
                    {challengesSimulatedArray.map((duration, index) => {

                        const number = index + 1;

                        if (number % 2 == 0) {

                            return (<BadgeSeparator key={index + 'N'} {...{ index }} />)

                            //The number is even
                        }
                        else {

                            const { refIndex } = duration;
                            const hasPassedThisDuration = streakDoc.highestStreak >= duration.duration;

                            const allowedToDo = hasPassedThisDuration;
                            const icon = Assets.icons[refIndex];
                            const color = dImages?.[refIndex]?.color || '#333';

                            return (
                                <ChallengeJourneyBadge key={index + 'N'}  {...{ small, showLabel, duration, allowedToDo, icon, color, offColorText, hasPassedThisDuration, offColor, index }} />
                            );


                        }
                    })}
                </View>
                {/* <Text white>{JSON.stringify(dImages)}</Text> */}
                {/* <Text center R14 marginT-16 white >Get a 7 Day Win Streak!</Text> */}
            </View>


        </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ChallengeJourney));