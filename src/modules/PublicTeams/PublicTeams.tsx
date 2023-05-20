import { View, Text } from 'react-native-ui-lib';
import Header from 'components/Header';
import React, { useState, useEffect } from 'react';
import Firebase from 'config/Firebase';
import { FlatList } from 'react-native';
import TeamFlat from './TeamFlat';
import Routes from 'config/Routes';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/core';
const PublicTeams = (props) => {
   const { smashStore } = props;
   const [publicTeams, setPublicTeams] = useState([]);
   const { navigate } = useNavigation();

   useEffect(() => {
      const teamsArray = [];
      const query = Firebase.firestore
         .collection('teams')
         .where('active', '==', true)
         .where('teamIsPublic', '==', true)
         .orderBy('updatedAt', 'desc');

      const unsubPublicTeams = query.limit(30).onSnapshot((snaps) => {
         snaps.forEach((snap) => {
            const team = snap.data();
            teamsArray.push(team);
         });

         setPublicTeams(teamsArray);
      });

      return () => {
         if (unsubPublicTeams) {
            unsubPublicTeams();
         }
      };
   }, []);

   return (
      <View flex>
         <Header back title="Public Teams" />
         <FlatList
            data={publicTeams}
            keyExtractor={(item, index) => item.id}
            contentContainerStyle={{ paddingTop: 24 }}
            ListEmptyComponent={
               <View padding-24>
                  <Text secondaryContent center>
                     No public teams at the moment 😴
                  </Text>
               </View>
            }
            renderItem={({ item, index }) => (
               <TeamFlat team={item} index={index} smashStore={smashStore} />
            )}
         />
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(PublicTeams));
