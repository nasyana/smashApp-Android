import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { View, Text, Colors, Assets, Image } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import { formatDistanceToNow } from 'date-fns';
import SmartImage from '../../components/SmartImage/SmartImage';
import firebaseInstance from 'config/Firebase';
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/native';
import SmartVideo from 'components/SmartImage/SmartVideo';
import SocialNotification from './SocialNotification';
import FollowNotification from './FollowNotification';
import { FlashList } from "@shopify/flash-list";
import ButtonLinear from 'components/ButtonLinear';
import { collection, query, where, getDocs, updateDoc,doc,getDoc } from 'firebase/firestore';

const All = (props) => {
   const { navigate } = useNavigation();
   const { notificatonStore, smashStore, challengesStore } = props;
   const { currentUser } = smashStore;
   const {goalHashByGoalId} = challengesStore
   const {myNotifications} = notificatonStore



   /// function to mark all notifications as read
   const markAllNotifications = async () => {
      const { uid } = firebaseInstance.auth.currentUser;
      const notiRef = collection(firebaseInstance.firestore, 'Notifications');
      const notiQuery = query(notiRef, where('receiverUser', '==', uid), where('unread', '==', true));
      getDocs(notiQuery).then((snapshot) => {
        snapshot.forEach((doc) => {
          const notiDocRef = doc.ref;
          updateDoc(notiDocRef, { unread: false });
        });
      });


       

   }


   const pressImage = (item: any) => {

      // console.warn('item', item)
      // return

      if(item.goalId){
            // alert(item.goalId)
         navigate(Routes.GoalArena, { goalDoc: goalHashByGoalId?.[item?.goalId] || { id: item.goalId } });
         return
      }
      if (item.type) {

         // console.warn(item.type);

         notificatonStore.resetNotificationCount(item.type)
      }
      if (!item.itemId) { return }

      if (item.playerChallengeId) {

         navigate(Routes.ChallengeArena, { challenge: { id: item.itemId } });


      } else {

         navigate(Routes.SinglePost, { postId:item.itemId });
         // smashStore.setCurrentStory({
         //    id: item.itemId || 'nada2',
         //    picture: item?.itemPicture,
         //    like: 0,
         //    commentCount: 1,
         //    comments: 1,
         // });
      }


      item?.unread && updateReadNotification(item, 'activity');

      // smashStore.stories = [{ id: (item.itemId || 'nada2'), picture: item.itemPicture }];
      // smashStore.storyIndex = 0;
      // smashStore.loadAndSetUserStories(
      //    currentUser.uid,
      //    false,
      //    [{ id: item.itemId, picture: item.itemPicture }],
      //    item.itemId,
      // );
   };

   const updateReadNotification = (item: any, type: string) => {
      updateDoc(doc(collection(firebaseInstance.firestore, "Notifications"), item?.id), {
         unread: false
       })
         .then((snap: any) => {
           notificatonStore.decrementNotificationCounter(type, currentUser?.id);
         });
   };

   const goToInvite = (goToItem) => {
      const team = goToItem?.teamData || false;
      if (team) {
         getDoc(doc(collection(firebaseInstance.firestore, 'teams'), team.id)).then((snap) => {
            if (snap.exists()) {
               if (snap.data().active) {
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
   const hasUnreads = myNotifications.some((item) => item.unread);
   
   return (
      <View flex>

         <FlashList
    estimatedItemSize={91} 
            ListHeaderComponent={
               hasUnreads ? <View row spread padding-16 paddingV-8><View /><TouchableOpacity onPress={markAllNotifications}><Text smashPink>Mark all as read</Text></TouchableOpacity></View> : () => null}
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

               if (item.type === 'invite') {
                  
                  const goToItem = item;
                  return (
                     <TouchableOpacity
                        style={{
                           marginHorizontal: 16,
                           marginBottom: 16,
                           borderRadius: 6,
                           backgroundColor: item?.unread
                              ? Colors.grey60
                              : Colors.grey80,
                           flexDirection: 'row',
                           padding: 16,
                        }}
                        onPress={() => {


                           item?.unread &&
                              updateReadNotification(item, 'invite');

                           item.type === 'followRequest'
                              ? goToProfile({ uid: item?.causeUser })
                              : goToInvite(goToItem);
                        }}>
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
                                 style={{
                                    height: 50,
                                    width: 50,
                                    borderRadius: 6,
                                 }}
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
                                 {currentUser?.followers?.includes(
                                    item?.causeUser,
                                 )
                                    ? 'Accepted'
                                    : 'Accept'}
                              </Text>
                           </Button>
                        )}
                     </TouchableOpacity>
                  );
               }

               if (item.type == 'follow') {

                  return (<FollowNotification

                     notificatonStore={notificatonStore}
                     item={item}
                     hearts={hearts}
                     pressImage={pressImage}
                     updateReadNotification={updateReadNotification}
                  />)

               }

               // return <View />
               return (
                  <SocialNotification
                     item={item}
                     hearts={hearts}
                     pressImage={pressImage}
                     isCelebration={item?.itemType == 'challengeStreak'}
                  />
               );
            }}
            data={myNotifications}
            keyExtractor={(item, index) => item?.id ? item?.id.toString() : index + 'N'}
            contentContainerStyle={{
               paddingTop: 16,
            }}
         />
      </View>
   );
};
export default inject('notificatonStore', 'smashStore', 'challengesStore')(observer(All));
