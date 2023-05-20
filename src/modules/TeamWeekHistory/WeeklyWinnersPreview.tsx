import { View, Text } from 'react-native-ui-lib';
import React from 'react';
import SmartImage from 'components/SmartImage/SmartImage';
const WeeklyWinnersPreview = (props) => {
   const { weeklyDoc, teamsStore, team } = props;
   const { currentTeam } = teamsStore;

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
   const playerDoc = currentTeam.playerData[winnerUserId]
   return (
      <View row flex marginR-16 paddingL-8 >
 <Text B22 marginR-8>👑</Text>
         <SmartImage
            uri={playerDoc?.picture?.uri}
            preview={playerDoc?.picture?.preview}
            style={{
               height: 30,
               width: 30,
               borderRadius: 60,
               backgroundColor: '#fafafa',
               // marginRight: -16,
               // zIndex: zIndex,
               // elevation: zIndex,
            }}
         />
        
         {/* {Object.keys(userWeekScores)?.map((playerId, index) => {
            if (index > 2) {
               return null;
            }
            const playerDoc = currentTeamPlayersHash[playerId];
            console.log('currentTeamPlayersHash', currentTeamPlayersHash);
            const score = userWeekScores[playerId];
            const zIndex = 10 - index;
            return (
               <SmartImage
                  uri={playerDoc?.picture?.uri}
                  preview={playerDoc?.picture?.preview}
                  style={{
                     height: 30,
                     width: 30,
                     borderRadius: 60,
                     backgroundColor: '#fafafa',
                     marginRight: -16,
                     zIndex: zIndex,
                     elevation: zIndex,
                  }}
               />
            );
         })} */}
      </View>
   );
};

export default WeeklyWinnersPreview;
