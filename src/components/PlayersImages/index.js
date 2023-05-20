import React from 'react';
import SmartImage from '../SmartImage/SmartImage';
import { View, Text } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';

const PlayerImages = ({ teamsStore, uids = [], team }) => {
   const { teamPlayersByTeamId } = teamsStore;

   const teamId = team.id;


   if (!teamId) return null;

   const players = (teamPlayersByTeamId && teamPlayersByTeamId[teamId]) || [];

 
   const filteredPlayers = players
      .filter((player) => uids.includes(player.id))
      .map(({ id, picture }) => ({ id, picture }));

   return (
      <View row centerH centerV>
         {filteredPlayers.map((player, index) => {
            if (index < 5)
               return (
                  <SmartImage
                     preview={player?.picture?.preview || ''}
                     uri={player?.picture?.uri || ''}
                     style={{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        marginLeft: -15,
                        zIndex: filteredPlayers.length - index,
                     }}
                  />
               );
            else return null;
         })}

         {filteredPlayers.length > 5 && (
            <Text marginL-4>{`+${filteredPlayers.length - 5}`}</Text>
         )}
      </View>
   );
};

export default inject('teamsStore')(observer(PlayerImages));
