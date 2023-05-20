import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import SmartImage from 'components/SmartImage/SmartImage';
import { playerColors } from 'helpers/teamDataHelpers';
import { AntDesign } from '@expo/vector-icons';
import CreatorAvatar from './CreatorAvatar';
import { ScrollView } from 'react-native';
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/native';
import firebaseInstance from 'config/Firebase';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

const TeamThisWeekInLeaderboard = (props) => {
   const { navigate } = useNavigation();
   const { team = {}, smashStore, index } = props;
   const { kFormatter, colors, endWeekKey } = smashStore;
   const key = `${team.id}_${endWeekKey}`;
   const [teamWeek, setTeamWeek] = useState(false);

   useEffect(() => {
      
    
      const unsub = onSnapshot(doc(firebaseInstance.firestore, 'weeklyActivity', key), (querySnapshot) => {
        const teamWeekDoc = querySnapshot.data();
        setTeamWeek(teamWeekDoc);
      });
    
      return () => {
        if (unsub) {
          unsub();
        }
      };
    }, []);
    

   const allPlayersHash = teamWeek?.players || {};
   let teamName = team?.name || 'noname';
   const playerIds = team?.joined ? team?.joined : [team.uid];
   console.log('playerIds', playerIds);
   const color = playerColors[index];
   return (
      <View horizontal style={{ borderTopWidth: 10 }}>
         <View
            paddingH-24
            centerV
            paddingV-8
            style={{
               borderLeftWidth: 0,
               // borderColor: '#eee',
               paddingVertical: 16,
               borderColor: color,
            }}>
            {/* <CreatorAvatar  id={tea/> */}
            <TouchableOpacity
               onPress={() => {
                  navigate(Routes.TeamArena, {
                     team: { id: team.id },
                     superUser: true,
                  });
               }}>
               <Text B14 centerV style={{ flex: 1 }}>
                  {/* <AntDesign name="staro" color={color} size={14} />{' '} */}
                  {teamName?.length > 7 ? teamName : teamName}{' '}
                  {kFormatter(team.mostRecentTarget)} ({playerIds.length}){' '}
                  <Text marginR-16 center style={{ flex: 1 }} secondaryContent>
                     Daily Av. {kFormatter(teamWeek?.dailyPlayerAverage || 0)}{' '}
                     Score:{' '}
                  </Text>
                  <Text marginL-16 center buttonLink style={{ flex: 1 }}>
                     {teamWeek?.score ? kFormatter(teamWeek?.score) : 0}
                  </Text>
               </Text>
               {teamWeek && (
                  <ScrollView horizontal>
                     {teamWeek?.allPlayers &&
                        teamWeek?.allPlayers &&
                        Object.values(teamWeek?.allPlayers)?.map((user) => (
                           <TouchableOpacity center marginR-8>
                              <SmartImage
                                 uri={user?.picture?.uri}
                                 preview={user?.picture?.preview}
                                 style={{
                                    height: 50,
                                    width: 50,
                                    borderRadius: 25,
                                 }}
                              />
                              <Text>{user.name}</Text>
                           </TouchableOpacity>
                        ))}
                  </ScrollView>
               )}
            </TouchableOpacity>
            {/* <Text marginR-16 secondaryContent style={{ flex: 1 }}>
               {playerIds.length}
            </Text> */}
            {/* <View
            row
            marginR-24
            style={{
               justifyContent: 'flex-start',
               alignItems: 'flex-start',
            }}>
            {playerIds.map((playerId) => (
               <SmartImage
                  uri={allPlayersHash?.[playerId]?.picture?.uri}
                  preview={allPlayersHash?.[playerId]?.picture?.preview}
                  style={{
                     width: 20,
                     height: 20,
                     borderRadius: 20,
                     marginRight: -8,
                  }}
               />
            ))}

           
         </View> */}
         </View>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TeamThisWeekInLeaderboard));
