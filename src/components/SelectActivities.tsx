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
import { moment } from 'helpers/generalHelpers';import LibraryActivity from 'modules/CreateChallenge/components/LibraryActivity';
;

const SelectGoalActivity = ({smashStore,actionsStore, challengesStore}) => {
const {libraryActionsList} = smashStore
const { selectedActions = [] } = actionsStore;
const _selectedActions = [...selectedActions];
/// filter the activities are in libraryActionsList that have activity.useInSingleGoal === true

const list = libraryActionsList.filter(activity => activity.useInSingleGoals === true)

const handleSelectAction = (action) => {
    const index = _selectedActions.findIndex(
       (item) => item.id === action.id,
    );
    if (index > -1) actionsStore.removeAction(index);
    else actionsStore.pushAction(action);
 };

const onPress = (activity) => {
    // handleSelectAction(activity)

    console.log('activity',activity)
    actionsStore.setSelectedActions([activity]);
    // smashStore.commentsModalRef.current?.close();
    // smashStore.quickViewTeam = false;

}

    return (
        <View>
            {list?.map((activity)=><LibraryActivity forGoal onPress={onPress} item={activity} />)}
        </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore','actionsStore')(observer(SelectGoalActivity));