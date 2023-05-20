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
import firebaseInstance from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';
import { collection, doc, onSnapshot } from "firebase/firestore";
const firestore = firebaseInstance.firestore;
const TodayScore = ({smashStore, player, me = false, score = 0}) => {
    const {  kFormatter } =
    smashStore;

    // if(me){alert("You are not logged in")}
    const { navigate } = useNavigation();
    // const todayPlayer = me ? todayActivity : friendsTodayDocsHash[player.uid] || {};
    // const [todayPlayer, setTodayPlayer] = useState(me ? todayActivity : friendsTodayDocsHash[player.uid]);


 
// useEffect(() => {

//   console.log('todayScore render',player.name)
//     const unsub = onSnapshot(
//         doc(collection(firestore, "dailyActivity"), `${player.uid}_${todayDateKey}`, ),
//       (snap) => {

//           // if(snap?.data()?.score){

//             setTodayPlayer(snap.data() || {});
//           // }
      
//       }
//     );
  
//     return () => {
//       if (unsub) {
//         unsub();
//       }
//     };
//   }, [player?.uid, todayDateKey]);


    const todayValue = score || 0;
    return (
        <Text M14 style={{ color: Colors.buttonLink }}>
        {todayValue > 0 && kFormatter(todayValue)}
     </Text>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(TodayScore));