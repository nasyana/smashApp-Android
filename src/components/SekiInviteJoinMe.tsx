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
const ShareSekiInviteModal = ({challengesStore, smashStore}) => {

    const {libraryActivitiesHash} = smashStore;
    const {goalToShare} = challengesStore;
    const isAdmin = goalToShare?.uid == smashStore?.currentUser?.uid;
    const helping = goalToShare?.allowOthersToHelp || false
    const allowOthersToHelp = goalToShare?.allowOthersToHelp || false;
    return (
        <View marginV-24 >
         
            
        <Text white M14>{helping ? 'COME HELP US!' : 'COME JOIN ME!'} LESSSGOOO!!!</Text>
        <View row centerV>
        <Image source={Assets.icons.smashappicon} style={{width: 40, height: 40}} />
        <Text white M14 marginL-16>JOIN CODE: {goalToShare.code}</Text>
        </View>

</View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ShareSekiInviteModal));