
import React, { useEffect, useState } from 'react'
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import {
    View,
    Colors,
    Image,
    Assets,
    Text,
    Avatar,
    TouchableOpacity,
} from 'react-native-ui-lib';
import { FontAwesome5 } from '@expo/vector-icons';
import { collection, doc, onSnapshot } from "firebase/firestore";

const CurrentPlayerStreak = ({ playerChallenge }) => {

    const playerId = playerChallenge.uid;
    const challengeId = playerChallenge.challengeId;

    const [streak, setStreak] = useState(false);

    useEffect(() => {
        const streaksDocRef = doc(collection(firestore, "challengeStreaks"), `${playerId}_${challengeId}`);
    
        const unsub = onSnapshot(streaksDocRef, (docSnap) => {
            const streaksDoc = docSnap.data();
    
            if (streaksDoc?.onGoingStreak && streaksDoc?.onGoingStreak != streak.onGoingStreak) {
                setStreak(streaksDoc);
            }
        });
    
        return () => {
            if (unsub) {
                unsub();
            }
        };
    }, []);

    if (streak.highestStreak == 0) { return null }
    return (
        <View
        // row
        // style={{
        //     position: 'absolute',
        //     top: 12,
        //     left: 8,
        //     backgroundColor: playerChallenge.colorEnd,
        //     height: 30, //
        //     width: 30, //
        //     borderRadius: 60,
        //     alignItems: 'center',
        //     justifyContent: 'center',
        // }}
        >
            {/* <FontAwesome5 name="fire" size={12} color="white" /> */}
            <Text R12 secondaryContent >
                PB: {streak.highestStreak ? streak.highestStreak == 1 ? streak.highestStreak + ' day' : streak.highestStreak + ' days' : 'N/A'}
            </Text>

        </View>
    )
}

export default CurrentPlayerStreak