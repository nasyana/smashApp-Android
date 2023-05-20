import { width } from "config/scaleAccordingToDevice";
import React, { useEffect, useState } from "react";
import SmartImage from "../../../components/SmartImage/SmartImage"
import { FlatList, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import { View, Colors, Image, Assets, Text, Avatar, TouchableOpacity, Button } from "react-native-ui-lib";
import ChallengeLike from "./ChallengeLike";
import { getDaysLeft, getChallengeData } from 'helpers/playersDataHelpers';
import Firebase from '../../../config/Firebase';

const InviteFollowerUser = (props) => {
   const {
      item,
      index,
      like,
      toggleInviteUser,
      goToProfile,
      challengeIsSingleActivity,
      currentUser,
      challengesStore,
      challenge,
   } = props;
   const { qty = 0, score = 0 } = item;
   const user = item;

   const [invited, setInvited] = useState(false);
   const [playerDoc, setPlayerDoc] = useState(false);
   const challengeData = getChallengeData(challenge);

   const invitePlayer = () => {
      setInvited(true);
      toggleInviteUser(user, challengeData, currentUser);
   };

   useEffect(() => {
      const unsubscribeToPlayerImFollowing = Firebase.firestore
         .collection('playerChallenges')
         .doc(`${user.uid}_${challengeData.id}_${challengeData.endDateKey}`)
         .onSnapshot((snap) => {
            if (snap.exists) {
               const playerDoc = snap.data();
               setPlayerDoc(playerDoc);
            }
         });

      return () => {
         if (unsubscribeToPlayerImFollowing) {
            unsubscribeToPlayerImFollowing();
         }
      };
   }, []);
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
         }}
         // onPress={() => goToProfile(user)}
      >
         <View centerV paddingL-16 paddingT-16>
            <Text>{index + 1}</Text>
         </View>

         <TouchableOpacity paddingT-16 paddingL-16>
            {/* <Avatar source={Assets.icons.img_latest} /> */}
            <SmartImage
               uri={user?.picture?.uri}
               preTouchableOpacity={user?.picture?.preview}
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
            {/* <Text buttonLink marginT-16 marginB-8 style={{ fontSize: 35 }}>
                    {challengeIsSingleActivity ? qty : kFormatter(score) || 0}
                </Text> */}

            {playerDoc.active ? (
               <Button
                  outlineColor={Colors.green60}
                  label="Playing"
                  outline
                  color={Colors.green60}
                  size="small"
               />
            ) : invited ? (
               <Button
                  label="Invited"
                  outline
                  color={Colors.green50}
                  size="small"
                  outlineColor={Colors.green50}
               />
            ) : (
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
export default InviteFollowerUser