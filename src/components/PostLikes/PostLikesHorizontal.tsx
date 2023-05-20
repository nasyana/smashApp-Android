import React, { useEffect, useState } from 'react';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Colors, Text, TouchableOpacity } from 'react-native-ui-lib';
import { sendNotification } from 'services/NotificationsService';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import { inject, observer } from 'mobx-react';
import { Vibrate } from 'helpers/HapticsHelpers';
import { doc, onSnapshot } from 'firebase/firestore';
const PostLikesHorizontal = (props: any) => {
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
      const unsubToStory = onSnapshot(doc(firestore, 'posts', post.id), (snap) => {
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
    }, [ post.id, setLikes, setLikeCount, setPost]);


   // useEffect(() => {
   //    const unsubToStory = firestore
   //      .collection('posts')
   //      .doc(post.id)
   //      .onSnapshot((snap) => {
   //        const storyDoc = snap.data();
    
   //        if (storyDoc) {
   //          setLikes(storyDoc?.likes || []);
   //          setLikeCount(storyDoc.like);
   //          setPost(storyDoc);
   //        }
   //      });
    
   //    return () => {
   //      if (unsubToStory) {
   //        unsubToStory();
   //      }
   //    };
   //  }, [setLikes, setLikeCount, setPost, post.id]); 
    

   const haveLiked = currentUserId ? likes?.includes(currentUserId) : false;

   return (
      <TouchableOpacity onPress={handleLike} row centerV>
         <FontAwesome
            name={'rocket'}
            size={20}
            color={haveLiked ? Colors.smashPink : Colors.grey50}
         />
         <Text R14 center marginL-8 grey30>
            {likeCount > 0 ? (`${likeCount} ${likeCount == 1 ? 'rocket' : 'rockets'}` || 0) : 'Rockets!!'}
         </Text>
      </TouchableOpacity>
   );
};;

export default inject('smashStore')(observer(PostLikesHorizontal));
