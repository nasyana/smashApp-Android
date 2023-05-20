import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { View, Text, Colors, Assets, Image } from "react-native-ui-lib";
import { inject, observer } from 'mobx-react';
import { formatDistanceToNow } from "date-fns";
import SmartImage from '../../components/SmartImage/SmartImage';
import Firebase from 'config/Firebase'
const Activity = (props) => {
   const { notificatonStore, smashStore } = props;
   const { currentUser } = smashStore;

   const [notifications, setNotifications] = useState([])



   const data = notifications


   useEffect(() => {
  
      const {uid} = Firebase.auth.currentUser;
      const queryArray = ['like','comment']
      const unSub = Firebase.firestore.collection('Notifications')
      // .where('timestamp', '>', weekAgoUnix)
      .where('receiverUser', '==', uid)
      .where('type','in',queryArray)
      .limit(30)
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


   const pressImage = (item) => {
// console.log('item',item)
//       return

      smashStore.setCurrentStory({ id: (item.itemId || 'nada2'), picture: item.itemPicture,like: 0, commentCount: 1, comments: 1 });
      // smashStore.stories = [{ id: (item.itemId || 'nada2'), picture: item.itemPicture }];
      // smashStore.storyIndex = 0;
      // smashStore.loadAndSetUserStories(
      //    currentUser.uid,
      //    false,
      //    [{ id: item.itemId, picture: item.itemPicture }],
      //    item.itemId,
      // );
   };
   return (
      <View flex>
         <FlatList
            ListEmptyComponent={
               <Text R14 color6D center marginT-32>
                  Oops! No Activity Yet.
               </Text>
            }
            renderItem={({ item, index }) => {
               const hearts = [];

               const count = item.count || 1;

               for (let i = 0; i < count; i++) {
                  hearts.push(1);
               }

               return (
                  <TouchableOpacity
                     onPress={() => pressImage(item)}
                     style={{
                        marginHorizontal: 16,
                        marginBottom: 16,
                        borderRadius: 6,
                        backgroundColor: item.unread
                           ? Colors.grey80
                           : Colors.grey70,
                        flexDirection: 'row',
                        padding: 16,
                     }}>
                     <SmartImage
                        uri={item?.causeUserPicture?.uri}
                        preview={item?.causeUserPicture?.preview}
                        style={{ height: 50, width: 50, borderRadius: 60 }}
                     />

                     <View marginL-16 flex>
                        <Text H14 color28 marginB-0>
                           {item.title}{' '}
                           {hearts.length > 1 && hearts.map((heart) => '♥')}
                        </Text>
                        {item.itemName && (
                           <Text secondaryContent>
                              {item.multiplier && item.multiplier + ' x '}
                              {item.itemName}
                           </Text>
                        )}
                        <View row centerV>
                           <Image source={Assets.icons.ic_time_16} />
                           <Text R14 color6D marginL-4>
                              {formatDistanceToNow(item.timestamp)} ago
                           </Text>
                        </View>
                     </View>
                     {(item?.itemPicture || item?.picture) && (
                        <SmartImage
                           uri={item?.itemPicture?.uri || item?.picture?.uri}
                           preview={
                              item?.itemPicture?.preview ||
                              item?.picture?.preview
                           }
                           style={{
                              height: 50,
                              width: 50,
                              borderRadius: 3,
                           }}
                        />
                     )}
                  </TouchableOpacity>
               );
            }}
            data={notifications}
            keyExtractor={(item, index) => item.id.toString()}
            contentContainerStyle={{
               paddingTop: 16,
            }}
         />
      </View>
   );
};
export default inject('notificatonStore', 'smashStore')(observer(Activity)); 
