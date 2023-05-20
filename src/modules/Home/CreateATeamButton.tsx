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
import Box from 'components/Box';

const CreateATeamButton = ({ smashStore, boxed, hideOnHome, teamsStore }) => {

    const { settings, currentUserId } = smashStore

    const {myTeams} = teamsStore
    const { buttonText = {} } = settings;
    const { createGroup = {} } = buttonText
    const navigation = useNavigation();

    const { navigate } = navigation;
    const goToCreateTeam = () => {

        const numberOfTeamsIAmAdminOn = myTeams.filter(team => team.uid == currentUserId).length || 0;

        // if(!isPremiumMember && willExceedQuota(numberOfTeamsIAmAdminOn,'createTeamsQuota')){
        //     showUpgradeModal(true)
   
        //     return 
        //  }


        navigate(Routes.CreateTeam);
    };



    // const { noTeamsOrChallenges } = smashStore;

    // if (hideOnHome && !noTeamsOrChallenges) { return null }


    if (boxed) {


        return (<Box style={{ marginHorizontal: 16, marginTop: 0 }}>
            <View padding-24>
                <View paddingB-16 paddingH-16>
                    <Text M18 center marginB-8>{createGroup.title || 'Create A New Team'}</Text>
                    <Text R14 center>{createGroup.description || 'Setup an accountability space for your friends or family. Create a team & invite the members to play.'} </Text>
                </View>

                <ButtonLinear
                    title={createGroup.title || "Create a Team"}
                    onPress={
                        goToCreateTeam
                        // () => smashStore.setFindChallenge(true)
                    }
                    colors={['#333', '#192840']}
                    style={{ marginTop: 0, marginHorizontal: 0 }}
                />
            </View>
        </Box>)

    }


    return (
        <ButtonLinear
            title="Create a Team"
            onPress={
                goToCreateTeam
                // () => smashStore.setFindChallenge(true)
            }
            colors={['#333', '#192840']}
            style={{ marginTop: 16 }}
        />
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(CreateATeamButton));