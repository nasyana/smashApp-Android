import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
   ScrollView,
   StyleSheet,
   TouchableOpacity,
   FlatList,
} from 'react-native';
import { View } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import firebaseInstance from '../../config/Firebase';
import AvatarContainerWeek from './AvatarContainerWeek';
import { AntDesign } from '@expo/vector-icons';
import Box from 'components/Box';
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/core';
import {collection, where, orderBy, limit, onSnapshot, query } from "firebase/firestore";

const TeamScrollViewWeek = (props) => {
   const { navigate } = useNavigation();

   const { smashStore, teamsStore, team, home } = props;

   const onPressApproveUsers = () => {
      navigate(Routes.CreateTeam, { teamDoc: team, type: 'requestToJoin' });
   };

   const { setShowFollowingDialog, endOfCurrentWeekKey, weeklyActivityHash } =
      teamsStore;
      
   const admins = team?.admins || [];

   const { todayDateKey, setFocusUser, currentUserId, isSuperUser } =
      smashStore;
   const [players, setPlayers] = useState([]);
   const pressAvatarHeight = 70;
   const goToProfile = (user) => {
      navigate('MyProfileHome', { user });
   };
   const isAdmin =
      admins?.includes(currentUserId) || team.uid == currentUserId;

   const teamWeeklyKey = `${team.id}_${endOfCurrentWeekKey}`;

   const weeklyActivity = weeklyActivityHash?.[teamWeeklyKey] || {};

   useEffect(() => {
      const unsubscribeToPlayers = onSnapshot(
         query(
           collection(firebaseInstance.firestore, "users"),
           where("teams", "array-contains", team.id),
           orderBy("updatedAt", "desc"),
           limit(30)
         ),
         (snaps) => {
           if (!snaps.empty) {
             const playersArray = [];
             snaps.forEach((snap) => {
               if (!snap.exists) return;
               const user = snap.data();
               
               playersArray.push(user);
             });
       
             const playersSorted = playersArray.sort(
               (a, b) =>
                 (weeklyActivity?.players?.[b.uid]?.score || 0) -
                 (weeklyActivity?.players?.[a.uid]?.score || 0)
             );
       
             setPlayers(playersSorted.map((p) => p.uid));
           }
         }
       );

      return () => (unsubscribeToPlayers ? unsubscribeToPlayers : null);
   }, []);


   const renderItem = React.useCallback(({ item, index }) => {
      return (
         <View key={item} style={styles.section}>
            <AvatarContainerWeek
               onPressApproveUsers={onPressApproveUsers}
               playerId={item}
               {...{
                  todayDateKey,
                  setFocusUser,
                  goToProfile,
                  team,
               }}
               week
               index={index}
            />
         </View>
      );
   }, []);

   return (
      <ScrollView
         showsHorizontalScrollIndicator={false}
         contentContainerStyle={styles.container}
         horizontal>
         <View flex row>
            {(isAdmin || isSuperUser) && !home && false && (
               <TouchableOpacity onPress={setShowFollowingDialog}>
                  <Box
                     style={{
                        height: pressAvatarHeight,
                        width: pressAvatarHeight,
                        borderRadius: pressAvatarHeight / 2,
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        marginRight: 6,
                        marginTop: 4,
                        alignItems: 'center',
                        justifyContent: 'center',
                     }}>
                     <AntDesign
                        name={'addusergroup'}
                        size={28}
                        color={'#777'}
                     />
                  </Box>
               </TouchableOpacity>
            )}
            {/* <TouchableOpacity onPress={() => setShowFollowingDialog(true)}>
               <Text>Add Player</Text>
            </TouchableOpacity> */}
            <FlatList
               horizontal={true}
               contentContainerStyle={{ paddingLeft: 8 }}
               data={[...team.joined]}
               renderItem={renderItem}
               keyExtractor={(item, index) => {
                  return item;
               }}
            />
         </View>
      </ScrollView>
   );
};;;

export default inject('smashStore', 'teamsStore')(observer(TeamScrollViewWeek));

const styles = StyleSheet.create({
   container: {
      paddingTop: 25,
      paddingHorizontal: 24,
      paddingTop: 0,
   },
   section: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 0,
   },
});
