import React, {useEffect, useState} from 'react';
import {AntDesign} from '@expo/vector-icons';
import {Colors, Text, TouchableOpacity} from 'react-native-ui-lib';
import {sendNotification} from 'services/NotificationsService';
import Firebase from 'config/Firebase';
import {inject, observer} from 'mobx-react';
import { Vibrate } from 'helpers/HapticsHelpers';
import { doc, onSnapshot } from 'firebase/firestore';
const PostLikes = (props: any) => {
   const { smashStore, post, hasImage } = props;

   const { currentUserId } = smashStore;

   const [_post, setPost] = useState(post);
   const handleLike = () => {
      Vibrate();

      smashStore.postLike(_post);
   };

   const [likes, setLikes] = useState([]);
   const [likeCount, setLikeCount] = useState(0);
   useEffect(() => {
      const storyDocRef = doc(Firebase.firestore, 'posts', post.id);
      const unsubToStory = onSnapshot(storyDocRef, (snap) => {
        const storyDoc = snap.data();
  
        if (storyDoc) {
          setLikes(storyDoc.likes || []);
          setLikeCount(storyDoc.like);
          setPost(storyDoc);
        }
      });
  
      return () => {
        if (unsubToStory) {
          unsubToStory();
        }
      };
    }, [post.like, post.commentCount, post.id]);

   const haveLiked = likes?.includes(currentUserId);

   return (
      <TouchableOpacity onPress={handleLike}>
         <AntDesign
            name={'heart'}
            size={30}
            color={haveLiked ? Colors.red20 : Colors.grey50}
         />
         <Text R14 center color28>
            {likeCount || 0}
         </Text>
      </TouchableOpacity>
   );
};;

export default inject('smashStore')(observer(PostLikes));
