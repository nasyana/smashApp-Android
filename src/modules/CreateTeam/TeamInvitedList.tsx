import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {View, Colors, Text, Button} from 'react-native-ui-lib';
import firebaseInstance from '../../config/Firebase';
import {inject, observer} from 'mobx-react';
import TeamPlayerItem from './TeamPlayerItem';
// import firebase from 'firebase';
import { collection, query, where, limit, onSnapshot,updateDoc,arrayRemove,doc } from 'firebase/firestore';
const TeamInvitedList = (props) => {

   const firestore = firebaseInstance.firestore;
   const [players, setPlayers] = useState([]);
   const [loaded, setLoaded] = useState(true);
   const { teamsStore } = props;
   const { currentTeam } = teamsStore;
   const { uid } = Firebase.auth.currentUser;
   const { admins = [] } = currentTeam;
   const isAdmin = admins.includes(uid);

   const onPressRemove = (user) => {
      const teamDocRef = doc(collection(firestore, 'teams'), currentTeam.id);
    
      updateDoc(teamDocRef, {
        invited: arrayRemove(user.uid),
      });
    };


   const renderItem = ({ item, index }) => {
      if (!item) {
         return null;
      }
      return <TeamPlayerItem item={item} index={index} onPressRemove={onPressRemove}   button1={
         uid !== item.uid && isAdmin ? (
            <Button
               label="Remove"
               size="small"
               onPress={() => onPressRemove(item)}
            />
         ) : null
      } />;
   };


   useEffect(() => {
      const { invited: invitedUsersUIDs = [] } = currentTeam;
  
      if (invitedUsersUIDs.length === 0) {
        setPlayers([]);
        return;
      }
  
      if (invitedUsersUIDs.length > 9) {
        invitedUsersUIDs.length = 9;
      }
  
      const q = query(
        collection(firestore,'users'),
        where('id', 'in', invitedUsersUIDs),
        limit(30)
      );
  
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const users = [];
  
          querySnapshot.forEach((doc) => {
            const user = doc.data();
            users.push(user);
          });
  
          setPlayers(users);
        }
      });
  
      return () => {
        unsubscribe();
      };
    }, [currentTeam.invited]);
  
   

   if (!loaded) {
      return null;
   }
   return (
      <View flex>
         <FlatList
            data={players || []}
            renderItem={renderItem}
            scrollEnabled={false}
            keyExtractor={(item, index) => item?.id?.toString()}
            contentContainerStyle={{
               flex: 1,
               marginBottom: 10,
               paddingTop: 16,
            }}
            ListEmptyComponent={
               <View flex center paddingB-16>
                  <Text R16 color28>
                     Oops! No-one has been invited...
                  </Text>
               </View>
            }
         />
      </View>
   );
};

export default inject('teamsStore')(observer(TeamInvitedList));
