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
import {Vibrate} from 'helpers/HapticsHelpers'
import Routes from 'config/Routes';
import Firebase from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;

const ComponentTemplate = ({smashStore}) => {

    const {postLike,userStoriesHash,currentStory,currentUserId} = smashStore
    const storyToRender = userStoriesHash?.[currentStory.id] || false;
    const haveLiked = storyToRender?.likes?.includes(currentUserId);
const handleLike = () => {
   Vibrate();
   postLike(post);
};

    return (
        <TouchableOpacity
        onPress={handleLike}
        style={{
           alignItems: 'center',
           marginBottom: 16,
           flex: 1,
           borderWidth: 0,
           justifyContent: 'center',
        }}>
        {haveLiked ? (
           <AnimatedView style={{ flexDirection: 'row' }}>
              <AntDesign name={'rocket1'} size={35} color={'red'} />
              <AnimatedView>
                 <Text white>{likesCount || ' '}</Text>
              </AnimatedView>
           </AnimatedView>
        ) : (
           <AnimatedView style={{ flexDirection: 'row' }}>
                 <AntDesign name={'rocket1'} size={35} color={'white'} />
              <AnimatedView>
                 <Text white>{likesCount || ' '}</Text>
              </AnimatedView>
           </AnimatedView>
        )}
     </TouchableOpacity>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ComponentTemplate));