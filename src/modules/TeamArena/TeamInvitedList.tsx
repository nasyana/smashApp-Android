import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {View, Colors, Text, Button} from 'react-native-ui-lib';
import Firebase from '../../config/Firebase';
import {inject, observer} from 'mobx-react';
import TeamPlayerItem from './TeamPlayerItem';

const TeamInvitedList = (props) => {
   const [players, setPlayers] = useState([]);
   const [loaded, setLoaded] = useState(true);
   const { teamsStore } = props;
   const { currentTeam } = teamsStore;
   const { setShowFollowingDialog } = teamsStore;

   const renderItem = ({ item, index }) => {
      if (!item) {
         return null;
      }
      return <TeamPlayerItem item={item} index={index} />;
   };

   useEffect(() => {
      const { invited: invitedUsersUIDs = [] } = currentTeam;
      if (invitedUsersUIDs?.length == 0) {
         setPlayers([]);
         return;
      }

      if (invitedUsersUIDs?.length > 9) invitedUsersUIDs.length = 9;
      const unsubscribeToPlayers = Firebase.firestore
         .collection('users')
         .where('id', 'in', invitedUsersUIDs)
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

      return unsubscribeToPlayers ? unsubscribeToPlayers : () => {};
   }, [currentTeam.invited]);

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
            contentContainerStyle={{ flex: 1, marginBottom: 10 }}
            ListEmptyComponent={
               <View flex center>
                  <Text R16 color28>
                     Oops! No-one is here. Please invite your friend..
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

export default inject('teamsStore')(observer(TeamInvitedList));
