import React, {useEffect, useState} from 'react';
import SmartImage from '../../../components/SmartImage/SmartImage';
import {
   View,
   Colors,
   Text,
   TouchableOpacity,
   Button,
} from 'react-native-ui-lib';

const InviteFollowerUser = (props) => {
   const {item, index, inviteUserToTeam, currentUser, team} = props;
   const user = item;
   const { invited: invitedUsers = [], joined = [] } = team;

   const [invited, setInvited] = useState(false);

   const invitePlayer = () => {
      setInvited(true);
      inviteUserToTeam(user, currentUser, {
         id: team.id,
         name: team.name,
         picture: team.picture,
      });
   };

   useEffect(() => {
      invitedUsers.includes(user.uid) && setInvited(true);
   }, [invitedUsers, user.uid]);

   const isInvited = invitedUsers.includes(user.uid);

   const isJoined = joined.includes(user.uid);

   return (
      <View
         row
         style={{
            borderRadius: 6,
            marginHorizontal: 16,
            backgroundColor: '#FFF',
            paddingBottom: 16,
            overflow: 'hidden',
            marginBottom: 2,
         }}>
         <View centerV paddingL-16 paddingT-16>
            <Text>{index + 1}</Text>
         </View>

         <TouchableOpacity paddingT-16 paddingL-16>
            <SmartImage
               uri={user?.picture?.uri}
               preview={user?.picture?.preview}
               style={{ height: 50, width: 50, borderRadius: 60 }}
            />
         </TouchableOpacity>

         <View paddingL-16 centerV flex row spread>
            <Text H14 color28 marginT-16 marginB-8>
               {user?.name || 'anon'}
            </Text>
         </View>

         <View paddingL-16 flex row spread paddingR-24 centerV>
            <View />
            {isJoined && (
               <Button
                  label="Playing"
                  outline
                  color={Colors.green50}
                  size="small"
                  outlineColor={Colors.green50}
               />
            )}
            {isInvited && !isJoined && (
               <Button
                  label="Invited"
                  outline
                  color={Colors.green50}
                  size="small"
                  outlineColor={Colors.green50}
               />
            )}

            {!isInvited && !isJoined && (
               <Button
                  label="Invite"
                  onPress={invitePlayer}
                  outline
                  color={Colors.buttonLink}
                  size="small"
                  outlineColor={Colors.buttonLink}
               />
            )}
         </View>
      </View>
   );
};
export default InviteFollowerUser;
