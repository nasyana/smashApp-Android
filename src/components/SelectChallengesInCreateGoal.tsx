import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
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
import { moment } from 'helpers/generalHelpers';
import ChallengeForGoal from 'modules/CreateChallenge/components/ChallengeForGoal';
;

const SelectGoalActivity = ({smashStore,actionsStore, challengesStore, goal, dismiss}) => {
    
    const {challengesArray} = challengesStore;
const {libraryActionsList, libraryActivitiesHash} = smashStore
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

const onPress = (challenge) => {
    // handleSelectAction(activity)
    // alert(JSON.stringify(challenge?.masterIds))

// return
        const activitiesToSet = (challenge?.masterIds || []).map((activityId)=> libraryActivitiesHash?.[activityId] )

        challengesStore.setChallengeGoalIsBasedOn(challenge);
        // alert(JSON.stringify(challenge))
        // alert(JSON.stringify(activitiesToSet))
        actionsStore.setSelectedActions(activitiesToSet);
    
        // alert("as")
        dismiss()
    // const list = libraryActionsList.filter(activity => activity.useInSingleGoals === true)


    // console.log('activity',activity)

    // smashStore.commentsModalRef.current?.close();
    // smashStore.quickViewTeam = false;

}

const [loading, setLoading] = useState(true);

useEffect(() => {
   
setTimeout(() => {
    setLoading(false)
}, 500);
  return () => {
    
  }
}, [])


const targetTypeIndex = goal.targetTypeIndex || 0;

const targetType = targetTypeIndex == 0 ? 'qty' : 'points';

if(loading){

    return <View center flex paddingV-24><ActivityIndicator /></View>
}

    return (
        <View style={{backgroundColor: Colors.background}}>
            {challengesArray?.filter((challenge)=> challenge.targetType == targetType)?.map((challenge)=>{
            
            if(challenge.dailyTargets){
            
            return <ChallengeForGoal forGoal onPress={onPress} item={challenge} />
            }else{

                return null
            }
            })}
        </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore','actionsStore')(observer(SelectGoalActivity));