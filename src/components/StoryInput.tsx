import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';

import Routes from 'config/Routes';
import Firebase from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;

const StoryInput = ({smashStore}) => {

    const {currentStory,userStoriesHash} = smashStore;

    const storyToRender = userStoriesHash?.[currentStory.id] || false;
  return (
    <View
    row
    spread
    flex
    style={{ position: 'absolute', bottom: 30, width: width - 32, left: 16 }}>
    <TouchableOpacity
       onPress={() => (smashStore.commentPost = {...currentStory, isStoryPost: true})}
       style={{
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.7)',
          flex: 6,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 16,
          borderRadius: 70,
          height: 40,
       }}>
       <Text R14 white>
          {storyToRender?.commentCount > 0
             ? `Comments (${storyToRender?.commentCount})`
             : 'Write A Comment'}
       </Text>
    </TouchableOpacity>
  
 </View>
  )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(StoryInput));