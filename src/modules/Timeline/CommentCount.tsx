
import React, { useEffect } from 'react'
import { inject, observer } from 'mobx-react';
import {
    View,
    Colors,
    Image,
    Assets,
    Text,
    TouchableOpacity,
 } from 'react-native-ui-lib';
 import { doc, getDoc,onSnapshot } from "firebase/firestore";
 import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import firebaseInstance from 'config/Firebase';
const CommentCount = ({isFollowingMe, item, showCommentsModal}) => {

    const [commentCount, setCommentCount] = React.useState(item?.commentCount);

    useEffect(() => {
        const postRef = doc(firebaseInstance.firestore, "posts", item.id);
        const unsubscribe = onSnapshot(postRef, (postSnap) => {
          if (postSnap.exists()) {
            const postData = postSnap.data();
            const newCommentCount = postData.commentCount;
            if(parseInt(commentCount) != parseInt(newCommentCount)){

               setCommentCount(newCommentCount || 0);
            }
         
          }
        });
      
        return () => unsubscribe();
      }, []);
      
    
    
   if(isFollowingMe) {return (
        <TouchableOpacity onPress={showCommentsModal} paddingV-16 row centerV marginR-16>
           <FontAwesome name='comment' style={{ color: Colors.grey50 }} size={20} />
           <Text right R14 marginL-8 grey30>
           {(commentCount &&
              `${commentCount} ${
                 commentCount == 1 ? 'Comment' : 'Comments'
              }`) ||
              'Write a comment'}{' '}
        </Text>
     </TouchableOpacity>
  )}else{
   
   return (
     <View style={{ height: 16 }} />
  )}
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(CommentCount));