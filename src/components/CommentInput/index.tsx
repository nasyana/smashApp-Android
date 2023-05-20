import {
   View,
   Text,
   KeyboardAvoidingView,
   Platform,
   Keyboard,
} from 'react-native';
import React from 'react';
import { TextInput } from 'react-native-gesture-handler';
import AnimatedView from 'components/AnimatedView';
import { TouchableOpacity } from 'react-native-ui-lib';
import Firebase from 'config/Firebase';
import * as Haptics from 'expo-haptics';
import { sendNotification } from 'services/NotificationsService';
// import { uniqueId } from 'lodash';
import { NotificationType } from 'constants/Type';
import { inject, observer } from 'mobx-react';
import ImageUpload from 'helpers/ImageUpload';
import firebase from 'firebase';
function CommentInput({
   smashStore,
   notificatonStore,
}: {
   post: any;
   smashStore: any;
}) {
   const [focus, setFocus] = React.useState(false);
   const [text, setText] = React.useState('');
   const { currentStory,currentUserId } = smashStore;
   const post = currentStory;
   const commentId = ImageUpload.uid();
   const send = async () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const { uid } = Firebase.auth.currentUser;

      Keyboard.dismiss();

      if (text.trim() === '') {
         return;
      }

      const newComment = {
         text: text,
         id: commentId,
         uid,
         timestamp: Date.now() / 1000,
         postId: post.id,
         postOwner: post.uid,
         postType: post?.type || 'smash',
         commentOwnerName: smashStore?.currentUser?.name || 'noname',
         picture: smashStore.currentUser.picture,
      };

      const postRef = Firebase.firestore
         .collection('posts')
         .doc(currentStory.id);
      postRef
         .collection('comments')
         .doc(commentId)
         .set(newComment)
         .then(() => {
            postRef.set({
               commentCount: firebase.firestore.FieldValue.increment(1),
            });
         });
      setText('');

      const userSnap = await Firebase.firestore
         .collection('users')
         .doc(currentStory.uid)
         .get();
      const userData = userSnap.data();
      //////
      const { currentUser } = smashStore;
      let title = `${currentUser.name} commented on ${currentStory.type == "challengeStreak" ? ' your streak' : ' your story' + currentStory.activityName})`;

      const isNotMe = post.uid != Firebase.auth.currentUser.uid;
      //PushNotification
      if (
         userData.expoPushToken &&
         currentUserId != Firebase.auth.currentUser.uid
      ) {
         const body = {
            to: userData.expoPushToken,
            sound: 'default',
            title: title,
            subtitle: text,
            data: { postId: currentStory.id },
         };
         sendNotification(body);
      }

      //In App Notification
      const notiDoc = {
         causeUser: Firebase.auth.currentUser.uid,
         causeUserPicture: currentUser?.picture || {},
         receiverUser: post.uid,
         timestamp: Date.now(),
         type: 'comment',
         itemType: currentStory.type,
         title,
         subtitle: '',
         itemId: post.id,
         storyPicture: currentStory?.picture || {},
      };

      if (isNotMe) {
         notificatonStore.addNewNotificationDoc(notiDoc);
         notificatonStore.incrementNotificationCounter(
            NotificationType.Activity,
            post.uid,
         );
      }
   };

   return (
      <KeyboardAvoidingView
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
         style={{
            zIndex: 19,
            position: 'absolute',
            bottom: 12,
            left: 0,
            right: 0,
         }}>
         <View
            style={{
               borderWidth: 0,
               borderColor: '#fff',
               width: '100%',
               padding: 20,
               flexDirection: 'row',
               zIndex: 99999999,
            }}>
            <TextInput
               onFocus={() => setFocus(true)}
               onBlur={() => setFocus(false)}
               value={text}
               onChangeText={(text) => setText(text)}
               style={{
                  borderWidth: 1,
                  borderColor: '#fff',
                  height: 40,
                  color: '#fff',
                  borderRadius: 10,
                  paddingLeft: 15,
                  flex: 4,
               }}
               placeholder="Send Message"
               placeholderTextColor="#fff"
            />
            {text.length > 0 && (
               <AnimatedView delay={100} duration={300}>
                  <TouchableOpacity onPress={send} style={{ flex: 1 }}>
                     <Text style={{ color: '#fff', padding: 10 }}>Send</Text>
                  </TouchableOpacity>
               </AnimatedView>
            )}
         </View>
      </KeyboardAvoidingView>
   );
}

export default inject('smashStore', 'notificatonStore')(observer(CommentInput));
