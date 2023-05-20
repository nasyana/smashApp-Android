import SwipeableItem from "components/SwipeableItem/SwipeableItem";
import Tag from "components/Tag";
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Assets, Colors, View, Text, Image, SegmentedControl, SegmentedControlItemProps, ProgressBar, TouchableOpacity } from "react-native-ui-lib";
import { inject, observer } from 'mobx-react';
import Routes from '../../config/Routes';
import firebaseInstance from '../../config/Firebase';
import MyChallengeProgress from '../../modules/ChallengeArena/components/MyChallengeProgress';
import { getDaysLeft, getChallengeData } from 'helpers/playersDataHelpers';
import WeeklyDayTargets from 'components/WeeklyDayTargets';
import ChallengeDayTargets from 'components/ChallengeDayTargets';
import TodayChallengeGoal from 'components/TodayChallengeGoal';
import Box from 'components/Box';
import SectionHeader from 'components/SectionHeader';
import RecentChallengeSmashes from 'components/RecentChallengeSmashes';
import Last7DayTargets from 'components/Last7DayTargets';
import {
    daysInChallenge,
    dayNumberOfChallenge,
    challengeConsistency,
    startDateLabel,
    endDateLabel,
    daysLeftInChallenge,
} from 'helpers/dateHelpers';
import LinearChartChallenge from 'components/LinearChartChallenge';

const badgeLevels = ['beginner', 'expert', 'guru'];
const filterSegments: SegmentedControlItemProps[] = [
    { label: 'beginner' },
    { label: 'expert' },
    { label: 'guru' },
];




const ChallengeStreaks = (props) => {
    const { uid } = firebaseInstance.auth.currentUser;
    const {challengesStore } = props;
    const { streaksHash } = challengesStore;

    const streakKey = `${uid}_${playerChallenge.challengeId}`;
    const [streakDoc, setStreakDoc] = React.useState(false)
 
    useEffect(() => {
    
     const streakDoc = streaksHash[streakKey] || false;
  
     setStreakDoc(streakDoc)
    
      return () => {
     
      }
    }, [streaksHash[streakKey]])


    // const streakDoc = getStreakDocByChallengeId(challenge.id);
    // const streakKey = `${uid}_${challenge.id}`;
    // const streakDoc = streaksHash?.[streakKey] || {};
    return <Box style={{ padding: 16 }}>
        <View row spread>
            <Text secondaryContent>
                {streakDoc.onGoingStreak > 0 && '🔥'}Current Streak:{' '}
                {streakDoc.onGoingStreak || 'N/A'}{' '}
                {/* <FontAwesome5 name="fire" size={18} /> */}
            </Text>
            <Text secondaryContent>
                {streakDoc.highestStreak > 0 && '🔥'}Highest Streak:{' '}
                {streakDoc.highestStreak || 'N/A'}
            </Text>
        </View>
    </Box>;
}


export default inject(
    'smashStore',
    'challengesStore',
    'teamsStore',
)(observer(ChallengeStreaks));