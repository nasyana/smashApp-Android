import { View, Text } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import {
   PanResponder
} from 'react-native';
import { Modal } from 'react-native';
// import { width, height } from 'config/scaleAccordingToDevice';

import { Dimensions } from 'react-native';
const { height } = Dimensions.get('window');
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { useAnimatedGestureHandler, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
   useSharedValue,
   withTiming,
   runOnJS,
} from 'react-native-reanimated';

import StoryCompletion from './StoryCompletion';
import StoryCommentsModal from './CommentsModal/StoryCommentsModal';
import CommentsModal from './CommentsModal';



const screenHeight = height;
const StoryCompletionModal = (props) => {


   const { smashStore } = props;
   const { nextStory, stories, showStoryModal, setCoolComment } = smashStore;

   // const leaveStory = () => {
   //    setCoolComment('');
   //    if (smashStore.showCommentsModal) {
   //       smashStore.showCommentsModal = false;
   //    } else {
   //       smashStore.stories = [];
   //       smashStore.storyIndex = 0;
   //       // smashStore.currentStory = false;
   //       smashStore.showCommentsModal = false;
   //       smashStore.loadingUserStories = false;

   //       setTimeout(() => {
   //          position.value = 0;
   //       }, 150);
   //    }
   // };

   const leaveStory = () => {
      setCoolComment('');
      if (smashStore.showCommentsModal) {
        smashStore.showCommentsModal = false;
      } else {
        smashStore.stories = [];
        smashStore.storyIndex = 0;
        smashStore.showCommentsModal = false;
        smashStore.loadingUserStories = false;
    
        translateY.value = withTiming(0, { duration: 150 }, () => {
          position.value = 0;
        });
      }
    };
    

   const position = useSharedValue(0);

   useEffect(() => {
      position.value = 0;
    }, [stories.length]);


   const translateY = useSharedValue(0);

   const panGestureHandler = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
        ctx.startY = translateY.value;
      },
      onActive: (event, ctx) => {
        translateY.value = ctx.startY + event.translationY;
      },
      onEnd: (event) => {
        if (Math.abs(event.translationY) > Math.abs(event.translationX) && translateY.value > 150) {
          translateY.value = withTiming(height, { duration: 100 }, () => {
            runOnJS(leaveStory)();
          });
        } else {
          translateY.value = withTiming(0, { duration: 100 });
        }
      },
    });
    

const animatedStyle = useAnimatedStyle(() => {
  return {
    transform: [
      {
        translateY: translateY.value,
      },
    ],
  };
});

   const panGesture = Gesture.Pan()
      .onUpdate((e) => {
         if (position.value < 0) {
            position.value = 0;
         } else {
            position.value = e.translationY;
         }

         // runOnJS(warn)();

         // if (position.value > 250) {
         //    position.value = 0;
         // }
      })
      .onEnd((e) => {
         if (position.value > 30) {
            position.value = withTiming(height, { duration: 100 });

            runOnJS(leaveStory)();
         } else {
            position.value = withTiming(0, { duration: 100 });
            // runOnJS(leaveStory)();
         }
         // runOnJS(warnEnd)();
      })
      .onFinalize((e) => (position.value = e.translationY));

   const translateValue = useRef(new Animated.Value(0)).current;

   const touchThreshold = 20;

   const panResponder = useRef(
      PanResponder.create({
         onStartShouldSetPanResponder: () => false,
         onMoveShouldSetPanResponder: (e, gestureState) => {
            const { dx, dy } = gestureState;

            return (
               Math.abs(dx) > touchThreshold || Math.abs(dy) > touchThreshold
            );
         },
         onPanResponderMove: (event, gestureState) => {
            // this.state.translateValue.setValue();
            translateValue.setValue(Math.max(0, 0 + gestureState.dy));
         },
         onPanResponderRelease: (e, gesture) => {
            const shouldOpen = gesture.vy <= 0;
            Animated.timing(translateValue, {
               toValue: shouldOpen ? 0 : screenHeight,

               duration: 100,

               easing: Easing.inOut(Easing.ease),
            }).start(() => {
               if (!shouldOpen) {
                  // this.setState({ text: '' });
                  // if (this.timeout) { clearTimeout(this.timeout) }
                  // this.timeout = setTimeout(function () { leaveStory() }, 200);
                  leaveStory();
               }
            });
         },
      }),
   );

   return (
      <>
        <Modal
      visible={smashStore.stories?.length > 0 ? true : false}
      transparent={true}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={() => {
        smashStore.setCommentPost(false);
        smashStore.showCommentsModal = false;
      }}>
      <PanGestureHandler onGestureEvent={panGestureHandler}>
        <Animated.View
          style={[{ flex: 1 }, animatedStyle]}
          onPress={nextStory}>
          <StoryCompletion />
        </Animated.View>
      </PanGestureHandler>
      <StoryCommentsModal key="story" />
      <CommentsModal smashStore={smashStore} storyComments/>
    </Modal>
      </>
   );
};

export default inject(
   'smashStore',
   'challengeArenaStore',
)(observer(StoryCompletionModal));
