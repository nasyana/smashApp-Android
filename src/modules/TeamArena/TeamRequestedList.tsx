import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {View, Colors, Text, Button} from 'react-native-ui-lib';
import Firebase from '../../config/Firebase';
import {inject, observer} from 'mobx-react';
import TeamPlayerItem from './TeamPlayerItem';

const TeamRequestedList = (props) => {
   const [players, setPlayers] = useState([]);
   const [loaded, setLoaded] = useState(true);
   const {teamsStore} = props;
   const {currentTeam} = teamsStore;
   const {requested: reqUsersUIDs = []} = currentTeam;
   const {setShowFollowingDialog} = teamsStore;

   const onPressAccept = (user) => {
      teamsStore.acceptInviteToTeam(
         currentTeam.id,
         user.uid,
         currentTeam,
         false,
      );
   };

   const renderItem = ({item, index}) => {
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
                  size="small"
                  onPress={() => onPressAccept(item)}
               />
            }
         />
      );
   };

   useEffect(() => {
      const {requested: reqUsersUIDs = []} = currentTeam;
      if (!reqUsersUIDs.length) {
         setPlayers([]);
         return;
      }

      if (reqUsersUIDs?.length > 9) reqUsersUIDs.length = 9;

      const unsubscribeToPlayers = Firebase.firestore
         .collection('users')
         .where('id', 'in', reqUsersUIDs)
         .limit(30)
         .onSnapshot((snaps: any) => {
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
   }, [currentTeam.requested]);

   if (!loaded) {
      return null;
   }
   return (
      <View flex backgroundColor={Colors.background}>
         <FlatList
            data={players || []}
            renderItem={renderItem}
            scrollEnabled={false}
            keyExtractor={(item, index) => item?.id?.toString()}
            contentContainerStyle={{flex: 1, marginBottom: 10}}
            ListEmptyComponent={
               <View flex center>
                  <Text R16 color28>
                     Oops! No-one is here...
                  </Text>
               </View>
            }
            ListFooterComponent={() => (
               <View>
                  <Button
                     backgroundColor={'#fafafa'}
                     color="white"
                     onPress={() => {
                        setShowFollowingDialog(true);
                     }}
                     marginH-16>
                     <Text>Invite Friends</Text>
                  </Button>
               </View>
            )}
            // ListHeaderComponent={() => {
            //    return <ColDescription challenge={challenge} />;
            // }}
         />
      </View>
   );
};

export default inject('teamsStore')(observer(TeamRequestedList));
