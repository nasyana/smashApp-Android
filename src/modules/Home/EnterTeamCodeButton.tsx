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
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';

import Routes from 'config/Routes';
import Firebase from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;
import Box from 'components/Box';
import ButtonLinearWithIcon from 'components/ButtonLinearWithIcon';

const EnterTeamCodeButton = ({ smashStore, teamsStore, boxed = false, hideOnHome = false, top = 16 }) => {

    const { numTeamTargetsToday } = teamsStore;
    const { settings } = smashStore

    const { buttonText = {} } = settings;
    const { enterTeamCode = {} } = buttonText
    const navigation = useNavigation();

    const { navigate } = navigation;
    const goToTeamCodeScreen = () => {
        navigate(Routes.TeamCodeScreen);
    };

    const { noTeamsOrChallenges } = smashStore;

    if (numTeamTargetsToday > 0 && hideOnHome) { return null }

    if (boxed) {


        return (<Box style={{ marginHorizontal: 16, marginTop: top }}>
            <View padding-24>
                <View paddingB-16 paddingH-16>
                    <Text M18 center marginB-8>{enterTeamCode.title || 'Enter Team Code'}</Text>
                    <Text R14 center>{enterTeamCode.description || 'If you have been invited by a friend, you can enter your team code here.'}</Text>
                </View>
                <ButtonLinearWithIcon
                    title={'Enter Team Code'}
                    bordered
                    icon={<FontAwesome name="send" color={'white'} size={20} />}
                    color={Colors.teamToday}
                    onPress={goToTeamCodeScreen}
                    colors={[Colors.teamToday, Colors.teamToday]}
                    style={{ marginTop: 0, marginHorizontal: 0 }}
                />
            </View>
        </Box>)
    }


    return (
        <ButtonLinear
            title={'Enter Team Code'}
            bordered
            color={Colors.teamToday}
            onPress={goToTeamCodeScreen}
            colors={[Colors.teamToday, Colors.teamToday]}
            style={{ marginTop: 16 }}
        />
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(EnterTeamCodeButton));