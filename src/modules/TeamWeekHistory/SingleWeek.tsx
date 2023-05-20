import Header from 'components/Header';
import { FONTS } from 'config/FoundationConfig';
import { shadow, width } from 'config/scaleAccordingToDevice';
import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { View, Assets, Colors, Text } from 'react-native-ui-lib';
import { convertEndDateKeyToFriendly } from 'helpers/playersDataHelpers';
import { useRoute } from '@react-navigation/core';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
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
import Winners from './Winners';
import Winner from './Winner';
import {stringLimit} from 'helpers/generalHelpers';
import LottieAnimation from 'components/LottieAnimation';
import { onSnapshot, doc } from "firebase/firestore";
import { collection } from "firebase/firestore";
const SingleWeek = (props) => {
   const { params } = useRoute();
   const { weekDoc = false, team = false } = params;

   const { teamsStore, smashStore } = props;

   const {

      // teamUsersByTeamId,
      endOfCurrentWeekKey,
      weeklyActivityHash,
      teamUsersByTeamId,
   } = teamsStore;


   const { currentTeam } = teamsStore;
   const [week, setWeek] = useState(weekDoc);
   console.log('week11',week)
   // useEffect(() => {
   //    const queryTwo = doc(collection(firestore, "weeklyActivity"), `${team.id}_${endOfCurrentWeekKey}`);
   //    const unsubLegacyTeamWeeks = onSnapshot(queryTwo, (snap) => {
   //      const weekDoc = snap.data();

   //      console.log('weekDoc',weekDoc)
   //      setWeek(weekDoc);
   //    });
   //    return () => {
   //      if (unsubLegacyTeamWeeks) {
   //        unsubLegacyTeamWeeks();
   //      }
   //    };
   //  }, [team.id]);
   const renderItem = ({ item, index }) => {
      const player = item;
      return (
         <PlayerWeekStats
            player={player}
            key={player.id}
            initialNumToRender={1}
            thisWeekDoc={week || weekDoc || thisWeekDoc || false}
            playerWeekData={week?.players?.[player.uid] || false}
            color={playerColors[index]}
            index={index}
            team={team}
            // teamWeeksHash={teamWeeksHash}

            weekDoc={week}
            teamsStore={teamsStore}
            weekTargets={() => (
               <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
                  {/* <WeeklyTeamPlayerDayTargets
                     item={weekDoc || thisWeekDoc}
                     player={player}
                  /> */}
               </View>
            )}
         />
      );
   };
   const teamUsers = team.joined?.map((playerId)=>{return {uid: playerId, picture: team?.playerData?.[playerId]?.picture, name: team?.playerData?.[playerId]?.name}})

   const thisWeekDoc = weekDoc;
   const playersArray = teamUsers || [];



   let playersArrayTwo = [...playersArray].sort(
      (playerb, playera) =>
         (thisWeekDoc?.userWeekScores?.[playera.id] ||
            thisWeekDoc?.players?.[playera.id]?.score ||
            0) -
         (thisWeekDoc?.userWeekScores?.[playerb.id] ||
            thisWeekDoc?.players?.[playerb.id]?.score ||
            0),
   );

const percent = parseInt(parseInt(weekDoc.score) / parseInt(weekDoc.target) * 100) || 0;
   return (
      <View flex>
         <Header
            title={`(${convertEndDateKeyToFriendly(
               weekDoc?.endWeekKey,
            )})`}
            back
            noShadow
         />

         <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
         <View style={{width: width, height: 150, marginBottom: 16, marginBottom: -48}} >
  
<SmartImage uri={team?.picture?.uri} preview={team?.picture?.preview} style={{borderRadius: 4, left: 16, width: width - 32, height: 140, position: 'absolute'}} />
<View centerH style={{borderRadius: 4, left: 16, backgroundColor: 'rgba(0,0,0,0.5)',width: width -32, height: 140}}>
<View paddingT-24>
<Text white  B18><Text R18 white>Team:</Text> {stringLimit(team.name, 20)}</Text>
</View>

<View row>
{Object.keys(weekDoc?.allPlayers)?.map((k, index)=>{

if(index > 5){return null}
   const p = weekDoc?.allPlayers?.[k];
   return <SmartImage uri={p?.picture?.uri} preview={p?.picture?.preview} style={{borderRadius: 4,marginRight: -8, width: 30, height: 30, borderRadius: 20}} />
})}
</View>
{percent >= 100 && <View style={{position: 'absolute', top: 24, right: 16}} >
        <LottieAnimation
                      autoPlay
                      loop={false}
                      style={{
                         height: 50,
                        //  top: -30,
                        //  right: -3,
                        //  zIndex: 0,
                        //  position: 'absolute'
                      }}
                      source={require('../../lottie/check.json')}
                   />
            </View>}
</View>

</View>
      
            <Box>
         <View row padding-24 center>
            {/* <Winner  team={team} weeklyDoc={weekDoc}/>*/}
            <View center><Text B28 buttonLink green40={percent >= 100}>{percent}%</Text><Text B14>%</Text></View>
            <View style={{width: 1, backgroundColor: '#ccc', height: 50}} marginH-16/> 
         <View center><Text B28 buttonLink>{kFormatter(weekDoc.score || 0)}</Text><Text B14>Score</Text></View>
         
         <View style={{width: 1, backgroundColor: '#ccc', height: 50}} marginH-16/>
         <View center><Text B28 smashPink>{kFormatter(weekDoc.target || 0)}</Text><Text B14  >Week Target</Text></View>
        
         </View>
         </Box>
         <WeekTeamTarget team={team} weekDoc={weekDoc}/>
    
         <SectionHeader title="Team Leaderboard"  top={0} />
     
     <FlatList
           initialNumToRender={1}
           // windowSize={1}
           keyExtractor={(item) => item.id}
           data={playersArrayTwo}
           renderItem={renderItem}
        />

    
             
    
<Winners team={team} weeklyDoc={weekDoc} />

             {/* <SectionHeader title="Team Contribution" top={16} />
            <TeamPieChart
               players={
                  team?.joined?.map((playerId) => team?.playerData?.[playerId]) || []
               
               }

               endOfCurrentWeekKey={endOfCurrentWeekKey}
               smashStore={smashStore}
               teamId={weekDoc?.teamId}
               weekDoc={weekDoc}
            /> */}
         

         </ScrollView>
         {/* <Text style={{ padding: 24 }}>View all past Stats Coming Soon..</Text> */}
         {/* <Box padding-32>
        
            <Text>
               {week?.target} / {week?.teamScore}
            </Text>
         </Box> */}
      </View>
   );
};

export default inject('smashStore', 'teamsStore')(observer(SingleWeek));
