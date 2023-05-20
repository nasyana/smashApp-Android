import Tag from 'components/Tag';
import React from 'react';
import { PieChart as PieChartSvg } from 'react-native-svg-charts';
import { View, Text } from 'react-native-ui-lib';
import { playerColors } from 'helpers/teamDataHelpers';
import Box from 'components/Box';
import { inject, observer } from 'mobx-react';
const PieChart = (props) => {
   const { smashStore, isToday, teamId, dayKey = false, teamsStore, weekDoc = false, progress, players = [] } = props;

   const { kFormatter, todayDateKey } = smashStore;
   const { weeklyActivityHash, endOfCurrentWeekKey, teamUsersByTeamId } =
      teamsStore;

   // const players = teamUsersByTeamId?.[teamId];

   const thisWeekActivity = weekDoc ||
      weeklyActivityHash?.[`${teamId}_${endOfCurrentWeekKey}`] || {};


   const selectedDayKey = dayKey || todayDateKey;

   let data = [
      {
         key: 2,
         amount: 11,
         svg: { fill: '#5AC8FB' },
         label: 'Fat',
      },
      {
         key: 3,
         amount: 4,
         svg: { fill: '#5856D6' },
         label: 'Carbs',
      },
      {
         key: 4,
         amount: 74,
         svg: { fill: '#FF5E3A' },
         label: 'Protein',
      },
      {
         key: 1,
         amount: 10,
         svg: { fill: '#44DB5E' },
         label: 'Others',
      },
   ];

   data = players
      ? players.map((player, index) => {
           let score = isToday
              ? thisWeekActivity?.daily?.[selectedDayKey]?.players?.[player?.uid]
                   ?.score
              : thisWeekActivity?.players?.[player?.uid]?.score;
           let color = playerColors[index] || '#333';
           return {
              key: index,
              amount: score || 0,
              percent: parseInt((score / thisWeekActivity.score) * 100 || 0),
              svg: { fill: color },
              label: player.name,
           };
        })
      : [];

   data.sort((b, a) => a.amount - b.amount);

   return (
      <Box >
         <View paddingT-24 paddingB-16 paddingL-24 paddingR-16 row >
            <View
               style={{
                  height: 180,
                  width: 180,
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               <PieChartSvg
                  style={{
                     height: 180,
                     width: 180,
                     position: 'absolute',
                     // backgroundColor: '#eee',
                     borderRadius: 130,
                  }}
                  valueAccessor={({ item }) => item.amount}
                  data={data}
                  outerRadius={'95%'}
                  innerRadius={'80%'}
                  padAngle={0.01}
               />
               <Text M36 buttonLink={!isToday} teamToday={isToday}>
                  {
                     isToday
                        ? thisWeekActivity?.daily?.[selectedDayKey]?.score || 0
                        : parseInt((thisWeekActivity.score || 0) / thisWeekActivity.target * 100) + '%'
                  }
               </Text>
               {/* <Text R14 color6D>
                  Score
               </Text> */}
            </View>
            <View centerV marginL-24>
               {data &&
                  data.map((item, index) => {
                     return (
                        <View row marginB-4 key={index}>
                           <Tag
                              size={8}
                              color={item.svg.fill}
                              style={{ marginTop: 6 }}
                           />
                           <View marginL-8>
                              <Text H14 color28>
                                 {item.label} <Text B14 style={{ color: item.svg.fill }}>({item.percent}%)</Text>
                              </Text>
                              {/* <Text R14 color6D>
                                 {kFormatter(item.amount)} 
                              </Text> */}
                           </View>
                        </View>
                     );
                  })}
            </View>
         </View>

         {progress && progress}
      </Box>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(PieChart));
