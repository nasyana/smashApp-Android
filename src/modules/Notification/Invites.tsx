import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { View, Text, Colors, Assets, Image, Button } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import { formatDistanceToNow } from 'date-fns';
import SmartImage from '../../components/SmartImage/SmartImage';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../config/Routes';
import { NotificationType } from 'constants/Type';
import Firebase from 'config/Firebase';
import AnimatedView from 'components/AnimatedView';

const Invites = (props) => {
   const { notificatonStore, smashStore } = props;
   const { currentUser = {} } = smashStore;
   const {uid} = Firebase.auth.currentUser;
   const [notifications, setNotifications] = useState([])

   const data = notifications


   useEffect(() => {
  

      const queryArray = ['invite','followRequest']
      const unSub = Firebase.firestore.collection('Notifications')
      // .where('timestamp', '>', weekAgoUnix)
      .where('receiverUser', '==', uid)
      .where('type','in',queryArray)
      .limit(20)
      .orderBy('timestamp', 'desc')
      .onSnapshot(
         async (snaps) => {
            let notifications = [];
            snaps.forEach((noti) => {
               if (noti.exists) {
                  const notificaionData = noti.data();
                  notifications.push({ ...notificaionData, id: noti.id });
               }
            });

           setNotifications(notifications);
         },
         (error) => {
            console.log('Error in Notifications', error);
         },
      );
   
     return () => {
       if(unSub){unSub()}
     }
   }, [])
   
   const { navigate } = useNavigation();
   const goToInvite = (goToItem) => {
      const team = goToItem?.teamData || false;
      if (team) {
         Firebase.firestore
            .collection('teams')
            .doc(team.id)
            .get()
            .then((snap) => {
               if (snap.exists) {
                  if (snap.data()?.active) {
                     navigate(Routes.TeamArena, { team: snap.data() });
                  } else {
                     alert('Oops Team is not active anymore...');
                  }
               } else {
                  alert('Oops team does not exist anymore!');
               }
            });
      } else {
         navigate(Routes.ChallengeArena, { challenge });
      }
   };

   const onAccept = (...params) => {
      smashStore.acceptFollow(...params);
   };

   const goToProfile = (user) => {
      navigate(Routes.MyProfileHome, { user });
   };

   return (
      <View flex>
         <FlatList
            ListEmptyComponent={
               <Text R14 color6D center marginT-32>
                  Oops! No Requests Yet.
               </Text>
            }
            renderItem={({ item, index }) => {

               const goToItem = item;
               return (
                  <TouchableOpacity
                     style={{
                        marginHorizontal: 16,
                        marginBottom: 16,
                        borderRadius: 6,
                        backgroundColor: item.unread
                           ? Colors.grey80
                           : Colors.grey70,
                        flexDirection: 'row',
                        padding: 16,
                     }}
                     onPress={() =>
                        item.type === 'followRequest'
                           ? goToProfile({ uid: item?.causeUser })
                           : goToInvite(goToItem)
                     }>
                     <SmartImage
                        uri={item?.causeUserPicture?.uri}
                        preview={item?.causeUserPicture?.preview}
                        style={{ height: 50, width: 50, borderRadius: 60 }}
                     />

                     <View marginL-16 flex>
                        <Text H14 color28 marginB-8>
                           {item.title}
                        </Text>

                        <View row centerV>
                           <Image source={Assets.icons.ic_time_16} />
                           <Text R14 color6D marginL-4>
                              {formatDistanceToNow(item.timestamp)} ago
                           </Text>
                        </View>
                     </View>
                     {item.type !== 'followRequest' &&
                        item?.teamData?.picture?.uri && (
                           <SmartImage
                              uri={item?.teamData?.picture?.uri}
                              preview={item?.teamData?.picture?.preview}
                              style={{ height: 50, width: 50, borderRadius: 6 }}
                           />
                        )}
                     {item.type === 'followRequest' && (
                        <Button
                           onPress={() => {
                              onAccept(
                                 item?.causeUser,
                                 item?.causeUserName,
                                 item?.causeUserPicture,
                                 item?.id,
                              );
                           }}
                           size="small"
                           outline={true}
                           style={{
                              borderRadius: 5,
                              height: 30,
                              alignSelf: 'center',
                           }}>
                           <Text>
                              {currentUser?.followers?.includes(item?.causeUser)
                                 ? 'Accepted'
                                 : 'Accept'}
                           </Text>
                        </Button>
                     )}
                  </TouchableOpacity>
               );
            }}
            data={data}
            keyExtractor={(item, index) => item.id.toString()}
            contentContainerStyle={{
               paddingTop: 16,
            }}
         />
      </View>
   );
};

export default inject('notificatonStore', 'smashStore')(observer(Invites));
