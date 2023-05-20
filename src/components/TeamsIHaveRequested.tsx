import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import Firebase from 'config/Firebase';
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/core';
import Routes from 'config/Routes';
import SectionHeader from './SectionHeader';
import { ActivityIndicator } from 'react-native';
import TeamScrollView from './TeamScrollView';
const TeamsIHaveRequested = (props) => {

   const { smashStore } = props;

   const { noTeamsOrChallenges } = smashStore;
   const { navigate } = useNavigation();
   const { uid } = Firebase.auth.currentUser;
   const [requestedTeams, setRequestedTeams] = useState([]);
   useEffect(() => {
      const unsubRequestedTeams = Firebase.firestore
         .collection('teams')
         .where('requested', 'array-contains', uid)
         .onSnapshot((snaps) => {
            const teams = [];

            snaps.forEach((snap) => {
               const team = snap.data();

               if (team.active) {
                  teams.push(team);
               }
           
            });

            setRequestedTeams(teams);
         });

      return () => {
         if (unsubRequestedTeams) {
            unsubRequestedTeams();
         }
      };
   }, []);

   const goToTeam = (team) => {
      navigate(Routes.TeamArena, { team });
   };

   if (requestedTeams.length == 0 || !noTeamsOrChallenges) {
      return null;
   }
   return (

      <>
      <SectionHeader
            title={
               'TEAMS LOBBY'
            }
            bottom={0}
            style={{ marginTop: 8, paddingBottom: 0 }}
         />
      <View padding-0>
         
         {/* <Text R14 secondaryContent style={{ paddingLeft: 24 }}>
            Waiting for Team Admin Approval
         </Text> */}
         <View padding-18 paddingH-0>
            {requestedTeams.map((team, index) => (
               <TouchableOpacity
                  onPress={() => goToTeam(team)}

                
                  centerV
                  paddingB-16
                  style={{ borderBottomWidth: 7, borderColor: '#333' }}>
                     <View paddingH-24 paddingB-24 row spread>
                  <Text H14>
                     Team: {team.name}
                  </Text>
                  <Text H14>
                    Joined: ({team?.joined?.length || 1})
                  </Text>
                  <Text H14>
                     Waiting: ({team?.requested?.length || 1})
                  </Text>
                  </View>
                  <TeamScrollView team={team} home waiting />
                  {/* <Text H14>{team?.joined?.length || 1}</Text> */}
                  {/* <ActivityIndicator /> */}
               </TouchableOpacity>
            ))}
         </View>
      </View>
      </>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TeamsIHaveRequested));
