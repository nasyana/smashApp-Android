import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import {
   TouchableWithoutFeedback,
   Keyboard,
   Pressable,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { width, height } from 'config/scaleAccordingToDevice';
import StoryBarsTop from 'components/StoryBarsTop';
import StoryInfo from 'components/StoryInfo';

import {
   useSharedValue
} from 'react-native-reanimated';
import { LightenDarkenColor } from 'lighten-darken-color';
import firebaseInstance from 'config/Firebase';
import { LinearGradient } from 'expo-linear-gradient';
import StoryInput from 'components/StoryInput';
import StoryVerticalButtons from 'components/StoryVerticalButtons';
import StoryImage from './StoryImage';
import RecentActivitySmashes from 'components/RecentActivitySmashes';
import StoryCompletionChallenges from './StoryCompletionChallenges';
import ActivityTeamsTakeVid from './ActivityTeamsTakeVid';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
;

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

const storyToRender = currentStory

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

   const prevStoryRef = useRef(storyToRender);
   useEffect(() => {

      if(!storyToRender) return;
      if (prevStoryRef.current && prevStoryRef.current !== storyToRender &&   prevStoryRef.current != undefined) {
         
         prevStoryRef.current = storyToRender;

      }

      return () => {  }
    
   }, [storyToRender]);

   const position = useSharedValue(0);

   // useEffect(() => {
   //    position.value = 0;
   // }, []);

   useEffect(() => {

      if(!currentStory){return}
      let unsub;
      if (!smashStore.userStoriesHash?.[currentStory.id] && currentStory.id) {
         unsub = subscribeToPost(currentStory?.id);
      }

      return () => {
  
      };
   }, [currentStory?.id]);

   const startTime = useRef(0);

   const onPressInNext = () => {
      startTime.current = new Date().getTime();
    };
    
    const onPressOutNext = () => {
      const endTime = new Date().getTime();
      const elapsedTime = endTime - startTime.current;
    
      if (elapsedTime < 150) { // Adjust this value based on your requirements
        // Call nextStory or prevStory here
        nextStory();
      }
    };


   const onPressInPrev = () => {
     startTime.current = new Date().getTime();
   };
   
   const onPressOutPrev = () => {
     const endTime = new Date().getTime();
     const elapsedTime = endTime - startTime.current;
   
     if (elapsedTime < 150) { // Adjust this value based on your requirements
       // Call nextStory or prevStory here
       prevStory();
     }
   };
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


   const finalStoryToRender = storyToRender || currentStory || prevStoryRef.current;
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
         {finalStoryToRender?.text?.length > 0 && (
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
                  {finalStoryToRender?.text}
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
            <TouchableWithoutFeedback onPressIn={onPressInNext} onPressOut={onPressOutNext}>
               <View
                  style={{
                     ...sharedHiddenButtonStyle,
                     right: 0,
                  }}
               />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPressIn={onPressInPrev} onPressOut={onPressOutPrev}>
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
                
            {isMe && finalStoryToRender.uid && <ActivityTeamsTakeVid uid={finalStoryToRender.uid} activity={{ id: finalStoryToRender.activityMasterId }}  />}
            <StoryCompletionChallenges />
          
         </View>

         {finalStoryToRender?.activityMasterId && (
            <RecentActivitySmashes
               actionId={finalStoryToRender?.activityMasterId || false}
            />
         )}
         <View style={{ position: 'absolute', top: insets.top + 16 }}>
            
            <StoryInfo
               story={finalStoryToRender}
               temporaryUser={userStoriesHash?.[currentStory.id]?.user || false}
               temporarySmash={userStoriesHash?.[currentStory.id]}
            />
         </View>
            
         {/* <StoryLike /> */}
         <StoryInput />
         <StoryVerticalButtons actionId={currentStory?.activityMasterId} />
      </>
   );
};



export default inject(
   'smashStore',
   'challengeArenaStore',
)(observer(StoryCompletion));
