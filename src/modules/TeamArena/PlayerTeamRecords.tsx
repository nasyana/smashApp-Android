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
import { getDoc,doc } from "firebase/firestore";
import Routes from 'config/Routes';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;
import Box from 'components/Box';

const PlayerTeamRecords = ({team, player, short = false}) => {

    // if(!team.id){alert('no team Id'); return null}
    const [mvpDocument, setMvpDocument] = useState({});
    
    // useEffect to load mpv doc using team.id and firebase
    useEffect(() => {

        if(!team.id){alert('no team Id'); return }

        getDoc(doc(firestore, "mvps", team.id)).then((doc) => {
            if (doc.exists()) {
              const mvpDoc = doc.data();
              setMvpDocument(mvpDoc);
            } else {
              console.log("No such document!");
            }
          });


    },
    
    
    []);



    const {alltimeWeekWinners, winningShot, alltimeDayWinners } = mvpDocument;
const champCount = alltimeWeekWinners?.[player.uid] || 0;
const winningShotCount = winningShot?.[player.uid] || 0;
const dayWinnersCount = alltimeDayWinners?.[player.uid] || 0;

//<Box><View><Text R14 center>Day Champ {dayWinnersCount}</Text></View></Box>
    return (
        <View center>
        <View row  paddingH-0>
         {champCount > 0 && <View row marginR-8 centerV><Text centerV  R14 center >🏆{short ? '' :  ' Week Champ'}</Text><View marginL-0={!short} style={{ height: 20, borderRadius: 32}} centerV ><Text marginL-2 R14 secondaryContent={champCount == 0} >{champCount}</Text></View>
         </View>}
         {winningShotCount > 0 && <View row marginR-8 centerV><Text centerV R14 center>🏀{short ? '' : ' Winning Shot'}</Text><View marginL-0={!short} style={{ height: 20, borderRadius: 32}} centerV ><Text R14 marginL-2 secondaryContent={winningShotCount == 0} >{winningShotCount}</Text></View>
         </View>}
         {dayWinnersCount > 0 && <View row marginR-8 centerV><Text centerV R14 center>⭐{short ? '' : ' Day Champ'}</Text><View marginL-0={!short} style={{ height: 20, borderRadius: 32}} centerV ><Text R14 marginL-2 secondaryContent={dayWinnersCount == 0} >{dayWinnersCount}</Text></View>
         </View>}
      
        </View>
        <View row spread>
         {/* <View><Text R14 center>Day Champ {dayWinnersCount}</Text></View><View><Text R14 center>Day MVP</Text></View><View><Text R14 center>Day Shot</Text></View> */}
        </View>
        </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(PlayerTeamRecords));