import {
   useCallback,
   useEffect,
   useMemo,
   useRef
} from 'react';
import {
   StyleSheet, Platform
} from 'react-native';
// import BottomSheet from '@gorhom/bottom-sheet';
import { Colors } from 'react-native-ui-lib';


import { inject, observer } from 'mobx-react';
import ImageUpload from 'helpers/ImageUpload';
import * as Haptics from 'expo-haptics';
import { sendNotification } from 'services/NotificationsService';
import { NotificationType } from 'constants/Type';
import firebaseInstance from 'config/Firebase';
import { doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";
const firestore = firebaseInstance.firestore;
// import CustomBackdrop from './CustomBackdrop';
import BottomSheet, {
   BottomSheetBackdrop,
   BottomSheetView
} from '@gorhom/bottom-sheet';
import { width } from 'config/scaleAccordingToDevice';

import CoolInput from './CoolInput';
import BottomSheetFlatListComponent from './BottomSheetFlatListComponent';
const isAndroid = Platform.OS === 'android';
export const addComment = (postId, createdBy, text) => {
   //body
   const comment = {
      text,
      postId,
      createdBy,
      timestamp: parseInt(Date.now() / 1000),
   };
};

const data = [
   {
      text: 'awesome!',
      id: 'asdsa',
      url: 'https://cdn.vox-cdn.com/thumbor/HME6YC8484Vf48wW0vz9AGRNa3c=/0x0:4200x2600/1200x0/filters:focal(0x0:4200x2600):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/9490719/thor_big.jpg',
   },
   {
      text: 'awesome!',
      id: 'asdssa',
      url: 'https://cdn.vox-cdn.com/thumbor/HME6YC8484Vf48wW0vz9AGRNa3c=/0x0:4200x2600/1200x0/filters:focal(0x0:4200x2600):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/9490719/thor_big.jpg',
   },
];

const CommentsModal = ({ smashStore, notificatonStore, storyComments = false, feedComments = false }) => {
   const bottomSheetRef = useRef<BottomSheet>(null);
   const { commentPost } = smashStore;

   const thePost = commentPost;

   const isJournal = commentPost?.journal  || false;
   
   useEffect(() => {
      smashStore.commentsModalRef = bottomSheetRef;

      return () => {};
   }, [bottomSheetRef]);

   const snapPoints = useMemo(() => [isJournal ? '65%' : '45%'], [isJournal]);
   // callbacks
   const handleSheetChanges = useCallback((index) => {
      
   }, []);


 



   /////////SEND
   const send = async () => {
      const { coolComment = false, setCoolComment } = smashStore;


      const commentId = ImageUpload.uid();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const { uid } = firebaseInstance.auth.currentUser;


      let idTags = [uid];

      if(commentPost?.id){idTags.push(commentPost?.id)}
      if(commentPost?.activityMasterId){idTags.push(commentPost?.activityMasterId)}
      if(commentPost?.activityMasterId){idTags.push(commentPost?.activityMasterId)}
      if(commentPost?.baseActivityId){idTags.push(commentPost?.baseActivityId)}
      if(commentPost?.dayKey){idTags.push(commentPost?.dayKey)}

      // if(commentPost?.challengeIds){idTags = [...idTags, ...commentPost?.challengeIds]}

      // if(commentPost?.inTeam){idTags = [...idTags, ...commentPost?.inTeam]}

      const newComment = {
         text: coolComment,
         id: commentId,
         uid,
         idTags,
         activityMasterId: commentPost?.activityMasterId || false,
         baseActivityId: (commentPost?.baseActivityId || false),
         dayKey: commentPost?.dayKey || false,
         primaryId: thePost?.id || false,
         timestamp:parseInt(Date.now() / 1000),
         postId: thePost.id || false,
         postOwner: uid,
         postType: thePost?.type || 'smash',
         commentOwnerName: smashStore?.currentUser?.name || 'noname',
         picture: smashStore.currentUser.picture,
      };

  
      // console.log('newComment', newComment);
      // return;

      const postRef = doc(firebaseInstance.firestore, 'posts', thePost.id);

      if (smashStore.replyComment) {

         console.log('smashStore.replyComment',smashStore.replyComment)
         setDoc(doc(postRef, 'comments', smashStore.replyComment.id, 'replies', commentId), newComment, { merge: true })
            .then(() => {
               updateDoc(doc(postRef, 'comments', smashStore.replyComment.id), { commentCount: increment(1) });
            });
      } else if (commentPost?.journal) {
         const journalRef = doc(firebaseInstance.firestore, 'journals', commentId);
         setDoc(journalRef, newComment,{ merge: true })
            .then(() => {
               if (commentPost.type == 'smash') {
                  updateDoc(doc(postRef, commentPost.id), { journalCount: increment(1) });
               }
            });
      } else {
         setDoc(doc(postRef, 'comments', commentId), newComment, { merge: true })
            .then(() => {
               setDoc(postRef, { commentCount: increment(1) }, { merge: true });
            });
      }
   
      const userToSendNotificationTo =
         smashStore?.replyComment?.uid || thePost?.uid;
    
      // setTimeout(() => scrollFlatlist(), 300);

      const userSnap = await getDoc(doc(firestore, 'users', userToSendNotificationTo));
      const userData = userSnap.data();
      
      //////
      const { currentUser } = smashStore;

      const isStreak = thePost?.type == "challengeStreak";

      let title = `${currentUser?.name} commented on ${isStreak ? `your ${thePost?.name || 'challenge'} ${thePost?.streak} day streak` : ' your story ' + (thePost?.activityName || '')}`;

      if (smashStore.replyComment) {
         title = `${currentUser.name} replied on your comment`;
      }
      const isNotMe = thePost.uid != firebaseInstance.auth.currentUser.uid;
      //PushNotification
      if (userData?.expoPushToken && isNotMe) {
         let body = {
            to: userData.expoPushToken,
            sound: 'default',
            title: title,
            // subtitle: isStreak ? thePost?.name : null,
            body: smashStore?.replyComment?.text || coolComment || isStreak ? (coolComment || false) : false,
            data: {
               postId: smashStore?.replyComment?.postId || thePost.id,
            },
         };

         if (isStreak) {
            body = {
               to: userData.expoPushToken,
               sound: 'default',
               title: `${currentUser?.name} commented on your ${thePost?.name || 'challenge'} ${thePost?.streak} day streak`,
               subtitle: thePost?.name || 'challenge',
               body: smashStore?.replyComment?.text || coolComment || isStreak ? (coolComment || false) : false,
               data: {
                  postId: smashStore?.replyComment?.postId || thePost.id,
               },
            };

         }

       

         if(!isJournal){

            sendNotification(body);
         }

         smashStore.setReplyComment(false);
         setCoolComment('');
        
      }


      //In App Notification
      const notiDoc = {
         causeUser: firebaseInstance.auth.currentUser.uid,
         causeUserPicture: currentUser?.picture || {},
         receiverUser: thePost.uid,
         timestamp: parseInt(Date.now() / 1000),
         type: 'comment',
         itemType: thePost.type,
         title,
         comment: coolComment || false,
         subtitle: thePost.name || false,
         itemId: thePost.id,
         storyPicture: thePost?.picture || {},
      };

      if (isNotMe && !isJournal) {
         notificatonStore.addNewNotificationDoc(notiDoc);
         notificatonStore.incrementNotificationCounter(
            NotificationType.Activity,
            thePost.uid,
         );
      }

      setCoolComment('');
   
   };

   // if (!smashStore.currentStory && !smashStore.commentPost) {
   //    return null;
   // }




   // setLoaded 500 after useEffect load




   const renderBackdrop = useCallback(
      (props) => (
         <BottomSheetBackdrop
            {...props}
            pressBehavior="close"
            disappearsOnIndex={3}
            appearsOnIndex={-1}
            enableTouchThrough={false}
         />
      ),
      [],
   );

   const onClose = () => {
      smashStore.setCommentPost(false);
      smashStore.showCommentsModal = false;
      bottomSheetRef.current?.close();
  }
   const visible = feedComments && commentPost.isFeedPost || storyComments && commentPost.isStoryPost || false;
   
// if(!commentPost){return null}
   
   return (
      <BottomSheet

      handleStyle={isJournal ? {backgroundColor: Colors.$backgroundGeneralLight, borderRadius: 10} : {backgroundColor: '#fff', borderRadius: 10}}
         enablePanDownToClose
         ref={bottomSheetRef}
         onClose={() => {
            smashStore.setCommentPost(false);
            smashStore.showCommentsModal = false;
         }}
         index={visible ? 0 : -1}
         snapPoints={snapPoints}
         // CustomBackdrop={CustomBackdrop}
         
         // backdropComponent={renderBackdrop}
         onChange={handleSheetChanges}
         handleHeight={50}
         keyboardBehavior="interactive"
         keyboardBlurBehavior="restore">
         <BottomSheetView style={[styles.contentContainer,{backgroundColor: isJournal ? Colors.$backgroundGeneralLight : '#fff'}]}>
           
    {visible && <BottomSheetFlatListComponent {...{bottomSheetRef, isJournal, onClose}} postId={thePost.id}  />}

           
            <CoolInput send={send} isJournal={commentPost?.journal} placeholder={commentPost?.journal ? 'Write in journal' : 'Add comment'} />
         </BottomSheetView>
      </BottomSheet>
   );
};;

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
)(observer(CommentsModal));
