import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {View, Colors, Assets, Text, Button} from 'react-native-ui-lib';
import Firebase from '../../../config/Firebase';
import {inject, observer} from 'mobx-react';
import InviteFollowerUser from '../components/InviteFollowerUser';

const FollowingList = (props) => {
   const [following, setFollowing] = useState([]);
   const {smashStore, close, teamsStore, team} = props;

   const {currentUser} = smashStore;
   const {inviteUserToTeam} = teamsStore;
   const {uid} = currentUser;

   const renderFollowingUser = ({item, index}) => {
      if (!item) {
         return null;
      }
      return (
         <InviteFollowerUser
            item={item}
            index={index}
            {...{
               currentUser,
               inviteUserToTeam,
               team,
            }}
         />
      );
   };

   useEffect(() => {
      const unsubscribeToPlayersImFollowing = Firebase.firestore
         .collection('users')
         .where('followers', 'array-contains', uid)
         .onSnapshot((snaps: any) => {
            if (!snaps.empty) {
               const playersImFollowingArray: any = [];

               snaps.forEach((snap: any) => {
                  const user = snap.data();
                  playersImFollowingArray.push(user);
               });

               setFollowing(playersImFollowingArray);
            }
         });
      return unsubscribeToPlayersImFollowing;
   }, [uid]);

   return (
      <View flex backgroundColor={Colors.background}>
         <View
            row
            paddingH-16
            paddingT-13
            paddingB-11
            style={{
               justifyContent: 'space-between',
            }}>
            <Text H14 color28 uppercase>
               Invite Friends
            </Text>
            <Button
               iconSource={Assets.icons.ic_delete_day}
               link
               color={Colors.buttonLink}
               onPress={close}
            />
         </View>
         <FlatList
            data={following}
            renderItem={renderFollowingUser}
            keyExtractor={(item, index) => item?.uid}
            contentContainerStyle={{}}
            ListFooterComponent={() => <View></View>}
         />
      </View>
   );
};
export default inject('smashStore', 'teamsStore')(observer(FollowingList));
