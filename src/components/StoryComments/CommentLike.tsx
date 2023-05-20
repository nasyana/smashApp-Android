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
import StoryBarsTop from 'components/StoryBarsTop';
import StoryInfo from 'components/StoryInfo';
import { Video, Audio } from 'expo-av';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
   useAnimatedStyle,
   useSharedValue,
   withTiming,
   runOnJS,
} from 'react-native-reanimated';
import { LightenDarkenColor } from 'lighten-darken-color';
import SmartVideo from 'components/SmartImage/SmartVideo';
import Firebase from 'config/Firebase';
import firebase from 'firebase';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedView from 'components/AnimatedView';
import { Vibrate } from 'helpers/HapticsHelpers';

const Commentlike = (props) => {
   const { smashStore, teamsStore } = props;
   const { commentLike, currentUserId } = smashStore;

   const { teamUsersByTeamId } = teamsStore;

   // const users = teamUsersByTeamId?.[]
   const [comment, setComments] = useState({});
   const { id: commentId, postId } = props.comment;

   useEffect(() => {
      const unsubToStory = Firebase.firestore
         .collection('posts')
         .doc(postId)
         .collection('comments')
         .doc(commentId)
         .onSnapshot((snap) => {
            const storyDoc = snap.data();
            setComments(storyDoc);
         });

      return () => {
         if (unsubToStory) {
            unsubToStory();
         }
      };
   }, [comment?.likes, commentId]);

   const haveLiked = comment?.likes?.includes(currentUserId);
   const handleLike = () => {
      Vibrate();
      commentLike({ ...comment, postId, commentId });
   };

   return (
      <View row>
         <View row marginR-16>
            {comment?.likes?.length > 0 &&
               comment?.likes.map((uid) => {
                  const picture = comment?.avatars?.[uid] || {};
                  return (
                     <AnimatedView>
                        <SmartImage
                           uri={picture?.uri || ''}
                           preview={picture?.preview || ''}
                           style={{
                              height: 15,
                              width: 15,
                              borderRadius: 60,
                              backgroundColor: 'rgba(255,255,255,0.4)',
                           }}
                        />
                     </AnimatedView>
                  );
               })}
         </View>
         <TouchableOpacity
            onPress={handleLike}
            style={{
               marginLeft: 16,
               flexDirection: 'row',
               alignItems: 'center',
               // position: 'absolute',
               // bottom: 100,
               // right: 16,
            }}>
            {haveLiked ? (
               <AnimatedView
                  style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AntDesign name={'heart'} size={15} color={'red'} />
                  <Text
                     white
                     style={{ position: 'absolute', top: -7, right: -7 }}>
                     {comment?.like || ''}
                  </Text>
               </AnimatedView>
            ) : (
               <AnimatedView
                  style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AntDesign
                     name={'hearto'}
                     size={15}
                     color={'#fff'}
                     style={{ opacity: 0.7 }}
                  />
                  <Text white style={{ position: 'absolute' }}>
                     {comment?.like || ''}
                  </Text>
               </AnimatedView>
            )}
         </TouchableOpacity>
      </View>
   );
};

export default React.memo(
   inject(
      'smashStore',
      'challengeArenaStore',
      'teamsStore',
   )(observer(Commentlike)),
);
