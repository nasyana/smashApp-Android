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
import Firebase from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;
import Box from 'components/Box';

const TeamWeekTargetWinners = ({team, player, short = false}) => {

  

//<Box><View><Text R14 center>Day Champ {dayWinnersCount}</Text></View></Box>
    return (
        <View center>
        <View row  paddingH-16>
         {champCount > 0 && <View row marginR-8 centerV><Text R14 center>🏆{short ? '' :  ' Week Champ'}</Text><View marginL-0={!short} style={{width: 20, height: 20, borderRadius: 32}} center ><Text R14 center secondaryContent={champCount == 0} >{champCount}</Text></View>
         </View>}
         {winningShotCount > 0 && <View row marginR-8 centerV><Text R14 center>🏀{short ? '' : ' Winning Shot'}</Text><View marginL-0={!short} style={{width: 20, height: 20, borderRadius: 32}} center ><Text R14 center secondaryContent={winningShotCount == 0} >{winningShotCount}</Text></View>
         </View>}
         {dayWinnersCount > 0 && <View row marginR-8 centerV><Text R14 center>⭐{short ? '' : ' Day Champ'}</Text><View marginL-0={!short} style={{width: 20, height: 20, borderRadius: 32}} center ><Text R14 center secondaryContent={dayWinnersCount == 0} >{dayWinnersCount}</Text></View>
         </View>}
      
        </View>
        <View row spread>
         {/* <View><Text R14 center>Day Champ {dayWinnersCount}</Text></View><View><Text R14 center>Day MVP</Text></View><View><Text R14 center>Day Shot</Text></View> */}
        </View>
        </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(TeamWeekTargetWinners));