import React, {
   useCallback,
   useEffect,
   useMemo,
   useRef,
   useState,
} from 'react';
import {
   Keyboard,
   StyleSheet,
   Platform,
} from 'react-native';
import {
   doc,
   collection,
   setDoc,
   updateDoc,
   increment,
   getDoc
 } from "firebase/firestore";
import {
   TouchableOpacity,
} from '@gorhom/bottom-sheet';
import { View, Text } from 'react-native-ui-lib';
import { commentListener } from './commentService';
import CommentItem from './CommentItem';
import { inject, observer } from 'mobx-react';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import ImageUpload from 'helpers/ImageUpload';
// import firebase from 'firebase';
import * as Haptics from 'expo-haptics';
import { sendNotification } from 'services/NotificationsService';
import { NotificationType } from 'constants/Type';

import BottomSheet, {
   BottomSheetFlatList,
   BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { width, height } from 'config/scaleAccordingToDevice';
import LottieAnimation from 'components/LottieAnimation';
import CoolInput from './CoolInput';
export const addComment = (postId, createdBy, text) => {
   //body
   const comment = {
      text,
      postId,
      createdBy,
      timestamp: Date.now(),
   };
   alert('comment created');
   //firebase stuff
};


const StoryCommentsModal = ({ smashStore, notificatonStore }) => {
   const bottomSheetRef = useRef(false);
   const { currentStory, currentUser, commentPost } = smashStore;
   const visible = (smashStore.showCommentsModal && currentStory) || false;
   const thePost = currentStory;
   const postId = currentStory?.id || false;

   useEffect(() => {
      smashStore.StorycommentsModalRef = bottomSheetRef;

      return () => {};
   }, [smashStore.showCommentsModal]);


   const snapPoints = useMemo(() => ['45%'], []);
   // callbacks
   const handleSheetChanges = useCallback((index) => {
     
   }, []);

   //from here
   const [comment, setComment] = useState('');
   const [commentList, setCommentList] = useState('');

   useEffect(() => {
      if(!visible){return}
      const unsub = postId
         ? commentListener(postId, setCommentList)
         : () => null;

      return unsub;
   }, [postId,visible]);

   const renderItem = ({ item }) => <CommentItem item={item} />;

   /////////SEND
   const send = async () => {
      const { coolComment, setCoolComment } = smashStore;
      const commentId = ImageUpload.uid();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const { uid } = firebaseInstance.auth.currentUser;
   

      const newComment = {
         text: coolComment,
         id: commentId,
         uid,
         timestamp: Date.now() / 1000,
         postId: thePost.id,
         postOwner: thePost.uid,
         postType: thePost?.type || 'smash',
         commentOwnerName: smashStore?.currentUser?.name || 'noname',
         picture: smashStore.currentUser.picture,
      };
      // console.log('newComment', newComment);
      // return;

      const postRef = doc(collection(firestore, "posts"), thePost.id);

      if (smashStore.replyComment) {
        const replyCommentRef = doc(
          postRef,
          "comments",
          smashStore.replyComment.id,
          "comments",
          commentId
        );
        setDoc(replyCommentRef, newComment).then(() => {
          updateDoc(postRef, {
            commentCount: increment(1),
          });
        });
      } else {
        const commentRef = doc(postRef, "comments", commentId);
        setDoc(commentRef, newComment).then(() => {
          updateDoc(postRef, {
            commentCount: increment(1),
          });
        });
      }
      
   
      setCoolComment('');

      const userToSendNotificationTo =
         smashStore?.replyComment.uid || thePost.uid;
      Keyboard.dismiss();
      setTimeout(() => scrollFlatlist(), 800);

      const userDocRef = doc(firestore, "users", userToSendNotificationTo);
      const userSnap = await getDoc(userDocRef);
      const userData = userSnap.data();
      //////
      const { currentUser } = smashStore;
      let title = `${currentUser.name} commented on ${thePost.type == "challengeStreak" ? 'streak' : ' your story' + thePost.activityName})`;

      if (smashStore.replyComment) {
         title = `${currentUser.name} replied on your comment`;
      }
      const isNotMe = thePost.uid != firebaseInstance.auth.currentUser.uid;
      //PushNotification
      if (userData.expoPushToken && isNotMe) {
       

         const body = {
            to: userData.expoPushToken,
            sound: 'default',
            title: title,
            subtitle: smashStore.replyComment?.text || comment,
            data: {
               postId: smashStore.replyComment?.postId || thePost.id,
            },
         };
         sendNotification(body);
      }
   
      //In App Notification
      const notiDoc = {
         causeUser: firebaseInstance.auth.currentUser.uid,
         causeUserPicture: currentUser?.picture || {},
         receiverUser: thePost.uid,
         timestamp: Date.now(),
         type: 'comment',
         itemType: thePost.type,
         title,
         subtitle: '',
         itemId: thePost.id,
         storyPicture: thePost?.picture || {},
      };

      if (isNotMe) {
         notificatonStore.addNewNotificationDoc(notiDoc);
         notificatonStore.incrementNotificationCounter(
            NotificationType.Activity,
            thePost.uid,
         );
      }
      smashStore.setReplyComment(false);
     
   };

   const flatlistRef = useRef();
   useEffect(() => {

      if(!visible){return}
      setTimeout(() => scrollFlatlist(), 1000);

      return () => {};
   }, [visible]);

   const cancelComment = () => {
      smashStore.setReplyComment(false);
   };

   const scrollFlatlist = () => {
      flatlistRef?.current?.scrollToEnd({ animating: true });
   };

   const renderBackdrop = useCallback(
      (props) => (
         <BottomSheetBackdrop
            {...props}
            // disappearsOnIndex={3}
            appearsOnIndex={0}
         />
      ),
      [],
   );

   const onClose = () => {
      smashStore.setCommentPost(false);
      smashStore.showCommentsModal = false;
      bottomSheetRef.current?.close();
   }


   const isAndroid = Platform.OS === 'android';

   return (
      <BottomSheet
         isVisible={visible}
         ref={bottomSheetRef}
         onClose={onClose}
         index={visible ? 0 : -1}
         snapPoints={snapPoints}
         backdropComponent={renderBackdrop}
         onChange={handleSheetChanges}
         handleHeight={40}
         keyboardBehavior="interactive"
         enablePanDownToClose
         keyboardBlurBehavior="restore"
      >
         <View style={styles.contentContainer}>
            <BottomSheetFlatList
               data={commentList || []}
               keyExtractor={(item) => item.id}
               ref={flatlistRef}
               renderItem={renderItem}
               ListHeaderComponent={isAndroid ? <View row spread paddingH-32><View /><TouchableOpacity onPress={onClose}><Text R14>Close</Text></TouchableOpacity></View> : () => null}
               // onContentSizeChange={() =>
               //    flatlistRef.current.scrollToEnd({ animated: true })
               // }
               // onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
               ListEmptyComponent={
                  <View paddingV-32 center>
                     <LottieAnimation
                        autoPlay
                        loop={true}
                        style={{
                           height: 100,
                           zIndex: 0,
                           top: 0,
                           left: 0,
                        }}
                        source={require('lottie/no-comments.json')}
                     />
                     <Text secondaryContent h3>
                        No Comments
                     </Text>
                     <Text secondaryContent>Be the first to comment</Text>
                  </View>
               }
            />

            {smashStore.replyComment && (
               <View
                  row
                  spread
                  style={{
                     borderTopWidth: 0.5,
                     borderColor: '#eee',
                     paddingTop: 10,
                     marginBottom: -10,
                  }}
                  paddingH-60>
                  <Text R12>
                     Replying to {smashStore.replyComment.commentOwnerName}"
                     {smashStore.replyComment.text}"
                  </Text>

                  <TouchableOpacity onPress={cancelComment}>
                     <Text R12 secondaryContent>
                        Cancel
                     </Text>
                  </TouchableOpacity>
               </View>
            )}
            <CoolInput send={send} />
         </View>
      </BottomSheet>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 24,
      backgroundColor: 'grey',
   },
   contentContainer: {
      flex: 1,
      justifyContent: 'flex-end',
   },
   containerInput: {
      padding: 10,
      flexDirection: 'row',
      width: width,
      justifyContent: 'space-between',
      alignItems: 'center',
      // borderWidth: 2,
   },
   image: {
      height: 32,
      width: 32,
      borderRadius: 32,
      marginRight: 8,
   },
   // input: {
   //    backgroundColor: 'lightgrey',
   //    flex: 1,
   //    borderRadius: 4,
   //    marginHorizontal: 10,
   //    paddingHorizontal: 10,
   // },
   input: {
      marginTop: 8,
      marginBottom: 10,
      borderRadius: 20,
      fontSize: 14,
      height: 40,
      // lineHeight: 20,
      padding: 8,
      backgroundColor: 'rgba(151, 151, 151, 0.15)',
      flex: 1,
   },
});

export default inject(
   'smashStore',
   'notificatonStore',
)(observer(StoryCommentsModal));
