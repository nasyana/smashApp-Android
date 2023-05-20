import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors,TouchableOpacity } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';

import Routes from 'config/Routes';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;
import Box from './Box';



const ComponentTemplate = () => {

    const { navigate } = useNavigation();
    const goToAllUsers = () => navigate(Routes.AllUsers);
    const menuItems = [
        {
        name: 'Manage Habit Stacks',
        func: () => navigate(Routes.ManageHabitStacks, {manage: true}),
        icon: 'right',
        },
        {
        name: 'Create Challenge',
        func: () => navigate(Routes.CreateChallenge),
        icon: 'right',
        },
        {
        name: 'Manage Activities',
        func: () => navigate(Routes.ListActivityCategories, {manage: true}),
        icon: 'right',
        },
        {
        name: 'Teams Leaderboard',
        func: () => navigate(Routes.TeamsLeaderboard),
        icon: 'right',
        },
        {
        name: 'All Users',
        func: () => navigate(Routes.AllUsers),
        icon: 'right',
        }
        ];


    return (
        <View paddingT-16>
            <Box>
            
            {menuItems.map((item)=><TouchableOpacity style={{borderBottomWidth: 0.5, borderColor: '#eee'}} row spread padding-16 onPress={item.func}><Text R16>{item.name}</Text><AntDesign size={16} name="right" /></TouchableOpacity>)}
         
            </Box>
        </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ComponentTemplate));