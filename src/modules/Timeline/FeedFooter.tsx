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
const FeedFooter = ({smashStore}) => {
    const { loadingFeed,setLoadingFeed,checkForNewEntriesInFeed,feed} = smashStore;


    const handleShowMore = async () => {
        setLoadingFeed(true);
        await smashStore.loadFeed();
        setTimeout(() => {
           setLoadingFeed(false)
        }, 500);
     };

     
    const checkForNewPosts = () => {

        setLoadingFeed(true);
        checkForNewEntriesInFeed()
        setTimeout(() => {
           setLoadingFeed(false)
        },2500);
  
     }
     if(feed?.length == 0){return null}

     if(loadingFeed){
        return (<View paddingV-16><ActivityIndicator /></View>)
     }
  return (
<ButtonLinear title="Load More" onPress={handleShowMore} top={16} style={{marginTop: 16}} />
  )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(FeedFooter));