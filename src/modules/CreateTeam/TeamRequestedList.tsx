import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {View, Colors, Text, Button} from 'react-native-ui-lib';
import firebaseInstance from '../../config/Firebase';
const firestore = firebaseInstance.firestore;
import {inject, observer} from 'mobx-react';
import TeamPlayerItem from './TeamPlayerItem';
// import firebase from 'firebase';
import { useNavigation } from '@react-navigation/core';
import { doc, updateDoc,collection,where,limit,query,onSnapshot,arrayRemove } from "firebase/firestore";
import Routes from 'config/Routes';
const TeamRequestedList = (props) => {
   const { navigate, goBack, replace } = useNavigation();
   const [players, setPlayers] = useState([]);
   const [loaded, setLoaded] = useState(true);
   const { teamsStore, teamDoc, smashStore } = props;
   const { currentTeam } = teamsStore;
   const { requested: reqUsersUIDs = [] } = currentTeam;
   const { setShowFollowingDialog } = teamsStore;

   const theTeam = teamDoc || currentTeam;

   const onPressAccept = (user) => {
      teamsStore.approvePlayerIntoTeam(theTeam.id, user.uid);
      const acceptCallback = () => {
         goBack();
         // replace(Routes.TeamArena, { team: theTeam });
      };
      props?.smashStore?.shortUniversalLoading(1000, acceptCallback);
   };

   const onPressDeny = (user) => {
      const teamDoc = doc(collection(firestore, "teams"), theTeam.id);
      updateDoc(teamDoc, {
        requested: arrayRemove(user.uid),
      });
      
      const denyCallback = () => {
        goBack();
      };
    
      props?.smashStore?.shortUniversalLoading(1500, denyCallback);
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
               <Button
                  label="Accept"
                  style={{backgroundColor: Colors.green30}}
                  size="small"
                  onPress={() => onPressAccept(item)}
               />
            }
            button2={
               <Button
                  label="Deny"
                  size="small"
                  color={'white'}
                  style={{backgroundColor: Colors.red30}}
                  onPress={() => onPressDeny(item)}
               />
            }
         />
      );
   };

   useEffect(() => {
      const { requested: reqUsersUIDs = [] } = theTeam;
      if (!reqUsersUIDs?.length) {
         setPlayers([]);
         return;
      }
      if (reqUsersUIDs?.length > 9) reqUsersUIDs.length = 9;
    
      const q = query(
        collection(firestore, 'users'),
        where('id', 'in', reqUsersUIDs),
        limit(30)
      );
    
      const unsubscribeToPlayers = onSnapshot(q, (snaps) => {
        if (!snaps.empty) {
          const users: any[] = [];
    
          snaps.forEach((snap: any) => {
            const user = snap.data();
            users.push(user);
          });
    
          setPlayers(users);
        }
      });
    
      return unsubscribeToPlayers;
    }, [theTeam.requested, setPlayers]);

   if (!loaded) {
      return null;
   }
   return (
      <View
         flex
         // backgroundColor={Colors.background}
      >
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
                  <Text R16 secondaryContent>
                     Oops! No-one has requested to join...
                  </Text>
               </View>
            }
         />
      </View>
   );
};

export default inject('teamsStore', 'smashStore')(observer(TeamRequestedList));
