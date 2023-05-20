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
import AnimatedView from './AnimatedView';

const Benefits = ({ activity, single, color, bordered = false }) => {


    const benefits = activity?.benefits || [];
    const benefit = benefits[Math.floor(Math.random() * benefits.length)];


    if (benefit.length == 0) { return null }
    return (
        <AnimatedView >
            <View >
                <View style={{ borderWidth: bordered ? 1 : 0, borderColor: 'rgba(255,255,255,0.5)', borderRadius: 20, padding: 8 }}><Text center white R14 style={{ color, maxWidth: width - (width / 3) }}>{benefit}</Text></View>
            </View>
        </AnimatedView>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(Benefits));