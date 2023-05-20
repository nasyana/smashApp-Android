import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, TouchableOpacity, Text, Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import ButtonLinear from 'components/ButtonLinear'
import { checkIfIHaveVoted, howManyVotes } from 'helpers/VotingHelpers';

const NumberOfVotesForTeam = ({ teamsStore, team }) => {

    const { navigate } = useNavigation();
    const setManualTeamToVote = () => {
        teamsStore.manualTeamToVoteOn = team;
    };

    const { voteDocsHash, weeklyActivityHash, endOfCurrentWeekKey } = teamsStore;

    const weeklyActivity = weeklyActivityHash[`${team.id}_${endOfCurrentWeekKey}`] || {};
    const voteDoc = voteDocsHash?.[team.id];


    const haveIVoted = checkIfIHaveVoted(voteDoc);

    const someoneHasVoted = howManyVotes(voteDoc) > 0;

    if( !someoneHasVoted && weeklyActivity.score >= weeklyActivity.target){

        return <ButtonLinear bordered={haveIVoted} onPress={setManualTeamToVote} title={haveIVoted ? 'Team Votes 🗳️' + '(' + howManyVotes(voteDoc) + ')' : 'Vote to change weekly target 🗳️'} onPress={setManualTeamToVote} style={{ borderRadius: 10, top: -3 }} />
        return (
            <TouchableOpacity
                onPress={setManualTeamToVote}
           
        
                paddingR-16
              
                style={{ borderRadius: 10, top: -3 }}>
                <Text R14 secondaryContent style={{ color: haveIVoted ? '#777' : Colors.smashPink }}>
    
                    {haveIVoted ? 'Team Votes 🗳️' + '(' + howManyVotes(voteDoc) + ')' : 'Vote to change weekly target 🗳️'}
                </Text>
            </TouchableOpacity>
        )

    }

    if (!someoneHasVoted) return null

    return <ButtonLinear bordered={haveIVoted} onPress={setManualTeamToVote} title={haveIVoted ? 'Team Votes 🗳️' + '(' + howManyVotes(voteDoc) + ')' : 'Team Needs Your Vote! 🗳️' + '(' + howManyVotes(voteDoc) + ')'} onPress={setManualTeamToVote} style={{ borderRadius: 10, top: -3 }} />
 
    return (
        <TouchableOpacity
            onPress={setManualTeamToVote}
       
    
            paddingR-16
          
            style={{ borderRadius: 10, top: -3 }}>
            <Text R14 secondaryContent style={{ color: haveIVoted ? '#777' : Colors.smashPink }}>

                {haveIVoted ? 'Team Votes 🗳️' + '(' + howManyVotes(voteDoc) + ')' : 'Team Needs Your Vote! 🗳️' + '(' + howManyVotes(voteDoc) + ')'}
            </Text>
        </TouchableOpacity>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(NumberOfVotesForTeam));