import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import React, { useEffect, useState } from 'react';
import { AntDesign, Feather } from '@expo/vector-icons';
import firebaseInstance from 'config/Firebase';
import { useNavigation } from '@react-navigation/core';
import Routes from 'config/Routes';
import { doc, onSnapshot } from "firebase/firestore";
import { inject, observer } from 'mobx-react';
const TeamUnreads = (props) => {

   const { navigate, goBack } = useNavigation();
   const { teamsStore, smashStore, team, goToTeamChat, relative } = props;

   const {
      currentUserId,
   } = smashStore;

   const {
      setUnreads,
      teamUnreads,
   } = teamsStore;


   const { uid } = firebaseInstance.auth.currentUser;
   const thisTeamUnreads = teamUnreads?.[`${team.id}_${currentUserId}`] || 0;
   const loadUnreads = () => {
      const unsub = onSnapshot(doc(firebaseInstance.firestore, 'unreads', team.id), (unreadsSnap) => {
         const unreadDoc = unreadsSnap.data();
         setUnreads(uid, team.id, unreadDoc?.[uid] || 0);
       });

       return unsub
   }; 


   useEffect(() => {
     const unsub = loadUnreads();

     return () => {
       if(unsub){unsub();}
     };
   }, []);

   const hasUnreads = thisTeamUnreads > 0;

   // if (!hasUnreads) {
   //    return null;
   // }
   return (
      <View row style={{ position: relative ? 'relative' : 'absolute', bottom: relative ? 0 : 0, left: relative ? 0 : 24 }}>
         {hasUnreads && (
            <TouchableOpacity
               onPress={goToTeamChat}
               paddingH-8
               paddingT-4
               paddingB-2
               style={{
                  backgroundColor: Colors.buttonLink,
                  borderRadius: 60,
                  marginRight: 8,

                  alignContent: 'center',
                  justifyContent: 'center',
               }}>
               <Text B14 style={{ textAlign: 'center', color: '#fff' }} centerV>
                  <Feather name="message-square" size={15} color={'#fff'} />{' '}
                  {thisTeamUnreads}
               </Text>
            </TouchableOpacity>
         )}
 
      </View>
   );
};

export default inject(
   'teamsStore',
   'smashStore',
   'challengesStore',
)(observer(TeamUnreads));

