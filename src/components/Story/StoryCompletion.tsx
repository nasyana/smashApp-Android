import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState, useRef } from 'react';
import {
   TouchableWithoutFeedback,
   Keyboard,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { width, height } from 'config/scaleAccordingToDevice';
import StoryBarsTop from 'components/StoryBarsTop';
import StoryInfo from 'components/StoryInfo';

import Animated, {
   useAnimatedStyle,
   useSharedValue,
   withTiming,
   runOnJS,
} from 'react-native-reanimated';
import { LightenDarkenColor } from 'lighten-darken-color';
import firebaseInstance from 'config/Firebase';
// import firebase from 'firebase';
import { LinearGradient } from 'expo-linear-gradient';
import StoryInput from 'components/StoryInput'
import StoryVerticalButtons from 'components/StoryVerticalButtons'
import StoryImage from './StoryImage';
import RecentActivitySmashes from 'components/RecentActivitySmashes';
import StoryCompletionChallenges from './StoryCompletionChallenges';
import ActivityTeamsTakeVid from './ActivityTeamsTakeVid';
import { moment } from 'helpers/generalHelpers';;
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const StoryCompletion = (props) => {

   const insets = useSafeAreaInsets();
   const { smashStore } = props;
   const {
      currentStory,
      storyIndex,
      nextStory,
      prevStory,
      levelColors,
      currentUser,
      userStoriesHash,
      subscribeToPost,
   } = smashStore;

   const leaveStory = () => {
      if (smashStore.showCommentsModal) {
         smashStore.commentsModalRef?.current?.close();
         smashStore.showCommentsModal = false;
         Keyboard.dismiss();
      } else {
         smashStore.stories = [];
         smashStore.storyIndex = 0;
         smashStore.showCommentsModal = false;

         setTimeout(() => {
            position.value = 0;
         }, 150);
      }
   };

   const storyToRender = currentStory;

   const position = useSharedValue(0);

   useEffect(() => {
      position.value = 0;
   }, []);

   useEffect(() => {
      let unsub;
      if (!smashStore.userStoriesHash?.[currentStory.id]) {
         unsub = subscribeToPost(currentStory?.id);
      }

      return () => {
         if (unsub) {
            unsub();
         }
      };
   }, [currentStory.id]);


   const sharedHiddenButtonStyle = {
      backgroundColor: 'transparent',
      position: 'absolute',
      width: width / 2,
      height: height - 65,
      top: 65,
      borderWidth: 0,
   };

   const actionLevel = currentStory?.level || 1;

   const actionColor = levelColors?.[actionLevel];

   const isFollowingMe =
      currentUser.followers &&
      currentUser.followers.includes(storyToRender.uid);

      const isMe = firebaseInstance.auth.currentUser.uid == storyToRender.uid;



   return (
      <>
  <StoryImage showImage={isFollowingMe || isMe} />
     
         {(!isFollowingMe && !isMe) && <View center style={{position: 'absolute', top: (height / 2) - 48, width: width, paddingHorizontal: width / 6}}><Text center white B18 marginB-24 style={{color: 'rgba(255,255,255,0.8)'}}>Images are hidden for people that do not follow you</Text></View>}
         
         <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={[LightenDarkenColor(actionColor, 0), actionColor]}
            style={{
               zIndex: -1,
               elevation: -1,
               backgroundColor: actionColor,
               width: width + 4,
               height: height + 4,
               position: 'absolute',
               top: 0,
               borderWidth: 0
            }}
         />

         <View
            style={{
               backgroundColor: 'rgba(0,0,0,0.4)',
               width,
               height,
               position: 'absolute',
               top: 0,
            }}
         />
         {storyToRender?.text?.length > 0 && (
            <View
               style={{
                  position: 'absolute',
                  width,
                  height,
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               <Text
                  white
                  B22
                  style={{
                     backgroundColor: 'rgba(0,0,0,0.7)',
                     padding: 8,
                     transform: [{ rotate: '-5deg' }],
                  }}>
                  {storyToRender?.text}
               </Text>
            </View>
         )}
         <View
            style={{
               width,
               height: 50,
               justifyContent: 'flex-start',
               alignItems: 'flex-start',
               position: 'absolute',
               top: insets.top,
            }}>
            <StoryBarsTop smashStore={smashStore} />
         </View>

         <View
            row
            spread
            style={{
               position: 'absolute',
               top: insets.top - 16,
               left: 0,
               width,
               height: 170,
               padding: 0,
            }}>
            <View>
               </View>

            {/* <View style={{ position: 'absolute', height, width }}></View> */}
            <TouchableOpacity
               onPress={leaveStory}
               style={{
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  padding: 32,
                  paddingRight: 16,
               }}>
               <AntDesign name={'close'} size={32} color={'#fff'} />
            </TouchableOpacity>
            <TouchableWithoutFeedback onPress={nextStory}>
               <View
                  style={{
                     ...sharedHiddenButtonStyle,
                     right: 0,
                  }}
               />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={prevStory}>
               <View
                  style={{
                     ...sharedHiddenButtonStyle,
                     left: 0,
                  }}
               />
            </TouchableWithoutFeedback>
         </View>

         <View
            paddingH-24
            paddingT-24
            marginT-16

            style={{ position: 'absolute', top: insets.top + 40 }}>
                
            {isMe && <ActivityTeamsTakeVid uid={storyToRender.uid} activity={{ id: storyToRender.activityMasterId }}  />}
            <StoryCompletionChallenges />
          
         </View>

         {storyToRender?.activityMasterId && (
            <RecentActivitySmashes
               actionId={storyToRender?.activityMasterId || false}
            />
         )}
         <View style={{ position: 'absolute', top: insets.top + 16 }}>
            
            <StoryInfo
               story={storyToRender}
               temporaryUser={userStoriesHash?.[currentStory.id]?.user || false}
               temporarySmash={userStoriesHash?.[currentStory.id]}
            />
         </View>

         {/* <StoryLike /> */}
         <StoryInput />
         <StoryVerticalButtons actionId={storyToRender?.activityMasterId} />
      </>
   );
};



export default inject(
   'smashStore',
   'challengeArenaStore',
)(observer(StoryCompletion));
