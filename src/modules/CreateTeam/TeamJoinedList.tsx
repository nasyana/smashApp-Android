import React, {useState, useEffect} from 'react';
import {Alert, FlatList} from 'react-native';
import {View, Colors, Text, Button} from 'react-native-ui-lib';
import firebaseInstance from '../../config/Firebase';
import {inject, observer} from 'mobx-react';
import TeamPlayerItem from './TeamPlayerItem';
import { collection, where, query, onSnapshot, limit } from 'firebase/firestore';
const TeamJoinedList = (props) => {
   const [players, setPlayers] = useState([]);
   const [loaded, setLoaded] = useState(true);
   const {teamsStore} = props;
   const { setShowFollowingDialog, currentTeam, setPlayersByTeamId } =
      teamsStore;

   const { uid } = firebaseInstance.auth.currentUser;
   const { admins = [] } = currentTeam;
   const isAdmin = admins.includes(uid);

   const onPressRemove = (user) => {
      Alert.alert(
         'Are you sure?',
         'Do you want to remove this user from the team?',
         [
            {
               text: 'Cancel',
               style: 'cancel',
            },
            {
               text: 'OK',
               onPress: () => teamsStore.leaveFromTeam(currentTeam.id, user.uid),
            },
         ],
      );
   };

   const renderItem = ({ item, index }) => {
      if (!item) {
         return null;
      }
      return (
         <TeamPlayerItem
            item={item}
            index={index}
            button1={
               uid !== item.uid && isAdmin ? (
                  <Button
                     label="Remove"
                     size="small"
                     onPress={() => onPressRemove(item)}
                  />
               ) : null
            }
         />
      );
   };

   useEffect(() => {
      const { joined: joinedUsersUIDs = [] } = currentTeam;
      if (!joinedUsersUIDs.length) {
         setPlayers([]);
         return;
      }

      if (joinedUsersUIDs?.length > 9) joinedUsersUIDs.length = 9;
      const unsubscribeToPlayers = onSnapshot(
         query(
           collection(firebaseInstance.firestore, 'users'),
           where('id', 'in', joinedUsersUIDs),
           limit(30)
         ),
         (snaps) => {
           if (!snaps.empty) {
             const users = [];
       
             snaps.forEach((snap) => {
               const user = snap.data();
               users.push(user);
             });
       
             setPlayers(users);
             setPlayersByTeamId(users, currentTeam.id);
           }
         }
       );
       

      return unsubscribeToPlayers;
   }, [currentTeam.joined]);

   if (!loaded) {
      return null;
   }
   return (
      <View flex >
         <FlatList
            data={players || []}
            renderItem={renderItem}
            scrollEnabled={false}
            keyExtractor={(item, index) => item?.id?.toString()}
            contentContainerStyle={{ flex: 1, marginBottom: 10, paddingTop: 16 }}
            ListEmptyComponent={
               <View flex center>
                  <Text R16 color28>
                     Oops! No-one joined this team yet..
                  </Text>
               </View>
            }
         />
      </View>
   );
};

export default inject('teamsStore')(observer(TeamJoinedList));
