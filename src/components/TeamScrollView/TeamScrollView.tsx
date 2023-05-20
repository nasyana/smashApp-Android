import _ from 'lodash';
import React, { Component, useEffect, useMemo, useState } from 'react';
import {
   ScrollView,
   Text,
   StyleSheet,
   TouchableOpacity,
   FlatList,
} from 'react-native';
import { View } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import AvatarContainer from './AvatarContainer';
import AvatarContainerInTeam from './AvatarContainerInTeam';
import Shimmer from '../../components/Shimmer';
import { AntDesign } from '@expo/vector-icons';
import Box from 'components/Box';
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from '@react-navigation/core';
import AvatarContainerWeek from './AvatarContainerWeek';
import { Vibrate } from 'helpers/HapticsHelpers';


const TeamScrollView = (props) => {
   const { navigate } = useNavigation();



   const {
      smashStore,
      teamsStore,
      team,
      onPressApproveUsers,
      skipSubscribe = false
   } = props;

   const { setTeamPlayersByTeamId,teamPlayersByTeamId } = teamsStore;


   const { todayDateKey, setFocusUser, uid } =
      smashStore;

      
      

   const goToProfile = (user) => {
      navigate('MyProfileHome', { user });
   };
 


   useEffect(() => {

      // if(!team.id || teamPlayersByTeamId[team.id] ){return}

      if(skipSubscribe || !team.id){

         return 
      }

      const unsubscribeToPlayers = onSnapshot(
         query(
           collection(firestore, "users"),
           where("teams", "array-contains", team.id),
           orderBy("updatedAt", "desc"),
           limit(10)
         ),
         (snaps) => {
           if (!snaps.empty) {
             const playersArray = [];
             snaps.forEach((snap) => {
               if (!snap.exists) return;
               const user = snap.data();
               playersArray.push(user);
             });
     
             setTeamPlayersByTeamId(team.id, playersArray);
           }
         }
       );
      return () => (unsubscribeToPlayers ? unsubscribeToPlayers : null);
   }, [team?.joined]);


   const invite = () => {

      Vibrate();
      // setTimeout(() => {
         smashStore.simpleCelebrate = {
            name: `Share Your Team Link!`,
            title: `Share Team!`,
            subtitle: `Share your Team Link & Code with your Friends & Family that you want to play so they can request to join your Team! 🔥`,
            button: "Share Link",
            nextFn: () => smashStore.shareTeam(team)
         };
         // smashStore.checkCameraPermissions(true);
      // }, 500);

   }

   const renderItem = ({ item, index }) => {

      // if(!team.requested.includes(item) && !team.joined.includes(item) ) { return null}


      return (
         <View key={item} >
            <AvatarContainerInTeam
               playerId={item}
               onPressApproveUsers={onPressApproveUsers}
               {...{
                  todayDateKey,
                  setFocusUser,
                  goToProfile,

                  team,
               }}
               player={{uid: item}}
               index={index}
            />
       
         </View>
      );
            };

//  console.warn(team.name, players.length);
 

   return (
      <ScrollView
         showsHorizontalScrollIndicator={false}
         contentContainerStyle={{paddingHorizontal: 16, minHeight: 140}}
         horizontal>
         <View row>

     
            <FlatList
            // estimatedItemSize={91} 
               horizontal={true}
               contentContainerStyle={{ paddingLeft: 8 }}
               data={team.joined || []}
               renderItem={renderItem}
               keyExtractor={(item, index) => {
                  return item
               }}
            />
          {props.waiting && <AvatarContainerInTeam
               playerId={uid}
               onPressApproveUsers={onPressApproveUsers}
               {...{
                  todayDateKey,
                  setFocusUser,
                  goToProfile,

                  team,
               }}
               index={0}
            />}
         </View>
      </ScrollView>
   );
};;;

export default inject('smashStore', 'teamsStore')(observer(TeamScrollView));

const styles = StyleSheet.create({
   container: {
      // paddingVertical: 25,
      paddingHorizontal: 16,
      paddingTop: 0,
      // marginBottom: 16
   },
   section: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 0,
   },
});
