import { View, Text } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState, useRef } from 'react';
import {
   TouchableOpacity,
   TouchableWithoutFeedback,
   PanResponder,
} from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { Modal } from 'react-native';
import SmartImage from 'components/SmartImage/SmartImage';
import { width, height } from 'config/scaleAccordingToDevice';
import { doc, onSnapshot } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";

import { LightenDarkenColor } from 'lighten-darken-color';
import SmartVideo from 'components/SmartImage/SmartVideo';
import firebaseInstance from 'config/Firebase';
import firebase from 'firebase';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedView from 'components/AnimatedView';
import { Vibrate } from 'helpers/HapticsHelpers';

const StoryLike = ({ smashStore }) => {
   const {
      postLike,
      userStoriesHash,
      currentUserId,
      currentStory,
      manualSetUserStoriesHash,
   } = smashStore;

 
   const { id } = currentStory;

   const storyToRender = userStoriesHash?.[currentStory.id] || false;
   const [thePost, setPost] = useState(false);

   const [likesCount, setLikesCount] = useState(0);

   const [likes, setLikes] = useState([]);
const [commentCount, setCommentCount] = useState(0);
const post = thePost || storyToRender;

useEffect(() => {
   const unsubToStory = onSnapshot(doc(firebaseInstance.firestore, "posts", id), (snap) => {
      const storyDoc = snap.data();
  
      if (storyDoc) {
        setPost(storyDoc);
        setLikes(storyDoc.likes || []);
        setLikesCount(storyDoc.like || false);
        setCommentCount(storyDoc.commentCount || false);
      }
  
      if (!storyToRender) {
        manualSetUserStoriesHash(storyDoc);
      }
    });
  
 

   return () => {
      if (unsubToStory) {
         unsubToStory();
      }
   };
}, [storyToRender?.like, storyToRender?.commentCount, currentStory.id]);

const haveLiked = likes?.includes(currentUserId);
const handleLike = () => {
   Vibrate();
   postLike(post);
};

return (
   <TouchableOpacity
   onPress={handleLike}
   style={{backgroundColor: 'transparent', borderRadius: 40, padding: 10}}>
   {haveLiked ? (
      <AnimatedView style={{ flexDirection: 'row' }}>
         <AntDesign name={'rocket1'} size={35} color={'red'} />
         <AnimatedView style={{position: 'absolute'}}>
            <Text white>{likesCount || ' '}</Text>
         </AnimatedView>
      </AnimatedView>
   ) : (
      <AnimatedView style={{ flexDirection: 'row' }}>
            <AntDesign name={'rocket1'} size={35} color={'white'} />
         <AnimatedView style={{position: 'absolute'}}>
            <Text white>{likesCount || ' '}</Text>
         </AnimatedView>
      </AnimatedView>
   )}
</TouchableOpacity>
);
return (
   <View
      style={{
         position: 'absolute',
         bottom: height / 3,
         right: 16,
         alignItems: 'center',
      }}>
      <TouchableOpacity
         onPress={handleLike}
         style={{ alignItems: 'center', marginBottom: 16 }}>
         {haveLiked ? (
            <AnimatedView>
               <AntDesign name={'heart'} size={35} color={'red'} />
            </AnimatedView>
         ) : (
            <AntDesign
               name={'hearto'}
               size={35}
               color={'#fff'}
               style={{ opacity: 0.7 }}
            />
         )}
         <AnimatedView>
            <Text white>{likesCount || ' '}</Text>
         </AnimatedView>
      </TouchableOpacity>

      {/* <TouchableOpacity
         onPress={() => (smashStore.showCommentsModal = true)}
         style={{ alignItems: 'center' }}>
         <AntDesign
            name={'wechat'}
            size={35}
            color={'#fff'}
            style={{ opacity: commentCount > 0 ? 1 : 0.7 }}
         />
         <Text white>{commentCount || ''}</Text>
      </TouchableOpacity> */}
   </View>
);
};

export default React.memo(
   inject('smashStore', 'challengeArenaStore')(observer(StoryLike)),
);