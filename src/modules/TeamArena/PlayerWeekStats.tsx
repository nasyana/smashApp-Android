import { ScrollView } from 'react-native';
import React, { useEffect,useState } from 'react';
import LinearChartThisWeek from '../../components/LinearChartThisWeek';
import Box from '../../components/Box';
import { Colors, View, Text, TouchableOpacity } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import SmartImage from 'components/SmartImage/SmartImage';
import PlayerTeamRecords from './PlayerTeamRecords';
import AnimatedView from 'components/AnimatedView';
export enum EnumTypeChart {
   week = 0,
   month = 1,
   year = 2,
   all = 3,
}
const PlayerWeekStats = (props) => {
   const {
      player,
      smashStore,
      teamsStore,
      teamWeeksHash = false,
      color,
      playerWeekData,
      team,
      thisWeekDoc,
      isLegacy,
      weekTargets,
      weekDoc = false,
      index
   } = props;

   const { thisWeekKeys = [], weeksDayKeys } = teamsStore;

   const { numberWithCommas, currentUser,kFormatter } = smashStore;
const [full, setFull]   = useState(false);

const getEmojiByPlace= (index)=> {
   let emoji;
   switch (index) {
       case 0:
           emoji = '🥇';
           break;
       case 1:
           emoji = '🥈';
           break;
       case 2:
           emoji = '🥉';
           break;
       default:
           emoji = '';
   }

   return emoji;
}

const toggleFull = () => {

      setFull(!full);
}

console.log('playerWeekData',playerWeekData)
   return (
      <Box>
         <AnimatedView>
         <TouchableOpacity onPress={toggleFull} row centerV marginH-16 paddingV-16 spread>
            <View row centerV>
               <Text secondaryContent R12 marginR-4>{index + 1}</Text>
               <SmartImage
                  uri={player?.picture?.uri}
                  preview={player?.picture?.preview}
                  style={{
                     height: 35,
                     width: 35,
                     borderRadius: 60,
                     marginRight: 8,
                  }}
               />
               {/* <View height={1} backgroundColor={Colors.color6D} width={20} /> */}
               <Text B12 marginL-0>
               {getEmojiByPlace(index)} {player.name?.toUpperCase()} 
               </Text>
            </View>
            <View row centerV></View>
            {team?.id && <PlayerTeamRecords player={player} team={team || {id: weekDoc?.teamId}} short />}
            <View center padding-0 style={{backgroundColor: Colors.orange80, borderRadius: 16}}>
            <Text B14 marginH-4 style={{ color }}>
               {kFormatter(playerWeekData?.score || 0)}
            </Text>
            </View>
         </TouchableOpacity>
       
         {full && <LinearChartThisWeek
            type={EnumTypeChart.week}
            playerWeekData={playerWeekData}
            isLegacy={isLegacy}
            height={200}
            chartColor={color || Colors.buttonLink}
            smashStore={smashStore}
            thisWeekKeys={weekDoc ? weeksDayKeys(weekDoc.endWeekKey) : thisWeekKeys}
            player={player}
            teamsStore={teamsStore}
            weekDoc={weekDoc}
            teamWeeksHash={teamWeeksHash}
         />}
          {/* {full && <PlayerTeamRecords player={player} team={team} />} */}
          {full && <View style={{height: 30}} />}
         {full && weekTargets()}
         </AnimatedView>
      </Box>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(PlayerWeekStats));


