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
const StoryCommentIcon = (props) => {
   const { smashStore } = props;
   const { currentStory } = smashStore;
   return (
      <TouchableOpacity
         onPress={() => (smashStore.showCommentsModal = true)}
         style={{
            position: 'absolute',
            bottom: height / 4 - 60,
            right: 16,
            alignItems: 'center',
         }}>
         <AntDesign
            name={'wechat'}
            size={35}
            color={'#fff'}
            style={{ opacity: 0.7 }}
         />
         <Text>{currentStory?.commentCount}</Text>
      </TouchableOpacity>
   );
};

export default React.memo(
   inject('smashStore', 'challengeArenaStore')(observer(StoryCommentIcon)),
);
