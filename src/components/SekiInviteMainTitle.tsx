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
const {goalToShare = false} = challengesStore;
  const {kFormatter, numberWithCommas} = smashStore;  

  const targetTypeLabel = goalToShare?.targetType == 'points' ? 'Points' : goalToShare?.unit;

  const activities = Object?.values(goalToShare?.actions)?.map((entry)=> entry);
  const goalLabel = activities?.length == 1 ? activities?.[0]?.text : 'Points';


    return (
        <View>
            <Text white B28 center style={{fontSize: 45, lineHeight: 50, paddingTop: 16}}>{numberWithCommas(goalToShare?.target)} {targetTypeLabel} In {goalToShare.endDuration} Days!</Text>
</View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ShareSekiInviteModal));