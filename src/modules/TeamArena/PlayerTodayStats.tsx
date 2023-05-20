import { ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearChart from '../../components/LinearChart';
import Box from '../../components/Box';
import { Colors, View, Text } from 'react-native-ui-lib';
import Firebase from 'config/Firebase';
import { inject, observer } from 'mobx-react';
import SmartImage from 'components/SmartImage/SmartImage';
import Shimmer from 'components/Shimmer';
import { SingleActivity } from 'components/Challenge/Activities';
import SectionDiv from 'components/SectionDiv';
export enum EnumTypeChart {
   week = 0,
   month = 1,
   year = 2,
   all = 3,
}
const PlayerTodayStats = (props) => {
   const { team, dayKey, smashStore, color, player, todayActivity, playerId } = props;

   const { kFormatter,libraryActivitiesHash } = smashStore;
   const day = todayActivity;
   const isLegacy = team?.type === 'Game';

const picture = team.playerData?.[playerId]?.picture;
const name = team.playerData?.[playerId]?.name;


const mergedActivities = day?.players?.[playerId]?.smashes ? (day?.players?.[playerId]?.smashes || []).reduce((acc, activity) => {
   const { activityMasterId, points, multiplier } = activity;
   if (!acc[activityMasterId]) {
     acc[activityMasterId] = {
       ...activity,
       id: `${activityMasterId}_${Date.now()}`,
     };
   } else {
     acc[activityMasterId].points += points;
     acc[activityMasterId].multiplier += multiplier;
   }
   return acc;
 }, {}) : [];
console.log('day', day)
   return (
      <View>
      <Box>
         <View row centerV marginH-16 paddingT-16 spread>
            <View row centerV spread>
               <SmartImage
                  uri={picture?.uri}
                  preview={picture?.preview}
                  style={{
                     height: 35,
                     width: 35,
                     borderRadius: 60,
                     marginRight: 16,
                  }}
               />
               <View height={1} backgroundColor={Colors.color6D} width={20} />
               <Text B12 marginL-6>
                  {name?.toUpperCase() || player.name?.toUpperCase()}{' '}
               </Text>
            </View>
            {todayActivity ? (
               <Text B14 marginL-6 style={{ color }}>
                  {isLegacy
                     ? kFormatter(day?.userData?.[player.id]?.userTotal) || 0
                     : kFormatter(day?.players?.[player.id]?.score) || 0}
               </Text>
            ) : (
               <Shimmer style={{ height: 10, width: 10, borderRadius: 30 }} />
            )}
         </View>

         <LinearChart
            type={EnumTypeChart.week}
            height={200}
            chartColor={color}
            smashes={day?.players?.[player.id]?.smashes || []}
            smashStore={smashStore}
         />
           <View  marginT-8 marginH-16 marginB-16 >
         {/* <Text>{JSON.stringify(mergedActivities)}ss</Text> */}
               {(Object.values(mergedActivities) || []).map((s,i) => {
                        const activity = libraryActivitiesHash?.[s.activityMasterId] || {};
                       return <SingleActivity  day={day} key={s.activityMasterId} activity={activity} smashStore={smashStore} showAllPointsEarned={true} points={s.points || 0}/>;
                    })
                  }
            </View>
      </Box>
    
           
      </View>
   );
};;;

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(PlayerTodayStats));
