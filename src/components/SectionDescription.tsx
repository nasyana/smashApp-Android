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
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;

const SectionDescription = ({text}) => {



    return (
        <View paddingH-24 marginB-24>
            <Text R12 secondaryContent>{text}</Text>
        </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(SectionDescription));