import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import React, { useState, useEffect } from 'react';
import { hasSomeoneVoted, howManyVotes} from 'helpers/VotingHelpers';
import SmartImage from 'components/SmartImage/SmartImage';
import SectionHeader from 'components/SectionHeader';
import { inject, observer } from 'mobx-react';
import Box from 'components/Box';
import ButtonLinear from 'components/ButtonLinear';
const options = ['add10k', 'add20k', 'remove10k', 'keepTheSameTarget'];
const optionLabels = [
   'Add 10k',
   'Add 20k',
   'Remove 10k',
   'Keep the same target',
];
const TeamVotes = (props) => {
   const { teamsStore, team = {} } = props;
   const { setIsTeamVoteDialogVisible, currentTeam } = teamsStore;


   const { voteDocsHash, teamUsersByTeamId } = teamsStore;

   const players = teamUsersByTeamId?.[team?.id] || [];
   const voteDoc = props.voteDoc || voteDocsHash?.[currentTeam.id]
// alert(JSON.stringify(team.playerData))
   // const [playersHash, setPlayersHash] = useState({});


   const playersHash = team?.playerData || {};

   // players.forEach((p) => {
   //    playersHash[p.uid] = p;
   // });

   // useEffect(() => {
   //    let playerHash = {};

   //    players.forEach((p) => {
   //       playerHash[p.uid] = p;
   //    });

   //    setPlayersHash(playerHash);
   //    return () => {};
   // }, [players]);

   const checkIfTeamVotes = () => {

      let num = 0;
      options.forEach((option) => {

         num = num + voteDoc?.[option]?.length || 0
      });

      return num > 0;
   };


   // if (!hasSomeoneVoted(voteDoc)) {
   //    return null;
   // }
   

   const numVotes = howManyVotes(voteDoc);

   const voteLabel = numVotes == 0 ? 'Votes' : numVotes > 1 ? 'Votes' : 'Vote';
   return (
      <View>
         <SectionHeader
            title={'Team Votes'.toUpperCase()}
            style={{ marginBottom: 16, paddingBottom: 0, marginTop: 32 }}

            subtitle={<Text B14>{howManyVotes(voteDoc) + ' ' + voteLabel}</Text>}
         />
         {checkIfTeamVotes() ? <Box>
            <View
            paddingH-24
            paddingV-16
         >
               {options?.length > 0 && options.map((option, index) => {
               if (voteDoc?.[option]?.length == 0) return;
               return (
                  <View
                     row
                     spread
                     centerV
                     style={{
                        borderBottomWidth: 0,
                        borderColor: '#aaa',
                        marginBottom: 0,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        height: 50,
                        borderBottomWidth: 1, 
                        borderColor: '#fafafa'
                     }}>
                     <Text secondaryContent marginR-8 B14>
                        {optionLabels[index]}
                     </Text>
                     {/* <Text>{voteDoc?.[option]?.length}</Text> */}
                     {voteDoc?.[option]?.length > 0 && (
                        <View row>
                           {voteDoc?.[option]?.map((uid) => {
                              const player = playersHash[uid] || {};
                              return (
                                 <SmartImage
                                    uri={player?.picture?.uri}
                                    preview={player.picture?.preview}
                                    style={{
                                       height: 30,
                                       width: 30,
                                       borderRadius: 60,
                                       marginLeft: -8,
                                    }}
                                 />
                              );
                           })}
                        </View>
                     )}
                  </View>
               );
            })}
         </View>

         <ButtonLinear onPress={() => (teamsStore.manualTeamToVoteOn = currentTeam)} title={'Vote'} style={{ marginBottom: 16 }} />
         </Box> : <View><Box><View >
         <ButtonLinear onPress={() => (teamsStore.manualTeamToVoteOn = currentTeam)} title={'Vote'} style={{ marginVertical: 16 }} /></View></Box>
         <View paddingH-32>
         <Text center R14 secondaryContent>No votes yet... Use the Vote button to vote to change the weekly target.</Text>
         </View>
         </View>}
      
      </View>
   );
};

export default inject(
   'teamsStore',
   'smashStore',
   'challengesStore',
)(observer(TeamVotes));
