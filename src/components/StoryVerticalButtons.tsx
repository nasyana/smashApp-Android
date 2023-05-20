import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors,TouchableOpacity } from 'react-native-ui-lib';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';
import StoryLike from 'components/StoryLike';


const StoryVerticalButtons = ({smashStore, actionId}) => {
const {currentUser} = smashStore;

const [on, setOn] = useState(false);

useEffect(() => {
    stopPressingActivity()

  return () => {
    
  }
}, [actionId])


const pressInActivity = () => {

    setOn(true)
    smashStore.setShowActivityInStory(true)

}

const stopPressingActivity = () => {
    setOn(false)
    smashStore.setShowActivityInStory(false)
}

// if(!currentUser?.following || currentUser?.following?.length === 0) {

//     return null

// }
    return (
        <View style={{position: 'absolute', right: 8, bottom: ( height / 8 )}}>
           <TouchableOpacity onPress={on ? stopPressingActivity : pressInActivity}  style={{backgroundColor: 'transparent', borderRadius: 40, padding: 10}}><MaterialIcons name="grading" size={35} style={{color: on ? 'red' : '#fff'}} /></TouchableOpacity>
            <View style={{height: 8}}/>
        <StoryLike />
        </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(StoryVerticalButtons));