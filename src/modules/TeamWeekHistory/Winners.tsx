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

if(!weeklyDoc?.weeklyWinners){return null}
  return (
    <View>
<SectionHeader title="Target Champs" style={{paddingBottom: 8, marginBottom: 8, marginTop: 16}}/>
<Box>
<ScrollView  showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 24, paddingBottom: 16, paddingTop: 16}}>
          {weeklyDoc?.weeklyWinners && weeklyDoc?.weeklyWinners.map((win) =>{
       
            const mvpUser = win?.winner && team?.playerData?.[win?.winner] || 'false';
            return (<View  row paddingV-0 spread centerV marginB-4>

<View row centerV>
<Text secondaryContent R12 centerV>{unixToDay(win.timestamp)}</Text>
<View style={{width: 1, backgroundColor: '#ccc', height: 30}} marginH-16/>
<Text B18 center smashPink>🏆 {kFormatter(win.target)}</Text><Text marginL-8 R14>Target Champ</Text></View>
     
        
    
           {/* <View row marginR-8 centerV><Text R14 center>🏀 Winning Shot</Text>
           </View> */}


<View>
<SmartImage
            uri={mvpUser?.picture?.uri}
            preview={mvpUser?.picture?.preview}
            style={{
               height: 30,
               width: 30,
               borderRadius: 60,
               backgroundColor: '#fafafa',
               marginRight: 0,
            }}
         />
         </View>

          </View>)})
          }
          </ScrollView>
          </Box>

          </View>
  )
}

export default inject('smashStore', 'teamsStore')(observer(Winners));
