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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setBadgeCountAsync } from 'expo-notifications';
import { kFormatter } from 'helpers/generalHelpers';

const TeamTabNumber = ({ smashStore, teamsStore }) => {

    const { allTeamsTodayScore } = teamsStore;
    const { userStoriesCount } = smashStore;
    if (allTeamsTodayScore == 0 && allTeamsTodayScore == '0') return null
    return (
        <View center style={{ position: 'absolute', top: 4, right: 10, backgroundColor: Colors.meToday, height: 25, width: 25, borderRadius: 20 }}>
            <Text B12 white>{kFormatter(allTeamsTodayScore)}</Text>
        </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(TeamTabNumber));