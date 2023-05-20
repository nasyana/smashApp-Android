import { View, Text } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState, useRef } from 'react';
import {
   TouchableOpacity,
   TouchableWithoutFeedback,
   PanResponder,
} from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
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
} from 'react-native-reanimated';

import SmartVideo from 'components/SmartImage/SmartVideo';
import Firebase from 'config/Firebase';
import firebase from 'firebase';

const screenHeight = height;
const StoryCompletion = (props) => {
   const { smashStore } = props;
   const {
      currentStory,
      storyIndex,
      nextStory,
      prevStory,
      loadingUserStories,
      stories,
      currentUser,
      completionsHash,
   } = smashStore;

   const [story, setStory] = useState(false);

   const onClearText = () => {
      smashStore.currentStory = false;
      smashStore.loadingUserStories = false;
      setStory(false);
   };

   const storyToRender = story || currentStory;

   const position = useSharedValue(0);

   useEffect(() => {
      position.value = 0;
   }, []);

   const panGesture = Gesture.Pan()
      .onUpdate((e) => {
         position.value = e.translationY;
      })
      .onEnd((e) => {
         if (position.value > 200) {
            position.value = withTiming(height, { duration: 100 });
         } else {
            position.value = withTiming(0, { duration: 100 });
         }
      });

   const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: position.value, scale: inter }],
   }));

   const sharedHiddenButtonStyle = {
      backgroundColor: 'transparent',
      position: 'absolute',
      width: width / 3,
      height: height / 1.5,
      top: height / 2.5,
   };

   const likeOrRemoveLike = () => {
      let docRef = Firebase.firestore.collection('posts').doc(storyToRender.id);

      const idNotAlreadyInArray = storyToRender?.peopleWhoHaveLiked?.findIndex(
         (user) => user.id == currentUser.id,
      );

      if (idNotAlreadyInArray > -1) {
         docRef.set(
            {
               likes: firebase.firestore.FieldValue.increment(-1),
               peopleWhoHaveLiked: storyToRender?.peopleWhoHaveLiked?.filter(
                  (user) => user.id !== currentUser.id,
               ),
            },
            { merge: true },
         );
      } else {
         docRef.set(
            {
               likes: firebase.firestore.FieldValue.increment(1),
               peopleWhoHaveLiked: firebase.firestore.FieldValue.arrayUnion({
                  id: currentUser.id,
                  name: currentUser.name,
                  picture: currentUser?.picture,
               }),
            },
            { merge: true },
         );
      }
   };

   // const [translateValue, setTranslateValue] = useState(0);

   const translateValue = useRef(new Animated.Value(0)).current;
   const haveLiked =
      storyToRender?.peopleWhoHaveLiked?.findIndex(
         (user) => user.id == currentUser.id,
      ) > -1;

   const touchThreshold = 20;

   const leaveStory = () => {
      smashStore.stories = false;
      smashStore.storyIndex = 0;
      smashStore.currentStory = false;
   };
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
         <Modal visible={stories && storyToRender ? true : false}>
            <GestureDetector gesture={panGesture}>
               <Animated.View
                  style={[{ flex: 1 }, animatedStyle]}
                  {...panResponder.panHandlers}
                  onPress={nextStory}
                  // style={{ flex: 1, transform: [{ translateY: translateValue }] }}
               >
                  {(storyToRender?.picture?.uri || currentStory.id) && (
                     <SmartImage
                        uri={
                           storyToRender?.picture?.uri ||
                           completionsHash?.[currentStory.id]?.picture?.uri
                        }
                        preview={storyToRender.picture?.preview}
                        style={{ width, height, position: 'absolute' }}
                     />
                  )}

                  {storyToRender?.video && (
                     <SmartVideo
                        // source={{
                        //    uri: storyToRender?.video || '',
                        // }}
                        uri={storyToRender.video}
                        key={storyToRender.video}
                        isBackground
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="cover"
                        shouldPlay={true}
                        isLooping
                        useNativeControls={false}
                        style={{
                           position: 'absolute',
                           width,
                           height,
                        }}
                     />
                  )}

                  <View
                     style={{
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        width,
                        height,
                        position: 'absolute',
                        top: 0,
                     }}
                  />
                  <View
                     style={{
                        // backgroundColor: 'rgba(0,0,0,0.2)',
                        width,
                        height: 50,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        position: 'absolute',
                        top: 40,
                     }}>
                     <StoryBarsTop smashStore={smashStore} />
                     <StoryInfo
                        story={storyToRender}
                        temporaryUser={
                           completionsHash?.[currentStory.id]?.user || false
                        }
                        temporarySmash={completionsHash?.[currentStory.id]}
                     />
                  </View>
                  <View
                     row
                     spread
                     style={{
                        position: 'absolute',
                        top: 20,
                        left: 0,
                        width,
                        height: 170,
                        padding: 0,
                     }}>
                     <View></View>

                     <View
                        style={{ position: 'absolute', height, width }}></View>
                     <TouchableOpacity
                        onPress={onClearText}
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

                  <TouchableOpacity
                     // onPress={likeOrRemoveLike}
                     style={{
                        position: 'absolute',
                        bottom: height / 4,
                        right: 16,
                     }}>
                     <FontAwesome name="commenting" size={35} color={'#fff'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={likeOrRemoveLike}
                     style={{
                        position: 'absolute',
                        bottom: height / 4 - 70,
                        right: 16,
                     }}>
                     <AntDesign
                        name="heart"
                        size={35}
                        color={haveLiked ? 'red' : '#fff'}
                     />
                  </TouchableOpacity>
               </Animated.View>
            </GestureDetector>
         </Modal>
      </>
   );
};

export default inject(
   'smashStore',
   'challengeArenaStore',
)(observer(StoryCompletion));
