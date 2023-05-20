import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign, Feather } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';

import Routes from 'config/Routes';
import Firebase from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';
import SectionHeader from 'components/SectionHeader'
const FeedHeader = ({smashStore}) => {
    const { loadingFeed,setLoadingFeed,checkForNewEntriesInFeed} = smashStore;

    const checkForNewPosts = () => {

        setLoadingFeed(true);
        checkForNewEntriesInFeed()
        setTimeout(() => {
           setLoadingFeed(false)
        },2500);
  
     }
  return (
<SectionHeader
               title={'Activity Feed'}
               style={{ marginTop: 24 }}
               // onPress={()=>setExpanded(!expanded)}
            subtitle={<TouchableOpacity onPress={checkForNewPosts}>{loadingFeed ? <ActivityIndicator /> : <Feather size={20} name='refresh-cw' color={Colors.secondaryContent} />}</TouchableOpacity>}
            />
  )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(FeedHeader));