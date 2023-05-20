import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors, Modal, Assets } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';

import Routes from 'config/Routes';

import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';
const ShareSekiInviteModal = ({challengesStore,smashStore}) => {

    const {goalToShare = false, challengesHash = {}} = challengesStore;
    const activities = Object?.values(goalToShare?.actions)?.map((entry)=> entry);
const goalLabel = activities?.length == 1 ? activities?.[0]?.text?.toUpperCase() : '';
const isAdmin = goalToShare?.uid == smashStore?.currentUser?.uid;
const helping = goalToShare?.allowOthersToHelp && !isAdmin || false
const myselfLabel = goalToShare?.allowOthersToHelp ? 'A TEAM' : 'MYSELF A';
const goalContext = 'xx(' + challengesHash?.[goalToShare?.challengeId]?.name?.toUpperCase() + '🚀🚀)' || goalToShare?.allowOthersToHelp ? '' : challengesHash?.[goalToShare?.challengeId]?.name?.toUpperCase() + ' ';
    return (
        <View marginB-0 style={{backgroundColor: "rgba(0,0,0,0)" || '#1C1C1C', padding: 8, paddingHorizontal: 16}}>
         
                
        <Text smashPink center B14>{helping ? `I JOINED` : `I'VE SET`} {myselfLabel} {challengesHash?.[goalToShare?.challengeId]?.name?.toUpperCase()} GOAL TO REACH</Text>
        {/* <Text white R14 center>{challengesHash?.[goalToShare?.challengeId]?.name?.toUpperCase()}🚀🚀</Text> */}

</View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ShareSekiInviteModal));