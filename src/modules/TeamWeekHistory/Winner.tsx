import Header from 'components/Header';
import { FONTS } from 'config/FoundationConfig';
import { shadow, width } from 'config/scaleAccordingToDevice';
import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { View, Assets, Colors, Text } from 'react-native-ui-lib';
import { convertEndDateKeyToFriendly } from 'helpers/playersDataHelpers';
import { useRoute } from '@react-navigation/core';
import Firebase from 'config/Firebase';
import Box from 'components/Box';
import TeamPieChart from 'components/TeamPieChart';
import { FlatList, ScrollView } from 'react-native';
import PlayerWeekStats from 'modules/TeamArena/PlayerWeekStats';
import { playerColors } from 'helpers/teamDataHelpers';
import WeeklyTeamPlayerDayTargets from 'components/WeeklyTeamPlayerDayTargets';
import WeekTeamTarget from 'modules/Home/components/WeekTeamTarget';
import SectionHeader from 'components/SectionHeader';
import { kFormatter,numberWithCommas } from 'helpers/generalHelpers';
import SmartImage from 'components/SmartImage/SmartImage';
import {unixToDay} from 'helpers/dateHelpers';
const Winners = (props) => {

    const { weeklyDoc, teamsStore, team } = props;
    const { currentTeamPlayersHash } = teamsStore;
 
    const isLegacy = weeklyDoc?.userData;
    const players = weeklyDoc?.userData
       ? weeklyDoc?.userData
       : weeklyDoc?.players || false;
 
 
    let winnerUserId = '';
    let winnerHighScore = 0;
 
    Object.keys(players).forEach((userId) => {
       const user = players[userId] || {};
       if (user?.score > winnerHighScore) {
          winnerUserId = userId;
          winnerHighScore = user?.score;
       }
       // const winnerUserId =
    });
    const playerDoc = currentTeamPlayersHash[winnerUserId]


  return (
    <View center>
    <View center  paddingV-B>
    <View  marginR-8 centerV><Text R14 center>⭐ MVP</Text>
           </View>
           <SmartImage
            uri={playerDoc?.picture?.uri}
            preview={playerDoc?.picture?.preview}
            style={{
               height: 30,
               width: 30,
               borderRadius: 60,
               backgroundColor: '#ccc'
            }}
         />
         
          </View>


          </View>
  )
}

export default inject('smashStore', 'teamsStore')(observer(Winners));
