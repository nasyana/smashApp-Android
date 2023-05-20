import { View, Text } from 'react-native-ui-lib';
import React, { useEffect, useState } from 'react';
import Firebase from 'config/Firebase';
import SmartImage from 'components/SmartImage/SmartImage';

const LeaderboardPreview = (props) => {
   const { team } = props;

   const [players, setPlayers] = useState([]);
   useEffect(() => {
      const { joined: joinedUsersUIDs = [] } = team;
      if (!joinedUsersUIDs.length) {
         setPlayers([]);
         return;
      }

      if (joinedUsersUIDs?.length > 9) joinedUsersUIDs.length = 9;
      const unsubscribeToPlayers = Firebase.firestore
         .collection('users')
         .where('id', 'in', joinedUsersUIDs)
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
   }, [team.joined]);

   return (
      <View row paddingT-8>
         {players &&
            players.map((user, index) => {
               if (index < 3) {
                  return (
                     <SmartImage
                        uri={user?.picture?.uri || ''}
                        preview={user?.picture?.preview || ''}
                        style={{
                           height: 35,
                           width: 35,
                           borderRadius: 60,
                           marginRight: -17,
                           borderWidth: 1,
                        }}
                     />
                  );
               }
            })}
      </View>
   );
};

export default LeaderboardPreview;
