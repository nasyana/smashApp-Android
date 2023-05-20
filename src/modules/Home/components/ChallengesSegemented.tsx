import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors, SegmentedControlItemProps, SegmentedControl } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';

import Routes from 'config/Routes';
import Firebase from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;
const filterSegments: SegmentedControlItemProps[] = [
    { label: 'TODAY' },
    { label: 'LAST 7' },
];
const ChallengesSegemented = ({ smashStore, challengesStore }) => {

    const { numChallenges } = challengesStore;

    const [loaded, setLoaded] = useState(true)

    const { challengesView = 'today', setChallengesView } = smashStore;
    const [filterSegmentIndex, setfilterSegmentIndex] = useState(0);
    const { navigate } = useNavigation();
    const onChangeLevel = (index) => {
        setfilterSegmentIndex(index);
        if (index === 0) {

            setChallengesView('today')
        }
        if (index === 1) {


            setChallengesView('last7')
        }
    };

    // useEffect(() => {

    //     const timout = setTimeout(() => {

    //         setLoaded(true)

    //     }, 1500)


    //     return () => {

    //     }
    // }, [])


    if (numChallenges == 0 || !loaded) { return null }
    return (

        <SegmentedControl
            style={{ color: '#fff', padding: 8 }}
            activeColor={'#fff'}
            iconOnRight={true}
            textColor={'#fff'}
            containerStyle={{ paddingHorizontal: 32, paddingTop: 24 }}
            outlineWidth={0}
            outlineColor={'#333'}
            activeBackgroundColor={
                Colors.smashPink || '#333'
            }
            backgroundColor={'#fff'}
            initialIndex={0}
            segments={filterSegments}
            onChangeIndex={onChangeLevel}
        />

    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ChallengesSegemented));