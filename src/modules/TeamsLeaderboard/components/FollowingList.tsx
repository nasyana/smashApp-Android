import { width } from "config/scaleAccordingToDevice";
import React, { useState, useEffect } from "react";
import { FlatList, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Colors, Image, Assets, Text, Avatar, Button } from "react-native-ui-lib";
import Firebase from "../../../config/Firebase"
import { inject, observer } from 'mobx-react';
import SmartImage from "../....//components/SmartImage/SmartImage"
import PlayerImFollowing from "../components/PlayerImFollowing";
import InviteFollowerUser from "../components/InviteFollowerUser";

import moment from "moment";

const FollowingList = inject("smashStore", "challengeArenaStore", "challengesStore")(observer((props) => {


    const [following, setFollowing] = useState([]);

    const array = [1, 2, 3, 4]
    const {
       smashStore,
       goToProfile,
       challengeIsSingleActivity,
       challenge,
       showPlayerSmashes,
       close,
       challengesStore,
    } = props;

    const { kFormatter, currentUser, toggleInviteUser } = smashStore;

    const renderFollowingUser = ({ item, index }) => {
       const { like, invite, currentUser } = smashStore;
       if (!item) {
          return null;
       }
       return (
          <InviteFollowerUser
             item={item}
             index={index}
             {...{
                currentUser,
                toggleInviteUser,
                challengesStore,
                challenge,
                like,
                invite,
                goToProfile,
                kFormatter,
                challengeIsSingleActivity,
                showPlayerSmashes,
             }}
          />
       );
    };

    const { uid } = currentUser;

   useEffect(() => {
      const unsubscribeToPlayersImFollowing = Firebase.firestore
          .collection('users')
          .where('followers', 'array-contains', uid)
          .onSnapshot((snaps) => {
             if (!snaps.empty) {
                const playersImFollowingArray = [];

                snaps.forEach((snap) => {
                   const user = snap.data();

                   playersImFollowingArray.push(user);
                });

                setFollowing(playersImFollowingArray);
             }
          });

       return () => {
          if (unsubscribeToPlayersImFollowing) {
             unsubscribeToPlayersImFollowing();
          }
       };
    }, []);
    const visible = props.challengeArenaStore.challengeArenaIndex == 0;

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
})
);
export default FollowingList;
