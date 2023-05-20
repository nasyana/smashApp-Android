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
import SectionHeader from 'components/SectionHeader';
import Routes from 'config/Routes';
import Firebase from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;
import Box from 'components/Box';

const MvpInLeaderBoard = ({mvp}) => {

    const { navigate } = useNavigation();

    return (
        <>        
        <SectionHeader title="Team MVP" top={24} />
        {mvp && <View>
            <Box style={{padding: 24}}>
       <Text>🥇MVP: {mvp.name}</Text>
       </Box>
        </View>}
        </>

    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(MvpInLeaderBoard));